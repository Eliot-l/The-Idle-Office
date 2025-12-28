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

    // NOUVEAU : caractéristiques additionnelles
    // Focus : entier [0..100] — initialisé à 100
    this.focus = 100;

    // État : "actif" | "repos" | "malade" (par défaut "actif")
    this.state = "actif";
  }

  // Méthode utilitaire pour changer l'état (valide les options)
  setState(newState) {
    const allowed = ["actif", "repos", "malade"];
    if (!allowed.includes(newState)) {
      throw new Error(`Invalid state "${newState}". Allowed: ${allowed.join(", ")}`);
    }
    this.state = newState;
  }

  // Focus helpers : clamp entre 0 et 100
  clampFocus(value) {
    if (Number.isNaN(Number(value))) return 0;
    return Math.max(0, Math.min(100, Math.floor(Number(value))));
  }

  // Définit le focus (sera clampé)
  setFocus(value) {
    this.focus = this.clampFocus(value);
  }

  // Modifie le focus par delta (positif ou négatif) et clamp
  changeFocus(delta) {
    this.focus = this.clampFocus(this.focus + Number(delta));
  }

  adjustStat(baseStat, rarity) {
    let adjusted = baseStat;
    for (let i = 1; i < rarity; i++) adjusted *= 1.25;
    adjusted *= 1 + Math.random() * 0.4 - 0.2; // Random variation [-20%, +20%]
    return Math.floor(adjusted);
  }
}
