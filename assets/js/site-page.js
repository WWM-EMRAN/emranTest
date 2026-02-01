const SitePage = {
    init(page) {
        console.log(`Details Page initializing with section: '${page}'...`);

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_page_details(page);


        console.log("Details Page synchronization complete.");
    },

   async render_all_page_details(page){
      try {

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_details_pages(page);

        // --- THE FIX: Hide preloader once finished ---
        window.hide_preloader();
      }
      catch (error) {
          console.error("Render Error in Section Details page:", error);
          window.hide_preloader(); // Hide anyway to stop the hang
      }
   },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_details_pages(page) {
        try {
            // Call each section individually
            // --- 1. HEADER & IDENTITY ---
            this.render_sticky_header(page);

            // // Main page content
            // if (page === 'ea_logo'){
            //    this._render_ea_logo();
            // }
            // else if (page === 'copyright'){
            //    this._render_copyright();
            // }
            // else if (page === 'diary'){
            //    this._render_diary();
            // }
            // else if (page === 'gallery'){
            //    this._render_gallery();
            // }
            // else{
            //     console.error(`Invalid page type: ${page}`);
            // }

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
    },


    /**
     * Dynamically updates the sticky bar based on the active section using site.json data.
     * @param {string} section - The ID of the active section (e.g., 'about').
     */
    render_sticky_header(section) {
        // 1. Configuration: Mapping section IDs to icons and names
        const site = SiteCore.get('site');
        if (!site || !site.navigation || !site.navigation.main_menu) return;

        // Search for the matching section in navigation data
        const targetUrl = `#${section}`;
        let foundItem = null;

        // Iterate through main menu and submenus to find the config
        site.navigation.main_menu.forEach(item => {
            if (item.url === targetUrl) {
                foundItem = item;
            }
            else if (item.is_dropdown && item.submenu) {
                const sub = item.submenu.find(s => s.url === targetUrl);
                if (sub) foundItem = sub;
            }
        });

        if (!foundItem) return;

        // Map JSON data to the config variable used in your logic
        const config = {
            title: foundItem.label,
            icon: foundItem.icon_class // e.g., "bi bi-person" or "bx bx-home"
        };

        // 2. Identify the header elements in the sticky bar
        const stickyHeader = document.querySelector('.section-detail-header');
        if (!stickyHeader) return;

        const icon = stickyHeader.querySelector('i');

        // 3. Update the Icon classes
        if (icon) {
            // Clear old classes and apply the new classes from JSON
            icon.className = '';

            // Determine prefix (bi or bx) if not already explicitly handled in icon_class
            const prefix = config.icon.includes('bx') ? 'bx' : 'bi';
            icon.className = `${config.icon} me-2`; // Uses the full class string from JSON
        }

        // 4. Update the Text
        // We clear everything except the icon and append the new title
        stickyHeader.innerHTML = '';
        if (icon) stickyHeader.appendChild(icon);
        stickyHeader.appendChild(document.createTextNode(config.title));
    },
};
