export class ModalView {
  constructor() {
    this._container = null;
  }

  _ensure() {
    if (this._container) return;
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    overlay.style = `
      position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
      background:rgba(0,0,0,0.5); z-index:9999;
    `;
    const box = document.createElement("div");
    box.id = "modal-box";
    box.style = `
      background:#fff; padding:16px; border-radius:8px; min-width:280px; max-width:520px;
      box-shadow:0 8px 24px rgba(0,0,0,0.2);
    `;
    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.close();
    });
    document.body.appendChild(overlay);
    this._container = overlay;
    this._box = box;
  }

  open(html, { onClose } = {}) {
    this._ensure();
    this._box.innerHTML = html + `<div style="text-align:right;margin-top:8px;"><button id="modal-close-btn" class="create-button">Fermer</button></div>`;
    this._container.style.display = "flex";
    const closeBtn = this._box.querySelector("#modal-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => {
      this.close();
      if (typeof onClose === "function") onClose();
    });
  }

  close() {
    if (!this._container) return;
    this._container.style.display = "none";
  }
}
