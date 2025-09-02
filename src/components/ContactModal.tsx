import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const contacts = [
  { name: 'Vinayak Dadhwal', number: '8259' },
  { name: 'Nitesh', number: '8242' },
  { name: 'Vivek Yadav', number: '8260' },
  { name: 'Yajas Johri', number: '8261' },
  { name: 'Sahil Kumar Singh', number: '8262' },
];

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-green-100 via-white to-cyan-100 rounded-3xl shadow-2xl p-0 max-w-3xl w-full relative overflow-hidden border border-green-300"
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl z-10"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="px-8 pt-8 pb-4 border-b border-green-200 bg-gradient-to-r from-green-200/40 to-cyan-100/40">
              <h3 className="text-3xl font-extrabold text-green-700 mb-2 tracking-tight drop-shadow">Contact Team</h3>
              <p className="text-green-700/80 text-sm mb-2">Reach out to our core members for support or queries.</p>
            </div>
            <div className="px-8 py-6">
              <div className="flex flex-row gap-6 justify-center overflow-x-auto pb-2">
                {contacts.map((c, idx) => (
                  <motion.div
                    key={c.number}
                    className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center w-40 h-56 group border border-green-100 hover:shadow-2xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.07 }}
                  >
                    <div className="w-20 h-20 mb-4 rounded-lg bg-gradient-to-tr from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {/* Placeholder for image, initials shown */}
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors text-center">{c.name}</div>
                      <div className="text-green-600 font-mono text-base mt-2">{c.number}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="px-8 pb-6 pt-2 bg-gradient-to-r from-green-100/40 to-cyan-100/40 border-t border-green-100 flex justify-end">
              <button
                className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-all"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
