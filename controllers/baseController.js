export class BaseController {
  constructor() {
    this._mounted = false;
  }
  init() { this._mounted = true; }
  dispose() { this._mounted = false; }
  isMounted() { return !!this._mounted; }
}
