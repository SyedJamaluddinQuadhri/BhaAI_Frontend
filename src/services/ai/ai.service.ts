export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: "gmail" | "doc" | "deadline" | "calendar"; title: string; detail?: string }[];
  timestamp?: string;
}

export const aiService = {
  async chat(message: string): Promise<{ text: string; sources?: AIMessage["sources"] }> {
    const lower = message.toLowerCase();

    if (lower.includes("gmail") || lower.includes("email") || lower.includes("mail") || lower.includes("inbox")) {
      return {
        text: "I scanned your connected **Gmail** inbox (`jamal.ahmed@gmail.com`). Here are the key items that need your attention:\n\n• **Campus Placement Office**: Urgent notice for your *Internship Application* — final certificate must be uploaded by 14 September.\n• **SBI Alerts**: Electricity bill generated for ₹1,842, due on 16 September.\n• **LIC India**: Annual policy renewal reminder due on 3 October 2026.\n• **Amazon India**: Receipt for delivery stored in your records.",
        sources: [
          { type: "gmail", title: "Campus Placement Office", detail: "Internship — final documents" },
          { type: "gmail", title: "SBI Alerts", detail: "Electricity bill ₹1,842" },
          { type: "gmail", title: "LIC", detail: "Policy renewal notice" },
        ],
      };
    }

    if (lower.includes("bill") || lower.includes("pay") || lower.includes("electricity")) {
      return {
        text: "You have an **Electricity bill of ₹1,842** detected from your connected Gmail via SBI Alerts. The payment deadline is **16 September 2026**.\n\nWould you like me to prepare a payment reminder for tomorrow morning?",
        sources: [
          { type: "gmail", title: "SBI Alerts", detail: "Electricity bill ₹1,842 · Due 16 Sep" },
          { type: "deadline", title: "16 Sep 2026", detail: "Fixed payment due" },
        ],
      };
    }

    if (lower.includes("insurance") || lower.includes("lic") || lower.includes("policy")) {
      return {
        text: "I found your **LIC Insurance Policy** (Policy #LIC-98214). It expires on **3 October 2026**.\n\nConnected context confirms:\n• Official policy document is in your BhaAI vault.\n• A renewal email was received in your Gmail on 5 Sep.\n• Recommended action: Renew before 28 Sep to avoid penalty.",
        sources: [
          { type: "doc", title: "LIC Policy Document", detail: "Vault ID #doc-03" },
          { type: "gmail", title: "LIC Official Email", detail: "Received 05 Sep" },
        ],
      };
    }

    if (lower.includes("internship") || lower.includes("deadline") || lower.includes("urgent")) {
      return {
        text: "Your most urgent priority is the **Internship application deadline on 14 September 2026** (4 days away).\n\n**Current Status**:\n• 2 of 3 required documents are verified in your vault.\n• Missing item: *Final semester marksheet / college certificate*.\n• An email from Campus Placement Office warns that incomplete applications will be rejected after 5:00 PM.",
        sources: [
          { type: "deadline", title: "14 Sep 2026", detail: "Internship application deadline" },
          { type: "gmail", title: "Campus Placement Office", detail: "Subject: Final documents required" },
        ],
      };
    }

    if (lower.includes("today") || lower.includes("schedule") || lower.includes("priority") || lower.includes("plan")) {
      return {
        text: "Here is your quiet read for **Thursday, 10 September 2026**:\n\n1. **High Priority**: Upload remaining certificate for Internship application (Deadline: 14 Sep).\n2. **Pending Bill**: Review and schedule payment for electricity bill (₹1,842, due 16 Sep).\n3. **Calendar**: You have a 90-minute free window tomorrow at 6:00 PM — ideal to finish your document upload.",
        sources: [
          { type: "deadline", title: "Internship Application", detail: "14 Sep" },
          { type: "calendar", title: "Free slot tomorrow 6 PM", detail: "90 min" },
        ],
      };
    }

    return {
      text: `Based on your connected Gmail, calendar, and documents: You currently have 3 urgent deadlines in the next 14 days and 4 tracked emails. The internship application is your earliest pending task. How can I help you handle this?`,
      sources: [
        { type: "gmail", title: "Gmail Gateway", detail: "4 emails indexed" },
        { type: "doc", title: "Documents Vault", detail: "12 records" },
      ],
    };
  },
};
