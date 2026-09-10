import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../../../services/tasks/tasks.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { StatusBadge } from "../../../components/shared/StatusBadge";
export function TasksPage(){const {data=[]}=useQuery({queryKey:["tasks"],queryFn:tasksService.list});return <PageContainer><Section eyebrow="Action space" title="Things I need to do."><p className="max-w-2xl text-lg muted">A calm place for actions created from your life context.</p></Section><div>{data.map(t=><div key={t.id} className="grid gap-3 border-b border-[var(--line)] py-6 md:grid-cols-[1fr_150px_110px_auto] md:items-center"><div><h3 className="font-semibold">{t.title}</h3><p className="mt-1 text-xs muted">{t.related ?? "Personal"} · {t.effort} effort</p></div><div className="text-sm muted">{t.deadline ?? "No deadline"}</div><div className="text-sm capitalize muted">{t.priority}</div><StatusBadge status={t.status}/></div>)}</div></PageContainer>;}
