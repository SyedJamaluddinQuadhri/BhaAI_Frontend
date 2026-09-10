import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { IconButton } from "../../../components/ui/IconButton";
import { BhaAIChat } from "./BhaAIChat";

export function FloatingBhaAI({ open, onOpenChange }: { open:boolean; onOpenChange:(open:boolean)=>void }) {
  return <><AnimatePresence>{open&&<div className="fixed bottom-5 right-5 z-50"><BhaAIChat onClose={()=>onOpenChange(false)}/></div>}</AnimatePresence>{!open&&<motion.div initial={{scale:0}} animate={{scale:1}} className="fixed bottom-5 right-5 z-40"><IconButton aria-label="Open BhaAI assistant" onClick={()=>onOpenChange(true)} className="breathe h-14 w-14 bg-[var(--text)] text-[var(--bg)] shadow-[var(--shadow-soft)] hover:scale-105"><Sparkles size={21}/></IconButton></motion.div>}</>;
}
