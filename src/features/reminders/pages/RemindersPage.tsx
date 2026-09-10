import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { ReminderList } from "../components/ReminderList";
export function RemindersPage(){return <PageContainer><Section eyebrow="Planned nudges" title="Reminders, not deadlines."><p className="max-w-2xl text-lg muted">A deadline is fixed. A reminder is how BhaAI helps you get there without having to remember.</p></Section><ReminderList/></PageContainer>;}
