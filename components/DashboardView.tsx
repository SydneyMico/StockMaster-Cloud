
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, AlertTriangle, TrendingUp, ArrowDownRight, History, Crown, BarChart2, Smartphone, Download, Sparkles } from 'lucide-react';
import { Product, Sale, Role, PlanType, Language, CurrencyCode } from '../types';
import { formatMoney } from '../App';

interface DashboardViewProps {
  products: Product[];
  sales: Sale[];
  role: Role;
  plan: PlanType;
  lang: Language;
  currency: CurrencyCode;
  onUpgradeRequest: () => void;
  onInstallPrompt?: () => void;
  showInstallCard?: boolean;
}

const translations: Record<Language, any> = {
  en: {
    revenue: "REVENUE",
    revenue_sub: "FULL HISTORY",
    stock_value: "STOCK VALUE",
    stock_value_sub: "TOTAL",
    profit: "ESTIMATED PROFIT",
    profit_sub: "MARGIN",
    alerts: "ALERTS",
    alerts_sub: "LOW STOCK",
    performance: "SALES PERFORMANCE",
    removals: "DAILY REMOVALS VALUE TRACKING",
    quick_feed: "QUICK FEED",
    movement: "No movement",
    items: "ITEMS",
    upgrade_title: "UNLOCK BUSINESS PRO",
    upgrade_desc: "Remove item caps and enable professional PDF exports.",
    upgrade_btn: "UPGRADE NOW",
    install_title: "INSTALL NATIVE APP",
    install_desc: "Get 2x faster load times and offline sales tracking.",
    install_btn: "GET THE APP"
  },
  rw: {
    revenue: "INJIRAMA",
    revenue_sub: "AYABONEKANYE YOSE",
    stock_value: "AGACIRO K'IBUBIKO",
    stock_value_sub: "AGACIRO KOSE",
    profit: "INYUNGU",
    profit_sub: "INYUNGU NYAYO",
    alerts: "IBIZITIRA",
    alerts_sub: "IBIKE MU BUBIKO",
    performance: "IBYAKOZWE MU KUGURISHA",
    removals: "IGURISHWA RYA BURI MUNSI",
    quick_feed: "IBYAKOZWE VUBA",
    movement: "Nta kintu cyahindutse",
    items: "IBISIGAYE",
    upgrade_title: "GURA IY'UBUCURUZI",
    upgrade_desc: "Kuraho imipaka no gukora raporo za PDF.",
    upgrade_btn: "GURA UBU",
    install_title: "YISHYIREMO KURI TELEFONE",
    install_desc: "Kora byihuse kurushaho kandi ukure raporo udafite interineti.",
    install_btn: "YISHYIREMO"
  },
  fr: {
    revenue: "REVENUS",
    revenue_sub: "HISTORIQUE COMPLET",
    stock_value: "VALEUR DU STOCK",
    stock_value_sub: "VALEUR TOTALE",
    profit: "PROFIT ESTIMÉ",
    profit_sub: "MARGE",
    alerts: "ALERTES",
    alerts_sub: "STOCK BAS",
    performance: "PERFORMANCE DES VENTES",
    removals: "SUIVI QUOTIDIEN DES SORTIES",
    quick_feed: "FLUX RAPIDE",
    movement: "Aucun mouvement",
    items: "ARTICLES",
    upgrade_title: "DÉBLOQUER BUSINESS PRO",
    upgrade_desc: "Supprimer les limites et activer les exports PDF.",
    upgrade_btn: "AMÉLIORER",
    install_title: "INSTALLER L'APPLI",
    install_desc: "Vitesse multipliée par 2 et mode hors ligne actif.",
    install_btn: "TÉLÉCHARGER"
  }
};

