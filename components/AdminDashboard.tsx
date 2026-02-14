import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Building2,
  Search,
  X,
  ShieldCheck,
  Zap,
  Crown,
  Loader2,
  LayoutDashboard,
  Users,
  Wallet,
  History,
  RefreshCw,
  Check,
  CreditCard,
  Save,
  Coins,
  MessageCircle,
  Phone,
  Mail,
  Headset,
  MessageSquare,
  Reply,
  Send,
  Inbox,
  Link,
  Diamond,
  Key,
  Lock,
  Settings
} from 'lucide-react';
import { supabase } from '../supabase';
import { PlanType, ActivityLog, SupportTicket, User as UserType } from '../types';
import Logo from './Logo';
import { KwandaBranding } from '../App';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface CompanyItem {
  id: string;
  name: string;
  created_at: string;
  plan?: PlanType;
  end_date?: string;
  is_active?: boolean;
  start_date?: string;
  payer_name?: string;
  payer_phone?: string;
  unlock_pin?: string;
  status?: string;
}

type AdminTab = 'overview' | 'claims' | 'prices' | 'directory' | 'support' | 'logs' | 'settings';
type DurationType = '1mo' | '6mos' | '1yr';

const NavTab: React.FC<{
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
}> = ({ active, label, icon, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all relative shrink-0 ${active ? 'bg-[#5252f2] text-white shadow-lg shadow-[#5252f2]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#02040a]">
        {badge}
      </span>
    )}
  </button>
);

