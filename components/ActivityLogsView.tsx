import React, { useState, useMemo } from 'react';
import { Clock, User, Info, AlertTriangle, CheckCircle, History, Search, X } from 'lucide-react';
import { ActivityLog, Language } from '../types';

const translations: Record<Language, any> = {
  en: {
    title: "Audit Trail",
    subtitle: "Real-time system events",
    total_events: "Total Events",
    col_time: "Event Time",
    col_identity: "Identity",
    col_action: "Action",
    col_details: "Details",
    no_logs: "No activity logs recorded yet.",
    search_placeholder: "Search users, actions or specifics...",
    no_results: "No events found matching your search."
  },
  rw: {
    title: "Amateka y'Ibyakozwe",
    subtitle: "Ibibaye muri porogaramu ubu",
    total_events: "Ibyakozwe byose",
    col_time: "Igihe",
    col_identity: "Uwakoresheje",
    col_action: "Igikorwa",
    col_details: "Ibindi bisobanuro",
    no_logs: "Nta makuru y'ibyakozwe araboneka.",
    search_placeholder: "Shakisha amazina cyangwa ibyakozwe...",
    no_results: "Nta kintu na kimwe kigaragaye kuri ubwo bushakashatsi."
  },
  fr: {
    title: "Piste d'Audit",
    subtitle: "Événements système en temps réel",
    total_events: "Total des Événements",
    col_time: "Heure de l'Événement",
    col_identity: "Identité",
    col_action: "Action",
    col_details: "Détails",
    no_logs: "Aucun journal d'activité enregistré pour le moment.",
    search_placeholder: "Rechercher des utilisateurs ou des actions...",
    no_results: "Aucun événement ne correspond à votre recherche."
  }
};

interface ActivityLogsViewProps {
  logs: ActivityLog[];
  lang: Language;
}

const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ logs, lang }) => {
  const t = (key: string) => translations[lang][key] || key;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const lowerSearch = searchTerm.toLowerCase();
    return logs.filter(log => 
      log.userName.toLowerCase().includes(lowerSearch) ||
      log.userEmail?.toLowerCase().includes(lowerSearch) ||
      log.action.toLowerCase().includes(lowerSearch) ||
      log.details.toLowerCase().includes(lowerSearch)
    );
  }, [logs, searchTerm]);

  const getTypeColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'error': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-indigo-500 bg-indigo-50 border-indigo-100';
    }
  };

  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      case 'error': return <AlertTriangle size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-12 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-xl font-black text-slate-900 tracking-tight uppercase italic lg:normal-case">{t('title')}</h3>
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic lg:normal-case">{t('subtitle')}</p>
        </div>
        <div className="bg-white border border-slate-100 px-5 lg:px-6 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm shrink-0">
          <History size={16} className="text-slate-300" />
          <span className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {t('total_events')}: {filteredLogs.length}
          </span>
        </div>
      </div>

      {/* SEARCH FILTER BOX */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder={t('search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-[24px] lg:rounded-[28px] shadow-sm focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-slate-800 transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="space-y-4 lg:hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getTypeColor(log.type)}`}>
                {getIcon(log.type)}
                {log.action}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={12} />
                <span className="text-[9px] font-black">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-inner">
                  <User size={18} />
               </div>
               <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800 leading-none">{log.userName}</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 truncate">{log.userEmail}</p>
               </div>
            </div>
            
            <div className="bg-slate-50/80 p-4 rounded-[18px] border border-slate-100">
               <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                  {log.details}
               </p>
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && (
           <div className="py-20 text-center bg-white/50 rounded-[40px] border-4 border-dashed border-slate-100">
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                {logs.length === 0 ? t('no_logs') : t('no_results')}
              </p>
           </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('col_time')}</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('col_identity')}</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('col_action')}</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('col_details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[11px] font-bold text-slate-500">
                        {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
                        <User size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 leading-none">{log.userName}</p>
                        <p className="text-[9px] font-mono text-slate-400 mt-1 truncate">{log.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getTypeColor(log.type)}`}>
                      {getIcon(log.type)}
                      {log.action}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-500 font-medium italic">{log.details}</p>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                    {logs.length === 0 ? t('no_logs') : t('no_results')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsView;