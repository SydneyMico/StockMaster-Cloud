import React, { useState, useMemo } from 'react';
import { Plus, Package, X, RefreshCw, Loader2, ArrowRight, CheckCircle2, Lock, Sparkles, TrendingUp, QrCode, ChevronRight, Zap, MonitorCheck, Download, Trash2, DollarSign, Tag, AlertTriangle } from 'lucide-react';
import { Product, Role, PlanType, Language, CurrencyCode } from '../types';
import { formatMoney } from '../App';

const translations: Record<Language, any> = {
  en: {
    stock_list: "STOCK LIST",
    stock_directory: "STOCK DIRECTORY",
    limit_reached_alert: "Limit reached! Upgrade for more capacity.",
    get_pro: "GET PRO",
    new_asset: "NEW ASSET",
    identity: "IDENTITY",
    volume: "VOLUME",
    pricing: "PRICING",
    action: "ACTION",
    restock: "RESTOCK",
    nudge_title: "Native Performance",
    nudge_desc: "Run as a standalone app for offline access and faster inventory tracking.",
    nudge_btn: "INSTALL NOW",
    restock_title: "RESTOCK ASSET",
    qty_to_add: "QUANTITY TO ADD",
    cancel: "CANCEL",
    confirm_restock: "CONFIRM RESTOCK",
    new_cost: "NEW COST PRICE",
    new_selling: "NEW SELLING PRICE",
    delete_confirm_title: "DELETE PRODUCT",
    delete_confirm_desc: "This will permanently remove '{name}' from your stock. This action cannot be reversed.",
    delete_btn: "DELETE FOREVER",
    // Modal Labels
    label_asset_name: "Asset Name",
    placeholder_asset_name: "e.g. Rice 25kg",
    label_sku_unit: "SKU / Unit",
    label_initial_stock: "Initial Stock",
    label_cost_price: "Cost Price",
    label_selling_price: "Selling Price",
    btn_register: "REGISTER ASSET",
    unit_each: "Each",
    unit_pack: "Pack",
    unit_box: "Box",
    unit_carton: "Carton"
  },
  rw: {
    stock_list: "UBUBIKO",
    stock_directory: "IMEREKEZO Y'UBEREYE",
    limit_reached_alert: "Wageze ku mupaka! Gura porogaramu yisumbuye.",
    get_pro: "GURA PRO",
    new_asset: "IGICURUZWA GISHYA",
    identity: "ICYANDITSWEHO",
    volume: "INGANO",
    pricing: "IGICIRO",
    action: "IGIKORWA",
    restock: "ONGERAMO",
    nudge_title: "Kora neza kandi vuba",
    nudge_desc: "Yishyiremo kuri telefone cyangwa mudasobwa kugirango ukore vuba.",
    nudge_btn: "YISHYIREMO",
    restock_title: "ONGERA IBYAPFUYE",
    qty_to_add: "INGANO WONGERAHO",
    cancel: "REKA",
    confirm_restock: "EMEZA",
    new_cost: "IGICIRO GISHYA WABIGUZE",
    new_selling: "IGICIRO GISHYA UKURISHIRIZAHO",
    delete_confirm_title: "SIBA IGICURUZWA",
    delete_confirm_desc: "Ibi bigiye gusiba '{name}' mu bubiko bwawe burundu. Ntibishobora gusubirwa inyuma.",
    delete_btn: "SIBA BURUNDU",
    // Modal Labels
    label_asset_name: "Izina ry'Igicuruzwa",
    placeholder_asset_name: "Urugero: Umuceri 25kg",
    label_sku_unit: "Ingano / SKU",
    label_initial_stock: "Ibisigaye ubu",
    label_cost_price: "Igiciro wakiguze",
    label_selling_price: "Igiciro ukigurishaho",
    btn_register: "ANDIKA IGICURUZWA",
    unit_each: "Rimwe",
    unit_pack: "Ipaketi",
    unit_box: "Isanduku",
    unit_carton: "Ikositini"
  },
  fr: {
    stock_list: "LISTE DE STOCK",
    stock_directory: "RÉPERTOIRE DE STOCK",
    limit_reached_alert: "Limite atteinte ! Améliorez votre plan.",
    get_pro: "PLAN PRO",
    new_asset: "NOUVEL ACTIF",
    identity: "IDENTITÉ",
    volume: "VOLUME",
    pricing: "PRIX",
    action: "ACTION",
    restock: "RÉAPPROVISIONNER",
    nudge_title: "Performance Native",
    nudge_desc: "Installez l'appli pour un accès hors ligne et un suivi plus rapide.",
    nudge_btn: "INSTALLER",
    restock_title: "RÉAPPROVISIONNER",
    qty_to_add: "QUANTITÉ À AJOUTER",
    cancel: "ANNULER",
    confirm_restock: "CONFIRMER",
    new_cost: "NOUVEAU PRIX D'ACHAT",
    new_selling: "NOUVEAU PRIX DE VENTE",
    delete_confirm_title: "SUPPRIMER PRODUIT",
    delete_confirm_desc: "Cela supprimera définitivement '{name}' de votre stock. Cette action est irréversible.",
    delete_btn: "SUPPRIMER DÉFINITIVEMENT",
    // Modal Labels
    label_asset_name: "Nom de l'article",
    placeholder_asset_name: "ex: Riz 25kg",
    label_sku_unit: "SKU / Unité",
    label_initial_stock: "Stock Initial",
    label_cost_price: "Prix d'Achat",
    label_selling_price: "Prix de Vente",
    btn_register: "ENREGISTRER L'ARTICLE",
    unit_each: "Chaque",
    unit_pack: "Paquet",
    unit_box: "Boîte",
    unit_carton: "Carton"
  }
};

