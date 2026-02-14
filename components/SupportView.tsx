import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  ExternalLink, 
  Headset, 
  Loader2, 
  Send, 
  History, 
  CheckCircle2, 
  Clock, 
  X,
  MessageSquare,
  Users,
  Reply,
  Settings2,
  Save,
  SmartphoneNfc,
  MessageSquarePlus
} from 'lucide-react';
import { Language, SupportTicket, User } from '../types';
import { supabase } from '../supabase';

interface SupportViewProps {
  lang: Language;
  user: User;
}

const translations: Record<Language, any> = {
  en: {
    title: "Support Hub",
    subtitle: "Communication & Channel Management",
    sec_channels: "Support Channels",
    sec_messaging: "Messaging Hub",
    status: "System Online",
    setup_channels: "Configure Channels",
    setup_desc: "Update official contact links for all shop owners and personnel.",
    tab_platform: "Platform Chat",
    tab_staff: "Staff Queries",
    whatsapp_title: "WhatsApp Support",
    whatsapp_desc: "Direct link to technical team.",
    call_title: "Direct Help Line",
    call_desc: "Operation manager contact.",
    email_title: "Official Email",
    email_desc: "Billing & formal requests.",
    hours: "Response Time: < 15 Minutes",
    emergency: "For urgent issues, use the direct line.",
    send_msg_admin: "Chat with Admin Sydney",
    send_msg_manager: "Message Shop Manager",
    msg_subject: "Subject",
    msg_body: "Your message...",
    btn_send: "Send Message",
    btn_save: "Save Channels",
    my_tickets: "Chat History",
    no_tickets: "No active conversations.",
    admin_response: "Official Reply"
  },
  rw: {
    title: "Ubufasha",
    subtitle: "Itumanaho n'Imiyoboro",
    sec_channels: "Imiyoboro y'Ubufasha",
    sec_messaging: "Ahantu h'Ubutumwa",
    status: "Sisitemu irakora",
    setup_channels: "Guhindura Imiyoboro",
    setup_desc: "Vugurura imiyoboro y'itumanaho ku bakoresha bose.",
    tab_platform: "Ikiganiro na StockMaster",
    tab_staff: "Ibibazo by'Abakozi",
    whatsapp_title: "WhatsApp y'Ubufasha",
    whatsapp_desc: "Andikira tekiniki ubu.",
    call_title: "Hamagara Direct",
    call_desc: "Vugana na manadjeri ushinzwe akazi.",
    email_title: "Imeyili",
    email_desc: "Kubibazo by'ubwishyu.",
    hours: "Igihe cyo gusubizwa: < 15 Min",
    emergency: "Niba ufite ikibazo cyihutirwa, hamagara.",
    send_msg_admin: "Ganira na Admin Sydney",
    send_msg_manager: "Andikira Manadjeri",
    msg_subject: "Icyo ushaka",
    msg_body: "Andika hano...",
    btn_send: "Ohereza",
    btn_save: "Bika Imiyoboro",
    my_tickets: "Ibiganiro byashize",
    no_tickets: "Nta butumwa buraboneka.",
    admin_response: "Igisubizo"
  },
  fr: {
    title: "Assistance",
    subtitle: "Communication & Gestion",
    sec_channels: "Canaux d'Assistance",
    sec_messaging: "Hub de Messagerie",
    status: "Système en Ligne",
    setup_channels: "Configurer les Canaux",
    setup_desc: "Mise à jour des contacts officiels pour tous.",
    tab_platform: "Chat Plateforme",
    tab_staff: "Requêtes Personnel",
    whatsapp_title: "Support WhatsApp",
    whatsapp_desc: "Lien direct vers l'équipe technique.",
    call_title: "Ligne Directe",
    call_desc: "Contact gestionnaire d'opérations.",
    email_title: "Email Officiel",
    email_desc: "Facturation & requêtes formelles.",
    hours: "Réponse en < 15 Minutes",
    emergency: "Pour les urgences, utilisez la ligne directe.",
    send_msg_admin: "Chatter avec Admin Sydney",
    send_msg_manager: "Contacter le Gérant",
    msg_subject: "Sujet",
    msg_body: "Votre message...",
    btn_send: "Envoyer",
    btn_save: "Enregistrer",
    my_tickets: "Historique",
    no_tickets: "Aucune conversation.",
    admin_response: "Réponse Officielle"
  }
};

