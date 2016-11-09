declare module jasmine {
  interface Matchers {
    // Note that the only reason for this definition is to keep the
    // build system from complaining that our custom Jasmine matchers
    // do not exist on the type Matchers.  The specific signatures don't
    // matter here (and in fact, using our custom types also breaks the
    // build!). so all we need to do is declare the actual function names,
    // and always give them the signature (...args: any[]): any;

    // for build testing only (at this point)
    toBeNumeric(): void;

    // from MockApiMatchers
    toHaveBeenCalledWithApi(...args: any[]): any;
    toHaveBeenCalledWithEndpoint(...args: any[]): any;
    toHaveBeenCalledWithBody(...args: any[]): any;
    toHaveBeenCalledWithParameters(...args: any[]): any;
    toHaveBeenCalledWithLoading(...args: any[]): any;
    toHaveBeenCalledWithDownload(...args: any[]): any;
    toHaveBeenCalledWithOverridingToken(...args: any[]): any;
  }
}
