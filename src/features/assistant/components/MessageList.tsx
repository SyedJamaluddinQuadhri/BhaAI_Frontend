import type { AIMessage } from "../../../services/ai/ai.service";
import { Message } from "./Message";
export function MessageList({ messages }: { messages: AIMessage[] }) { return <div className="space-y-4">{messages.map(m => <Message key={m.id} message={m}/>)}</div>; }
