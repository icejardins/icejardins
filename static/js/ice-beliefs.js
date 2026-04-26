(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-belief-link]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-belief-section]"));
  if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

  function setActive(slug) {
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-belief-link") === slug);
    });
  }

  setActive(sections[0].getAttribute("data-belief-section"));

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      setActive(entry.target.getAttribute("data-belief-section"));
    });
  }, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0.01
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
