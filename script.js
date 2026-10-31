(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menu mobile
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });

  // Parallax do hero (mouse no desktop, inclinação por rolagem no celular)
  var hero = document.querySelector('.hero');
  var layers = hero.querySelectorAll('[data-depth]');
  var base = 1.08;
  function move(x, y) {
    layers.forEach(function (el) {
      var d = parseFloat(el.dataset.depth);
      el.style.transform = 'translate(' + (x * d) + 'px,' + (y * d) + 'px) scale(' + base + ')';
    });
  }
  if (!reduce) {
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = hero.getBoundingClientRect();
      move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    hero.addEventListener('pointerleave', function () { move(0, 0); });
    window.addEventListener('scroll', function () {
      if (window.scrollY < hero.offsetHeight) {
        document.querySelector('.hero__shot img').style.marginTop = (window.scrollY * 0.12) + 'px';
      }
    }, { passive: true });
  }

  // Efeito de luz que segue o cursor nas fotos; no toque, alterna o brilho
  document.querySelectorAll('.shot').forEach(function (shot) {
    shot.addEventListener('pointermove', function (e) {
      var r = shot.getBoundingClientRect();
      shot.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      shot.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    shot.addEventListener('click', function () { shot.classList.toggle('lit'); });
    shot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shot.classList.toggle('lit'); }
    });
  });

  // Entrada suave das seções
  var items = document.querySelectorAll('.card, .about > *, .foot__in > *');
  items.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
