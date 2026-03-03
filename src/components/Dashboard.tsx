import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, RotateCcw, ChevronRight, LogOut, User as UserIcon, Crown, Sparkles, Loader2, Share2 } from 'lucide-react';
import { User, List, Item } from '../types';
import { ESSENTIALS_CATEGORIES } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}



export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [geniusMode, setGeniusMode] = useState(false);
  const [isGeniusLoading, setIsGeniusLoading] = useState(false);
  const [activeEssentialCategory, setActiveEssentialCategory] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');
  const [joinToken, setJoinToken] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchItems(selectedList.id);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}?listId=${selectedList.id}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'ITEM_ADDED':
            setItems(prev => [...prev.filter(i => i.id !== data.item.id), data.item]);
            break;
          case 'ITEM_UPDATED':
            setItems(prev => prev.map(i => i.id === data.item.id ? data.item : i));
            break;
          case 'ITEM_DELETED':
            setItems(prev => prev.filter(i => i.id !== data.id));
            break;
          case 'LIST_RESET':
            setItems(prev => prev.map(i => ({ ...i, is_checked: false })));
            break;
        }
      };

      return () => ws.close();
    }
  }, [selectedList]);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/lists');
      const data = await res.json();
      setLists(data);
    } catch (err) {
      console.error('Failed to fetch lists');
    }
  };

  const fetchItems = async (listId: string) => {
    try {
      const res = await fetch(`/api/lists/${listId}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items');
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create list');
      setLists([data, ...lists]);
      setNewListName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const joinList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinToken.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/lists/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: joinToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Code invalide');

      if (!lists.find(l => l.id === data.id)) {
        setLists([data, ...lists]);
      }
      setJoinToken('');
      setSelectedList(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteList = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/lists/${id}`, { method: 'DELETE' });
      setLists(lists.filter(l => l.id !== id));
      if (selectedList?.id === id) setSelectedList(null);
    } catch (err) {
      console.error('Failed to delete list');
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !selectedList) return;
    setError('');
    try {
      const res = await fetch(`/api/lists/${selectedList.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add item');
      setItems([...items, data]);
      setNewItemName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleItem = async (item: Item) => {
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_checked: !item.is_checked }),
      });
      const data = await res.json();
      setItems(items.map(i => i.id === item.id ? data : i));
    } catch (err) {
      console.error('Failed to toggle item');
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  const resetList = async () => {
    if (!selectedList) return;
    try {
      await fetch(`/api/lists/${selectedList.id}/reset`, { method: 'POST' });
      setItems(items.map(i => ({ ...i, is_checked: false })));
    } catch (err) {
      console.error('Failed to reset list');
    }
  };

  const shareOnWhatsApp = () => {
    if (!selectedList) return;
    const uncheckedItems = items.filter(i => !i.is_checked);
    const targetItems = uncheckedItems.length === 0 ? items : uncheckedItems;
    const itemsList = targetItems.map(i => `- ${i.name}`).join('\n');
    const message = uncheckedItems.length === 0
      ? `Voici ma liste de courses "${selectedList.name}" :\n\n${itemsList}\n\nMerci !`
      : `Coucou ! Peux-tu me prendre ces quelques articles pour la liste "${selectedList.name}" ?\n\n${itemsList}\n\nMerci beaucoup ! ❤️`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    onLogout();
  };

  const handleExport = () => {
    window.location.href = '/api/account/export';
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront effacées.')) return;
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (res.ok) onLogout();
    } catch (err) {
      console.error('Failed to delete account');
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Failed to start checkout');
    }
  };

  const handleGenius = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !selectedList) return;

    setIsGeniusLoading(true);
    setError('');

    try {
      const res = await fetch('/api/genius', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newItemName, listId: selectedList.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur Genius');

      setItems([...items, ...data.items]);
      setNewItemName('');
      setGeniusMode(false);
    } catch (err: any) {
      console.error('Genius error:', err);
      setError("Erreur Genius : " + (err.message || "Impossible de générer la liste"));
    } finally {
      setIsGeniusLoading(false);
    }
  };

  const addEssentialItem = async (name: string) => {
    if (!selectedList) return;
    try {
      const res = await fetch(`/api/lists/${selectedList.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems([...items, newItem]);
      }
    } catch (err) {
      console.error('Failed to add essential item:', err);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Failed to open portal');
    }
  };

  return (
    <div className="min-h-screen bg-gunmetal text-white font-sans">
      {/* Header */}
      <header className="bg-gunmetal/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-chartreuse">PocketList</h1>
            {user.is_premium && <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 text-white/40 hover:text-chartreuse transition-colors active:scale-95"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 text-white/40 hover:text-red-400 transition-colors active:scale-95"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-chartreuse">Mon Compte</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white transition-colors">
                  Fermer
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Statut</p>
                    <p className="font-medium flex items-center gap-1 justify-end">
                      {user.is_premium ? (
                        <>Premium <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /></>
                      ) : 'Gratuit'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  {user.is_premium ? (
                    <button
                      onClick={handleManageSubscription}
                      className="w-full bg-white/10 text-white py-3 rounded-2xl font-medium hover:bg-white/20 transition-colors"
                    >
                      Gérer mon abonnement
                    </button>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-chartreuse/20"
                    >
                      <Crown className="w-5 h-5" /> Passer Premium
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold px-2 text-white/80">Données &amp; Confidentialité</h3>
                <div className="grid gap-3">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:border-chartreuse/50 transition-all text-left group"
                  >
                    <div>
                      <p className="font-medium group-hover:text-chartreuse transition-colors">Exporter mes données</p>
                      <p className="text-sm text-white/60">Télécharger une copie au format JSON</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-chartreuse transition-colors" />
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-between p-5 bg-white/5 border border-red-500/10 rounded-3xl hover:bg-red-500/5 transition-all text-left group"
                  >
                    <div>
                      <p className="font-medium text-red-400">Supprimer mon compte</p>
                      <p className="text-sm text-red-400/80">Effacer définitivement toutes les données</p>
                    </div>
                    <Trash2 className="w-5 h-5 text-red-500/20 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : !selectedList ? (
            <motion.div
              key="lists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-chartreuse">Mes listes</h2>
                <span className="text-sm text-white/60">
                  {lists.length} / {user.is_premium ? '∞' : '3'}
                </span>
              </div>

              <form onSubmit={createList} className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Nom de la liste..."
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse outline-none transition-all text-base"
                />
                <button className="bg-chartreuse text-gunmetal px-5 py-3.5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-chartreuse/20">
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <form onSubmit={joinList} className="flex gap-2">
                <input
                  type="text"
                  value={joinToken}
                  onChange={(e) => setJoinToken(e.target.value)}
                  placeholder="Rejoindre avec un code..."
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse outline-none transition-all text-base"
                />
                <button className="bg-white/10 text-white px-5 py-3.5 rounded-2xl font-bold hover:bg-white/20 active:scale-95 transition-all">
                  Rejoindre
                </button>
              </form>

              <div className="grid gap-3">
                {lists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:border-chartreuse/50 transition-all text-left group"
                  >
                    <span className="font-bold text-lg group-hover:text-chartreuse transition-colors">{list.name}</span>
                    <div className="flex items-center gap-3">
                      <Trash2
                        className="w-5 h-5 text-white/20 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        onClick={(e) => deleteList(list.id, e)}
                      />
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-chartreuse transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedList(null)}
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" /> Retour
                </button>
                <h2 className="text-xl font-bold text-chartreuse">{selectedList.name}</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 text-white/40 hover:text-chartreuse transition-colors"
                    title="Code de partage"
                  >
                    <Crown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="p-2 text-white/40 hover:text-[#25D366] transition-colors"
                    title="Partager sur WhatsApp"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetList}
                    className="p-2 text-white/40 hover:text-chartreuse transition-colors"
                    title="Réinitialiser la liste"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={geniusMode ? handleGenius : addItem} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={geniusMode ? "Ex: Ingrédients pour une pizza..." : "Ajouter un article..."}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-white/20 focus:ring-2 outline-none transition-all text-base ${geniusMode ? 'border-chartreuse/50 focus:ring-chartreuse pl-10' : 'border-white/10 focus:ring-chartreuse'
                      }`}
                  />
                  {geniusMode && <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chartreuse animate-pulse" />}
                </div>
                <button
                  type="button"
                  onClick={() => setGeniusMode(!geniusMode)}
                  className={`p-3.5 rounded-2xl transition-all border active:scale-95 ${geniusMode
                    ? 'bg-chartreuse/20 border-chartreuse text-chartreuse'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-chartreuse'
                    }`}
                  title="Mode Genius (IA)"
                >
                  <Sparkles className="w-6 h-6" />
                </button>
                <button
                  disabled={isGeniusLoading}
                  className="bg-chartreuse text-gunmetal p-3.5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-chartreuse/20 disabled:opacity-50"
                >
                  {isGeniusLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                </button>
              </form>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Bibliothèque d'essentiels</h3>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pb-2">
                  {ESSENTIALS_CATEGORIES.map((cat, index) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveEssentialCategory(activeEssentialCategory === cat.id ? null : cat.id)}
                      className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 ${index === ESSENTIALS_CATEGORIES.length - 1 && index % 2 === 0 ? 'col-span-2 sm:col-span-1' : ''
                        } ${activeEssentialCategory === cat.id
                          ? 'bg-chartreuse border-chartreuse text-gunmetal font-bold shadow-lg shadow-chartreuse/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                        }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeEssentialCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                        {ESSENTIALS_CATEGORIES.find(c => c.id === activeEssentialCategory)?.items.map(itemName => {
                          const isAlreadyInList = items.some(i => i.name.toLowerCase() === itemName.toLowerCase());
                          return (
                            <button
                              key={itemName}
                              disabled={isAlreadyInList}
                              onClick={() => addEssentialItem(itemName)}
                              className={`px-4 py-2 rounded-lg text-sm transition-all active:scale-95 ${isAlreadyInList
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-chartreuse hover:text-gunmetal'
                                }`}
                            >
                              {itemName}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid gap-2">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left group active:scale-[0.98] ${item.is_checked ? 'bg-white/5' : 'bg-white/5 border border-white/10 hover:border-chartreuse/30'
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.is_checked ? 'bg-chartreuse border-chartreuse' : 'border-white/20 group-hover:border-chartreuse/50'
                      }`}>
                      {item.is_checked && <Check className="w-4 h-4 text-gunmetal" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium transition-all ${item.is_checked ? 'line-through text-chartreuse/60' : 'text-white'}`}>
                        {item.name}
                      </p>
                      {item.quantity && (
                        <p className={`text-xs ${item.is_checked ? 'text-white/10' : 'text-white/40'}`}>
                          {item.quantity}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => deleteItem(item.id, e)}
                      className="p-2 text-white/20 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && selectedList && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gunmetal/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center space-y-6"
              >
                <div className="w-16 h-16 bg-chartreuse/20 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-chartreuse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mode Comité</h3>
                  <p className="text-white/60 text-sm mt-1">Partagez ce code pour collaborer en temps réel sur cette liste.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-mono font-bold tracking-widest text-chartreuse">
                    {(selectedList as any).share_token}
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all"
                >
                  C'est noté !
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
