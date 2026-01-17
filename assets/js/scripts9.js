/**
 * Emran Ali - Website Core Logic
 * Unified & Clean Refactor: January 2026
 */

(function () {
    "use strict";

    /**
     * --- 1. UI UTILITIES ---
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
        }
    };


    /**
     * --- 1. NAVIGATION & SCROLLSPY ---
     */
    function initNavigationBehavior() {
        const body = document.querySelector('body');
        const headerToggleBtn = document.querySelector('.header-toggle');
        const navLinks = document.querySelectorAll('#navmenu a');

        // --- THE FIX: Dynamic Offset Calculation ---
        const stickyBar = document.querySelector('.cv-sticky-bar');
        const headerOffset = stickyBar ? 85 : 0; // 85px for CV, 20px for Index

        // Mobile Toggle
        if (headerToggleBtn) {
            headerToggleBtn.replaceWith(headerToggleBtn.cloneNode(true));
            const newToggleBtn = document.querySelector('.header-toggle');
            newToggleBtn.addEventListener('click', function() {
                body.classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        }

        // Click Handler: Dropdowns vs Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const parentLi = this.parentElement;
                const hasSubmenu = parentLi.classList.contains('dropdown');

                if (hasSubmenu && (window.innerWidth < 1200 || this.getAttribute('href') === '#')) {
                    e.preventDefault();
                    e.stopPropagation();

                    document.querySelectorAll('.navmenu .dropdown').forEach(other => {
                        if (other !== parentLi) other.classList.remove('active', 'dropdown-active');
                    });

                    parentLi.classList.toggle('active');
                    parentLi.classList.toggle('dropdown-active');
                } else {
                    const targetId = this.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const target = document.querySelector(targetId);
                        if (target) {
                            e.preventDefault();
                            // Use the dynamic offset calculated above
                            window.scrollTo({
                                top: target.offsetTop - headerOffset,
                                behavior: "smooth"
                            });
                        }
                    }

                    /// Change URL hash or section id display option
                    // const targetId = this.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const target = document.querySelector(targetId);

                        // Check if target exists to prevent errors
                        if (target) {
                            e.preventDefault();

                            // 1. Logic Fix: Compare the string targetId, not the object target
                            if (targetId === "#hero") {
                                // Removes hash when clicking home/hero
                                history.pushState(null, null, window.location.pathname);
                            } else {
                                // Update URL hash for all other sections
                                history.pushState(null, null, targetId);
                            }

                            // 2. Execute the scroll
                            window.scrollTo({
                                top: target.offsetTop - headerOffset,
                                behavior: "smooth"
                            });
                        } else {
                            console.warn(`Target section ${targetId} not found on this page.`);
                        }
                    }

                    if (body.classList.contains('mobile-nav-active')) {
                        body.classList.remove('mobile-nav-active');
                        const toggleBtn = document.querySelector('.header-toggle');
                        if (toggleBtn) { toggleBtn.classList.add('bi-list'); toggleBtn.classList.remove('bi-x'); }
                    }
                }
            });
        });

        const runScrollSpy = () => {
            // Offset calculation remains dynamic
            const position = window.scrollY + (headerOffset + 20);
            let bestMatchLink = null;

            // 1. First, find the MOST SPECIFIC section in view
            navLinks.forEach(link => {
                // console.log('=======>Link hash:', link.hash);
                if (!link.hash || link.hash === '#' || link.hash === '#all_cv_wrapper') return;
                // if (link.hash === '#' || link.hash === '#all_cv_wrapper') return;
                // console.log('--------->Link hash:', link.hash);
                const section = document.querySelector(link.hash);

                if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    // Priority: If a section is further down (higher offsetTop), it's more specific
                    if (!bestMatchLink || section.offsetTop >= document.querySelector(bestMatchLink.hash).offsetTop) {
                        bestMatchLink = link;
                    }
                }
            });

            // 2. Fallback: If no sub-section matches, check if we are in the 'Home' area
            if (!bestMatchLink && position < 600) {
                bestMatchLink = document.querySelector('#navmenu a[href="#hero"]') ||
                                document.querySelector('#navmenu a[href="#all-cv-wrapper"]');
            }

            // 3. One single DOM update only if the section actually changed
            if (bestMatchLink && !bestMatchLink.classList.contains('active')) {
                // Clear all active states once
                document.querySelectorAll('#navmenu a.active, #navmenu li.active').forEach(el => {
                    el.classList.remove('active', 'dropdown-active');
                });

                // Apply new active state to link and its parent tree
                bestMatchLink.classList.add('active');
                let parent = bestMatchLink.parentElement;
                while (parent && parent.tagName !== 'NAV') {
                    if (parent.tagName === 'LI') {
                        parent.classList.add('active');
                        if (parent.classList.contains('dropdown')) parent.classList.add('dropdown-active');
                    }
                    parent = parent.parentElement;
                }

                // 4. Sync the Sticky Header
                const sectionId = bestMatchLink.hash.replace('#', '');
                if (typeof SiteSection !== 'undefined' && SiteSection.render_sticky_header) {
                    SiteSection.render_sticky_header(sectionId);
                }

                // 5. Update URL Hash
                if (window.location.hash !== bestMatchLink.hash) {
                    const isHome = bestMatchLink.hash === '#hero' || bestMatchLink.hash === '#all-cv-wrapper';
                    history.replaceState(null, null, isHome ? window.location.pathname : bestMatchLink.hash);
                }
            }
        };

        window.addEventListener('scroll', runScrollSpy);
        runScrollSpy();
    }

    /**
     * --- 3. GLOBAL ACTIONS ---
     */
    window.handleCopyAction = (btn, type) => {
        const text = btn.getAttribute('data-citation');
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i class="bi bi-check2-all me-1"></i> ${type} Copied`;
            btn.style.setProperty('background-color', '#ff0000', 'important'); // Green success color
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.removeProperty('background-color');
            }, 2000);
        });
    };

    /**
     * --- 4. EXTERNAL INITIALIZERS ---
     */
    window.initExternalLibraries = () => {
        initNavigationBehavior(); // Setup all nav logic

        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 600, easing: 'ease-in-out', once: true });
            AOS.refresh();
        }

        if (typeof PureCounter !== 'undefined') new PureCounter();

        // GLightbox
        if (typeof GLightbox !== 'undefined') GLightbox({selector: '.glightbox'});

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
    };

    /**
     * Skill Bars Logic
     */
    window.initSkillBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const value = bar.getAttribute('aria-valuenow');
                    bar.style.width = value + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        progressBars.forEach(bar => observer.observe(bar));
    };

    /**
     * --- 5. LIFECYCLE HOOKS ---
     */
    document.addEventListener('DOMContentLoaded', () => {
        UI.preloader();
        UI.scrollTopButton();
    });

    window.hide_preloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => { preloader.style.display = "none"; }, 600);
        }
    };

    // Expose Navigation behavior to global window for dynamic loaders
    window.initNavigationBehavior = initNavigationBehavior;

})();