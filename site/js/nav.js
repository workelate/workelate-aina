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

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    setOpen(!isOpen());
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
    }, 100);
  });
})();
