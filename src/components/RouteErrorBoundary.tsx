import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type BoundaryProps = {
  children: ReactNode;
  resetKey: string;
};

type BoundaryState = {
  hasError: boolean;
  errorMessage: string | null;
};

class BoundaryImpl extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route crashed:", error, info);
  }

  componentDidUpdate(prevProps: BoundaryProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: null });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-danger/40 bg-danger/10 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-danger" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Halaman mengalami error
          </h1>
          <p className="text-sm text-muted-foreground mb-1">
            Tenang, aplikasinya tidak mati. Coba muat ulang atau kembali ke halaman utama.
          </p>
          {this.state.errorMessage && (
            <p className="text-xs font-mono text-muted-foreground mb-6">
              Detail: {this.state.errorMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="hero" onClick={() => window.location.reload()}>
              <RefreshCcw className="h-4 w-4" />
              Reload halaman
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="h-4 w-4" />
              Kembali ke beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return <BoundaryImpl resetKey={location.pathname}>{children}</BoundaryImpl>;
};

