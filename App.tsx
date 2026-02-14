
/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Search,
  Copy,
  CheckCircle2,
  Users,
  Gem,
  ArrowUpCircle,
  Zap,
  Crown,
  History,
  UserX,
  Download,
  Globe,
  ChevronDown,
  Monitor,
  HelpCircle,
  AlertTriangle,
  Clock,
  Bell,
  X,
  ShieldAlert,
  Menu,
  Share2,
  RefreshCw,
  BookOpen,
  Smartphone,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  ArrowUpRight,
  MonitorCheck,
  Shield
} from 'lucide-react';
import { Product, Sale, User, UserStatus, PlanType, ActivityLog, Language, CurrencyCode, AuthMode } from './types';
import { supabase } from './supabase';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import ReportsView from './components/ReportsView';
import WorkersView from './components/WorkersView';
import LoginView from './components/LoginView';
import OnboardingView from './components/OnboardingView';
import PendingApprovalView from './components/PendingApprovalView';
import SubscriptionView from './components/SubscriptionView';
import AdminDashboard from './components/AdminDashboard';
import ActivityLogsView from './components/ActivityLogsView';
import ResetPasswordView from './components/ResetPasswordView';
import SupportView from './components/SupportView';
import ManualView from './components/ManualView';
import Logo from './components/Logo';

// Global Currency Utilities
export const CURRENCIES: Record<CurrencyCode, { symbol: string, name: string, flag: string }> = {
  RWF: { symbol: 'Rwf', name: 'Rwandan Franc', flag: '🇷🇼' },
  UGX: { symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' }
};

export const formatMoney = (amount: number, currency: CurrencyCode = 'RWF') => {
  const config = CURRENCIES[currency] || CURRENCIES.RWF;
  const formatted = new Intl.NumberFormat('en-US').format(amount);
  return `${config.symbol} ${formatted}`;
};

// Global Branding Component
export const KwandaBranding = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col items-center gap-2 group cursor-default select-none ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      <p className="text-[9px] font-black uppercase tracking-[0.5em] branding-shimmer italic">
        Powered by KWANDA system
      </p>
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)] delay-300" />
    </div>
    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
       <Shield size={8} className="text-slate-400" />
       <p className="text-[7px] font-bold uppercase tracking-[0.3em] text-slate-400">Enterprise Cloud Protection v5.0</p>
    </div>
  </div>
);

