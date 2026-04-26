(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (item) {
      item.classList.add("in");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("in");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
