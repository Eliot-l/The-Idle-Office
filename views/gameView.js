export class GameView {
  render(state, derived) {
    const app = document.getElementById("app");

    app.innerHTML = `
      <div class="panel">
        <h2>Études : <span id="studies">${format(state.studies)}</span></h2>
        <div>EPS : <span id="eps">${format(derived.eps)}</span> /s</div>

        <div class="row">
          <button id="produce">Produire +1</button>
          <button id="summon" disabled title="Bientôt : invoquer des employés">
            Invoquer (bientôt)
          </button>
        </div>

        <div class="hint">
          Astuce : tant que tu n’as pas d’employés, l’EPS reste à 0.
        </div>
      </div>
    `;
  }

  bindProduce(handler) {
    document.getElementById("produce").addEventListener("click", handler);
  }

  updateHUD({ studies, eps }) {
    document.getElementById("studies").textContent = format(studies);
    document.getElementById("eps").textContent = format(eps);
  }
}

function format(n) {
  if (typeof n !== "number") return String(n);
  if (n < 1000) return n.toFixed(Number.isInteger(n) ? 0 : 2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
