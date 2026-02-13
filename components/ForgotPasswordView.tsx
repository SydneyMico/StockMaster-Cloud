
import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../supabase';
import { Language } from '../types';
import Logo from './Logo';

interface ForgotPasswordViewProps {
  lang: Language;
  onBack: () => void;
}

const translations: Record<Language, any> = {
  en: {
    title: "Password Recovery",
    sub: "Enter your registered email. We will send a secure recovery link to your inbox.",
    email_label: "Professional Email",
    btn_send: "Send Recovery Email",
    back_login: "Back to Login",
    success_title: "System Email Sent",
    success_desc: "A secure reset link has been dispatched to your email address. This link is valid for 24 hours.",
    check_spam: "If you don't see it, please check your spam or junk folder.",
    footer: "Secure Authentication Gateway"
  },
  rw: {
    title: "Guhindura Ijambo ry'ibanga",
    sub: "Injiza imeyili yawe. Turakwoherereza uburyo bwo guhindura ijambo ry'ibanga mu butumwa bwawe.",
    email_label: "Imeyili yawe",
    btn_send: "Ohereza ubutumwa",
    back_login: "Subira ahabanza",
    success_title: "Ubutumwa bwoherejwe",
    success_desc: "Ubutumwa bukubiyemo aho uhindurira ijambo ry'ibanga bwoherejwe kuri imeyili yawe.",
    check_spam: "Ntiwibagirwe kureba no mu butumwa bwa 'Spam' niba utabubonye.",
    footer: "Umutekano Wuzuye wa StockMaster"
  },
  fr: {
    title: "Récupération",
    sub: "Entrez votre e-mail. Nous enverrons un lien de récupération sécurisé à votre boîte de réception.",
    email_label: "E-mail Professionnel",
    btn_send: "Envoyer l'E-mail",
    back_login: "Retour à la Connexion",
    success_title: "E-mail Système Envoyé",
    success_desc: "Un lien de réinitialisation sécurisé a été envoyé à votre adresse e-mail. Ce lien est valide pendant 24 heures.",
    check_spam: "Si vous ne le voyez pas, veuillez vérifier votre dossier de courriers indésirables.",
    footer: "Passerelle d'Authentification Sécurisée"
  }
};

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ lang, onBack }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Check if user exists in our business database
      const { data: user, error: userErr } = await supabase
        .from('profiles')
        .select('id, name, company_id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (userErr) throw userErr;

      if (!user) {
        throw new Error(lang === 'rw' ? "Iyi imeyili ntibashije kuboneka muri sisitemu." : "This email is not registered in our system.");
      }

      // 2. Trigger the ACTUAL Supabase Auth Reset Email
      const { error: authErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/?mode=reset&email=${encodeURIComponent(cleanEmail)}`,
      });

      if (authErr) throw authErr;

      // 3. Log a high-priority support ticket/notification for the admin
      await supabase.from('support_messages').insert([{
        company_id: user.company_id,
        user_id: user.id,
        user_name: user.name,
        subject: "SYSTEM PASSWORD RESET TRIGGERED",
        message: `User ${user.name} initiated an automated password reset. Supabase Auth email dispatched.`,
        status: 'open'
      }]);

      // 4. Log to activity logs
      await supabase.from('activity_logs').insert([{
        company_id: user.company_id,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        action: "RECOVERY DISPATCHED",
        details: "Automated recovery email successfully triggered via Supabase Auth.",
        type: 'info',
        timestamp: new Date().toISOString()
      }]);

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans text-left">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-lg bg-white rounded-[56px] shadow-2xl relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="p-10 pt-12">
          <header className="flex flex-col items-center text-center mb-10">
            <Logo size={80} className="mb-6 shadow-2xl shadow-indigo-600/20" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{t('title')}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic">{t('footer')}</p>
          </header>

          {submitted ? (
            <div className="space-y-8 animate-in fade-in duration-500 text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{t('success_title')}</h3>
                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 text-left">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {t('success_desc')}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest italic">{t('check_spam')}</p>
                </div>
              </div>
              <button 
                onClick={onBack}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 transition-all hover:bg-black active:scale-95"
              >
                <ArrowLeft size={18} /> {t('back_login')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 mb-2">
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  {t('sub')}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-rose-100 animate-shake">
                  <ShieldCheck size={18} /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('email_label')}</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required 
                    autoFocus
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full py-5 bg-[#5252f2] text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> {t('btn_send')}</>}
                </button>
                <button 
                  type="button"
                  onClick={onBack}
                  className="w-full py-5 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ArrowLeft size={16} /> {t('back_login')}
                </button>
              </div>
            </form>
          )}

          <footer className="mt-10 flex flex-col items-center gap-6 border-t border-slate-50 pt-8">
            <div className="flex items-center gap-2 opacity-30">
              <ShieldCheck size={12} /> 
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Encrypted Cloud Link v4.5</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
