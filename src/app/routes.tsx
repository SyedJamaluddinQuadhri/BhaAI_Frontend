import { Routes, Route } from "react-router-dom";
import { HomePage } from "../features/home/pages/HomePage";
import { AssistantPage } from "../features/assistant/pages/AssistantPage";
import { InboxPage } from "../features/inbox/pages/InboxPage";
import { DeadlinesPage } from "../features/deadlines/pages/DeadlinesPage";
import { TasksPage } from "../features/tasks/pages/TasksPage";
import { CalendarPage } from "../features/calendar/pages/CalendarPage";
import { DocumentsPage } from "../features/documents/pages/DocumentsPage";
import { DocumentDetailPage } from "../features/documents/pages/DocumentDetailPage";
import { RemindersPage } from "../features/reminders/pages/RemindersPage";
import { NotificationsPage } from "../features/notifications/pages/NotificationsPage";
import { IntegrationsPage } from "../features/integrations/pages/IntegrationsPage";
import { PrivacyPage } from "../features/privacy/pages/PrivacyPage";
import { KnowledgePage } from "../features/knowledge/pages/KnowledgePage";
import { InsightsPage } from "../features/insights/pages/InsightsPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";

export function AppRoutes(){return <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/assistant" element={<AssistantPage/>}/>
  <Route path="/inbox" element={<InboxPage/>}/>
  <Route path="/deadlines" element={<DeadlinesPage/>}/>
  <Route path="/tasks" element={<TasksPage/>}/>
  <Route path="/calendar" element={<CalendarPage/>}/>
  <Route path="/documents" element={<DocumentsPage/>}/>
  <Route path="/documents/:id" element={<DocumentDetailPage/>}/>
  <Route path="/reminders" element={<RemindersPage/>}/>
  <Route path="/notifications" element={<NotificationsPage/>}/>
  <Route path="/integrations" element={<IntegrationsPage/>}/>
  <Route path="/privacy" element={<PrivacyPage/>}/>
  <Route path="/knowledge" element={<KnowledgePage/>}/>
  <Route path="/insights" element={<InsightsPage/>}/>
  <Route path="/settings" element={<SettingsPage/>}/>
  <Route path="/onboarding" element={<OnboardingPage/>}/>
  <Route path="*" element={<HomePage/>}/>
</Routes>}