const SupportView: React.FC<SupportViewProps> = ({ lang, user }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'platform' | 'staff'>(user.role === 'manager' ? 'platform' : 'staff');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [contacts, setContacts] = useState({
    whatsapp: '',
    phone: '',
    email: ''
  });

  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const fetchSupportData = async () => {
    try {
      const { data: configs } = await supabase.from('system_configs').select('*');
      if (configs) {
        setContacts({
          whatsapp: configs.find(c => c.key === 'support_whatsapp')?.value || '0795009861',
          phone: configs.find(c => c.key === 'support_phone')?.value || '0795009861',
          email: configs.find(c => c.key === 'support_email')?.value || 'support@stockmaster.rw'
        });
      }

      const { data: ticketData } = await supabase
        .from('support_messages')
        .select('*')
        .eq('company_id', user.companyId)
        .order('created_at', { ascending: false });
      
      if (ticketData) {
        try {
          const seenKey = `stockmaster_seen_notifications_${user.companyId}`;
          const seenIds: string[] = JSON.parse(localStorage.getItem(seenKey) || '[]');
          const visible = ticketData.filter((t: any) => !(t.user_id === 'SYSTEM' && seenIds.includes(t.id)));
          setTickets(visible);
        } catch (err) {
          setTickets(ticketData);
        }
      }
    } catch (err) {
      console.error("Support fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportData();
    // Mark current system messages as seen when opening the support hub so they don't reappear
    try {
      (async () => {
        const { data: ticketData } = await supabase
          .from('support_messages')
          .select('id,company_id,user_id,created_at')
          .eq('company_id', user.companyId)
          .order('created_at', { ascending: false });
        if (ticketData) {
          const sysIds = ticketData.filter((t: any) => t.user_id === 'SYSTEM').map((t: any) => t.id);
          const seenKey = `stockmaster_seen_notifications_${user.companyId}`;
          const existing: string[] = JSON.parse(localStorage.getItem(seenKey) || '[]');
          const union = Array.from(new Set([...existing, ...sysIds]));
          localStorage.setItem(seenKey, JSON.stringify(union));
        }
      })();
    } catch (err) {}

    const interval = setInterval(fetchSupportData, 45000);
    return () => clearInterval(interval);
  }, [user.companyId]);

  const handleSaveChannels = async () => {
    setSaving(true);
    try {
      const updates = [
        { key: 'support_whatsapp', value: contacts.whatsapp },
        { key: 'support_phone', value: contacts.phone },
        { key: 'support_email', value: contacts.email }
      ];
      
      const { error } = await supabase.from('system_configs').upsert(updates);
      
      if (error) throw error;
      
      alert("Platform contact channels updated successfully.");
      fetchSupportData();
    } catch (err: any) {
      console.error("Support update error:", err);
      alert(`Update failure: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    setSending(true);
    try {
      await supabase.from('support_messages').insert([{
        company_id: user.companyId,
        user_id: user.id,
        user_name: user.name,
        subject: formData.subject,
        message: formData.message,
        status: 'open'
      }]);
      setFormData({ subject: '', message: '' });
      fetchSupportData();
    } catch (err) {
      alert("Error sending message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-indigo-500 opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">{t('title')}</h2>
          <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('status')}</span>
        </div>
      </div>

      {/* Section 1: Support Channels */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <SmartphoneNfc size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic">{t('sec_channels')}</h3>
        </div>

        {user.role === 'super-admin' ? (
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Settings2 size={24} /></div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">{t('setup_channels')}</h4>
                <p className="text-xs text-slate-400 font-medium">{t('setup_desc')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('whatsapp_title')}</label>
                <input aria-label="WhatsApp contact" placeholder="WhatsApp number" type="text" value={contacts.whatsapp} onChange={e => setContacts({...contacts, whatsapp: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('call_title')}</label>
                <input aria-label="Support phone" placeholder="Support phone" type="text" value={contacts.phone} onChange={e => setContacts({...contacts, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('email_title')}</label>
                <input aria-label="Support email" placeholder="support@domain.com" type="text" value={contacts.email} onChange={e => setContacts({...contacts, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800" />
              </div>
            </div>
            <button onClick={handleSaveChannels} disabled={saving} className="px-8 py-4 bg-[#5252f2] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {t('btn_save')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard icon={<MessageCircle size={28} />} title={t('whatsapp_title')} value={contacts.whatsapp} link={`https://wa.me/${contacts.whatsapp}`} color="text-emerald-600" bg="bg-emerald-50" desc={t('whatsapp_desc')} />
            <ContactCard icon={<Phone size={28} />} title={t('call_title')} value={contacts.phone} link={`tel:${contacts.phone}`} color="text-indigo-600" bg="bg-indigo-50" desc={t('call_desc')} />
            <ContactCard icon={<Mail size={28} />} title={t('email_title')} value={contacts.email} link={`mailto:${contacts.email}`} color="text-rose-600" bg="bg-rose-50" desc={t('email_desc')} />
          </div>
        )}
      </section>

      {/* Section 2: Messaging Hub */}
      <section className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <MessageSquarePlus size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic">{t('sec_messaging')}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[56px] border border-slate-200 shadow-sm sticky top-28">
              <h3 className="text-lg font-black text-slate-900 uppercase italic mb-8">
                {user.role === 'manager' ? t('send_msg_admin') : t('send_msg_manager')}
              </h3>
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('msg_subject')}</label>
                  <input aria-label="Message subject" placeholder="Subject" type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('msg_body')}</label>
                  <textarea aria-label="Message body" placeholder="Your message..." rows={4} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none" />
                </div>
                <button disabled={sending} className="w-full py-5 bg-[#5252f2] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} {t('btn_send')}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
              <History size={16} className="text-slate-300" /> {t('my_tickets')}
            </h4>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[56px] bg-white/50">
                  <HelpCircle className="mx-auto text-slate-200 mb-4" size={56} />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">{t('no_tickets')}</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {ticket.status === 'resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />} {t(`ticket_${ticket.status}`)}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-3">{ticket.subject}</h4>
                    <p className="text-sm text-slate-600 font-medium italic mb-6">"{ticket.message}"</p>
                    {ticket.admin_reply && (
                      <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-l-4 border-l-indigo-500">
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2 italic">{t('admin_response')}</p>
                        <p className="text-sm font-black text-slate-800">{ticket.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactCard = ({ icon, title, value, link, color, bg, desc }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4 group hover:border-indigo-100 hover:-translate-y-1 transition-all">
    <div className={`w-16 h-16 ${bg} ${color} rounded-[24px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-lg font-black text-slate-900 truncate mb-1">{value}</p>
      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{desc}</p>
    </div>
  </a>
);

export default SupportView;