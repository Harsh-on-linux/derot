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
  window.addEventListener("yt-navigate-finish", maybeRedirect);
  window.addEventListener("popstate", maybeRedirect);

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
