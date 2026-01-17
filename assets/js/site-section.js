const SiteSection = {
    init(section) {
        console.log(`Section Details Page initializing with section: '${section}'...`);

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_section_details(section);


        console.log("Section Details Page synchronization complete.");
    },

   async render_all_section_details(section){
      try {

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_details_sections(section);

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in Section Details page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
   },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_details_sections(section) {
        try {
            // Call each section individually
            // --- 1. HEADER & IDENTITY ---
            this.render_sticky_header(section);
            // this.render_about();
            //
            // // --- 2. METRICS & STATS ---
            // this.render_key_information();
            //
            // // --- 3. RESUME / TIMELINES ---
            // this.render_academic_information();
            // this.render_professional_experiences();
            //
            // // --- 4. EXPERTISE & SKILLS ---
            // this.render_expertise_skills_achievements();
            // this.render_skills_tools();
            // this.render_honors_awards();
            // this.render_courses_trainings_certificates();
            //
            // // --- 5. RESEARCH & PROJECTS ---
            // this.render_projects();
            // this.render_organisational_memberships();
            // this.render_sessions_events();
            // this.render_languages();
            // this.render_portfolios();
            // this.render_volunteering_services();
            // this.render_publications();
            //
            // // --- 6. CONTACT & FOOTER ---
            // this.render_contact_details();
            //
            // // --- 7. FOOTER ---
            // this.render_footer();

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
    }


};
