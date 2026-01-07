/**
* Emran Ali - Website Core Logic
* Modular Refactor: January 2026
*/

(function () {
    "use strict";

    /**
     * --- MODULE: UI UTILITIES ---
     */
    const UI = {
        preloader: () => {
            const preloader = document.getElementById("preloader");
            if (preloader) {
                setTimeout(() => {
                    preloader.style.transition = "opacity 0.6s ease";
                    preloader.style.opacity = "0";
                    setTimeout(() => preloader.style.display = "none", 600);
                }, 1000);
            }
        },

        scrollTopButton: () => {
            const scrollTop = document.querySelector('.scroll-top');
            if (scrollTop) {
                const toggle = () => window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
                window.addEventListener('load', toggle);
                document.addEventListener('scroll', toggle);

                scrollTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        },

        smoothScroll: (headerOffset = 0) => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        window.scrollTo({
                            top: target.offsetTop - headerOffset,
                            behavior: "smooth"
                        });
                    }
                });
            });
        }
    };

    /**
     * --- MODULE: UI UTILITIES ---
     */

        // ... preloader and scrollTopButton remain the same ...

        /**
         * Enhanced Smooth Scroll
         * Handles the animation and forces a ScrollSpy refresh upon completion
         */
        smoothScroll: (headerOffset = 0) => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    const target = document.querySelector(targetId);

                    if (target) {
                        e.preventDefault();

                        // Calculate position with offset
                        const elementPosition = target.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });

                        // Fallback: If it's a mobile nav, close it
                        if (document.body.classList.contains('mobile-nav-active')) {
                            document.body.classList.remove('mobile-nav-active');
                            const toggleBtn = document.querySelector('.header-toggle');
                            if (toggleBtn) {
                                toggleBtn.classList.add('bi-list');
                                toggleBtn.classList.remove('bi-x');
                            }
                        }
                    }
                });
            });
        }

    /**
     * --- MODULE: NAVIGATION ---
     */
    const Navigation = {
        init: function() {
            this.mobileToggle();
            this.initDropdowns();
            this.scrollSpy();
        },

        // Handles the Mobile Burger Menu
        mobileToggle: () => {
            const toggleBtn = document.querySelector('.header-toggle');
            const body = document.querySelector('body');
            if (!toggleBtn) return;

            const toggleAction = () => {
                body.classList.toggle('mobile-nav-active');
                toggleBtn.classList.toggle('bi-list');
                toggleBtn.classList.toggle('bi-x');
            };

            toggleBtn.addEventListener('click', toggleAction);
        },

        // RESTORED: Handles Submenu Expansion
        initDropdowns: () => {
            document.querySelectorAll('.navmenu .dropdown > a').forEach(link => {
                link.addEventListener('click', function(e) {
                    // In most mobile/sidebar layouts, we need to click to see sub-items
                    if (window.innerWidth < 1200 || this.getAttribute('href') === '#') {
                        if (this.nextElementSibling) {
                            e.preventDefault();
                            e.stopPropagation(); // Prevents the click from closing the menu immediately
                            this.parentNode.classList.toggle('dropdown-active');
                        }
                    }
                });
            });
        },

        // FIXED: Highlights the current section you are viewing
        scrollSpy: () => {
            const navLinks = document.querySelectorAll('#navmenu a');

            const spyAction = () => {
                const scrollPos = window.scrollY + 150; // Offset for better timing

                navLinks.forEach(link => {
                    if (!link.hash || link.hash === '#') return;

                    const section = document.querySelector(link.hash);
                    if (!section) return;

                    if (scrollPos >= section.offsetTop && scrollPos <= (section.offsetTop + section.offsetHeight)) {

                        // 1. Remove 'active' from links to clear previous highlight
                        document.querySelectorAll('#navmenu a.active').forEach(el => el.classList.remove('active'));
                        link.classList.add('active');

                        // 2. Highlight parent <li> for styling, but do NOT touch 'dropdown-active'
                        // This allows the submenu to stay expanded while highlighting your position
                        document.querySelectorAll('#navmenu li.active').forEach(el => el.classList.remove('active'));
                        const parentLi = link.closest('li');
                        if (parentLi) parentLi.classList.add('active');
                    }
                });
            };

            window.addEventListener('load', spyAction);
            document.addEventListener('scroll', spyAction, { passive: true });
        }
    };


    /**
     * --- MODULE: COMPONENTS ---
     */
    const Components = {
        skillBars: () => {
            const progressBars = document.querySelectorAll('.progress-bar');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const value = entry.target.getAttribute('aria-valuenow');
                        entry.target.style.width = value + '%';
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.5 });
            progressBars.forEach(bar => observer.observe(bar));
        },

        initIsotope: () => {
            const container = document.querySelector('.isotope-container');
            if (container) {
                const iso = new Isotope(container, { itemSelector: '.isotope-item', layoutMode: 'masonry', filter: '*' });
                document.querySelectorAll('.portfolio-filters li').forEach(filterBtn => {
                    filterBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        document.querySelector('.filter-active').classList.remove('filter-active');
                        this.classList.add('filter-active');
                        iso.arrange({ filter: this.getAttribute('data-filter') });
                        if (typeof AOS !== 'undefined') AOS.refresh();
                    });
                });
            }
        },

        publicationCounts: () => {
            document.querySelectorAll('.resume-category-group').forEach(group => {
                const countSpan = group.querySelector('.category-count');
                const items = group.querySelectorAll('.resume-item');
                if (countSpan) countSpan.textContent = items.length;
            });
        },

        detailsToggle: () => {
            document.querySelectorAll('.details-box').forEach((detail) => {
                detail.addEventListener('toggle', () => {
                    const summary = detail.querySelector('summary');
                    summary.innerHTML = detail.open
                        ? '<i class="bi bi-eye-slash me-1"></i> View Less'
                        : '<i class="bi bi-eye me-1"></i> More Details';
                    if (typeof AOS !== 'undefined') AOS.refresh();
                });
            });
        }
    };

    /**
     * --- MODULE: THIRD PARTY PLUGINS ---
     */
    const Plugins = {
        init: function() {
            this.aos();
            this.glightbox();
            this.pureCounter();
        },
        aos: () => {
            AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
        },
        glightbox: () => GLightbox({ selector: '.glightbox' }),
        pureCounter: () => new PureCounter()
    };

    /**
     * --- MODULE: CV MODE & DYNAMIC LOAD ---
     */
    async function changeCVMode(mode) {
        const standard = document.getElementById('standard-page-section');
        const onePage = document.getElementById('one-page-section');
        if (!standard || !onePage) return;

        const isOnePage = mode === 'one-page';
        standard.style.display = isOnePage ? 'none' : 'block';
        onePage.style.display = isOnePage ? 'block' : 'none';

        document.body.className = isOnePage ? 'mode-one-page' : 'mode-standard';

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('mode', mode);
        window.history.pushState({}, '', url);

        // Re-render site components from site-loader.js
        if (typeof SITE_DATA !== 'undefined' && typeof renderNavigation === "function") {
            const menuToRender = (typeof getMenuToRender === "function") ? getMenuToRender(MAIN_MENU_PAGES) : null;
            renderNavigation({ main_menu: menuToRender });
            Navigation.init(); // Re-bind behavior
        }
    }

    /**
     * --- GLOBAL EXPOSURE (For HTML event triggers) ---
     */
    window.handleCopyAction = (btn, type) => {
        const text = btn.getAttribute('data-citation');
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i class="bi bi-check2-all me-1"></i> ${type} Copied`;
            btn.style.setProperty('background-color', '#dc3545', 'important');
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.removeProperty('background-color');
            }, 2000);
        });
    };

    window.initTypedAnimation = () => {
        const selectTyped = document.querySelector('.typed');
        if (selectTyped) {
            let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
            new Typed('.typed', {
                strings: typed_strings,
                loop: true,
                typeSpeed: 60,
                backSpeed: 30,
                backDelay: 2500,
                contentType: 'html'
            });
        }
    };

    /**
     * --- APP INITIALIZATION ---
     */
    document.addEventListener('DOMContentLoaded', () => {
        UI.preloader();
        UI.scrollTopButton();
        UI.smoothScroll(0); // Set offset if header is fixed (e.g., 80)

        Navigation.init();

        Components.skillBars();
        Components.publicationCounts();
        Components.detailsToggle();

        Plugins.init();

        // Handle CV Mode Selector
        const selector = document.getElementById('cvModeSelector');
        if (selector) {
            const initialMode = new URLSearchParams(window.location.search).get('mode') || 'standard';
            selector.value = initialMode;
            selector.addEventListener('change', (e) => changeCVMode(e.target.value));
            changeCVMode(initialMode);
        }
    });

    window.addEventListener('load', Components.initIsotope);

})();