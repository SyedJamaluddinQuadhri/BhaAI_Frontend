import { ArrowUpRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
export function FocalItem() { return <div className="mt-14 border-y border-[var(--line)] py-9 md:mt-20 md:py-12"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><Badge tone="danger">Needs attention</Badge><h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Internship application</h2><div className="mt-5 flex flex-wrap gap-5 text-sm muted"><span>Deadline <strong className="text-[var(--text)]">14 September</strong></span><span>2 of 3 documents ready</span></div></div><Button>Continue <ArrowUpRight size={16}/></Button></div></div>; }
