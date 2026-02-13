
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Key, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Globe, 
  ChevronDown,
  X,
  Download,
  ShieldCheck,
  HelpCircle,
  Building2,
  Users,
  MessageCircle,
  Phone,
  ExternalLink,
  Smartphone,
  Zap,
  Sparkles,
  MonitorCheck,
  Banknote,
  Headset
} from 'lucide-react';
import { User as UserType, Language, CurrencyCode, AuthMode, UserStatus } from '../types';
import { supabase } from '../supabase';
import Logo from './Logo';
import ForgotPasswordView from './ForgotPasswordView';
import { CURRENCIES, KwandaBranding } from '../App';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onInstall?: () => Promise<boolean>;
  isInstallable?: boolean;
  showInstall?: boolean;
  onShowTour: () => void;
  initialMode?: AuthMode;
}

const translations: Record<Language, any> = {
  en: {
    title: "StockMaster Cloud",
    subtitle: "BUSINESS MANAGEMENT SOFTWARE",
    signin: "Sign In",
    new_shop: "New Shop",
    staff_join: "Staff Join",
    email_user: "EMAIL / USERNAME",
    password: "PASSWORD",
    secure_login: "SIGN IN",
    download_app: "DOWNLOAD APP",
    forgot: "FORGOT?",
    help: "HELP?",
    view_tour: "VIEW APP TOUR",
    install_title: "Install App",
    install_desc: "Add StockMaster to your device for a faster, native experience.",
    install_btn: "Install Now",
    cancel: "Cancel",
    shop_name: "Shop Name",
    full_name: "Your Full Name",
    confirm_password: "Confirm Password",
    shop_code: "Shop Access Code",
    currency: "Currency",
    create_account: "Create Business",
    request_access: "Request Access",
    support_title: "Technical Support",
    support_sub: "Direct assistance hub",
    support_desc: "Having trouble? Connect with our technical operators instantly.",
    whatsapp: "WhatsApp Support",
    call: "Help Line",
    email: "Official Email",
    login_promo_title: "Native Terminal",
    login_promo_desc: "2x Faster performance & offline access",
    login_promo_btn: "INSTALL NOW"
  },
  rw: {
    title: "StockMaster Cloud",
    subtitle: "POROGARAMU Y'UBUCURUZI",
    signin: "INJIRA",
    new_shop: "IDUKA RISHYA",
    staff_join: "ABAKOZI",
    email_user: "IMEYILI / IZINA",
    password: "IJAMBO RY'IBANGA",
    secure_login: "INJIRA",
    download_app: "DOWNLOAD APP",
    forgot: "WARYIBAGIWE?",
    help: "UBUFASHA?",
    view_tour: "REBA UKO IKORA",
    install_title: "YISHYIREMO UBU",
    install_desc: "Shyira StockMaster kuri telefone cyangwa mudasobwa kugira ngo ukore neza.",
    install_btn: "Yishyiremo ubu",
    cancel: "Reka",
    shop_name: "Izina ry'Iduka",
    full_name: "Amazina yawe",
    confirm_password: "Emeza ijambo ry'ibanga",
    shop_code: "Kode y'Iduka",
    currency: "Ifaranga",
    create_account: "Fungura Iduka",
    request_access: "Saba Kwinjira",
    support_title: "Ubufasha bwa Tekiniki",
    support_sub: "Vugana natwe ubu",
    support_desc: "Ufite ikibazo cyo kwinjira? Twandikire cyangwa uduhamagare ubu.",
    whatsapp: "WhatsApp y'Ubufasha",
    call: "Hamagara ubufasha",
    email: "Imeyili",
    login_promo_title: "App ya StockMaster",
    login_promo_desc: "Yihuta inshuro 2 kandi ikora nta interineti",
    login_promo_btn: "YISHYIREMO"
  },
  fr: {
    title: "StockMaster Cloud",
    subtitle: "LOGICIEL DE GESTION COMMERCIALE",
    signin: "CONNEXION",
    new_shop: "NOUVEAU MAGASIN",
    staff_join: "REJOINDRE",
    email_user: "EMAIL / UTILISATEUR",
    password: "MOT DE PASSE",
    secure_login: "CONNEXION",
    download_app: "INSTALLER L'APP",
    forgot: "OUBLIÉ?",
    help: "AIDE?",
    view_tour: "VOIR LE TOUR",
    install_title: "Installer l'App",
    install_desc: "Ajoutez StockMaster à votre appareil pour une expérience native plus rapide.",
    install_btn: "Installer",
    cancel: "Annuler",
    shop_name: "Nom du Magasin",
    full_name: "Votre Nom Complet",
    confirm_password: "Confirmer Mot de Passe",
    shop_code: "Code du Magasin",
    currency: "Devise",
    create_account: "Créer Magasin",
    request_access: "Demander Accès",
    support_title: "Support Technique",
    support_sub: "Assistance directe",
    support_desc: "Un problème ? Contactez nos techniciens immédiatement.",
    whatsapp: "Support WhatsApp",
    call: "Ligne d'aide",
    email: "Email Officiel",
    login_promo_title: "Mode Standalone",
    login_promo_desc: "Vitesse x2 & accès hors-ligne",
    login_promo_btn: "INSTALLER"
  }
};

