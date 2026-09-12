/* Mobile nav toggle. Standalone, no imports, no framework — loaded with
   <script src="/js/nav.js" defer>.

   Markup contract (see site/css/site.css, ".nav-toggle" / ".nav #navmenu"):
     <header class="nav"><div class="wrap row">
       <a class="logo" …>…</a>
       <nav id="navmenu"> … links … </nav>
       <button class="nav-toggle" aria-expanded="false" aria-controls="navmenu">
         <span></span><span></span><span></span></button>
     </div></header>

   The CSS owns visibility; this file only owns the `.open` class on .nav and
   the aria-expanded mirror on the button. Above 860px the panel is irrelevant,
   so the class is cleared on resize — otherwise a menu left open on a rotated
   phone would keep .open on a desktop-width layout. */
(function () {
  "use strict";

  var BREAKPOINT = 860;

  var toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;

  var header = toggle.closest(".nav");
  var menu = document.getElementById(toggle.getAttribute("aria-controls") || "navmenu");
  if (!header || !menu) return;

  function setOpen(open) {
    header.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function isOpen() {
    return header.classList.contains("open");
  }

  // The sheet carries four always-open mega panels now, which is taller than a
  // 390px phone. It is absolutely positioned inside a STICKY header, so anything
  // past the fold would simply be unreachable: the page scrolls, the sheet does
  // not. Bound it to what is left of the viewport and let it scroll itself.
  // Measured, not assumed: the height is read at open time, so a rotated phone
  // or an address bar that has just collapsed gets the right number.
  function sizeSheet() {
    if (window.innerWidth > BREAKPOINT) {
      menu.style.maxHeight = "";
      menu.style.overflowY = "";
      return;
    }
    var top = header.getBoundingClientRect().bottom + 12;
    menu.style.maxHeight = Math.max(180, window.innerHeight - top - 16) + "px";
    menu.style.overflowY = "auto";
  }

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    var want = !isOpen();
    if (want) sizeSheet();
    setOpen(want);
  });

  // a tap on any link inside the panel navigates; leaving the panel open
  // means the next page paints with a menu nobody asked for
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "Escape" || e.key === "Esc") && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // clicking the page behind an open panel closes it
  document.addEventListener("click", function (e) {
    if (!isOpen()) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) return;
    resizeTimer = window.setTimeout(function () {
      resizeTimer = null;
      if (window.innerWidth > BREAKPOINT && isOpen()) setOpen(false);
      if (isOpen()) sizeSheet();
    }, 100);
  });
})();

/* Mega menus (2026-09-12, interaction pass 2026-09-12 pm).

   Markup contract, written by scripts/genchrome.mjs:

     <div class="nav-item has-menu">
       <button class="nav-trig" aria-expanded="false" aria-controls="menu-x">…</button>
       <div class="nav-menu" id="menu-x"> … </div>
     </div>

   Desktop: click or hover opens one panel at a time; Escape, an outside click
   and a tab-out close it. Below 860px the triggers are display:none and the
   panels are plain stacks inside the mobile sheet.

   Three things this file is careful about:

   1. NO-JS CONTRACT. The panels ship VISIBLE. `js` on <html> is what turns
      them into dropdowns, so a visitor with JS off keeps every link in the
      header instead of meeting four dead buttons. The verify gate asserts
      "renders with JS disabled" and counts any hidden text block over 20
      characters as a failure, so nothing here may hide a panel before that
      class lands.
   2. HOVER INTENT. A mouse travelling diagonally from the trigger to a link in
      the lower corner of the panel leaves the trigger's box for a few frames.
      Closing on that mouseleave is the single most common mega-menu defect, so
      a close is scheduled and cancelled if the pointer arrives anywhere in the
      item within CLOSE_DELAY.
   3. NO FOCUS TRAP. Arrow keys move within an open panel as a convenience;
      Tab always behaves normally and walks straight out of it.

   This file never animates anything — the chevron and the panel are the
   stylesheet's business — so there is nothing here for prefers-reduced-motion
   to reduce, and the hover-intent delay is deliberately not motion. */
