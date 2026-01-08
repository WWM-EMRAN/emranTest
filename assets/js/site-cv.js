/**
 * SiteCV - Curriculum Vitae Page Controller
 */
const SiteCV = {
    init(type) {
        console.log(`CV Initializing with '${type}' type...`);

        // 1. Hook the selector
        const selector = document.getElementById('cvTypeSelector');

        selector.value = type || 'standard';

         // 1. Force the <body> class to match the selected mode
        const body = document.querySelector('body');

        // 1.1. Remove ALL possible mode classes to ensure a clean state
        body.classList.remove('mode-standard', 'mode-one-page', 'mode-two-page', 'mode-detailed');

        // 1.2. Add the active mode class
        if (type === 'onePage') {
            body.classList.add('mode-one-page');
        } else {
            // Defaults to standard if type is 'standard', 'detailed', etc.
            body.classList.add('mode-standard');
        }

        // 2. Update the Selector UI
        // const selector = document.getElementById('cvTypeSelector');
        if (selector) {
            selector.value = type;
            // The listener you already have for window.location.href stays here...
           // Listen for changes and update URL
           selector.addEventListener('change', (e) => {
               const newType = e.target.value;
               window.location.href = `curriculum_vitae.html?type=${newType}`;
           });
        }

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_cv_type(type);


        console.log("CV Page synchronization complete.");
    },

   async render_all_cv_type(type){
      try {
            // Call each render contents for different CV type
            // CV types: standard, onePage, twoPage, detailed
            if (type === 'standard'){
                console.log("Rendering Standard CV...", type);
                SiteCV_Standard.init();
            }
            else if (type === 'onePage'){
                console.log("Rendering One-Page CV...", type);
                SiteCV_OnePage.init();
            }
            // else if (type === 'twoPage'){
            //     console.log("Rendering Two-Page CV...", type);
            //     SiteCV_TwoPage.init();
            // }
            // else if (type === 'detailed'){
            //     console.log("Rendering Details CV...", type);
            //     SiteCV_Details.init();
            // }
            else{
                console.error(`Invalid CV type: ${type}`);
            }

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in CV page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
   }
};



const SiteCV_Standard = {
    init() {
        console.log("Initializing all Standard CV Page modules...");

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        // this.render_all_standatdCV_sections();


        console.log("Standard CV Page synchronization complete.");
    },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_standatdCV_sections() {
        try {
            // Call each section individually
            // --- 1. HERO & IDENTITY ---
            this.render_hero();
            this.render_about();

            // --- 2. METRICS & STATS ---
            this.render_key_information();

            // --- 3. RESUME / TIMELINES ---
            this.render_academic_information();
            this.render_professional_experiences();

            // --- 4. EXPERTISE & SKILLS ---
            this.render_expertise_skills_achievements();
            this.render_skills_tools();
            this.render_honors_awards();
            this.render_courses_trainings_certificates();

            // --- 5. RESEARCH & PROJECTS ---
            this.render_projects();
            this.render_organisational_memberships();
            this.render_sessions_events();
            this.render_languages();
            this.render_portfolios();
            this.render_volunteering_services();
            this.render_publications();

            // --- 6. CONTACT & FOOTER ---
            this.render_contact_details();

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
    }
};



const SiteCV_OnePage = {
    init() {
        console.log("Initializing all One-Page CV Page modules...");

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        // this.render_all_onePageCV_sections();


        console.log("One-Page CV Page synchronization complete.");
    },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_onePageCV_sections() {
        try {
            // Call each section individually
            // --- 1. HERO & IDENTITY ---
            this.render_hero();
            this.render_about();

            // --- 2. METRICS & STATS ---
            this.render_key_information();

            // --- 3. RESUME / TIMELINES ---
            this.render_academic_information();
            this.render_professional_experiences();

            // --- 4. EXPERTISE & SKILLS ---
            this.render_expertise_skills_achievements();
            this.render_skills_tools();
            this.render_honors_awards();
            this.render_courses_trainings_certificates();

            // --- 5. RESEARCH & PROJECTS ---
            this.render_projects();
            this.render_organisational_memberships();
            this.render_sessions_events();
            this.render_languages();
            this.render_portfolios();
            this.render_volunteering_services();
            this.render_publications();

            // --- 6. CONTACT & FOOTER ---
            this.render_contact_details();

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
    }
};