const LoginView: React.FC<LoginViewProps> = ({ onLogin, lang, setLang, onInstall, isInstallable, showInstall, onShowTour, initialMode }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [mode, setMode] = useState<AuthMode>(initialMode || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportInfo, setSupportInfo] = useState({ whatsapp: '', phone: '', email: '' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState('');
  const [shopCode, setShopCode] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>((localStorage.getItem('stockmaster_pref_currency') as CurrencyCode) || 'RWF');

  const confirmInstall = async () => {
    if (onInstall) {
      const result = await onInstall();
      if (result) setShowInstallModal(false);
    }
  };

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const { data } = await supabase.from('system_configs').select('*');
        if (data) {
          setSupportInfo({
            whatsapp: data.find(c => c.key === 'support_whatsapp')?.value || '0795009861',
            phone: data.find(c => c.key === 'support_phone')?.value || '0795009861',
            email: data.find(c => c.key === 'support_email')?.value || 'support@stockmaster.rw'
          });
        }
      } catch (err) {}
    };
    fetchSupport();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const inputEmail = email.toLowerCase().trim();
    const inputPass = password.trim();

    try {
      if (mode === 'login') {
        // ADMIN ACCESS CHECK
        if (inputEmail === 'admin' && inputPass === 'mico') {
          onLogin({
            id: 'central-admin-mico',
            name: 'Mico (Central Admin)',
            email: 'admin@stockmaster.app',
            role: 'super-admin',
            companyId: 'SYSTEM_CENTRAL',
            status: 'active',
            companyName: 'StockMaster Cloud Hub'
          });
          return;
        }
        const { data: profile, error: loginErr } = await supabase.from('profiles').select('*').eq('email', inputEmail).eq('password', inputPass).maybeSingle();
        if (loginErr) throw loginErr;
        if (!profile) throw new Error(lang === 'rw' ? "Imeyili cyangwa ijambo ry'ibanga siri ryo." : "Invalid email or password.");
        const { data: company } = await supabase.from('companies').select('name, currency').eq('id', profile.company_id).single();
        onLogin({
          id: profile.id, name: profile.name, email: profile.email, role: profile.role, companyId: profile.company_id,
          status: profile.status as UserStatus, companyName: company?.name, currency: company?.currency as CurrencyCode
        });
      } else if (mode === 'new-shop') {
        const genShopId = `SM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { error: compErr } = await supabase.from('companies').insert([{ id: genShopId, name: shopName.trim(), currency: currency }]);
        if (compErr) throw compErr;
        const { error: profErr } = await supabase.from('profiles').insert([{ name: fullName.trim(), email: inputEmail, password: inputPass, role: 'manager', company_id: genShopId, status: 'active' }]);
        if (profErr) throw profErr;
        onLogin({ id: 'temp-id', name: fullName.trim(), email: inputEmail, role: 'manager', companyId: genShopId, status: 'active', companyName: shopName.trim(), currency: currency });
      } else if (mode === 'staff') {
        const cleanCode = shopCode.trim().toUpperCase();
        const { data: company, error: compErr } = await supabase.from('companies').select('name').eq('id', cleanCode).maybeSingle();
        if (compErr) throw compErr;
        if (!company) throw new Error(lang === 'rw' ? "Kode y'iduka ntiyabonetse." : "Invalid Shop Access Code.");
        const { error: profErr } = await supabase.from('profiles').insert([{ name: fullName.trim(), email: inputEmail, password: inputPass, role: 'worker', company_id: cleanCode, status: 'pending' }]);
        if (profErr) throw profErr;
        onLogin({ id: 'temp-id', name: fullName.trim(), email: inputEmail, role: 'worker', companyId: cleanCode, status: 'pending', companyName: company.name });
      }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  if (mode === 'forgot') return <ForgotPasswordView lang={lang} onBack={() => setMode('login')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] sm:rounded-[56px] shadow-2xl overflow-hidden relative z-10 border border-slate-100 animate-in zoom-in-95 duration-500">
        
        <div className="hidden lg:flex flex-col bg-[#02040a] text-white p-12 lg:p-16 justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                 <Logo size={48} className="shadow-lg shadow-indigo-600/20" />
                 <h2 className="text-xl font-black tracking-tighter uppercase italic">StockMaster</h2>
              </div>
              <div className="space-y-6">
                 <h1 className="text-5xl font-black tracking-tighter leading-[0.95] uppercase italic">The Next<br/><span className="text-indigo-500">Generation</span><br/>Inventory OS.</h1>
                 <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">Professional tracking for modern shops. Real-time sync, deep analytics, and native performance.</p>
              </div>
           </div>

           <div className="relative z-10 space-y-8">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center"><MonitorCheck size={20} className="text-indigo-400" /></div>
                    <Sparkles size={16} className="text-indigo-300 animate-pulse" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest mb-1">{t('login_promo_title')}</h4>
                 <p className="text-[11px] text-slate-400 font-medium">{t('login_promo_desc')}</p>
                 <button onClick={() => setShowInstallModal(true)} className="mt-6 w-full py-4 bg-[#5252f2] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"><Download size={14} strokeWidth={3} /> {t('login_promo_btn')}</button>
              </div>
              <div className="flex items-center gap-4 opacity-40">
                 <ShieldCheck size={20} className="text-indigo-400" />
                 <p className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Banking-Grade Cloud Link</p>
              </div>
           </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-16 flex flex-col">
          <header className="flex items-center justify-between mb-10">
             <div className="lg:hidden flex items-center gap-3">
                <Logo size={32} />
                <h2 className="text-sm font-black tracking-tighter uppercase italic">StockMaster</h2>
             </div>
             <div className="relative">
                <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all">
                   <Globe size={14} className="text-indigo-600" /> {lang.toUpperCase()} <ChevronDown size={12} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-3 w-40 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                     {(['en', 'rw', 'fr'] as Language[]).map(l => (
                        <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">{l === 'en' ? 'English' : l === 'rw' ? 'Kinyarwanda' : 'Français'}</button>
                     ))}
                  </div>
                )}
             </div>
          </header>

          <div className="mb-10 text-left">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">{t('title')}</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic">{t('subtitle')}</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-[24px] mb-8 shadow-inner">
             {(['login', 'new-shop', 'staff'] as AuthMode[]).map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(null); }} className={`flex-1 py-3.5 rounded-[20px] text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                   {t(m.replace('-', '_') as any)}
                </button>
             ))}
          </div>

          <form onSubmit={handleAuth} noValidate className="space-y-5 flex-1">
             {error && (
               <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in shake duration-300">
                  <ShieldCheck size={18} /> {error}
               </div>
             )}

             {mode === 'new-shop' && (
                <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 text-left">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('shop_name')}</label>
                   <div className="relative">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" required value={shopName} onChange={e => setShopName(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                   </div>
                </div>
             )}

             {(mode === 'new-shop' || mode === 'staff') && (
                <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 text-left">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('full_name')}</label>
                   <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                   </div>
                </div>
             )}

             {mode === 'staff' && (
                <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 text-left">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('shop_code')}</label>
                   <div className="relative">
                      <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" placeholder="SM-XXXXXX" required value={shopCode} onChange={e => setShopCode(e.target.value.toUpperCase())} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-indigo-600 tracking-widest focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                   </div>
                </div>
             )}

             <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('email_user')}</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type="text" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                </div>
             </div>

             <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between px-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('password')}</label>
                   {mode === 'login' && <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">{t('forgot')}</button>}
                </div>
                <div className="relative">
                   <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>
             </div>

             {mode === 'new-shop' && (
                <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 text-left">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('currency')}</label>
                   <div className="relative">
                      <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <select value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)} className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none focus:ring-4 focus:ring-indigo-500/5 transition-all">
                         {Object.entries(CURRENCIES).map(([code, data]) => (
                            <option key={code} value={code}>{data.flag} {code} - {data.name}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                   </div>
                </div>
             )}

             <button disabled={loading} type="submit" className="w-full py-5 bg-[#5252f2] text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 group">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                   <>
                      {mode === 'login' ? t('secure_login') : mode === 'new-shop' ? t('create_account') : t('request_access')}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                )}
             </button>
          </form>

          <footer className="mt-12 flex flex-col items-center gap-10">
             <div className="flex items-center gap-2">
                <button 
                  onClick={onShowTour} 
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#f1f5f9]/60 hover:bg-[#e2e8f0] border border-transparent hover:border-[#cbd5e1] text-[#94a3b8] hover:text-[#475569] transition-all group active:scale-95"
                >
                   <Zap size={14} className="group-hover:fill-current group-hover:text-amber-500 transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('view_tour')}</span>
                </button>
                
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                
                <button 
                  onClick={() => setShowHelpModal(true)} 
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#f1f5f9]/60 hover:bg-[#e2e8f0] border border-transparent hover:border-[#cbd5e1] text-[#94a3b8] hover:text-[#475569] transition-all group active:scale-95"
                >
                   <HelpCircle size={14} className="group-hover:text-[#5252f2] transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('help')}</span>
                </button>
             </div>
             
             <KwandaBranding />
          </footer>
        </div>
      </div>

      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/60 backdrop-blur-md">
           <div className="bg-white rounded-t-[40px] sm:rounded-[48px] p-10 sm:p-14 max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner"><MonitorCheck size={40} /></div>
              <div className="text-center mb-10">
                 <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">{t('install_title')}</h3>
                 <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed px-4">{t('install_desc')}</p>
              </div>
              <div className="flex flex-col gap-4">
                 <button onClick={confirmInstall} className="w-full py-6 bg-[#5252f2] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"><Download size={18} strokeWidth={3} /> {t('install_btn')}</button>
                 <button onClick={() => setShowInstallModal(false)} className="w-full py-4 text-slate-400 hover:text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] transition-all">{t('cancel')}</button>
              </div>
           </div>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/60 backdrop-blur-md">
           <div className="bg-white rounded-t-[40px] sm:rounded-[48px] p-10 sm:p-12 max-w-2xl w-full shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 relative">
              <button onClick={() => setShowHelpModal(false)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center shadow-inner shrink-0"><Headset size={36} /></div>
                 <div className="text-left"><h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{t('support_title')}</h3><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{t('support_sub')}</p></div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 text-left italic">"{t('support_desc')}"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <SupportLink icon={<MessageCircle size={20} />} label={t('whatsapp')} value={supportInfo.whatsapp} link={`https://wa.me/${supportInfo.whatsapp}`} color="text-emerald-600" bg="bg-emerald-50" />
                 <SupportLink icon={<Phone size={20} />} label={t('call')} value={supportInfo.phone} link={`tel:${supportInfo.phone}`} color="text-indigo-600" bg="bg-indigo-50" />
              </div>
              <div className="w-full"><SupportLink icon={<Mail size={20} />} label={t('email')} value={supportInfo.email} link={`mailto:${supportInfo.email}`} color="text-rose-600" bg="bg-rose-50" /></div>
              
              <KwandaBranding className="mt-12" />
           </div>
        </div>
      )}
    </div>
  );
};

const SupportLink = ({ icon, label, value, link, color, bg }: { icon: React.ReactNode, label: string, value: string, link: string, color: string, bg: string }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-5 group hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all">
     <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
     <div className="text-left overflow-hidden"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p><p className="text-sm font-black text-slate-800 truncate flex items-center gap-2">{value} <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" /></p></div>
  </a>
);

export default LoginView;
