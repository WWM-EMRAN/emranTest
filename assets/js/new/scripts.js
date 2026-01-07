
/* =====================================================
   scripts.js
   UI behaviour only (no data, no rendering)
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Preloader
  =============================== */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('preloader--fadeout');
      setTimeout(() => {
        preloader.classList.add('is-hidden');
      }, 400);
    });
  }

  /* ===============================
     Scroll-to-top Button
  =============================== */
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollBtn.classList.add('active');
      } else {
        scrollBtn.classList.remove('active');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===============================
     Pure JS Scroll Reveal
  =============================== */
  const revealEls = document.querySelectorAll('.u-fade-in');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('u-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ===============================
     Mobile Nav Toggle (optional)
  =============================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
      navToggle.classList.toggle('active');
    });
  }

});
