(function () {
  var key = "ice-theme";
  var root = document.documentElement;
  var body = document.body;
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-ice-theme-toggle]"));

  function currentTheme() {
    try {
      return localStorage.getItem(key) === "dark" ? "dark" : "light";
    } catch (error) {
      return "light";
    }
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    root.classList.toggle("ice-dark", isDark);
    body.classList.toggle("ice-dark", isDark);
    body.classList.toggle("light", !isDark);

    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Ativar modo dia" : "Ativar modo noite");
      var label = button.querySelector(".ice-theme-label");
      if (label) {
        label.textContent = isDark ? "Dia" : "Noite";
      }
    });
  }

  applyTheme(currentTheme());

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var next = root.classList.contains("ice-dark") ? "light" : "dark";
      try {
        localStorage.setItem(key, next);
      } catch (error) {}
      applyTheme(next);
    });
  });
})();
