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
                    window.scrollTo({top: 0, behavior: 'smooth'});
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
    // const Navigation = {
    //     init: function() {
    //         this.mobileToggle();
    //         this.initDropdowns();
    //         this.scrollSpy();
    //     },
    //
    //     // Handles the Mobile Burger Menu
    //     mobileToggle: () => {
    //         const toggleBtn = document.querySelector('.header-toggle');
    //         const body = document.querySelector('body');
    //         if (!toggleBtn) return;
    //
    //         const toggleAction = () => {
    //             body.classList.toggle('mobile-nav-active');
    //             toggleBtn.classList.toggle('bi-list');
    //             toggleBtn.classList.toggle('bi-x');
    //         };
    //
    //         toggleBtn.addEventListener('click', toggleAction);
    //     },
    //
    //     // Handles Submenu Expansion
    //     initDropdowns: () => {
    //         document.querySelectorAll('.navmenu .dropdown > a').forEach(link => {
    //             link.addEventListener('click', function(e) {
    //                 if (window.innerWidth < 1200 || this.getAttribute('href') === '#') {
    //                     if (this.nextElementSibling) {
    //                         e.preventDefault();
    //                         e.stopPropagation();
    //                         this.parentNode.classList.toggle('dropdown-active');
    //                     }
    //                 }
    //             });
    //         });
    //     },
    //
    //     /**
    //      * Enhanced Scroll Spy with Mother-Item Highlighting
    //      * If a submenu item is active, the parent 'mother' item highlights too.
    //      */
    //     scrollSpy: () => {
    //         const navLinks = document.querySelectorAll('#navmenu a');
    //
    //         const spyAction = () => {
    //             const scrollPos = window.scrollY + 150;
    //
    //             navLinks.forEach(link => {
    //                 if (!link.hash || link.hash === '#') return;
    //
    //                 const section = document.querySelector(link.hash);
    //                 if (!section) return;
    //
    //                 if (scrollPos >= section.offsetTop && scrollPos <= (section.offsetTop + section.offsetHeight)) {
    //
    //                     // 1. Clear ALL active states from links and list items first
    //                     document.querySelectorAll('#navmenu a.active').forEach(el => el.classList.remove('active'));
    //                     document.querySelectorAll('#navmenu li.active').forEach(el => el.classList.remove('active'));
    //
    //                     // 2. Add active class to the current link
    //                     link.classList.add('active');
    //
    //                     // 3. RECURSIVE HIGHLIGHTING: Find the parent <li> and mother items
    //                     // We go up the DOM tree and add .active to any parent list items
    //                     let parent = link.parentElement;
    //                     while (parent && parent.tagName !== 'NAV') {
    //                         if (parent.tagName === 'LI') {
    //                             parent.classList.add('active');
    //                         }
    //                         parent = parent.parentElement;
    //                     }
    //                 }
    //             });
    //         };
    //
    //         window.addEventListener('load', spyAction);
    //         document.addEventListener('scroll', spyAction, { passive: true });
    //     }
    // };


    /**
     * Unified Navigation Controller
     * Handles: Mobile Toggle, Dropdown Expansion, and Recursive ScrollSpy Highlighting.
     */
    function initNavigationBehavior() {
        console.log("Binding behaviors to dynamic navigation...");

        const body = document.querySelector('body');
        const headerToggleBtn = document.querySelector('.header-toggle');
        const navLinks = document.querySelectorAll('#navmenu a');

        // --- 1. MOBILE TOGGLE LOGIC (The Fix) ---
        if (headerToggleBtn) {
            // Remove old listener if any to prevent multiple triggers
            headerToggleBtn.replaceWith(headerToggleBtn.cloneNode(true));
            const newToggleBtn = document.querySelector('.header-toggle');

            newToggleBtn.addEventListener('click', function () {
                body.classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        }

        // --- 2. Dropdown Expansion Logic ---
        document.querySelectorAll('.navmenu .dropdown > a').forEach(link => {
            link.addEventListener('click', function (e) {
                if (window.innerWidth < 1200 || this.getAttribute('href') === '#') {
                    if (this.nextElementSibling) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.parentNode.classList.toggle('dropdown-active');
                    }
                }
            });
        });

        // --- 3. High-Precision Scroll Spy with Recursive Highlighting ---
        function runScrollSpy() {
            const position = window.scrollY + 150;
            navLinks.forEach(link => {
                if (!link.hash || link.hash === '#') return;
                const section = document.querySelector(link.hash);

                if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    document.querySelectorAll('#navmenu a.active').forEach(a => a.classList.remove('active'));
                    document.querySelectorAll('#navmenu li.active').forEach(li => li.classList.remove('active'));

                    link.classList.add('active');

                    let parent = link.parentElement;
                    while (parent && parent.tagName !== 'NAV') {
                        if (parent.tagName === 'LI') {
                            parent.classList.add('active');
                        }
                        parent = parent.parentElement;
                    }
                }
            });
        }

        window.addEventListener('scroll', runScrollSpy, {passive: true});
        runScrollSpy();

        // --- 4. Mobile Navigation Auto-Close on Link Click ---
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('mobile-nav-active')) {
                    body.classList.remove('mobile-nav-active');
                    const toggleBtn = document.querySelector('.header-toggle');
                    if (toggleBtn) {
                        toggleBtn.classList.add('bi-list');
                        toggleBtn.classList.remove('bi-x');
                    }
                }
            });
        });
    }

    window.initNavigationBehavior = initNavigationBehavior;

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
            }, {threshold: 0.5});
            progressBars.forEach(bar => observer.observe(bar));
        },

        initIsotope: () => {
            const container = document.querySelector('.isotope-container');
            if (container) {
                const iso = new Isotope(container, {itemSelector: '.isotope-item', layoutMode: 'masonry', filter: '*'});
                document.querySelectorAll('.portfolio-filters li').forEach(filterBtn => {
                    filterBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        document.querySelector('.filter-active').classList.remove('filter-active');
                        this.classList.add('filter-active');
                        iso.arrange({filter: this.getAttribute('data-filter')});
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
        init: function () {
            this.aos();
            this.glightbox();
            this.pureCounter();
        },
        aos: () => {
            AOS.init({duration: 600, easing: 'ease-in-out', once: true, mirror: false});
        },
        glightbox: () => GLightbox({selector: '.glightbox'}),
        pureCounter: () => new PureCounter()
    };


    /**
     * GLightbox Controller
     * Initializes the lightbox for images and galleries.
     */
    function initLightbox() {
        if (typeof GLightbox !== 'undefined') {
            const lightbox = GLightbox({
                selector: '.glightbox'
            });
        }
    }

    // Attach to window so loader can call it
    window.initLightbox = initLightbox;



    // *********************************************************************
    /**
     * Re-initialize UI Libraries
     */
    function initExternalLibraries() {

        // NOW call the navigation behavior once the HTML is ready
        if (window.initNavigationBehavior) window.initNavigationBehavior();
        if (window.initSkillBars) window.initSkillBars();
        if (window.initLightbox) window.initLightbox();

        // --- THE FIX: Refresh AOS so it "sees" the new dynamic elements ---
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
            AOS.refresh(); // Forces a re-calculation of all AOS elements
        }

        // Typed.js (Hero)
        const selectTyped = document.querySelector('.typed');
        if (selectTyped) {
            let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
            new Typed('.typed', {
                strings: typed_strings,
                loop: true,
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000
            });
        }

        // PureCounter (Stats)
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }
    }
    window.initExternalLibraries = initExternalLibraries;


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
            renderNavigation({main_menu: menuToRender});
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
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2500,
                contentType: 'html'
            });
        }
    };

    /**
     * --- APP INITIALIZATION ---
     */
    // document.addEventListener('DOMContentLoaded', () => {
    //     UI.preloader();
    //     UI.scrollTopButton();
    //     UI.smoothScroll(0); // Set offset if header is fixed (e.g., 80)
    //
    //     Navigation.init();
    //
    //     Components.skillBars();
    //     Components.publicationCounts();
    //     Components.detailsToggle();
    //
    //     Plugins.init();
    //
    //     // Handle CV Mode Selector
    //     const selector = document.getElementById('cvModeSelector');
    //     if (selector) {
    //         const initialMode = new URLSearchParams(window.location.search).get('mode') || 'standard';
    //         selector.value = initialMode;
    //         selector.addEventListener('change', (e) => changeCVMode(e.target.value));
    //         changeCVMode(initialMode);
    //     }
    // });
    // window.addEventListener('load', Components.initIsotope);

    /**
     * --- APP INITIALIZATION (STATIC ELEMENTS) ---
     * This handles things that are in the HTML file by default.
     */
    document.addEventListener('DOMContentLoaded', () => {
        UI.preloader();
        UI.scrollTopButton();

        // Note: Navigation initialization is now handled by site-loader.js
        // after the data-driven menu is injected.
    });

    /**
     * Isotope is unique because it needs images to be fully loaded
     */
    window.addEventListener('load', () => {
        if (typeof Components !== 'undefined' && Components.initIsotope) {
            Components.initIsotope();
        }
    });


    /**
     * Skills Animation Controller
     * Triggers progress bar growth when the section enters the viewport.
     */
    function initSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const value = bar.getAttribute('aria-valuenow');
                    bar.style.width = value + '%';
                    observer.unobserve(bar); // Only animate once
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            bar.style.width = '0%'; // Reset to 0 before animating
            observer.observe(bar);
        });
    }

    // Attach to window so site-index.js can call it
    window.initSkillBars = initSkillBars;


    /**
     * Re-initialize UI Libraries
     */
    function initExternalLibraries() {
        // // AOS (Animations)
        // if (typeof AOS !== 'undefined') {
        //     AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
        // }

        // --- THE FIX: Refresh AOS so it "sees" the new dynamic elements ---
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
            AOS.refresh(); // Forces a re-calculation of all AOS elements
        }

        // Typed.js (Hero)
        const selectTyped = document.querySelector('.typed');
        if (selectTyped) {
            let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
            new Typed('.typed', {
                strings: typed_strings,
                loop: true,
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000
            });
        }

        // PureCounter (Stats)
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }
    }
    window.initExternalLibraries = initExternalLibraries;


    function hide_preloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => { preloader.style.display = "none"; }, 600);
        }
    }
    window.hide_preloader = hide_preloader;


    /**
     * Navigation Dropdown Toggle Logic
     */
    document.querySelectorAll('.navmenu .dropdown > a').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        // 1. Check if the link is a parent of a sub-menu
        if (this.nextElementSibling && this.nextElementSibling.tagName === 'UL') {
          e.preventDefault(); // Stop the link from navigating if it's just a toggle

          // 2. Toggle the sub-menu visibility
          this.parentNode.classList.toggle('active');
          this.nextElementSibling.classList.toggle('dropdown-active');

          // --- THE FIX: Stop Propagation ---
          // This prevents the click from reaching the "close-menu" listener
          e.stopPropagation();
        }
      });
    });

    /**
     * Global Menu Close Logic
     */
    document.querySelectorAll('#navmenu a').forEach(link => {
      link.addEventListener('click', (e) => {
        // Only close the menu if the link is NOT a parent/toggle
        if (!link.parentElement.classList.contains('dropdown')) {
          if (header && header.classList.contains('header-show')) {
            toggleMobileMenu(); // Closes the menu
          }
        }
      });
    });

})();