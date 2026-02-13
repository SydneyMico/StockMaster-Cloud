import { ShoppingBag, Search, ShoppingCart, Plus, Minus, X, Trash2, ArrowRight, TrendingUp, ChevronUp, ChevronDown, PackagePlus, Zap, Download } from 'lucide-react';
import React, { useState } from 'react';
import { Product, Sale, Language, CurrencyCode } from '../types';
import { formatMoney } from '../App';

interface SalesViewProps {
  products: Product[];
  sales: Sale[];
  lang: Language;
  currency: CurrencyCode;
  onRecordSale: (productId: string, quantity: number, actualPrice: number) => void;
  isStandalone?: boolean;
  onInstall?: () => void;
}

const translations: Record<Language, any> = {
  en: {
    select_items: "Select items to sell",
    active_inv: "Active Inventory",
    view_cart: "View Cart",
    search_placeholder: "Search items for stock out removal...",
    add_to_cart: "Add to Cart",
    cart_title: "Stock Out Cart",
    add_more: "Add More",
    checkout_btn: "Complete",
    gross: "Gross",
    profit: "Profit",
    sales_nudge_title: "Faster Checkout",
    sales_nudge_desc: "2x Faster item selection and reliable searching in app mode.",
    sales_nudge_btn: "GET APP"
  },
  rw: {
    select_items: "Hitamo ibyo ugiye kugurisha",
    active_inv: "Ibiri mu bubiko",
    view_cart: "Reba ibyo wahisemo",
    search_placeholder: "Shakisha igicuruzwa hano...",
    add_to_cart: "Yongeramo hano",
    cart_title: "Ibicuruzwa wahisemo",
    add_more: "Yongeramo ibindi",
    checkout_btn: "Urangize",
    gross: "Amafaranga yose",
    profit: "Inyungu",
    sales_nudge_title: "Gura vuba",
    sales_nudge_desc: "Koresha App ubashe kugurisha byihuse inshuro ebyiri.",
    sales_nudge_btn: "YISHYIREMO"
  },
  fr: {
    select_items: "Sélectionnez les articles à vendre",
    active_inv: "Inventaire Actif",
    view_cart: "Voir le Panier",
    search_placeholder: "Rechercher des articles...",
    add_to_cart: "Ajouter au Panier",
    cart_title: "Panier de Sortie",
    add_more: "Ajouter Plus",
    checkout_btn: "Terminer",
    gross: "Brut",
    profit: "Bénéfice",
    sales_nudge_title: "Ventes Rapides",
    sales_nudge_desc: "Sélection d'articles 2x plus rapide en mode application.",
    sales_nudge_btn: "L'APPLI"
  }
};

interface CartItem {
  productId: string;
  name: string;
  costPrice: number;
  baseSellingPrice: number;
  actualPrice: number;
  quantity: number;
}

