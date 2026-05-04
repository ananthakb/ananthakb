/* Shared chrome (top bar + footer + theme toggle) injected into subpages */
(function () {
  var script = document.currentScript;
  var page = script && script.dataset.page ? script.dataset.page : '';

  var nav = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'publications.html', label: 'Research', key: 'research' },
    { href: 'talks.html', label: 'Talks', key: 'talks' },
    { href: 'teaching.html', label: 'Teaching', key: 'teaching' },
    { href: 'miscellaneous.html', label: 'Misc', key: 'misc' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ];

  function renderTop() {
    var host = document.getElementById('site-top');
    if (!host) return;
    var navHtml = nav.map(function (n) {
      var cls = n.key === page ? 'current' : '';
      return '<a href="' + n.href + '" class="' + cls + '">' + n.label.toLowerCase() + '</a>';
    }).join('');
    host.innerHTML =
      '<div class="id"><span class="name">anantha krishna b</span></div>' +
      '<nav>' + navHtml +
      '<button id="themeBtn" class="theme-toggle" aria-label="Toggle theme" style="margin-left: 0.5rem;">' +
        '<span class="dot"></span><span id="themeLabel">light</span>' +
      '</button>' +
      '</nav>';
    wireTheme();
  }

  function renderBottom() {
    var host = document.getElementById('site-bottom');
    if (!host) return;
    var year = new Date().getFullYear();
    host.innerHTML =
      '<div>© anantha krishna b · ' + year + '</div>' +
      '<div><a href="index.html">← home</a></div>';
  }

  function wireTheme() {
    var btn = document.getElementById('themeBtn');
    var label = document.getElementById('themeLabel');
    if (!btn || !label) return;
    function sync() {
      var dark = document.documentElement.classList.contains('dark');
      label.textContent = dark ? 'dark' : 'light';
    }
    sync();
    btn.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      var dark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      sync();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { renderTop(); renderBottom(); });
  } else {
    renderTop(); renderBottom();
  }
})();