interface InventoryViewProps {
  products: Product[];
  role: Role;
  plan: PlanType;
  lang: Language;
  currency: CurrencyCode;
  onUpgradeRequest: () => void;
  onAddProduct: (product: {
    name: string;
    sku: string;
    stock: number;
    costPrice: number;
    sellingPrice: number;
    category: string;
    lowStockThreshold: number;
  }) => void;
  onRestock: (id: string, qty: number, newCost?: number, newSelling?: number) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
  companyName?: string;
  isStandalone: boolean;
  onInstall: () => void;
}

const NumberCell = ({ value, unit, currency }: { value: number, unit?: string, currency?: CurrencyCode }) => {
  const [showFull, setShowFull] = useState(false);
  return (
    <div 
      className="cursor-pointer transition-all duration-300 active:scale-95"
      onMouseEnter={() => setShowFull(true)}
      onMouseLeave={() => setShowFull(false)}
      onClick={() => setShowFull(!showFull)}
      title={value.toString()}
    >
      <div className="flex items-baseline gap-1">
        <span className={`font-black text-slate-900 ${showFull ? 'text-xs break-all' : 'text-sm lg:text-base'}`}>
          {currency ? formatMoney(value, currency) : (showFull ? value.toString() : value.toLocaleString())}
        </span>
        {unit && !currency && <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{unit}</span>}
      </div>
    </div>
  );
};

