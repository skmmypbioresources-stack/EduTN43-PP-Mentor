import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronRight, 
  Target, 
  Zap, 
  BarChart3,
  MessageCircle,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PROCESS_JOURNAL_ENTRIES, JournalEntry } from '../constants/processJournal';

const PHASES = [
  { id: 1, title: 'Inquiry', icon: Target, color: 'bg-indigo-600', textColor: 'text-indigo-600', ringColor: 'ring-indigo-100' },
  { id: 2, title: 'Action', icon: Zap, color: 'bg-amber-600', textColor: 'text-amber-600', ringColor: 'ring-amber-100' },
  { id: 3, title: 'Reflection', icon: BarChart3, color: 'bg-emerald-600', textColor: 'text-emerald-600', ringColor: 'ring-emerald-100' }
];

export default function ProcessJournal() {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);

  const phaseEntries = useMemo(() => 
    PROCESS_JOURNAL_ENTRIES.filter(e => e.phase === selectedPhase),
    [selectedPhase]
  );

  const currentEntry = useMemo(() => 
    PROCESS_JOURNAL_ENTRIES.find(e => e.id === selectedEntry),
    [selectedEntry]
  );

  // Position nodes in a circle
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[40px] border-indigo-900 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[20px] border-indigo-900 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[10px] border-indigo-900 rounded-full" />
      </div>

      {/* Header and Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-white px-5 py-3 rounded-2xl shadow-sm hover:translate-x-1 transition-transform border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="absolute top-8 right-8 z-20 text-right">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Process Journal</h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Reflective Mentor System</p>
      </div>

      {/* Main Interface */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center z-10">
        
        {/* The Central Node */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => {
            setSelectedPhase(null);
            setSelectedEntry(null);
          }}
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 z-50",
            selectedPhase ? "bg-gray-100 ring-8 ring-gray-50 scale-75" : "bg-indigo-600 ring-8 ring-indigo-50"
          )}
        >
          <div className="text-center text-white px-2">
            {!selectedPhase ? (
              <>
                <Lightbulb className="w-8 h-8 mx-auto mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Start Project</span>
              </>
            ) : (
              <div className="text-gray-400">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back to Core</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Phase Branches (Level 1) */}
        {!selectedPhase && PHASES.map((phase, idx) => {
          const pos = getCirclePosition(idx, PHASES.length, 180);
          return (
            <motion.button
              key={phase.id}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ scale: 1, x: pos.x, y: pos.y }}
              whileHover={{ scale: 1.1, backgroundColor: '#4f46e5', color: '#fff' }}
              onClick={() => setSelectedPhase(phase.id)}
              className="absolute w-28 h-28 bg-white border-2 border-gray-100 rounded-full shadow-lg flex flex-col items-center justify-center gap-1 group transition-colors"
            >
              <phase.icon className={cn("w-6 h-6", phase.textColor, "group-hover:text-white transition-colors")} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">Phase {phase.id}</span>
              <span className="text-xs font-black text-gray-900 group-hover:text-white transition-colors">{phase.title}</span>
            </motion.button>
          );
        })}

        {/* Entry Branches (Level 2) */}
        <AnimatePresence>
          {selectedPhase && !selectedEntry && (
            <>
              {phaseEntries.map((entry, idx) => {
                const pos = getCirclePosition(idx, phaseEntries.length, 240);
                const phaseConfig = PHASES.find(p => p.id === selectedPhase)!;
                return (
                  <motion.button
                    key={entry.id}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, x: pos.x, y: pos.y }}
                    exit={{ scale: 0, x: 0, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedEntry(entry.id)}
                    className={cn(
                      "absolute w-40 p-4 bg-white rounded-3xl border border-gray-100 shadow-xl text-left transition-all",
                      "group"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3", phaseConfig.color)}>
                      <span className="text-white text-xs font-black">#{entry.id}</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Entry</span>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase italic">{entry.title}</h4>
                  </motion.button>
                );
              })}
              {/* Back Button for Phase */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedPhase(null)}
                className="absolute bottom-[-150px] px-8 py-3 bg-white rounded-full border border-gray-100 shadow-sm font-black text-xs uppercase tracking-widest text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                Back to Phases
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Questions (Level 3 - Detailed View) */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center z-[60]"
            >
              <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border border-gray-100 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-black text-[10px] uppercase tracking-widest">
                        Phase {selectedPhase} • Entry {selectedEntry}
                      </span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 tracking-tighter leading-none italic">{currentEntry?.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedEntry(null)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                    <p className="text-gray-500 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border-l-4 border-indigo-600 italic">
                      "I am your supervisor. Here are the questions you must reflect on for this entry. 
                      Answer them in your journal with honesty and evidence."
                    </p>

                    <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6">
                      <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                        <div>
                          <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest mb-1">Academic Integrity Warning</h4>
                          <p className="text-rose-700 text-xs leading-relaxed font-medium">
                            Turnitin detection is triggered by predictable patterns. When answering these questions, **Type directly in your own words.** Use "I felt", "My mistake was", or "I realized". Personal narrative is your unique fingerprint that no AI can duplicate.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {currentEntry?.questions.map((q, qidx) => (
                      <motion.div 
                        key={q.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qidx * 0.1 }}
                        className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-md hover:border-indigo-100 transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <HelpCircle className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{q.question}</h3>
                            {q.description && (
                              <p className="text-sm text-gray-400 font-medium leading-relaxed leading-relaxed">
                                {q.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic outline-none">Recording Reflection State</span>
                    </div>
                    <button 
                      onClick={() => setSelectedEntry(null)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
                    >
                      I understood <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ATL Progress Visualization (Subtle footer) */}
      <div className="max-w-4xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 px-4">
        {[
          { label: 'Criterion A', progress: selectedPhase === 1 ? 'Current' : selectedPhase && selectedPhase > 1 ? 'Complete' : 'Pending' },
          { label: 'Criterion B', progress: selectedPhase === 2 ? 'Current' : selectedPhase && selectedPhase > 2 ? 'Complete' : 'Pending' },
          { label: 'Criterion C', progress: selectedPhase === 3 ? 'Current' : 'Pending' }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md",
              item.progress === 'Complete' ? "bg-emerald-100 text-emerald-700" : 
              item.progress === 'Current' ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
            )}>
              {item.progress}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
