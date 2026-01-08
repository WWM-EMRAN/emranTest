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


        /**
         * Enhanced Smooth Scroll
         * Set headerOffset to 85 to account for the .cv-sticky-bar
         */
        // smoothScroll: (headerOffset = 85) => {
        //     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        //         anchor.addEventListener('click', function (e) {
        //             const targetId = this.getAttribute('href');
        //             if (targetId === "#") return; // Skip empty hash links
        //
        //             const target = document.querySelector(targetId);
        //
        //             if (target) {
        //                 e.preventDefault();
        //
        //                 const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        //                 const offsetPosition = elementPosition - headerOffset;
        //
        //                 window.scrollTo({
        //                     top: offsetPosition,
        //                     behavior: "smooth"
        //                 });
        //
        //                 // Handle mobile navigation auto-close
        //                 if (document.body.classList.contains('mobile-nav-active')) {
        //                     document.body.classList.remove('mobile-nav-active');
        //                     const toggleBtn = document.querySelector('.header-toggle');
        //                     if (toggleBtn) {
        //                         toggleBtn.classList.add('bi-list');
        //                         toggleBtn.classList.remove('bi-x');
        //                     }
        //                 }
        //             }
        //         });
        //     });
        // }

        // scripts.js
        smoothScroll: (headerOffset = 0) => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                // Remove existing listeners to avoid duplicates if init is called multiple times
                anchor.replaceWith(anchor.cloneNode(true));
            });

            // Re-bind with fresh targets
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href'); // Gets the updated #hero or #all_cv_wrapper
                    const target = document.querySelector(targetId);

                    if (target) {
                        e.preventDefault();
                        const offsetPosition = target.offsetTop - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
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


    /**
     * Unified Navigation Controller
     */
    function initNavigationBehavior() {
        const body = document.querySelector('body');
        const header = document.querySelector('#header');
        const headerToggleBtn = document.querySelector('.header-toggle');
        const navLinks = document.querySelectorAll('#navmenu a');

        // 1. Reset Toggle Button (Prevents double-binding)
        if (headerToggleBtn) {
            headerToggleBtn.replaceWith(headerToggleBtn.cloneNode(true));
            const newToggleBtn = document.querySelector('.header-toggle');
            newToggleBtn.addEventListener('click', () => {
                body.classList.toggle('mobile-nav-active');
                newToggleBtn.classList.toggle('bi-list');
                newToggleBtn.classList.toggle('bi-x');
            });
        }

        // 2. Unified Click Handler for Links & Dropdowns
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const parentLi = this.parentElement;
                const hasSubmenu = parentLi.classList.contains('dropdown');

                if (hasSubmenu) {
                    // --- DROPDOWN LOGIC ---
                    // If it's a parent, toggle sub-menu and DO NOT close the sidebar
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle both classes used in your style.css
                    parentLi.classList.toggle('active');
                    parentLi.classList.toggle('dropdown-active');
                } else {
                    // --- TERMINAL LINK LOGIC ---
                    // Only close menu if it's a final destination link
                    if (body.classList.contains('mobile-nav-active')) {
                        body.classList.remove('mobile-nav-active');
                        const toggleBtn = document.querySelector('.header-toggle');
                        if (toggleBtn) {
                            toggleBtn.classList.add('bi-list');
                            toggleBtn.classList.remove('bi-x');
                        }
                    }
                }
            });
        });

        // 3. ScrollSpy (Remains unchanged but integrated here)
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
                        if (parent.tagName === 'LI') parent.classList.add('active');
                        parent = parent.parentElement;
                    }
                }
            });
        }
        window.addEventListener('scroll', runScrollSpy, {passive: true});
    }

})();