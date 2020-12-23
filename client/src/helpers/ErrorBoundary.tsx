import React from "react";

interface ErrorBoundaryProps {
  hasError: boolean;
  error: Error|string;

}

export default class ErrorBoundary extends React.Component<
  {},
  ErrorBoundaryProps
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: "" }
  }
  static getDerivedStateFromError(error: Error) {
    console.trace(error)
    return { hasError: true, error: error };
  }
  componentDidCatch(error:Error) {
    // You can also log the error to an error reporting service
    console.trace(error);
  }
  render() {
    const {hasError,error} = this.state
    
    if (hasError && error instanceof Error) {
      const stack = error.stack?.split('\n')
      // You can render any custom fallback UI

      return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close">&times;</span>
            <h2>Oppps! an Error has occurred</h2>
            <p>Please notify a friendly web developer</p>
            <details>

              <summary>detalis</summary>
            <h2>{error.message}</h2>
              <ul>
                <h5 style={{color:'red'}}>
                  {stack?stack[0]:''}
                </h5>
                {stack?.slice(1).map(line=><li>{line}</li>)}
              </ul>
              {/* <p style={{whiteSpace:'pre'}}> {error.stack}</p> */}
            </details>
          </div>
        </div>
      );
    }

    // If there is no error just render the children component.
    return this.props.children;
  }
}