// Extend window interface for TS
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const translations: Record<Language, any> = {
  en: {
    nav_dashboard: "DATA HUB",
    nav_inventory: "STOCK LIST",
    nav_sales: "SELL NOW",
    nav_reports: "ANALYSIS",
    nav_personnel: "PERSONNEL",
    nav_logs: "ACTIVITY",
    nav_support: "SUPPORT HUB",
    nav_manual: "USER MANUAL",
    nav_install: "INSTALL APP",
    nav_upgrade: "UPGRADE SHOP",
    nav_signout: "SIGN OUT",
    header_search: "Search data...",
    shop_capacity: "SHOP CAPACITY",
    shop_code: "SHOP CODE",
    plan_free: "FREE PLAN",
    plan_growth: "GROWTH PLAN",
    plan_pro: "PRO PLAN",
    header_install: "Install App",
    header_help: "Need Help?",
    expiring_warning: "Subscription Expiring",
    expiring_desc: "Your premium license ends in {days} days. Renew to avoid service restriction.",
    expired_warning: "License Expired",
    expired_desc: "Account restricted to Free Starter features. Support and Basic Inventory are still active.",
    renew_now: "Renew Now",
    sys_notif: "SYSTEM NOTIFICATIONS",
    no_notif: "NO NEW NOTIFICATIONS",
    limit_reached: "Limit reached! Upgrade for more capacity.",
    error_generic: "An error occurred. Please try again.",
    ios_install: "ADD TO HOME SCREEN",
    ios_hint: "Tap the Share icon and select 'Add to Home Screen' to install StockMaster.",
    banner_install_title: "StockMaster Desktop App",
    banner_install_desc: "Run as a native app for 2x faster performance and reliable offline data tracking.",
    banner_install_btn: "Install StockMaster",
    sidebar_app_promo: "STOCKMASTER APP",
    sidebar_app_desc: "Faster & Offline",
    toast_install_title: "Boost Your Workflow",
    toast_install_desc: "StockMaster runs up to 2x faster when installed. Standalone mode also enables offline access.",
    toast_install_btn: "Install Now",
    mobile_install_banner: "Get the App",
    mobile_install_desc: "Faster & Offline"
  },
  rw: {
    nav_dashboard: "DATA HUB",
    nav_inventory: "STOCK LIST",
    nav_sales: "SELL NOW",
    nav_reports: "ANALYSIS",
    nav_personnel: "PERSONNEL",
    nav_logs: "IBYAKOZWE",
    nav_support: "SUPPORT HUB",
    nav_manual: "UKO IKORESHWA",
    nav_install: "YISHYIREMO UBU",
    nav_upgrade: "GURA POROGARAMU",
    nav_signout: "SOHOKA",
    header_search: "Shakisha hano...",
    shop_capacity: "UBUSHOBOZI BW'IDUKA",
    shop_code: "KODE Y'IDUKA",
    plan_free: "UBUNTU",
    plan_growth: "IYISUMBUYE",
    plan_pro: "IY'UBUCURUZI",
    header_install: "Yishyire muri Mudasobwa",
    header_help: "Ukeneye Ubufasha?",
    expiring_warning: "Ubwishyu burangiye",
    expiring_desc: "Ubwishyu bwawe buzashira mu minsi {days}. Gura indi porogaramu kugira ngo utagira ibibazo.",
    expired_warning: "Ubwishyu bwarangiye",
    expired_desc: "Porogaramu yawe yasubiye ku buntu. Ubufasha n'ibindi by'ibanze biracyakora.",
    renew_now: "Gura indi",
    sys_notif: "UBUTUMWA BWA SISITEMU",
    no_notif: "NTA BUTUMWA BUSHYA",
    limit_reached: "Wageze ku mupaka! Gura porogaramu yisumbuye.",
    error_generic: "Hagaragayemo ikibazo. Ongera ugerageze.",
    ios_install: "YISHYIREMO (iOS)",
    ios_hint: "Kanda 'Share' hanyuma uhitemo 'Add to Home Screen' kugira ngo yishyiremo.",
    banner_install_title: "App ya StockMaster",
    banner_install_desc: "Yishyire kuri mudasobwa cyangwa telefone kugirango ukore byihuse cyane.",
    banner_install_btn: "YISHYIREMO UBU",
    sidebar_app_promo: "STOCKMASTER APP",
    sidebar_app_desc: "Yihuta kurushaho",
    toast_install_title: "Kugurisha Byihuse",
    toast_install_desc: "Yishyire kuri telefone yawe kugirango ukore akazi kawe neza kandi vuba.",
    toast_install_btn: "Yishyiremo ubu",
    mobile_install_banner: "Yishyiremo ubu",
    mobile_install_desc: "Yihuta kandi ikora nta interineti"
  },
  fr: {
    nav_dashboard: "DATA HUB",
    nav_inventory: "STOCK LIST",
    nav_sales: "SELL NOW",
    nav_reports: "ANALYSE",
    nav_personnel: "PERSONNEL",
    nav_logs: "ACTIVITÉ",
    nav_support: "SUPPORT HUB",
    nav_manual: "MANUEL",
    nav_install: "INSTALLER L'APP",
    nav_upgrade: "AMÉLIORER",
    nav_signout: "SE DÉCONNECTER",
    header_search: "Rechercher...",
    shop_capacity: "CAPACITÉ DU MAGASIN",
    shop_code: "CODE DU MAGASIN",
    plan_free: "PLAN GRATUIT",
    plan_growth: "PLAN CROISSANCE",
    plan_pro: "PLAN PRO",
    header_install: "Installer l'App",
    header_help: "Aide?",
    expiring_warning: "Abonnement Expirant",
    expiring_desc: "Votre licence se termine dans {days} jours. Renouvelez pour éviter les restrictions.",
    expired_warning: "Licence Expirée",
    expired_desc: "Compte restreint aux fonctions gratuites.",
    renew_now: "Renouveler",
    sys_notif: "NOTIFICATIONS SYSTÈME",
    no_notif: "PAS DE NOUVELLES NOTIFICATIONS",
    limit_reached: "Limite atteinte ! Améliorez votre plan.",
    error_generic: "Une error est survenue.",
    ios_install: "AJOUTER À L'ACCUEIL",
    ios_hint: "Appuyez sur 'Partager' et sélectionnez 'Sur l'écran d'accueil'.",
    banner_install_title: "Appli StockMaster",
    banner_install_desc: "Installez l'appli pour une performance doublée et un accès hors ligne fiable.",
    banner_install_btn: "Installer l'App",
    sidebar_app_promo: "APP STOCKMASTER",
    sidebar_app_desc: "Rapide & Hors ligne",
    toast_install_title: "Expérience Boostée",
    toast_install_desc: "StockMaster fonctionne 2x plus vite lorsqu'il est installé sur votre appareil.",
    toast_install_btn: "Installer",
    mobile_install_banner: "Installer l'App",
    mobile_install_desc: "Plus rapide & Hors ligne"
  }
};

const NavItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  disabled?: boolean;
}> = ({ active, onClick, icon, label, badge, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between px-5 lg:px-4.5 py-4 lg:py-2.5 rounded-[18px] lg:rounded-[14px] transition-all group ${active ? 'bg-[#5252f2] text-white shadow-[0_4px_12px_-2px_rgba(82,82,242,0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'} ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
  >
    <div className="flex items-center gap-4 lg:gap-3">
      <div className={`transition-colors ${active ? 'text-white' : 'group-hover:text-white text-slate-500'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
      </div>
      <span className={`text-[11px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="bg-rose-500 text-white text-[9px] lg:text-[8px] font-black px-2 lg:px-1.5 py-1 lg:py-0.5 rounded-full min-w-[18px] lg:min-w-[16px]">
        {badge}
      </span>
    )}
  </button>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // PWA STATE
  const [hasPrompt, setHasPrompt] = useState(!!window.deferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [initialAuthMode, setInitialAuthMode] = useState<AuthMode>('login');
  const [forceShowSubscription, setForceShowSubscription] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [lang, setLang] = useState<Language>((localStorage.getItem('stockmaster_lang') as Language) || 'en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProactiveInstall, setShowProactiveInstall] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(localStorage.getItem('stockmaster_install_banner_dismissed') === 'true');
  const [usageToastVisible, setUsageToastVisible] = useState(false);
  const [mobileBannerVisible, setMobileBannerVisible] = useState(true);
  
  const [workers, setWorkers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [supportBadgeCount, setSupportBadgeCount] = useState(0);

  const lastLoggedUser = useRef<string | null>(null);

  const t = (key: string) => translations[lang][key] || key;

  useEffect(() => {
    localStorage.setItem('stockmaster_lang', lang);
  }, [lang]);

  useEffect(() => {
    const completed = localStorage.getItem('stockmaster_onboarding_completed');
    setShowOnboarding(completed === 'true' ? false : true);

    const checkPlatform = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMedia || isIOSStandalone);
      
      const iosMatch = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(iosMatch);
    };

    checkPlatform();
    window.addEventListener('resize', checkPlatform);

    // Sync PWA events from the early capture script in index.html
    const handleInstallReady = () => setHasPrompt(true);
    const handleInstallSuccess = () => {
      setIsStandalone(true);
      setHasPrompt(false);
      setMobileBannerVisible(false);
      setShowProactiveInstall(false);
      setUsageToastVisible(false);
    };

    window.addEventListener('pwa-install-ready', handleInstallReady);
    window.addEventListener('pwa-installed-success', handleInstallSuccess);
    
    const sessionCount = parseInt(localStorage.getItem('stockmaster_sessions') || '0');
    localStorage.setItem('stockmaster_sessions', (sessionCount + 1).toString());

    const timer = setTimeout(() => {
      if (!isStandalone && !bannerDismissed) setShowProactiveInstall(true);
    }, 3000);

    return () => {
      window.removeEventListener('resize', checkPlatform);
      window.removeEventListener('pwa-install-ready', handleInstallReady);
      window.removeEventListener('pwa-installed-success', handleInstallSuccess);
      clearTimeout(timer);
    };
  }, [isStandalone, bannerDismissed]);

  const handleInstallClick = async (): Promise<boolean> => {
    if (isIOS && !isStandalone) {
      setShowIOSHint(true);
      return false;
    }
    
    const prompt = window.deferredPrompt;
    if (!prompt) {
       console.warn("Installation terminal not ready.");
       return false;
    }
    
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window.deferredPrompt = null;
      // State will be updated via 'appinstalled' listener in index.html -> pwa-installed-success event
      return true;
    }
    return false;
  };

  const logActivity = useCallback(async (action: string, details: string, type: 'info' | 'warning' | 'error' | 'success' = 'info', userOverride?: User) => {
    const targetUser = userOverride || currentUser;
    if (!targetUser) return;
    try {
      await supabase.from('activity_logs').insert([{
        company_id: targetUser.companyId,
        user_id: targetUser.id,
        user_name: targetUser.name,
        user_email: targetUser.email,
        action,
        details,
        type,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {}
  }, [currentUser]);

  const fetchData = useCallback(async () => {
    if (!currentUser || currentUser.status !== 'active' || currentUser.role === 'super-admin') return;
    
    try {
      const { data: pData } = await supabase.from('products').select('*').eq('company_id', currentUser.companyId);
      const { data: sData } = await supabase.from('sales').select('*').eq('company_id', currentUser.companyId).order('timestamp', { ascending: false });

      let wData: any[] = [];
      let lData: any[] = [];
      if (currentUser.role === 'manager') {
        const { data: profiles } = await supabase.from('profiles').select('*').eq('company_id', currentUser.companyId).neq('id', currentUser.id);
        wData = profiles || [];
        const { data: activity } = await supabase.from('activity_logs').select('*').eq('company_id', currentUser.companyId).order('timestamp', { ascending: false }).limit(200);
        lData = activity || [];
      }

      if (pData) {
        setProducts(pData.map(p => ({
          id: p.id, name: p.name, sku: p.sku, stock: p.stock || 0, costPrice: Number(p.cost_price || 0),
          sellingPrice: Number(p.selling_price || 0), category: p.category || 'General',
          lowStockThreshold: p.low_stock_threshold || 5, lastRestockedAt: p.last_restocked_at, companyId: p.company_id
        })));
      }
      
      if (sData) {
        setSales(sData.map(s => ({
          id: s.id, productId: s.product_id, productName: s.product_name, quantity: s.quantity,
          unitPrice: Number(s.unit_price || 0), totalAmount: Number(s.total_amount || 0),
          timestamp: s.timestamp, sellerName: s.seller_name, seller_id: s.seller_id, companyId: s.company_id
        })));
      }
      
      setWorkers(wData.map(w => ({
        id: w.id, name: w.name, email: w.email, role: w.role, companyId: w.company_id,
        status: w.status as UserStatus, companyName: currentUser.companyName, currency: currentUser.currency
      })));

      setLogs(lData.map(l => ({
        id: l.id, companyId: l.company_id, userId: l.user_id, userName: l.user_name, userEmail: l.user_email,
        action: l.action, details: l.details, timestamp: l.timestamp, type: l.type as any
      })));

      const { data: msgData } = await supabase.from('support_messages').select('*').eq('company_id', currentUser.companyId);
      if (msgData) {
        let count = 0;
        try {
          const seenKey = `stockmaster_seen_notifications_${currentUser.companyId}`;
          const seenIds: string[] = JSON.parse(localStorage.getItem(seenKey) || '[]');
          if (currentUser.role === 'manager') {
            const systemUnreplied = msgData.filter(m => m.user_id === 'SYSTEM' && !m.admin_reply && !seenIds.includes(m.id)).length;
            const staffOpen = msgData.filter(m => m.user_id !== 'SYSTEM' && m.user_id !== currentUser.id && m.status === 'open').length;
            count = systemUnreplied + staffOpen;
          } else {
            const unreadForWorker = msgData.filter(m => m.user_id === currentUser.id && m.admin_reply && m.status === 'open').length;
            count = unreadForWorker;
          }
        } catch (err) {
          if (currentUser.role === 'manager') {
            const systemUnreplied = msgData.filter(m => m.user_id === 'SYSTEM' && !m.admin_reply).length;
            const staffOpen = msgData.filter(m => m.user_id !== 'SYSTEM' && m.user_id !== currentUser.id && m.status === 'open').length;
            count = systemUnreplied + staffOpen;
          } else {
            const unreadForWorker = msgData.filter(m => m.user_id === currentUser.id && m.admin_reply && m.status === 'open').length;
            count = unreadForWorker;
          }
        }
        setSupportBadgeCount(count);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'super-admin' || currentUser.status !== 'active') return;

    const channel = supabase
      .channel(`shop-${currentUser.companyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `company_id=eq.${currentUser.companyId}` }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales', filter: `company_id=eq.${currentUser.companyId}` }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `company_id=eq.${currentUser.companyId}` }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs', filter: `company_id=eq.${currentUser.companyId}` }, () => {
        fetchData(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, fetchData]);

  useEffect(() => {
    if (currentUser && lastLoggedUser.current !== currentUser.id) {
      logActivity("User Login", `Authenticated via ${window.innerWidth < 1024 ? 'Mobile' : 'Desktop'}`, "success", currentUser);
      lastLoggedUser.current = currentUser.id;
    } else if (!currentUser) {
      lastLoggedUser.current = null;
    }
  }, [currentUser, logActivity]);

  const handleLogout = useCallback(async () => {
    if (currentUser) {
      await logActivity("User Logout", "Session terminated by user action.", "info");
    }
    setCurrentUser(null);
    setForceShowSubscription(false);
    setActiveTab('dashboard');
    setProducts([]);
    setSales([]);
    setWorkers([]);
    setLogs([]);
    setGlobalSearch('');
    setSupportBadgeCount(0);
    lastLoggedUser.current = null;
  }, [currentUser, logActivity]);

  const checkUserSubscription = useCallback(async () => {
    if (!currentUser || currentUser.role === 'super-admin') return;
    try {
      const { data: profile } = await supabase.from('profiles').select('status').eq('id', currentUser.id).single();
      const { data: company } = await supabase.from('companies').select('name, currency').eq('id', currentUser.companyId).single();
      const { data: sub = null } = await supabase.from('subscriptions').select('plan, end_date, is_active').eq('company_id', currentUser.companyId).order('updated_at', { ascending: false }).limit(1).maybeSingle();

      if (profile && company) {
        const isExpired = sub?.end_date && new Date(sub.end_date) < new Date();
        const updatedUser: User = { 
          ...currentUser, 
          status: profile.status as UserStatus,
          plan: (sub?.is_active && !isExpired ? sub?.plan : 'free') || 'free',
          actualPlan: sub?.plan || 'free', 
          subscriptionEnd: sub?.end_date,
          companyName: company.name,
          currency: (company.currency as CurrencyCode) || 'RWF'
        };
        if (updatedUser.plan !== currentUser.plan || updatedUser.status !== currentUser.status || updatedUser.currency !== currentUser.currency) {
          setCurrentUser(updatedUser);
        }
      }
    } catch (err) {}
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'super-admin') { setLoading(false); return; }
      fetchData();
      checkUserSubscription();
      const interval = setInterval(() => {
        checkUserSubscription();
      }, 60000); 
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [currentUser?.id, currentUser?.status, fetchData, checkUserSubscription]);

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('stockmaster_install_banner_dismissed', 'true');
    setShowProactiveInstall(false);
  };

  const handleActionToast = () => {
    if (!isStandalone && !bannerDismissed && (hasPrompt || isIOS)) {
      setUsageToastVisible(true);
    }
  };

  if (isResetMode) return <ResetPasswordView email={resetEmail} lang={lang} onComplete={() => setIsResetMode(false)} />;
  if (showOnboarding === null) return null; 
  if (showOnboarding) return (
    <OnboardingView 
      lang={lang} 
      setLang={setLang} 
      onComplete={(mode) => {
        if (mode) setInitialAuthMode(mode);
        setShowOnboarding(false);
      }} 
      onInstall={handleInstallClick} 
      showInstall={!isStandalone && (hasPrompt || isIOS)} 
    />
  );

  if (!currentUser) return (
    <LoginView 
      onLogin={setCurrentUser} 
      lang={lang} 
      setLang={setLang} 
      onInstall={handleInstallClick} 
      showInstall={(hasPrompt || (isIOS && !isStandalone)) && showProactiveInstall}
      onShowTour={() => setShowOnboarding(true)}
      initialMode={initialAuthMode}
    />
  );

  if (currentUser.role === 'super-admin') return <AdminDashboard onLogout={handleLogout} />;
  if (currentUser.status === 'pending') return <PendingApprovalView user={currentUser} lang={lang} onLogout={handleLogout} onCheckStatus={checkUserSubscription} checking={loading} />;
  if (currentUser.status === 'rejected') return <SubscriptionView user={currentUser} lang={lang} onLogout={handleLogout} isLocked={true} onRefresh={checkUserSubscription} />;

  const isExpired = currentUser.actualPlan !== 'free' && currentUser.subscriptionEnd && new Date(currentUser.subscriptionEnd) < new Date();
  if (forceShowSubscription) return <SubscriptionView user={currentUser} lang={lang} onLogout={handleLogout} onClose={() => setForceShowSubscription(false)} isLocked={isExpired} onRefresh={() => { checkUserSubscription(); setForceShowSubscription(false); }} />;

  return (
    <div className={`flex h-screen font-sans bg-slate-50 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[150] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-[280px] lg:w-[205px] lg:relative lg:translate-x-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shrink-0 bg-[#02040a] text-white transition-transform duration-300 ease-in-out z-[200] border-r border-white/5`}>
        <div className="p-6 lg:p-5 lg:pb-2">
          <div className="flex items-center gap-4 lg:gap-3 mb-8 lg:mb-5">
            <div className="relative">
              <Logo size={48} className="shadow-lg shadow-indigo-600/20" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-sm font-black tracking-tighter leading-none uppercase italic truncate">StockMaster</h1>
              <div className="flex items-center gap-1 mt-1.5 lg:mt-1">
                <Zap size={8} className="text-indigo-400 fill-indigo-400" />
                <p className="text-[8px] lg:text-[7px] font-black uppercase tracking-[0.15em] text-indigo-400 truncate">
                  {currentUser.plan === 'pro' ? 'PRO PLAN' : t(`plan_${currentUser.plan}`).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 lg:p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-[22px] lg:rounded-[18px]">
              <div className="flex justify-between items-center mb-2.5 lg:mb-2">
                <p className="text-[9px] lg:text-[8px] font-black uppercase text-slate-500 tracking-[0.1em]">{t('shop_capacity')}</p>
                <p className="text-xs lg:text-[10px] font-black text-white italic">{products.length}/{currentUser.plan === 'free' ? 50 : (currentUser.plan === 'growth' ? 500 : '∞')}</p>
              </div>
              <div className="h-[3px] lg:h-[2px] bg-white/10 rounded-full overflow-hidden">
                {(() => {
                  const percent = Math.min(100, (products.length / (currentUser.plan === 'free' ? 50 : (currentUser.plan === 'growth' ? 500 : 1000))) * 100);
                  const safe = Math.round(percent);
                  const cls = `shop-cap-${safe}`;
                  const bg = products.length >= (currentUser.plan === 'free' ? 50 : 500) ? 'bg-rose-500' : 'bg-[#5252f2]';
                  return (
                    <>
                      <style>{`.${cls}{width: ${safe}%;}`}</style>
                      <div className={`h-full transition-all duration-1000 ${bg} ${cls}`} />
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 lg:px-3 space-y-2 lg:space-y-1 mt-6 lg:mt-5 overflow-y-auto custom-scrollbar text-left pb-10 lg:pb-0">
          <NavItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard />} label={t('nav_dashboard')} />
          <NavItem active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} icon={<Package />} label={t('nav_inventory')} />
          <NavItem active={activeTab === 'sales'} onClick={() => { setActiveTab('sales'); setIsSidebarOpen(false); }} icon={<ShoppingCart />} label={t('nav_sales')} />
          {currentUser.role === 'manager' && (<>
            <NavItem active={activeTab === 'reports'} onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} icon={<BarChart3 />} label={t('nav_reports')} disabled={isExpired} />
            <NavItem active={activeTab === 'workers'} onClick={() => { setActiveTab('workers'); setIsSidebarOpen(false); }} icon={<Users />} label={t('nav_personnel')} badge={workers.filter(w => w.status === 'pending').length} disabled={isExpired} />
            <NavItem active={activeTab === 'logs'} onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }} icon={<History />} label={t('nav_logs')} disabled={isExpired} />
          </>)}
          <NavItem active={activeTab === 'support'} onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }} icon={<HelpCircle />} label={t('nav_support')} badge={supportBadgeCount} />
          <NavItem active={activeTab === 'manual'} onClick={() => { setActiveTab('manual'); setIsSidebarOpen(false); }} icon={<BookOpen />} label={t('nav_manual')} />
        </nav>

        <div className="p-5 lg:p-4 space-y-4 lg:space-y-3 bg-[#02040a]">
          <div className="h-px bg-white/5 w-full mb-1" />
          
          {(!isStandalone && (hasPrompt || isIOS)) && (
            <button 
              onClick={handleInstallClick} 
              className="w-full group relative overflow-hidden bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 text-left transition-all active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md">
                  <Smartphone size={16} className="text-indigo-400" />
                </div>
                <Sparkles size={12} className="text-indigo-300 opacity-40 animate-pulse" />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">{t('sidebar_app_promo')}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{t('sidebar_app_desc')}</p>
              <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:rotate-12 transition-transform">
                <Download size={48} strokeWidth={3} />
              </div>
            </button>
          )}

          {(currentUser.plan !== 'pro' || isExpired) && currentUser.role === 'manager' && (
            <button onClick={() => setForceShowSubscription(true)} className={`w-full flex items-center justify-center gap-3 lg:gap-2 py-4 lg:py-3 bg-[#5252f2] hover:bg-[#4343e2] text-white rounded-[18px] lg:rounded-[14px] font-black text-xs lg:text-[9px] uppercase tracking-[0.1em] shadow-xl transition-all`}>
              <ArrowUpCircle size={18} /> {t('nav_upgrade')}
            </button>
          )}

          <div className="flex items-center gap-3 lg:gap-2.5 px-1.5 pt-3 lg:pt-2 pb-2 lg:pb-1 min-w-0">
            <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-sm lg:text-xs font-black text-slate-900 uppercase bg-white shrink-0 shadow-sm border-2 border-indigo-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs lg:text-[11px] font-black truncate text-white leading-tight">{currentUser.name}</p>
              <p className="text-[9px] lg:text-[8px] uppercase tracking-[0.12em] text-slate-500 font-black truncate mt-0.5">{currentUser.role.toUpperCase()}</p>
            </div>
            <button aria-label="Sign out" title="Sign out" onClick={handleLogout} className="p-2 lg:p-1.5 text-slate-500 hover:text-rose-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden bg-slate-50 flex flex-col relative">
        <header className="sticky top-0 z-[40] bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-10 py-3 lg:py-4 flex items-center justify-between h-16 lg:h-16 shrink-0">
          <div className="flex items-center gap-4 lg:gap-4 overflow-hidden">
            <button aria-label="Open menu" title="Open menu" onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-950 text-white rounded-[16px] shadow-lg shadow-indigo-600/10 active:scale-95 transition-transform"><Menu size={20} /></button>
            <div className="text-left min-w-0">
              <h2 className="text-sm lg:text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic lg:normal-case truncate">{t(`nav_${activeTab}`)}</h2>
              <p className="text-[8px] lg:text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic leading-none truncate">{currentUser.companyName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            {!isStandalone && (hasPrompt || isIOS) && (
              <button onClick={handleInstallClick} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-full border border-slate-200 hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest shadow-sm group">
                <Monitor size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" /> {t('header_install')}
              </button>
            )}
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all text-[9px] font-black uppercase tracking-widest text-slate-600">
                <Globe size={12} className="text-indigo-600" /> {lang.toUpperCase()} <ChevronDown size={10} className={`transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-slate-100 rounded-[28px] shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {(['en', 'rw', 'fr'] as Language[]).map(l => (
                    <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors ${lang === l ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-600'}`}>{l === 'en' ? 'English' : l === 'rw' ? 'Kinyarwanda' : 'Français'}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder={t('header_search')} value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="pl-9 pr-5 py-2 bg-slate-100 rounded-full text-[11px] w-40 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold transition-all border border-transparent" />
            </div>
          </div>
        </header>

        {(!isStandalone && (hasPrompt || isIOS) && !bannerDismissed && showProactiveInstall) && (
          <div className="bg-white border-b border-slate-100 relative animate-in slide-in-from-top duration-1000 overflow-hidden shadow-sm shrink-0">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/20 via-transparent to-transparent pointer-events-none" />
             <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm group hover:scale-105 transition-transform">
                      <Logo size={36} noBackground />
                   </div>
                   <div className="text-left">
                      <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 leading-none mb-1.5 flex items-center gap-2">
                        {t('banner_install_title')} <span className="bg-indigo-100 text-indigo-600 text-[8px] px-2 py-0.5 rounded-full">RECOMMENDED</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-lg">{t('banner_install_desc')}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <button 
                     onClick={handleInstallClick}
                     className="flex-1 md:flex-none px-10 py-3.5 bg-[#5252f2] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
                   >
                     <Download size={14} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" /> {t('banner_install_btn')}
                   </button>
                   <button aria-label="Dismiss banner" title="Dismiss banner" onClick={dismissBanner} className="p-3 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
                </div>
             </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto min-h-full flex flex-col">
            <div className="flex-1 pb-10">
              {activeTab === 'dashboard' && (
                <DashboardView 
                  products={products} 
                  sales={sales} 
                  role={currentUser.role} 
                  plan={currentUser.plan || 'free'} 
                  onUpgradeRequest={() => setForceShowSubscription(true)} 
                  lang={lang}
                  currency={currentUser.currency || 'RWF'}
                  onInstallPrompt={handleInstallClick}
                  showInstallCard={!isStandalone && (hasPrompt || isIOS)}
                />
              )}
              {/* Fix property name error in onAddProduct callback where p.low_stock_threshold was used instead of p.lowStockThreshold */}
              {activeTab === 'inventory' && <InventoryView products={products.filter(p => p.name.toLowerCase().includes(globalSearch.toLowerCase()))} role={currentUser.role} plan={currentUser.plan || 'free'} onUpgradeRequest={() => setForceShowSubscription(true)} lang={lang} currency={currentUser.currency || 'RWF'} companyName={currentUser.companyName} isStandalone={isStandalone} onInstall={handleInstallClick} onAddProduct={async (p) => { 
                const limit = currentUser.plan === 'free' ? 50 : (currentUser.plan === 'growth' ? 500 : 999999); 
                if (products.length >= limit) return alert(t('limit_reached')); 
                const { error } = await supabase.from('products').insert([{ name: p.name, sku: p.sku, stock: p.stock, cost_price: p.costPrice, selling_price: p.sellingPrice, category: p.category, low_stock_threshold: p.lowStockThreshold, company_id: currentUser.companyId }]); 
                if (!error) { 
                  await logActivity("Product Registered", `Registered: ${p.name}`, 'success'); 
                  fetchData(); 
                  handleActionToast();
                }
              }} onRestock={async (id, qty, newCost, newSelling) => { 
                const p = products.find(prod => prod.id === id); 
                if (p) { 
                  const updates: any = { 
                    stock: p.stock + qty, 
                    last_restocked_at: new Date().toISOString() 
                  };
                  if (newCost !== undefined) updates.cost_price = newCost;
                  if (newSelling !== undefined) updates.selling_price = newSelling;

                  const { error } = await supabase.from('products').update(updates).eq('id', id); 
                  if (!error) { 
                    await logActivity("Stock Restocked", `Increased ${p.name} by +${qty}${newCost !== p.costPrice ? ' (Cost Updated)' : ''}`, 'info'); 
                    fetchData(); 
                  }
                } 
              }} onDeleteProduct={async (id) => {
                const p = products.find(prod => prod.id === id);
                if (p) {
                  const { error } = await supabase.from('products').delete().eq('id', id);
                  if (!error) {
                    await logActivity("Product Purged", `Permanently removed: ${p.name}`, 'error');
                    fetchData();
                  }
                }
              }} />}
              {activeTab === 'sales' && <SalesView products={products} sales={sales} lang={lang} currency={currentUser.currency || 'RWF'} isStandalone={isStandalone} onInstall={handleInstallClick} onRecordSale={async (productId, qty, price) => { 
                const p = products.find(prod => prod.id === productId); 
                if (!p) return; 
                const { error } = await supabase.from('sales').insert([{ company_id: currentUser.companyId, product_id: productId, product_name: p.name, quantity: qty, unit_price: price, total_amount: price * qty, seller_name: currentUser.name, seller_id: currentUser.id }]); 
                if (!error) { 
                  await supabase.from('products').update({ stock: p.stock - qty }).eq('id', productId); 
                  await logActivity("Sale Completed", `Sold: ${qty}x ${p.name}`, 'success'); 
                  fetchData(); 
                  handleActionToast();
                } 
              }} />}
              {activeTab === 'reports' && currentUser.role === 'manager' && <ReportsView products={products} sales={sales} plan={currentUser.plan || 'free'} lang={lang} currency={currentUser.currency || 'RWF'} companyName={currentUser.companyName || 'Registered Shop'} userName={currentUser.name} onLogActivity={(action, details) => logActivity(action, details, 'info')} />}
              {activeTab === 'workers' && currentUser.role === 'manager' && <WorkersView workers={workers} plan={currentUser.plan || 'free'} companyId={currentUser.companyId} lang={lang} onUpdateWorkerStatus={async (workerId, newStatus) => { 
                const target = workers.find(w => w.id === workerId);
                const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', workerId); 
                if (!error) { 
                  await logActivity("Worker Updated", `Status: ${target?.name} -> ${newStatus}`, newStatus === 'active' ? 'success' : 'warning');
                  fetchData(); 
                }
              }} onDeleteWorker={async (workerId) => { 
                const target = workers.find(w => w.id === workerId);
                const { error } = await supabase.from('profiles').delete().eq('id', workerId); 
                if (!error) { 
                  await logActivity("Worker Removed", `Deleted: ${target?.name}`, 'error');
                  fetchData(); 
                }
              }} onUpgradeRequest={() => setForceShowSubscription(true)} />}
              {activeTab === 'logs' && currentUser.role === 'manager' && <ActivityLogsView lang={lang} logs={logs} />}
              {activeTab === 'support' && <SupportView lang={lang} user={currentUser} />}
              {activeTab === 'manual' && <ManualView lang={lang} userRole={currentUser.role} />}
            </div>
            
            {/* GLOBAL FOOTER BRANDING */}
            <KwandaBranding className="mt-12 mb-8" />
          </div>
        </div>
      </main>

      {(!isStandalone && (hasPrompt || isIOS) && mobileBannerVisible) && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-[300] p-4 pb-8 animate-in slide-in-from-bottom duration-700">
           <div className="bg-[#02040a]/95 backdrop-blur-xl rounded-[32px] p-5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-full bg-[#5252f2]/5 blur-[40px] pointer-events-none" />
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <Smartphone size={24} className="text-indigo-400 animate-pulse" />
                 </div>
                 <div className="min-w-0">
                    <h5 className="text-white text-[13px] font-black uppercase tracking-tight leading-none mb-1.5">{t('mobile_install_banner')}</h5>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest truncate">{t('mobile_install_desc')}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={handleInstallClick}
                   className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                 >
                   INSTALL
                 </button>
                 <button aria-label="Close install banner" title="Close install banner" onClick={() => setMobileBannerVisible(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
              </div>
           </div>
        </div>
      )}

      {usageToastVisible && (
        <div className="hidden lg:block fixed bottom-10 right-10 z-[300] max-w-sm w-full animate-in slide-in-from-right-10 duration-700">
           <div className="bg-[#02040a] rounded-[32px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none" />
              <button 
                aria-label="Close toast"
                title="Close toast"
                onClick={() => setUsageToastVisible(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-start gap-5 mb-6">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                    <Smartphone size={24} className="text-indigo-400" />
                 </div>
                 <div className="text-left">
                    <h5 className="text-sm font-black text-white uppercase italic leading-none mb-2">{t('toast_install_title')}</h5>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{t('toast_install_desc')}</p>
                 </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleInstallClick}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  {t('toast_install_btn')} <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth={3} />
                </button>
                <button 
                  onClick={() => setUsageToastVisible(false)}
                  className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-slate-300 transition-colors"
                >
                  Later
                </button>
              </div>
           </div>
        </div>
      )}

      {showIOSHint && (
        <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center p-0 lg:p-6 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white rounded-t-[40px] lg:rounded-[40px] w-full max-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom lg:zoom-in-95 duration-300">
            <div className="p-8 lg:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-50 text-indigo-600 rounded-[22px] lg:rounded-[28px] flex items-center justify-center mb-6 lg:mb-8 shadow-inner">
                <Share2 size={32} />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-3 lg:mb-4">{t('ios_install')}</h3>
              <p className="text-xs lg:text-sm text-slate-500 font-medium leading-relaxed mb-8 lg:mb-10">{t('ios_hint')}</p>
              <button 
                onClick={() => setShowIOSHint(false)}
                className="w-full py-4.5 lg:py-5 bg-slate-950 text-white rounded-[20px] lg:rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all shadow-xl"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
