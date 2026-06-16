import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { Project, SectionType, Section, MentorPrompt, FirestoreErrorInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getMentorFeedback, MentorResponse } from '../services/geminiService';
import MindMap from './MindMap';
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

export default function SectionView() {
  const { sectionId } = useParams<{ sectionId: SectionType }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [mentoring, setMentoring] = useState(false);
  const [latestPrompt, setLatestPrompt] = useState<MentorPrompt | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [mentoringError, setMentoringError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser || !sectionId) return;

      try {
        // Get project
        const q = query(
          collection(db, 'projects'), 
          where('studentId', '==', auth.currentUser.uid)
        );
        const pSnap = await getDocs(q);
        if (pSnap.empty) {
          navigate('/');
          return;
        }
        const pData = { id: pSnap.docs[0].id, ...pSnap.docs[0].data() } as Project;
        setProject(pData);

        // Get section
        const sectionRef = doc(db, 'projects', pData.id, 'sections', sectionId);
        const sSnap = await getDoc(sectionRef);
        
        if (sSnap.exists()) {
          const sData = sSnap.data() as Section;
          setSection(sData);
          setContent(sData.content);
        } else {
          const newSection = {
            projectId: pData.id,
            sectionId: sectionId,
            id: sectionId,
            content: '',
            checklist: {},
            status: 'missing',
            lastUpdated: serverTimestamp() as any
          };
          await setDoc(sectionRef, newSection);
          setSection(newSection as any);
        }

        // Get latest prompt
        const promptsQ = query(
          collection(db, 'projects', pData.id, 'prompts'),
          where('sectionId', '==', sectionId),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const promptSnap = await getDocs(promptsQ);
        if (!promptSnap.empty) {
          setLatestPrompt({ id: promptSnap.docs[0].id, ...promptSnap.docs[0].data() } as MentorPrompt);
        }

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `projects/.../sections/${sectionId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionId, navigate]);

  const handleSave = async () => {
    if (!project || !sectionId) return;
    setLoading(true);
    try {
      const sectionRef = doc(db, 'projects', project.id, 'sections', sectionId);
      await updateDoc(sectionRef, {
        content: content,
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${project.id}/sections/${sectionId}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerMentoring = async () => {
    if (!project || !sectionId || !content.trim()) return;
    setMentoring(true);
    setMentoringError(null);
    try {
      const feedback: MentorResponse = await getMentorFeedback(project, sectionId, content);
      
      const promptDoc = {
        projectId: project.id,
        sectionId: sectionId,
        questions: feedback.questions,
        mindMapNodes: feedback.mindMapNodes,
        gapDetection: feedback.gapDetection,
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'projects', project.id, 'prompts'), promptDoc);
      setLatestPrompt(prev => ({ id: docRef.id, ...promptDoc, timestamp: Timestamp.now() } as MentorPrompt));

      // Update section status and checklist
      const sectionRef = doc(db, 'projects', project.id, 'sections', sectionId);
      const updates = {
        checklist: feedback.checklistUpdates,
        status: feedback.questions.length > 3 ? 'needs_improvement' : 'strong',
        lastUpdated: serverTimestamp()
      };
      await updateDoc(sectionRef, updates);
      
      setSection(prev => {
        if (!prev) return null;
        return {
          ...prev,
          checklist: feedback.checklistUpdates,
          status: feedback.questions.length > 3 ? 'needs_improvement' : 'strong'
        };
      });

    } catch (err: any) {
      console.error("Mentoring error:", err);
      if (err instanceof Error && err.message === "apikey_missing") {
        setMentoringError("Your Google Gemini API Key is missing. Click here to configure your API key.");
        setIsApiKeyModalOpen(true);
      } else {
        setMentoringError(err?.message || "An unexpected error occurred while communicating with Gemini. Please verify your credentials and try again.");
      }
    } finally {
      setMentoring(false);
    }
  };

  if (loading && !section) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize leading-tight">
              {sectionId?.replace('_', ' ')} <span className="text-indigo-600">Mentor</span>
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Interactive Discovery Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {project?.band7Mode && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-4 h-4" />
              Advanced Support Enabled
            </div>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-gray-500 font-bold hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all text-xs uppercase"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[85vh]">
        {/* SIDEBAR: Controls & Guidance */}
        <div className="w-full lg:w-[400px] space-y-6 flex-shrink-0">
          {/* Work Area */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Input Draft</h3>
              <div className="px-2 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase">Markdown Supported</div>
            </div>
            
            <textarea
              id="student-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your thinking here. Your mentor will analyze this to generate a mind map of ideas..."
              className="w-full h-64 p-4 text-base font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all leading-relaxed"
            />

            <button
              id="get-mentoring-btn"
              onClick={triggerMentoring}
              disabled={mentoring || !content.trim()}
              className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {mentoring ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Sync with Mentor
            </button>

            {mentoringError && (
              <div 
                onClick={() => {
                  if (mentoringError.includes("API Key") || mentoringError.includes("API key")) {
                    setIsApiKeyModalOpen(true);
                  }
                }}
                className={cn(
                  "p-4 text-xs font-semibold rounded-2xl border flex items-start gap-2.5 transition-all text-left",
                  (mentoringError.includes("API Key") || mentoringError.includes("API key"))
                    ? "bg-amber-50 text-amber-900 border-amber-200 cursor-pointer hover:bg-amber-100" 
                    : "bg-red-50 text-red-700 border-red-200"
                )}
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{mentoringError}</span>
              </div>
            )}
          </div>

          {/* Guidelines Sidebar */}
          <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl text-white">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Discovery Checklist</h4>
            <div className="space-y-4">
              {Object.entries(section?.checklist || {
                personalConnection: false,
                justification: false,
                measurability: false,
                evaluationDepth: false
              }).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between group">
                  <span className="text-[11px] font-bold text-gray-400 capitalize group-hover:text-gray-200 transition-colors">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500",
                    value ? "bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "border-2 border-gray-700"
                  )}>
                    {value && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-800">
               <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap className="w-3 h-3" /> Growth Tip
               </h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                 Use academic **Command Terms** to refine your thinking. The mind map on the right shows paths you haven't explored yet.
               </p>
            </div>
          </div>
        </div>

        {/* MAIN AREA: Exploration Mind Map & Interaction */}
        <div className="flex-1 w-full h-full min-h-[700px] flex flex-col gap-6">
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8">
            {/* Mind Map Header Decoration */}
            <div className="absolute top-0 left-0 w-full p-8 z-10 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Inquiry Mind Map</h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest opacity-80 mt-0.5">Concept Expansion Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Real-time Visualization</span>
              </div>
            </div>

            {/* Mind Map Canvas Area */}
            <div className="w-full h-full min-h-[500px] flex items-center justify-center">
              {!latestPrompt ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="relative w-24 h-24 bg-gray-800 border border-gray-700 rounded-3xl flex items-center justify-center shadow-2xl">
                      <HelpCircle className="w-10 h-10 text-indigo-400 opacity-50" />
                    </div>
                  </div>
                  <div className="max-w-xs space-y-2">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm">Awaiting Discovery</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      Draft your goal in the sidebar and click "Sync with Mentor" to populate this exploration space.
                    </p>
                  </div>
                </div>
              ) : (
                <MindMap 
                  centerNode={content ? (content.length > 60 ? content.substring(0, 60) + '...' : content) : (sectionId?.replace('_', ' ') || 'Goal')} 
                  nodes={latestPrompt.mindMapNodes || []} 
                />
              )}
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
          </div>

          {/* Gap Analysis Block */}
          {latestPrompt?.gapDetection && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-indigo-600 text-white rounded-[2rem] p-6 shadow-2xl shadow-indigo-900/10 flex gap-4 items-center border border-indigo-500/30 z-20"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1 text-left">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Critical Thinking Reflection</h5>
                <p className="text-sm font-bold leading-relaxed">{latestPrompt.gapDetection}</p>
              </div>
            </motion.div>
          )}

          {/* Questions/Guidance Horizontal Strip */}
          {latestPrompt && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestPrompt.questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all group flex gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-xs font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <p className="text-gray-800 text-xs font-bold leading-relaxed">{q}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSaved={() => setMentoringError(null)} 
      />
    </div>
  );
}

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
