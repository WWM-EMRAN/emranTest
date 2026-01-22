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

                    // Change URL hash or section id display option
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

        // const runScrollSpy = () => {
        //     // 1. Position calculation with adjusted offset
        //     const position = window.scrollY + (headerOffset + 20);
        //     // const position = window.scrollY + (headerOffset + 0);
        //     let bestMatchLink = null;
        //
        //     navLinks.forEach(link => {
        //         if (!link.hash || link.hash === '#' || link.hash === '#all_cv_wrapper' || link.hash === '#hero' || link.hash === '#details-sticky-bar') return;
        //         const section = document.querySelector(link.hash);
        //
        //         if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        //             if (!bestMatchLink || section.offsetTop >= document.querySelector(bestMatchLink.hash).offsetTop) {
        //                 bestMatchLink = link;
        //             }
        //         }
        //     });
        //
        //     // 2. THE FIX: Corrected Fallback for the First Link
        //     // If no specific section matches, or if we are at the very top (scrollY < 100), select Home
        //     if (!bestMatchLink || window.scrollY < 100) {
        //         bestMatchLink = document.querySelector('#navmenu a[href="#hero"]')
        //                         // || document.querySelector('#navmenu a[href="#all_cv_wrapper"]')
        //                         || document.querySelector('#navmenu a[href="#all_cv_section"]')
        //                         || document.querySelector('#navmenu a[href="#all_details_section"]')
        //                         || document.querySelector('#navmenu a[href="#details-sticky-bar"]')
        //                         || document.querySelector('#navmenu a[href="#"]');
        //     }
        //
        //     // 3. Force Update on Initial Load
        //     if (bestMatchLink) {
        //         const alreadyActive = bestMatchLink.classList.contains('active');
        //         const anyActive = document.querySelector('#navmenu a.active');
        //
        //         // Update if the current best match isn't active, OR if nothing is active yet
        //         if (!alreadyActive || !anyActive) {
        //             document.querySelectorAll('#navmenu a.active, #navmenu li.active').forEach(el => {
        //                 el.classList.remove('active', 'dropdown-active');
        //             });
        //
        //             bestMatchLink.classList.add('active');
        //
        //             // Traverse up for dropdown highlighting
        //             let parent = bestMatchLink.parentElement;
        //             while (parent && parent.tagName !== 'NAV') {
        //                 if (parent.tagName === 'LI') {
        //                     parent.classList.add('active');
        //                     if (parent.classList.contains('dropdown')) parent.classList.add('dropdown-active');
        //                 }
        //                 parent = parent.parentElement;
        //             }
        //
        //             // Sync Sticky Header & URL
        //             const sectionId = bestMatchLink.hash.replace('#', '');
        //             if (typeof SiteSection !== 'undefined' && SiteSection.render_sticky_header) {
        //                 SiteSection.render_sticky_header(sectionId);
        //             }
        //
        //             // Change this part in your scripts.js
        //             if (window.location.hash !== bestMatchLink.hash) {
        //                 const isHome = bestMatchLink.hash === '#hero' || bestMatchLink.hash === '#all_cv_section' || bestMatchLink.hash === '#all_details_section';
        //
        //                 if (isHome) {
        //                     // THE FIX: Use pathname + search to keep the parameters (e.g., ?type=standard)
        //                     const newUrl = window.location.pathname + window.location.search;
        //                     history.replaceState(null, null, newUrl);
        //                 } else {
        //                     // For other sections, keep the parameters and add the hash
        //                     const newUrl = window.location.pathname + window.location.search + bestMatchLink.hash;
        //                     history.replaceState(null, null, newUrl);
        //                 }
        //             }
        //         }
        //         else {
        //             ;
        //         }
        //     }
        //     // else {
        //     //     bestMatchLink.classList.add('active');
        //     // }
        // };


        const runScrollSpy = () => {
            // 1. Position calculation
            const position = window.scrollY + (headerOffset + 20);
            let bestMatchLink = null;

            // --- FIX SEGMENT 1: EXCLUSION ---
            // We ignore the large wrappers during the search loop so they don't fight with content
            navLinks.forEach(link => {
                const hash = link.hash;
                // if (!hash || hash === '#' || hash === '#all_cv_section' || hash === '#all_details_section' || hash === '#hero' || hash === '#details-sticky-bar') return;
                if (!hash || hash === '#' || hash === '#all_cv_wrapper' || hash === '#details-sticky-bar') return;

                const section = document.querySelector(hash);

                if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    // Priority: Always pick the section furthest down the page
                    if (!bestMatchLink || section.offsetTop >= document.querySelector(bestMatchLink.hash).offsetTop) {
                        bestMatchLink = link;
                    }
                }
            });
            console.log('111======> best link selected', bestMatchLink);

            // --- FIX SEGMENT 2: FALLBACK PRIORITY ---
            // Only if NO specific section matches, we default to the Home link
            if (!bestMatchLink || window.scrollY < 100) {
                bestMatchLink = document.querySelector('#navmenu a[href="#hero"]')
                                || document.querySelector('#navmenu a[href="#all_cv_section"]')
                                || document.querySelector('#navmenu a[href="#all_details_section"]')
                                || document.querySelector('#navmenu a[href="#details-sticky-bar"]')
                                || document.querySelector('#navmenu a[href="#"]');
            }
            console.log('222======> best link selected after default link setting', bestMatchLink);

            // 3. Force Update on Initial Load
            if (bestMatchLink) {
                const alreadyActive = bestMatchLink.classList.contains('active');
                const anyActive = document.querySelector('#navmenu a.active');

                console.log('333======> best link selected | already active | anyActive', bestMatchLink, alreadyActive, anyActive);

                // --- FIX SEGMENT 3: THE GUARD ---
                // This ensures the DOM is ONLY updated if the section has actually changed
                if (!alreadyActive || !anyActive) {
                    document.querySelectorAll('#navmenu a.active, #navmenu li.active').forEach(el => {
                        el.classList.remove('active', 'dropdown-active');
                    });

                    bestMatchLink.classList.add('active');

                    let parent = bestMatchLink.parentElement;
                    while (parent && parent.tagName !== 'NAV') {
                        if (parent.tagName === 'LI') {
                            parent.classList.add('active');
                            if (parent.classList.contains('dropdown')) parent.classList.add('dropdown-active');
                        }
                        parent = parent.parentElement;
                    }

                    console.log('444======> best link set active now or the parent of the dropdown', bestMatchLink, parent);

                    // Sync Sticky Header
                    const sectionId = bestMatchLink.hash.replace('#', '');
                    if (typeof SiteSection !== 'undefined' && SiteSection.render_sticky_header) {
                        SiteSection.render_sticky_header(sectionId);
                    }

                    // Sync URL while preserving parameters
                    if (window.location.hash !== bestMatchLink.hash) {
                        console.log('555======> best link matches in browser url:', window.location.hash !== bestMatchLink.hash, window.location.hash, bestMatchLink.hash);
                        const isHome = bestMatchLink.hash === '' ||
                                       bestMatchLink.hash === '#hero' ||
                                       bestMatchLink.hash === '#all_cv_section' ||
                                       bestMatchLink.hash === '#all_details_section' ||
                                       bestMatchLink.hash === '' ||
                                       bestMatchLink.hash === '#';

                        const searchParams = window.location.search;
                        const path = window.location.pathname;

                        console.log('555.1======> best link is home or not:', isHome);

                        if (isHome) {
                            history.replaceState(null, null, path + searchParams);
                        } else {
                            history.replaceState(null, null, path + searchParams + bestMatchLink.hash);
                        }
                    }
                    else {
                        console.log('555.2======> best link matches in browser url:', window.location.hash !== bestMatchLink.hash);
                    }
                }
                else {
                    const searchParams = window.location.search;
                    const path = window.location.pathname;
                    history.replaceState(null, null, path + searchParams);
                    console.log('666======> best link is already active | there is another active link found');
                }
            }
            else {
                console.log('777======> best link not found', bestMatchLink);
            }
        };

        window.addEventListener('scroll', runScrollSpy);
        setTimeout(runScrollSpy, 150); // Small delay allows browser to finish layout
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