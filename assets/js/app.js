import { MainController } from "../../controllers/mainController.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new MainController();
  app.init();
});