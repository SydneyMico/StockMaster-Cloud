
import React, { useState } from 'react';
import { BookOpen, UserCheck, Package, ShoppingCart, BarChart3, ShieldCheck, Zap, HelpCircle, ChevronRight, CheckCircle2, Info, Users, Smartphone, CreditCard } from 'lucide-react';
import { Language, Role } from '../types';

interface ManualViewProps {
  lang: Language;
  userRole: Role;
}

// Added missing 'fr' translation to satisfy the Language record requirement
const translations: Record<Language, any> = {
  en: {
    title: "System Documentation",
    subtitle: "Complete operational guide for StockMaster Cloud",
    owner_guide: "Shop Owner (Manager)",
    staff_guide: "Personnel (Worker)",
    owner_desc: "Control your business growth and security.",
    staff_desc: "Manage day-to-day sales and inventory.",
    step: "Step",
    basics: "CORE WORKFLOWS",
    faq: "FREQUENTLY ASKED QUESTIONS",
    manager_steps: [
      { 
        title: "Inventory Setup", 
        desc: "Add your items in 'STOCK LIST'. Define the Cost Price (what you paid) and Selling Price (what the customer pays). This allows the system to calculate your interest/profit automatically.",
        icon: <Package />
      },
      { 
        title: "Staff Approval", 
        desc: "Workers join using your 'SHOP CODE'. You MUST go to the 'PERSONNEL' tab and click the checkmark to approve them before they can log in.",
        icon: <UserCheck />
      },
      { 
        title: "Audit Reports", 
        desc: "Use the 'ANALYSIS' tab to see revenue and profit. Export 'Stock Out Income Reports' in PDF for official records.",
        icon: <BarChart3 />
      }
    ],
    staff_steps: [
      { 
        title: "Recording Sales", 
        desc: "Go to 'SELL NOW', find the item, and add to cart. You can adjust the quantity and the final negotiated price before clicking 'Complete'.",
        icon: <ShoppingCart />
      },
      { 
        title: "Stock Check", 
        desc: "Always check the 'STOCK LIST' to see real-time availability. Items in Red are below your safety threshold.",
        icon: <Info />
      }
    ]
  },
  rw: {
    title: "Igitabo cy'Ubufasha",
    subtitle: "Uko ukoresha StockMaster Cloud mu buryo bwuzuye",
    owner_guide: "Nyir'ubucuruzi (Manadjeri)",
    staff_guide: "Umukozi (Worker)",
    owner_desc: "Genzura ubucuruzi bwawe n'umutekano wabwo.",
    staff_desc: "Gucunga ibicuruzwa n'igurisha rya buri munsi.",
    step: "Intambwe",
    basics: "UKO IKORESHWA",
    faq: "IBIBAZO BIBAZWA CYANE",
    manager_steps: [
      { 
        title: "Gushyiramo Ibisigaye", 
        desc: "Andika ibicuruzwa byawe muri 'STOCK LIST'. Shyiramo igiciro wabiguze n'icyo ubigurisha. Sisitemu azajya ikubara inyungu mu buryo bwikora.",
        icon: <Package />
      },
      { 
        title: "Kwemeza Abakozi", 
        desc: "Abakozi binjira bakoresheje 'KODE Y'IDUKA'. Ugomba kujya muri 'PERSONNEL' ukemeza umukozi kanda akamenyetso k'icyatsi (checkmark).",
        icon: <UserCheck />
      },
      { 
        title: "Raporo z'Inyungu", 
        desc: "Kanda 'ANALYSIS' urebe ayinjira n'inyungu. Kura raporo muri PDF (Stock Out Income Report) kugira ngo ubibike neza.",
        icon: <BarChart3 />
      }
    ],
    staff_steps: [
      { 
        title: "Kugurisha Ibisohoka", 
        desc: "Jya kuri 'SELL NOW', shakisha igicuruzwa, ugishyire mu gaseke (cart). Ushobora guhindura umubare cyangwa igiciro mwavuganye mbere yo kwemeza.",
        icon: <ShoppingCart />
      },
      { 
        title: "Kureba Ibisigaye", 
        desc: "Buri gihe jya kuri 'STOCK LIST' urebe niba ibyo ushaka bihari. Ibyanditse mu mutuku bivuze ko bishize.",
        icon: <Info />
      }
    ]
  },
  fr: {
    title: "Documentation Système",
    subtitle: "Guide opérationnel complet pour StockMaster Cloud",
    owner_guide: "Propriétaire (Gérant)",
    staff_guide: "Personnel (Employé)",
    owner_desc: "Contrôlez la croissance et la sécurité de votre entreprise.",
    staff_desc: "Gérez les ventes et l'inventaire au quotidien.",
    step: "Étape",
    basics: "FLUX DE TRAVAIL",
    faq: "FOIRE AUX QUESTIONS",
    manager_steps: [
      { 
        title: "Configuration de l'Inventaire", 
        desc: "Ajoutez vos articles dans 'STOCK LIST'. Définissez le prix de revient et le prix de vente. Cela permet au système de calculer automatiquement votre profit.",
        icon: <Package />
      },
      { 
        title: "Approbation du Personnel", 
        desc: "Les employés rejoignent via votre 'CODE MAGASIN'. Vous DEVEZ aller dans l'onglet 'PERSONNEL' et cliquer sur l'encoche pour les approuver.",
        icon: <UserCheck />
      },
      { 
        title: "Rapports d'Audit", 
        desc: "Utilisez l'onglet 'ANALYSE' pour voir les revenus et profits. Exportez les rapports de revenus en PDF pour les archives officielles.",
        icon: <BarChart3 />
      }
    ],
    staff_steps: [
      { 
        title: "Enregistrement des Ventes", 
        desc: "Allez dans 'SELL NOW', trouvez l'article et ajoutez-le au panier. Vous pouvez ajuster la quantité et le prix final avant de cliquer sur 'Terminer'.",
        icon: <ShoppingCart />
      },
      { 
        title: "Vérification du Stock", 
        desc: "Vérifiez toujours la 'STOCK LIST' pour voir la disponibilité en temps réel. Les articles en rouge sont sous votre seuil de sécurité.",
        icon: <Info />
      }
    ]
  }
};

