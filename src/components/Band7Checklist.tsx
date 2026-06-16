import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { BAND_7_CHECKLIST } from '../constants/checklist';

// Scoped styles to match the provided HTML exactly
const styles = `
  .checklist-container {
    --ink: #18160F;
    --paper: #F9F7F2;
    --warm: #EFEBE0;
    --border: #DDD8CA;
    --border2: #C4BFAE;
    --muted: #7A7567;
    --A: #7C3B00;   --A-bg: #FDF3E8; --A-mid: #C8640A;
    --B: #1A4D3E;   --B-bg: #E8F5F0; --B-mid: #2A7A62;
    --C: #2C2A7C;   --C-bg: #EDEDFC; --C-mid: #4A48C0;
    --green: #1A6B3E; --green-bg: #E8F5EE;
    --r: 10px; --shadow: 0 2px 20px rgba(0,0,0,0.07);
    font-family: 'Jost', sans-serif;
    color: var(--ink);
  }

  .header-title {
    font-family: 'Cormorant Garamond', serif;
  }

  .gp-track { height: 6px; background: var(--warm); border-radius: 99px; overflow: hidden; }
  .gp-fill { height: 100%; border-radius: 99px; background: var(--green); transition: width 0.4s ease; }
  
  .crit-tab {
    padding: 14px 10px; border-radius: var(--r);
    border: 1.5px solid var(--border); background: #fff;
    cursor: pointer; text-align: center; transition: all 0.2s;
  }
  .crit-tab .ct-letter {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 700; line-height: 1;
    display: block; margin-bottom: 3px; opacity: 0.3; transition: opacity 0.2s;
  }
  
  .active-A { background: var(--A-bg) !important; border-color: var(--A-mid) !important; }
  .active-A .ct-letter { color: var(--A); opacity: 0.9; }
  
  .active-B { background: var(--B-bg) !important; border-color: var(--B-mid) !important; }
  .active-B .ct-letter { color: var(--B); opacity: 0.9; }
  
  .active-C { background: var(--C-bg) !important; border-color: var(--C-mid) !important; }
  .active-C .ct-letter { color: var(--C); opacity: 0.9; }

  .pi-accent { font-family: 'Cormorant Garamond', serif; }
  .pi-body h2 { font-family: 'Cormorant Garamond', serif; }
  
  .sh-roman {
    font-family: 'Cormorant Garamond', serif;
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .checkbox {
    width: 20px; height: 20px; min-width: 20px;
    border-radius: 5px; border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px; transition: all 0.15s; background: #fff;
  }
  .checkbox.ticked { border-color: var(--green); background: var(--green); }
  .checkbox.ticked::after { content: '✓'; color: #fff; font-size: 11px; font-weight: 600; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Band7Checklist() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('band7_checked_items');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('band7_checked_items', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (confirm('Reset all checks?')) {
      setCheckedItems({});
    }
  };

  const totalItems = BAND_7_CHECKLIST.reduce((acc, crit) => 
    acc + crit.strands.reduce((sAcc, s) => sAcc + s.items.length, 0), 0);
  
  const doneItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const getCritStats = (critId: string) => {
    const crit = BAND_7_CHECKLIST.find(c => c.id === critId);
    if (!crit) return { done: 0, total: 0 };
    let done = 0;
    let total = 0;
    crit.strands.forEach(s => {
      total += s.items.length;
      s.items.forEach(it => { if (checkedItems[it.id]) done++; });
    });
    return { done, total };
  };

  const currentCrit = BAND_7_CHECKLIST[currentIdx];

  return (
    <div className="checklist-container min-h-screen pb-20">
      <style>{styles}</style>
      
      {/* HEADER */}
      <div className="max-w-[760px] mx-auto mb-10 pt-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#7A7567] hover:text-[#18160F] transition-colors mb-6 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#7A7567] mb-2.5">
          Good Shepherd International School · MYP Personal Project
        </p>
        <h1 className="header-title text-[clamp(28px,4vw,42px)] font-bold text-[#18160F] leading-[1.1] mb-2.5">
          Band 7 Checklist
        </h1>
        <p className="text-[13.5px] text-[#7A7567] leading-[1.6] max-w-[520px]">
          Read each statement while writing your report. Tick only when it is genuinely visible in what you have written. Covers all three MYP criteria and their exact strands.
        </p>
      </div>

      {/* CORRECTION NOTE */}
      <div className="max-w-[760px] mx-auto mb-6 bg-[#FFFBEB] border border-[#D4A017] rounded-[var(--r)] p-[10px_16px] text-[12px] text-[#7A5A00] leading-[1.5] flex gap-2.5 items-start shadow-sm">
        <span className="text-[16px] shrink-0">📌</span>
        <span>
          This checklist covers <strong>Criterion A: Planning · Criterion B: Applying Skills · Criterion C: Reflecting</strong> — the only three criteria in the MYP Personal Project, with their exact strands as defined in the MYP objectives.
        </span>
      </div>

      {/* GLOBAL PROGRESS */}
      <div className="max-w-[760px] mx-auto mb-8 bg-white border border-[#DDD8CA] rounded-[var(--r)] p-[1.25rem_1.5rem] flex items-center gap-6 flex-wrap shadow-sm">
        <div className="flex-1 min-w-[180px]">
          <div className="gp-track">
            <div className="gp-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <p className="text-[12px] text-[#7A7567] mt-[5px]">
            {doneItems} of {totalItems} checked — {progressPct}% complete
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['A', 'B', 'C'].map(id => {
            const stats = getCritStats(id);
            const critColors: Record<string, string> = {
              A: 'text-[#7C3B00] border-[#C8640A] bg-[#FDF3E8]',
              B: 'text-[#1A4D3E] border-[#2A7A62] bg-[#E8F5F0]',
              C: 'text-[#2C2A7C] border-[#4A48C0] bg-[#EDEDFC]'
            };
            return (
              <span key={id} className={cn("text-[11px] font-semibold px-3 py-1 rounded-full border", critColors[id])}>
                {id}: {stats.done}/{stats.total}
              </span>
            );
          })}
        </div>
      </div>

      {/* CRITERIA NAV */}
      <div className="max-w-[760px] mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
        {BAND_7_CHECKLIST.map((crit, idx) => {
          const stats = getCritStats(crit.id);
          const isActive = currentIdx === idx;
          return (
            <button 
              key={crit.id}
              onClick={() => setCurrentIdx(idx)}
              className={cn(
                "crit-tab shadow-sm",
                isActive && `active-${crit.id}`
              )}
            >
              <span className="ct-letter">{crit.id}</span>
              <span className="ct-name text-[12px] font-medium text-[#7A7567] block mb-1">
                {crit.id === 'A' ? 'Planning' : crit.id === 'B' ? 'Applying Skills' : 'Reflecting'}
              </span>
              <span className="ct-prog text-[10px] text-[#7A7567]">
                {stats.done} / {stats.total} checked
              </span>
            </button>
          );
        })}
      </div>

      {/* PANEL CONTENT */}
      {currentCrit && (
        <div className="max-w-[760px] mx-auto animate-[fadeUp_0.3s_ease]">
          <div className="bg-white rounded-[var(--r)] p-[1.25rem_1.5rem] mb-5 border border-[#DDD8CA] flex gap-4 items-start shadow-sm">
            <div className={cn(
              "pi-accent text-[56px] font-bold leading-none shrink-0 -mt-1 opacity-50",
              currentCrit.id === 'A' ? 'text-[#C8640A]' : currentCrit.id === 'B' ? 'text-[#2A7A62]' : 'text-[#4A48C0]'
            )}>
              {currentCrit.id}
            </div>
            <div className="pi-body">
              <h2 className={cn(
                "text-[20px] font-bold mb-1",
                currentCrit.id === 'A' ? 'text-[#7C3B00]' : currentCrit.id === 'B' ? 'text-[#1A4D3E]' : 'text-[#2C2A7C]'
              )}>
                {currentCrit.name}
              </h2>
              <p className="text-[13px] text-[#7A7567] leading-[1.6]">{currentCrit.intro}</p>
              <div className="flex gap-1.5 flex-wrap mt-2.5">
                {currentCrit.strands.map(s => (
                  <span key={s.roman} className="text-[11px] px-2.5 py-1 rounded-full border border-[#DDD8CA] bg-[#EFEBE0] text-[#7A7567]">
                    Strand {s.roman}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {currentCrit.strands.map((strand, si) => {
            const sDone = strand.items.filter(it => checkedItems[it.id]).length;
            return (
              <div key={si} className="bg-white border border-[#DDD8CA] rounded-[var(--r)] overflow-hidden mb-3 shadow-sm">
                <div className="flex items-center gap-3 p-[12px_16px] border-b border-[#DDD8CA] bg-[#fff]">
                  <div className={cn(
                    "sh-roman text-[20px] font-bold",
                    currentCrit.id === 'A' ? 'bg-[#FDF3E8] text-[#7C3B00]' : currentCrit.id === 'B' ? 'bg-[#E8F5F0] text-[#1A4D3E]' : 'bg-[#EDEDFC] text-[#2C2A7C]'
                  )}>
                    {strand.roman}
                  </div>
                  <div className="sh-text">
                    <h3 className="text-[13.5px] font-semibold text-[#18160F]">{strand.title}</h3>
                    <p className="text-[11.5px] text-[#7A7567] italic mt-0.5 whitespace-normal">"{strand.objective}"</p>
                  </div>
                  <span className="ml-auto text-[11px] text-[#7A7567] shrink-0">
                    {sDone} / {strand.items.length}
                  </span>
                </div>
                <div className="divide-y divide-[#DDD8CA]">
                  {strand.items.map((item, ii) => (
                    <div 
                      key={ii} 
                      className="flex items-start gap-3 p-[10px_16px] cursor-pointer hover:bg-[#F9F7F2] transition-colors group"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className={cn("checkbox shadow-inner shrink-0", checkedItems[item.id] && "ticked")}></div>
                      <span className={cn(
                        "text-[13.5px] leading-[1.6] transition-opacity",
                        checkedItems[item.id] ? "text-[#7A7567] line-through decoration-[#1A6B3E]" : "text-[#18160F]"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER NAV */}
      <div className="max-w-[760px] mx-auto mt-6 flex justify-between gap-2.5">
        <button 
          className="text-[13px] font-medium p-[10px_24px] rounded-[var(--r)] border border-[#C4BFAE] bg-white text-[#18160F] cursor-pointer hover:bg-[#EFEBE0] disabled:opacity-30 disabled:cursor-default transition-all shadow-sm"
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          ← Previous
        </button>
        <button 
          className="text-[13px] font-medium p-[10px_24px] rounded-[var(--r)] bg-[#18160F] text-white border border-[#18160F] cursor-pointer hover:opacity-85 transition-all shadow-lg"
          onClick={() => {
            if (currentIdx === BAND_7_CHECKLIST.length - 1) {
              if (progressPct === 100) alert("✓ Excellent! Your report meets all Band 7 criteria.");
              else alert("Keep going! You're building a strong Band 7 report.");
            } else {
              setCurrentIdx(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {currentIdx === BAND_7_CHECKLIST.length - 1 ? 'Finish ✓' : 'Next Objective →'}
        </button>
      </div>

      {progressPct === 100 && totalItems > 0 && (
        <div className="max-w-[760px] mx-auto mt-6 bg-[#E8F5EE] border border-green-600 rounded-[var(--r)] p-[1rem_1.5rem] text-[13.5px] text-green-700 font-semibold text-center shadow-md animate-bounce">
          ✓ All items checked — your report addresses every strand of Criteria A, B, and C at Band 7 level.
        </div>
      )}

      <div className="text-center mt-8">
        <button 
          className="text-[12px] text-[#7A7567] bg-none border-none cursor-pointer hover:text-[#18160F] underline underline-offset-2"
          onClick={resetAll}
        >
          Reset all checks
        </button>
      </div>
    </div>
  );
}
