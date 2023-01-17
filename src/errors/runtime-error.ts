export class RuntimeError extends Error {
  routeURL: string;

  constructor(message: string, routeURL: string) {
    super(message);
    this.routeURL = routeURL;
  }
}