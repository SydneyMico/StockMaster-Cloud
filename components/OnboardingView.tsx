
import React, { useState } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Cloud, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Box,
  Download,
  Monitor,
  BarChart3,
  ShoppingCart,
  Smartphone,
  Star,
  Cpu,
  WifiOff,
  BellRing,
  SmartphoneNfc,
  X,
  LogIn,
  ArrowRight,
  Layers,
  MonitorCheck,
  ArrowUpRight,
  Banknote
} from 'lucide-react';
import Logo from './Logo';
import { Language, CurrencyCode, AuthMode } from '../types';
import { CURRENCIES, KwandaBranding } from '../App';

interface OnboardingViewProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onComplete: (mode?: AuthMode) => void;
  onInstall?: () => void;
  showInstall?: boolean;
}

const translations: Record<Language, any> = {
  en: {
    p1_title: "Global Setup", p1_sub: "Identity", p1_desc: "Welcome to StockMaster. Select your primary language to begin the enterprise configuration.",
    p_currency_title: "System Currency", p_currency_sub: "Financial Baseline", p_currency_desc: "Choose the official currency for your shop. This cannot be easily changed later without affecting existing data.",
    p2_title: "Cloud Sync", p2_sub: "Real-time Data", p2_desc: "Your data is secured in the cloud. Access your shop from any mobile or desktop device instantly.",
    p3_title: "Stock Mastery", p3_sub: "Inventory Logic", p3_desc: "Track items by SKU, Pack, or Carton. Professional stock level tracking with automated cost margins.",
    p4_title: "Sales Velocity", p4_sub: "Instant Sell", p4_desc: "A high-speed cart system for recording sales. Automated profit calculation and stock deduction.",
    p5_title: "Staff Governance", p5_sub: "Secure Access", p5_desc: "Approve staff via a secure Shop Code. Control who sees data and who records sales.",
    p6_title: "Ops Audit", p6_sub: "Deep Analysis", p6_desc: "Professional reporting and audit trails. Keep your business transparent and profitable.",
    p_install_title: "Native Speed", p_install_sub: "Highly Recommended", p_install_desc: "For the fastest terminal experience and offline access, we highly recommend installing the StockMaster app on your device.",
    p7_title: "Ready to Start?", p7_sub: "Join the StockMaster Network", p7_desc: "Secure your business data in the cloud today. Track sales, manage inventory, and grow your profits with a professional management ecosystem.",
    btn_next: "Next", btn_back: "Previous", btn_finish: "Create Account", footer: "StockMaster Cloud OS",
    skip: "Skip",
    signin: "Sign In",
    already_account: "Already have an account?",
    btn_install_now: "Install StockMaster App",
    btn_install_later: "Use Browser Instead",
    banner_install_text: "Get the Native App (2x Speed)",
    banner_install_btn: "INSTALL"
  },
  rw: {
    p1_title: "Imiterere y'Iduka", p1_sub: "Umwirondoro", p1_desc: "Murakaza neza kuri StockMaster. Hitamo ururimi ugiye gukoresha ubu kugira ngo dutangire.",
    p_currency_title: "Ifaranga rya Sisitemu", p_currency_sub: "Imari", p_currency_desc: "Hitamo ifaranga ruzaba rukoreshwa mu iduka ryawe.",
    p2_title: "Cloud ya StockMaster", p2_sub: "Bika muri Cloud", p2_desc: "Amakuru yawe abitswe neza. Reba uko iduka ryifashe kuri telefone cyangwa mudasobwa aho ariho hose.",
    p3_title: "Ubumenyi bw'Ibicuruzwa", p3_sub: "Gucunga Ububiko", p3_desc: "Andika ibicuruzwa byawe mu buryo bw'umwuga. Menya neza ibisigaye n'inyungu ukuramo.",
    p4_title: "Kugurisha Byihuse", p4_sub: "Gura vuba", p4_desc: "Koresha agaseke kagezweho kugira ngo ugurishe vuba. Sisitemu ibara inyungu mu buryo bwikora.",
    p5_title: "Abakozi Bemewe", p5_sub: "Ubugenzuzi", p5_desc: "Manadjeri niwe wemeza abakozi bakoresheje Kode. Ni wowe ugena ufite uburenganzira bwo kwinjira.",
    p6_title: "Isesengura Ryimbitse", p6_sub: "Raporo Z'ubucuruzi", p6_desc: "Raporo zumwuga zikwereka uko ubucuruzi bwifashe kugirango wunguke cyane.",
    p_install_title: "Yihuta Cyane", p_install_sub: "Nibyo Byiza", p_install_desc: "Kugirango ukore akazi kawe neza kandi vuba ndetse no mubihe udafite interineti, turakugira inama yo gushyira iyi App kuri telefone yawe.",
    p7_title: "Witeguye Gutangira?", p7_sub: "Injira mu muryango w'ubucuruzi", p7_desc: "Bika amakuru y'ubucuruzi bwawe neza. Genzura ibicuruzwa n'igurisha, kandi ubashe kubona inyungu zawe mu buryo bworoshye.",
    btn_next: "Komeza", btn_back: "Subira inyuma", btn_finish: "Fungura Iduka", footer: "StockMaster Cloud OS",
    skip: "Simbuka",
    signin: "Injira",
    already_account: "Ufite konti?",
    btn_install_now: "Yishyiremo ubu",
    btn_install_later: "Nzayishyiramo nyuma",
    banner_install_text: "Yihuta inshuro 2 - Yishyiremo",
    banner_install_btn: "INSTALL"
  },
  fr: {
    p1_title: "Configuration", p1_sub: "Identité", p1_desc: "Bienvenue sur StockMaster. Sélectionnez votre langue principale pour commencer la configuration.",
    p_currency_title: "Devise Système", p_currency_sub: "Base Financière", p_currency_desc: "Choisissez la devise officielle de votre magasin.",
    p2_title: "Infrastructure Cloud", p2_sub: "Synchro Totale", p2_desc: "Vos données sont sécurisées dans le cloud. Accédez à votre magasin depuis n'importe quel appareil.",
    p3_title: "Intelligence Stocks", p3_sub: "Maîtrise Inventaire", p3_desc: "Suivez les articles par SKU. Ne perdez plus jamais de vue vos niveaux de stock ou vos marges.",
    p4_title: "Vélocité Ventes", p4_sub: "Vendez Vite", p4_desc: "Un système de panier rapide pour enregistrer les sorties. Calcul automatique des profits.",
    p5_title: "Gouvernance Staff", p5_sub: "Contrôle Accès", p5_desc: "Les gérants approuvent le personnel via un code sécurisé. Vous décidez qui accède aux données.",
    p6_title: "Audit Opérations", p6_sub: "Analyse Pro", p6_desc: "Rapports professionnels et pistes d'audit pour une transparence et une rentabilité accrues.",
    p_install_title: "Vitesse Native", p_install_sub: "Hautement Recommandé", p_install_desc: "Pour l'expérience la plus rapide et l'accès hors ligne, nous vous recommandons vivement d'installer l'application StockMaster sur votre appareil.",
    p7_title: "Prêt à Commencer ?", p7_sub: "Rejoignez le réseau StockMaster", p7_desc: "Sécurisez vos données commerciales dans le cloud dès aujourd'hui. Gérez vos ventes et vos stocks en toute simplicité.",
    btn_next: "Suivant", btn_back: "Retour", btn_finish: "Créer Magasin", footer: "StockMaster Cloud OS",
    skip: "Sauter",
    signin: "Connexion",
    already_account: "Vous avez déjà un compte ?",
    btn_install_now: "Installer l'App",
    btn_install_later: "Plus tard",
    banner_install_text: "2x Plus Rapide - Installer l'App",
    banner_install_btn: "INSTALL"
  }
};