const InventoryView: React.FC<InventoryViewProps> = ({ products, role, plan, lang, currency, onUpgradeRequest, onAddProduct, onRestock, onDeleteProduct, companyName, isStandalone, onInstall }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockItem, setRestockItem] = useState<{ id: string, name: string, cost: number, selling: number } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(1);
  const [newCost, setNewCost] = useState(0);
  const [newSelling, setNewSelling] = useState(0);
  const [isRestocking, setIsRestocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: 'EA',
    stock: 0,
    costPrice: 0,
    sellingPrice: 0,
    category: 'General',
    lowStockThreshold: 5,
    companyId: ''
  });

  const limit = plan === 'free' ? 50 : (plan === 'growth' ? 500 : 999999);
  const limitReached = products.length >= limit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (limitReached) {
      alert(t('limit_reached_alert'));
      return;
    }
    onAddProduct({
      ...formData,
      stock: Number(formData.stock),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      lowStockThreshold: Number(formData.lowStockThreshold)
    });
    setShowAddModal(false);
    setFormData({ name: '', sku: 'EA', stock: 0, costPrice: 0, sellingPrice: 0, category: 'General', lowStockThreshold: 5, companyId: '' });
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;
    setIsRestocking(true);
    try {
      await onRestock(restockItem.id, restockQty, newCost, newSelling);
      setRestockItem(null);
      setRestockQty(1);
    } finally {
      setIsRestocking(false);
    }
  };

  const handleFinalDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(itemToDelete.id);
      setItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const openRestock = (product: Product) => {
    setRestockItem({ 
      id: product.id, 
      name: product.name, 
      cost: product.costPrice, 
      selling: product.sellingPrice 
    });
    setNewCost(product.costPrice);
    setNewSelling(product.sellingPrice);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 lg:pb-12 text-left">
      <div className="flex justify-between items-start mb-6 lg:mb-12 px-1">
        <div>
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic lg:normal-case">{t('stock_list')}</h2>
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic lg:normal-case">{companyName || 'STOCKMASTER BUSINESS'}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-6 lg:mb-8 gap-4 lg:gap-6 px-1">
        <div className="flex-1 w-full bg-white lg:bg-transparent p-4 lg:p-0 rounded-[24px] lg:rounded-none border border-slate-100 lg:border-none shadow-sm lg:shadow-none">
          <h3 className="text-slate-800 font-black text-[9px] lg:text-sm tracking-[0.1em] uppercase mb-2 lg:mb-2">{t('stock_directory')}</h3>
          <div className="flex items-center gap-3">
             <div className="h-1.5 lg:h-2 flex-1 lg:flex-none lg:w-48 bg-slate-100 lg:bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${limitReached ? 'bg-rose-500' : 'bg-[#5252f2]'}`} 
                  style={{ width: `${Math.min(100, (products.length / limit) * 100)}%` }}
                />
             </div>
             <p className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${limitReached ? 'text-rose-600' : 'text-slate-400'}`}>
               {products.length} / {limit === 999999 ? '∞' : limit}
             </p>
          </div>
        </div>
        
        <div className="flex lg:gap-4 gap-2 shrink-0">
          {plan !== 'pro' && role === 'manager' && (
            <button 
              onClick={onUpgradeRequest}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-8 py-3.5 lg:py-4 bg-white text-[#5252f2] rounded-[18px] lg:rounded-[24px] font-black text-[9px] lg:text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all border border-slate-100 shadow-sm"
            >
              UPGRADE
            </button>
          )}
          {role === 'manager' && (
            <button 
              onClick={() => setShowAddModal(true)}
              disabled={limitReached}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-8 py-3.5 lg:py-4 rounded-[18px] lg:rounded-[24px] font-black text-[9px] lg:text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${limitReached ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#5252f2] hover:bg-[#4343e2] text-white shadow-[#5252f2]/20'}`}
            >
              {limitReached ? <Lock size={12} /> : <Plus size={12} strokeWidth={4} />}
              {t('new_asset')}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE ONLY CARD VIEW */}
      <div className="grid grid-cols-1 gap-3 lg:hidden px-1">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-3 active:scale-[0.98] transition-transform">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${product.stock <= product.lowStockThreshold ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-400'}`}>
                      <Package size={20} />
                   </div>
                   <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-800 leading-tight truncate">{product.name}</h4>
                      <p className="text-[8px] font-black text-indigo-400/60 uppercase tracking-widest mt-0.5">SKU: {product.sku}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                   <div className="text-right">
                      <p className="text-base font-black text-slate-900">{formatMoney(product.sellingPrice, currency)}</p>
                   </div>
                   {role === 'manager' && (
                     <button 
                        onClick={() => setItemToDelete(product)}
                        className="mt-1 p-2 text-slate-200 hover:text-rose-500 transition-colors"
                     >
                       <Trash2 size={14} />
                     </button>
                   )}
                </div>
             </div>
             
             <div className="h-px bg-slate-50 w-full" />
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${product.stock <= product.lowStockThreshold ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                   <p className="text-xs font-black text-slate-800">{product.stock} <span className="text-[8px] text-slate-400 uppercase tracking-tighter">{product.sku}</span></p>
                </div>
                <button 
                  onClick={() => openRestock(product)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest active:bg-indigo-600 active:text-white transition-all flex items-center gap-2"
                >
                  <RefreshCw size={10} strokeWidth={3} /> {t('restock')}
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* DESKTOP ONLY TABLE VIEW */}
      <div className={`hidden lg:block bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('identity')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('volume')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('pricing')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-10 py-7">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800 leading-none mb-1">{product.name}</p>
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${product.stock <= product.lowStockThreshold ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <NumberCell value={product.stock} unit={product.sku} />
                  </div>
                </td>
                <td className="px-10 py-7">
                  <NumberCell value={product.sellingPrice} currency={currency} />
                </td>
                <td className="px-10 py-7 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {role === 'manager' && (
                      <button 
                        onClick={() => setItemToDelete(product)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => openRestock(product)}
                      className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] bg-[#f8fafc] text-slate-600 hover:bg-[#5252f2] hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      {t('restock')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: REGISTRATION (BOTTOM-SHEET ON MOBILE) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
           <div className="bg-white rounded-t-[40px] sm:rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6 sm:mb-8 sticky top-0 bg-white z-10 py-2">
                 <h3 className="text-xl sm:text-2xl font-black uppercase italic leading-none">{t('new_asset')}</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-300 hover:text-slate-500"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_asset_name')}</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 text-lg focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder={t('placeholder_asset_name')} />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_sku_unit')}</label>
                       <select value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none focus:ring-4 focus:ring-indigo-500/5 transition-all">
                          <option value="EA">EA - {t('unit_each')}</option>
                          <option value="PK">PK - {t('unit_pack')}</option>
                          <option value="BX">BX - {t('unit_box')}</option>
                          <option value="CTN">CTN - {t('unit_carton')}</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_initial_stock')}</label>
                       <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 text-lg focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_cost_price')} ({currency})</label>
                       <input type="number" required value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 text-lg focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_selling_price')} ({currency})</label>
                       <input type="number" required value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 text-lg focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 sm:py-6 bg-[#5252f2] text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all mt-4">
                   {t('btn_register')}
                 </button>
                 <div className="h-6 sm:hidden" /> {/* Padding for mobile keyboards */}
              </form>
           </div>
        </div>
      )}

      {/* Restock Modal (Dynamic height) */}
      {restockItem && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
           <div className="bg-white rounded-t-[40px] sm:rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase italic leading-none">{t('restock_title')}</h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{restockItem.name}</p>
                </div>
                <button onClick={() => setRestockItem(null)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleRestockSubmit} className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">{t('qty_to_add')}</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="number" required min="1" value={restockQty} onChange={e => setRestockQty(Number(e.target.value))} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 text-lg focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                    </div>
                 </div>

                 {role === 'manager' && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('new_cost')} ({currency})</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                          <input type="number" required min="0" value={newCost} onChange={e => setNewCost(Number(e.target.value))} className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('new_selling')} ({currency})</label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                          <input type="number" required min="0" value={newSelling} onChange={e => setNewSelling(Number(e.target.value))} className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
                        </div>
                     </div>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setRestockItem(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors uppercase">{t('cancel')}</button>
                    <button type="submit" disabled={isRestocking} className="flex-[2] py-4 bg-[#5252f2] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                      {isRestocking ? <Loader2 className="animate-spin" size={16} /> : <><RefreshCw size={14} strokeWidth={3} /> {t('confirm_restock')}</>}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Delete Confirmation Card (Redesigned per reference image) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white rounded-[48px] p-10 lg:p-14 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                <AlertTriangle size={36} strokeWidth={2.5} />
              </div>
              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">{t('delete_confirm_title')}</h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed px-2">
                  {t('delete_confirm_desc').replace('{name}', `'${itemToDelete.name}'`)}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleFinalDelete}
                  disabled={isDeleting}
                  className="w-full py-7 bg-[#e11d48] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl shadow-rose-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />} {t('delete_btn')}
                </button>
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="w-full py-4 text-slate-400 hover:text-slate-900 font-black uppercase tracking-[0.3em] text-[11px] transition-all"
                >
                  {t('cancel')}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;