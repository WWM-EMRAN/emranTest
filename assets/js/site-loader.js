/**
 * site-loader.js - The Orchestrator
 * Manages batch loading, routing, and view initialization.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Configuration: Path and full list of data requirements
    const BASE = './assets/data/';
    const FILES = [
        'site.json', 'personal_information.json', 'key_information.json',
        'academic_information.json', 'professional_experiences.json',
        'expertise_skills_achievements.json', 'skills_tools.json',
        'honors_awards.json', 'courses_trainings_certificates.json',
        'projects.json', 'organisational_memberships.json',
        'sessions_events.json', 'languages.json', 'portfolios.json',
        'volunteering_services.json', 'publications.json',
        'contact_details.json', 'ea_logo.json', 'copyright.json',
        'diary.json', 'gallery.json'
    ];

    try {
        // 2. Load all data into cache (RAM or LocalStorage via Core)
        await SiteCore.preloadAllData(BASE, FILES);

        // 2.1. Sync data first
        await SiteUtil.syncGlobalMetrics();

        // 3. Routing Logic: Detect page and initialize correct module
        // const pathName = location.pathname.toLowerCase();
        // const allParams = new URLSearchParams(location.search);
        const [url, origin, pathName, fileName, allParams, hashes] = SiteUtil.getCurrentPathDetails();

        // 4. Load common elements for the entire site
        let menuType = "main";
        if ( (pathName.includes('page_details.html')) || (pathName.includes('curriculum_vitae.html') && ((allParams.type || 'standard')?.includes('onePage')) || (allParams.type || 'standard')?.includes('twoPage')) ){
            menuType = "short";
        }

        // 4.1 Load common elements for the entire site
        SiteCommon.init(menuType);

        // 4.2 --- DYNAMIC ANCHOR UPDATE ---
        // Locate the Home link in your navmenu
        const homeLink = document.querySelector('#navmenu a i.bx-home')?.parentElement ||
                         document.querySelector('#navmenu a[href="#hero"], #navmenu a[href="#all_cv_wrapper"]');

        // Load URL specific pages/elements
        if (pathName.endsWith('index.html') || pathName === '/' || pathName === '/' || pathName.endsWith('/')) {
            console.log("### Routing to: index.html");
            homeLink.setAttribute('href', '#hero');
            SiteIndex.init();
        }
        else if (pathName.includes('section_details.html')) {
            // const section = allParams.get('section');
            section = allParams.section?.toLowerCase() || '';
            console.log(`### Routing to: Section View: ${section}`);
            homeLink.setAttribute('href', './');
            SiteSection.init(section);
        }
        else if (pathName.includes('page_details.html')) {
            // const page = allParams.get('page');
            page = allParams.page?.toLowerCase() || '';
            console.log(`### Routing to: Page View: ${pageKey}`);
            homeLink.setAttribute('href', '#hero');
            SitePage.init(pageKey);
        }
        else if (pathName.includes('curriculum_vitae.html')) {
            // CV types: standard, onePage, twoPage, detailed
            // const type = allParams.get('type') || 'standard';
            // type = allParams.type?.toLowerCase() || 'standard';
            type = allParams.type || 'standard';
            console.log(`### Routing to: CV View [Type: ${type}]`);
            homeLink.setAttribute('href', '#all_cv_wrapper');
            SiteCV.init(type);
        }
        
        // 4. Re-initialize UI Libraries
        window.initExternalLibraries();

    }
    catch (error) {
        console.error("Critical Load Error:", error);
    }


});