(function () {
  "use strict";

  var BREAKPOINT = 860;
  var CLOSE_DELAY = 220;   // ms of grace on mouseleave: the diagonal path

  var items = [].slice.call(document.querySelectorAll(".nav-item.has-menu"));
  if (!items.length) return;

  document.documentElement.classList.add("js");

  var open = null;
  var closeTimer = null;
  // how the currently open panel got opened: "hover" or "click"
  var openedBy = new Map();

  function panelOf(item) { return item.querySelector(".nav-menu"); }
  function trigOf(item) { return item.querySelector(".nav-trig"); }
  function desktop() { return window.innerWidth > BREAKPOINT; }
  function linksOf(item) {
    var panel = panelOf(item);
    return panel ? [].slice.call(panel.querySelectorAll("a[href]")) : [];
  }

  function cancelClose() {
    if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }
  }

  function setOpen(item, want) {
    var panel = panelOf(item), trig = trigOf(item);
    if (!panel || !trig) return;
    item.classList.toggle("open", want);
    // aria-expanded is the only thing a screen reader has to go on, so it
    // mirrors the class on every path, including the delayed close.
    trig.setAttribute("aria-expanded", want ? "true" : "false");
    open = want ? item : (open === item ? null : open);
  }

  function closeAll() {
    cancelClose();
    items.forEach(function (i) { setOpen(i, false); });
    open = null;
  }

  function openOnly(item) {
    cancelClose();
    items.forEach(function (i) { if (i !== item) setOpen(i, false); });
    setOpen(item, true);
  }

  function scheduleClose(item) {
    cancelClose();
    closeTimer = window.setTimeout(function () {
      closeTimer = null;
      if (item.matches(":hover")) return;            // pointer came back
      // Only focus INSIDE THE PANEL holds it open. Focus on the trigger does
      // not: a click leaves focus there, and guarding on the whole item left a
      // hover-opened panel standing after the pointer had walked away
      // (measured in Chrome at 1440px).
      var panel = panelOf(item);
      if (panel && panel.contains(document.activeElement)) return;
      setOpen(item, false);
    }, CLOSE_DELAY);
  }

  // On a phone the panels are always-on stacks; on desktop they start closed.
  function sync() {
    items.forEach(function (i) { if (i !== open || !desktop()) setOpen(i, false); });
  }

  // Arrow/Home/End move within the open panel. Tab is untouched, so focus is
  // never trapped: the last link tabs out and focusout closes the panel.
  function moveFocus(item, from, delta) {
    var links = linksOf(item);
    if (!links.length) return;
    var i = links.indexOf(from);
    var next = delta === "first" ? 0
      : delta === "last" ? links.length - 1
      : i < 0 ? (delta > 0 ? 0 : links.length - 1)
      : (i + delta + links.length) % links.length;
    links[next].focus();
  }

  items.forEach(function (item) {
    var trig = trigOf(item);
    if (!trig) return;

    // A click on a panel the POINTER already opened must not close it: on a
    // hover-capable device mouseenter fires first, so a naive toggle reads
    // every first click as a close and the menu blinks shut under the cursor.
    // Measured in Chrome at 1440px before this line existed. So the toggle
    // keys on how the panel was opened, not just on whether it is open.
    trig.addEventListener("click", function (e) {
      e.preventDefault();
      if (!desktop()) return;
      if (item.classList.contains("open") && openedBy.get(item) === "click") {
        setOpen(item, false);
        cancelClose();
      } else {
        openOnly(item);
        openedBy.set(item, "click");
      }
    });

    // Keyboard on the trigger: Down/Up opens and lands on a link, so the panel
    // is reachable without a mouse and without tabbing blind through it.
    trig.addEventListener("keydown", function (e) {
      if (!desktop()) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openOnly(item);
        openedBy.set(item, "click");
        moveFocus(item, null, e.key === "ArrowDown" ? "first" : "last");
      }
    });

    // hover is an affordance, not the only way in: pointer only, and it never
    // fires on touch because touch raises click first and we bail above
    item.addEventListener("mouseenter", function () {
      if (!desktop()) return;
      if (!item.classList.contains("open")) openedBy.set(item, "hover");
      openOnly(item);
    });
    item.addEventListener("mouseleave", function () {
      if (!desktop()) return;
      scheduleClose(item);
    });

    var panel = panelOf(item);
    if (panel) {
      panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(item, false); });

      panel.addEventListener("keydown", function (e) {
        if (!desktop()) return;
        var link = e.target.closest("a[href]");
        if (e.key === "ArrowDown") { e.preventDefault(); moveFocus(item, link, 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); moveFocus(item, link, -1); }
        else if (e.key === "Home") { e.preventDefault(); moveFocus(item, link, "first"); }
        else if (e.key === "End") { e.preventDefault(); moveFocus(item, link, "last"); }
      });
    }

    // a tab out of the last link in the panel closes it behind you
    item.addEventListener("focusout", function (e) {
      if (!desktop()) return;
      if (!item.contains(e.relatedTarget)) setOpen(item, false);
    });
    // and focus arriving back inside cancels a pending hover-out close
    item.addEventListener("focusin", function () { if (desktop()) cancelClose(); });
  });

  // Escape closes and hands focus back to the trigger that opened the panel.
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Escape" || e.key === "Esc") && open) {
      var t = trigOf(open);
      closeAll();
      if (t) t.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (!open) return;
    if (open.contains(e.target)) return;
    closeAll();
  });

  var t = null;
  window.addEventListener("resize", function () {
    if (t) return;
    t = window.setTimeout(function () { t = null; sync(); }, 120);
  });

  sync();
})();

/* FAQ panels (2026-09-12). They ship as <details open> because the verify gate
   asserts the page renders with JS disabled, and a closed <details> is text
   nobody can reach without script. With JS on, everything but the first panel
   collapses, which is the reading experience the design wants. */
(function () {
  "use strict";
  var panels = [].slice.call(document.querySelectorAll(".faq details[open]"));
  if (panels.length < 2) return;
  panels.slice(1).forEach(function (d) { d.removeAttribute("open"); });
})();
