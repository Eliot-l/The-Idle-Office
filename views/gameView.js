export class GameView {
  render(state, derived) {
    document.getElementById("studies").textContent = state.studies.toFixed(2);
    document.getElementById("eps").textContent = derived.eps.toFixed(2);
  }

  bindProduce(handler) {
    document.getElementById("produce-button").addEventListener("click", handler);
  }

  updateHUD({ studies, eps }) {
    document.getElementById("studies").textContent = studies.toFixed(2);
    document.getElementById("eps").textContent = eps.toFixed(2);
  }
}