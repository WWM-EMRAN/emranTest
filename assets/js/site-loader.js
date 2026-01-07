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
        'projects.json', 'oranisational_memberships.json',
        'sessions_events.json', 'languages.json', 'portfolios.json',
        'volunteering_services.json', 'publications.json',
        'contact_details.json', 'ea_logo.json', 'copyright.json',
        'diary.json', 'gallery.json'
    ];

    try {
        // 2. Load all data into cache (RAM or LocalStorage via Core)
        await SiteCore.preloadAll(BASE, FILES);
        // 2.1. Sync data first
        SiteUtil.syncGlobalMetrics();

        // 3. Routing Logic: Detect page and initialize correct module
        const path = location.pathname.toLowerCase();
        const params = new URLSearchParams(location.search);

        // Load common elements for the entire site
        SiteCommon.init();

        if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
            console.log("Routing to: Home Index");
            SiteIndex.init();
        }
        else if (path.includes('section-details.html')) {
            const sectionKey = params.get('section');
            console.log(`Routing to: Section View [${sectionKey}]`);
            SiteSection.init(sectionKey);
        }
        else if (path.includes('page-details.html')) {
            const pageKey = params.get('page');
            console.log(`Routing to: Page View [${pageKey}]`);
            SitePage.init(pageKey);
        }
        else if (path.includes('curriculum-vitae.html')) {
            const mode = params.get('mode') || 'standard';
            console.log(`Routing to: CV View [Mode: ${mode}]`);
            SiteCV.init(mode);
        }

        // NOW call the navigation behavior once the HTML is ready
        if (window.initNavigationBehavior) {
            window.initNavigationBehavior();
        }
        if (window.initSkillBars) {
            window.initSkillBars();
        }

        // 4. Global UI Refresh: Re-run libraries like AOS or Typed if needed
        if (window.initExternalLibraries) window.initExternalLibraries();

    } catch (error) {
        console.error("Critical Load Error:", error);
    }
});