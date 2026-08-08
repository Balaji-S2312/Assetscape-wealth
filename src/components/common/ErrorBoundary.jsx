import { Component } from "react";
import { AlertOctagon } from "lucide-react";

/** Catches render errors so a single broken section never blanks the app. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Assetscape Wealth error boundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="glass flex flex-col items-center rounded-2xl p-8 text-center">
          <AlertOctagon className="h-8 w-8 text-negative" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">Something went wrong</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This section failed to render. You can retry without losing the rest of the page.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="press mt-5 h-10 rounded-xl brand-gradient px-5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
