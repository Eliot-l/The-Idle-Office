export class GameView {
  render(state, derived, pityRemaining) {
    document.getElementById("studies").textContent = state.studies.toFixed(2);
    document.getElementById("eps").textContent = derived.eps.toFixed(2);
    if (pityRemaining) {
      const r5 = document.getElementById("r5-remaining");
      const r6 = document.getElementById("r6-remaining");
      if (r5) r5.textContent = pityRemaining.r5;
      if (r6) r6.textContent = pityRemaining.r6;
    }
  }

  bindProduce(handler) {
    document.getElementById("produce-button").addEventListener("click", handler);
  }

  updateHUD({ studies, eps, pityRemaining }) {
    document.getElementById("studies").textContent = studies.toFixed(2);
    document.getElementById("eps").textContent = eps.toFixed(2);
    if (pityRemaining) {
      const r5 = document.getElementById("r5-remaining");
      const r6 = document.getElementById("r6-remaining");
      if (r5) r5.textContent = pityRemaining.r5;
      if (r6) r6.textContent = pityRemaining.r6;
    }
  }

  // Nouveaux binders pour les boutons de test/dev
  bindDevControls(onAdd10000, onReset) {
    const addBtn = document.getElementById("add-10000-button");
    if (addBtn) addBtn.addEventListener("click", onAdd10000);

    const resetBtn = document.getElementById("reset-button");
    if (resetBtn) resetBtn.addEventListener("click", onReset);
  }
}