const ManualView: React.FC<ManualViewProps> = ({ lang, userRole }) => {
  const t = translations[lang] || translations['en'];
  const [activeRole, setActiveRole] = useState<Role>(userRole);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">{t.title}</h2>
          <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[24px] shadow-inner">
          <button 
            onClick={() => setActiveRole('manager')}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRole === 'manager' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            {t.owner_guide}
          </button>
          <button 
            onClick={() => setActiveRole('worker')}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRole === 'worker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            {t.staff_guide}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase italic">{t.basics}</h3>
          </div>

          <div className="space-y-6">
            {(activeRole === 'manager' ? t.manager_steps : t.staff_steps).map((step: any, idx: number) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex gap-8 group hover:border-indigo-100 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[24px] flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{t.step} {idx + 1}</span>
                    <ChevronRight size={14} className="text-slate-200" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Help */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <HelpCircle className="text-indigo-400 mb-6" size={48} strokeWidth={2.5} />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t.faq}</h3>
              <div className="space-y-6">
                <FAQItem 
                  question={lang === 'rw' ? "Kuki mbona 'Restricted Access'?" : "Why am I restricted?"} 
                  answer={lang === 'rw' ? "Bivuze ko ubwishyu bwawe bwarangiye. Kanda 'Upgrade Shop' maze wishyure uburyo bwa Growth cyangwa Pro." : "This means your license has expired. Click 'Upgrade Shop' to renew your Growth or Pro subscription."} 
                />
                <FAQItem 
                  question={lang === 'rw' ? "Nshobora gukoresha telefone?" : "Can I use it on mobile?"} 
                  answer={lang === 'rw' ? "Yego, StockMaster ikora neza kuri telefone yose. Kanda 'Add to Home Screen' kugira ngo yishyiremo." : "Yes, StockMaster is optimized for mobile. Use the 'Add to Home Screen' option for a full-screen app experience."} 
                />
                <FAQItem 
                  question={lang === 'rw' ? "Sydney ni nde?" : "Who is Sydney?"} 
                  answer={lang === 'rw' ? "Sydney ni Admin mukuru. Niwe wemeza ubwishyu bwakozwe mu buryo bwa manual (Momo)." : "Sydney is the platform's Central Admin who manually verifies and unlocks manual payments (Momo transfers)."} 
                />
              </div>
           </div>

           <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[40px] space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="text-indigo-600" />
                <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Security Pro-Tip</h4>
              </div>
              <p className="text-[11px] font-bold text-indigo-700/70 leading-relaxed uppercase italic">
                Never share your Manager password with staff. Create individual accounts for them using your Shop Code to maintain a clean Audit Trail in the 'Activity' tab.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
  <div className="space-y-2 group cursor-help">
    <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
      <div className="w-1 h-1 bg-indigo-500 rounded-full" /> {question}
    </p>
    <p className="text-[10px] text-slate-400 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {answer}
    </p>
  </div>
);

export default ManualView;
