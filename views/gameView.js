export class GameView {
  render(state, derived) {
    document.getElementById("studies").textContent = state.studies;
    document.getElementById("eps").textContent = derived.eps;
  }

  bindProduce(handler) {
    document.getElementById("produce-button").addEventListener("click", handler);
  }

  updateHUD({ studies, eps }) {
    document.getElementById("studies").textContent = studies;
    document.getElementById("eps").textContent = eps;
  }
}