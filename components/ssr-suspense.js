const isServer = typeof window === "undefined";

export class SSRSuspense extends React.Component {
  static defaultProps = {
    fallback: null,
  };

  render() {
    const { fallback } = this.props;

    if (isServer) return fallback;
    return <React.Suspense fallback={fallback} {...this.props} />;
  }
}
