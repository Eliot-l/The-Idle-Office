import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";
import { EmployeeController } from "./employeeController.js";
import { GachaService } from "../services/gachaService.js";
import { AgencyController } from "./agencyController.js";
import { AgencyService } from "../services/agencyService.js";
import { NotificationView } from "../views/notificationView.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    // initialiser GachaService en réutilisant le state sauvegardé s'il existe
    const pityState = this.model.getState().pity ?? null;
    this.gacha = new GachaService(pityState, (newPity) => {
      // synchroniser dans le model et sauvegarder
      this.model.getState().pity = newPity;
      this.model.save();
    });

    this.notification = new NotificationView();
    this.agencyService = new AgencyService(this.model, this.notification);

    this.view = new GameView();
    this.employeeController = new EmployeeController(this.model, this.gacha);
    // pass agencyService + notifier into agencyController
    this.agencyController = new AgencyController(this.model, this.employeeController, this.agencyService, this.notification);

    this.lastTimeMs = null;
    this.rafId = null;
  }

  init() {
    this.renderAll();

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.renderHUD();
    });

    // Lier les boutons de test/dev
    this.view.bindDevControls(
      () => { // Ajouter 10000 études
        this.model.addStudies(10000);
        this.renderHUD();
      },
      () => { // Réinitialiser tout
        this.model.reset();
        // reset gacha/pity et synchroniser dans le model
        if (this.gacha) {
          this.gacha.reset();
          this.model.getState().pity = this.gacha.getState();
        }
        // Vider la liste d'employés locale au controller et dans le state global
        if (this.employeeController?.model) this.employeeController.model.employees = [];
        if (this.model?.getState) this.model.getState().employees = [];
        this.model.save?.();
        this.renderAll();
      }
    );

    // init controllers
    this.employeeController.init();

    // wire employee view assign -> agency assign/unassign and refresh both views
    if (this.employeeController.view && typeof this.employeeController.view.bindToggleAssign === "function") {
      this.employeeController.view.bindToggleAssign((empId) => {
        const agency = this.model.getState().agency;
        const assignedIds = (agency.assignedIds || []).map(Number);
        const isAssigned = assignedIds.includes(Number(empId));

        // Use AgencyService when available so it can show notifications
        let res = { ok: false };
        if (isAssigned) {
          res = this.agencyService ? this.agencyService.unassign(empId) : this.model.unassignEmployeeFromAgency(empId);
        } else {
          res = this.agencyService ? this.agencyService.assign(empId) : this.model.assignEmployeeToAgency(empId);
        }

        // Fallback notification if AgencyService wasn't present to handle it
        if (!res?.ok && !this.agencyService && this.notification) {
          const reason = res?.reason || "unknown";
          if (reason === "no_slots") this.notification.show("Pas assez de slots dans l'agence.", { type: "warn" });
          else if (reason === "already_assigned") this.notification.show("Employé déjà assigné.", { type: "info" });
          else this.notification.show("Assignation impossible.", { type: "error" });
        }

        this.employeeController.renderEmployees();
        this.agencyController.refresh();
      });
    }

    this.agencyController.init();

    this.startLoop();
  }

  renderAll() {
    this.renderHUD();
    this.employeeController.renderEmployees();
    this.agencyController.refresh();
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = { eps: this.model.getEps() };
    const pityRemaining = this.gacha ? this.gacha.getRemaining() : null;
    this.view.updateHUD({ studies: state.studies, eps: derived.eps, pityRemaining });
  }

  startLoop() {
    const step = (timeMs) => {
      if (this.lastTimeMs == null) this.lastTimeMs = timeMs;
      const deltaSeconds = Math.min(0.25, (timeMs - this.lastTimeMs) / 1000);
      this.lastTimeMs = timeMs;

      this.model.tick(deltaSeconds);
      this.renderHUD();

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  }
}
