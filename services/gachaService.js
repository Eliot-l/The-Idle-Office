export class GachaService {
  constructor(state = null, onChange = () => {}) {
    this._randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    this.onChange = onChange;

    this.state = state ?? {
      pullsSinceR5: 0,
      pullsSinceR6: 0,
      targetR5: 50,   // fixé à 50
      targetR6: 200   // fixé à 200
    };
  }

  getState() {
    return this.state;
  }

  getRemaining() {
    return {
      r5: Math.max(0, this.state.targetR5 - this.state.pullsSinceR5),
      r6: Math.max(0, this.state.targetR6 - this.state.pullsSinceR6)
    };
  }

  reset() {
    this.state.pullsSinceR5 = 0;
    this.state.pullsSinceR6 = 0;
    this.state.targetR5 = 50;   // re-fixer à 50
    this.state.targetR6 = 200;  // re-fixer à 200
    this.onChange(this.state);
  }

  rollRarity() {
    // incrémente les compteurs de pull (compte le pull courant)
    this.state.pullsSinceR5++;
    this.state.pullsSinceR6++;

    // garantie R6 prioritaire
    if (this.state.pullsSinceR6 >= this.state.targetR6) {
      this.state.pullsSinceR6 = 0;
      this.state.pullsSinceR5 = 0;
      this.state.targetR6 = 200; // fixé
      this.state.targetR5 = 50;  // fixé
      this.onChange(this.state);
      return 6;
    }

    if (this.state.pullsSinceR5 >= this.state.targetR5) {
      this.state.pullsSinceR5 = 0;
      this.state.targetR5 = 50; // fixé
      this.onChange(this.state);
      return 5;
    }

    // tirage pondéré
    const r = Math.random() * 100;
    let rarity;
    if (r < 40) rarity = 1;         // 40%
    else if (r < 70) rarity = 2;    // 30%
    else if (r < 87) rarity = 3;    // 17%
    else if (r < 95) rarity = 4;    // 8%
    else if (r < 99) rarity = 5;    // 4%
    else rarity = 6;                // 1%

    // reset pity si R5/R6 naturellement obtenus
    if (rarity === 6) {
      this.state.pullsSinceR6 = 0;
      this.state.pullsSinceR5 = 0;
      this.state.targetR6 = 200; // fixé
      this.state.targetR5 = 50;  // fixé
    } else if (rarity === 5) {
      this.state.pullsSinceR5 = 0;
      this.state.targetR5 = 50; // fixé
    }

    this.onChange(this.state);
    return rarity;
  }
}
