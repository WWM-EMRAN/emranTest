(function () {
    "use strict";

    /**
     * 1. Preloader Fade-out
     */
    window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            setTimeout(() => {
                preloader.style.transition = "opacity 0.6s ease";
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                }, 600);
            }, 1000);
        }
    });

    // /**
    //  * 2. Mobile Navigation Toggle Logic
    //  */
    // const headerToggleBtn = document.querySelector('.header-toggle');
    // const header = document.querySelector('#header');
    //
    // function toggleMobileMenu() {
    //   if (header && headerToggleBtn) {
    //     header.classList.toggle('header-show');
    //     headerToggleBtn.classList.toggle('bi-list');
    //     headerToggleBtn.classList.toggle('bi-x');
    //   }
    // }
    //
    // if (headerToggleBtn) {
    //   headerToggleBtn.addEventListener('click', toggleMobileMenu);
    // }

    /**
     * Mobile Navigation Logic
     */
    const headerToggleBtn = document.querySelector('.header-toggle');
    const bodyElement = document.querySelector('body');

    function toggleMobileNav() {
        // Toggle the active class on the body
        bodyElement.classList.toggle('mobile-nav-active');

        // Swap icons
        headerToggleBtn.classList.toggle('bi-list');
        headerToggleBtn.classList.toggle('bi-x');
    }

    if (headerToggleBtn) {
        headerToggleBtn.addEventListener('click', toggleMobileNav);
    }

    /**
     * Automatically close menu when clicking a navigation link
     * (Essential for same-page anchors like #about)
     */
    document.querySelectorAll('#navmenu a').forEach(navItem => {
        navItem.addEventListener('click', () => {
            if (bodyElement.classList.contains('mobile-nav-active')) {
                toggleMobileNav();
            }
        });
    });

    /**
     * 3. Scroll to Top Button Logic
     */
    const scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
        if (scrollTop) {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
    }

    if (scrollTop) {
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    /**
     * 4. Dropdown Toggle Logic
     * 4. Dropdown Toggle Logic (Wrapped for Re-initialization)
     */

    function initDropdowns() {
        document.querySelectorAll('.navmenu .dropdown > a').forEach(dropdownLink => {
            // Remove existing listener to prevent double-firing
            dropdownLink.removeEventListener('click', dropdownToggleHandler);
            dropdownLink.addEventListener('click', dropdownToggleHandler);
        });
    }

    function dropdownToggleHandler(e) {
        const header = document.querySelector('#header');
        if (header.classList.contains('header-show') || window.innerWidth > 1199) {
            if (this.nextElementSibling) {
                e.preventDefault();
                this.parentNode.classList.toggle('dropdown-active');
            }
        }
    }

    // 3. Initial call for static HTML (if any)
    // window.initDropdowns = initDropdowns;
    document.addEventListener('DOMContentLoaded', initDropdowns);

    /**
     * 5. Navmenu Scroll Spy
     * 5. Navmenu Scroll Spy & Active Link Logic
     */
    function initNavScrollSpy() {
        const navmenulinks = document.querySelectorAll('#navmenu a');

        function navmenuScrollspy() {
            const links = document.querySelectorAll('#navmenu a');
            links.forEach(link => {
                if (!link.hash || link.hash === '#') return;
                const section = document.querySelector(link.hash); // or getElementById
                if (!section) return;
                // if (!link.hash || link.hash === '#') return;
                // if (link.closest('.dropdown')) return;

                // console.log('======>> initNavScrollSpy, navmenuScrollspy', link.hash, window.scrollY, section.offsetTop, section.offsetHeight);
                const header = document.querySelector('#header');
                const headerOffset = header ? header.offsetHeight : 0;
                // const position = window.scrollY + headerOffset + 5;

                // const position = window.scrollY + 200;
                const position = window.scrollY;
                if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    document.querySelectorAll('#navmenu a.active').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }

        // function navmenuScrollspy() {
        //   const links = document.querySelectorAll('#navmenu a');
        //
        //   // A threshold of 150px ensures the link changes when the title is
        //   // clearly visible, not just touching the top edge.
        //   const threshold = 150;
        //   const position = window.scrollY + threshold;
        //
        //   links.forEach(link => {
        //     if (!link.hash || link.hash === '#') return;
        //     const section = document.querySelector(link.hash);
        //     if (!section) return;
        //
        //     // Check if the current scroll position falls within the section boundaries
        //     if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        //        // Remove active class from all links first
        //        document.querySelectorAll('#navmenu a.active').forEach(a => a.classList.remove('active'));
        //        link.classList.add('active');
        //     }
        //   });
        // }

        // Bind to scroll and load
        window.initNavScrollSpy = initNavScrollSpy;
        window.addEventListener('load', navmenuScrollspy);
        document.addEventListener('scroll', navmenuScrollspy);

        // Also run once immediately to highlight the current section
        navmenuScrollspy();
    };


    // In scripts.js
    window.initSkillBars = function () {
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
    };


    /**
     * 6. Initialize AOS and Typed.js
     */
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true
        });
    }

    window.addEventListener('load', aosInit);

    // /**
    //  * 7. Typed.js Animation Initialization
    //  */
    // const selectTyped = document.querySelector('.typed');
    // if (selectTyped) {
    //   let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
    //   new Typed('.typed', {
    //     strings: typed_strings,
    //     loop: true,
    //     typeSpeed: 100,
    //     backSpeed: 50,
    //     backDelay: 2000
    //   });
    // }

    /**
     * 7. Typed.js Animation Initialization (Improved)
     */
    function initTypedAnimation() {
        const selectTyped = document.querySelector('.typed');
        if (selectTyped) {
            // Get the items from the data attribute set by site-loader.js
            let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');

            new Typed('.typed', {
                strings: typed_strings,
                loop: true,
                typeSpeed: 60,      // Slower typing (Default was 100, lower is faster)
                backSpeed: 30,      // Slower erasing
                backDelay: 2500,    // Pause longer at the end of a sentence
                startDelay: 500,    // Slight delay before starting
                contentType: 'html' // CRITICAL: Interprets <i> tags as HTML, not text
            });
        }
    }

    /**
     * 8. Init GLightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

    /**
     * 9. Animation on scroll (AOS) - Double check it's active
     */
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    window.addEventListener('load', aosInit);

    /**
     * 10. PureCounter Initialization for Key Information
     */
    new PureCounter();


    /**
     * 11. Smooth Transitions for Details/Education
     * Prevents layout shifts and ensures AOS recalculates positions
     */
    document.querySelectorAll('details').forEach((el) => {
        el.addEventListener('toggle', () => {
            // Refresh AOS to prevent animations from triggering at wrong scroll positions
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });


    /**
     * 12. Smooth Animation for Skills progress bars
     * Prevents layout shifts and ensures AOS recalculates positions
     */
    document.addEventListener('DOMContentLoaded', function () {
        const progressBars = document.querySelectorAll('.progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get the percentage from the aria-valuenow attribute
                    const value = entry.target.getAttribute('aria-valuenow');
                    // Apply the width and a class to signify it's done
                    entry.target.style.width = value + '%';
                    entry.target.classList.add('animated');
                }
            });
        }, {threshold: 0.5}); // Trigger when 50% of the bar is visible

        progressBars.forEach(bar => observer.observe(bar));
    });


    /**
     * 13. Courses and Certificates Isotope Filtering
     */
    window.addEventListener('load', () => {
        let portfolioContainer = document.querySelector('.isotope-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.isotope-item',
                layoutMode: 'masonry',
                filter: '*' // Initial filter (show all)
            });

            let portfolioFilters = document.querySelectorAll('.portfolio-filters li');

            portfolioFilters.forEach(el => {
                el.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Remove active class from other buttons
                    portfolioFilters.forEach(filterEl => {
                        filterEl.classList.remove('filter-active');
                    });

                    // Add active class to clicked button
                    this.classList.add('filter-active');

                    // Trigger Isotope filtering
                    portfolioIsotope.arrange({
                        filter: this.getAttribute('data-filter')
                    });

                    // Re-trigger AOS animations if used
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, false);
            });
        }
    });

    /**
     * 14. Publications Management
     * Dynamically calculates counts and handles citation copying
     */
    document.addEventListener('DOMContentLoaded', function () {
        // Calculate counts for each publication category
        document.querySelectorAll('.resume-category-group').forEach(group => {
            const countSpan = group.querySelector('.category-count');
            if (countSpan) {
                const items = group.querySelectorAll('.resume-item');
                countSpan.textContent = items.length;
            }
        });

        // Handle "Copy Citation" button clicks
        document.querySelectorAll('.citation-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const text = this.getAttribute('data-citation');
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="bi bi-check2 me-1"></i> Copied!';
                    this.classList.replace('badge-dates', 'badge-important');
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.replace('badge-important', 'badge-dates');
                    }, 2000);
                });
            });
        });
    });


    /* ------------------------------------------------------------
       * STEP 1: Click → Active state sync
       * ---------------------------------------------------------- */
    function initNavClickSync() {
        const navLinks = document.querySelectorAll('#navmenu a.scrollto');

        navLinks.forEach(link => {
            link.addEventListener('click', function () {

                // Ignore invalid or non-section links
                if (!this.hash || this.hash === '#') return;
                if (this.closest('.dropdown')) return;

                // Remove all existing active states
                document.querySelectorAll('#navmenu a.active')
                    .forEach(a => a.classList.remove('active'));

                // Mark clicked link active immediately
                // this.classList.add('active');
                this.classList.add('active');
                link.addEventListener('click', function () {
                    if (!this.hash || this.hash === '#') return;
                    setNavActive(this);
                });
                // syncParentDropdownActive(this);

            });
        });
    }

    // function initNavClickSync() {
    //   const navLinks = document.querySelectorAll('#navmenu a.scrollto');
    //
    //   navLinks.forEach(link => {
    //     link.addEventListener('click', function () {
    //
    //       if (!this.hash || this.hash === '#') return;
    //
    //       // Let click immediately update state
    //       setNavActive(this);
    //     });
    //   });
    // }


    /* ------------------------------------------------------------
     * STEP 2: Reconcile scroll-spy (non-destructive)
     * ---------------------------------------------------------- */
    function reconcileNavActiveOnScroll() {
        const links = document.querySelectorAll('#navmenu a.scrollto');

        let currentSectionId = null;

        links.forEach(link => {
            if (!link.hash || link.hash === '#') return;

            const section = document.querySelector(link.hash);
            if (!section) return;

            const rect = section.getBoundingClientRect();

            // Section is considered active if its top is near viewport top
            if (rect.top <= 120 && rect.bottom > 120) {
                currentSectionId = link.hash;
            }
        });

        if (!currentSectionId) return;

        document.querySelectorAll('#navmenu a.active')
            .forEach(a => a.classList.remove('active'));

        const activeLink = document.querySelector(`#navmenu a[href="${currentSectionId}"]`);
        // if (activeLink) activeLink.classList.add('active');
        if (activeLink) {
            activeLink.classList.add('active');
            setNavActive(activeLink);
            // syncParentDropdownActive(activeLink);
        }

    }


    /**
     * 15. RE-INITIALIZE the menu is injected
     * Initialize Navigation menu/submenu behaviour
     */
    function initNavigationBehavior() {
        console.log("Initializing Navigation menu/submenu behavior...");
        // Call the function from scripts.js to bind clicks to the new elements
        if (typeof initDropdowns === "function") {
            console.log("Initializing dropdown behavior...");
            initDropdowns();
        } else {
            console.warn("Dropdown behavior initialization failed. Dropdowns will not work.");
        }

        if (typeof initNavScrollSpy === "function") {
            console.log("Initializing scrollspy behavior...");
            initNavScrollSpy();
        } else {
            console.warn("Scrollspy behavior initialization failed. Scrollspy will not work.");
        }

        if (typeof reconcileNavActiveOnScroll === "function") {
            console.log("Initializing reconcileNavActiveOnScroll behavior...");
            // Keep scroll authoritative
            document.addEventListener('scroll', reconcileNavActiveOnScroll, {passive: true});

            // Run once on load
            reconcileNavActiveOnScroll();
        } else {
            console.warn("ReconcileNavActiveOnScroll behavior initialization failed. ReconcileNavActiveOnScroll will not work.");
        }

        console.log("Navigation menu/submenu behavior initialized successfully.");
    }

    window.initNavigationBehavior = initNavigationBehavior;


    /* ------------------------------------------------------------
       * AUTO-INIT (after navigation is rendered)
       * ---------------------------------------------------------- */
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // setTimeout(initNavActiveBehavior, 0);
        setTimeout(initNavigationBehavior, 0);
    } else {
        // document.addEventListener('DOMContentLoaded', initNavActiveBehavior);
        document.addEventListener('DOMContentLoaded', initNavigationBehavior);
    }


    /**
     * 16. CV Mode Switching
     * Dynamically changes the CV layout based on the URL parameter
     */
        // CV mode change action
        // 1. Get elements
    const selector = document.getElementById('cvModeSelector');
    const standard = document.getElementById('standard-page-section');
    const onePage = document.getElementById('one-page-section');

    // Helper function to wait for SITE_DATA to be ready
    const waitForData = () => {
        return new Promise((resolve) => {
            if (typeof SITE_DATA !== 'undefined' && SITE_DATA.site) {
                resolve();
            } else {
                const interval = setInterval(() => {
                    if (typeof SITE_DATA !== 'undefined' && SITE_DATA.site) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 50); // Check every 50ms
            }
        });
    };

    // 2. The Toggle Engine
    async function changeCVMode(mode) {
        if (!standard || !onePage) return;

        console.log("Switching CV to:", mode);

        if (mode === 'one-page') {
            standard.style.display = 'none';
            onePage.style.display = 'block';
            document.body.classList.add('mode-one-page');
            document.body.classList.remove('mode-standard');
        } else if (mode === 'standard') {
            standard.style.display = 'block';
            onePage.style.display = 'none';
            document.body.classList.add('mode-standard');
            document.body.classList.remove('mode-one-page');
        } else {
            standard.style.display = 'block';
            onePage.style.display = 'none';
            document.body.classList.add('mode-standard');
            document.body.classList.remove('mode-one-page');
        }

        // Keep URL in sync (without reloading)
        const url = new URL(window.location);
        url.searchParams.set('mode', mode);
        window.history.pushState({}, '', url);

        // 3. WAIT for data before calling site-loader functions
        await waitForData();

        // Call functions from site-loader.js directly
        // Ensure these functions exist in site-loader.js
        if (typeof renderNavigation === "function") {
            console.log("Calling renderNavigation from site-loader.js...");
            const menuToRender = (typeof getMenuToRender === "function") ? getMenuToRender(MAIN_MENU_PAGES) : null;
            renderNavigation({main_menu: menuToRender});
        } else {
            console.warn("renderNavigation function not found in site-loader.js. CV Mode switching may not work as expected.");
        }

        // Initialize Navigation menu/submenu behaviour
        initNavigationBehavior()
    }

    // 3. Attach Listener to Dropdown
    if (selector) {
        selector.addEventListener('change', function (e) {
            changeCVMode(e.target.value);

        });
    }


    function clearNavActiveStates() {
        // Clear active on all links
        document.querySelectorAll('#navmenu a.active').forEach(a => a.classList.remove('active'));

        // Clear active on all menu <li> (needed for parent highlight)
        document.querySelectorAll('#navmenu li.active').forEach(li => li.classList.remove('active'));
    }

    function setNavActive(link) {
        if (!link) return;

        clearNavActiveStates();

        // Mark the actual link active
        link.classList.add('active');

        // If this link is inside a dropdown, mark the parent <li> active too
        const dropdownLi = link.closest('li.dropdown');
        if (dropdownLi) {
            dropdownLi.classList.add('active'); // <-- this matches CSS: li.active > a
        }
    }


    // 4. Initial Load Logic
    const params = new URLSearchParams(window.location.search);
    const initialMode = params.get('mode') || 'standard';

    if (selector) selector.value = initialMode;
    changeCVMode(initialMode);
    // Use a small timeout to ensure site-loader.js has finished rendering before toggling
    // setTimeout(() => changeCVMode(initialMode), 100);


    /**
     * Copies clean text and forces a background color change using !important.
     * @param {HTMLElement} btn - The button element.
     */
    function handleCopyAction(btn, type) {
        const text = btn.getAttribute('data-citation');

        navigator.clipboard.writeText(text).then(() => {
            // 1. Store original content and style
            const originalHtml = btn.innerHTML;

            // 2. Apply "Copied" state with forced red background
            // btn.innerHTML = '<i class="bi bi-check2-all me-1"></i> type Copied';
            btn.innerHTML = `<i class="bi bi-check2-all me-1"></i> ${type} Copied`;
            btn.style.setProperty('background-color', '#dc3545', 'important');
            btn.style.setProperty('background-image', 'none', 'important'); // Removes any gradients
            btn.style.setProperty('color', 'white', 'important');

            // 3. Revert to original CSS classes after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.removeProperty('background-color');
                btn.style.removeProperty('background-image');
                btn.style.removeProperty('color');
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }

    window.handleCopyAction = handleCopyAction;


    /**
     * Dynamic Details Toggle Text
     */
    document.querySelectorAll('.details-box').forEach((detail) => {
        detail.addEventListener('toggle', () => {
            const summary = detail.querySelector('summary');
            if (detail.open) {
                summary.innerHTML = '<i class="bi bi-eye-slash me-1"></i> View Less';
            } else {
                summary.innerHTML = '<i class="bi bi-eye me-1"></i> More Details';
            }
        });
    });


    /**
     * Smooth scroll for all internal links with offset calculation
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 0; // Adjust this based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


})();