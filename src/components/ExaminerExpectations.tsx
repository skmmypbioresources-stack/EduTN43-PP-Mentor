import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Info, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { EXAMINER_EXPECTATIONS, COMMAND_TERMS } from '../constants/expectations';

const COMMAND_TERM_COLORS: Record<string, string> = {
  state: 'text-rose-600 font-black underline decoration-rose-200 decoration-2 underline-offset-2',
  states: 'text-rose-600 font-black underline decoration-rose-200 decoration-2 underline-offset-2',
  statement: 'text-rose-600 font-black underline decoration-rose-200 decoration-2 underline-offset-2',
  outline: 'text-violet-600 font-black underline decoration-violet-200 decoration-2 underline-offset-2',
  outlines: 'text-violet-600 font-black underline decoration-violet-200 decoration-2 underline-offset-2',
  describe: 'text-blue-600 font-black underline decoration-blue-200 decoration-2 underline-offset-2',
  describes: 'text-blue-600 font-black underline decoration-blue-200 decoration-2 underline-offset-2',
  described: 'text-blue-600 font-black underline decoration-blue-200 decoration-2 underline-offset-2',
  description: 'text-blue-600 font-black underline decoration-blue-200 decoration-2 underline-offset-2',
  explain: 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  explains: 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  explained: 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  explanation: 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  evaluate: 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  evaluates: 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  evaluated: 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  evaluation: 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  present: 'text-amber-800 font-black underline decoration-amber-100 decoration-2 underline-offset-2',
  presents: 'text-amber-800 font-black underline decoration-amber-100 decoration-2 underline-offset-2',
  presented: 'text-amber-800 font-black underline decoration-amber-100 decoration-2 underline-offset-2',
  // Multi-word phrases requested by user
  'present basic': 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  'present multiple appropriate': 'text-indigo-600 font-black underline decoration-indigo-200 decoration-2 underline-offset-2',
  'multiple appropriate, detailed': 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  'superficial': 'text-rose-600 font-black underline decoration-rose-200 decoration-2 underline-offset-2',
  'some success': 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  'most success': 'text-indigo-600 font-black underline decoration-indigo-200 decoration-2 underline-offset-2',
  'all success': 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
  'partially supported': 'text-amber-600 font-black underline decoration-amber-200 decoration-2 underline-offset-2',
  'fully supported with': 'text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2',
};

function HighlightedText({ text }: { text: string }) {
  const terms = Object.keys(COMMAND_TERM_COLORS);
  // Sort by length descending to match longest possible variations first
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  // Escaping the terms for regex and handling multi-word/comma boundaries
  const regex = new RegExp(`\\b(${sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (COMMAND_TERM_COLORS[lowerPart]) {
          return (
            <span key={i} className={COMMAND_TERM_COLORS[lowerPart]}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function ExaminerExpectations() {
  const navigate = useNavigate();
  const [activeCritId, setActiveCritId] = useState('A');

  const activeCrit = EXAMINER_EXPECTATIONS.find(c => c.id === activeCritId)!;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div>
            <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tighter italic">
              Examiner's Expectations
            </h1>
            <p className="text-gray-500 mt-2 font-medium max-w-xl leading-relaxed">
              What an IB examiner looks for at every band level. Use this as your guidebook while writing to ensure your report hits the top marks.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 px-2">
        {EXAMINER_EXPECTATIONS.map(crit => (
          <button
            key={crit.id}
            onClick={() => setActiveCritId(crit.id)}
            className={cn(
              "flex-1 min-w-[140px] text-left p-4 rounded-2xl border-2 transition-all group",
              activeCritId === crit.id 
                ? "bg-white border-indigo-600 shadow-xl shadow-indigo-50 ring-4 ring-indigo-50" 
                : "bg-white border-gray-100 hover:border-gray-200 text-gray-400"
            )}
          >
            <span className={cn(
              "font-serif text-3xl font-black block mb-1 opacity-20 group-hover:opacity-40 transition-opacity",
              activeCritId === crit.id && "opacity-100 text-indigo-600"
            )}>
              {crit.id}
            </span>
            <span className={cn(
              "text-xs font-black uppercase tracking-widest block",
              activeCritId === crit.id ? "text-gray-900" : "text-gray-400"
            )}>
              {crit.title}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCritId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8 px-2"
        >
          {/* Criterion Intro */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex gap-8 items-start">
              <div className="hidden sm:flex w-20 h-20 bg-indigo-600 items-center justify-center rounded-2xl shrink-0 shadow-lg shadow-indigo-100">
                <span className="text-4xl font-serif font-black text-white">{activeCrit.id}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeCrit.fullName}</h2>
                <p className="text-gray-600 leading-relaxed font-medium">{activeCrit.description}</p>
              </div>
            </div>
          </div>

          {/* Strands */}
          {activeCrit.strands.map((strand) => (
            <div key={strand.id} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0">
                  {strand.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{strand.title}</h3>
                  <p className="text-gray-400 text-xs font-medium italic">{strand.prompt}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {strand.bands.map((band) => (
                  <div 
                    key={band.score} 
                    className="grid grid-cols-1 md:grid-cols-[100px_1fr] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                  >
                    <div className={cn(
                      "p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-50",
                      band.score === '7–8' ? 'bg-emerald-50/50' : 
                      band.score === '5–6' || band.score === '3–4' ? 'bg-indigo-50/50' :
                      'bg-rose-50/50'
                    )}>
                      <span className={cn(
                        "text-lg font-black text-center leading-none tracking-tighter mb-1",
                        band.score === '7–8' ? 'text-emerald-700' : 
                        band.score === '5–6' || band.score === '3–4' ? 'text-indigo-700' :
                        'text-rose-700'
                      )}>
                        {band.score === '7–8' ? 'Advanced Level' :
                         band.score === '5–6' || band.score === '3–4' ? 'Proficient Level' :
                         'Foundational Level'}
                      </span>
                    </div>
                    <div className="p-6 space-y-3">
                      <p className="text-gray-900 font-bold leading-snug">
                        <HighlightedText text={band.what} />
                      </p>
                      <div className="pl-4 border-l-2 border-gray-100 group-hover:border-indigo-100 transition-colors">
                        <div className="text-gray-500 text-xs leading-relaxed italic">
                          <span className="font-bold text-gray-700 not-italic mr-1">Examiner Note:</span> 
                          <HighlightedText text={band.note} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Command Terms Glossary */}
      <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden mx-2">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="text-white font-serif italic text-2xl mb-2">Command Term Glossary</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-md">Understand these verbs to unlock different point bands. "Explain" is often the threshold for 7+ marks.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMAND_TERMS.map((term) => (
              <div key={term.term} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group">
                <span className={cn(
                  "text-sm font-black uppercase tracking-widest block mb-2",
                  term.term === 'Explain' || term.term === 'Evaluate' ? "text-emerald-400" : "text-indigo-400"
                )}>
                  {term.term}
                </span>
                <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
