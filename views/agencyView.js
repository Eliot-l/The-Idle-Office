export class AgencyView {
  // now accepts slots computed by the model
  render(agency, assignedEmployees = [], slots = 1) {
    const panel = document.getElementById("agency-panel");
    if (!panel) return;
    const levelEl = panel.querySelector("#agency-level");
    const slotsEl = panel.querySelector("#agency-slots");
    const countEl = panel.querySelector("#agency-assigned-count");
    const list = panel.querySelector("#agency-list");

    if (levelEl) levelEl.textContent = String(agency.level || 1);
    if (slotsEl) slotsEl.textContent = String(slots);
    if (countEl) countEl.textContent = String((agency.assignedIds || []).length);

    if (list) {
      list.innerHTML = "";

      // Render a fixed number of slot boxes (filled with assignedEmployees or empty placeholders)
      const slotContainer = document.createElement("div");
      slotContainer.className = "agency-slots-grid";

      for (let i = 0; i < slots; i++) {
        const emp = assignedEmployees[i];
        const slot = document.createElement("div");
        slot.className = "slot";
        if (emp) {
          slot.innerHTML = `
            <div class="slot-filled">
              <div class="employee-main"><strong>${emp.name}</strong> (R${emp.rarity}) • EPS: ${emp.EPS}</div>
              <div style="display:flex;gap:8px;align-items:center;margin-top:6px;">
                <button class="unassign-btn create-button" data-id="${emp.id}">Désassigner</button>
                <button class="details-btn create-button" data-id="${emp.id}">Détails</button>
              </div>
            </div>
          `;
        } else {
          slot.innerHTML = `
            <div class="slot-empty">
              <div class="slot-empty-label">Emplacement libre</div>
            </div>
          `;
        }
        slotContainer.appendChild(slot);
      }

      list.appendChild(slotContainer);
    }
  }

  bindLevelUp(handler) {
    const btn = document.getElementById("agency-levelup-button");
    if (btn) {
      btn.addEventListener("click", handler);
    }
  }

  // bind unassign/details click handler once
  bindUnassign(handler) {
    const list = document.getElementById("agency-list");
    if (!list) return;
    if (list._bound) return;
    list.addEventListener("click", (e) => {
      const unassignBtn = e.target.closest(".unassign-btn");
      if (unassignBtn) {
        const id = Number(unassignBtn.dataset.id);
        handler(id);
        return;
      }
      const detailsBtn = e.target.closest(".details-btn");
      if (detailsBtn) {
        const id = Number(detailsBtn.dataset.id);
        handler(id, { details: true });
      }
    });
    list._bound = true;
  }
}
