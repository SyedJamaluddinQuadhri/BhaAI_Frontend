import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { GreetingSection } from "../components/GreetingSection";
import { GmailConnectSection } from "../components/GmailConnectSection";
import { FocalItem } from "../components/FocalItem";
import { TodaySection } from "../components/TodaySection";
import { UpcomingTimeline } from "../components/UpcomingTimeline";
import { LifePulse } from "../components/LifePulse";
import { GlanceSection } from "../components/GlanceSection";
import { BhaAIRecommendation } from "../components/BhaAIRecommendation";

export function HomePage() {
  return (
    <PageContainer>
      <GreetingSection />
      {/* Step 2: Gmail Authorization & Connection */}
      <GmailConnectSection />
      <FocalItem />
      <Section eyebrow="Today" title="Things that matter now">
        <TodaySection />
      </Section>
      <Section eyebrow="Upcoming" title="What’s coming">
        <UpcomingTimeline />
      </Section>
      <Section eyebrow="Life pulse" title="A quiet read on your week">
        <LifePulse />
      </Section>
      <Section eyebrow="At a glance" title="Your life, in context">
        <GlanceSection />
      </Section>
      <Section>
        <BhaAIRecommendation />
      </Section>
    </PageContainer>
  );
}
