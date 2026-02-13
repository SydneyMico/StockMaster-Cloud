
import React, { useState } from 'react';
import { Key, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { supabase } from '../supabase';
import { Language } from '../types';
import Logo from './Logo';

interface ResetPasswordViewProps {
  email: string;
  lang: Language;
  onComplete: () => void;
}

const translations: Record<Language, any> = {
  en: {
    title: "Security Center", sub: "Recovering access for {email}",
    new_key: "New Security Key", confirm_key: "Confirm Security Key",
    btn_reset: "Finalize Recovery", success_title: "Credential Updated",
    success_desc: "Security link has been fulfilled. Redirecting to Login...",
    btn_back: "Back to Login", footer: "Encrypted Recovery Hub"
  },
  rw: {
    title: "Ibiranga Umutekano", sub: "Guhindura ijambo ry'ibanga rya {email}",
    new_key: "Ijambo ry'ibanga rishya", confirm_key: "Emeza ijambo ry'ibanga",
    btn_reset: "Emeza impinduka", success_title: "Byahindutse neza",
    success_desc: "Konti yawe yafunguwe. Urerekeza ahabanza vuba...",
    btn_back: "Subira ahabanza", footer: "Umutekano Wuzuye"
  },
  fr: {
    title: "Centre de Sécurité", sub: "Récupération pour {email}",
    new_key: "Nouveau Mot de Passe", confirm_key: "Confirmer Mot de Passe",
    btn_reset: "Finaliser Récupération", success_title: "Identifiant Mis à Jour",
    success_desc: "Lien de sécurité rempli. Redirection vers Connexion...",
    btn_back: "Retour à la Connexion", footer: "Hub de Récupération Chiffré"
  }
};

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ email, lang, onComplete }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError(lang === 'rw' ? "Amagambo y'ibanga ntaguhura." : "Passwords do not match."); return; }
    if (password.length < 6) { setError(lang === 'rw' ? "Rigomba kugira imibare 6." : "Minimum 6 characters."); return; }
    setLoading(true); setError(null);
    try {
      const { data: user } = await supabase.from('profiles').select('id, company_id, name').eq('email', email).single();
      if (!user) throw new Error("Security identity verification failed.");
      const { error: updateError } = await supabase.from('profiles').update({ password: password }).eq('id', user.id);
      if (updateError) throw updateError;
      await supabase.from('activity_logs').insert([{ company_id: user.company_id, user_id: user.id, user_name: user.name, action: "Password Recovered", details: `User reset password.`, type: 'success', timestamp: new Date().toISOString() }]);
      setSuccess(true); setTimeout(() => onComplete(), 3000);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans text-left">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-lg bg-white rounded-[56px] shadow-2xl relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="p-10 pt-12 flex flex-col items-center">
          <header className="flex flex-col items-center text-center mb-10"><Logo size={80} className="mb-6 shadow-2xl shadow-indigo-600/20" /><h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{t('title')}</h1><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">{t('sub').replace('{email}', email)}</p></header>
          {success ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in duration-500 w-full">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={40} /></div>
               <div><h3 className="text-2xl font-black text-slate-900">{t('success_title')}</h3><p className="text-sm text-slate-500 font-medium mt-2">{t('success_desc')}</p></div>
               <button onClick={onComplete} className="flex items-center gap-2 mx-auto text-indigo-600 font-black text-[10px] uppercase tracking-widest">{t('btn_back')} <ArrowRight size={14} /></button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6 w-full">
              {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-rose-100"><ShieldCheck size={18} /> {error}</div>}
              <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('new_key')}</label><div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('confirm_key')}</label><div className="relative"><Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10" /></div></div>
              <button disabled={loading} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 mt-4">{loading ? <Loader2 className="animate-spin" size={20} /> : t('btn_reset')}</button>
            </form>
          )}
          <footer className="mt-10 flex flex-col items-center gap-3 border-t border-slate-50 pt-8 w-full">
            <div className="flex items-center gap-2 opacity-30">
              <ShieldCheck size={12} /> 
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{t('footer')}</p>
            </div>
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-20">Powered by KWANDA Systems</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
