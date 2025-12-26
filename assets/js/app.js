import { MainController } from "../../controllers/mainController.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialiser l'application avec MainController
  const app = new MainController();
  app.init();

  // Exposer app pour le débogage dans la console
  window.app = app;
});