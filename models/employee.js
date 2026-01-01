export const EMPLOYEE_DATA = [
  { rarity: 1, name: "Cyril", type: 1, EPS: 1 },
  { rarity: 1, name: "Enzo", type: 1, EPS: 1 },
  { rarity: 1, name: "Kyllian", type: 1, EPS: 1 },
  { rarity: 1, name: "Fred", type: 1, EPS: 1 },
  { rarity: 2, name: "Ben", type: 1, EPS: -1 },
  { rarity: 2, name: "Noa", type: 1, EPS: 1 },
  { rarity: 2, name: "Loic", type: 1, EPS: 2 },
  { rarity: 2, name: "Alex", type: 1, EPS: 2 },
  { rarity: 3, name: "Quentin", type: 1, EPS: 2 },
  { rarity: 3, name: "Bastien", type: 1, EPS: 3 },
  { rarity: 3, name: "Théo", type: 1, EPS: 3 },
  { rarity: 4, name: "Florian", type: 1, EPS: 3 },
  { rarity: 4, name: "Brice", type: 1, EPS: 4 },
  { rarity: 4, name: "Paul", type: 1, EPS: 4 },
  { rarity: 5, name: "Georges", type: 1, EPS: 5 },
  { rarity: 5, name: "Sarah", type: 1, EPS: 5 },
  { rarity: 6, name: "Tim", type: 1, EPS: 6 },
  { rarity: 6, name: "Eliot", type: 1, EPS: 6 }
];

export class Employee {
  constructor({ id, name }) {
    const fixedData = EMPLOYEE_DATA.find((data) => data.name === name);
    if (!fixedData) {
      throw new Error(`Employee name ${name} not found in EMPLOYEE_DATA.`);
    }

    this.id = id;
    this.name = fixedData.name;
    this.rarity = fixedData.rarity;
    this.type = fixedData.type;
    this.EPS = fixedData.EPS;
    const baseStats = { atk: 17, vita: 50, ini: 13 };

    this.atk = this.adjustStat(baseStats.atk, this.rarity);
    this.vita = this.adjustStat(baseStats.vita, this.rarity);
    this.ini = this.adjustStat(baseStats.ini, this.rarity);

    // Focus : entier [0..100] — initialisé à 100
    this.focus = 100;

    // État : "actif" | "repos" | "malade" (par défaut "actif")
    this.state = "actif";

    // Nouveau: assigned -> true = affecté à l'Agency (produit si assigned)
    this.assigned = false;
  }

  // Méthode utilitaire pour changer l'état (valide les options)
  setState(newState) {
    const allowed = ["actif", "repos", "malade"];
    if (!allowed.includes(newState)) {
      throw new Error(`Invalid state "${newState}". Allowed: ${allowed.join(", ")}`);
    }
    this.state = newState;
  }

  // Assigned helpers
  isAssigned() {
    return !!this.assigned;
  }

  setAssigned(flag) {
    this.assigned = !!flag;
  }

  // Focus helpers : clamp entre 0 et 100 (float, pas d'arrondi)
  clampFocus(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  // Définit le focus (sera clampé)
  setFocus(value) {
    this.focus = this.clampFocus(value);
  }

  // Modifie le focus par delta (positif ou négatif) et clamp — accepte delta float
  changeFocus(delta) {
    this.focus = this.clampFocus((Number(this.focus) || 0) + Number(delta));
  }

  adjustStat(baseStat, rarity) {
    let adjusted = baseStat;
    for (let i = 1; i < rarity; i++) adjusted *= 1.25;
    adjusted *= 1 + Math.random() * 0.4 - 0.2; // Random variation [-20%, +20%]
    return Math.floor(adjusted);
  }

  // Re-hydratation depuis un objet plain (utile si saved state)
  static fromState(s) {
    const inst = new Employee({ id: s.id, name: s.name });
    if (typeof s.EPS !== "undefined") inst.EPS = s.EPS;
    if (typeof s.atk !== "undefined") inst.atk = s.atk;
    if (typeof s.vita !== "undefined") inst.vita = s.vita;
    if (typeof s.ini !== "undefined") inst.ini = s.ini;
    if (typeof s.focus !== "undefined") inst.focus = inst.clampFocus(s.focus);
    if (typeof s.state !== "undefined") inst.state = s.state;
    if (typeof s.assigned !== "undefined") inst.assigned = !!s.assigned;
    Object.keys(s).forEach((k) => {
      if (!["id","name","EPS","atk","vita","ini","focus","state","assigned"].includes(k)) {
        inst[k] = s[k];
      }
    });
    return inst;
  }
}