const SalesView: React.FC<SalesViewProps> = ({ products, sales, lang, currency, onRecordSale, isStandalone, onInstall }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        costPrice: product.costPrice,
        baseSellingPrice: product.sellingPrice,
        actualPrice: product.sellingPrice, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    if (newCart.length === 0) setIsModalOpen(false);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleQtyChange = (productId: string, value: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let num = parseInt(value) || 0;
    const finalQty = Math.max(0, Math.min(num, product.stock));
    
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: finalQty } : item
    ));
  };

  const handleCheckout = () => {
    const validItems = cart.filter(item => item.quantity > 0);
    if (validItems.length === 0) {
      alert(lang === 'rw' ? "Ingano igomba kuba nibura rimwe" : "Quantity must be at least 1");
      return;
    }
    validItems.forEach(item => onRecordSale(item.productId, item.quantity, item.actualPrice));
    setCart([]);
    setIsModalOpen(false);
  };

  const totalGross = cart.reduce((sum, item) => sum + (item.actualPrice * item.quantity), 0);
  const totalProfit = cart.reduce((sum, item) => sum + ((item.actualPrice - item.costPrice) * item.quantity), 0);

  return (
    <div className="animate-in fade-in duration-700 min-h-full text-left pb-24 lg:pb-12">
      <div className="w-full space-y-6 lg:space-y-8 px-1">
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="text-slate-400 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em]">{t('select_items')}</h3>
            <h2 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight uppercase italic lg:normal-case truncate">{t('active_inv')}</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {!isStandalone && (
              <button 
                onClick={onInstall}
                className="hidden sm:flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3.5 bg-indigo-50 text-[#5252f2] rounded-[18px] lg:rounded-2xl font-black text-[9px] uppercase tracking-widest border border-indigo-100 transition-all shadow-sm group"
              >
                <Zap size={14} className="group-hover:animate-pulse" />
                APP
              </button>
            )}
            {cart.length > 0 && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#5252f2] text-white px-5 lg:px-8 py-3.5 lg:py-4 rounded-[18px] lg:rounded-[24px] font-black text-xs lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-transform"
              >
                <ShoppingCart size={16} /> 
                <span className="sm:inline hidden">{t('view_cart')}</span>
                <span className="bg-white text-indigo-600 px-2 rounded-lg ml-1 font-mono">{cart.length}</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 lg:pl-16 pr-6 py-4 lg:py-5 bg-white border border-slate-200 rounded-[20px] lg:rounded-[32px] shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm lg:text-lg font-bold transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.productId === product.id);
            return (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className={`p-4 lg:p-6 bg-white rounded-[24px] lg:rounded-[40px] border-2 transition-all group relative active:scale-95 touch-manipulation ${product.stock <= 0 ? 'opacity-50 grayscale pointer-events-none' : 'cursor-pointer hover:border-indigo-500 hover:shadow-xl'}`}
                style={{ borderColor: inCart ? '#5252f2' : 'transparent' }}
              >
                {inCart && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#5252f2] text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2 border-white animate-in zoom-in-50">
                    {inCart.quantity}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 lg:mb-6 gap-2 lg:gap-0">
                  <div className={`w-9 h-9 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all shrink-0 ${inCart ? 'bg-[#5252f2] text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    <ShoppingBag size={inCart ? 18 : 20} />
                  </div>
                  <div className="lg:text-right text-left">
                    <p className="text-sm lg:text-xl font-black text-slate-900 leading-none">{formatMoney(product.sellingPrice, currency)}</p>
                    <p className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest mt-1 ${product.stock <= product.lowStockThreshold ? 'text-rose-500' : 'text-slate-400'}`}>
                      {product.stock} {product.sku}
                    </p>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 text-xs lg:text-lg leading-tight line-clamp-2 min-h-[2rem] lg:min-h-[2.5rem]">{product.name}</h4>
                <p className="hidden lg:block text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest italic">{t('add_to_cart')}</p>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white rounded-t-[40px] sm:rounded-[40px] w-full max-w-4xl sm:max-h-[85vh] h-[95vh] sm:h-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden">
            <div className="px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={18} strokeWidth={3} />
                </div>
                <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic lg:normal-case">{t('cart_title')}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 sm:px-4 py-2 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all flex items-center gap-2 font-black text-[8px] sm:text-[9px] uppercase tracking-widest border border-slate-100 sm:border-none"
                >
                  <PackagePlus size={16} /> <span className="hidden sm:inline">{t('add_more')}</span>
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-800 transition-all rounded-lg"><X size={24} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar space-y-4">
              {cart.map(item => (
                <div key={item.productId} className="px-4 sm:px-6 py-4 sm:py-6 rounded-[24px] sm:rounded-[32px] bg-slate-50/40 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                  <button 
                    onClick={() => removeFromCart(item.productId)} 
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                  >
                    <X size={14} strokeWidth={4} />
                  </button>
                  <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 lg:items-center">
                    <div className="lg:col-span-4 min-w-0">
                      <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mb-0.5 ml-1 italic lg:normal-case">Asset Identity</p>
                      <h4 className="text-sm sm:text-lg font-black text-slate-900 leading-tight truncate">{item.name}</h4>
                    </div>
                    <div className="lg:col-span-5">
                       <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2 italic lg:normal-case">Sale Price ({currency})</label>
                       <input 
                        type="number" 
                        value={item.actualPrice} 
                        inputMode="numeric"
                        onChange={(e) => setCart(prev => prev.map(i => i.productId === item.productId ? {...i, actualPrice: Number(e.target.value)} : i))} 
                        className="w-full bg-white border border-slate-200 rounded-[16px] lg:rounded-2xl px-4 py-3 lg:py-3.5 font-black text-slate-800 text-base sm:text-lg outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm" 
                       />
                    </div>
                    <div className="lg:col-span-3">
                      <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2 italic lg:normal-case">Quantity</label>
                      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-[16px] lg:rounded-2xl p-1 h-12 lg:h-[52px] focus-within:border-indigo-500 transition-all shadow-sm">
                        <button 
                          onClick={() => updateCartQty(item.productId, -1)} 
                          className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 touch-manipulation"
                        >
                          <Minus size={18} strokeWidth={4} />
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          inputMode="numeric"
                          onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                          onBlur={(e) => {
                             if (!e.target.value || e.target.value === '0') handleQtyChange(item.productId, '1');
                          }}
                          className="w-full text-center font-black text-slate-800 text-lg lg:text-xl outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        />
                        <button 
                          onClick={() => updateCartQty(item.productId, 1)} 
                          className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90 touch-manipulation"
                        >
                          <Plus size={18} strokeWidth={4} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 lg:px-8 py-6 lg:py-6 space-y-4 sm:space-y-6 border-t border-slate-50 bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] shrink-0 pb-10 sm:pb-8">
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch lg:items-center">
                <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-3.5 flex justify-between items-center border border-slate-100">
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('gross')}</span>
                  <p className="text-lg sm:text-2xl font-black text-slate-900">{formatMoney(totalGross, currency)}</p>
                </div>
                <div className="flex-1 bg-emerald-50 rounded-2xl px-5 py-3.5 flex justify-between items-center border border-emerald-100">
                  <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t('profit')}</span>
                  <p className="text-lg sm:text-2xl font-black text-emerald-600">{formatMoney(totalProfit, currency)}</p>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full py-4.5 sm:py-5 bg-[#5252f2] text-white rounded-[20px] sm:rounded-3xl font-black text-base sm:text-xl flex items-center justify-center gap-3 group shadow-2xl shadow-[#5252f2]/30 active:scale-[0.98] transition-all">
                {t('checkout_btn')} <ArrowRight size={20} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesView;