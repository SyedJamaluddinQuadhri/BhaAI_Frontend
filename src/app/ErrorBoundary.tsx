import { Component, type ErrorInfo, type ReactNode } from "react";
export class ErrorBoundary extends Component<{children:ReactNode},{hasError:boolean}> {
  state={hasError:false};
  static getDerivedStateFromError(){return {hasError:true};}
  componentDidCatch(_error:Error,_info:ErrorInfo){}
  render(){return this.state.hasError?<div className="min-h-screen flex items-center justify-center p-6 text-center"><div><div className="eyebrow">BhaAI</div><h1 className="mt-3 text-3xl font-semibold">Something went wrong.</h1><p className="mt-2 text-sm muted">Refresh the page to return to your life workspace.</p></div></div>:this.props.children;}
}