const OnboardingView: React.FC<OnboardingViewProps> = ({ lang, setLang, onComplete, onInstall, showInstall }) => {
  const [step, setStep] = useState(1);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>((localStorage.getItem('stockmaster_pref_currency') as CurrencyCode) || 'RWF');
  const t = (key: string) => translations[lang][key] || key;

  const handleCurrencySelect = (code: CurrencyCode) => {
    setSelectedCurrency(code);
    localStorage.setItem('stockmaster_pref_currency', code);
  };

  const handleFinish = (mode: AuthMode = 'login') => {
    localStorage.setItem('stockmaster_onboarding_completed', 'true');
    onComplete(mode);
  };

  const steps = [
    // 1. Blue
    { id: 'language', title: t('p1_title'), subtitle: t('p1_sub'), desc: t('p1_desc'), icon: <Globe />, color: "from-blue-600 to-blue-800", accent: "text-white", isLight: false },
    // 2. Light Gray
    { id: 'currency', title: t('p_currency_title'), subtitle: t('p_currency_sub'), desc: t('p_currency_desc'), icon: <Banknote />, color: "from-slate-100 to-slate-300", accent: "text-slate-900", isLight: true },
    // 3. Charcoal Gray
    { id: 'cloud', title: t('p2_title'), subtitle: t('p2_sub'), desc: t('p2_desc'), icon: <Cloud />, color: "from-slate-700 to-slate-900", accent: "text-slate-100", isLight: false },
    // 4. Teal
    { id: 'inventory', title: t('p3_title'), subtitle: t('p3_sub'), desc: t('p3_desc'), icon: <Box />, color: "from-teal-600 to-teal-800", accent: "text-teal-100", isLight: false },
    // 5. Mint Green
    { id: 'sales', title: t('p4_title'), subtitle: t('p4_sub'), desc: t('p4_desc'), icon: <ShoppingCart />, color: "from-emerald-100 to-emerald-300", accent: "text-emerald-900", isLight: true },
    // 6. Emerald Green
    { id: 'team', title: t('p5_title'), subtitle: t('p5_sub'), desc: t('p5_desc'), icon: <ShieldCheck />, color: "from-emerald-600 to-emerald-800", accent: "text-emerald-100", isLight: false },
    // 7. Purple
    { id: 'audit', title: t('p6_title'), subtitle: t('p6_sub'), desc: t('p6_desc'), icon: <BarChart3 />, color: "from-purple-600 to-purple-800", accent: "text-purple-100", isLight: false },
    // 8. Lavender
    { id: 'install', title: t('p_install_title'), subtitle: t('p_install_sub'), desc: t('p_install_desc'), icon: <MonitorCheck />, color: "from-indigo-100 to-violet-200", accent: "text-violet-900", isLight: true },
    // 9. Turquoise
    { id: 'final', title: t('p7_title'), subtitle: t('p7_sub'), desc: t('p7_desc'), icon: <Monitor />, color: "from-cyan-400 to-teal-500", accent: "text-cyan-100", isLight: false }
  ];

  const visibleSteps = steps.filter(s => s.id !== 'install' || showInstall); 
  const current = visibleSteps[step - 1] || visibleSteps[0];
  const totalSteps = visibleSteps.length;
  const isFinalStep = step === totalSteps;
  const isInstallStep = current?.id === 'install';

  const showGlobalBanner = showInstall && bannerVisible && !isInstallStep && !isFinalStep;

  // Text color based on contrast flag
  const textColorClass = current.isLight ? 'text-slate-900' : 'text-white';
  const descColorClass = current.isLight ? 'text-slate-600' : 'text-white/70';
  const dotActiveClass = current.isLight ? 'bg-slate-900' : 'bg-white';
  const dotInactiveClass = current.isLight ? 'bg-slate-300' : 'bg-white/30';
  const buttonBgClass = current.isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const ghostButtonClass = current.isLight ? 'bg-slate-900/10 text-slate-900 border-slate-900/10 hover:bg-slate-900/20' : 'bg-white/10 text-white border-white/10 hover:bg-white/20';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${current.color} flex flex-col font-sans overflow-hidden transition-all duration-700 relative ${textColorClass} text-left`}>
      {showGlobalBanner && (
        <div className="bg-white/95 backdrop-blur-md border-b border-white/10 py-3 px-6 animate-in slide-in-from-top duration-700 relative z-[100] shadow-lg">
           <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
                    <Smartphone size={20} className="text-indigo-600 animate-pulse" />
                 </div>
                 <div className="hidden sm:block">
                    <p className="text-[#02040a] text-[11px] font-black uppercase tracking-tight mb-1">{t('banner_install_text')}</p>
                    <div className="flex items-center gap-1.5">
                       <Zap size={10} className="text-indigo-500 fill-indigo-500" />
                       <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">PERFORMANCE BOOST</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={onInstall} className="px-6 py-2.5 bg-[#5252f2] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 group"><Download size={14} strokeWidth={3} />{t('banner_install_btn')}</button>
                 <button onClick={() => setBannerVisible(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={18} /></button>
              </div>
           </div>
        </div>
      )}

      <header className={`pt-8 px-6 flex flex-col items-center gap-6 relative z-50 ${showGlobalBanner ? 'mt-0' : ''}`}>
        <div className="flex gap-2.5">
          {visibleSteps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${(i + 1) === step ? `w-10 ${dotActiveClass}` : `w-2.5 ${dotInactiveClass}`}`} />
          ))}
        </div>
        {!isFinalStep && (
          <button onClick={() => handleFinish('login')} className={`absolute top-6 right-6 px-5 py-2 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${ghostButtonClass}`}>
            {t('skip')}
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-8">
        <div className="relative mb-10 lg:mb-14">
          <div className={`absolute -top-6 -left-6 w-24 h-24 ${current.isLight ? 'bg-slate-900/5' : 'bg-white/5'} rounded-full blur-xl animate-pulse`} />
          <div className={`absolute -bottom-4 -right-8 w-32 h-32 ${current.isLight ? 'bg-slate-900/10' : 'bg-white/10'} rounded-full blur-2xl animate-bounce duration-[5000ms]`} />
          <div 
            key={`icon-${step}`}
            className={`relative z-10 w-44 h-44 lg:w-56 lg:h-56 ${current.isLight ? 'bg-slate-900/5 border-slate-900/10' : 'bg-white/10 border-white/20'} rounded-full border backdrop-blur-xl flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-700`}
          >
            <div className={`w-32 h-32 lg:w-40 lg:h-40 ${current.isLight ? 'bg-slate-900/5' : 'bg-white/5'} rounded-full flex items-center justify-center`}>
              {React.cloneElement(current.icon as React.ReactElement<any>, { size: 64, strokeWidth: 1.5, className: textColorClass })}
            </div>
          </div>
          {isInstallStep && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">RECOMMENDED</div>
          )}
        </div>

        <div key={`text-${step}`} className="space-y-4 lg:space-y-6 max-w-sm lg:max-w-2xl animate-in slide-in-from-bottom-8 duration-700">
          <h2 className={`text-4xl lg:text-6xl font-black tracking-tighter leading-none uppercase italic ${textColorClass}`}>{current.title}</h2>
          <p className={`${current.accent} text-lg lg:text-2xl font-black uppercase tracking-[0.1em] opacity-90`}>{current.subtitle}</p>
          <p className={`${descColorClass} text-[15px] lg:text-lg font-medium leading-relaxed px-4`}>{current.desc}</p>
        </div>

        {current.id === 'language' && (
          <div className="grid grid-cols-1 gap-3 mt-10 w-full max-w-[14rem] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {(['en', 'rw', 'fr'] as Language[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`py-4 rounded-full border-2 transition-all flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-widest ${lang === l ? 'bg-white text-slate-900 border-white shadow-2xl scale-105' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}>
                <span>{l === 'en' ? 'English' : l === 'rw' ? 'Kinyarwanda' : 'Français'}</span>
              </button>
            ))}
          </div>
        )}

        {current.id === 'currency' && (
          <div className="grid grid-cols-1 gap-3 mt-10 w-full max-w-[18rem] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {(Object.entries(CURRENCIES) as [CurrencyCode, any][]).map(([code, data]) => (
              <button key={code} onClick={() => handleCurrencySelect(code)} className={`px-6 py-4 rounded-full border-2 transition-all flex items-center justify-between gap-4 font-black uppercase text-[10px] tracking-widest ${selectedCurrency === code ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105' : 'bg-slate-900/5 text-slate-500 border-slate-900/10 hover:bg-slate-900/10'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{data.flag}</span>
                  <span>{data.name}</span>
                </div>
                <span className="opacity-60">{data.symbol}</span>
              </button>
            ))}
          </div>
        )}

        {isInstallStep && (
          <div className="flex flex-col gap-5 mt-12 w-full max-w-xs animate-in slide-in-from-bottom-6 duration-1000">
             <button onClick={onInstall} className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"><Download size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />{t('btn_install_now')}</button>
             <button onClick={() => setStep(step + 1)} className="w-full py-4 text-slate-500 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all">{t('btn_install_later')}</button>
          </div>
        )}
      </main>

      <footer className="px-8 pb-16 flex flex-col items-center gap-8 lg:max-w-xl lg:mx-auto lg:w-full">
        {isFinalStep ? (
          <div className="w-full flex flex-col gap-4 animate-in slide-in-from-bottom-12 duration-700">
            <button onClick={() => handleFinish('login')} className={`w-full py-6 backdrop-blur-xl border rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group ${ghostButtonClass}`}>
              <LogIn size={20} /><span>{t('signin')}</span>
            </button>
            <button onClick={() => handleFinish('new-shop')} className={`w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group ${buttonBgClass}`}>
              <span>{t('btn_finish')}</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        ) : !isInstallStep && (
          <div className="w-full flex items-center justify-between">
            <button onClick={() => step > 1 && setStep(step - 1)} className={`p-6 rounded-full border transition-all active:scale-90 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${ghostButtonClass}`}><ChevronLeft size={24} /></button>
            <button onClick={() => step < totalSteps ? setStep(step + 1) : handleFinish('new-shop')} className={`px-14 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 flex items-center justify-center gap-3 group ${buttonBgClass}`}><span>{t('btn_next')}</span><ChevronRight size={18} strokeWidth={3} /></button>
            <button onClick={() => step < totalSteps && setStep(step + 1)} className={`p-6 rounded-full border transition-all active:scale-90 ${step === totalSteps ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${ghostButtonClass}`}><ChevronRight size={24} /></button>
          </div>
        )}
        
        {/* ONBOARDING FOOTER BRANDING */}
        <KwandaBranding className={current.isLight ? 'opacity-20' : 'opacity-40'} />
      </footer>
    </div>
  );
};

export default OnboardingView;
