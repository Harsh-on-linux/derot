const KEYS = ["hideHome", "hideShorts", "hideSidebar", "hideEndscreen", "hideComments"];
const DEFAULTS = Object.fromEntries(KEYS.map((k) => [k, true]));
chrome.storage.sync.get(DEFAULTS, (s) => KEYS.forEach((k) => (document.getElementById(k).checked = !!s[k])));
KEYS.forEach((k) =>
  document.getElementById(k).addEventListener("change", (e) => chrome.storage.sync.set({ [k]: e.target.checked }))
);
