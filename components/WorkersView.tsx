
import React, { useState } from 'react';
import { 
  UserPlus, 
  User, 
  Trash2, 
  Shield, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Ban, 
  Lock, 
  Gem, 
  Zap, 
  Crown, 
  Copy, 
  CheckCircle2, 
  Send,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { User as UserType, UserStatus, PlanType, Language } from '../types';

const translations: Record<Language, any> = {
  en: {
    title: "Management Roster",
    capacity: "Capacity",
    staff_indexed: "Staff Indexed",
    enterprise_access: "Enterprise Access",
    shop_code: "Shop Access Code",
    incoming_apps: "Incoming Applications",
    manual_verify: "Manual verification required",
    authorized: "Authorized Personnel",
    active_access: "Active Access",
    restricted: "Restricted Personnel",
    access_denied: "Access Denied",
    scaling_required: "SCALING REQUIRED",
    capacity_reached: "STAFF CAPACITY REACHED",
    capacity_desc: "Your {plan} plan is capped at {limit} active personnel. Remove staff or upgrade to scale.",
    unlock_pro: "UNLOCK PRO",
    no_personnel: "No Active Personnel",
    share_code: "Share the Shop Code for team members to apply.",
    verified: "Verified",
    locked_out: "Locked Out",
    restore: "Restore",
    purge: "Purge Profile"
  },
  rw: {
    title: "Urutonde rw'Abakozi",
    capacity: "Ubushobozi",
    staff_indexed: "Abakozi banditswe",
    enterprise_access: "Uburenganzira bw'Ubucuruzi",
    shop_code: "Kode y'Iduka",
    incoming_apps: "Abasaba kwinjira",
    manual_verify: "Bisaba kwemezwa n'ubuyobozi",
    authorized: "Abakozi bafite uburenganzira",
    active_access: "Bafite uburenganzira ubu",
    restricted: "Abakozi bahagaritswe",
    access_denied: "Bakuweho uburenganzira",
    scaling_required: "BISABA KWAGURA",
    capacity_reached: "UMUBARE W'ABAKOZI WAGEZE KU MUPAKA",
    capacity_desc: "Gahunda yawe ya {plan} ikwemerera abakozi {limit} gusa. Kuraho abakozi cyangwa gura gahunda isumbyeho.",
    unlock_pro: "GURA PRO",
    no_personnel: "Nta mukozi n'umwe wemewe urimo",
    share_code: "Ha bakozi bawe Kode y'iduka kugira ngo basabe kwinjira.",
    verified: "Yemejwe",
    locked_out: "Yahagaritswe",
    restore: "Garura",
    purge: "Siba burundu"
  },
  fr: {
    title: "Répertoire de Gestion",
    capacity: "Capacité",
    staff_indexed: "Personnel Indexé",
    enterprise_access: "Accès Entreprise",
    shop_code: "Code d'Accès Magasin",
    incoming_apps: "Demandes Entrantes",
    manual_verify: "Vérification manuelle requise",
    authorized: "Personnel Autorisé",
    active_access: "Accès Actif",
    restricted: "Personnel Restreint",
    access_denied: "Accès Refusé",
    scaling_required: "MISE À L'ÉCHELLE",
    capacity_reached: "CAPACITÉ ATTEINTE",
    capacity_desc: "Votre plan {plan} est limité à {limit} membres du personnel. Supprimez du personnel ou améliorez votre plan.",
    unlock_pro: "DÉBLOQUER PRO",
    no_personnel: "Aucun personnel actif",
    share_code: "Partagez le code du magasin pour que les membres de l'équipe puissent postuler.",
    verified: "Vérifié",
    locked_out: "Verrouillé",
    restore: "Restaurer",
    purge: "Supprimer"
  }
};

interface WorkersViewProps {
  workers: UserType[];
  plan: PlanType;
  lang: Language;
  companyId?: string;
  onUpdateWorkerStatus: (workerId: string, status: UserStatus) => void;
  onDeleteWorker: (workerId: string) => void;
  onRecoverEmail?: (email: string) => void;
  onUpgradeRequest: () => void;
}

const WorkersView: React.FC<WorkersViewProps> = ({ workers, plan, lang, companyId, onUpdateWorkerStatus, onDeleteWorker, onRecoverEmail, onUpgradeRequest }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [copied, setCopied] = useState(false);
  
  const pending = workers.filter(w => w.status === 'pending');
  const active = workers.filter(w => w.status === 'active');
  const restricted = workers.filter(w => w.status === 'rejected');
  
  const workerLimit = plan === 'free' ? 1 : (plan === 'growth' ? 5 : 999999);
  const limitReached = active.length >= workerLimit;

  const copyCode = () => {
    if (!companyId) return;
    navigator.clipboard.writeText(companyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = (worker: UserType) => {
    if (confirm(`PERMANENT DELETE: Are you sure you want to completely remove ${worker.name}? This removes their profile and history from your roster.`)) {
      onDeleteWorker(worker.id);
    }
  };

  const handleRevoke = (worker: UserType) => {
    if (confirm(`REVOKE ACCESS: ${worker.name} will be immediately logged out and moved to the Restricted list. Continue?`)) {
      onUpdateWorkerStatus(worker.id, 'rejected');
    }
  };

  const handleRestore = (worker: UserType) => {
    if (limitReached) {
      alert(`Limit reached! Your ${plan} plan only allows ${workerLimit} active staff.`);
      return;
    }
    if (confirm(`RESTORE ACCESS: Grant ${worker.name} permission to log in and manage stock again?`)) {
      onUpdateWorkerStatus(worker.id, 'active');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-slate-900 font-black text-2xl tracking-tight uppercase italic leading-none">{t('title')}</h3>
          <div className="flex items-center gap-3 mt-3">
             <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full transition-all duration-1000 ${limitReached ? 'bg-rose-500' : 'bg-[#5252f2]'} rounded-full`} style={{ width: `${Math.min(100, (active.length / workerLimit) * 100)}%` }} />
             </div>
             <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${limitReached ? 'text-rose-600' : 'text-slate-400'}`}>
               {t('capacity')}: {active.length} / {workerLimit === 999999 ? '∞' : workerLimit} {t('staff_indexed')}
             </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {plan === 'pro' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
              <Crown size={14} /> {t('enterprise_access')}
            </div>
          )}
          {companyId && (
            <div 
              onClick={copyCode}
              className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-[24px] cursor-pointer hover:border-indigo-500 transition-all group shadow-sm"
            >
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('shop_code')}</p>
                <p className="text-sm font-mono font-black text-indigo-600 mt-1">{companyId}</p>
              </div>
              <div className={`p-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'}`}>
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. Applicants Section */}
      {pending.length > 0 && (
        <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">{t('incoming_apps')}</h4>
              <p className="text-[9px] text-amber-600 font-bold uppercase mt-0.5 animate-pulse italic">{t('manual_verify')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pending.map(worker => (
              <div key={worker.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg leading-none">{worker.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{worker.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRemove(worker)}
                    className="p-3.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <UserX size={24} />
                  </button>
                  <button 
                    onClick={() => onUpdateWorkerStatus(worker.id, 'active')}
                    disabled={limitReached}
                    className={`p-3.5 rounded-2xl shadow-xl transition-all active:scale-90 ${limitReached ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700'}`}
                  >
                    {limitReached ? <Lock size={24} /> : <CheckCircle size={24} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Active Personnel Section */}
      <section className="space-y-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">{t('authorized')}</h4>
            <p className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">{t('active_access')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map(worker => (
            <div key={worker.id} className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all group relative overflow-hidden flex flex-col">
              <div className="flex items-center gap-5 mb-8">
                <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center transition-all shadow-inner ${plan === 'pro' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                  <User size={32} />
                </div>
                <div className="min-w-0">
                  <h5 className="font-black text-slate-900 text-lg leading-tight truncate">{worker.name}</h5>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{worker.email}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">{t('verified')}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRecoverEmail?.(worker.email)}
                    className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Notify Credentials"
                  >
                    <Send size={18} />
                  </button>
                  <button 
                    onClick={() => handleRevoke(worker)}
                    className="p-2.5 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                    title="Revoke Access"
                  >
                    <Ban size={18} />
                  </button>
                  <button 
                    onClick={() => handleRemove(worker)}
                    className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {active.length === 0 && (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-[56px] bg-white/50">
              <UserPlus className="mx-auto text-slate-200 mb-4" size={56} />
              <p className="text-slate-400 font-black uppercase text-sm tracking-[0.3em]">{t('no_personnel')}</p>
              <p className="text-[10px] text-slate-300 mt-2 font-medium italic">{t('share_code')}</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Restricted Section (Revoked Users) */}
      {restricted.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">{t('restricted')}</h4>
              <p className="text-[9px] text-rose-500 font-bold uppercase mt-0.5">{t('access_denied')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restricted.map(worker => (
              <div key={worker.id} className="bg-slate-50/50 p-8 rounded-[48px] border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-all flex flex-col group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-slate-200 shadow-inner">
                    <UserX size={28} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-800 text-lg leading-tight truncate">{worker.name}</h5>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{worker.email}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{t('locked_out')}</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleRestore(worker)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <RotateCcw size={14} /> {t('restore')}
                    </button>
                    <button 
                      onClick={() => handleRemove(worker)}
                      className="p-2.5 text-slate-300 hover:text-rose-600 rounded-xl transition-all"
                      title="Purge Profile"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Plan Upsell Banner Matching Reference Image */}
      {limitReached && plan !== 'pro' && (
        <div className="mt-20 p-8 sm:p-10 bg-[#02040a] rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#5252f2]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="flex items-center gap-10 relative z-10">
            <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center backdrop-blur-md shrink-0 border border-white/10 shadow-inner">
              <Zap size={36} className="text-[#5252f2] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#5252f2] uppercase tracking-[0.4em] mb-3 leading-none italic">{t('scaling_required')}</p>
              <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none">{t('capacity_reached')}</h4>
              <p className="text-sm text-slate-400 font-medium mt-3 max-w-md leading-relaxed">
                {t('capacity_desc').replace('{plan}', plan.toUpperCase()).replace('{limit}', workerLimit.toString())}
              </p>
            </div>
          </div>
          <button 
            onClick={onUpgradeRequest}
            className="px-12 py-6 bg-[#5252f2] hover:bg-[#4343e2] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#5252f2]/20 active:scale-95 transition-all relative z-10"
          >
            {t('unlock_pro')}
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkersView;
