import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Project, SectionType, FirestoreErrorInfo } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Target, 
  Package, 
  ListChecks, 
  Calendar, 
  Zap, 
  BarChart3, 
  ChevronRight,
  ShieldCheck,
  Plus,
  CheckCircle2,
  BookOpen,
  FolderClosed,
  MessageSquareQuote,
  Lock,
  Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import ApiKeyModal from './ApiKeyModal';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const SECTIONS: { id: SectionType; title: string; icon: any; color: string }[] = [
  { id: 'goal', title: 'Learning Goal', icon: Target, color: 'text-rose-600 bg-rose-50' },
  { id: 'product', title: 'The Product', icon: Package, color: 'text-blue-600 bg-blue-50' },
  { id: 'criteria', title: 'Success Criteria', icon: ListChecks, color: 'text-amber-600 bg-amber-50' },
  { id: 'planning', title: 'Action Plan', icon: Calendar, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'skills', title: 'Applying Skills', icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'reflection', title: 'Reflection', icon: BarChart3, color: 'text-purple-600 bg-purple-50' }
];

export default function Dashboard() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(!!localStorage.getItem('user_gemini_api_key'));

  useEffect(() => {
    const checkKey = () => setHasKey(!!localStorage.getItem('user_gemini_api_key'));
    window.addEventListener('storage', checkKey);
    return () => window.removeEventListener('storage', checkKey);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, 'projects'), 
        where('studentId', '==', auth.currentUser.uid)
      );
      
      try {
        const snap = await getDocs(q);
        if (snap.empty) {
          // Create a default project
          const projectId = 'default-' + auth.currentUser.uid.slice(0, 5);
          const newProjectData = {
            title: 'My Personal Project',
            studentId: auth.currentUser.uid,
            studentEmail: auth.currentUser.email || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            band7Mode: false
          };
          await setDoc(doc(db, 'projects', projectId), newProjectData);
          // @ts-ignore
          setProject({ id: projectId, ...newProjectData, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
        } else {
          const data = snap.docs[0].data();
          setProject({ id: snap.docs[0].id, ...data } as Project);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const toggleBand7 = async () => {
    if (!project) return;
    const newMode = !project.band7Mode;
    await updateDoc(doc(db, 'projects', project.id), {
      band7Mode: newMode,
      updatedAt: serverTimestamp()
    });
    setProject({ ...project, band7Mode: newMode });
  };

  if (loading) return null;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm shadow-indigo-50">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Project</h1>
          <p className="text-gray-500 font-medium italic">IB Personal Project Scaffolding Dashboard</p>
        </div>

        <button
          onClick={toggleBand7}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border-2",
            project?.band7Mode 
              ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-200" 
              : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
          )}
        >
          <ShieldCheck className={cn("w-5 h-5", project?.band7Mode ? "text-indigo-200" : "text-gray-300")} />
          <span>Band 7 Thinking Mode</span>
          <div className={cn(
            "w-10 h-5 rounded-full relative transition-colors duration-300 ml-2",
            project?.band7Mode ? "bg-indigo-400" : "bg-gray-200"
          )}>
            <div className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
              project?.band7Mode ? "left-6" : "left-1"
            )} />
          </div>
        </button>
      </header>

      {!hasKey && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-indigo-50/50"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
              <Key className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-gray-900 leading-tight">Activate Your Personal Mentor</h4>
              <p className="text-xs text-indigo-750 font-semibold leading-relaxed max-w-2xl">
                To start getting real-time mentoring, mind Maps, and structural advice, please configure your free Google Gemini API Key. Click the button to read our super simple 1-minute activation guide!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-150 transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            Activate Free Mentor
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/checklist')}
          className="lg:col-span-3 flex flex-col md:flex-row md:items-center p-8 bg-emerald-600 rounded-3xl border border-emerald-500 shadow-xl shadow-emerald-100 transition-all text-left text-white group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <ShieldCheck className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="p-3 bg-emerald-500 rounded-2xl w-fit mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Final Band 7 Checklist</h3>
            <p className="text-emerald-50/80 text-sm leading-relaxed max-w-xl">
              Cross-reference your entire report against the gold standard. 
              Tick off requirements as you verify them in your final draft to ensure you meet all IB descriptors.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 flex items-center bg-white/20 px-6 py-3 rounded-2xl font-black text-sm backdrop-blur-sm group-hover:bg-white/30 transition-all">
            Open Full Checklist <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/expectations')}
          className="lg:col-span-3 flex flex-col md:flex-row md:items-center p-8 bg-indigo-900 rounded-3xl border border-indigo-800 shadow-xl shadow-indigo-100 transition-all text-left text-white group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <BookOpen className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="p-3 bg-indigo-800 rounded-2xl w-fit mb-6">
              <BookOpen className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-serif italic mb-2 tracking-tight">Examiner's Expectations</h3>
            <p className="text-indigo-100/70 text-sm leading-relaxed max-w-xl font-medium">
              See through the eyes of the person marking your work. 
              Understand exactly what descriptors you need to hit for each band and Criterion.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 flex items-center bg-white/10 px-6 py-3 rounded-2xl font-black text-sm backdrop-blur-sm group-hover:bg-white/20 transition-all">
            Read Guidelines <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/resources')}
          className="lg:col-span-1 flex flex-col p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all text-left group overflow-hidden relative"
        >
          <div className="p-3 bg-rose-50 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
            <FolderClosed className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 tracking-tight">PP Resources</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Access restricted previous reports and exemplary projects for inspiration.
          </p>
          <div className="mt-auto flex items-center text-rose-600 font-bold text-sm">
            Request Access <Lock className="w-4 h-4 ml-2" />
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
            <FolderClosed className="w-24 h-24 text-rose-900" />
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/journal')}
          className="lg:col-span-2 flex flex-col md:flex-row md:items-center p-8 bg-indigo-600 rounded-3xl border border-indigo-500 shadow-xl shadow-indigo-100 transition-all text-left text-white group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <MessageSquareQuote className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="p-3 bg-indigo-500 rounded-2xl w-fit mb-6">
              <MessageSquareQuote className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Process Journal Mentor</h3>
            <p className="text-indigo-50/80 text-sm leading-relaxed max-w-lg font-medium">
              Stuck on what to write? Our adaptive mentor asks the right questions 
              to trigger high-level reflection across all 23 key entries.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 flex items-center bg-white/20 px-6 py-3 rounded-2xl font-black text-sm backdrop-blur-sm group-hover:bg-white/30 transition-all">
            Start Reflecting <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </motion.button>

        {SECTIONS.map((section, index) => (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/section/${section.id}`)}
            id={`section-card-${section.id}`}
            className="group flex flex-col items-start p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all text-left"
          >
            <div className={cn("p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110", section.color)}>
              <section.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Guided mentoring and structural questions for your {section.title.toLowerCase()}.
            </p>
            <div className="mt-auto flex items-center text-indigo-600 font-bold text-sm">
              Open Section <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSaved={() => setHasKey(!!localStorage.getItem('user_gemini_api_key'))} 
      />
    </div>
  );
}
