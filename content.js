(() => {
  const DEFAULTS = {
    hideHome: true,
    hideShorts: true,
    hideSidebar: true,
    hideEndscreen: true,
    hideComments: true,
  };
  const KEYMAP = {
    hideHome: "derot-hide-home",
    hideShorts: "derot-hide-shorts",
    hideSidebar: "derot-hide-sidebar",
    hideEndscreen: "derot-hide-endscreen",
    hideComments: "derot-hide-comments",
  };

  // Apply defaults synchronously to avoid flash, then correct from storage.
  for (const k of Object.keys(KEYMAP)) {
    document.documentElement.dataset[KEYMAP[k]] = "true";
  }
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(DEFAULTS, (s) => applyFlags(s));
  }
  function applyFlags(s) {
    for (const k of Object.keys(KEYMAP)) {
      document.documentElement.dataset[KEYMAP[k]] = s[k] ? "true" : "false";
    }
  }

  // ponytail: single redirect guard for all SPA navigations
  function maybeRedirect() {
    const p = location.pathname;
    if (p.startsWith("/shorts/")) {
      const id = p.split("/")[2]?.split("?")[0];
      if (id) location.replace(`/watch?v=${id}`);
      else location.replace("/");
      return;
    }
    if (p === "/feed/trending" || p === "/feed/explore" || p === "/feed/shorts") {
      location.replace("/");
    }
  }

  maybeRedirect();
  window.addEventListener("yt-navigate-finish", () => { maybeRedirect(); renderHome(); });
  window.addEventListener("popstate", () => { maybeRedirect(); renderHome(); });

  // Search-only home: reuse no deps, inline styles to stay in one file.
  function renderHome() {
    document.getElementById("derot-home")?.remove();
    const homeOn = document.documentElement.dataset[KEYMAP.hideHome] !== "false";
    if (!homeOn || location.pathname !== "/") return;
    const host = document.querySelector("ytd-browse[page-subtype='home']") || document.getElementById("primary");
    if (!host) return;
    const box = document.createElement("div");
    box.id = "derot-home";
    box.style.cssText = "max-width:560px;margin:22vh auto 0;text-align:center;font-family:Roboto,Arial,sans-serif";
    box.innerHTML = `<h1 style="font-size:28px;font-weight:500">Search YouTube</h1>
      <div style="display:flex;gap:8px;margin-top:16px">
      <input id="derot-q" placeholder="What do you want to watch?" style="flex:1;padding:12px 16px;font-size:16px;border:1px solid #ccc;border-radius:24px">
      <button id="derot-go" style="padding:0 24px;font-size:16px;border:0;border-radius:24px;cursor:pointer">Go</button></div>
      <p style="margin-top:12px;color:#606060;font-size:13px">Feeds, Shorts and recommendations are hidden by Derot.</p>`;
    host.after(box);
    const q = box.querySelector("#derot-q"), go = () => {
      if (q.value.trim()) location.href = "/results?search_query=" + encodeURIComponent(q.value.trim());
    };
    box.querySelector("#derot-go").onclick = go;
    q.onkeydown = (e) => { if (e.key === "Enter") go(); };
    setTimeout(() => q.focus(), 100);
  }
  renderHome();

  // Cheap cleanup: drop Shorts shelves as they render (CSS hides the rest).
  if (DEFAULTS.hideShorts) {
    new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.matches?.("ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]")) n.remove();
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
