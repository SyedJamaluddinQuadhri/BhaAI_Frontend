import { Button } from "../ui/Button";
export function ErrorState({ onRetry }: { onRetry?: () => void }) { return <div className="py-16 text-center"><h3 className="text-2xl font-semibold">Something went wrong.</h3><p className="mt-2 text-sm muted">We couldn't safely load this information.</p>{onRetry && <Button className="mt-5" onClick={onRetry}>Try again</Button>}</div>; }
