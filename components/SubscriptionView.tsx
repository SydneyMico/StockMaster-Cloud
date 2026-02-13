
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Check, 
  Smartphone, 
  LogOut, 
  Loader2, 
  Zap, 
  Crown, 
  Copy, 
  CheckCircle, 
  RefreshCcw, 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  CreditCard,
  PhoneCall,
  SmartphoneNfc,
  AlertCircle,
  Clock,
  Lock,
  Key,
  Fingerprint,
  MessageSquareQuote,
  Info,
  ArrowRight,
  Banknote,
  Terminal,
  Activity,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Headset,
  RefreshCw,
  QrCode,
  Wallet
} from 'lucide-react';
import { User, PlanType, Language } from '../types';
import Logo from './Logo';
import { supabase } from '../supabase';
import { KwandaBranding } from '../App';

interface SubscriptionViewProps {
  user: User;
  lang: Language;
  onLogout: () => void;
  onRefresh: () => void;
  onClose?: () => void;
  isLocked?: boolean;
}

const translations: Record<Language, any> = {
  en: {
    pending_title: "PAYMENT PENDING",
    pending_sub: "VERIFICATION BY ADMIN \"SYDNEY\" REQUIRED",
    pending_desc: "We are checking the Momo transfer from {name} ({phone}). As soon as Sydney confirms, your dashboard will unlock automatically.",
    sync_status: "SYNC STATUS",
    auto_redirect: "PLATFORM WILL AUTO-REDIRECT ON ACTIVATION",
    sign_out: "SIGN OUT",
    unlock_title: "Security Override",
    system_locked: "SYSTEM LOCKED",
    license_expired: "License Has Expired",
    restricted_access: "ACCOUNT RESTRICTED",
    activate_tier: "Activate Shop Tier",
    monthly: "Monthly",
    yearly: "Yearly",
    select_method: "SELECT GATEWAY",
    pay_with_momo: "MTN MOMO",
    pay_with_airtel: "AIRTEL MONEY",
    manual_transfer: "MANUAL TRANSFER",
    enter_number: "Mobile Money Number",
    initiate_payment: "Initiate STK Push",
    waiting_pin: "Awaiting PIN Input...",
    manual_verify: "PUSH NOT SHOWING? USE MANUAL CODE",
    back_to_methods: "Change Method",
    back_pricing: "Review Plans",
    use_pin: "Master PIN Override",
    pin_error: "Invalid Security Code.",
    status_success: "PAYMENT SUCCESSFUL",
    support_btn: "Open Support Hub",
    terminal_title: "INSTRUCTION TERMINAL",
    compose_label: "Compose",
    copy_code: "COPY CODE",
    merchant_id: "MERCHANT ID",
    verify_number_label: "Enter Number Used for Transfer",
    submit_verify: "SUBMIT FOR VERIFICATION"
  },
  rw: {
    pending_title: "Ubwishyu burimo gukorwa",
    pending_sub: "TEGEREZA KWEMEZWA NA SYDNEY",
    pending_desc: "Turimo kugenzura amafaranga Mike ({phone}) yohereje kuri Momo. Sydney namara kubyemeza, konti yawe irafunguka.",
    sync_status: "Vugurura",
    auto_redirect: "SISITEMU IZIFUNGURA NIYEMEZWA",
    sign_out: "SOHOKA",
    unlock_title: "Gufungura by'umwihariko",
    system_locked: "SISTEMU IFUNZE",
    license_expired: "Igihe cyarangiye",
    restricted_access: "KONTI YAHAGARITSWE",
    activate_tier: "Gura Porogaramu",
    monthly: "Buri Kwezi",
    yearly: "Buri Mwaka",
    select_method: "HITAMO UBURYO WISHYURA",
    pay_with_momo: "MTN MOMO",
    pay_with_airtel: "AIRTEL MONEY",
    manual_transfer: "KOHEREZA BISANZWE",
    enter_number: "Nimero ya Mobile Money",
    initiate_payment: "Ohereza ubutumwa (Push)",
    waiting_pin: "Andika PIN yawe...",
    manual_verify: "Ntubibonye? Koresha uburyo busanzwe",
    back_to_methods: "Hindura uburyo",
    back_pricing: "Subira ku biciro",
    use_pin: "Koresha PIN y'Admin",
    pin_error: "Kode ya PIN ntariryo.",
    status_success: "UBWISHYU BWAGENCE NEZA",
    support_btn: "Fungura Ubufasha",
    terminal_title: "UKO WISHYURA",
    compose_label: "Kanda",
    copy_code: "KORA 'COPY' KODE",
    merchant_id: "KODE Y'UBUCURUZI",
    verify_number_label: "Injiza nimero wakoresheje",
    submit_verify: "EMEZA UBWISHYU"
  },
  fr: {
    pending_title: "PAIEMENT EN ATTENTE",
    pending_sub: "VÉRIFICATION PAR L'ADMIN \"SYDNEY\" REQUISE",
    pending_desc: "Nous vérifions le transfert Momo de {name} ({phone}). Dès que Sydney confirme, votre tableau de bord se débloquera automatiquement.",
    sync_status: "SYNCHRONISER",
    auto_redirect: "LA PLATEFORME SERA REDIRIGÉE APRÈS ACTIVATION",
    sign_out: "SE DÉCONNECTER",
    unlock_title: "Déverrouillage Admin",
    system_locked: "SYSTÈME VERROUILLÉ",
    license_expired: "Licence Expirée",
    restricted_access: "ACCÈS RESTREINT",
    activate_tier: "Activer le Magasin",
    monthly: "Mensuel",
    yearly: "Annuel",
    select_method: "CHOISIR LA PASSERELLE",
    pay_with_momo: "MTN MOMO",
    pay_with_airtel: "AIRTEL MONEY",
    manual_transfer: "TRANSFERT MANUEL",
    enter_number: "Numéro Mobile Money",
    initiate_payment: "Lancer le Push STK",
    waiting_pin: "En attente du PIN...",
    manual_verify: "Problème ? Paiement manuel",
    back_to_methods: "Changer de mode",
    back_pricing: "Voir les Plans",
    use_pin: "Code Maître",
    pin_error: "Code PIN invalide.",
    status_success: "PAIEMENT RÉUSSI",
    support_btn: "Assistance Hub",
    terminal_title: "TERMINAL D'INSTRUCTIONS",
    compose_label: "Composer",
    copy_code: "COPIER LE CODE",
    merchant_id: "ID MARCHAND",
    verify_number_label: "Entrez le numéro utilisé",
    submit_verify: "SOUMETTRE POUR VÉRIFICATION"
  }
};

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ user, lang, onLogout, onRefresh, onClose, isLocked }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [step, setStep] = useState<'pricing' | 'method' | 'processing' | 'result'>('pricing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'manual' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [showManualTerminal, setShowManualTerminal] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);
  
  const [priceConfig, setPriceConfig] = useState({ 
    growth_m: '6000', 
    growth_y: '54000', 
    pro_m: '10000', 
    pro_y: '108000',
    momo_number: '0795009861',
    manual_ussd_code: '*182*8*1*'
  });
  
  const [transactionId, setTransactionId] = useState<string | null>(localStorage.getItem('last_tx_id'));
  const [subscriptionDetails, setSubscriptionDetails] = useState<{name: string, phone: string}>({name: user.name, phone: ''});

  const fetchConfig = useCallback(async () => {
    try {
      const { data: configs } = await supabase.from('system_configs').select('*');
      if (configs) {
        setPriceConfig({
          growth_m: configs.find(c => c.key === 'price_growth_monthly')?.value || '6000',
          growth_y: configs.find(c => c.key === 'price_growth_yearly')?.value || '54000',
          pro_m: configs.find(c => c.key === 'price_pro_monthly')?.value || '10000',
          pro_y: configs.find(c => c.key === 'price_pro_yearly')?.value || '108000',
          momo_number: configs.find(c => c.key === 'momo_number')?.value || '0795009861',
          manual_ussd_code: configs.find(c => c.key === 'manual_ussd_code')?.value || '*182*8*1*'
        });
      }
    } catch (err) {}
  }, []);

  const checkPaymentStatus = useCallback(async (txId: string, manual: boolean = false) => {
    if (manual) setIsVerifying(true);
    try {
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('company_id', user.companyId).single();
      if (sub) {
        if (sub.is_active) {
          setStep('result');
          localStorage.removeItem('last_tx_id');
          setTimeout(() => onRefresh(), 2000);
          return true;
        }
        setSubscriptionDetails({
          name: sub.payer_name || user.name,
          phone: sub.payer_phone || ''
        });
      }
      return false;
    } catch (err) { 
      return false; 
    } finally {
      if (manual) setIsVerifying(false);
    }
  }, [user.companyId, user.name, onRefresh]);

  useEffect(() => {
    fetchConfig();
    if (transactionId && step === 'pricing') {
      setStep('processing');
    }
  }, [fetchConfig, transactionId, step]);

  useEffect(() => {
    let interval: any;
    if (step === 'processing') {
      interval = setInterval(() => checkPaymentStatus(transactionId || '', false), 45000);
      checkPaymentStatus(transactionId || '', false);
    }
    return () => clearInterval(interval);
  }, [step, transactionId, checkPaymentStatus]);

  const handleFreeStart = async () => {
    setIsProcessing(true);
    try {
      await supabase.from('profiles').update({ status: 'active' }).eq('company_id', user.companyId).eq('role', 'manager');
      await supabase.from('subscriptions').upsert({ company_id: user.companyId, plan: 'free', is_active: true, end_date: null });
      onRefresh(); 
    } catch (err) {} finally { setIsProcessing(false); }
  };

  const handleInitiatePush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsProcessing(true);
    try {
      const newTxId = `TX-${Date.now()}`;
      setTransactionId(newTxId);
      localStorage.setItem('last_tx_id', newTxId);
      
      // 1. Log the subscription intent
      await supabase.from('subscriptions').upsert({
        company_id: user.companyId,
        plan: selectedPlan,
        is_active: false,
        payer_phone: phoneNumber,
        payer_name: user.name,
        updated_at: new Date().toISOString()
      }, { onConflict: 'company_id' });

      // 2. Create a 'PAYMENT CLAIM' ticket for the Admin
      await supabase.from('support_messages').insert([{
        company_id: user.companyId,
        user_id: user.id,
        user_name: user.name,
        subject: 'PAYMENT CLAIM',
        message: `${selectedPlan?.toUpperCase()} Plan Activation for ${user.companyName} via ${phoneNumber}`,
        status: 'open'
      }]);
      
      setStep('processing');
      setSubscriptionDetails({ name: user.name, phone: phoneNumber });
    } catch (err) {
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleCopyUssd = () => {
    const ussd = `${priceConfig.manual_ussd_code}${priceConfig.momo_number}#`;
    navigator.clipboard.writeText(ussd);
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2000);
  };

  const handleVerifyPIN = async () => {
    if (adminPin.length !== 6) return;
    setIsProcessing(true);
    try {
      // 1. Fetch correct PIN from the current subscription record
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', user.companyId)
        .maybeSingle();

      if (sub && sub.unlock_pin === adminPin) {
        // Correct PIN entered! Proceed with full platform activation
        const newExpiry = new Date(); 
        newExpiry.setMonth(newExpiry.getMonth() + 1); // Grant 1 month access

        // Update subscription to active
        await supabase
          .from('subscriptions')
          .update({ 
            is_active: true, 
            end_date: newExpiry.toISOString(), 
            plan: sub.plan || 'growth',
            updated_at: new Date().toISOString() 
          })
          .eq('company_id', user.companyId);

        // Ensure manager profile is active
        await supabase
          .from('profiles')
          .update({ status: 'active' })
          .eq('company_id', user.companyId)
          .eq('role', 'manager');

        // Log the security override
        await supabase.from('activity_logs').insert([{
          company_id: user.companyId,
          user_id: user.id,
          user_name: user.name,
          action: "PIN Security Override",
          details: "System unlocked via Master PIN entry.",
          type: 'success',
          timestamp: new Date().toISOString()
        }]);

        setStep('result');
        setTimeout(() => onRefresh(), 1500);
      } else {
        alert(t('pin_error'));
        setAdminPin('');
      }
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    { id: 'free' as PlanType, name: lang === 'rw' ? 'Ubuntu' : 'Free Starter', price: '0 RWF', period: 'Forever', icon: <Logo size={32} />, features: [`Max 50 Products`, `1 Staff`, `7 Days History`], button: lang === 'rw' ? 'Komeza Ubuntu' : 'Continue Free' },
    { id: 'growth' as PlanType, name: lang === 'rw' ? 'Iyisumbuye' : 'Growth', price: billingCycle === 'monthly' ? `${priceConfig.growth_m} RWF` : `${priceConfig.growth_y} RWF`, period: billingCycle === 'monthly' ? '/ mo' : '/ yr', icon: <Zap size={32} className="text-indigo-600" />, features: [`Max 500 Products`, `5 Staff`, `6 Months History`], button: 'Select Growth', popular: true },
    { id: 'pro' as PlanType, name: lang === 'rw' ? 'Iy\'Ubucuruzi' : 'Business Pro', price: billingCycle === 'monthly' ? `${priceConfig.pro_m} RWF` : `${priceConfig.pro_y} RWF`, period: billingCycle === 'monthly' ? '/ mo' : '/ yr', icon: <Crown size={32} className="text-amber-500" />, features: [`Unlimited Products`, `Unlimited Staff`, `PDF Exports`, `Full History`], button: 'Go Unlimited' }
  ];

  if (pinMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm bg-white rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Fingerprint size={40} /></div>
           <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">{t('unlock_title')}</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Master Security PIN</p>
           <input 
             type="password" 
             maxLength={6} 
             autoFocus
             value={adminPin} 
             onChange={e => setAdminPin(e.target.value.replace(/\D/g,''))} 
             className="w-full text-center py-6 bg-slate-50 rounded-3xl text-4xl font-black outline-none mb-8 border-2 border-transparent focus:border-indigo-500/20 shadow-inner" 
           />
           <div className="flex gap-4">
             <button onClick={() => setPinMode(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
             <button onClick={handleVerifyPIN} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg font-black text-[10px] uppercase">
               {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Unlock'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  const renderManualTerminal = () => (
    <div className="w-full animate-in slide-in-from-bottom-12 duration-700">
      <div className="bg-[#0a0c14] rounded-[56px] p-12 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden group mb-10 text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-12">
          <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.6em] italic opacity-90">
            {t('terminal_title')}
          </p>

          <h2 className="text-white font-black text-3xl md:text-5xl tracking-tighter leading-none">
            {t('compose_label')}: <span className="text-white tracking-normal">{priceConfig.manual_ussd_code}{priceConfig.momo_number}#</span>
          </h2>

          <button 
            onClick={handleCopyUssd}
            className="flex items-center gap-4 px-12 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white hover:bg-white/10 transition-all active:scale-95 group shadow-inner"
          >
            <Copy size={20} className={copiedUssd ? 'text-emerald-400' : 'text-slate-400'} />
            <span className="text-[12px] font-black uppercase tracking-[0.3em]">
              {copiedUssd ? 'COPIED!' : t('copy_code')}
            </span>
          </button>

          <div className="flex items-center gap-4 pt-6 opacity-90">
            <QrCode size={24} className="text-emerald-400" />
            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] leading-none">
              {t('merchant_id')}: {priceConfig.momo_number}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 text-center animate-in slide-in-from-bottom-4 duration-1000">
         <div className="mb-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
               <ShieldCheck size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('verify_number_label')}</p>
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Security Checkpoint</h4>
         </div>
         <div className="space-y-6">
            <input 
              type="text" 
              placeholder="07XX XXX XXX" 
              value={phoneNumber} 
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/g,''))} 
              className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-black text-2xl text-center text-slate-800 focus:border-indigo-500/20 transition-all" 
            />
            <button 
              onClick={handleInitiatePush}
              disabled={isProcessing || !phoneNumber}
              className="w-full py-6 bg-[#5252f2] text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <>{t('submit_verify')} <ArrowRight size={20} /></>}
            </button>
         </div>
      </div>
    </div>
  );

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg flex flex-col items-center">
          <div className="w-full bg-white rounded-[64px] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col items-center relative">
            <div className="p-12 pb-14 flex flex-col items-center w-full text-center">
              <div className="w-24 h-24 bg-[#fff8ed] rounded-[32px] flex items-center justify-center mb-10 shadow-sm border border-amber-50/50">
                <Clock size={56} className="text-[#f1a21e]" strokeWidth={2.5} />
              </div>
              
              <div className="space-y-2 mb-10">
                <h2 className="text-[#02040a] font-black text-2xl tracking-tighter uppercase leading-none">{t('pending_title')}</h2>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest leading-none italic">{t('pending_sub')}</p>
              </div>

              <div className="bg-[#f2f6fa] rounded-[36px] p-8 mb-10 w-full border border-slate-100/50">
                <p className="text-slate-600 text-sm font-bold leading-relaxed">
                  {t('pending_desc').replace('{name}', subscriptionDetails.name).replace('{phone}', subscriptionDetails.phone || '07XXXXXXXX')}
                </p>
              </div>

              <button 
                onClick={() => checkPaymentStatus(transactionId || '', true)} 
                disabled={isVerifying} 
                className="w-full py-6 bg-[#5252f2] text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 active:scale-95 transition-all mb-8 group"
              >
                {isVerifying ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" strokeWidth={3} />}
                {t('sync_status')}
              </button>

              <button 
                onClick={() => {setShowManualTerminal(true); setStep('method'); setPaymentMethod('manual');}} 
                className="mb-12 text-[#5252f2] font-black text-[10px] uppercase tracking-widest hover:text-indigo-800 transition-all border-b-2 border-indigo-50/50 pb-1"
              >
                {t('manual_verify')}
              </button>

              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-12 italic opacity-60">{t('auto_redirect')}</p>
              
              <button onClick={onLogout} className="text-slate-300 font-black text-[11px] uppercase tracking-[0.3em] hover:text-rose-500 transition-all">{t('sign_out')}</button>
            </div>
          </div>
          <KwandaBranding className="mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isLocked ? 'bg-slate-950' : 'bg-slate-50'} flex flex-col p-6 font-sans transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto w-full flex-1">
        <header className="flex flex-col items-center text-center py-10 relative">
          {onClose && !isLocked && <button onClick={onClose} className="absolute top-4 right-0 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"><X size={24} /></button>}
          <Logo size={80} className={`${isLocked ? 'grayscale scale-110 shadow-indigo-600/10' : ''} mb-6 shadow-2xl transition-all`} />
          <h1 className={`text-4xl font-black ${isLocked ? 'text-white italic' : 'text-slate-900'} mb-2 tracking-tighter uppercase`}>{isLocked ? t('restricted_access') : t('activate_tier')}</h1>
          <p className={`${isLocked ? 'text-rose-500' : 'text-slate-400'} font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic`}>{isLocked ? t('license_expired') : 'Billing & Cloud Licensing'}</p>
        </header>

        {step === 'pricing' && (
          <div className="animate-in fade-in duration-500 text-left">
            <div className="flex justify-center mb-12">
               <div className="bg-slate-200/50 p-1 rounded-full flex shadow-inner">
                 <button onClick={() => setBillingCycle('monthly')} className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{t('monthly')}</button>
                 <button onClick={() => setBillingCycle('yearly')} className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{t('yearly')}</button>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 items-stretch">
              {plans.map((p) => (
                <div key={p.id} className={`p-10 rounded-[56px] border-2 transition-all flex flex-col ${p.popular ? 'bg-white border-indigo-600 shadow-2xl scale-105 z-10' : 'bg-white/80 border-slate-100'} h-full group hover:border-indigo-200`}>
                  <div className="mb-10 text-center">
                    <div className="mb-6 inline-flex p-6 rounded-[32px] bg-slate-50 group-hover:scale-110 transition-transform">{p.icon}</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{p.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-black text-slate-900">{p.price}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{p.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-5 mb-12 flex-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-[11px] font-bold text-slate-600">
                        <div className="bg-emerald-100 text-emerald-600 p-1 rounded-lg shrink-0"><Check size={14} strokeWidth={4} /></div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => { 
                      if (p.id === 'free') {
                        handleFreeStart();
                      } else {
                        setSelectedPlan(p.id); setStep('method'); 
                      }
                    }} 
                    className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${p.popular ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-slate-900 text-white'}`}
                  >
                    {p.button}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'method' && (
          <div className="max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 text-left">
            <button onClick={() => {setStep('pricing'); setPaymentMethod(null);}} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 mb-8 tracking-widest"><ArrowLeft size={16} /> {t('back_pricing')}</button>
            
            {paymentMethod === 'manual' ? (
              <div className="space-y-8">
                {renderManualTerminal()}
                <button 
                  onClick={() => setPaymentMethod(null)}
                  className="mx-auto flex items-center gap-3 text-[11px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all tracking-[0.3em]"
                >
                  <Smartphone size={20} /> BACK TO PUSH METHOD
                </button>
              </div>
            ) : (
              <div className="bg-white p-12 pb-16 rounded-[56px] shadow-2xl text-center border border-slate-100">
                 <h3 className="text-3xl font-black text-slate-950 mb-12 uppercase italic tracking-tighter">{t('select_method')}</h3>
                 
                 <div className="grid grid-cols-2 gap-8 mb-8">
                   <button onClick={() => setPaymentMethod('mtn')} className="p-10 rounded-[40px] bg-[#f8fafc] border-2 border-transparent hover:border-slate-200 transition-all flex flex-col items-center gap-6 group">
                      <div className="w-20 h-20 bg-[#c0c0c0] rounded-[24px] flex items-center justify-center text-white font-black text-2xl shadow-inner">MTN</div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">{t('pay_with_momo')}</span>
                   </button>
                   <button onClick={() => setPaymentMethod('airtel')} className="p-10 rounded-[40px] bg-[#f8fafc] border-2 border-transparent hover:border-slate-200 transition-all flex flex-col items-center gap-6 group">
                      <div className="w-20 h-20 bg-[#4d4d4d] rounded-[24px] flex items-center justify-center text-white font-black text-2xl italic shadow-inner">Airtel</div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">{t('pay_with_airtel')}</span>
                   </button>
                 </div>

                 <button 
                  onClick={() => setPaymentMethod('manual')}
                  className="w-full flex items-center justify-center gap-6 py-8 bg-[#eef2ff] border-2 border-[#5252f2] rounded-[36px] transition-all hover:bg-indigo-100 active:scale-[0.98] group"
                 >
                    <div className="w-14 h-14 bg-[#5252f2] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                       <Banknote size={28} />
                    </div>
                    <span className="text-base font-black text-[#5252f2] uppercase tracking-[0.3em] italic">
                      {t('manual_transfer')}
                    </span>
                 </button>

                 {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                   <div className="mt-12 space-y-6 animate-in slide-in-from-top-4 duration-500">
                     <div className="relative">
                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                        <input type="text" placeholder="07XX XXX XXX" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g,''))} className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-black text-2xl text-slate-800 focus:border-indigo-500/20 transition-all" />
                     </div>
                     <button onClick={handleInitiatePush} className="w-full py-6 bg-[#5252f2] text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                       {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><SmartphoneNfc size={20} /> {t('initiate_payment')}</>}
                     </button>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}

        {step === 'result' && (
          <div className="max-w-xl mx-auto w-full animate-in zoom-in-95 text-center">
            <div className="bg-white p-16 rounded-[64px] shadow-2xl border-4 border-emerald-100">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle size={56} /></div>
               <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">{t('status_success')}</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-10">Gateway Transaction Secured</p>
            </div>
          </div>
        )}
      </div>
      
      <footer className="py-10 flex flex-col items-center gap-10">
        <div className="flex gap-4">
          <button onClick={() => setPinMode(true)} className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"><Key size={14} /> {t('use_pin')}</button>
          <button onClick={() => { if(onClose) onClose(); window.location.hash = '#support'; }} className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:bg-indigo-50 hover:border-indigo-100 transition-all"><Headset size={14} /> {t('support_btn')}</button>
          <button onClick={onLogout} className="flex items-center gap-2 px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-700 transition-all"><LogOut size={14} /> Sign Out</button>
        </div>
        
        {/* GLOBAL BRANDING FOOTER */}
        <KwandaBranding />
      </footer>
    </div>
  );
};

export default SubscriptionView;
