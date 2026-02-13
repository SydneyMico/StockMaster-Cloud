
import React from 'react';
import { ShieldAlert, LogOut, Loader2, RefreshCw, Building2 } from 'lucide-react';
import { User, Language } from '../types';
import Logo from './Logo';
import { KwandaBranding } from '../App';

interface PendingApprovalViewProps {
  user: User;
  lang: Language;
  onLogout: () => void;
  onCheckStatus: () => void;
  checking: boolean;
}

const translations: Record<Language, any> = {
  en: {
    title: "Access Pending", sub: "Security Verification Required", req_shop: "Requested Shop",
    desc: "Hello {name}, your account has been created successfully. For security reasons, the Shop Manager must manually approve your access before you can view inventory or record sales.",
    btn_check: "Check Status Now", btn_logout: "Cancel & Sign Out", footer: "StockMaster Protection System"
  },
  rw: {
    title: "Itegerezwa Kwemezwa", sub: "Hakenewe Uburenganzira", req_shop: "Iduka wasabye",
    desc: "Muraho {name}, konti yawe yafunguwe neza. Kubera impamvu z'umutekano, Manadjeri w'iduka agomba kubanza kwemeza ko ukora hano kugira ngo utangire akazi.",
    btn_check: "Genzura niba byemejwe", btn_logout: "Sohoka", footer: "StockMaster Umutekano Wuzuye"
  },
  fr: {
    title: "Accès en Attente", sub: "Vérification de Sécurité Requise", req_shop: "Magasin Demandé",
    desc: "Bonjour {name}, votre compte a été créé avec succès. Pour des raisons de sécurité, le gérant du magasin doit approuver manuellement votre accès.",
    btn_check: "Vérifier le Statut", btn_logout: "Annuler & Déconnexion", footer: "Système de Protection StockMaster"
  }
};

const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ user, lang, onLogout, onCheckStatus, checking }) => {
  const t = (key: string) => translations[lang][key] || key;
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="p-12 text-center">
          <div className="relative inline-flex mb-8"><Logo size={96} className="shadow-2xl shadow-indigo-600/20 animate-pulse" /><div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={20} /></div></div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{t('title')}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6">{t('sub')}</p>
          <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left border border-slate-100">
            <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400"><Building2 size={16} /></div><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('req_shop')}</p><p className="text-sm font-black text-slate-800">{user.companyName || 'Registered Shop'}</p></div></div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{t('desc').replace('{name}', user.name)}</p>
          </div>
          <div className="space-y-3">
            <button onClick={onCheckStatus} disabled={checking} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3">{checking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />} {t('btn_check')}</button>
            <button onClick={onLogout} className="w-full py-4 text-slate-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"><LogOut size={16} /> {t('btn_logout')}</button>
          </div>
        </div>
        <div className="bg-slate-900 p-8 flex flex-col items-center gap-4">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">{t('footer')}</p>
          <KwandaBranding />
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalView;
