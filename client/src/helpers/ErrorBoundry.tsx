import React from "react";

interface ErrorBoundaryProps {
  hasError: boolean;
  error: string;
}

export default class ErrorBoundry extends React.Component<
  {},
  ErrorBoundaryProps
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.toString() };
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id='myModal' className='modal'>
          <div className='modal-content'>
            <span className='close'>&times;</span>
            <h2>Opps Error occurred</h2>
          </div>
        </div>
      );
    }

    // If there is no error just render the children component.
    return this.props.children;
  }
}