const PlanButton: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all ${active ? 'bg-[#5252f2] border-[#5252f2] text-white shadow-xl shadow-[#5252f2]/20' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
  >
    {icon}
    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [allLogs, setAllLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [adminProfile, setAdminProfile] = useState<{id: string, name: string, email: string, password?: string, updated_at?: string} | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [targetCompany, setTargetCompany] = useState<CompanyItem | null>(null);
  const [modPlan, setModPlan] = useState<PlanType>('free');
  const [modDuration, setModDuration] = useState<DurationType>('1mo');
  const [modPin, setModPin] = useState('');

  const [msgTargetCompany, setMsgTargetCompany] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Support Reply State
  const [replyTicket, setReplyTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [config, setConfig] = useState({
    momo_number: '',
    discount_label: '',
    growth_m: '',
    growth_y: '',
    pro_m: '',
    pro_y: '',
    support_whatsapp: '',
    support_phone: '',
    support_email: '',
    manual_ussd_code: ''
  });

  const fetchListData = useCallback(async (isAuto = false) => {
    if (!isAuto) setIsRefreshing(true);
    try {
      const { data: companiesData } = await supabase.from('companies').select('*');
      const { data: subsData } = await supabase.from('subscriptions').select('*');
      const { data: profilesData } = await supabase.from('profiles').select('id, company_id, role, status, name, email, password, updated_at');
      const { data: ticketData } = await supabase.from('support_messages').select('*').order('created_at', { ascending: false });
      const { data: configData } = await supabase.from('system_configs').select('*');
      const { data: logsData } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(500);

      const admin = profilesData?.find(p => p.role === 'super-admin');
      if (admin) {
        setAdminProfile({ 
          id: admin.id, 
          name: admin.name, 
          email: 'admin@stockmaster.app', 
          password: admin.password,
          updated_at: admin.updated_at 
        });
      }

      if (companiesData) {
        const enriched = companiesData.map(c => {
          const sub = subsData?.find(s => s.company_id === c.id);
          const profile = profilesData?.find(p => p.company_id === c.id && p.role === 'manager');
          return {
            ...c,
            plan: sub?.plan || 'free',
            end_date: sub?.end_date,
            is_active: sub?.is_active ?? true,
            payer_name: sub?.payer_name,
            payer_phone: sub?.payer_phone,
            unlock_pin: sub?.unlock_pin,
            status: profile?.status || 'active'
          };
        });
        setCompanies(enriched);
      }
      if (ticketData) setTickets(ticketData);
      if (logsData) {
        setAllLogs(logsData.map(l => ({
          id: l.id,
          companyId: l.company_id,
          userId: l.user_id,
          userName: l.user_name,
          userEmail: l.user_email,
          action: l.action,
          details: l.details,
          timestamp: l.timestamp,
          type: l.type as ActivityLog['type']
        })));
      }
      if (configData) {
        setConfig({
          momo_number: configData.find(c => c.key === 'momo_number')?.value || '',
          discount_label: configData.find(c => c.key === 'discount_label')?.value || '',
          growth_m: configData.find(c => c.key === 'price_growth_monthly')?.value || '',
          growth_y: configData.find(c => c.key === 'price_growth_yearly')?.value || '',
          pro_m: configData.find(c => c.key === 'price_pro_monthly')?.value || '',
          pro_y: configData.find(c => c.key === 'price_pro_yearly')?.value || '',
          support_whatsapp: configData.find(c => c.key === 'support_whatsapp')?.value || '',
          support_phone: configData.find(c => c.key === 'support_phone')?.value || '',
          support_email: configData.find(c => c.key === 'support_email')?.value || '',
          manual_ussd_code: configData.find(c => c.key === 'manual_ussd_code')?.value || '*182*8*1*'
        });
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      if (!isAuto) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchListData();
    const interval = setInterval(() => fetchListData(true), 60000);
    return () => clearInterval(interval);
  }, [fetchListData]);

  const stats = useMemo(() => {
    const claims = tickets.filter(t => t.subject === 'PAYMENT CLAIM' && t.status === 'open');
    const openSupport = tickets.filter(t => t.status === 'open' && t.subject !== 'PAYMENT CLAIM').length;
    const paidLicenses = companies.filter(c => c.plan !== 'free' && c.is_active).length;
    const revenue = companies.reduce((acc, curr) => {
      if (!curr.is_active) return acc;
      if (curr.plan === 'growth') return acc + 6000;
      if (curr.plan === 'pro') return acc + 10000;
      return acc;
    }, 0);

    return {
      totalShops: companies.length,
      paidLicenses,
      pendingClaims: claims.length,
      openSupport,
      totalRevenue: revenue,
      actualClaims: claims
    };
  }, [companies, tickets]);

  const filteredLogs = useMemo(() => {
    if (!search) return allLogs;
    const q = search.toLowerCase();
    return allLogs.filter(l => 
      l.userName.toLowerCase().includes(q) || 
      l.action.toLowerCase().includes(q) ||
      l.companyId.toLowerCase().includes(q)
    );
  }, [allLogs, search]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const handleAdjustBilling = (company: CompanyItem) => {
    setTargetCompany(company);
    setModPlan(company.plan || 'free');
    setModPin(company.unlock_pin || '');
    setLicenseModalOpen(true);
  };

  const handleSaveLicense = async () => {
    if (!targetCompany) return;
    setIsRefreshing(true);
    try {
      const date = new Date();
      if (modDuration === '1mo') date.setMonth(date.getMonth() + 1);
      else if (modDuration === '6mos') date.setMonth(date.getMonth() + 6);
      else if (modDuration === '1yr') date.setFullYear(date.getFullYear() + 1);
      const newEnd = modPlan === 'free' ? null : date.toISOString();
      await supabase.from('subscriptions').upsert({ 
        company_id: targetCompany.id, plan: modPlan, is_active: true, end_date: newEnd, unlock_pin: modPin || null, updated_at: new Date().toISOString()
      }, { onConflict: 'company_id' });
      setLicenseModalOpen(false);
      fetchListData();
    } catch (err) {
      alert("Save failed.");
    } finally { setIsRefreshing(false); }
  };

  const handleApproveClaim = async (ticket: SupportTicket) => {
    setProcessingId(ticket.id);
    try {
      await supabase.from('support_messages').update({ status: 'resolved' }).eq('id', ticket.id);
      const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 1);
      const { data: sub } = await supabase.from('subscriptions').select('plan').eq('company_id', ticket.company_id).single();
      await supabase.from('subscriptions').upsert({ 
        company_id: ticket.company_id, is_active: true, end_date: expiry.toISOString(), plan: sub?.plan || 'growth', updated_at: new Date().toISOString()
      }, { onConflict: 'company_id' });
      await supabase.from('profiles').update({ status: 'active' }).eq('company_id', ticket.company_id).eq('role', 'manager');
      fetchListData();
    } catch (err) {} finally { setProcessingId(null); }
  };

  const handleDenyClaim = async (ticket: SupportTicket) => {
    if (!window.confirm("Deny this payment claim?")) return;
    setProcessingId(ticket.id);
    try {
      await supabase.from('support_messages').update({ 
        status: 'resolved', 
        admin_reply: 'Payment claim denied. Please verify your transaction details.' 
      }).eq('id', ticket.id);
      fetchListData();
    } catch (err) {
      console.error("Deny claim error:", err);
    } finally { 
      setProcessingId(null); 
    }
  };

  const handleDispatchMessage = async () => {
    if (!msgTargetCompany || !msgSubject || !msgBody) return;
    setIsDispatching(true);
    try {
      await supabase.from('support_messages').insert([{
        company_id: msgTargetCompany,
        user_id: 'SYSTEM',
        user_name: 'SYSTEM ADMIN',
        subject: msgSubject,
        message: msgBody,
        status: 'open'
      }]);
      setMsgSubject('');
      setMsgBody('');
      setMsgTargetCompany('');
      window.alert("Message dispatched to " + msgTargetCompany);
      fetchListData();
    } catch (err) {
      window.alert("Failed to send system message.");
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicket || !replyText) return;
    setIsSendingReply(true);
    try {
      await supabase.from('support_messages').update({
        admin_reply: replyText,
        status: 'resolved',
        updated_at: new Date().toISOString()
      }).eq('id', replyTicket.id);

      await supabase.from('activity_logs').insert([{
        company_id: replyTicket.company_id,
        user_id: adminProfile?.id || 'SYDNEY',
        user_name: 'SYDNEY (Central Admin)',
        action: 'Support Reply Sent',
        details: `Replied to Ticket: ${replyTicket.subject}`,
        type: 'success',
        timestamp: new Date().toISOString()
      }]);

      setReplyTicket(null);
      setReplyText('');
      fetchListData();
    } catch (err) {
      alert("Reply failed.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleUpdateAdminPassword = async () => {
    if (!adminProfile || currentPassword !== adminProfile.password) { alert("Incorrect current key."); return; }
    setIsUpdatingProfile(true);
    try {
      await supabase.auth.updateUser({ password: newPassword });
      await supabase.from('profiles').update({ password: newPassword, updated_at: new Date().toISOString() }).eq('id', adminProfile.id);
      alert("Success. Exiting session."); onLogout();
    } catch (err) { alert("Update failed."); } finally { setIsUpdatingProfile(false); }
  };

  const handleUpdateConfig = async () => {
    setIsSavingConfig(true);
    try {
      const updates = [
        { key: 'support_whatsapp', value: config.support_whatsapp },
        { key: 'support_phone', value: config.support_phone },
        { key: 'support_email', value: config.support_email },
        { key: 'momo_number', value: config.momo_number },
        { key: 'discount_label', value: config.discount_label },
        { key: 'price_growth_monthly', value: config.growth_m },
        { key: 'price_growth_yearly', value: config.growth_y },
        { key: 'price_pro_monthly', value: config.pro_m },
        { key: 'price_pro_yearly', value: config.pro_y },
        { key: 'manual_ussd_code', value: config.manual_ussd_code }
      ];
      await supabase.from('system_configs').upsert(updates);
      alert("Propagated successfully.");
    } catch (err) { alert("Update failed."); } finally { setIsSavingConfig(false); }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-300 flex flex-col overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      {/* ADAPTIVE HEADER */}
      <nav className="h-16 sm:h-20 bg-[#02040a] border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5252f2] rounded-lg flex items-center justify-center shrink-0"><Logo size={20} /></div>
          <div className="min-w-0">
            <h1 className="text-white font-black text-sm sm:text-lg tracking-tighter uppercase italic leading-none truncate">Admin Hub</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Sync Live</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center mx-6">
           <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 overflow-x-auto no-scrollbar">
              <NavTab active={activeTab === 'overview'} label="STATS" icon={<LayoutDashboard size={14} />} onClick={() => setActiveTab('overview')} />
              <NavTab active={activeTab === 'claims'} label="CLAIMS" icon={<Wallet size={14} />} onClick={() => setActiveTab('claims')} badge={stats.pendingClaims} />
              <NavTab active={activeTab === 'prices'} label="CONFIG" icon={<Settings size={14} />} onClick={() => setActiveTab('prices')} />
              <NavTab active={activeTab === 'support'} label="SUPPORT" icon={<Headset size={14} />} onClick={() => setActiveTab('support')} badge={stats.openSupport} />
              <NavTab active={activeTab === 'directory'} label="SHOPS" icon={<Users size={14} />} onClick={() => setActiveTab('directory')} />
              <NavTab active={activeTab === 'logs'} label="LOGS" icon={<History size={14} />} onClick={() => setActiveTab('logs')} />
              <NavTab active={activeTab === 'settings'} label="ACCESS" icon={<Lock size={14} />} onClick={() => setActiveTab('settings')} />
           </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => fetchListData()} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400"><RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /></button>
          <button onClick={onLogout} className="px-4 py-2 bg-white/5 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase italic tracking-widest active:bg-rose-500 active:text-white transition-all">EXIT</button>
        </div>
      </nav>

      {/* MOBILE TAB BAR */}
      <div className="lg:hidden flex items-center gap-1.5 p-3 bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth snap-x sticky top-16 z-50">
          <NavTab active={activeTab === 'overview'} label="STATS" icon={<LayoutDashboard size={12} />} onClick={() => setActiveTab('overview')} />
          <NavTab active={activeTab === 'claims'} label="CLAIMS" icon={<Wallet size={12} />} onClick={() => setActiveTab('claims')} badge={stats.pendingClaims} />
          <NavTab active={activeTab === 'support'} label="SUPPORT" icon={<Headset size={12} />} onClick={() => setActiveTab('support')} badge={stats.openSupport} />
          <NavTab active={activeTab === 'directory'} label="SHOPS" icon={<Users size={12} />} onClick={() => setActiveTab('directory')} />
          <NavTab active={activeTab === 'logs'} label="LOGS" icon={<History size={12} />} onClick={() => setActiveTab('logs')} />
          <NavTab active={activeTab === 'prices'} label="CONFIG" icon={<Settings size={12} />} onClick={() => setActiveTab('prices')} />
          <NavTab active={activeTab === 'settings'} label="ACCESS" icon={<Lock size={12} />} onClick={() => setActiveTab('settings')} />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto no-scrollbar flex flex-col">
        <div className="flex-1">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 animate-in fade-in duration-700">
               <StatCardSmall label="Shops" value={stats.totalShops.toString()} icon={<Building2 />} color="indigo" />
               <StatCardSmall label="Paid" value={stats.paidLicenses.toString()} icon={<Crown />} color="amber" />
               <StatCardSmall label="Claims" value={stats.pendingClaims.toString()} icon={<CreditCard />} color="rose" />
               <StatCardSmall label="Revenue" value={stats.totalRevenue.toLocaleString()} unit="RWF" icon={<Coins />} color="emerald" />
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {stats.actualClaims.map(ticket => (
                    <div key={ticket.id} className="bg-[#0a0c14] p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-white/5 shadow-2xl relative">
                       <div className="flex justify-between items-start mb-6">
                          <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/5 px-2 py-0.5 rounded-full border border-indigo-400/10">CLAIM</span>
                          <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</span>
                       </div>
                       <h3 className="text-base font-black text-white mb-2 truncate">#{ticket.company_id}</h3>
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"{ticket.message}"</p>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => handleDenyClaim(ticket)} className="flex-1 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest">DENY</button>
                          <button onClick={() => handleApproveClaim(ticket)} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                             {processingId === ticket.id ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />} OK
                          </button>
                       </div>
                    </div>
                  ))}
                  {stats.actualClaims.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-40">
                       <ShieldCheck className="mx-auto mb-4 text-indigo-500" size={48} />
                       <p className="text-white font-black text-[10px] uppercase tracking-widest">No claims found</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 animate-in fade-in duration-500">
               <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0a0c14] p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><Wallet size={18} /></div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter">GATEWAY CONFIG</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase">MOMO NUMBER</label><input aria-label="MOMO number" placeholder="e.g. 07XXXXXXXX" type="text" value={config.momo_number} onChange={e => setConfig({...config, momo_number: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black outline-none focus:border-indigo-500" /></div>
                     <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase">USSD CODE</label><input aria-label="USSD code" placeholder="e.g. *182*8*1*" type="text" value={config.manual_ussd_code} onChange={e => setConfig({...config, manual_ussd_code: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-emerald-400 font-black outline-none focus:border-indigo-500" /></div>
                     <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase">PROMO LABEL</label><input aria-label="Promo label" placeholder="e.g. SALE" type="text" value={config.discount_label} onChange={e => setConfig({...config, discount_label: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-xs outline-none" /></div>
                  </div>
                </div>

                <div className="bg-[#0a0c14] p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl"><Link size={18} /></div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter">GLOBAL CHANNELS</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-2"><MessageCircle size={10} /> WHATSAPP</label>
                      <input type="text" value={config.support_whatsapp} onChange={e => setConfig({...config, support_whatsapp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500" placeholder="e.g. 07XXXXXXXX" />
                     </div>
                     <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-2"><Phone size={10} /> HELP LINE</label>
                      <input type="text" value={config.support_phone} onChange={e => setConfig({...config, support_phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500" placeholder="e.g. 07XXXXXXXX" />
                     </div>
                     <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-2"><Mail size={10} /> OFFICIAL EMAIL</label>
                      <input type="email" value={config.support_email} onChange={e => setConfig({...config, support_email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500" placeholder="support@domain.com" />
                     </div>
                  </div>
                </div>
               </div>

              <div className="lg:col-span-8">
                <div className="bg-[#0a0c14] p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] border border-white/5 shadow-2xl space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Zap size={24} /></div>
                    <h3 className="text-lg sm:text-2xl font-black text-white uppercase italic tracking-tighter">LICENSING TIERS (RWF)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <PriceTierBox title="GROWTH" monthly={config.growth_m} yearly={config.growth_y} setM={v => setConfig({...config, growth_m: v})} setY={v => setConfig({...config, growth_y: v})} color="indigo" />
                     <PriceTierBox title="PRO" monthly={config.pro_m} yearly={config.pro_y} setM={v => setConfig({...config, pro_m: v})} setY={v => setConfig({...config, pro_y: v})} color="amber" />
                  </div>
                  <button onClick={handleUpdateConfig} disabled={isSavingConfig} className="w-full py-6 bg-[#5252f2] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                    {isSavingConfig ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> DEPLOY GLOBAL UPDATES</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                  <div className="bg-[#0a0c14] p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-white/5 shadow-2xl flex flex-col min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Stream Monitor</h3>
                      <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Inbox size={10} /> {tickets.filter(t => t.status === 'open').length} ACTIVE
                      </div>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[600px]">
                      {tickets.map(ticket => (
                          <div 
                            key={ticket.id} 
                            onClick={() => setReplyTicket(ticket)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${ticket.status === 'open' ? 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/50' : 'bg-black/20 border-white/5 opacity-60'}`}
                          >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col">
                                  <h4 className="text-[10px] font-black text-indigo-400 uppercase italic truncate max-w-[120px]">#{ticket.company_id}</h4>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{ticket.user_name}</p>
                                </div>
                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-600'}`}>{ticket.status}</span>
                            </div>
                            <p className="text-[11px] text-white font-medium mb-4 line-clamp-2 italic leading-relaxed">"{ticket.message}"</p>
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                              <span className="text-[7px] font-black text-slate-600 uppercase">{new Date(ticket.created_at).toLocaleString()}</span>
                              <div className="flex items-center gap-2 text-indigo-400 group-hover:translate-x-1 transition-transform">
                                <span className="text-[8px] font-black uppercase">REPLY</span>
                                <Reply size={10} />
                              </div>
                            </div>
                          </div>
                      ))}
                      {tickets.length === 0 && (
                        <div className="py-20 text-center opacity-20">
                          <MessageSquare size={48} className="mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Inbox Empty</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0a0c14] p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-white/5 shadow-2xl flex flex-col">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">
                      {replyTicket ? 'Reply Terminal' : 'Platform Dispatch'}
                    </h3>
                    
                    {replyTicket ? (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                         <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2"><button aria-label="Close reply" title="Close reply" onClick={() => { setReplyTicket(null); setReplyText(''); }} className="text-slate-500 hover:text-white"><X size={14} /></button></div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Replying to {replyTicket.user_name}</p>
                            <h4 className="text-sm font-black text-white mb-2">{replyTicket.subject}</h4>
                            <p className="text-[10px] text-slate-400 italic">"{replyTicket.message}"</p>
                         </div>
                         
                         <form className="space-y-5 flex-1 flex flex-col" onSubmit={handleSendReply}>
                            <div className="flex-1 space-y-1.5">
                               <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">OFFICIAL RESPONSE</label>
                               <textarea 
                                 autoFocus
                                 rows={8} 
                                 required 
                                 value={replyText} 
                                 onChange={e => setReplyText(e.target.value)} 
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm h-full" 
                                 placeholder="Type your official reply here..." 
                               />
                            </div>
                            <button disabled={isSendingReply} type="submit" className="w-full py-5 bg-[#5252f2] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 group active:scale-95 transition-all mt-4">
                              {isSendingReply ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /> EMIT RESPONSE</>}
                            </button>
                         </form>
                      </div>
                    ) : (
                      <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleDispatchMessage(); }}>
                        <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">SHOP ID</label><input type="text" required value={msgTargetCompany} onChange={e => setMsgTargetCompany(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black text-sm outline-none focus:border-indigo-500" placeholder="SM-XXXXXX" /></div>
                        <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">SUBJECT</label><input type="text" required value={msgSubject} onChange={e => setMsgSubject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none" placeholder="Official Update" /></div>
                        <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">MESSAGE</label><textarea rows={4} required value={msgBody} onChange={e => setMsgBody(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium outline-none resize-none" placeholder="System notification text..." /></div>
                        <button disabled={isDispatching} className="w-full py-4 bg-[#5252f2] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                          {isDispatching ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} BROADCAST MESSAGE
                        </button>
                      </form>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
               <div className="bg-[#0a0c14] p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] border border-white/5 shadow-2xl space-y-8">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">Security Center</h3>
                  <div className="space-y-4">
                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Global Identity</p>
                        <p className="text-sm font-black text-white truncate">{adminProfile?.email}</p>
                     </div>
                     <div className="space-y-4">
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-rose-500 transition-all font-bold text-sm" placeholder="CURRENT MASTER KEY" />
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-all font-bold text-sm" placeholder="NEW SECURITY KEY" />
                        <button onClick={handleUpdateAdminPassword} disabled={!currentPassword || !newPassword || isUpdatingProfile} className="w-full py-4 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">
                          {isUpdatingProfile ? <Loader2 size={12} className="animate-spin mx-auto" /> : 'REWRITE LINK'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'logs' && (
             <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">LOGS EXPLORER</h2>
                  <div className="relative w-full sm:w-80">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                     <input type="text" placeholder="Filter audit trail..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-xs text-white font-bold" />
                  </div>
               </div>
               <div className="bg-[#0a0c14] rounded-[24px] sm:rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto no-scrollbar">
                     <table className="w-full text-left min-w-[800px]">
                        <thead><tr className="bg-black/40 border-b border-white/5"><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Time</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Shop/User</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Event</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Details</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.02]">
                           {filteredLogs.map(log => (
                              <tr key={log.id} className="hover:bg-white/[0.01] group">
                                <td className="px-8 py-4 text-[9px] font-bold text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-8 py-4"><p className="text-[10px] font-black text-indigo-400 truncate max-w-[120px]">{log.userName}</p><p className="text-[7px] font-mono text-slate-700">{log.companyId}</p></td>
                                <td className="px-8 py-4"><span className="text-[8px] font-black uppercase text-white/60">{log.action}</span></td>
                                <td className="px-8 py-4 text-[9px] text-slate-500 italic truncate max-w-[300px]">{log.details}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">SHOPS DIRECTORY</h2>
                  <div className="relative w-full sm:w-80">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                     <input type="text" placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-xs text-white font-bold" />
                  </div>
               </div>
               <div className="bg-[#0a0c14] rounded-[24px] sm:rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto no-scrollbar">
                     <table className="w-full text-left min-w-[700px]">
                        <thead><tr className="bg-black/40 border-b border-white/5"><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Shop Identity</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Plan</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Expiry</th><th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.02]">
                           {filteredCompanies.map(c => (
                              <tr key={c.id} className="hover:bg-white/[0.01] transition-colors group">
                                 <td className="px-8 py-5"><p className="text-xs font-black text-white mb-0.5">{c.name}</p><p className="text-[7px] font-mono text-slate-600 tracking-widest uppercase">{c.id}</p></td>
                                 <td className="px-8 py-5"><span className="text-[9px] font-black uppercase text-indigo-400">{c.plan}</span></td>
                                 <td className="px-8 py-5 text-[9px] font-bold text-slate-500">{c.end_date ? new Date(c.end_date).toLocaleDateString() : 'LIFETIME'}</td>
                                 <td className="px-8 py-5 text-right"><button onClick={() => handleAdjustBilling(c)} className="px-4 py-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest">BILLING</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        {/* ADMIN FOOTER BRANDING */}
        <KwandaBranding className="mt-20 mb-8" />
      </main>

      {/* MODAL: LICENSE MODIFICATION (RESPONSIVE) */}
      {licenseModalOpen && targetCompany && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md">
           <div className="w-full max-w-xl bg-[#0a0c14] rounded-t-[32px] sm:rounded-[48px] border-t sm:border border-white/5 p-6 sm:p-10 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-8 text-left">
                 <div>
                    <h3 className="text-xl sm:text-3xl font-black text-white italic tracking-tighter uppercase">LICENSE UPDATE</h3>
                    <p className="text-[8px] font-black text-[#5252f2] uppercase tracking-widest mt-1">FOR: {targetCompany.name}</p>
                 </div>
                 <button aria-label="Close modal" title="Close modal" onClick={() => setLicenseModalOpen(false)} className="p-2 bg-white/5 rounded-full text-slate-500"><X size={16} /></button>
              </div>
              
              <div className="space-y-6 sm:space-y-8 text-left">
                 <div className="grid grid-cols-3 gap-3 sm:gap-5">
                    <PlanButton active={modPlan === 'free'} icon={<Diamond size={18} />} label="FREE" onClick={() => setModPlan('free')} />
                    <PlanButton active={modPlan === 'growth'} icon={<Zap size={18} />} label="GROWTH" onClick={() => setModPlan('growth')} />
                    <PlanButton active={modPlan === 'pro'} icon={<Crown size={18} />} label="PRO" onClick={() => setModPlan('pro')} />
                 </div>

                 <div className="bg-[#02040a] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-[#5252f2]/20 text-[#5252f2] rounded flex items-center justify-center"><Key size={14} /></div>
                       <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Security PIN</h4>
                    </div>
                    <input 
                      type="text" maxLength={6} placeholder="6-DIGIT PIN" value={modPin} 
                      onChange={e => setModPin(e.target.value.replace(/\D/g,''))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-xl font-black text-[#10b981] tracking-[0.4em] outline-none text-center"
                    />
                 </div>

                 <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
                    {(['1mo', '6mos', '1yr'] as DurationType[]).map(d => (
                       <button key={d} onClick={() => setModDuration(d)} className={`flex-1 py-2.5 rounded-full text-[8px] font-black uppercase transition-all ${modDuration === d ? 'bg-[#5252f2] text-white' : 'text-slate-600'}`}>{d}</button>
                    ))}
                 </div>

                 <button onClick={handleSaveLicense} disabled={isRefreshing} className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all mb-4 sm:mb-0">
                    {isRefreshing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'OVERRIDE LICENSE'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCardSmall = ({ label, value, unit, icon, color }: any) => {
  const colorMap: any = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="bg-[#0a0c14] p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-white/5 shadow-2xl flex items-center justify-between group hover:border-[#5252f2]/30 transition-all">
      <div className="min-w-0">
         <p className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
         <div className="flex items-baseline gap-1.5">
           <span className="text-2xl sm:text-4xl font-black text-white tracking-tighter truncate">{value}</span>
           {unit && <span className="text-[7px] sm:text-[8px] font-black text-slate-700 uppercase shrink-0">{unit}</span>}
         </div>
      </div>
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 group-hover:scale-110 transition-transform ${colorMap[color]}`}>
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      </div>
    </div>
  );
};

const PriceTierBox = ({ title, monthly, yearly, setM, setY, color }: any) => (
  <div className="bg-black/20 p-6 sm:p-8 rounded-[32px] border border-white/5 space-y-5">
    <div className="flex items-center gap-3 mb-2">
      {title === 'GROWTH' ? <Zap size={14} className="text-indigo-400" /> : <Crown size={14} className="text-amber-500" />}
      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{title} PLAN</h4>
    </div>
    <div className="space-y-1.5"><label className="text-[7px] font-black text-slate-600 uppercase">MONTHLY</label><input aria-label={`${title} monthly price`} placeholder="Monthly price" type="text" value={monthly} onChange={e => setM(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black text-base outline-none" /></div>
    <div className="space-y-1.5"><label className="text-[7px] font-black text-slate-600 uppercase">YEARLY</label><input aria-label={`${title} yearly price`} placeholder="Yearly price" type="text" value={yearly} onChange={e => setY(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black text-base outline-none" /></div>
  </div>
);

export default AdminDashboard;
