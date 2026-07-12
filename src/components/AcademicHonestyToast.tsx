import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface AcademicHonestyToastProps {
  show: boolean;
}

export default function AcademicHonestyToast({
  show,
}: AcademicHonestyToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm"
        >
          <div className="bg-white border border-indigo-200 shadow-2xl rounded-2xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0">
              <ShieldAlert className="w-8 h-8 text-indigo-600" />
            </div>

            <div>
              <h3 className="font-bold text-indigo-700 text-base">
                Academic Honesty
              </h3>

              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                PP Mentor encourages original thinking.
                <br />
                Copying and pasting are disabled to support authentic learning
                and independent reflection.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}