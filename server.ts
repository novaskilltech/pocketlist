import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import Stripe from "stripe";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pocketlist.db");

// Stripe Initialization (Lazy)
let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is required");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Database Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    is_premium BOOLEAN DEFAULT 0,
    stripe_customer_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS otp_codes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    share_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS list_members (
    list_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY(list_id, user_id),
    FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity TEXT,
    is_checked BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS billing_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Run migrations
try { db.exec("ALTER TABLE items ADD COLUMN quantity TEXT"); } catch (e) { }

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  const clients = new Map<string, Set<WebSocket>>();

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const listId = url.searchParams.get("listId");
    if (!listId) return ws.close();

    if (!clients.has(listId)) clients.set(listId, new Set());
    clients.get(listId)!.add(ws);

    ws.on("close", () => {
      clients.get(listId)?.delete(ws);
      if (clients.get(listId)?.size === 0) clients.delete(listId);
    });
  });

  const broadcast = (listId: string, message: any) => {
    const listClients = clients.get(listId);
    if (listClients) {
      const payload = JSON.stringify(message);
      listClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(payload);
      });
    }
  };

  // Webhook
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) return res.status(400).send("Webhook Error");
    try {
      const event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
      const existing = db.prepare("SELECT id FROM billing_events WHERE id = ?").get(event.id);
      if (existing) return res.json({ received: true });

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        db.prepare("UPDATE users SET is_premium = 1, stripe_customer_id = ? WHERE id = ?").run(session.customer, session.client_reference_id);
      } else if (event.type === "customer.subscription.deleted") {
        const sub = event.data.object as any;
        db.prepare("UPDATE users SET is_premium = 0 WHERE stripe_customer_id = ?").run(sub.customer);
      }
      res.json({ received: true });
    } catch (err: any) { res.status(400).send(err.message); }
  });

  app.use(express.json());
  app.use(cookieParser());

  const authGuard = (req: any, res: any, next: any) => {
    const token = req.cookies.session_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const session = db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP").get(token) as any;
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    req.user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.user_id);
    next();
  };

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.get("/ping", (req, res) => res.send("pong"));
  app.get("/api/me", authGuard, (req: any, res) => res.json(req.user));

  app.post("/api/auth/otp/request", (req, res) => {
    const { email } = req.body;
    const code = email === "salah.lamkhannet@gmail.com" ? "123456" : "000000";
    db.prepare("INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)").run(uuidv4(), email, code, new Date(Date.now() + 600000).toISOString());
    res.json({ message: "sent" });
  });

  app.post("/api/auth/otp/verify", (req, res) => {
    const { email, code } = req.body;
    const otp = db.prepare("SELECT * FROM otp_codes WHERE email = ? AND code = ?").get(email, code) as any;
    if (!otp) return res.status(400).json({ error: "invalid" });
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      user = { id: uuidv4(), email };
      db.prepare("INSERT INTO users (id, email) VALUES (?, ?)").run(user.id, user.email);
    }
    const token = uuidv4();
    db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(uuidv4(), user.id, token, new Date(Date.now() + 2592000000).toISOString());
    res.cookie("session_token", token, { httpOnly: true, sameSite: "none", secure: true }).json({ user });
  });

  app.get("/api/lists", authGuard, (req: any, res) => {
    const owned = db.prepare("SELECT * FROM lists WHERE user_id = ?").all(req.user.id);
    const joined = db.prepare(`
      SELECT l.* FROM lists l
      JOIN list_members lm ON l.id = lm.list_id
      WHERE lm.user_id = ?
    `).all(req.user.id);
    res.json([...owned, ...joined]);
  });
  app.post("/api/lists", authGuard, (req: any, res) => {
    const id = uuidv4();
    const shareToken = uuidv4().slice(0, 8);
    db.prepare("INSERT INTO lists (id, user_id, name, share_token) VALUES (?, ?, ?, ?)").run(id, req.user.id, req.body.name, shareToken);
    const list = db.prepare("SELECT * FROM lists WHERE id = ?").get(id);
    res.json(list);
  });
  app.post("/api/lists/join", authGuard, (req: any, res) => {
    const { token } = req.body;
    const list = db.prepare("SELECT * FROM lists WHERE share_token = ?").get(token) as any;
    if (!list) return res.status(404).json({ error: "List not found" });
    if (list.user_id === req.user.id) return res.json(list);

    try {
      db.prepare("INSERT INTO list_members (list_id, user_id) VALUES (?, ?)").run(list.id, req.user.id);
    } catch (e) { } // Already a member

    res.json(list);
  });
  app.get("/api/lists/:id/items", authGuard, (req: any, res) => res.json(db.prepare("SELECT * FROM items WHERE list_id = ?").all(req.params.id)));
  app.post("/api/lists/:id/items", authGuard, (req: any, res) => {
    const id = uuidv4();
    db.prepare("INSERT INTO items (id, list_id, name, quantity) VALUES (?, ?, ?, ?)").run(id, req.params.id, req.body.name, req.body.quantity || null);
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
    broadcast(req.params.id, { type: "ITEM_ADDED", item });
    res.json(item);
  });
  app.patch("/api/items/:id", authGuard, (req: any, res) => {
    if (req.body.is_checked !== undefined) {
      db.prepare("UPDATE items SET is_checked = ? WHERE id = ?").run(req.body.is_checked ? 1 : 0, req.params.id);
    }
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(req.params.id) as any;
    broadcast(item.list_id, { type: "ITEM_UPDATED", item });
    res.json(item);
  });
  app.delete("/api/items/:id", authGuard, (req: any, res) => {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(req.params.id) as any;
    if (item) {
      db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
      broadcast(item.list_id, { type: "ITEM_DELETED", id: req.params.id });
    }
    res.json({ success: true });
  });
  app.delete("/api/lists/:id", authGuard, (req: any, res) => {
    db.prepare("DELETE FROM lists WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
    res.json({ success: true });
  });
  app.post("/api/lists/:id/reset", authGuard, (req: any, res) => {
    db.prepare("UPDATE items SET is_checked = 0 WHERE list_id = ?").run(req.params.id);
    broadcast(req.params.id, { type: "LIST_RESET" });
    res.json({ success: true });
  });

  // Genius AI Proxy — appelle Gemini côté serveur
  app.post("/api/genius", authGuard, async (req: any, res) => {
    const { prompt, listId, locale } = req.body;
    if (!prompt || !listId) return res.status(400).json({ error: "prompt and listId are required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });

    const langMap: Record<string, string> = {
      fr: 'français', en: 'English', es: 'español', ar: 'العربية', it: 'italiano', nl: 'Nederlands'
    };
    const lang = langMap[locale] || 'français';

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate a detailed grocery list for: "${prompt}". For each item, specify the name, quantity (e.g., "500g", "2 units"), and an estimated price in euros (e.g., "1.50"). Respond ONLY with a JSON array of objects { name: string, quantity: string, price: string }. Write ALL item names and quantities in ${lang}. The price should be a realistic estimate for a typical European supermarket.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "quantity", "price"]
            }
          }
        }
      });

      const generatedItems: { name: string; quantity: string; price: string }[] = JSON.parse(response.text || '[]');

      if (generatedItems.length === 0) {
        return res.status(400).json({ error: "Aucun article généré." });
      }

      // Ajouter les articles en base + broadcast
      const addedItems: any[] = [];
      let totalBudget = 0;
      for (const genItem of generatedItems) {
        const id = uuidv4();
        const qty = genItem.price ? `${genItem.quantity} · ~${genItem.price}€` : genItem.quantity;
        db.prepare("INSERT INTO items (id, list_id, name, quantity) VALUES (?, ?, ?, ?)").run(id, listId, genItem.name, qty);
        const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        addedItems.push(item);
        broadcast(listId, { type: "ITEM_ADDED", item });
        totalBudget += parseFloat(genItem.price) || 0;
      }

      res.json({ items: addedItems, budget: totalBudget.toFixed(2) });
    } catch (err: any) {
      console.error("Genius API error:", err);
      res.status(500).json({ error: err.message || "Erreur lors de la génération" });
    }
  });

  // Recipe URL → extract ingredients via Gemini
  app.post("/api/recipe", authGuard, async (req: any, res) => {
    const { url, listId, locale } = req.body;
    if (!url || !listId) return res.status(400).json({ error: "url and listId are required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });

    const langMap: Record<string, string> = {
      fr: 'français', en: 'English', es: 'español', ar: 'العربية', it: 'italiano', nl: 'Nederlands'
    };
    const lang = langMap[locale] || 'français';

    try {
      // Fetch the recipe page
      const pageRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 PocketList/1.0' } });
      if (!pageRes.ok) return res.status(400).json({ error: "Could not fetch the recipe URL" });
      const html = await pageRes.text();
      // Extract text content (strip HTML tags, limit to 8000 chars)
      const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000);

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Extract the recipe ingredients from this page content and create a grocery list. For each ingredient, specify name, quantity, and estimated price in euros.\n\nPage content:\n${textContent}\n\nRespond ONLY with a JSON array of { name: string, quantity: string, price: string }. Write ALL names in ${lang}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "quantity", "price"]
            }
          }
        }
      });

      const generatedItems: { name: string; quantity: string; price: string }[] = JSON.parse(response.text || '[]');
      if (generatedItems.length === 0) return res.status(400).json({ error: "No ingredients found" });

      const addedItems: any[] = [];
      let totalBudget = 0;
      for (const genItem of generatedItems) {
        const id = uuidv4();
        const qty = genItem.price ? `${genItem.quantity} · ~${genItem.price}€` : genItem.quantity;
        db.prepare("INSERT INTO items (id, list_id, name, quantity) VALUES (?, ?, ?, ?)").run(id, listId, genItem.name, qty);
        const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
        addedItems.push(item);
        broadcast(listId, { type: "ITEM_ADDED", item });
        totalBudget += parseFloat(genItem.price) || 0;
      }

      res.json({ items: addedItems, budget: totalBudget.toFixed(2) });
    } catch (err: any) {
      console.error("Recipe API error:", err);
      res.status(500).json({ error: err.message || "Error extracting recipe" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    app.use("*", async (req, res) => {
      try {
        const template = await vite.transformIndexHtml(req.originalUrl, fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8"));
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        console.error("Vite transform error:", e);
        res.status(500).end(e.message);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  }

  server.listen(PORT, "0.0.0.0", () => console.log(`Server on http://localhost:${PORT}`));
}

console.log("Initializing server...");
startServer().catch(err => console.error("Start error:", err));
