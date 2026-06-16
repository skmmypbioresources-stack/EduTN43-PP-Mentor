import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Lightbulb } from 'lucide-react';

interface MindMapProps {
  centerNode: string;
  nodes: string[];
  className?: string;
}

export default function MindMap({ centerNode, nodes, className }: MindMapProps) {
  // Pre-calculate positions for nodes in a circle around the center
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 220; // Significantly increased radius for clarity
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center overflow-visible", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* SVG for lines connecting nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {nodes.map((_, i) => {
          const pos = getPosition(i, nodes.length);
          return (
            <motion.line
              key={`line-${i}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${pos.x}px)`}
              y2={`calc(50% + ${pos.y}px)`}
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          );
        })}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 w-36 h-36 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center text-center p-6 border-4 border-white/20 shadow-[0_0_50px_rgba(79,70,229,0.5)]"
      >
        <span className="text-white text-[10px] font-black uppercase tracking-tight leading-tight">
          {centerNode || "Current Goal"}
        </span>
      </motion.div>

      {/* Satellite Nodes */}
      {nodes.map((node, i) => {
        const pos = getPosition(i, nodes.length);
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: pos.x, 
              y: pos.y 
            }}
            whileHover={{ scale: 1.1, zIndex: 30 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 12, 
              delay: 0.2 + i * 0.1 
            }}
            className="absolute z-10 px-5 py-3 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex items-center gap-3 group hover:border-indigo-400 hover:bg-gray-800 transition-all max-w-[180px]"
          >
            <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <Lightbulb className="w-3 h-3 text-indigo-400" />
            </div>
            <span className="text-white text-[11px] font-bold leading-tight">
              {node}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
