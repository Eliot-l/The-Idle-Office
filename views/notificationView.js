export class NotificationView {
  constructor() {
    this._container = null;
    this._ensure();
  }
  _ensure() {
    if (this._container) return;
    const c = document.createElement("div");
    c.id = "notif-container";
    c.style = "position:fixed;right:16px;top:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(c);
    this._container = c;
  }
  show(message, { type = "info", ttl = 3000 } = {}) {
    const el = document.createElement("div");
    el.className = `notif notif-${type}`;
    el.style = "background:#222;color:#fff;padding:8px 12px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.12);";
    el.textContent = message;
    this._container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, ttl);
  }
}
