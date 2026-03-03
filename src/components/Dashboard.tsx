import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, RotateCcw, ChevronRight, LogOut, User as UserIcon, Crown, Sparkles, Loader2, Share2, Globe, Search, UtensilsCrossed, Leaf, Repeat } from 'lucide-react';
import { User, List, Item } from '../types';
import { getEssentialsCategories } from '../constants';
import { useTranslation, LOCALE_META, Locale } from '../i18n';
import Confetti from './Confetti';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t, locale, setLocale } = useTranslation();
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
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastBudget, setLastBudget] = useState<string | null>(null);
  const [recipeMode, setRecipeMode] = useState(false);
  const [recipeUrl, setRecipeUrl] = useState('');
  const [dietFilter, setDietFilter] = useState<string | null>(null);

  const DIETS = [
    { id: 'vegan', emoji: '🌱', labelKey: 'diet.vegan' },
    { id: 'vegetarian', emoji: '🥚', labelKey: 'diet.vegetarian' },
    { id: 'gluten-free', emoji: '🌾', labelKey: 'diet.glutenFree' },
    { id: 'keto', emoji: '🥑', labelKey: 'diet.keto' },
    { id: 'halal', emoji: '☪️', labelKey: 'diet.halal' },
    { id: 'lactose-free', emoji: '🥛', labelKey: 'diet.lactoseFree' },
  ];

  const FORBIDDEN_KEYWORDS: Record<string, string[]> = {
    'halal': ['porc', 'pork', 'lard', 'saucisse de francfort', 'saucisse de montbéliard', 'jambon', 'bacon', 'charcuterie', 'vin', 'alcool', 'beer', 'wine', 'choucroute'],
    'vegan': ['lait', 'milk', 'beurre', 'butter', 'fromage', 'cheese', 'oeuf', 'egg', 'yaourt', 'yogurt', 'crème', 'cream', 'miel', 'honey', 'viande', 'meat', 'poulet', 'chicken', 'boeuf', 'beef', 'poisson', 'fish', 'porc', 'pork', 'lard', 'bacon', 'jambon'],
    'vegetarian': ['viande', 'meat', 'poulet', 'chicken', 'boeuf', 'beef', 'poisson', 'fish', 'porc', 'pork', 'lard', 'bacon', 'jambon', 'charcuterie'],
    'gluten-free': ['pain', 'bread', 'pâtes', 'pasta', 'farine', 'flour', 'biscuits', 'cookies', 'gâteau', 'cake', 'pizza', 'bière', 'beer', 'semoule', 'couscous'],
    'lactose-free': ['lait', 'milk', 'beurre', 'butter', 'crème', 'cream', 'yaourt', 'yogurt', 'fromage', 'cheese'],
  };

  const isItemAllowed = (name: string) => {
    if (!dietFilter || !FORBIDDEN_KEYWORDS[dietFilter]) return true;
    const lowerName = name.toLowerCase();
    return !FORBIDDEN_KEYWORDS[dietFilter].some(keyword => lowerName.includes(keyword));
  };

  const essentials = getEssentialsCategories(t);

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
          case 'ITEM_ADDED': setItems(prev => [...prev.filter(i => i.id !== data.item.id), data.item]); break;
          case 'ITEM_UPDATED': setItems(prev => prev.map(i => i.id === data.item.id ? data.item : i)); break;
          case 'ITEM_DELETED': setItems(prev => prev.filter(i => i.id !== data.id)); break;
          case 'LIST_RESET': setItems(prev => prev.map(i => ({ ...i, is_checked: false }))); break;
        }
      };
      return () => ws.close();
    }
  }, [selectedList]);

  const fetchLists = async () => { try { const res = await fetch('/api/lists'); setLists(await res.json()); } catch { } };
  const fetchItems = async (listId: string) => { try { const res = await fetch(`/api/lists/${listId}/items`); setItems(await res.json()); } catch { } };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/lists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newListName }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLists([data, ...lists]);
      setNewListName('');
    } catch (err: any) { setError(err.message); }
  };

  const joinList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinToken.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/lists/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: joinToken }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!lists.find(l => l.id === data.id)) setLists([data, ...lists]);
      setJoinToken('');
      setSelectedList(data);
    } catch (err: any) { setError(err.message); }
  };

  const deleteList = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await fetch(`/api/lists/${id}`, { method: 'DELETE' }); setLists(lists.filter(l => l.id !== id)); if (selectedList?.id === id) setSelectedList(null); } catch { }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !selectedList) return;
    setError('');
    try {
      const res = await fetch(`/api/lists/${selectedList.id}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newItemName }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems([...items, data]);
      setNewItemName('');
    } catch (err: any) { setError(err.message); }
  };

  const toggleItem = async (item: Item) => {
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_checked: !item.is_checked }) });
      const data = await res.json();
      const newItems = items.map(i => i.id === item.id ? data : i);
      setItems(newItems);
      // Confetti when all items are checked
      if (newItems.length > 0 && newItems.every(i => i.is_checked) && !item.is_checked) {
        setShowConfetti(true);
      }
    } catch { }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await fetch(`/api/items/${id}`, { method: 'DELETE' }); setItems(items.filter(i => i.id !== id)); } catch { }
  };

  const resetList = async () => {
    if (!selectedList) return;
    try { await fetch(`/api/lists/${selectedList.id}/reset`, { method: 'POST' }); setItems(items.map(i => ({ ...i, is_checked: false }))); } catch { }
  };

  const toggleRecurrence = async () => {
    if (!selectedList) return;
    try {
      const res = await fetch(`/api/lists/${selectedList.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_recurrent: !selectedList.is_recurrent }),
      });
      const data = await res.json();
      setSelectedList(data);
      setLists(lists.map(l => l.id === data.id ? data : l));
    } catch { }
  };

  const shareOnWhatsApp = () => {
    if (!selectedList) return;
    const unchecked = items.filter(i => !i.is_checked);
    const target = unchecked.length === 0 ? items : unchecked;
    const itemsList = target.map(i => `- ${i.name}`).join('\n');
    const template = unchecked.length === 0 ? t('dash.whatsappAll') : t('dash.whatsappUnchecked');
    const message = template.replace('{name}', selectedList.name).replace('{items}', itemsList);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); onLogout(); };
  const handleExport = () => { window.location.href = '/api/account/export'; };
  const handleDeleteAccount = async () => {
    if (!confirm(t('dash.deleteConfirm'))) return;
    try { const res = await fetch('/api/account', { method: 'DELETE' }); if (res.ok) onLogout(); } catch { }
  };
  const handleUpgrade = async () => { try { const res = await fetch('/api/billing/checkout', { method: 'POST' }); const data = await res.json(); if (data.url) window.location.href = data.url; } catch { } };
  const handleManageSubscription = async () => { try { const res = await fetch('/api/billing/portal', { method: 'POST' }); const data = await res.json(); if (data.url) window.location.href = data.url; } catch { } };

  const handleGenius = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !selectedList) return;
    setIsGeniusLoading(true);
    setError('');
    try {
      const res = await fetch('/api/genius', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newItemName, listId: selectedList.id, locale, diet: dietFilter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur Genius');
      setItems([...items, ...data.items]);
      if (data.budget) setLastBudget(data.budget);
      setNewItemName('');
      setGeniusMode(false);
    } catch (err: any) {
      setError("Genius: " + (err.message || "Error"));
    } finally { setIsGeniusLoading(false); }
  };

  const handleRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeUrl.trim() || !selectedList) return;
    setIsGeniusLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: recipeUrl, listId: selectedList.id, locale, diet: dietFilter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur recette');
      setItems([...items, ...data.items]);
      if (data.budget) setLastBudget(data.budget);
      setRecipeUrl('');
      setRecipeMode(false);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally { setIsGeniusLoading(false); }
  };

  const addEssentialItem = async (name: string) => {
    if (!selectedList) return;
    try {
      const res = await fetch(`/api/lists/${selectedList.id}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (res.ok) { const newItem = await res.json(); setItems([...items, newItem]); }
    } catch { }
  };

  return (
    <div className="min-h-screen bg-gunmetal text-white font-sans">
      <header className="bg-gunmetal/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-chartreuse">{t('appName')}</h1>
            <span className="text-[10px] font-bold bg-chartreuse/20 text-chartreuse px-1.5 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
            {user.is_premium && <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 p-2.5 text-white/40 hover:text-chartreuse transition-colors active:scale-95"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold">{locale.toUpperCase()}</span>
              </button>
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-gunmetal/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 min-w-[160px]">
                    {(Object.keys(LOCALE_META) as Locale[]).map(l => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setShowLangMenu(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${l === locale ? 'bg-chartreuse text-gunmetal font-bold' : 'text-white/70 hover:bg-white/10'
                          }`}
                      >
                        <span className="text-lg">{LOCALE_META[l].flag}</span>
                        <span>{LOCALE_META[l].label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 text-white/40 hover:text-chartreuse transition-colors active:scale-95">
              <UserIcon className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2.5 text-white/40 hover:text-red-400 transition-colors active:scale-95">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-chartreuse">{t('dash.myAccount')}</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white transition-colors">{t('dash.close')}</button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-white/60">{t('dash.emailLabel')}</p><p className="font-medium">{user.email}</p></div>
                  <div className="text-right"><p className="text-sm text-white/60">{t('dash.statusLabel')}</p>
                    <p className="font-medium flex items-center gap-1 justify-end">{user.is_premium ? <>{t('dash.premium')} <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /></> : t('dash.free')}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  {user.is_premium ? (
                    <button onClick={handleManageSubscription} className="w-full bg-white/10 text-white py-3 rounded-2xl font-medium hover:bg-white/20 transition-colors">{t('dash.manageSubscription')}</button>
                  ) : (
                    <button onClick={handleUpgrade} className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-chartreuse/20"><Crown className="w-5 h-5" /> {t('dash.upgrade')}</button>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold px-2 text-white/80">{t('dash.dataPrivacy')}</h3>
                <div className="grid gap-3">
                  <button onClick={handleExport} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:border-chartreuse/50 transition-all text-left group">
                    <div><p className="font-medium group-hover:text-chartreuse transition-colors">{t('dash.exportData')}</p><p className="text-sm text-white/60">{t('dash.exportDesc')}</p></div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-chartreuse transition-colors" />
                  </button>
                  <button onClick={handleDeleteAccount} className="flex items-center justify-between p-5 bg-white/5 border border-red-500/10 rounded-3xl hover:bg-red-500/5 transition-all text-left group">
                    <div><p className="font-medium text-red-400">{t('dash.deleteAccount')}</p><p className="text-sm text-red-400/80">{t('dash.deleteDesc')}</p></div>
                    <Trash2 className="w-5 h-5 text-red-500/20 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : !selectedList ? (
            <motion.div key="lists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-chartreuse">{t('dash.myLists')}</h2>
                <span className="text-sm text-white/60">{lists.length} / {user.is_premium ? '∞' : '3'}</span>
              </div>
              <form onSubmit={createList} className="flex gap-2">
                <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder={t('dash.listPlaceholder')}
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse outline-none transition-all text-base" />
                <button className="bg-chartreuse text-gunmetal px-5 py-3.5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-chartreuse/20"><Plus className="w-6 h-6" /></button>
              </form>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <form onSubmit={joinList} className="flex gap-2">
                <input type="text" value={joinToken} onChange={(e) => setJoinToken(e.target.value)} placeholder={t('dash.joinPlaceholder')}
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse outline-none transition-all text-base" />
                <button className="bg-white/10 text-white px-5 py-3.5 rounded-2xl font-bold hover:bg-white/20 active:scale-95 transition-all">{t('dash.join')}</button>
              </form>
              <div className="grid gap-3">
                {lists.map(list => (
                  <button key={list.id} onClick={() => setSelectedList(list)} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl hover:border-chartreuse/50 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg group-hover:text-chartreuse transition-colors">{list.name}</span>
                      {list.is_recurrent && <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-wider">{t('dash.templateBadge')}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-white/20 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100" onClick={(e) => deleteList(list.id, e)} />
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-chartreuse transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="items" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedList(null)} className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-5 h-5 rotate-180" /> {t('dash.back')}
                </button>
                <h2 className="text-xl font-bold text-chartreuse">{selectedList.name}</h2>
                <div className="flex items-center gap-1">
                  <button onClick={toggleRecurrence} className={`p-2 transition-colors ${selectedList.is_recurrent ? 'text-chartreuse' : 'text-white/20 hover:text-white/40'}`} title={t('dash.recurrentTitle')}><Repeat className="w-5 h-5" /></button>
                  <button onClick={() => setShowShareModal(true)} className="p-2 text-white/40 hover:text-chartreuse transition-colors" title={t('dash.shareTitle')}><Crown className="w-5 h-5" /></button>
                  <button onClick={shareOnWhatsApp} className="p-2 text-white/40 hover:text-[#25D366] transition-colors" title="WhatsApp"><Share2 className="w-5 h-5" /></button>
                  <button onClick={resetList} className="p-2 text-white/20 hover:text-chartreuse transition-colors"><RotateCcw className="w-5 h-5" /></button>
                </div>
              </div>

              <form onSubmit={geniusMode ? handleGenius : addItem} className="flex gap-2">
                <div className="relative flex-1">
                  <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={geniusMode ? t('dash.geniusPlaceholder') : t('dash.addItem')}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-white/20 focus:ring-2 outline-none transition-all text-base ${geniusMode ? 'border-chartreuse/50 focus:ring-chartreuse pl-10' : 'border-white/10 focus:ring-chartreuse'}`} />
                  {geniusMode && <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chartreuse animate-pulse" />}
                </div>
                <button type="button" onClick={() => { setGeniusMode(!geniusMode); setRecipeMode(false); }}
                  className={`p-3.5 rounded-2xl transition-all border active:scale-95 ${geniusMode ? 'bg-chartreuse/20 border-chartreuse text-chartreuse' : 'bg-white/5 border-white/10 text-white/40 hover:text-chartreuse'}`}
                  title={t('landing.genius')}>
                  <Sparkles className="w-6 h-6" />
                </button>
                <button type="button" onClick={() => { setRecipeMode(!recipeMode); setGeniusMode(false); }}
                  className={`p-3.5 rounded-2xl transition-all border active:scale-95 ${recipeMode ? 'bg-orange-400/20 border-orange-400 text-orange-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-orange-400'}`}
                  title={t('dash.recipeTitle')}>
                  <UtensilsCrossed className="w-6 h-6" />
                </button>
                <button disabled={isGeniusLoading} className="bg-chartreuse text-gunmetal p-3.5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-chartreuse/20 disabled:opacity-50">
                  {isGeniusLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                </button>
              </form>

              {/* Recipe URL Input */}
              <AnimatePresence>
                {recipeMode && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleRecipe}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 pt-1">
                      <div className="relative flex-1">
                        <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                        <input
                          type="url"
                          value={recipeUrl}
                          onChange={(e) => setRecipeUrl(e.target.value)}
                          placeholder={t('dash.recipePlaceholder')}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-orange-400/30 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-orange-400/50 outline-none transition-all text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isGeniusLoading || !recipeUrl.trim()}
                        className="bg-orange-400 text-gunmetal px-5 py-3 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isGeniusLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('dash.recipeExtract')}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Diet Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Leaf className="w-4 h-4 text-green-400 flex-shrink-0" />
                {DIETS.map(diet => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setDietFilter(dietFilter === diet.id ? null : diet.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 border ${dietFilter === diet.id
                      ? 'bg-green-400/20 border-green-400 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                      }`}
                  >
                    <span>{diet.emoji}</span>
                    <span>{t(diet.labelKey)}</span>
                  </button>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {/* Budget Banner */}
              {lastBudget && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-chartreuse/10 border border-chartreuse/20 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-chartreuse/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{t('dash.budgetLabel')}</p>
                      <p className="text-xl font-bold text-chartreuse">{lastBudget}€</p>
                    </div>
                  </div>
                  <button onClick={() => setLastBudget(null)} className="text-white/30 hover:text-white/60 text-xl">&times;</button>
                </motion.div>
              )}

              {/* Search / Filter */}
              {items.length > 3 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('dash.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-chartreuse/50 outline-none transition-all"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1"><h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">{t('dash.essentialsTitle')}</h3></div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pb-2">
                  {essentials.map((cat, index) => (
                    <button key={cat.id} onClick={() => setActiveEssentialCategory(activeEssentialCategory === cat.id ? null : cat.id)}
                      className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 ${index === essentials.length - 1 && index % 2 === 0 ? 'col-span-2 sm:col-span-1' : ''
                        } ${activeEssentialCategory === cat.id ? 'bg-chartreuse border-chartreuse text-gunmetal font-bold shadow-lg shadow-chartreuse/20' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>
                      <cat.icon className="w-4 h-4" /><span className="text-xs sm:text-sm font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {activeEssentialCategory && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                        {essentials.find(c => c.id === activeEssentialCategory)?.items
                          .filter((itemName: string) => isItemAllowed(itemName))
                          .map((itemName: string) => {
                            const isAlready = items.some(i => i.name.toLowerCase() === itemName.toLowerCase());
                            return (
                              <button key={itemName} disabled={isAlready} onClick={() => addEssentialItem(itemName)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all active:scale-95 ${isAlready ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-chartreuse hover:text-gunmetal'}`}>
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
                {items
                  .filter(item => isItemAllowed(item.name))
                  .filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(item => (
                    <button key={item.id} onClick={() => toggleItem(item)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left group active:scale-[0.98] ${item.is_checked ? 'bg-white/5' : 'bg-white/5 border border-white/10 hover:border-chartreuse/30'}`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.is_checked ? 'bg-chartreuse border-chartreuse' : 'border-white/20 group-hover:border-chartreuse/50'}`}>
                        {item.is_checked && <Check className="w-4 h-4 text-gunmetal" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium transition-all ${item.is_checked ? 'line-through text-chartreuse/60' : 'text-white'}`}>{item.name}</p>
                        {item.quantity && <p className={`text-xs ${item.is_checked ? 'text-white/10' : 'text-white/40'}`}>{item.quantity}</p>}
                      </div>
                      <button onClick={(e) => deleteItem(item.id, e)} className="p-2 text-white/20 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareModal && selectedList && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gunmetal/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
                <div className="w-16 h-16 bg-chartreuse/20 rounded-full flex items-center justify-center mx-auto"><Crown className="w-8 h-8 text-chartreuse" /></div>
                <div><h3 className="text-xl font-bold text-white">{t('dash.shareTitle')}</h3><p className="text-white/60 text-sm mt-1">{t('dash.shareDesc')}</p></div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4"><p className="text-3xl font-mono font-bold tracking-widest text-chartreuse">{(selectedList as any).share_token}</p></div>
                <button onClick={() => setShowShareModal(false)} className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all">{t('dash.shareOk')}</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
    </div>
  );
}
