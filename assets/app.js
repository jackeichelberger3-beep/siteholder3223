/* ------------------------------------------------------------------
   Standalone site script
   - fills the header, side menu, drop-down menu and footer
   - search, menu layout, full screen
   - home page cards
   - changelog folder loader

   Add a page:  put the HTML file in pages/, then add one line to PAGES.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var PAGES = [
    { path: "index.html", title: "Home", group: "Pages", desc: "Every page on the site, in one index." },
    { path: "pages/games.html", title: "Game Library", group: "Pages", desc: "Every game on the site, ready to play." },
    { path: "pages/documentation.html", title: "Documentation", group: "Pages", desc: "How the site works, feature by feature." },
    { path: "pages/gallery.html", title: "Project Gallery", group: "Pages", desc: "What has been built here, at a glance." },
    { path: "pages/testimonials.html", title: "Testimonials", group: "Pages", desc: "Visitor feedback, with a template." },
    { path: "pages/faq.html", title: "FAQ", group: "Pages", desc: "Answers about pages, hosting and customization." },
    { path: "pages/contact.html", title: "Contact", group: "Pages", desc: "Send a message or copy the email address." },
    { path: "pages/changelog.html", title: "Changelog", group: "Pages", desc: "Every update, in a scrolling timeline." },
    { path: "pages/about.html", title: "About", group: "Pages", desc: "What this site is and how it is built." },
    { path: "pages/tic-tac-toe.html", title: "Tic-tac-toe", group: "Games", desc: "Two players, nine squares, one file." },
    { path: "pages/memory-match.html", title: "Memory Match", group: "Games", desc: "Find the eight pairs." },
    { path: "pages/html-demo.html", title: "HTML page demo", group: "Guides", desc: "A page written as plain HTML, CSS and JS." },
    { path: "pages/github-setup.html", title: "GitHub Setup", group: "Guides", desc: "Step-by-step hosting on GitHub Pages." },
    { path: "pages/contribute.html", title: "Contributor Guidelines", group: "Guides", desc: "How to submit your own HTML file or game." },
    { path: "pages/resources.html", title: "Resources", group: "Guides", desc: "Tools and references worth bookmarking." },
    { path: "pages/privacy.html", title: "Privacy Policy", group: "Legal", desc: "What this site does and does not collect." },
    { path: "pages/terms.html", title: "Terms of Use", group: "Legal", desc: "Content ownership and expectations." }
  ];

  var STORAGE_KEY = "standalone-menu";
  var body = document.body;
  var root = body.getAttribute("data-root") || ".";
  var site = { name: "My Site", tagline: "", contactEmail: "hello@example.com", menuStyle: "side" };

  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function href(page) { return page.path === "index.html" ? root + "/index.html" : root + "/" + page.path; }

  function currentFile() {
    var parts = window.location.pathname.split("/");
    var last = parts[parts.length - 1];
    return last === "" ? "index.html" : last;
  }

  function isCurrent(page) { return page.path.split("/").pop() === currentFile(); }

  function navHtml() {
    var groups = [];
    PAGES.forEach(function (page) {
      var group = null;
      for (var i = 0; i < groups.length; i += 1) { if (groups[i].name === page.group) group = groups[i]; }
      if (!group) { group = { name: page.group, items: [] }; groups.push(group); }
      group.items.push(page);
    });

    return groups.map(function (group) {
      return '<p class="nav-group mono">' + escapeHtml(group.name) + "</p>" +
        group.items.map(function (page) {
          return '<a class="nav-link' + (isCurrent(page) ? " is-active" : "") + '" href="' + href(page) + '">' +
            escapeHtml(page.title) + "</a>";
        }).join("");
    }).join("");
  }

  function searchHtml() {
    return '<label class="search"><span class="sr-only">Search pages</span>' +
      '<input type="search" placeholder="Search pages…" aria-label="Search pages" /></label>' +
      '<div class="search-results" hidden></div>';
  }

  function wireSearch(container) {
    if (!container) return;
    var input = $("input", container);
    var results = $(".search-results", container);
    if (!input || !results) return;

    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      if (!term) { results.hidden = true; results.innerHTML = ""; return; }

      var found = PAGES.filter(function (page) {
        return (page.title + " " + page.group + " " + (page.desc || "")).toLowerCase().indexOf(term) > -1;
      });

      results.hidden = false;
      results.innerHTML = found.length
        ? found.map(function (page) {
            return '<a class="search-item" href="' + href(page) + '">' + escapeHtml(page.title) +
              "<span>" + escapeHtml(page.group) + "</span></a>";
          }).join("")
        : '<p class="search-empty">No pages match “' + escapeHtml(input.value) + '”.</p>';
    });

  }

  function menuValue() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "side" || stored === "dropdown") return stored;
    } catch (error) { /* storage unavailable */ }
    return site.menuStyle === "dropdown" ? "dropdown" : "side";
  }

  function applyMenu(value) {
    document.documentElement.setAttribute("data-menu", value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (error) { /* ignore */ }
    var button = $('[data-action="layout"]');
    if (button) {
      button.textContent = value === "side" ? "Drop-down" : "Side menu";
      button.setAttribute("aria-label", value === "side" ? "Switch to drop-down menu" : "Switch to side menu");
    }
  }

  function renderShell() {
    var header = $("#site-header");
    var sidebar = $("#site-sidebar");
    var footer = $("#site-footer");
    var initial = (site.name || "M").trim().charAt(0).toUpperCase() || "M";

    if (header) {
      header.className = "topbar";
      header.innerHTML =
        '<div class="topbar-inner">' +
          '<a class="brand" href="' + root + '/index.html">' +
            '<span class="brand-mark">' + escapeHtml(initial) + "</span>" +
            '<span class="brand-name">' + escapeHtml(site.name) + "</span>" +
          "</a>" +
          searchHtml() +
          '<div class="topbar-actions">' +
            '<button type="button" class="icon-btn" data-action="layout">Drop-down</button>' +
            '<button type="button" class="icon-btn" data-action="fullscreen" aria-label="Toggle full screen">Full screen</button>' +
            '<button type="button" class="menu-btn" data-action="pages" aria-expanded="false" aria-controls="pages-panel">Pages</button>' +
          "</div>" +
        "</div>" +
        '<div class="pages-panel" id="pages-panel" hidden>' +
          searchHtml() +
          '<nav aria-label="Site pages">' + navHtml() + "</nav>" +
        "</div>";
      wireSearch($(".search", header));
      $$(".pages-panel", header).forEach(function (panel) { wireSearch(panel); });
    }

    if (sidebar) {
      sidebar.className = "side";
      sidebar.innerHTML = searchHtml() + '<nav aria-label="Site pages">' + navHtml() + "</nav>";
      wireSearch(sidebar);
    }

    if (footer) {
      footer.className = "footer";
      footer.innerHTML =
        '<div class="footer-inner">' +
          "<span>" + escapeHtml(site.name) + " · standalone version</span>" +
          '<span><a href="' + root + '/pages/github-setup.html">GitHub setup</a>' +
          '<a href="' + root + '/pages/contribute.html">Contribute</a>' +
          '<a href="' + root + '/pages/privacy.html">Privacy</a></span>' +
        "</div>";
    }

    var heroTitle = $("#site-title");
    if (heroTitle && site.name) heroTitle.textContent = site.name;
    var heroTagline = $("#site-tagline");
    if (heroTagline && site.tagline) heroTagline.textContent = site.tagline;

    $$("[data-site-email]").forEach(function (element) {
      var email = site.contactEmail || "hello@example.com";
      element.textContent = email;
      if (element.tagName === "A") element.setAttribute("href", "mailto:" + email);
    });

    applyMenu(menuValue());
  }

  function renderHomeCards() {
    var container = $("#home-cards");
    if (!container) return;
    container.innerHTML = PAGES.filter(function (page) { return page.path !== "index.html"; })
      .map(function (page) {
        return '<a class="card" href="' + href(page) + '">' +
          '<span class="mono">' + escapeHtml(page.group) + "</span>" +
          "<h3>" + escapeHtml(page.title) + "</h3>" +
          "<p>" + escapeHtml(page.desc || "") + "</p></a>";
      }).join("");
  }

  function toggleFullscreen() {
    var next = document.documentElement.getAttribute("data-immersive") !== "true";
    document.documentElement.setAttribute("data-immersive", next ? "true" : "false");
    try {
      if (next && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (!next && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    } catch (error) { /* the page still opens in full-screen mode */ }
  }

  function loadChangelog() {
    var frame = $("#changelog-frame");
    if (!frame) return;
    var base = root + "/changelog/";

    fetch(base + "index.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("index missing");
        return response.json();
      })
      .then(function (index) {
        var files = (index && index.files) || [];
        return Promise.all(files.map(function (file) {
          return fetch(base + file, { cache: "no-store" }).then(function (response) { return response.json(); });
        }));
      })
      .then(function (entries) {
        if (!entries.length) {
          frame.innerHTML = '<p class="muted">No entries yet. Add a JSON file to the changelog folder and list it in index.json.</p>';
          return;
        }
        frame.innerHTML = "<ol>" + entries.map(function (entry) {
          var items = entry.items && entry.items.length
            ? '<ul class="entry-items">' + entry.items.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>"
            : "";
          return "<li>" +
            '<div class="entry-head">' +
              '<span class="entry-version">v' + escapeHtml(entry.version) + "</span>" +
              '<span class="entry-date">' + escapeHtml(entry.date) + "</span>" +
              (entry.type ? '<span class="badge">' + escapeHtml(entry.type) + "</span>" : "") +
            "</div>" +
            '<p class="entry-title">' + escapeHtml(entry.title) + "</p>" +
            '<p class="entry-summary">' + escapeHtml(entry.summary || "") + "</p>" +
            items +
          "</li>";
        }).join("") + "</ol>";
      })
      .catch(function () {
        frame.innerHTML = '<p class="muted">The changelog could not be loaded. Open the site through a web server or GitHub Pages — browsers block file loading when a page is opened straight from a folder.</p>';
      });
  }

  /* One outside-click listener closes every open search field. */
  document.addEventListener("click", function (event) {
    $$(".search-results").forEach(function (results) {
      var label = results.previousElementSibling;
      if (!label || !label.contains(event.target)) results.hidden = true;
    });
  });

  document.addEventListener("click", function (event) {
    var action = event.target.closest ? event.target.closest("[data-action]") : null;
    if (!action) return;

    var name = action.getAttribute("data-action");
    if (name === "layout") { applyMenu(menuValue() === "side" ? "dropdown" : "side"); }
    if (name === "fullscreen" || name === "exit-fullscreen") { toggleFullscreen(); }
    if (name === "pages") {
      var panel = $("#pages-panel");
      if (panel) {
        var open = panel.hidden;
        panel.hidden = !open;
        action.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }
    if (name === "copy") {
      var block = action.closest ? action.closest(".code") : null;
      var pre = block ? block.querySelector("pre") : null;
      if (pre && navigator.clipboard) {
        navigator.clipboard.writeText(pre.textContent).then(function () {
          var label = action.textContent;
          action.textContent = "Copied";
          setTimeout(function () { action.textContent = label; }, 1600);
        }).catch(function () { /* clipboard blocked */ });
      }
    }
  });

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) document.documentElement.setAttribute("data-immersive", "false");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (document.documentElement.getAttribute("data-immersive") === "true") toggleFullscreen();
  });

  function boot() {
    renderShell();
    renderHomeCards();
    loadChangelog();

    fetch(root + "/data/site.json", { cache: "no-store" })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        site = Object.assign(site, data || {});
        window.SITE = site;
        renderShell();
        renderHomeCards();
      })
      .catch(function () { window.SITE = site; });
  }

  window.SITE = site;
  boot();
})();
