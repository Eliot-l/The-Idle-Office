const SAVE_KEY = "idleOffice.save";
const SAVE_VERSION = 1;

/**
 * Format de save :
 * {
 *   meta: { version: number, savedAt: number },
 *   state: { ...gameState }
 * }
 */
export const SaveService = {
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return this.migrateIfNeeded(parsed);
    } catch (e) {
      console.warn("Save load failed:", e);
      return null;
    }
  },

  save(state) {
    try {
      const payload = {
        meta: { version: SAVE_VERSION, savedAt: Date.now() },
        state,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Save failed:", e);
    }
  },

  reset() {
    localStorage.removeItem(SAVE_KEY);
  },

  migrateIfNeeded(payload) {
    // Tolérance si vieux format (juste state)
    if (!payload?.meta?.version && payload?.state == null && payload != null) {
      payload = { meta: { version: 0, savedAt: Date.now() }, state: payload };
    }

    let version = payload?.meta?.version ?? 0;
    let state = payload?.state ?? null;
    if (!state) return null;

    // 🔁 Ici tu ajoutes des migrations futures : v1 -> v2 -> v3 ...
    // Exemple :
    // if (version === 1) { state = migrateV1ToV2(state); version = 2; }

    // Si version inconnue (save venant du futur) : on refuse
    if (version > SAVE_VERSION) return null;

    return { meta: { version, savedAt: payload.meta?.savedAt ?? Date.now() }, state };
  },
};
