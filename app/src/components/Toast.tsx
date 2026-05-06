import { motion } from "framer-motion";

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      onAnimationComplete={() => setTimeout(onDone, 2500)}
      className="fixed bottom-6 right-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 border text-xs font-bold tracking-wider"
      style={{
        background: "#1C1917",
        borderColor: "rgba(74,222,128,0.4)",
        color: "#4ade80",
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "0.05em",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#4ade80" }}
      />
      {message}
    </motion.div>
  );
}
export default Toast;
