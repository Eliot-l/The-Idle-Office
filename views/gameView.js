export class GameView {
  render(state) {
    const app = document.getElementById("app");

    app.innerHTML = `
      <div class="panel">
        <h2>Études : <span id="studies">${state.studies}</span></h2>
        <button id="produce">Produire 1 étude</button>
      </div>
    `;
  }

  bindProduce(handler) {
    document.getElementById("produce").addEventListener("click", handler);
  }

  updateStudies(value) {
    document.getElementById("studies").textContent = value;
  }
}