const DashboardView: React.FC<DashboardViewProps> = ({ products, sales, role, plan, lang, currency, onUpgradeRequest, onInstallPrompt, showInstallCard }) => {
  const t = (key: string) => translations[lang][key] || key;
  
  const stats = useMemo(() => {
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);
    const totalSales = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
    const profit = sales.reduce((acc, s) => {
      const product = products.find(p => p.id === s.productId);
      const cost = product ? product.costPrice * s.quantity : 0;
      return acc + (s.totalAmount - cost);
    }, 0);

    return { totalInventoryValue, totalSales, lowStockCount, profit };
  }, [products, sales]);

  const chartData = useMemo(() => {
    const days = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
    return days.map((day, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days.length - 1 - i));
      const daySales = sales
        .filter(s => new Date(s.timestamp).toDateString() === d.toDateString())
        .reduce((sum, s) => sum + s.totalAmount, 0);
      return { name: day, sales: daySales };
    });
  }, [sales]);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Premium Upgrade & Install Flyers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {plan !== 'pro' && role === 'manager' ? (
          <div className="rounded-[40px] p-6 lg:p-10 text-white flex flex-col items-start justify-between gap-6 shadow-2xl bg-[#5252f2] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-4 lg:gap-6 relative z-10">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0 border border-white/10">
                <Crown size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg lg:text-2xl font-black tracking-tighter uppercase mb-0.5 leading-none italic">{t('upgrade_title')}</h3>
                <p className="text-xs lg:text-sm text-white/80 font-medium">{t('upgrade_desc')}</p>
              </div>
            </div>
            <button 
              onClick={onUpgradeRequest}
              className="w-full px-12 py-5 bg-white text-[#5252f2] rounded-3xl font-black text-[13px] uppercase tracking-[0.18em] shadow-xl hover:shadow-2xl transition-all shrink-0 active:scale-95"
            >
              {t('upgrade_btn')}
            </button>
          </div>
        ) : <div className="hidden" />}

        {showInstallCard && (
          <div className="rounded-[40px] p-6 lg:p-10 text-slate-900 flex flex-col items-start justify-between gap-6 shadow-2xl bg-white border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-4 lg:gap-6 relative z-10">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-50 rounded-[20px] flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
                <Smartphone size={28} className="text-[#5252f2] animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg lg:text-2xl font-black tracking-tighter uppercase mb-0.5 leading-none italic">{t('install_title')}</h3>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">{t('install_desc')}</p>
              </div>
            </div>
            <button 
              onClick={onInstallPrompt}
              className="w-full px-12 py-5 bg-[#5252f2] text-white rounded-3xl font-black text-[13px] uppercase tracking-[0.18em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-2xl transition-all shrink-0 active:scale-95 flex items-center justify-center gap-3"
            >
              <Download size={18} /> {t('install_btn')}
            </button>
          </div>
        )}
      </div>

      {/* Redesigned Stat Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard label={t('revenue')} value={stats.totalSales} currency={currency} isCurrency />
        <StatCard label={t('stock_value')} value={stats.totalInventoryValue} currency={currency} isCurrency />
        <StatCard label={t('profit')} value={stats.profit} currency={currency} isCurrency />
        <StatCard label={t('alerts')} value={stats.lowStockCount} unit={t('items')} warning={stats.lowStockCount > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 bg-white p-6 lg:p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden animate-in slide-in-from-left duration-1000">
          <div className="flex justify-between items-center mb-8 lg:mb-12">
            <div>
              <h3 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em]">{t('performance')}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{t('removals')}</p>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-500"><BarChart2 size={20} /></div>
          </div>
          <div className="h-[300px] lg:h-[400px] -mx-4 lg:-mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5252f2" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#5252f2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 800}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} width={40} />
                <Tooltip cursor={{ stroke: '#5252f2', strokeWidth: 1 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '11px' }} />
                <Area type="monotone" dataKey="sales" stroke="#5252f2" strokeWidth={5} fill="url(#colorSales)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 lg:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-[500px] lg:h-auto animate-in slide-in-from-right duration-1000">
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <h3 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em]">{t('quick_feed')}</h3>
            <History size={20} className="text-slate-300" />
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {sales.slice(0, 15).map((sale, i) => (
              <div key={sale.id} className="flex items-center justify-between p-4 rounded-[28px] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-105 transition-transform"><ArrowDownRight size={18} /></div>
                  <div>
                    <p className="text-[13px] font-black text-slate-800 leading-tight mb-0.5 truncate max-w-[120px]">{sale.productName}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">{sale.sellerName.split(' ')[0].toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-black text-slate-900 mb-0.5">-{sale.quantity}</p>
                  <p className="text-[10px] text-emerald-600 font-black tracking-tighter">{formatMoney(sale.totalAmount, currency)}</p>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                <Package size={56} className="mb-4" />
                <p className="text-[11px] font-black uppercase tracking-widest">{t('movement')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Redesigned StatCard to match the sleek screenshot style
const StatCard = ({ label, value, currency, unit, warning, isCurrency }: { label: string, value: number, currency?: CurrencyCode, unit?: string, warning?: boolean, isCurrency?: boolean }) => {
  return (
    <div className={`bg-white p-8 lg:p-10 rounded-[36px] shadow-sm border border-slate-100/60 flex flex-col justify-center items-start group hover:shadow-xl transition-all duration-500 relative overflow-hidden animate-in zoom-in-95 duration-700`}>
      {/* Background Decor */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-150 ${warning ? 'bg-rose-500' : 'bg-indigo-500'}`} />
      
      <h4 className="text-slate-400 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] mb-5 leading-none transition-colors group-hover:text-slate-500">
        {label}
      </h4>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none`}>
          {isCurrency ? formatMoney(value, currency || 'RWF') : value.toLocaleString()}
        </p>
        {unit && (
          <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {unit}
          </span>
        )}
      </div>
      
      {/* Warning highlight for Alerts */}
      {warning && (
        <div className="absolute top-4 right-8">
           <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        </div>
      )}
    </div>
  );
};

export default DashboardView;
