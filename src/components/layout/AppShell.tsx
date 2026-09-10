import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Topbar } from "./Topbar";
import { FloatingBhaAI } from "../../features/assistant/components/FloatingBhaAI";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const location = useLocation();
  return <div className="min-h-screen"><div className="flex min-h-screen"><Navigation/><main className="min-w-0 flex-1"><Topbar onAssistant={() => setAssistantOpen(true)}/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.18}}>{children}</motion.div></AnimatePresence></main></div><FloatingBhaAI open={assistantOpen} onOpenChange={setAssistantOpen}/></div>;
}
