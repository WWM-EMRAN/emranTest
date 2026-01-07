/**
 * site-loader.js - assets/js/site-loader.js
 * Dynamically loads and renders site data from JSON files.
 */

// *********************************************************************
// Global object to store loaded data
let SITE_DATA = {};
const BASE_DATA_PATH = './assets/data/';
const ALL_CV_MODES = ['one-page', 'standard', 'detailed'];
const MAIN_MENU_PAGES = [
    ['index.html', 'index', '', '/', './', 'curriculum-vitae.html'],
    ALL_CV_MODES.filter(mode => mode !== 'one-page') // This is treated as ONE item (an array)
];
const JSON_DATA_FILES = [
    'site.json',
    'personal_information.json',
    'key_information.json',
    'academic_information.json',
    'professional_experiences.json',
    'expertise_skills_achievements.json',
    'skills_tools.json',
    'honors_awards.json',
    'courses_trainings_certificates.json',
    'projects.json',
    'oranisational_memberships.json',
    'sessions_events.json',
    'languages.json',
    'portfolios.json',
    'volunteering_services.json',
    'publications.json',
    'contact_details.json',
    'ea_logo.json',
    'copyright.json',
    'diary.json',
    'gallery.json'
];


// *********************************************************************
// Globar functions
// // Explicitly expose functions to the global scope
// window.getMenuToRender = getMenuToRender;
// window.renderNavigation = renderNavigation;


// Main function to initilise the action to load data and populate site
document.addEventListener('DOMContentLoaded', () => {
    initializeSite(BASE_DATA_PATH, JSON_DATA_FILES, MAIN_MENU_PAGES);
    // ;
});


// *********************************************************************
/**
 * Main Initialization Flow
 */
async function initializeSite(base_data_path, data_files, main_menu_pages) {
    console.log("Initializing site...");
    // Load data from Cache or Data files from server
    let dataLoaded = false
    // try {
        dataLoaded = await fetchSiteData(base_data_path, data_files);
    // }
    // catch (error){
    //     console.error("Failed to load data from cache or server. Please check your network connection.", error);
    // }

    // try {
        if (dataLoaded && Object.keys(SITE_DATA).length > 0) {
            console.log("Rendering site with loaded data...");

            // Populate the HTML elements after data is loaded
            populateSite(main_menu_pages)
        } else {
            console.error("Problem with the data! Data cannot be loaded or is empty.");
        }
    // }
    // catch (error){
    //     console.error("Failed to populate HTML elements with the data.", error);
    // }
}


function populateSite(main_menu_pages) {

    // Re-initialize common HTML components (background, navigation menu, etc) after DOM updates
    renderCommonElements(main_menu_pages);

    const [url, origin, pathName, fileName, allParams, hashes] = getCurrentPathDetails();

    // Re-initialize index page after DOM updates
    if (pathName.includes('index.html') || pathName === '' || pathName === '/' || pathName.endsWith('/')) {
        renderIndexPage();
        // ;
    }
    // Re-initialize page details page after DOM updates
    else if (pathName.includes('page-details.html')) {
        console.log("*******>>> Rendering page details page...");
        pageKey = allParams.page?.toLowerCase() || '';
        console.log("*******>>> Page Key:", pageKey);
        renderPageDetailsPage(pageKey)
    }
    // Re-initialize section details page after DOM updates
    else if (pathName.includes('section-details.html')) {
        console.log("*******>>> Rendering section details page...");
        sectionKey = allParams.section?.toLowerCase() || '';
        console.log("*******>>> Section Key:", sectionKey);
        renderSectionDetailsPage(sectionKey)
    }
    // Re-initialize CV page after DOM updates
    else if (pathName.includes('curriculum-vitae.html')) {
        console.log("*******>>> Rendering section details page...");
        modeKey = allParams.mode?.toLowerCase() || '';
        console.log("*******>>> Mode Key:", modeKey);
        renderCVPage(modeKey);
        // ;
    }
    // Default initialization of 404 page
    else{
        // window.location.href = '404.html';
        // return;
        // renderIndexPage();
        ;
    }

    // Re-initialize external libraries after DOM updates
    initExternalLibraries();

    // // Initialize Navigation menu/submenu behaviour
    // if (typeof window.initNavigationBehavior === "function") {
    //     window.initNavigationBehavior();
    // }
    // else {
    //     // This is the fallback for Index Page race conditions
    //     document.addEventListener('DOMContentLoaded', () => {
    //         if (typeof window.initNavigationBehavior === "function") {
    //             window.initNavigationBehavior();
    //         }
    //     });
    // }

    // window.initNavScrollSpy();
    // window.initNavigationBehavior();
}


// // Call init once SITE_DATA is ready
// document.addEventListener('DOMContentLoaded', () => {
//     // Assuming your data loader sets a flag or calls this directly
//     if (typeof SITE_DATA !== 'undefined') {
//         populateSite();
//     }
// });


// *********************************************************************
/**
 * Data Fetching & Caching
 */
async function fetchSiteData(base_data_path, data_files) {
    console.log("Fetching data either from the cache or freshly from the server...");

    const CACHE_KEY = 'site_data_cache';
    const TIMESTAMP_KEY = 'site_data_timestamp';

    // 1. Check if cache exists
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = new Date().getTime();

    if (cachedData && cacheTimestamp) {
        try {
            const tempSiteData = JSON.parse(cachedData);

            // 2. Extract expiration from site.json (default to 86400 if missing)
            const expirationSeconds = tempSiteData.site?.cache_settings?.expiration_seconds || 3600;
            const expirationMilliSeconds = expirationSeconds * 1000;

            // 3. If within time limit, load from cache
            if (now - cacheTimestamp < expirationMilliSeconds) {
                console.log(`Loading data from ${expirationSeconds}s cache...`);
                SITE_DATA = tempSiteData;
                return true;
            }
        }
        catch (e) {
            console.warn("Cache parsing failed, performing fresh fetch.");
        }
    }

    console.log("Cache expired or missing. Starting fresh data loading...");
    try {
        console.log("Trying to fetch site data from path: ${base_data_path}");
        const results = await Promise.all(data_files.map(file =>
            fetch(`${base_data_path}${file}`).then(res => res.json())
        ));

        // Map results back to SITE_DATA keys (removing .json extension)
        data_files.forEach((file, index) => {
            const key = file.replace('.json', '');
            SITE_DATA[key] = results[index];
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify(SITE_DATA));
        localStorage.setItem(TIMESTAMP_KEY, now.toString());

        console.log("All data loaded successfully.");
        return true;
    } catch (error) {
        console.error("Error loading site data:", error);
        return false;
    }
}


// *********************************************************************
/**
 * Renderers for Common Elements (Header/Footer/Sidebar) from the global data SITE_DATA.
 */
function renderCommonElements(main_menu_pages) {
    console.log("Rendering the common elements of the site...");

    menuToRender = getMenuToRender(main_menu_pages);

    updateDocumentMetadata(SITE_DATA.site.site_info);
    renderHeader(SITE_DATA.personal_information, SITE_DATA.site);
    renderMenuFooter(SITE_DATA.site.footer_meta, SITE_DATA.site.assets);
    renderPageFooter(SITE_DATA.site.footer_meta);
    renderNavigation({main_menu: menuToRender});
    // renderNavDropdowns();

    console.log("Rendering the common elements of the site finished successfully...");
}

function getCurrentPathDetails() {
    // 0. Main URL and origin
    const url = window.location.href;
    const origin = window.location.origin;

    // 1. File Name Fallback
    const pathName = window.location.pathname;
    // If path is just "/" or empty, default to "index.html"
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1) || 'index.html';

    // 2. Query Parameter Fallback (Mode)
    const urlParams = new URLSearchParams(window.location.search);
    // Pase all parameters to dictionary
    const allParams = Object.fromEntries(urlParams) || {};

    // 3. Hash/Fragment Fallback (Section)
    // If #about is missing, hash will be an empty string ""
    const hashStr = window.location.hash || '';
    // Split hash values
    const hashes = hashStr.split('#').filter(Boolean);
    // const hashes = hashStr.split('#');

    console.log("====> CURRENT URL INFO:",
                        "\nURL              = ", url,
                        "\nORIGIN           = ", origin,
                        "\nPATH             = ", pathName,
                        "\nPAGE             = ", fileName,
                        "\nGET PARAMETERS   = ", allParams,
                        "\nHASH VALS        = ", hashes);

    // let hashStr = "#home#about";
    // let parts = hashStr.split('#');
    // console.log('===>', allParams, hashes); // true
    // console.log('--->', allParams.mode, hashes[0]); // true

    return [url, origin, pathName, fileName, allParams, hashes];
}

/**
 * Determines the menu to render based on the current page.
 * @returns {array}
 */
function getMenuToRender(main_menu_pages) {
    console.log("Determining the menu to render based on the current page...");

    const [url, origin, pathName, fileName, allParams, hashes] = getCurrentPathDetails();
    const mode = allParams.mode ?? '';

    let menuToRender;

    // console.log("XXX====> CURRENT - PAGE:", fileName, " PARAMETERS:", allParams, " (CV) MODE:", mode, " HASH VAL:", hashes);

    if (main_menu_pages[0].includes(fileName)) {
        console.log("Rendering main/detailed menu to the sidebar...");
        if (fileName.includes('curriculum-vitae.html') && !main_menu_pages[1].includes(mode)) {
            console.log("Rendering short menu to the sidebar for CV page...");
            menuToRender = SITE_DATA.site.navigation.short_menu;
        }
        else{
            console.log("Rendering main/detailed menu to the sidebar...");
            menuToRender = SITE_DATA.site.navigation.main_menu;
        }

        if (fileName.includes('curriculum-vitae.html')) {
            const homeItem = menuToRender.find(item => item.label.startsWith('Home'));
            if (homeItem) {
                // homeItem.url = './index.html#about';
                homeItem.url = '#all-cv-wrapper';
            }
        }
    }
    else {
        console.log("Rendering short menu to the sidebar...");
        menuToRender = SITE_DATA.site.navigation.short_menu;
    }
    // console.log("Menu to render: ", menuToRender);
    return menuToRender;
}

/**
 * Updates the document's metadata, such as the <title> tag.
 * @param {object} siteInfo
 */
function updateDocumentMetadata(siteInfo) {
    console.log("Updating document metadata...");
    if (!siteInfo || !siteInfo.title) return;

    // Update the HTML <title> tag
    document.title = siteInfo.title;
    console.log("Updated document metadata successfully.");
}

/**
 * Renders the Header (Name, Profile Image, Social Links) in the Sidebar.
 * @param {object} personalInfo
 * @param {object} siteData
 */
function renderHeader(personalInfo, siteData) {
    console.log("Rendering the header of the site...");
    if (!personalInfo || !siteData) return;

    // --- 1. Update Site Name in Header ---
    const siteNameElement = document.querySelector('#header .sitename');
    if (siteNameElement) {
        // Corrected path to access the name from the root of personal_information
        siteNameElement.textContent = personalInfo.name;
    }

    // --- 2. Update Profile Images (PP and Logo) ---
    const imageAssets = siteData.assets.images;
    const iconAssets = siteData.assets.icons;

    // Profile Image (Large circular photo)
    const profileImg = document.querySelector('#header .profile-img img');
    if (profileImg) {
        profileImg.src = imageAssets.profile_image_pp;
    }

    // Logo (Small circular photo next to site name)
    const logoImg = document.querySelector('#header .logo img');
    if (logoImg) {
        logoImg.src = iconAssets.logo_png; // Using iconAssets for logo_png
    }

    // --- 3. Update Social Links ---
    // Using siteData.social_links as it is a master list with icons
    const socialContainer = document.querySelector('#header .social-links');
    if (socialContainer && siteData.social_links) {
        socialContainer.innerHTML = siteData.social_links.main
            // .filter(link => link.platform !== 'google-old' && link.platform !== 'researchgate-old' && link.platform !== 'researchgate-fab') // Optional: filter out older/unused links
            .map(link => `
            <a href="${link.url}" target="_blank" class="${link.platform}">
                <i class="${link.icon_class}"></i>
            </a>
        `).join('');
    }
    console.log("Rendering the header of the site finished successfully.");
}

/**
 * Renders the Menu Footer (Sidebar Footer: ID: #menu_footer).
 * @param {object} footerMeta
 * @param {object} assetData
 */
function renderMenuFooter(footerMeta, assetData) {
    console.log("Rendering the footer of the site...");
    if (!footerMeta || !footerMeta.menu_footer) return;

    const menuFooter = footerMeta.menu_footer;
    const container = document.getElementById('menu_footer');
    if (!container) return;

    // --- CRITICAL FIX: Get the current year dynamically ---
    let copyrightYear= menuFooter.copyright_year || 'AUTO';
    if (copyrightYear && copyrightYear.toUpperCase() === 'AUTO') {
        // 1. If 'AUTO', use the current year
        copyrightYear = new Date().getFullYear();
        console.log("Getting current year", copyrightYear)
    }

    // Use the logo path from assets
    const logoPath = assetData.icons.logo_png;

    // 1. Render Copyright Block
    const copyrightHTML = `
        <div class="copyright">
          <p style="text-align: center;">
            © Copyright · ${copyrightYear} <strong><span> 
            <a href="./page-details.html?page=${menuFooter.copyright_logo_url}"> <img style="height: 20px;" src="${logoPath}" alt="Logo" class="img-fluid rounded-circle"> </a> 
            <a href="./page-details.html?page=${menuFooter.copyright_text_url}"> ${menuFooter.copyright_owner} </a> 
            </span></strong>
          </p>
        </div>
    `;

    // 2. Render Credits/Links Block
    const linksHTML = menuFooter.links.map(link =>
        `<a href="./page-details.html?page=${link.url}"> ${link.label} </a>`
    ).join(' | ');

    const creditsHTML = `
        <div class="credits">
            ${linksHTML}
        </div>
    `;

    // Replace the container content
    container.innerHTML = `
        <div class="container">
            ${copyrightHTML}
            ${creditsHTML}
        </div>
    `;
    console.log("Rendering the footer of the site finished successfully.");
}

/**
 * Renders the Global Page Footer (ID: #footer).
 * @param {object} footerMeta
 */
function renderPageFooter(footerMeta) {
    console.log("Rendering the footer of the site...");
    if (!footerMeta || !footerMeta.main_page_footer) return;

    const pageFooter = footerMeta.main_page_footer;
    const container = document.getElementById('footer');
    if (!container) return;

    // Ensure the container has the correct class and inner structure
    container.innerHTML = `
        <div class="container">
            <div class="copyright text-center ">
                <p>© <span>Copyright</span> <strong class="px-1 sitename">${pageFooter.sitename}</strong><span>All Rights Reserved</span></p>
            </div>
            <div class="credits">
                Designed by <a target="_blank" href="${pageFooter.design_link}">${pageFooter.design_credit}</a>
            </div>
        </div>
    `;
    console.log("Rendering the footer of the site finished successfully.");
}

/**
 * Renders the Navigation Menu (ID: #navmenu) from site.json.
 * @param {object} navigation - Now receives a wrapper object {main_menu: array}
 */
function renderNavigation(navigation) {
    console.log("Rendering the navigation menu...");
    // Check if the input object exists and if the main_menu property exists
    if (!navigation || !navigation.main_menu) return;

    const navContainer = document.getElementById('navmenu');
    if (!navContainer) return;

    // Get the actual menu array
    const menuArray = navigation.main_menu;

    let navHTML = '<ul>';

    // Loop through the selected menu array (either main_menu or details_menu)
    menuArray.forEach(item => {
        // console.log("---> Rendering menu item: ", item);
        // Class for the link: 'active scrollto' ONLY for #hero, 'scrollto' for all others
        // Note: For details_menu, we often want the "Back" link to be handled differently,
        // but for now, we continue the logic established for the main menu:
        const linkClass = (item.url === '#hero' || item.url === './' || item.url === '/' || item.url === 'index.html') ? 'active scrollto' : 'scrollto';
        const finalLinkClass = linkClass;

        if (item.is_dropdown && item.submenu && item.submenu.length > 0) {
            // ... (Dropdown rendering logic as before)
            navHTML += `
                <li class="dropdown">
                    <a href="${item.url}" class="${finalLinkClass}"><i class="${item.icon_class} navicon"></i> <span>${item.label}</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul class=""> 
                        ${item.submenu.map(subItem => `
                            <li>
                                <a href="${subItem.url}" class="scrollto"><i class="${subItem.icon_class} navicon"></i> <span>${subItem.label}</span></a>
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `;
        } else {
            // Standard Link Item
            navHTML += `
                <li><a href="${item.url}" class="${finalLinkClass}"><i class="${item.icon_class} navicon"></i> <span>${item.label}</span></a> </li>
            `;
        }
    });

    navHTML += '</ul>';
    navContainer.innerHTML = navHTML;

    // Initialize Navigation menu/submenu behaviour
    if (typeof window.initNavigationBehavior === "function") {
        window.initNavigationBehavior();
    }
    else {
        // This is the fallback for Index Page race conditions
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.initNavigationBehavior === "function") {
                window.initNavigationBehavior();
            }
        });
    }

    console.log("Rendering the navigation menu finished successfully.");
}

/**
 * Initializes the dropdown behavior according to the required structure:
 * <li> fixed, <a> toggles 'active' on click, <ul> toggles 'dropdown-active'.
 */
function renderNavDropdowns() {
    console.log("Initializing dropdown behavior...");
    // Select all the dropdown parent links (the <a> element)
    const navDropdownLinks = document.querySelectorAll('#navmenu .dropdown > a');

    navDropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // 1. Toggle the active class on the clicked <a> tag itself.
            this.classList.toggle('active');

            // 2. Identify the submenu <ul> (which is the next sibling element)
            const submenuUl = this.nextElementSibling;

            if (submenuUl && submenuUl.tagName === 'UL') {

                // 3. Toggle the 'dropdown-active' class on the submenu <ul>.
                submenuUl.classList.toggle('dropdown-active');

            }
        });
    });
    console.log("Initialized dropdown behavior successfully.");
}


// // Initialize Navigation menu/submenu behaviour
// function initNavigationBehavior() {
//     // Call the function from scripts.js to bind clicks to the new elements
//     if (typeof initDropdowns === "function") {
//         console.log("Initializing dropdown behavior...");
//         initDropdowns();
//     }
//     else {
//         console.warn("Dropdown behavior initialization failed. Dropdowns will not work.");
//     }
//
//     if (typeof initNavScrollSpy === "function") {
//         console.log("Initializing scrollspy behavior...");
//         initNavScrollSpy();
//     }
//     else {
//         console.warn("Scrollspy behavior initialization failed. Scrollspy will not work.");
//     }
// }



// *********************************************************************
/**
 * Index Page Logic
 */
function renderIndexPage() {
    console.log("Rendering the index page...");
    try {
        renderIndexHero()
        renderIndexAbout()
        renderIndexKeyInformation()
        renderIndexAcademicInformation()
        renderIndexProfessionalExperiences()
        renderIndexExpertiseSkillsAchievements()
        renderIndexSkillsTools()
        renderIndexHonorsAwards()
        renderIndexCoursesTrainingsCertificates()
        renderIndexProjects()
        renderIndexOrganisationalMemberships()
        renderIndexSessionsEvents()
        renderIndexLanguages()
        renderIndexPortfolios()
        renderIndexVolunteeringServices()
        renderIndexPublications()
        renderIndexContactDetails()
    }
    catch (error) {
        console.error("Error rendering the index page:", error);
    }

    console.log("Rendering the index page finished successfully.");
}


/**
 * Renders the Hero section on the index page using data from site.json and personal_information.json.
 * Target: #hero
 */
function renderIndexHero() {
    const heroSection = document.getElementById('hero');
    if (!heroSection || !SITE_DATA.personal_information || !SITE_DATA.site) return;

    const personal = SITE_DATA.personal_information;
    const heroData = personal.hero;
    const siteAssets = SITE_DATA.site.assets;

    // 1. Update Background Image
    const bgImg = heroSection.querySelector('img');
    if (bgImg && siteAssets.images.site_background) {
        bgImg.src = siteAssets.images.site_background;
    }

    // 2. Update Name (h2)
    const nameElement = heroSection.querySelector('h2');
    if (nameElement) {
        nameElement.textContent = heroData.title_main;
    }

    // 3. Update Typed.js Items from the hero_slogan array
    // We transform the array of objects into the HTML string format
    const typedSpan = heroSection.querySelector('.typed');
    if (typedSpan && heroData.main_keywards && heroData.main_keywards.hero_slogan) {
        const typedItemsString = heroData.main_keywards.hero_slogan
            .map(item => `<i class='${item.icon_class}'></i> ${item.text}`)
            .join(', ');

        typedSpan.setAttribute('data-typed-items', typedItemsString);

        // Re-initialize the animation to recognize the new items
        if (typeof initTypedAnimation === 'function') {
            initTypedAnimation();
        }
    }

    // 4. Update Researcher Title and Institutions
    const paragraphs = heroSection.querySelectorAll('p');

    // Update "PhD Researcher" line (Index 1)
    if (paragraphs.length >= 2) {
        paragraphs[1].textContent = heroData.title_researcher;
    }

    // Update Institutions and Tagline (Index 2)
    if (paragraphs.length >= 3) {
        paragraphs[2].innerHTML = `
            ${heroData.title_institute_primary}<br>
            ${heroData.title_institute_secondary}<br>
            ${heroData.tagline}
        `;
    }
}

/**
 * Renders the About section dynamically
 */
function renderIndexAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection || !SITE_DATA.personal_information) return;

    const info = SITE_DATA.personal_information;
    const profile = info.profile_summary;
    const siteAssets = SITE_DATA.site.assets;

    // 1. Section Title & Intro
    const titleH2 = aboutSection.querySelector('.section-title h2');
    if (titleH2) {
        // Preserves the printer icon link while updating the text
        const printerLink = titleH2.querySelector('a').outerHTML;
        titleH2.innerHTML = `${profile.title} ${printerLink}`;
    }

    const introPara = aboutSection.querySelector('.section-title h6');
    if (introPara) introPara.innerHTML = profile.intro_paragraph_html;

    // 2. Profile Image
    const profileImg = aboutSection.querySelector('.col-lg-4 img');
    const profileImgLink = aboutSection.querySelector('.col-lg-4 a');
    if (profileImg && siteAssets.images.profile_image_formal) {
        profileImg.src = siteAssets.images.profile_image_formal;
        if (profileImgLink) profileImgLink.href = siteAssets.images.profile_image_formal;
    }

    // 3. Overview Column
    const overviewTitle = aboutSection.querySelector('.content h3');
    if (overviewTitle) overviewTitle.textContent = profile.subtitle;

    // 4. Key Points (Left and Right Columns)
    const listContainers = aboutSection.querySelectorAll('.content ul');
    if (listContainers.length >= 2) {
        // Left Column
        listContainers[0].innerHTML = profile.key_points_left.map(point => `
            <li>
                <i class="${point.icon_class}"></i>
                <strong>${point.strong}:</strong>
                <span>${point.text}</span>
            </li>
        `).join('');

        // Right Column (Handles Links)
        listContainers[1].innerHTML = profile.key_points_right.map(point => `
            <li>
                <i class="${point.icon_class}"></i>
                <strong>${point.strong}:</strong>
                <span>
                    ${point.link ? `<a href="${point.link}" target="_blank" rel="noreferrer">${point.text}</a>` : point.text}
                </span>
            </li>
        `).join('');
    }

    // 5. Research Area & Recent Works
    const fullWidthList = aboutSection.querySelector('.col-lg-12 ul');
    if (fullWidthList) {
        fullWidthList.innerHTML = `
            <li>
                <i class="${profile.research_area.icon_class} me-2 accent-color"></i>
                <strong>${profile.research_area.title}:</strong>
                <span>${profile.research_area.text}</span>
            </li>
            <li>
                <i class="${profile.recent_works.icon_class} me-2 accent-color"></i>
                <strong>${profile.recent_works.title}:</strong>
                <span>${profile.recent_works.text}</span>
            </li>
        `;
    }

    // 6. About Me Full Text
    const aboutTitle = aboutSection.querySelectorAll('.section-title h2')[1];
    if (aboutTitle) {
        aboutTitle.innerHTML = `<i class="${info.about_full_text.icon_class} ms-2"></i> ${info.about_full_text.title}`;
    }

    const aboutPara = aboutSection.querySelectorAll('.section-title p')[0];
    if (aboutPara) aboutPara.innerHTML = info.about_full_text.paragraph_html;
}


/**
 * Helper to calculate total unique years from a list of date intervals.
 * Handles overlaps correctly.
 */
function calculateUniqueYears(intervals) {
    if (intervals.length === 0) return 0;

    // Sort intervals by start date
    intervals.sort((a, b) => a.start - b.start);

    const merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = intervals[i];

        if (current.start <= last.end) {
            // Overlap: extend the end of the last interval
            last.end = new Date(Math.max(last.end, current.end));
        } else {
            // No overlap: add new interval
            merged.push(current);
        }
    }

    // Sum up the years in merged intervals
    const totalMs = merged.reduce((sum, interval) => sum + (interval.end - interval.start), 0);
    return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25));
}

/**
 * Recalculates metrics in SITE_DATA and updates the local cache.
 * Should be called after fetchSiteData but before any render functions.
 */
async function refreshKeyMetricsData() {
    if (!SITE_DATA.key_information || !SITE_DATA.site) return;

    console.log("Recalculating key metrics and updating cache...");

    // 1. Calculate Unique Teaching/Training Years
    const teachingIntervals = [];
    if (SITE_DATA.professional_experiences?.experiences) {
        SITE_DATA.professional_experiences.experiences.forEach(cat => {
            if (cat.category.includes("Teaching") || cat.category.includes("Training")) {
                cat.organisation.forEach(org => {
                    org.roles.forEach(role => {
                        const start = new Date(role.timeframe_details.start_date);
                        const endStr = role.timeframe_details.end_date;
                        const end = (endStr === "Present") ? new Date() : new Date(endStr);
                        if (!isNaN(start) && !isNaN(end)) teachingIntervals.push({ start, end });
                    });
                });
            }
        });
    }
    const totalTeachingYears = calculateUniqueYears(teachingIntervals);

    // 2. Aggregate other counts
    const totalProjects = SITE_DATA.projects?.projects?.length || 0;

    let totalPubs = 0;
    if (SITE_DATA.publications?.publications) {
        Object.values(SITE_DATA.publications.publications).forEach(cat => {
            if (cat.items) totalPubs += cat.items.length;
        });
    }

    const totalInstitutions = SITE_DATA.academic_information?.degrees?.length || 0;
    const totalCerts = SITE_DATA.courses_trainings_certificates?.coursestrainingscertificates?.length || 0;

    // 3. Update SITE_DATA in memory
    SITE_DATA.key_information.metrics.forEach(metric => {
        if (metric.description.includes("teaching and research experience")) {
            metric.value = totalTeachingYears || metric.value;
        } else if (metric.strong_text.includes("Projects")) {
            metric.value = totalProjects || metric.value;
        } else if (metric.strong_text.includes("Publications")) {
            metric.value = totalPubs || metric.value;
        } else if (metric.description.includes("academic and research")) {
            metric.value = totalInstitutions || metric.value;
        } else if (metric.strong_text.includes("Certificates")) {
            metric.value = totalCerts || metric.value;
        }
    });

    // 4. Update the Cache (localStorage)
    const cacheKey = SITE_DATA.site.cache_settings?.cache_key || "site_data_cache";
    try {
        localStorage.setItem(cacheKey, JSON.stringify(SITE_DATA));
        console.log("Cache updated with fresh metrics.");
    } catch (e) {
        console.error("Failed to update cache in localStorage:", e);
    }
}



/**
 * Renders the Key Information (stats) section dynamically
 * Target: #key_information
 */
async function renderIndexKeyInformation() {
    // Recalculate the key_info from all data sources
    await refreshKeyMetricsData();

    const keyInfoSection = document.getElementById('key_information');
    if (!keyInfoSection || !SITE_DATA.key_information) return;

    const data = SITE_DATA.key_information;
    const sectionInfo = data.section_info;
    const metrics = data.metrics;

    // 1. Update Section Title and Description
    const titleH2 = keyInfoSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> ${sectionInfo.title}`;
    }

    const descPara = keyInfoSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Metrics Items
    const metricsContainer = keyInfoSection.querySelector('.row.gy-4');
    if (metricsContainer) {
        metricsContainer.innerHTML = metrics.map((metric, index) => `
            <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="stats-item">
                    <i class="${metric.icon_class}"></i>
                    <span data-purecounter-start="0"
                          data-purecounter-end="${metric.value}"
                          data-purecounter-duration="1.5"
                          data-purecounter-once="true"
                          class="purecounter">${metric.value}</span>
                    <p><strong>${metric.strong_text}</strong> ${metric.description}</p>
                </div>
            </div>
        `).join('');
    }

    // 3. Re-initialize PureCounter
    // This is required because PureCounter needs to scan the new DOM elements to start the animation
    if (typeof PureCounter !== 'undefined') {
        new PureCounter();
    }
}



/**
 * Helper to calculate duration between two dates or until today.
 * Fixed to handle end-of-month calculations correctly.
 */
function calculateDuration(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    let end = (endDateStr === "Present" || !endDateStr) ? new Date() : new Date(endDateStr);

    if (isNaN(start)) return "";

    // Add 1 day to the end date to make calculations like 1st to 31st inclusive
    end.setDate(end.getDate() + 1);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    let duration = "";
    if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
    if (months > 0) duration += `${months} mo${months > 1 ? 's' : ''}`;

    // Fallback for very short durations
    if (duration === "") duration = "1 mo";

    return duration.trim();
}

/**
 * Renders an individual education (degree) item with dynamic duration.
 */
function renderIndexEducationItem(degree) {
  // 1. Calculate dynamic duration if not explicitly provided in JSON
  const displayDuration = calculateDuration(degree.timeframe_details.start_date, degree.timeframe_details.end_date);

  // 2. Format Collaborations
  const collaborationHtml = degree.collaboration && degree.collaboration.length > 0 ? `
    <div class="collab-box rounded">
        <strong> <i class="bi bi-people me-1"></i>Collaboration:</strong>
        <ul class="mb-0 ms-2">
            ${degree.collaboration.map(c => `
                <li>
                    <strong>${c.collaboration_type}:</strong> ${c.degree_major}, ${c.institution_name},
                    <span class="text-muted"> ${c.institution_location}</span>
                </li>
            `).join('')}
        </ul>
    </div>` : '';

  // 3. Render Item
  return `
    <div class="resume-item" id="${degree.degree_id}" data-aos="fade-up">
        <h4 class="text-muted">${degree.degree_major}</h4>
        <p class="mb-0 ms-2 fw-bold">${degree.department_name}</p>
        <div class="ms-2 mb-2 mt-2">
            <h4 class="institution-link">
                <i class="bi bi-building me-1"></i>
                <a href="${degree.institution_link}" target="_blank" rel="noreferrer">
                    ${degree.institution_name} <i class="bx bx-link-external ms-1 small"></i>
                </a>
                <span class="ms-2 small text-muted fw-normal">
                    <i class="bi bi-geo-alt me-1"></i> ${degree.institution_location}
                </span>
            </h4>
        </div>

        <div class="mb-3 d-flex flex-wrap gap-2">
            <span class="badge badge-dates">
                <i class="bi bi-calendar3 me-1"></i> ${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}
            </span>
            <!--<span class="badge badge-important">
                <i class="bi bi-hourglass-split me-1"></i> ${displayDuration}
            </span>-->
            <span class="badge badge-duration">
                <i class="bi bi-hourglass-split me-1"></i> ${degree.timeframe_details.max_duration}
            </span>
            <span class="badge badge-institute">
                <i class="bi bi-person-workspace me-1"></i> ${degree.degree_type}
            </span>
            <span class="badge badge-status">
                <i class="bx bx-medal me-1"></i> ${degree.timeframe_details.award_date}
            </span>
        </div>

        <div class="ms-2">
            <p class="mb-2"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${degree.specialisation}</p>
            ${degree.thesis_details.thesis_title ? `<p><strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${degree.thesis_details.thesis_title} (${degree.thesis_details.thesis_length})</p>` : ''}
            <details class="details-box">
                <summary class="badge badge-type border-0 text-white" style="font-size: 11px; cursor: pointer;">
                    <i class="bi bi-eye me-1"></i> More Details
                </summary>
                <div class="ps-3 border-start mt-2">
                    <p><strong><i class="bi bi-mortarboard me-1"></i> Degree: </strong> ${degree.degree_short_name}</p>
                    ${collaborationHtml}
                    ${degree.scholarship ? `<p><strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong> ${degree.scholarship.scholarship_name}</p>` : ''}
                    <p><strong><i class="bi bi-lightbulb me-1"></i> Research Topic:</strong> ${degree.research_topic}</p>
                    <p><strong><i class="bi bi-file me-1"></i> Details:</strong> ${degree.description_full}</p>
                    ${degree.activities_involvement ? `<p><strong><i class="bi bi-person-arms-up me-1"></i> Activities:</strong> ${degree.activities_involvement}</p>` : ''}
                    <div class="ms-0">
                        <strong><i class="bx bxs-flask me-1"></i> Research and Projects:</strong>
                        <ol class="mb-0 ms-2">
                            ${degree.research_projects.map(rp => `<li><strong><i class="bi bi-dot"></i>  ${rp.type}:</strong> ${rp.title}</li>`).join('')}
                        </ol>
                    </div>
                    <p class="mb-1 mt-2"><strong><i class="bi bi-tags me-1"></i> Skills:</strong> <span class="text-muted">${degree.related_skills}</span></p>
                </div>
            </details>
        </div>
    </div>`;
}


/**
 * Renders the Education section on the index page.
 */
function renderIndexAcademicInformation() {
    const eduSection = document.getElementById('academic_information');
    if (!eduSection || !SITE_DATA.academic_information) return;

    const data = SITE_DATA.academic_information;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const header = eduSection.querySelector('.section-title');

    // 1. Update Section Title and Description
    const titleH2 = eduSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i>
        ${sectionInfo.title}
        <a href="section-details.html?section=academic_information"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = eduSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Summary Columns (Fixing the Selector)
    // We target the specific div containing the summary title
    const summaryContainer = eduSection.querySelector('.col-lg-12[data-aos-delay="100"]');
    if (summaryContainer) {
        const summaryTitle = summaryContainer.querySelector('.resume-title');
        if (summaryTitle) summaryTitle.textContent = data.summary.title;

        const summaryLists = summaryContainer.querySelectorAll('ul.ms-3');
        if (summaryLists.length >= 2) {
            // First column
            summaryLists[0].innerHTML = data.summary.status_list[0]
                .map(item => `<li>${item}</li>`).join('');
            // Second column
            summaryLists[1].innerHTML = data.summary.status_list[1]
                .map(item => `<li>${item}</li>`).join('');
        }
    }

    // 3. Render Degrees Grouped by Category
    // This targets the second row in your container (the degree list)
    const degreeRow = eduSection.querySelector('.container > .row:last-child');
    if (degreeRow) {
        let finalHtml = '';
        let renderedCategories = [];

        data.degrees.forEach(degree => {
            // Add category header only once per level
            if (!renderedCategories.includes(degree.degree_level)) {
                finalHtml += `
                    <div class="col-lg-12" data-aos="fade-up">
                        <h2 class="resume-category-title" data-aos="fade-up">
                            <i class="${degree.icon_class} me-1"></i> ${degree.degree_level}
                        </h2>
                    </div>`;
                renderedCategories.push(degree.degree_level);
            }

            // Append the individual degree item using your item renderer
            finalHtml += `<div class="col-lg-12">${renderIndexEducationItem(degree)}</div>`;
        });

        degreeRow.innerHTML = finalHtml;
    }
}

/**
 * Renders an individual professional experience role.
 * @param {Object} role - The role object from professional_experiences.json.
 * @returns {string} - The HTML string for the resume item.
 */
function renderIndexExperienceItem(role) {
  // Calculate dynamic duration
  const displayDuration = role.timeframe_details.duration ||
                          calculateDuration(role.timeframe_details.start_date, role.timeframe_details.end_date);

  // Status Badge Logic: Show only if the job is ongoing ("Present")
  const isOngoing = role.timeframe_details.end_date === "Present";
  const statusBadgeHtml = isOngoing ? `
    <span class="badge badge-status">
        <i class="bx bx-medal me-1"></i> Ongoing
    </span>` : '';

  // Role Type Badge
  const typeBadgeHtml = `
    <span class="badge badge-institute">
        <i class="bi bi-person-workspace me-1"></i> ${role.role_type}
    </span>`;

  // List processing for Details
  const descriptionHtml = role.description_list && role.description_list.length > 0 ? `
    <div class="mb-2">
        <p class="mb-1"><strong><i class="bi bi-file me-1"></i> Details:</strong></p>
        <ul class="ms-0">
            ${role.description_list.map(desc => `<li><i class="bi bi-dot"></i> ${desc}</li>`).join('')}
        </ul>
    </div>` : '';

  const responsibilitiesHtml = `
    <div class="ms-0">
        <p class="mb-1"><strong><i class="bi bi-person-raised-hand me-1"></i> Responsibilities:</strong></p>
        <ul class="ms-2">
            ${role.responsibilities_list.map(resp => `<li><i class="bi bi-dot"></i> ${resp}</li>`).join('')}
        </ul>
    </div>`;

  const courseHtml = role.course_involvement && role.course_involvement.length > 0 ? `
    <div class="mb-2">
        <p class="mb-1"><strong><i class="bi bi-book me-1"></i> Course Involvement:</strong></p>
        <ul class="ms-2">
            ${role.course_involvement.map(course => `<li><i class="bi bi-dot"></i> <small>${course}</small></li>`).join('')}
        </ul>
    </div>` : '';

  return `
    <div class="resume-item" id="${role.role_id}" data-aos="fade-up">
        <h4 class="text-muted">${role.title}</h4>
        <div class="mb-3 d-flex flex-wrap gap-2">
            <span class="badge badge-dates">
                <i class="bi bi-calendar3 me-1"></i> ${role.timeframe_details.start_date} – ${role.timeframe_details.end_date}
            </span>
            ${displayDuration ? `<span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${displayDuration}</span>` : ''}
            ${typeBadgeHtml}
            ${statusBadgeHtml}
        </div>
        <p class="mb-2"><strong><i class="bi bi-file-text me-1"></i> About Job:</strong> ${role.about_job}</p>
        <details class="details-box">
            <summary class="badge badge-type border-0 text-white" style="font-size: 11px; cursor: pointer;">
                <i class="bi bi-eye me-1"></i> More Details
            </summary>
            <div class="ps-2 border-start mt-2">
                ${descriptionHtml}
                ${responsibilitiesHtml}
                ${courseHtml}
                <p class="mt-2 mb-3">
                    <strong><i class="bi bi-tags me-1"></i> Competencies:</strong>
                    <span class="text-muted">${role.related_skills}</span>
                </p>
            </div>
        </details>
    </div>`;
}

/**
 * Renders the Professional Experiences section on the index page.
 */
function renderIndexProfessionalExperiences() {
    const expSection = document.getElementById('professional_experiences');
    if (!expSection || !SITE_DATA.professional_experiences) return;

    const data = SITE_DATA.professional_experiences;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = expSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
                             ${sectionInfo.title} 
                             <a href="section-details.html?section=professional_experiences"> <i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = expSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Summary (Expertise & Interests)
    const summaryContainer = expSection.querySelector('.col-lg-12[data-aos-delay="100"]');
    if (summaryContainer) {
        const titles = summaryContainer.querySelectorAll('.resume-title');

        // Areas of Expertise
        if (titles[0]) titles[0].textContent = data.summary.expertise_list[0].title;
        const expertiseUl = summaryContainer.querySelector('.row.mt-3 ul');
        if (expertiseUl) {
            expertiseUl.innerHTML = data.summary.expertise_list[0].areas_of_expertise
                .map(item => `<li>${item}</li>`).join('');
        }

        // Research Interests (Three Columns)
        if (titles[1]) titles[1].textContent = data.summary.expertise_list[1].title;
        const interestCols = summaryContainer.querySelectorAll('.row.mt-3:last-of-type .col-md-4 ul');
        data.summary.expertise_list[1].research_interests_columns.forEach((colItems, idx) => {
            if (interestCols[idx]) {
                interestCols[idx].innerHTML = colItems.map(item => `<li><small>${item}</small></li>`).join('');
            }
        });
    }

    // 3. Render Experiences Row
    const experienceRow = expSection.querySelector('.container > .row[data-aos-delay="100"]');
    if (experienceRow) {
        experienceRow.innerHTML = data.experiences.map(cat => `
            <div class="col-lg-12" data-aos="fade-up">
                <div class="resume-category-group mb-5">
                    <h2 class="resume-category-title" data-aos="fade-up">
                        <i class="${cat.organisation[0].icon_class}"></i> ${cat.category}
                    </h2>
                    ${cat.organisation.map(org => `
                        <div class="ms-3 mb-4 mt-3">
                            <h2 class="resume-title" data-aos="fade-up">
                                <i class="bi bi-building me-1"></i>
                                <a href="${org.link}" target="_blank">${org.organization}<i class="bx bx-link-external ms-1 small"></i></a>
                                <span class="ms-2 small text-muted fw-normal">
                                    <i class="bi bi-geo-alt me-1"></i>${org.location}
                                </span>
                            </h2>
                            <div class="ms-2">
                                ${org.roles.map(role => renderIndexExperienceItem(role)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

/**
 * Renders the top-level Expertise, Skills and Achievements section header.
 * Target: #expertise_skills_achievements
 */
function renderIndexExpertiseSkillsAchievements() {
    const expertiseSection = document.getElementById('expertise_skills_achievements');
    if (!expertiseSection || !SITE_DATA.expertise_skills_achievements) return;

    const expertiseInfo = SITE_DATA.expertise_skills_achievements;
    const sectionInfo = expertiseInfo.section_info;

    // Update Section Title and Description
    const titleH2 = expertiseSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> ${sectionInfo.title}`;
    }

    const descPara = expertiseSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }
}

/**
 * Helper to render an individual skill progress bar.
 */
function renderIndexSkillItem(skill, delay) {
    return `
        <div class="progress" data-aos="fade-up" data-aos-delay="${delay}">
            <span class="skill">
                ${skill.category}: ${skill.short_description}
                <i class="val">${skill.level}%</i>
            </span>
            <div class="progress-bar-wrap">
                <div class="progress-bar" role="progressbar" 
                     aria-valuenow="${skill.level}" 
                     aria-valuemin="0" 
                     aria-valuemax="100" 
                     style="width: 1px;">
                </div>
            </div>
        </div>`;
}

/**
 * Renders the Skills and Tools sub-section with progress bars.
 * Target: #skills_tools
 */
function renderIndexSkillsTools() {
    const skillsSection = document.getElementById('skills_tools');
    if (!skillsSection || !SITE_DATA.skills_tools) return;

    const data = SITE_DATA.skills_tools;
    const skillsList = data.skills;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = skillsSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=skills_tools"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = skillsSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Split Skills into Two Columns
    const columns = skillsSection.querySelectorAll('.skills-content .col-lg-6');
    if (columns.length >= 2) {
        const midpoint = Math.ceil(skillsList.length / 2);
        const leftSkills = skillsList.slice(0, midpoint);
        const rightSkills = skillsList.slice(midpoint);

        columns[0].innerHTML = leftSkills.map((skill, index) =>
            renderIndexSkillItem(skill, index * 100)
        ).join('');

        columns[1].innerHTML = rightSkills.map((skill, index) =>
            renderIndexSkillItem(skill, (midpoint + index) * 100)
        ).join('');
    }

    // 3. Re-trigger Animation Logic
    // Ensure the theme's animation script runs on the new DOM elements
    if (typeof window.initSkillBars === "function") {
        window.initSkillBars();
    }
}

/**
 * Renders an individual Honor or Award item.
 * @param {Object} award - The award object from honors_awards.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexHonorsAwardsItem(award, index) {
    const delay = index * 100;

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${award.icon_class || 'bx bx-medal'}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a class="stretched-link" href="/honorsAndAwards-details#${award.id_ref}">
                        ${award.title}
                    </a>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-dates">
                        <i class="bi bi-calendar3 me-1"></i>
                        ${award.date}
                    </span>
                    <span class="badge badge-institute">
                        <i class="bi bi-building me-1"></i>
                        ${award.issuer_organization.name}
                    </span>
                </p>
                <p class="description">
                    ${award.short_description}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Honors and Awards section on the index page.
 * Target: #honors_awards
 */
function renderIndexHonorsAwards() {
    const honorsSection = document.getElementById('honors_awards');
    if (!honorsSection || !SITE_DATA.honors_awards) return;

    const data = SITE_DATA.honors_awards;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = honorsSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=honors_awards"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = honorsSection.querySelector('.section-title h6');
    // console.log('========>', descPara, sectionInfo.details);
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Awards Grid
    const gridContainer = honorsSection.querySelector('.row.gy-4');
    if (gridContainer) {
        gridContainer.innerHTML = data.honorsawards.map((award, index) =>
            renderIndexHonorsAwardsItem(award, index)
        ).join('');
    }
}

/**
 * Renders an individual Course, Training or Certificate item.
 * @param {Object} item - The course object from the JSON.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the portfolio item.
 */
function renderIndexCourseItem(item, index) {
    const delay = index * 100;
    const filters = item.filter_tags.join(' ');

    return `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filters}" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="portfolio-content h-100">
                <img class="img-fluid" alt="${item.title}" src="${item.image_path}">
                <div class="portfolio-info">
                    <h4>${item.title}</h4>
                    <p>${item.source}</p>
                    <div class="portfolio-links">
                        <a href="${item.image_path}" title="${item.title}" data-gallery="portfolio-gallery-cert" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
                        <a href="${item.link_target}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
}

/**
 * Renders the Courses section with dynamic filtering.
 * Labels are pulled from details.type based on the tags in filter_tags.
 */
function renderIndexCoursesTrainingsCertificates() {
    const coursesSection = document.getElementById('courses_trainings_certificates');
    if (!coursesSection || !SITE_DATA.courses_trainings_certificates) return;

    const data = SITE_DATA.courses_trainings_certificates;
    const sectionInfo = data.section_info;
    const items = data.coursestrainingscertificates;

    // 1. Update Section Title and Description
    const titleH2 = coursesSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title}
        <a href="section-details.html?section=courses_trainings_certificates"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = coursesSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Generate Dynamic Filter Menu based on Type Labels
    const filterMenu = coursesSection.querySelector('.portfolio-filters');
    if (filterMenu) {
        const filterMap = {}; // To store mapping of tag -> Label from details.type

        items.forEach(item => {
            // Only consider items with serial_no for the index page
            if (item.serial_no && item.serial_no.trim() !== "") {
                const typeLabels = item.details.type.split(',').map(s => s.trim());

                item.filter_tags.forEach(tag => {
                    // Skip standard or "All" filters
                    if (tag === 'filter-active' || tag === '*') return;

                    // Identify the specific label in the type string that matches the tag
                    // e.g., 'filter-cert' looks for 'Certificate' in "All, Certificate, Course"
                    const cleanTag = tag.replace('filter-', '').toLowerCase();
                    const matchedLabel = typeLabels.find(label =>
                        label.toLowerCase().includes(cleanTag)
                    );

                    if (matchedLabel && !filterMap[tag]) {
                        filterMap[tag] = matchedLabel;
                    }
                });
            }
        });

        // Construct Filter List
        const filterHtml = `
            <li data-filter="*" class="filter-active">All</li>
            ${Object.keys(filterMap).map(tag => `
                <li data-filter=".${tag}">${filterMap[tag]}</li>
            `).join('')}
        `;
        filterMenu.innerHTML = filterHtml;
    }

    // 3. Render Top 12 Items with serial_no
    const container = coursesSection.querySelector('.isotope-container');
    if (container) {
        const filteredItems = items
            .filter(item => item.serial_no && item.serial_no.trim() !== "")
            .slice(0, 12);

        container.innerHTML = filteredItems.map((item, index) =>
            renderIndexCourseItem(item, index)
        ).join('');
    }

    // 4. Refresh Libraries
    if (typeof AOS !== 'undefined') AOS.refresh();
    if (typeof GLightbox !== 'undefined') GLightbox().reload();
    if (typeof window.initIsotope === "function") window.initIsotope();
}

/**
 * Renders an individual project item for the index page grid.
 * @param {Object} project - The project object from projects.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexProjectItem(project, index) {
    const delay = index * 100;

    // Calculate dynamic duration using the shared helper
    const displayDuration = project.timeframe_details.duration ||
                            calculateDuration(project.timeframe_details.start_date, project.timeframe_details.end_date);

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${project.icon_class || 'bx bx-bulb'}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="projects-details.html#${project.id_ref}" class="stretched-link">
                        ${project.role}
                    </a>
                </h4>
                <div class="mb-1 d-flex flex-wrap gap-1">
                    <span class="badge badge-dates">
                        <i class="bi bi-calendar3 me-1"></i>
                        ${project.timeframe_details.start_date} – ${project.timeframe_details.end_date}
                    </span>
                    <span class="badge badge-status">
                        ${project.status}
                    </span>
                </div>
                <p class="description mt-2">
                    ${project.short_description}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Projects section on the index page.
 * Target: #projects
 */
function renderIndexProjects() {
    const projectSection = document.getElementById('projects');
    if (!projectSection || !SITE_DATA.projects) return;

    const data = SITE_DATA.projects;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = projectSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title}
        <a href="section-details.html?section=projects"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = projectSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Project Grid
    const gridContainer = projectSection.querySelector('.row.gy-4');
    if (gridContainer) {
        gridContainer.innerHTML = data.projects.map((project, index) =>
            renderIndexProjectItem(project, index)
        ).join('');
    }
}

/**
 * Renders an individual Membership item for the index page.
 * @param {Object} membership - The membership object from oranisational_memberships.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexMembershipItem(membership, index) {
    const delay = index * 100;

    // Calculate dynamic duration using the shared helper
    const displayDuration = calculateDuration(
        membership.timeframe_details.start_date,
        membership.timeframe_details.end_date
    );

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${membership.icon_class || 'bx bx-group'}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="/oranisational_memberships-details#${membership.id_ref}" class="stretched-link">
                        ${membership.title}
                    </a>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-dates">
                        <i class="bi bi-calendar3 me-1"></i>
                        ${membership.timeframe_details.start_date} – ${membership.timeframe_details.end_date}
                    </span>
                    <span class="badge badge-institute ms-1">
                        <i class="bi bi-building me-1"></i>
                        ${membership.membership_organization[0].name}
                    </span>
                </p>
                <p class="description">
                    ${membership.description_full}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Memberships section on the index page.
 * Target: #oranisational_memberships
 */
function renderIndexOrganisationalMemberships() {
    const memSection = document.getElementById('oranisational_memberships');
    if (!memSection || !SITE_DATA.oranisational_memberships) return;

    const data = SITE_DATA.oranisational_memberships;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = memSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=oranisational_memberships"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = memSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Membership Grid
    const gridContainer = memSection.querySelector('.row.gy-4');
    if (gridContainer) {
        gridContainer.innerHTML = data.memberships.map((membership, index) =>
            renderIndexMembershipItem(membership, index)
        ).join('');
    }
}

/**
 * Renders an individual Session or Event item.
 * @param {Object} item - The session/event object from the JSON.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexSessionEventItem(item, index) {
    const delay = index * 100;

    return `
        <div class="col-lg-6 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${item.icon_class || 'bi bi-mic'}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="/sessions-events-details#${item.id_ref}" class="stretched-link">
                        ${item.title}
                    </a>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-dates">
                        <i class="bi bi-calendar3 me-1"></i>
                        ${item.date}
                    </span>
                    <span class="badge badge-institute ms-1">
                        <i class="bi bi-building me-1"></i>
                        ${item.organization}
                    </span>
                    <span class="badge badge-status ms-1">
                        ${item.type}
                    </span>
                </p>
                <p class="description">
                    ${item.description}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Sessions and Events section on the index page.
 * Target: #sessions_events
 */
function renderIndexSessionsEvents() {
    const eventsSection = document.getElementById('sessions_events');
    if (!eventsSection || !SITE_DATA.sessions_events) return;

    const data = SITE_DATA.sessions_events;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = eventsSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=sessions_events"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = eventsSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Session/Event Grid Items
    const container = eventsSection.querySelector('.row.gy-4');
    if (container) {
        container.innerHTML = data.sessionsevents.map((item, index) =>
            renderIndexSessionEventItem(item, index)
        ).join('');
    }
}

/**
 * Renders an individual Language item.
 * @param {Object} lang - The language object from languages.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexLanguageItem(lang, index) {
    const delay = index * 100;

    // Process Test Scores if they exist
    let testScoresHtml = '';
    if (lang.test_scores && lang.test_scores[0] && lang.test_scores[0].test_name) {
        const score = lang.test_scores[0];
        testScoresHtml = `
            <div class="mt-2">
                <div class="mb-1"><small class="fw-bold">${score.test_name} (${score.test_year}): ${score.test_score}</small></div>
                <div class="d-flex flex-wrap gap-1">
                    <span class="badge badge-lrws">L: ${score.proficiency_breakdown.listening}</span>
                    <span class="badge badge-lrws">R: ${score.proficiency_breakdown.reading}</span>
                    <span class="badge badge-lrws">W: ${score.proficiency_breakdown.writing}</span>
                    <span class="badge badge-lrws">S: ${score.proficiency_breakdown.speaking}</span>
                </div>
            </div>`;
    } else {
        // Default proficiency breakdown
        const pb = lang.test_scores[0].proficiency_breakdown;
        testScoresHtml = `
            <div class="d-flex flex-wrap gap-1 mt-2">
                <span class="badge badge-lrws">L: ${pb.listening}</span>
                <span class="badge badge-lrws">R: ${pb.reading}</span>
                <span class="badge badge-lrws">W: ${pb.writing}</span>
                <span class="badge badge-lrws">S: ${pb.speaking}</span>
            </div>`;
    }

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0 d-flex align-items-center justify-content-center">
                <i class="bx bx-conversation"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="/languages-details#${lang.id_ref}" class="stretched-link">${lang.language}</a>
                    <span class="${lang.icon_class} flag-icon"></span>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-type">${lang.status}</span>
                    <small class="text-muted fw-bold ms-1">${lang.proficiency_level}</small>
                </p>
                <p class="description mb-2">
                    ${lang.details}
                </p>
                ${testScoresHtml}
            </div>
        </div>`;
}

/**
 * Renders the Languages section on the index page.
 * Target: #languages
 */
function renderIndexLanguages() {
    const langSection = document.getElementById('languages');
    if (!langSection || !SITE_DATA.languages) return;

    const data = SITE_DATA.languages;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = langSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=languages"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = langSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Language Grid Items
    const gridContainer = langSection.querySelector('.row.gy-4');
    if (gridContainer) {
        gridContainer.innerHTML = data.languages.map((lang, index) =>
            renderIndexLanguageItem(lang, index)
        ).join('');
    }
}

/**
 * Renders an individual Portfolio (GitHub Repo) item.
 * @param {Object} item - The portfolio object from portfolios.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexPortfolioItem(item, index) {
    const delay = index * 100;

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${item.icon_class}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="${item.portfolio_url}" target="_blank" rel="noreferrer" class="stretched-link">
                        ${item.title}
                    </a>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-type">
                        <i class="bi bi-github me-1"></i>
                        GitHub Repository
                    </span>
                </p>
                <p class="description">
                    ${item.description}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Portfolios section on the index page.
 * Target: #portfolios
 */
function renderIndexPortfolios() {
    const portSection = document.getElementById('portfolios');
    if (!portSection || !SITE_DATA.portfolios) return;

    const data = SITE_DATA.portfolios;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = portSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=portfolios"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = portSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Portfolio Grid Items
    const container = portSection.querySelector('.row.gy-4');
    if (container) {
        container.innerHTML = data.portfolios.map((item, index) =>
            renderIndexPortfolioItem(item, index)
        ).join('');
    }
}

/**
 * Renders an individual Volunteering item.
 * @param {Object} item - The volunteering object from volunteering_services.json.
 * @param {number} index - The index for AOS delay calculation.
 * @returns {string} - The HTML string for the service item.
 */
function renderIndexVolunteeringItem(item, index) {
    const delay = index * 100;

    return `
        <div class="col-lg-6 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${item.icon_class}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="/volunteering-details#${item.id_ref}" class="stretched-link">
                        ${item.title}
                    </a>
                </h4>
                <p class="mb-1">
                    <span class="badge badge-dates">
                        <i class="bi bi-calendar3 me-1"></i>
                        ${item.timeframe_details.start_date} – ${item.timeframe_details.end_date}
                    </span>
                    <span class="badge badge-type ms-1">
                        <i class="bi bi-building me-1"></i>
                        ${item.organization}
                    </span>
                    <span class="badge badge-important ms-1">
                        <i class="bi bi-info-circle-fill me-1"></i>
                        ${item.cause}
                    </span>
                </p>
                <p class="description">
                    ${item.summary_text}
                </p>
            </div>
        </div>`;
}

/**
 * Renders the Volunteering section on the index page.
 * Target: #volunteering_services
 */
function renderIndexVolunteeringServices() {
    const volSection = document.getElementById('volunteering_services');
    if (!volSection || !SITE_DATA.volunteering_services) return;

    const data = SITE_DATA.volunteering_services;
    const sectionInfo = data.section_info;

    // 1. Update Section Title and Description
    const titleH2 = volSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=volunteering_services"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = volSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Volunteering Grid
    const gridContainer = volSection.querySelector('.row.gy-4');
    if (gridContainer) {
        gridContainer.innerHTML = data.volunteerings.map((item, index) =>
            renderIndexVolunteeringItem(item, index)
        ).join('');
    }
}


/**
 * Renders an individual publication item (Journal, Conference, or Poster).
 * @param {Object} item - The publication object from the JSON.
 */
function renderIndexPublicationItem(item) {
    // Strips HTML tags and escapes quotes for safe attribute storage
    const cleanCitation = item.citation_text.replace(/<\/?[^>]+(>|$)/g, "").replace(/"/g, '&quot;');

    return `
        <div class="resume-item pb-3" id="${item.id_ref}" data-aos="fade-up">
            <h4>${item.title}</h4>
            <p class="mb-2">${item.citation_text}</p>
            <div class="d-flex flex-wrap gap-2 mb-2 align-items-center">
                <button class="badge border-0 badge-dates citation-btn" 
                        data-citation="${cleanCitation}"
                        onclick="handleCopyAction(this, 'Citation')">
                    <i class="bi bi-clipboard-plus me-1"></i> Copy Citation
                </button>
                <a href="${item.journal_link || item.conference_link}" target="_blank" rel="noreferrer" class="badge badge-status text-white">
                    <i class="bi bi-box-arrow-up-right me-1"></i> View Details
                </a>
                <details class="details-box d-inline-block">
                    <summary class="badge badge-type border-0 text-white" style="font-size: 11px; cursor: pointer;">
                        <i class="bi bi-eye me-1"></i> View Abstract
                    </summary>
                    <div class="ps-2 border-start mt-2">
                        <p class="text-muted"><span class="fw-bold">Abstract:</span> ${item.abstract}</p>
                    </div>
                </details>
            </div>
        </div>`;
}







/**
 * Renders the Publications section header and groups.
 * Target: #publications
 */
function renderIndexPublications() {
    const pubSection = document.getElementById('publications');
    if (!pubSection || !SITE_DATA.publications) return;

    const pubData = SITE_DATA.publications;
    const sectionInfo = pubData.section_info;

    // 1. Update Section Title and Description
    const titleH2 = pubSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=publications"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = pubSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Clear and Render Groups
    const container = pubSection.querySelector('.row');
    if (container) {
        container.innerHTML = ''; // Clear static content

        // Iterate through categories (journals, conferences, posters)
        Object.keys(pubData.publications).forEach(key => {
            const group = pubData.publications[key];
            if (key === 'section_info') return;

            const groupHtml = `
                <div class="col-lg-12">
                    <div class="resume-category-group mb-5" data-aos="fade-up">
                        <h2 class="resume-category-title">
                            <i class="${group.icon_class}"></i> ${group.type}: ${group.sub_type} (${group.items.length})
                        </h2>
                        ${group.items.map(item => renderIndexPublicationItem(item)).join('')}
                    </div>
                </div>
            `;
            container.innerHTML += groupHtml;
        });
    }
}

/**
 * Renders an individual contact method card.
 * @param {Object} contact - The contact object (e.g., email, linkedin).
 * @param {number} index - The index for AOS delay calculation.
 */
function renderIndexContactItem(contact, index) {
    const delay = index * 100;
    // let contact_copy = contact.copy();
    let contact_copy = Object.assign({}, contact);


    // Determine if the link should open in a new tab
    const target = contact_copy.title === "Email" ? "" : 'target="_blank" rel="noreferrer"';
    contact_copy.link = contact_copy.title === "Location" ? `https://www.google.com/maps/search/${encodeURIComponent(contact_copy.text)}` : contact_copy.link;

    return `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="icon flex-shrink-0">
                <i class="${contact_copy.icon_class}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="${contact_copy.link}" ${target} class="stretched-link">${contact_copy.title}</a>
                </h4>
                <p class="description">${contact_copy.text}</p>
            </div>
        </div>`;
}

/**
 * Renders the Contacts section on the index page.
 * Target: #contacts
 */
// function renderIndexContactDetails() {
//     const contSection = document.getElementById('contact_details');
//     if (!contSection || !SITE_DATA.contact_details) return;
//
//     const data = SITE_DATA.contact_details;
//     const sectionInfo = data.section_info;
//     const contactMethods = data.contacts;
//
//     // 1. Update Section Title and Description
//     const titleH2 = contSection.querySelector('.section-title h2');
//     if (titleH2) {
//         titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i>
//         ${sectionInfo.title}
//         <a href="section-details.html?section=contact_details"><i class="bx bx-link ms-2"></i></a>`;
//     }
//
//     const descPara = contSection.querySelector('.section-title h6');
//     if (descPara) {
//         descPara.textContent = sectionInfo.details;
//     }
//
//     // 2. Render Contact Grid
//     const gridContainer = contSection.querySelector('.row.gy-4');
//     if (gridContainer) {
//         // Clear existing items but preserve the map container
//         const mapContainer = gridContainer.querySelector('.col-lg-12');
//         gridContainer.innerHTML = '';
//
//         // Convert the contacts object into an array and render
//         Object.keys(contactMethods).forEach((key, index) => {
//             gridContainer.innerHTML += renderIndexContactItem(contactMethods[key], index);
//         });
//
//         // 3. Re-append and update the Map
//         if (mapContainer) {
//             const iframe = mapContainer.querySelector('iframe');
//             if (iframe && contactMethods.location) {
//                 iframe.src = contactMethods.location.link;
//             }
//             gridContainer.appendChild(mapContainer);
//         }
//     }
// }


function renderIndexContactDetails() {
    const contSection = document.getElementById('contact_details');
    if (!contSection || !SITE_DATA.contact_details) return;

    const data = SITE_DATA.contact_details;
    const sectionInfo = data.section_info;
    const contactMethods = data.contacts;

    // 1. Update Section Title and Description
    const titleH2 = contSection.querySelector('.section-title h2');
    if (titleH2) {
        titleH2.innerHTML = `<i class="${sectionInfo.icon_class}"></i> 
        ${sectionInfo.title} 
        <a href="section-details.html?section=contact_details"><i class="bx bx-link ms-2"></i></a>`;
    }

    const descPara = contSection.querySelector('.section-title h6');
    if (descPara) {
        descPara.textContent = sectionInfo.details;
    }

    // 2. Render Contact Grid
    const gridContainer = contSection.querySelector('.row.gy-4');
    if (gridContainer) {
        // Clear existing items but preserve the map container
        const mapContainer = gridContainer.querySelector('.col-lg-12');
        gridContainer.innerHTML = '';

        // Filter keys: select only keys that DO NOT contain '_cv'
        const filteredKeys = Object.keys(contactMethods).filter(key => !key.includes('_cv'));

        // Render only the filtered contact methods
        filteredKeys.forEach((key, index) => {
            gridContainer.innerHTML += renderIndexContactItem(contactMethods[key], index);
        });

        // 3. Re-append and update the Map
        if (mapContainer) {
            const iframe = mapContainer.querySelector('iframe');
            // Ensure the map continues to use the primary 'location' key
            if (iframe && contactMethods.location) {
                iframe.src = contactMethods.location.link;
            }
            gridContainer.appendChild(mapContainer);
        }
    }
}


// *********************************************************************
/**
 * CV Page Logic
 */
function renderCVPage(modeKey) {
    // If the section doesn't exist in your SITE_DATA, redirect to 404
    if (!ALL_CV_MODES.includes(modeKey)) {
        window.location.href = '404.html';
        return;
    }
    console.log("Rendering all CV Pages...");
    try{
        renderStandardCV(modeKey);
        renderOnePageCV(modeKey);
    }
    catch (error){
        console.error("Error initializing CV sections:", error)
    }
    console.log("Finished Rendering all CV Pages...");
}


// *********************************************************************
/**
 * Standard page CV functions
 */
function renderStandardCV(modeKey) {
    // Implementation for dynamic standard CV blocks
    console.log("Rendering Standard CV Section...");
    try {
        renderStandardCVHeader()
        renderStandardCVAbout()
        renderStandardCVKeyInformation()
        renderStandardCVAcademicInformation()
        renderStandardCVProfessionalExperiences()
        renderStandardCVSkillsTools()
        renderStandardCVHonorsAwards()
        renderStandardCVCoursesTrainingsCertificates()
        renderStandardCVProjects()
        renderStandardCVOrganisationalMemberships()
        renderStandardCVSessionsEvents()
        renderStandardCVLanguages()
        renderStandardCVPortfolios()
        renderStandardCVVolunteeringServices()
        renderStandardCVPublications()
        renderStandardCVContactDetails()
        renderStandardCVFooter()
    }
    catch (error){
        console.error("Error initializing Standard CV sections:", error)
    }
    console.log("Standard CV Section Rendering finished...");
}


/**
 * Renders the Header section of the Standard CV page.
 * Target: #cv-header
 */
function renderStandardCVHeader() {
    const headerSection = document.getElementById('cv-header');
    if (!headerSection || !SITE_DATA.personal_information || !SITE_DATA.contact_details) return;

    const personal = SITE_DATA.personal_information;
    const hero = personal.hero;
    const contacts = SITE_DATA.contact_details.contacts;

    // 1. Update Profile Image
    // Uses the formal image path and ensures it's wrapped for the lightbox
    const profileImg = headerSection.querySelector('img');
    const profileLink = headerSection.querySelector('.glightbox');
    const formalImgPath = "assets/img/myimg/emran-ali-formal.jpg";

    if (profileImg) profileImg.src = formalImgPath;
    if (profileLink) profileLink.href = formalImgPath;

    // 2. Update Name and Slogan
    const nameHeader = headerSection.querySelector('.cv-name-header');
    const subtitle = headerSection.querySelector('.cv-accent-subtitle');

    if (nameHeader) nameHeader.textContent = hero.title_main;
    if (subtitle && hero.main_keywards && hero.main_keywards.hero_slogan) {
        // Map slogan texts from the main_keywards array
        subtitle.textContent = hero.main_keywards.hero_slogan
            .map(item => item.text)
            .join(' | ');
    }

    // 3. Update Contact Info
    const contactInfoContainer = document.getElementById('header-contact-info');
    if (contactInfoContainer) {
        contactInfoContainer.innerHTML = `
            <div>
                <i class="${contacts.location.icon_class}"></i> 
                <a href="${contacts.location.link}" target="_blank" rel="noreferrer">
                    ${contacts.location.text}
                </a>
            </div>
            <div>
                <i class="${contacts.email.icon_class}"></i> 
                <a href="${contacts.email.link}" target="_blank">
                    ${contacts.email.text}
                </a>
            </div>
            <div>
                <i class="bi bi-globe"></i> 
                <a href="http://emran.humachlab.com" target="_blank">
                    emran.humachlab.com
                </a>
            </div>
        `;
    }
}

/**
 * Renders the Profile Summary section of the Standard CV page.
 * Target: #about
 */
function renderStandardCVAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection || !SITE_DATA.personal_information) return;

    const personal_information = SITE_DATA.personal_information;
    // const hero = SITE_DATA.personal_information.hero;
    // const keywards = hero.main_keywards;

    // Construct the summary dynamically
    // const summaryText = `
    //     I am a research and development enthusiast in ${keywards.hero_slogan.map(s => s.text).join(', ')},
    //     Generative AI, Explainability, Interpretability and Optimisation.
    //     Experienced in applied research in: ${keywards.expertise_keywards.slice(0, 4).join(', ')}.
    //     Involved in the academic and industrial collaboration researches and projects.
    // `;
    const summaryText = personal_information.profile_summary.intro_paragraph_html;

    const summaryParagraph = aboutSection.querySelector('p');
    if (summaryParagraph) {
        summaryParagraph.textContent = summaryText.trim();
    }
}

/**
 * Renders the Key Information section of the Standard CV page.
 * Dynamically calculates counts and years of experience from JSON data.
 * Target: #key_information-grid
 */
async function renderStandardCVKeyInformation() {
    // Recalculate the key_info from all data sources
    await refreshKeyMetricsData();

    const keyInfoSection = document.getElementById('key_information');
    if (!keyInfoSection || !SITE_DATA.key_information) return;

    const data = SITE_DATA.key_information;
    const sectionInfo = data.section_info;
    const metrics = data.metrics;

    // 1. Update Section Header
    const titleElement = keyInfoSection.querySelector('.cv-section-title');
    if (titleElement) {
        titleElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    const gridContainer = document.getElementById('key-info-grid');
    if (!gridContainer) return;

    // 2. Split metrics into two columns (4 items each) for your layout
    const midPoint = Math.ceil(metrics.length / 2);
    const leftColMetrics = metrics.slice(0, midPoint);
    const rightColMetrics = metrics.slice(midPoint);

    // Helper to generate metric HTML
    const renderMetric = (m) => `
        <div>
            <i class="${m.icon_class} me-2"></i>
            <strong>${m.value} ${m.strong_text}</strong> ${m.description}
        </div>`;

    // 3. Render the grid
    gridContainer.innerHTML = `
        <div class="col-6">
            ${leftColMetrics.map(renderMetric).join('')}
        </div>
        <div class="col-6">
            ${rightColMetrics.map(renderMetric).join('')}
        </div>
    `;
}

/**
 * Renders the Education section of the Standard CV page.
 * Target: #academic_information
 */
function renderStandardCVAcademicInformation() {
    const educationSection = document.getElementById('academic_information');
    if (!educationSection || !SITE_DATA.academic_information) return;

    const data = SITE_DATA.academic_information;
    const sectionInfo = data.section_info;
    const degrees = data.degrees;

    // 1. Update Section Title and Icon
    const headerElement = educationSection.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Render Degree List
    // We clear existing content and rebuild based on the JSON
    const contentContainer = educationSection;
    // Remove old degree entries but keep the title
    const existingEntries = educationSection.querySelectorAll('.mb-3, .mb-0');
    existingEntries.forEach(el => el.remove());

    degrees.forEach((degree, index) => {
        const isLast = index === degrees.length - 1;
        const spacingClass = isLast ? 'mb-0' : 'mb-3';

        // Handle Collaboration text
        let collaborationHtml = '';
        if (degree.collaboration && degree.collaboration.length > 0) {
            const colab = degree.collaboration[0];
            collaborationHtml = `
                <div class="mt-1">
                    <strong class="text-muted">Collaboration:</strong> 
                    ${colab.collaboration_type} Program with ${colab.institution_name}, ${colab.institution_location}
                </div>`;
        }

        // Handle Thesis text
        let thesisHtml = '';
        if (degree.thesis_details && degree.thesis_details.thesis_title) {
            thesisHtml = `<div class="mt-1"><strong class="text-muted">Thesis:</strong> ${degree.thesis_details.thesis_title}.</div>`;
        }

        const degreeHtml = `
            <div class="${spacingClass} small" id="${degree.degree_id}">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold text-dark text-uppercase">
                        <i class="${degree.icon_class} me-2"></i>${degree.degree_level} in ${degree.degree_major}
                    </span>
                    <span class="text-muted">${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                </div>
                <div class="d-flex justify-content-between italic">
                    <span>${degree.institution_name} – <span class="text-muted">${degree.institution_location}</span></span>
                    <span class="text-muted">${degree.timeframe_details.award_date === "Ongoing" ? "Ongoing" : "Awarded on: " + degree.timeframe_details.award_date}</span>
                </div>
                ${collaborationHtml}
                <div class="mt-1"><strong class="text-muted">Specialisation:</strong> ${degree.specialisation}</div>
                ${thesisHtml}
            </div>
        `;
        educationSection.insertAdjacentHTML('beforeend', degreeHtml);
    });
}

/**
 * Helper to render an Organization and its multiple roles.
 */
function renderCVOrgGroup(org) {
    return `
        <div class="ms-2 mb-3 mt-1">
            <div class="fw-bold text-dark">
                <i class="bi bi-building me-2"></i>${org.organization} 
                <span class="fw-normal text-muted">— ${org.location}</span>
            </div>
            <div class="ms-2 mt-1 small">
                ${org.roles.map(role => renderCVRoleItem(role)).join('')}
            </div>
        </div>
    `;
}

/**
 * Helper to render individual Role details with duration calculation.
 */
function renderCVRoleItem(role) {
    // Calculate duration using shared helper
    const duration = role.timeframe_details.duration ||
                     calculateDuration(role.timeframe_details.start_date, role.timeframe_details.end_date);

    return `
        <div class="mb-2">
            <div class="d-flex justify-content-between">
                <span class="fw-bold text-muted"><i class="bi bi-briefcase me-2"></i>${role.title}</span>
                <span class="text-muted">${role.timeframe_details.start_date} – ${role.timeframe_details.end_date} (${duration})</span>
            </div>
            <div class="mt-1 text-justify">
                <strong class="text-muted">About Job:</strong> ${role.about_job}
            </div>
        </div>
    `;
}

/**
 * Renders the Professional Experience section of the Standard CV page.
 * Target: #professional_experiences
 */
function renderStandardCVProfessionalExperiences() {
    const section = document.getElementById('professional_experiences');
    if (!section || !SITE_DATA.professional_experiences) return;

    const data = SITE_DATA.professional_experiences;
    const experiences = data.experiences;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;
    }

    // 2. Clear static content except the title
    const container = section;
    const existingGroups = section.querySelectorAll('.mb-3, .mb-0');
    existingGroups.forEach(el => {
        if (!el.classList.contains('cv-section-title')) el.remove();
    });

    // 3. Map through Categories
    experiences.forEach((categoryGroup, catIndex) => {
        const isLastCategory = catIndex === experiences.length - 1;
        const categoryHtml = `
            <div class="${isLastCategory ? 'mb-0' : 'mb-3'}" id="cat-${catIndex}">
                <h6 class="text-uppercase fw-bold small m-0">
                    <i class="${categoryGroup.organisation[0]?.icon_class || 'bi bi-briefcase'} me-2"></i>
                    ${categoryGroup.category}
                </h6>
                ${categoryGroup.organisation.map(org => renderCVOrgGroup(org)).join('')}
            </div>
        `;
        section.insertAdjacentHTML('beforeend', categoryHtml);
    });
}

/**
 * Renders the Skills and Tools section of the Standard CV page.
 * Target: #skills_tools
 */
function renderStandardCVSkillsTools() {
    const skillsSection = document.getElementById('skills_tools');
    if (!skillsSection || !SITE_DATA.skills_tools) return;

    const data = SITE_DATA.skills_tools;
    const sectionInfo = data.section_info;
    const skills_tools = data.skills;

    // 1. Update Section Header from JSON
    const headerElement = skillsSection.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    const gridContainer = document.getElementById('skills-grid');
    if (!gridContainer) return;

    // 2. Split skills_tools into two columns
    const midPoint = Math.ceil(skills_tools.length / 2);
    const leftColSkills = skills_tools.slice(0, midPoint);
    const rightColSkills = skills_tools.slice(midPoint);

    // Helper to generate the skill HTML block
    const renderSkillBlock = (skill) => `
        <div class="mb-2">
            <i class="${skill.icon_class} me-2"></i>
            <strong>${skill.category}:</strong>
            <span class="text-dark">${skill.short_description}</span>
        </div>`;

    // 3. Populate the grid columns
    gridContainer.innerHTML = `
        <div class="col-6">
            ${leftColSkills.map(renderSkillBlock).join('')}
        </div>
        <div class="col-6">
            ${rightColSkills.map(renderSkillBlock).join('')}
        </div>
    `;
}

/**
 * Renders the Honors and Awards section of the Standard CV page.
 * Target: #honors_awards
 */
function renderStandardCVHonorsAwards() {
    const section = document.getElementById('honors_awards');
    if (!section || !SITE_DATA.honors_awards) return;

    const data = SITE_DATA.honors_awards;
    const sectionInfo = data.section_info;
    const awards = data.honorsawards;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Awards List
    const listContainer = document.getElementById('awards-list');
    if (listContainer) {
        listContainer.innerHTML = awards.map((award, index) => {
            const isLast = index === awards.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-2';

            return `
                <div class="${spacingClass} small" id="${award.id_ref}">
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${award.icon_class} me-2"></i>${award.title}
                        </span>
                        <span class="text-muted">${award.date}</span>
                    </div>
                    <div class="italic text-muted">${award.short_description}</div>
                    <div class="mt-1">${[award.issuer_organization.name, award.issuer_organization.location].filter(Boolean).join(', ')}</div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Courses, Trainings and Certificates section of the Standard CV page.
 * Target: #courses_trainings_certificates
 */
function renderStandardCVCoursesTrainingsCertificates() {
    const section = document.getElementById('courses_trainings_certificates');
    if (!section || !SITE_DATA.courses_trainings_certificates) return;

    const data = SITE_DATA.courses_trainings_certificates;
    const sectionInfo = data.section_info;
    const items = data.coursestrainingscertificates;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Items List
    const listContainer = document.getElementById('certificates-list');
    if (listContainer) {
        listContainer.innerHTML = items.map((item, index) => {
            const isLast = index === items.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-2';

            // Format Organizations: "Offering (Funded by Funding)" or just "Offering"
            const offering = item.details.offering_organization;
            const funding = item.details.funding_organization;
            const orgDisplay = funding ? `${offering} (Funded by ${funding})` : offering;

            // Extract summary from description (take first sentence or use details.description)
            // const summary = item.details.description.split('.')[0] + '.';
            // const summary = item.details.description;
            const summary = item.details.key_information.join();

            return `
                <div class="${spacingClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class} me-2"></i>${item.title}
                        </span>
                        <span class="text-muted">${item.details.date}</span>
                    </div>
                    <div class="italic text-muted">${orgDisplay}</div>
                    <div class="mt-1">${summary}</div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Projects section of the Standard CV page.
 * Target: #projects
 */
function renderStandardCVProjects() {
    const section = document.getElementById('projects');
    if (!section || !SITE_DATA.projects) return;

    const data = SITE_DATA.projects;
    const sectionInfo = data.section_info;
    const projects = data.projects;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Projects List
    const listContainer = document.getElementById('projects-list');
    if (listContainer) {
        listContainer.innerHTML = projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-3';

            // Calculate duration (e.g., "2 yrs 11 mos")
            const duration = calculateDuration(
                project.timeframe_details.start_date,
                project.timeframe_details.end_date
            );

            // Filter and process collaboration organisations
            const collabOrgs = project.collaboration_organization || [];
            const validCollabs = collabOrgs
                .filter(org => org && org.name && org.name.trim() !== "")
                .map(org => {
                    const nameHtml = org.link
                        ? `<a href="${org.link}" target="_blank" class="text-muted text-decoration-none">${org.name}</a>`
                        : org.name;
                    return org.location ? `${nameHtml} (${org.location})` : nameHtml;
                })
                .join('; ');

            const collaborationHtml = validCollabs
                ? `<div class="text-muted italic mt-1">Collaborations: ${validCollabs}</div>`
                : '';

            return `
                <div class="${spacingClass} small" id="${project.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${project.icon_class} me-2"></i>${project.role}
                        </span>
                        <span class="text-muted text-end">
                            ${project.timeframe_details.start_date} – ${project.timeframe_details.end_date} (${duration}) | 
                            <span class="italic">${project.status}</span>
                        </span>
                    </div>
                    
                    <div class="fw-bold mt-1 text-dark">${project.title}</div>
<!--                    <div class="text-muted italic">${project.organization}</div>-->

                    ${collaborationHtml}

                    <div class="mt-1 text-justify">
                        ${project.short_description}
                    </div>
                </div>
            `;
        }).join('');
    }
}


/**
 * Renders the Memberships section of the Standard CV page.
 * Target: #oranisational_memberships
 */
function renderStandardCVOrganisationalMemberships() {
    const section = document.getElementById('oranisational_memberships');
    if (!section || !SITE_DATA.oranisational_memberships) return;

    const data = SITE_DATA.oranisational_memberships;
    const sectionInfo = data.section_info;
    const oranisational_memberships = data.memberships;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Memberships List
    const listContainer = document.getElementById('memberships-list');
    if (listContainer) {
        listContainer.innerHTML = oranisational_memberships.map((item, index) => {
            const isLast = index === oranisational_memberships.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-2';

            // Calculate duration (e.g., "1 yr 4 mos")
            const duration = calculateDuration(
                item.timeframe_details.start_date,
                item.timeframe_details.end_date
            );

            // Extract a concise summary from description_full
            const summary = item.description_full.split('.')[0] + '.';

            return `
                <div class="${spacingClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class} me-2"></i>${item.title}
                        </span>
                        <span class="text-muted text-end">
                            ${item.timeframe_details.start_date} – ${item.timeframe_details.end_date} (${duration})
                        </span>
                    </div>
                    <div class="italic text-muted">${item.membership_organization[0].name}</div>
                    <div class="mt-1">${summary}</div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Sessions and Events section of the Standard CV page.
 * Target: #sessions_events
 */
function renderStandardCVSessionsEvents() {
    const section = document.getElementById('sessions_events');
    if (!section || !SITE_DATA.sessions_events) return;

    const data = SITE_DATA.sessions_events;
    const sectionInfo = data.section_info;
    const events = data.sessionsevents;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Events List
    const listContainer = document.getElementById('sessions-list');
    if (listContainer) {
        listContainer.innerHTML = events.map((event, index) => {
            const isLast = index === events.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-3';

            return `
                <div class="${spacingClass} small" id="${event.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${event.icon_class} me-2"></i>${event.title}
                        </span>
                        <span class="text-muted text-end">
                            ${event.type} | <span class="italic">${event.date}</span>
                        </span>
                    </div>
                    <div class="italic text-muted">${event.organization}, ${event.location}</div>
                    <div class="mt-1 text-justify">
                        ${event.description}
                    </div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Languages section of the Standard CV page.
 * Target: #languages
 */
function renderStandardCVLanguages() {
    const section = document.getElementById('languages');
    if (!section || !SITE_DATA.languages) return;

    const data = SITE_DATA.languages;
    const sectionInfo = data.section_info;
    const languages = data.languages;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Languages List
    const listContainer = document.getElementById('languages-list');
    if (listContainer) {
        listContainer.innerHTML = languages.map((lang, index) => {
            const isLast = index === languages.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-2';

            // Logic to determine the status display (Test Score or Level)
            let statusBadge = lang.status;
            let scoreInfo = lang.proficiency_level;

            // Check for test scores (e.g., IELTS)
            if (lang.test_scores && lang.test_scores[0] && lang.test_scores[0].test_name) {
                const test = lang.test_scores[0];
                scoreInfo = `${test.test_name} (${test.test_year}): ${test.test_score}`;
            }

            // Extract proficiency breakdown for detail line
            const pb = lang.test_scores[0]?.proficiency_breakdown;
            const breakdownText = pb ? `L: ${pb.listening}, R: ${pb.reading}, W: ${pb.writing}, S: ${pb.speaking}` : '';

            return `
                <div class="${spacingClass} small" id="${lang.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${lang.icon_class} me-2"></i>${lang.language}
                        </span>
                        <span class="text-muted text-end">
                            ${statusBadge} | <span class="italic">${scoreInfo}</span>
                        </span>
                    </div>
                    <div class="mt-1">
                        ${lang.details} ${breakdownText ? `Proficiency: ${breakdownText}.` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Portfolios section of the Standard CV page.
 * Target: #portfolios
 */
function renderStandardCVPortfolios() {
    const section = document.getElementById('portfolios');
    if (!section || !SITE_DATA.portfolios) return;

    const data = SITE_DATA.portfolios;
    const sectionInfo = data.section_info;
    const portfolios = data.portfolios;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Portfolios List
    const listContainer = document.getElementById('portfolio-list');
    if (listContainer) {
        listContainer.innerHTML = portfolios.map((item, index) => {
            const isLast = index === portfolios.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-3';

            // Extract the handle from the GitHub URL (e.g., @WWM-EMRAN/Repo)
            const repoHandle = item.portfolio_url.replace("https://github.com/", "@");

            return `
                <div class="${spacingClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="bi bi-github me-1"></i>${item.title}
                        </span>
                        <br><span class="small italic text-muted text-end">${repoHandle}</span>
                    </div>
                    <div class="mt-1">
                        ${item.description}
                    </div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Volunteering section of the Standard CV page.
 * Target: #volunteering_services
 */
function renderStandardCVVolunteeringServices() {
    const section = document.getElementById('volunteering_services');
    if (!section || !SITE_DATA.volunteering_services) return;

    const data = SITE_DATA.volunteering_services;
    const sectionInfo = data.section_info;
    const volunteerings = data.volunteerings;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    // 2. Clear and Render Volunteering List
    const listContainer = document.getElementById('volunteering-list');
    if (listContainer) {
        listContainer.innerHTML = volunteerings.map((item, index) => {
            const isLast = index === volunteerings.length - 1;
            const spacingClass = isLast ? 'mb-0' : 'mb-3';

            // Calculate duration (e.g., "1 yr 3 mos")
            const duration = calculateDuration(
                item.timeframe_details.start_date,
                item.timeframe_details.end_date
            );

            // Determine status based on end_date
            const status = item.timeframe_details.end_date === "Present" ? "Ongoing" : "Completed";

            return `
                <div class="${spacingClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class} me-2"></i>${item.title}
                        </span>
                        <span class="text-muted text-end">
                            ${item.timeframe_details.start_date} – ${item.timeframe_details.end_date} (${duration}) | 
                            <span class="italic">${status}</span>
                        </span>
                    </div>
                    <div class="italic text-muted">${item.organization}</div>
                    <div class="mt-1 text-justify">
                        ${item.summary_text}
                    </div>
                </div>
            `;
        }).join('');
    }
}

/**
 * Renders the Publications section of the Standard CV page.
 * Target: #publications
 */
function renderStandardCVPublications() {
    const section = document.getElementById('publications');
    if (!section || !SITE_DATA.publications) return;

    const data = SITE_DATA.publications;
    const sectionInfo = data.section_info;
    const publicationGroups = data.publications;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    /**
     * Helper to render a specific group (Journals, Conferences, or Posters)
     * @param {string} containerId - The ID of the container div in the HTML
     * @param {Object} groupData - The group object from the JSON
     */
    const renderGroup = (containerId, groupData) => {
        const container = document.getElementById(containerId);
        if (!container || !groupData) return;

        // Update Group Header with Dynamic Count
        const groupHeader = container.querySelector('h6');
        if (groupHeader) {
            groupHeader.innerHTML = `<i class="${groupData.icon_class} me-2"></i>${groupData.type}: ${groupData.sub_type} (${groupData.items.length})`;
        }

        // Render List Items
        const listWrapper = container.querySelector('.ms-2');
        if (listWrapper) {
            listWrapper.innerHTML = groupData.items.map((item, index) => {
                const isLast = index === groupData.items.length - 1;
                const year = item.citation_text.match(/\d{4}/) ? item.citation_text.match(/\d{4}/)[0] : "N/A";
                const link = item.journal_link || item.conference_link || "";

                // Strip HTML tags for the copy action
                const cleanCitation = item.citation_text.replace(/<\/?[^>]+(>|$)/g, "").replace(/"/g, '&quot;');

                return `
                    <div class="${isLast ? 'mb-0' : 'mb-3'}" id="${item.id_ref}">
                        <div class="d-flex justify-content-between align-items-baseline">
                            <span class="fw-bold text-muted"><i class="bi bi-file-earmark-text me-2"></i>${item.title}</span>
<!--                            <span class="text-muted text-end">${year}</span>-->
<!--                            <span class="text-muted text-end">${year} | <span class="italic">${groupData.sub_type}</span></span>-->
                        </div>
                        <div class="mt-1 text-justify">
                            ${item.citation_text} <br>
                             <button class="badge border-0 badge-dates" 
                                    style="cursor: pointer; transition: all 0.3s ease;"
                                    data-citation="${cleanCitation}"
                                    onclick="handleCopyAction(this, 'Citation')">
                                <i class="bi bi-clipboard-plus me-1"></i>
                            </button>
                            ${link ? `<span class="text-primary small italic">DOI/Link: <a href="${link}" target="_blank">${link}</a></span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    };

    // 2. Render each group defined in the JSON
    renderGroup('pub-journals', publicationGroups.journals);
    renderGroup('pub-conferences', publicationGroups.conferences);
    renderGroup('pub-posters', publicationGroups.posters);
}

/**
 * Renders the Contact Details section of the Standard CV page.
 * Target: #contacts
 */
function renderStandardCVContactDetails() {
    const section = document.getElementById('contact_details');
    if (!section || !SITE_DATA.contact_details) return;

    const data = SITE_DATA.contact_details;
    const sectionInfo = data.section_info;
    const contacts = data.contacts;
    const siteData = SITE_DATA.site;

    // 1. Update Section Header
    const headerElement = section.querySelector('.cv-section-title');
    if (headerElement) {
        headerElement.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;
    }

    const gridContainer = document.getElementById('contact-grid');
    if (!gridContainer) return;

    // 2. Identify Website Link from site metadata
    const websiteObj = siteData?.social_links?.main?.find(l => l.platform === 'website') ||
                       { url: "https://emran.humachlab.com/" };
    const websiteUrl = websiteObj.url;
    // Format the display text by removing the protocol and trailing slash
    const websiteDisplay = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // 3. Populate Contact Grid in three columns
    gridContainer.innerHTML = `
        <div class="col-4">
            <div class="small"><strong>Location:</strong> <a href="${contacts.location.link}" target="_blank">${contacts.location.text}</a></div>
            <div class="small"><strong>Email:</strong> <a href="${contacts.email.link}" target="_blank">${contacts.email.text}</a></div>
        </div>
        <div class="col-4">
            <div class="small"><strong>LinkedIn:</strong> <a href="${contacts.linkedin.link}" target="_blank">${contacts.linkedin.text}</a></div>
            <div class="small"><strong>Google Scholar:</strong> <a href="${contacts.google_scholar.link}" target="_blank">${contacts.google_scholar.text}</a></div>
        </div>
        <div class="col-4">
            <div class="small"><strong>MS Teams:</strong> <a href="${contacts.teams.link}" target="_blank">${contacts.teams.text}</a></div>
            <div class="small"><strong>Website:</strong> <a href="${websiteUrl}" target="_blank">${websiteDisplay}</a></div>
        </div>
    `;
}

/**
 * Renders the CV Footer section.
 * Target: #cv-footer
 */
function renderStandardCVFooter() {
    const footerSection = document.getElementById('cv-footer');
    // Ensure data exists before proceeding
    if (!footerSection || !SITE_DATA.personal_information) return;

    const personalInfo = SITE_DATA.personal_information;

    // 1. Generate the date string
    const now = new Date();
    const day = now.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${day} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // 2. Preserve author name
    const authorName = personalInfo.hero?.title_main || "Emran Ali";

    // 3. Inject into your specific HTML template
    footerSection.innerHTML = `
        <p class="mb-0 small italic">I hereby certify that the information provided is true and correct to the best of my knowledge.</p>
        <br /><br />
        <div class="d-flex justify-content-between mt-2 text-dark text-uppercase">
            <span class="small">Generated: <span>${formattedDate}</span></span>
            <span class="fw-bold">${authorName}</span>
        </div>
    `;

    console.log("Footer rendered successfully...");
}



// *********************************************************************
/**
 * One-page CV functions
 */
function renderOnePageCV() {
    // Implementation for dynamic one-page sidebar and main body
    console.log("Rendering One-Page CV Section...");
    try {
        // Sidebar
        renderOnePageCVSidebarContacts()
        renderOnePageCVSidebarExpertise()
        renderOnePageCVSidebarResearchAreas()
        renderOnePageCVSidebarPersonalSkills()
        renderOnePageCVSidebarProgramming()
        renderOnePageCVSidebarLanguages()
        renderOnePageCVSidebarOrganisationalMemberships()

        // Main page body
        renderOnePageCVHeader()
        renderOnePageCVMetrics()
        // renderOnePageCVAcademicInformation()
        // renderOnePageCVAcademicInformation2()
        renderOnePageCVAcademicInformation3()
        // renderOnePageCVExperience()
        // renderOnePageCVExperience2()
        renderOnePageCVExperience3()
        // renderOnePageCVExperience4()
        renderOnePageCVAwards()
        renderOnePageCVCertificates()
        renderOnePageCVPublicationSummary()
        renderOnePageCVPortfolio()
        renderOnePageCVVolunteering()
    }
    catch (error) {
        console.error("Error initializing One-Page CV sections:", error)
    }
    console.log(`One-Page CV rendering finished...`);
}


/**
 * Renders the Profile Image and Contact section for the One-Page CV Sidebar.
 * Loads data from personal_information.json, contact_details.json, and site.json.
 */
function renderOnePageCVSidebarContacts() {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.personal_information || !SITE_DATA.contact_details) return;

    const contactsData = SITE_DATA.contact_details;
    const { section_info: info, contacts } = contactsData;
    const siteAssets = SITE_DATA.site.assets;

    // 1. Update Profile Image
    const profileImg = sidebar.querySelector('img');
    const profileLink = sidebar.querySelector('.glightbox');
    const formalImgPath = siteAssets.images.profile_image_formal;

    if (profileImg) profileImg.src = formalImgPath;
    if (profileLink) profileLink.href = formalImgPath;

    // 2. Update Contact Section Header from JSON
    // Finds the h5 with the sidebar-title class that precedes the contact info
    const contactHeader = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-person-lines-fill') || h.textContent.includes('Contact'));

    if (contactHeader) {
        // Dynamic Title from JSON (Expertise_XX) and hardcoded icon for sidebar consistency
        contactHeader.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Map limited items to bullet points
        // Keys to exclude
        const EXCLUDED_CONTACT_KEYS = [
          'google_scholar',
          'researchgate'
        ];

        // Convert object → entries, filter by key, then map to values
        const contactsArr = Object.entries(contacts)
          .filter(([key]) => !EXCLUDED_CONTACT_KEYS.includes(key))
          .map(([, value]) => value);

        const expHtml = contactsArr.map(item => `
            <li><i class="${item.icon_class}"></i> <a href="${item.link}" target="_blank"> ${item.text} </a> </li>
        `).join('');

        // 3. Update DOM Container
        const listContainer = contactHeader.nextElementSibling;

        if (listContainer && listContainer.tagName === 'UL') {
            listContainer.innerHTML = expHtml;
        }
    }
}

/**
 * Renders the Expertise section for the One-Page CV sidebar.
 * Loads Section Title, Icon, and Items from professional_experiences.json.
 */
function renderOnePageCVSidebarExpertise(limit = 6) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.professional_experiences) return;

    // 1. Locate the block that contains the 'cv_expertise' key
    const expertiseData = SITE_DATA.professional_experiences.summary.expertise_list.find(
        item => 'cv_expertise' in item)

    if (!expertiseData) return;

    // 1. Locate and Update Section Header
    // Finds the h5 with the bi-tools icon or "Expertise" text
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-tools') || h.textContent.includes('Expertise'));

    if (header) {
        // Dynamic Title from JSON (Expertise_XX) and hardcoded icon for sidebar consistency
        header.innerHTML = `<i class="bi bi-tools me-2"></i>${expertiseData.title}`;

        // 2. Map limited items to bullet points
        const expHtml = expertiseData.cv_expertise.slice(0, limit).map(item => `
            <li><i class="bi bi-dot"></i> ${item} </li>
        `).join('');

        // 3. Update DOM Container
        const listContainer = header.nextElementSibling;
        if (listContainer && listContainer.tagName === 'UL') {
            listContainer.innerHTML = expHtml;
        }
    }
}

/**
 * Renders the Research Area section for the One-Page CV sidebar.
 * Logic: Specifically searches for an object containing the 'cv_research_areas' key.
 */
function renderOnePageCVSidebarResearchAreas(limit = 6) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.professional_experiences) return;

    // 1. Locate the block that contains the 'cv_research_areas' key
    const researchData = SITE_DATA.professional_experiences.summary.expertise_list.find(
        item => 'cv_research_areas' in item
    );

    if (!researchData) {
        console.warn("Could not find an object with 'cv_research_areas' in expertise_list.");
        return;
    }

    // 2. Locate and Update Section Header
    // Finds the h5 with the bi-search icon or "Research Area" text
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-search') || h.textContent.includes('Research Area'));

    if (header) {
        // Use the title from the found object (e.g., "Research Areas_XX")
        // This ensures tracking markers like _XX are preserved.
        header.innerHTML = `<i class="bi bi-search me-2"></i>${researchData.title}`;

        // 3. Map items to bullet points
        const resHtml = researchData.cv_research_areas.slice(0, limit).map(item => `
            <li><i class="bi bi-dot"></i> ${item} </li>
        `).join('');

        // 4. Update DOM Container
        const listContainer = header.nextElementSibling;
        if (listContainer && listContainer.tagName === 'UL') {
            listContainer.innerHTML = resHtml;
        }
    }
}

/**
 * Renders the Personal Skills section for the One-Page CV sidebar.
 * Uses the Category Name (e.g., Soft Skills) as the title and section icon.
 */
function renderOnePageCVSidebarPersonalSkills(limit = 7) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.skills_tools) return;

    const { section_info: info, skills = [] } = SITE_DATA.skills_tools;

    // 1. Data Filtering: Find all matching categories
    const keywords = ['soft', 'management', 'leadership', 'personal'];
    const matchedSkills = skills.filter(s =>
        keywords.some(word => s.category.toLowerCase().includes(word))
    );

    if (matchedSkills.length === 0) return;

    // 2. Header Selection: Find the h5 with the bi-person icon or "Personal Skills" text
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi bi-person-workspace') || h.textContent.includes('Personal Skills'));

    if (header) {
        // Use the first matched category's data for the title and icon
        // Use matchedSkills[0] to avoid the ReferenceError
        const primarySkill = matchedSkills[0];

        // Dynamic Title and Icon from JSON
        // header.innerHTML = `<i class="${primarySkill.icon_class} me-2"></i>${primarySkill.category}`;
        header.innerHTML = `<i class="bi bi-person-workspace me-2"></i>Personal Skills`;

        // 3. Process Descriptions: Combine items from all matched categories
        const combinedDesc = matchedSkills.map(ps => ps.short_description).join(', ');
        const skillList = combinedDesc.split(',').map(s => s.trim()).filter(Boolean);

        const skillHtml = skillList.slice(0, limit).map(skill => `
            <li><i class="bi bi-dot"></i> ${skill} </li>
        `).join('');

        // 4. Update DOM Container
        const listContainer = header.nextElementSibling;

        if (listContainer && listContainer.tagName === 'UL') {
            listContainer.innerHTML = skillHtml;
        }
    }
}

/**
 * Renders the Programming section for the One-Page CV sidebar.
 * Dynamically loads title, icon, and items from skills_tools.json.
 */
function renderOnePageCVSidebarProgramming(limit = 10) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.skills_tools) return;

    const { section_info: info, skills = [] } = SITE_DATA.skills_tools;

    // 1. Locate the "Programming" skill object
    const progSkill = skills.find(s => s.category.toLowerCase().includes('programming'));

    if (!progSkill) return;

    // 2. Locate and Update Section Header
    // Finds the h5 that preceded the programming list
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-file-earmark-code') || h.textContent.includes('Programming'));

    if (header) {
        // Dynamic Update: Use Category Name as title + Section Icon
        // header.innerHTML = `<i class="${info.icon_class} me-2"></i>${progSkill.category}`;
        // header.innerHTML = `<i class="bi bi-file-earmark-code me-2"></i>${progSkill.category}`;
        header.innerHTML = `<i class="bi bi-laptop me-2"></i>${progSkill.category}`;

        // 3. Process the comma-separated list of languages
        const languages = progSkill.short_description.split(',').map(lang => lang.trim());
        const displayLanguages = languages.slice(0, limit).join(', ');

        // 4. Update the text container
        const container = header.nextElementSibling;
        if (container && container.classList.contains('sidebar-list')) {
            container.textContent = displayLanguages;
        }
    }
}

/**
 * Renders the Languages section for the One-Page CV sidebar.
 * Dynamically loads title, icon, and items from languages.json.
 */
function renderOnePageCVSidebarLanguages(limit = 3) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.languages) return;

    const { section_info: info, languages = [] } = SITE_DATA.languages;

    // 1. Locate and Update Section Header
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-translate') || h.textContent.includes('Languages'));

    if (header) {
        // header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;
        header.innerHTML = `<i class="bi bi-translate me-2"></i>${info.title}`;

        // 2. Map limited items to comma-separated text
        const langItems = languages.slice(0, limit).map(l => {
            // Extracts shorthand level from status (e.g., "Native_XX")
            return `${l.language} (${l.status})`;
        }).join(', ');

        // 3. Update DOM Container
        const container = header.nextElementSibling;
        if (container && container.classList.contains('sidebar-list')) {
            container.textContent = langItems;
        }
    }
}

/**
 * Renders the Memberships section for the One-Page CV sidebar.
 * Dynamically loads title, icon, and items from oranisational_memberships.json.
 */
function renderOnePageCVSidebarOrganisationalMemberships(limit = 7) {
    const sidebar = document.querySelector('#one-page-section .cv-sidebar');
    if (!sidebar || !SITE_DATA.oranisational_memberships) return;

    const { section_info: info, memberships = [] } = SITE_DATA.oranisational_memberships;

    // 1. Locate and Update Section Header
    const header = Array.from(sidebar.querySelectorAll('h5.sidebar-title'))
        .find(h => h.innerHTML.includes('bi-people') || h.textContent.includes('Membership'));

    if (header) {
        header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Map limited items to bulleted list
        const memHtml = memberships.slice(0, limit).map(mem => {
            // Pull organization name or abbreviation
            const orgName = mem.membership_organization[0]?.name || mem.title;
            // return `<li><i class="bi bi-dot"></i> ${orgName} </li>`;

            // Shorten common long names for sidebar fit
            const part_name = orgName.match(/\(([^)]+)\)/)
            const shortName = part_name?part_name[1]:'';
            return `<li><i class="bi bi-dot"></i> ${mem.title}, ${shortName} </li>`;
        }).join('');

        // 3. Update DOM Container
        const listContainer = header.nextElementSibling;
        if (listContainer && listContainer.tagName === 'UL') {
            listContainer.innerHTML = memHtml;
        }
    }
}



/**
 * Renders the Header and Summary section of the One-Page CV.
 * Maps data directly from personal_information.json.
 * Target: .header-section
 */
function renderOnePageCVHeader() {
    const headerSection = document.querySelector('#one-page-section .header-section');
    if (!headerSection || !SITE_DATA.personal_information) return;

    const personalInfo = SITE_DATA.personal_information;
    const hero = personalInfo.hero;

    // 1. Update Name Header
    const nameHeader = headerSection.querySelector('.one-page-name');
    if (nameHeader) {
        nameHeader.textContent = hero.title_main || "Emran Ali";
    }

    // 2. Update Subtitle (Tagline)
    const subtitle = headerSection.querySelector('.one-page-subtitle');
    if (subtitle) {
        // Constructing subtitle from hero slogans for consistent branding
        const sloganText = hero.main_keywards.hero_slogan.map(s => s.text).join(' | ');
        subtitle.textContent = sloganText || "Education | Research | Development";
    }

    // 3. Update Summary Paragraph
    // Note: Some templates might have the summary hidden or in a specific class
    const summaryPara = headerSection.querySelector('.one-page-summary');
    if (summaryPara) {
        summaryPara.innerHTML = personalInfo.profile_summary?.intro_paragraph_short || "";
        // summaryPara.innerHTML = personalInfo.profile_summary?.intro_paragraph_html || "";
    }
}

/**
 * Renders the small metrics grid for the One-Page CV.
 * Uses calculated data from SITE_DATA.key_information.
 * Target: .row.g-1.mb-2.text-center
 */
async function renderOnePageCVMetrics() {
    // 1. Recalculate metrics from all data sources to ensure fresh numbers
    await refreshKeyMetricsData();

    const metricsGrid = document.querySelector('#one-page-section .row.g-1.mb-2.text-center');
    // Ensure the grid exists and data is loaded
    if (!metricsGrid || !SITE_DATA.key_information) return;

    const metrics = SITE_DATA.key_information.metrics;

    // 2. Map metrics to the compact grid structure dynamically
    metricsGrid.innerHTML = metrics.map(metric => {
        // Use the strong_text from JSON as the label to preserve _XX
        let displayLabel = metric.strong_text;
        let displayValue = metric.value;

        // Automatically append "Years" only if the description implies a duration
        if (metric.description.toLowerCase().includes("experience") ||
            metric.strong_text.toLowerCase().includes("years")) {
            displayValue = `${metric.value} Years`;
        }

        return `
            <div class="col-3">
                <div class="p-1 border rounded bg-light h-100">
                    <strong>${displayValue}</strong><br>${displayLabel}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Renders the Education section for the One-Page CV.
 * Maps data from degrees array in academic_information.json.
 * Target: #one-page-section .cv-main-body (Education Section)
 */
function renderOnePageCVAcademicInformation() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.academic_information) return;

    const data = SITE_DATA.academic_information;
    const sectionInfo = data.section_info;
    const degrees = data.degrees || [];

    // 1. Locate and Update Section Header
    const educationHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-mortarboard') || h.textContent.includes('Education'));

    if (educationHeader) {
        educationHeader.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;

        // 2. Map Degrees Individually
        const educationHtml = degrees.map((edu, index) => {
            const isLast = index === degrees.length - 1;
            const spacingClass = isLast ? 'mb-1' : 'mb-2';

            // Safe Year Extraction: Maps 'Jan. 15, 2023' -> '2023'
            const startYear = edu.timeframe_details?.start_date?.split(',').pop().trim() || "";
            const endYear = edu.timeframe_details?.end_date === "Present"
                ? "Present"
                : (edu.timeframe_details?.end_date?.split(',').pop().trim() || "");

            // Handle Collaboration (Cotutelle) for individual entry
            let collabText = "";
            if (edu.collaboration && edu.collaboration.length > 0) {
                const collab = edu.collaboration[0];
                collabText = `<span class="text-muted">${collab.collaboration_type} Program with ${collab.institution_name}.</span>`;
            }

            // Handle Thesis Title
            const thesisTitle = edu.thesis_details?.thesis_title || "";
            const thesisHtml = thesisTitle ? `<br>Thesis: ${thesisTitle}` : '';

            return `
                <div class="${spacingClass}" style="font-size: 9px; line-height: 1.2;">
                    <div class="d-flex justify-content-between fw-bold">
                        <span><i class="bi bi-mortarboard me-1"></i>${edu.degree_level} in ${edu.degree_major}</span>
                        <span class="small-date">${startYear}${endYear ? ' – ' + endYear : ''}</span>
                    </div>
                    <div class="italic">${edu.institution_name}, ${edu.institution_location}. ${collabText}</div>
                    <div class="text-muted" style="font-size: 8px;">
                        Specialisation: ${edu.specialisation || ""}${thesisHtml}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Update DOM: Remove static placeholders and insert dynamic list
        let currentElement = educationHeader.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        educationHeader.insertAdjacentHTML('afterend', educationHtml);
    }
}

/**
 * Renders the Education section for the One-Page CV.
 * Groups degrees by 'degree_level' and loads title/icon from JSON.
 */
function renderOnePageCVAcademicInformation2() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.academic_information) return;

    const data = SITE_DATA.academic_information;
    const sectionInfo = data.section_info;
    const degrees = data.degrees || [];

    // 1. Locate and Update Section Header
    const educationHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-mortarboard') || h.textContent.includes('Education'));

    if (educationHeader) {
        educationHeader.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;

        // 2. Grouping logic: Group degrees based on degree_level
        const grouped = [];
        const levelMap = new Map();

        degrees.forEach(edu => {
            const level = edu.degree_level?.trim();
            if (level && levelMap.has(level)) {
                levelMap.get(level).push(edu);
            } else {
                const group = [edu];
                grouped.push(group);
                if (level) levelMap.set(level, group);
            }
        });

        // 3. Map grouped data to HTML
        const educationHtml = grouped.map((group, index) => {
            const isLast = index === grouped.length - 1;
            const spacingClass = isLast ? 'mb-1' : 'mb-2';
            const first = group[0];

            // Year Extraction
            const startYear = first.timeframe_details?.start_date?.split(',').pop().trim() || "";
            const endYear = first.timeframe_details?.end_date === "Present"
                ? "Present"
                : (first.timeframe_details?.end_date?.split(',').pop().trim() || "");

            let titleHtml = "";
            let institutionHtml = "";

            if (group.length > 1) {
                // Merged view for Joint Programs
                const combinedMajors = [...new Set(group.map(e => e.degree_major))].join(' & ');
                const combinedInstitutions = group.map(e => {
                    const country = e.institution_location?.split(',').pop().trim() || "";
                    return `${e.institution_name} (${country})`;
                }).join(' & ');

                titleHtml = `<span><i class="bi bi-mortarboard me-1"></i>${first.degree_level} in ${combinedMajors}</span>`;
                institutionHtml = `<div class="italic">${combinedInstitutions}. <span class="text-muted">Joint / Cotutelle Program.</span></div>`;
            } else {
                // Standalone degree view
                const major = first.degree_short_name || first.degree_major;
                titleHtml = `<span><i class="bi bi-mortarboard me-1"></i>${first.degree_level} in ${major}</span>`;
                institutionHtml = `<div class="italic">${first.institution_name}, ${first.institution_location}.</div>`;
            }

            const thesisTitle = first.thesis_details?.thesis_title || "";
            const thesisHtml = thesisTitle ? `<br>Thesis: ${thesisTitle}` : '';

            return `
                <div class="${spacingClass}" style="font-size: 9px; line-height: 1.2;">
                    <div class="d-flex justify-content-between fw-bold">
                        ${titleHtml}
                        <span class="small-date">${startYear}${endYear ? ' – ' + endYear : ''}</span>
                    </div>
                    ${institutionHtml}
                    <div class="text-muted" style="font-size: 8px;">
                        Specialisation: ${first.specialisation || ""}${thesisHtml}
                    </div>
                </div>
            `;
        }).join('');

        // 4. Update DOM
        let currentElement = educationHeader.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        educationHeader.insertAdjacentHTML('afterend', educationHtml);
    }
}

/**
 * Renders the Education section for the One-Page CV.
 * Groups degrees by 'degree_level' and loads title/icon from JSON.
 * More compact and less description
 */
function renderOnePageCVAcademicInformation3() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.academic_information) return;

    const { section_info: info, degrees = [] } = SITE_DATA.academic_information;

    // 1. Update Section Header from JSON
    const header = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-mortarboard') || h.textContent.includes('Education'));

    if (header) {
        header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Group degrees by level
        const grouped = [];
        const levelMap = new Map();
        degrees.forEach(edu => {
            const level = edu.degree_level?.trim();
            if (level && levelMap.has(level)) levelMap.get(level).push(edu);
            else {
                const group = [edu];
                grouped.push(group);
                if (level) levelMap.set(level, group);
            }
        });

        // 3. Map to compact HTML
        const educationHtml = grouped.map((group, idx) => {
            const first = group[0];
            const start = first.timeframe_details?.start_date?.split(',').pop().trim() || "";
            const end = first.timeframe_details?.end_date === "Present" ? "Present" : (first.timeframe_details?.end_date?.split(',').pop().trim() || "");

            // Compact Title & Institution logic
            const title = group.length > 1
                ? `${first.degree_level} in ${[...new Set(group.map(e => e.degree_major))].join(' & ')}`
                : `${first.degree_level} in ${first.degree_major}`;

            const inst = group.length > 1
                ? group.map(e => `${e.institution_name} (${e.institution_location?.split(',').pop().trim()})`).join(' & ') + '. <span class="text-muted">Joint Program.</span>'
                : `${first.institution_name}, ${first.institution_location}.`;

            return `
                <div class="${idx === grouped.length - 1 ? 'mb-1' : 'mb-2'}" style="font-size: 9px; line-height: 1.1;">
                    <div class="d-flex justify-content-between fw-bold">
                        <span><i class="${first.icon_class} me-1"></i>${title}</span>
                        <span class="small-date">${start}${end ? ' – ' + end : ''}</span>
                    </div>
                    <div class="italic">${inst}</div>
                    <div class="text-muted" style="font-size: 8px;">
                        ${first.specialisation || ""}
                    </div>
                </div>
            `;
        }).join('');

        // 4. Update DOM
        let cur = header.nextElementSibling;
        while (cur && cur.tagName === 'DIV') {
            const next = cur.nextElementSibling;
            cur.remove();
            cur = next;
        }
        header.insertAdjacentHTML('afterend', educationHtml);
    }
}



/**
 * Renders the Professional Experience section for the One-Page CV.
 * Groups by Category -> Organisation and merges multiple roles into single list items.
 */
function renderOnePageCVExperience() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.professional_experiences) return;

    const data = SITE_DATA.professional_experiences;
    const sectionInfo = data.section_info;
    const experiences = data.experiences || [];

    const experienceHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-briefcase') || h.textContent.includes('Experience'));

    if (experienceHeader) {
        // 1. Update Title and Icon from JSON
        experienceHeader.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;

        // 2. Map Categories and Orgs
        const experienceHtml = experiences.map((cat) => {
            const orgsHtml = cat.organisation.map((org) => {
                // Calculate aggregate timeframe for the organisation
                const startYears = org.roles.map(r => r.timeframe_details.start_date.split(',').pop().trim());
                const endDates = org.roles.map(r => r.timeframe_details.end_date);
                const displayStart = startYears.sort()[0];
                const displayEnd = endDates.includes("Present") ? "Present" : endDates.map(d => d.split(',').pop().trim()).sort().reverse()[0];

                const roleTitles = [...new Set(org.roles.map(r => r.title))].join(" / ");
                const bulletPoints = org.roles.map(r => `<li>${r.about_job}</li>`).join('');

                return `
                    <div class="ms-2 mb-2">
                        <div class="fw-bold text-dark">
                            <i class="bi bi-building me-2"></i>${org.organization}, 
                            <span class="text-muted italic">${org.location}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span><i class="bi bi-briefcase me-2"></i>${roleTitles}</span>
                            <span class="small-date">${displayStart} – ${displayEnd}</span>
                        </div>
                        <div class="text-muted" style="font-size: 8px;">
                            <ul>${bulletPoints}</ul>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="mb-2" style="font-size: 9px; line-height: 1.2;">
                    <div class="fw-bold text-dark">
                        <i class="${cat.organisation[0].icon_class} me-2"></i>${cat.category}
                    </div>
                    ${orgsHtml}
                </div>
            `;
        }).join('');

        // 3. Update DOM
        let currentElement = experienceHeader.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        experienceHeader.insertAdjacentHTML('afterend', experienceHtml);
    }
}

/**
 * Renders the Professional Experience section for the One-Page CV.
 * Groups all roles by Organisation across categories to save space.
 * Compact version
 */
function renderOnePageCVExperience2() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.professional_experiences) return;

    const data = SITE_DATA.professional_experiences;
    const sectionInfo = data.section_info;
    const experiences = data.experiences || [];

    // 1. Locate and Update Main Section Header
    const experienceHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-briefcase') || h.textContent.includes('Experience'));

    if (experienceHeader) {
        // Dynamic title and icon from JSON
        experienceHeader.innerHTML = `<i class="${sectionInfo.icon_class} me-2"></i>${sectionInfo.title}`;

        // 2. Group all roles by Organization across all categories
        const orgMap = new Map();

        experiences.forEach(cat => {
            cat.organisation.forEach(org => {
                const orgKey = org.organization;
                if (!orgMap.has(orgKey)) {
                    orgMap.set(orgKey, {
                        name: orgKey,
                        location: org.location,
                        icon: org.icon_class || 'bi-building',
                        roles: []
                    });
                }
                // Push all roles found for this organization
                org.roles.forEach(role => {
                    orgMap.get(orgKey).roles.push(role);
                });
            });
        });

        // 3. Map Grouped Organizations to HTML
        const experienceHtml = Array.from(orgMap.values()).map((org) => {
            // Calculate aggregate timeframe for the organization
            const startYears = org.roles.map(r => r.timeframe_details.start_date.split(',').pop().trim());
            const endDates = org.roles.map(r => r.timeframe_details.end_date);

            const displayStart = startYears.sort()[0];
            const displayEnd = endDates.includes("Present")
                ? "Present"
                : endDates.map(d => d.split(',').pop().trim()).sort().reverse()[0];

            // Join unique role titles and all "about_job" descriptions
            const roleTitles = [...new Set(org.roles.map(r => r.title))].join(" / ");
            const jobBullets = org.roles.map(r => r.about_job ? `<li>${r.about_job}</li>` : "").join("");

            return `
                <div class="ms-2 mb-2" style="font-size: 9px; line-height: 1.2;">
                    <div class="fw-bold text-dark">
                        <i class="bi bi-building me-2"></i>${org.name}, 
                        <span class="text-muted italic">${org.location}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span><i class="bi bi-briefcase me-2"></i>${roleTitles}</span>
                        <span class="small-date">${displayStart} – ${displayEnd}</span>
                    </div>
                    <div class="text-muted" style="font-size: 8px;">
                        <ul>${jobBullets}</ul>
                    </div>
                </div>
            `;
        }).join('');

        // 4. Update DOM: Clear old static divs and insert dynamic blocks
        let currentElement = experienceHeader.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        experienceHeader.insertAdjacentHTML('afterend', experienceHtml);
    }
}

/**
 * Renders the Professional Experience section for the One-Page CV.
 * Groups all roles by Organisation across categories to save space.
 * More compact version
 */
function renderOnePageCVExperience3() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.professional_experiences) return;

    const { section_info: info, experiences = [] } = SITE_DATA.professional_experiences;

    // 1. Update Main Section Header from JSON
    const header = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-briefcase') || h.textContent.includes('Experience'));

    if (header) {
        header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Group all roles by Organization across all categories
        const orgMap = new Map();
        experiences.forEach(cat => {
            cat.organisation.forEach(org => {
                const orgKey = org.organization;
                if (!orgMap.has(orgKey)) {
                    orgMap.set(orgKey, {
                        name: orgKey,
                        location: org.location,
                        roles: []
                    });
                }
                org.roles.forEach(role => orgMap.get(orgKey).roles.push(role));
            });
        });

        // 3. Map Grouped Organizations to Compact HTML
        const experienceHtml = Array.from(orgMap.values()).map((org) => {
            const startYears = org.roles.map(r => r.timeframe_details.start_date.split(',').pop().trim());
            const endDates = org.roles.map(r => r.timeframe_details.end_date);
            const displayStart = startYears.sort()[0];
            const displayEnd = endDates.includes("Present")
                ? "Present"
                : endDates.map(d => d.split(',').pop().trim()).sort().reverse()[0];

            // Join roles and summaries into a compact block
            const roleTitles = [...new Set(org.roles.map(r => r.title))].join(" / ");

            // Collect unique summaries and join them with semicolons or simple line breaks
            const jobSummaries = [...new Set(org.roles.map(r => r.about_job))]
                .filter(Boolean)
                .join('; ');

            return `
                <div class="ms-1 mb-2" style="font-size: 9px; line-height: 1.1;">
                    <div class="fw-bold text-dark">
                        <i class="bi bi-building me-1"></i>${org.name}, 
                        <span class="text-muted italic">${org.location}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold"><i class="bi bi-briefcase me-1"></i>${roleTitles}</span>
                        <span class="small-date">${displayStart} – ${displayEnd}</span>
                    </div>
                    <div class="text-muted" style="font-size: 8px;">
                        ${jobSummaries}
                    </div>
                </div>
            `;
        }).join('');

        // 4. Update DOM
        let currentElement = header.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        header.insertAdjacentHTML('afterend', experienceHtml);
    }
}

/**
 * Renders the Professional Experience section for the One-Page CV.
 * Groups all roles by Organisation across categories to save space.
 * Most compact version
 */
function renderOnePageCVExperience4() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.professional_experiences) return;

    const { section_info: info, experiences = [] } = SITE_DATA.professional_experiences;

    // 1. Update Main Section Header from JSON
    const header = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-briefcase') || h.textContent.includes('Experience'));

    if (header) {
        header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Group all roles by Organization across all categories
        const orgMap = new Map();
        experiences.forEach(cat => {
            cat.organisation.forEach(org => {
                const orgKey = org.organization;
                if (!orgMap.has(orgKey)) {
                    orgMap.set(orgKey, {
                        name: orgKey,
                        location: org.location,
                        roles: []
                    });
                }
                org.roles.forEach(role => orgMap.get(orgKey).roles.push(role));
            });
        });

        // 3. Map Grouped Organizations to Compact HTML
        const experienceHtml = Array.from(orgMap.values()).map((org) => {
            const startYears = org.roles.map(r => r.timeframe_details.start_date.split(',').pop().trim());
            const endDates = org.roles.map(r => r.timeframe_details.end_date);
            const displayStart = startYears.sort()[0];
            const displayEnd = endDates.includes("Present")
                ? "Present"
                : endDates.map(d => d.split(',').pop().trim()).sort().reverse()[0];

            // Join roles and summaries into a compact block
            const roleTitles = [...new Set(org.roles.map(r => r.title))].join(" / ");

            return `
                <div class="ms-1 mb-2" style="font-size: 9px; line-height: 1.1;">
                    <div class="fw-bold text-dark">
                        <i class="bi bi-building me-1"></i>${org.name}, 
                        <span class="text-muted italic">${org.location}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold"><i class="bi bi-briefcase me-1"></i>${roleTitles}</span>
                        <span class="small-date">${displayStart} – ${displayEnd}</span>
                    </div>
                    <div class="text-muted" style="font-size: 8px;">
                    </div>
                </div>
            `;
        }).join('');

        // 4. Update DOM
        let currentElement = header.nextElementSibling;
        while (currentElement && currentElement.tagName === 'DIV') {
            const next = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = next;
        }
        header.insertAdjacentHTML('afterend', experienceHtml);
    }
}


/**
 * Renders the Honors and Awards section for the One-Page CV.
 * - Groups multiple scholarship phases into single lines.
 * - Merges Cotutelle & DUPR scholarships into one high-impact entry.
 * - Loads Section Title and Icon from honors_awards.json.
 */
function renderOnePageCVAwards(limit=7) {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.honors_awards) return;

    const { section_info: info, honorsawards = [] } = SITE_DATA.honors_awards;

    // 1. Locate and Update Section Header
    const header = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-award') || h.textContent.includes('Honors'));

    if (header) {
        // Dynamic title and icon from JSON
        header.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Limit to top `limit` items
        const limitedAwards = honorsawards.slice(0, limit);

        // 3. Map the limited array to HTML
        let awardsHtml = limitedAwards.map(aw => {
            // Extract year (e.g., "2024")
            const year = aw.date.split(',').pop().trim().split(' ')[0];
            const icon = aw.icon_class || "bi bi-award";

            return `
                <div class="d-flex justify-content-between" style="font-size: 8.5px; line-height: 1.2;">
                    <span>
                        <i class="${icon} me-1"></i>
                        <strong>${aw.title}</strong> – ${aw.issuer_organization.name}
                    </span>
                    <span class="small-date">${year}</span>
                </div>
            `;
        }).join('');
        awardsHtml += `
        <div class="d-flex justify-content-between" style="font-size: 8.5px; line-height: 1.2;">
            <strong> ${honorsawards.length-limitedAwards.length} more awards... </strong>
        </div>
        `;

        // 4. Update the container
        const listContainer = header.nextElementSibling;
        if (listContainer && listContainer.classList.contains('ms-1')) {
            listContainer.innerHTML = awardsHtml;
        }
    }
}

/**
 * Renders a compact, dynamic "Key Certificates" section for the One-Page CV.
 * Groups similar certifications and provides a summary for the remainder.
 */
function renderOnePageCVCertificates(limit = 5) {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.courses_trainings_certificates) return;

    const { section_info: info, coursestrainingscertificates: certs = [] } = SITE_DATA.courses_trainings_certificates;

    // 1. Locate the correct header (look for bi-patch-check icon)
    const certHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-patch-check') || h.textContent.includes('Certificates'));

    if (certHeader) {
        // Update Title and Icon from JSON
        certHeader.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Select high-priority items (those with a serial_no)
        const priorityCerts = certs
            .filter(c => c.serial_no && c.serial_no !== "")
            .sort((a, b) => parseInt(a.serial_no) - parseInt(b.serial_no))
            .slice(0, limit);

        const certsHtml = priorityCerts.map(cert => {
            // Shorten the organization name for the compact view
            const org = cert.details.funding_organization
                ? `${cert.details.funding_organization}/${cert.details.offering_organization}`
                : cert.details.offering_organization;

            // Use the first summary point from key_information
            const summary = cert.details.key_information?.[0] || "";

            // FIXED: Closed the <strong> tag to match Portfolio formatting exactly
            return `
            <div class="mb-1">
                <span class="fw-bold text-dark">
                    <i class="${cert.icon_class} me-1"></i>${org}:
                </span> ${cert.title} – <span class="text-muted">${summary}</span>
            </div>
            `;
        }).join('');

        // 3. Calculate remaining certifications
        const remainingCount = certs.length - priorityCerts.length;
        const footerHtml = remainingCount > 0
            ? `<div class="text-muted italic mt-1"> +${remainingCount} additional certifications in Python, Data Science, and BCI.</div>`
            : "";

        // 4. Update DOM Container
        const listContainer = certHeader.nextElementSibling;
        if (listContainer) {
            listContainer.innerHTML = certsHtml + footerHtml;
        }
    }
}

/**
 * Renders a fully dynamic Publication Summary for the One-Page CV.
 * Iterates through all categories in publications.json to extract titles and counts.
 */
function renderOnePageCVPublicationSummary() {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.publications) return;

    const { section_info: info, publications: categories } = SITE_DATA.publications;

    // 1. Locate and Update Section Header
    const pubHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-file-richtext') || h.textContent.includes('Publications'));

    if (pubHeader) {
        pubHeader.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Dynamically extract all categories and their item counts
        const summaryGridItemsHtml = Object.keys(categories).map(key => {
            const group = categories[key];
            const count = group.items?.length || 0;
            // Use the group.type (e.g., "Journal_XX") as the label
            const label = group.type || key;

            return `
                <div class="col-3">
                    <div class="p-1 border rounded bg-light h-100">
                        <strong>${count}</strong><br>${label}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Construct the dynamic grid container
        const summaryHtml = `
            <div class="row g-1 mb-2 text-center" style="font-size: 8px; line-height: 1.1;">
                ${summaryGridItemsHtml}
            </div>
        `;

        // 4. Update the DOM: Replace or insert the grid
        const summaryContainer = pubHeader.nextElementSibling;
        if (summaryContainer && summaryContainer.classList.contains('row')) {
            summaryContainer.outerHTML = summaryHtml;
        } else {
            pubHeader.insertAdjacentHTML('afterend', summaryHtml);
        }
    }
}

/**
 * Renders the Portfolio section for the One-Page CV.
 * Dynamically loads repository information from portfolios.json.
 * Target: .col-5 inside the One-Page CV main body row.
 */
function renderOnePageCVPortfolio(limit=2) {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.portfolios) return;

    const { section_info: info, portfolios = [] } = SITE_DATA.portfolios;

    // 1. Locate the correct header (look for bi-github or "Portfolio")
    const portfolioHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bi-github') || h.textContent.includes('Portfolio'));

    if (portfolioHeader) {
        // Update Title and Icon from JSON metadata
        portfolioHeader.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Map the portfolio items to the compact template
        const portfolioHtml = portfolios.slice(0, limit).map(item => `
            <div class="mb-2">
                <span class="fw-bold text-dark">
                    <i class="${item.icon_class} me-2"></i>${item.title}:
                </span> ${item.description} | ${item.portfolio_url.replace("https://github.com/", "@")};
            </div>
        `).join('');

        // 3. Update the list container following the header
        const listContainer = portfolioHeader.nextElementSibling;
        if (listContainer && listContainer.tagName === 'DIV') {
            listContainer.innerHTML = portfolioHtml;
        }
    }
}

/**
 * Renders the Volunteering Services section for the One-Page CV.
 * Dynamically loads data from volunteering_services.json and matches current formatting.
 */
function renderOnePageCVVolunteering(limit=2) {
    const mainBody = document.querySelector('#one-page-section .cv-main-body');
    if (!mainBody || !SITE_DATA.volunteering_services) return;

    const { section_info: info, volunteerings = [] } = SITE_DATA.volunteering_services;

    // 1. Locate the correct header (look for bx-donate-heart or "Volunteering")
    const volHeader = Array.from(mainBody.querySelectorAll('h6'))
        .find(h => h.innerHTML.includes('bx-donate-heart') || h.textContent.includes('Volunteering'));

    if (volHeader) {
        // Update Title and Icon from JSON metadata
        volHeader.innerHTML = `<i class="${info.icon_class} me-2"></i>${info.title}`;

        // 2. Map the volunteering items to the compact template
        // Limiting to top 2 items to fit the space
        const volHtml = volunteerings.slice(0, limit).map(item => `
            <div class="mb-1">
                <span class="fw-bold text-dark">
                    <i class="${item.icon_class} me-1"></i>${item.organization}:
                </span> ${item.title} (${item.cause}).
            </div>
        `).join('');

        // 3. Update the DOM container
        const listContainer = volHeader.nextElementSibling;
        if (listContainer && listContainer.tagName === 'DIV') {
            listContainer.innerHTML = volHtml;
        }
    }
}





// *********************************************************************
/**
 * Generalised controller to render section details with a sticky title and row-based list.
 * @param {string} sectionKey - The key in SITE_DATA (e.g., 'academic_information')
 */
function renderPageDetailsPage(pageKey){
    const data = SITE_DATA[pageKey];
    // if (!data) return;
    // If the section doesn't exist in your SITE_DATA, redirect to 404
    if (!data) {
        window.location.href = '404.html';
        return;
    }
    console.log(`Rendering ${pageKey} details page...`);

    // 1. Update the Sticky Title in the top bar
    const stickyTitle = document.querySelector('.cv-nav-title');
    if (stickyTitle) {
        stickyTitle.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i> ${data.section_info.title}`;
    }

    // 2. Update the Main Section Heading and tagline
    const mainTitle = document.getElementById('section-main-title');
    const mainDesc = document.getElementById('section-main-description');

    // if (mainTitle) {
    //     mainTitle.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i> ${data.section_info.title}`;
    // }
    if (mainDesc) {
        mainDesc.textContent = data.section_info.details;
    }

    // 3. Delegate list rendering based on section type
    if (pageKey === 'copyright') {
        console.log(`Showing ${pageKey} details page:`, (pageKey === 'copyright'));
        renderFullCopyrightDetails(data.copyrights);
    }
    else if (pageKey === 'diary') {
        console.log(`Showing ${pageKey} details page:`, (pageKey === 'diary'));
        renderFullDiaryDetails(data.diaryentries);
    }
    else if (pageKey === 'gallery') {
        console.log(`Showing ${pageKey} details page:`, (pageKey === 'gallery'));
        renderFullGalleryDetails(data.images);
    }
    else if (pageKey === 'ea_logo') {
        console.log(`Showing ${pageKey} details page:`, (pageKey === 'ea_logo'));
        renderFullLogoDetails(data.logos);
    }
    else{

        if (!SITE_DATA[pageKey]) {
            window.location.href = '404.html';
            return;
        }
        console.warn(`Unknown page type: ${pageKey}`);
    }
}


/**
 * Renders Copyright Information using a modern card-based layout.
 * Features version history, ownership details, and modification logs.
 * @param {Array} copyrights - The copyrights array from copyright.json.
 */
function renderFullCopyrightDetails(copyrights) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !copyrights) return;

    listContainer.innerHTML = ''; // Clear existing content

    copyrights.forEach((item, index) => {
        // 1. Process Modifications List
        let modsHtml = '';
        if (item.modifications && item.modifications.length > 0) {
            modsHtml = `
                <div class="mt-3">
                    <strong class="small"><i class="bi bi-gear-wide-connected me-2"></i>Version Modifications:</strong>
                    <ul class="mb-0 mt-2 small list-unstyled">
                        ${item.modifications.map(mod => `
                            <li class="mb-2 d-flex align-items-start">
                                <i class="bi bi-patch-check-fill text-primary me-2 mt-1"></i>
                                <span>${mod}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>`;
        }

        // 2. Status Badge Logic (Highlight current version)
        const isCurrent = index === 0;
        const statusBadge = isCurrent
            ? `<span class="badge badge-status bg-success text-white border-0"><i class="bi bi-check-circle-fill me-1"></i> Current Release</span>`
            : `<span class="badge badge-status bg-secondary text-white border-0"><i class="bi bi-archive me-1"></i> Archived Version</span>`;

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="bi bi-shield-lock me-2" style="color: var(--accent-color);"></i>Version ${item.version}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-person-check me-1"></i> Rights Holder: 
                                    <span class="text-primary">${item.right_to_copy}</span>
                                </p>
                            </div>
                            <div class="mt-2 mt-md-0">
                                ${statusBadge}
                            </div>
                        </div>

                        <div class="mb-4 d-flex flex-wrap gap-2">
                            <span class="badge badge-dates"><i class="bi bi-bookmark-fill me-1"></i> Build ID: ${item.id_ref}</span>
                            <span class="badge badge-institute"><i class="bi bi-file-earmark-text me-1"></i> Documentation v${item.version}</span>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Usage Terms & Description</h6>
                                    ${item.description}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4">
                                ${modsHtml}
                                ${!modsHtml ? `
                                    <div class="p-3 bg-light rounded text-center small italic text-muted">
                                        <i class="bi bi-info-circle me-1"></i> Initial release version.
                                    </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}


/**
 * Renders Diary entries sorted by latest date first.
 * Includes multi-select filters with icons and explicit date badges.
 * @param {Object} data - The diaryentries object from diary.json.
 */
function renderFullDiaryDetails(data) {
    const listContainer = document.getElementById('details-list-container');
    const descriptionSection = document.querySelector('.section-title');
    if (!listContainer || !data) return;

    // 1. Flatten all entries and Sort by Date (Latest First)
    let allEntries = [];
    Object.keys(data).forEach(category => {
        data[category].forEach(entry => {
            allEntries.push({ ...entry, category });
        });
    });

    // Precise date sorting
    allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Extract Unique Tags
    const uniqueTags = new Set();
    allEntries.forEach(entry => {
        if (entry.tags) {
            entry.tags.split(',').forEach(t => uniqueTags.add(t.trim()));
        }
    });

    // 3. Multi-Select Filter UI with Icons
    if (descriptionSection) {
        const oldFilter = document.getElementById('diary-filter-container');
        if (oldFilter) oldFilter.remove();

        const filterHtml = `
            <div id="diary-filter-container" class="col-12 mb-5 text-center" data-aos="fade-up">
                <h6 class="fw-bold mb-3 small text-uppercase" style="letter-spacing: 1px; color: var(--accent-color);">
                    <i class="bi bi-funnel-fill me-2"></i>Filter Themes (Multi-select):
                </h6>
                <div class="d-flex flex-wrap justify-content-center gap-2" id="diary-tags-group">
                    <button class="btn btn-sm btn-outline-primary active diary-filter-btn" data-tag="all">
                        <i class="bi bi-layers-half me-1"></i>All Stories
                    </button>
                    ${Array.from(uniqueTags).map(tag => `
                        <button class="btn btn-sm btn-outline-primary diary-filter-btn" data-tag="${tag}">
                            <i class="bi bi-tag me-1"></i>${tag}
                        </button>
                    `).join('')}
                </div>
            </div>`;
        descriptionSection.insertAdjacentHTML('afterend', filterHtml);

        let activeTags = new Set(['all']);

        document.querySelectorAll('.diary-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tag = this.getAttribute('data-tag');

                if (tag === 'all') {
                    activeTags.clear();
                    activeTags.add('all');
                } else {
                    activeTags.delete('all');
                    if (activeTags.has(tag)) activeTags.delete(tag);
                    else activeTags.add(tag);
                }

                if (activeTags.size === 0) activeTags.add('all');

                document.querySelectorAll('.diary-filter-btn').forEach(b => {
                    const bTag = b.getAttribute('data-tag');
                    if (activeTags.has(bTag)) b.classList.add('active');
                    else b.classList.remove('active');
                });

                const filtered = activeTags.has('all')
                    ? allEntries
                    : allEntries.filter(e => {
                        const entryTags = e.tags ? e.tags.split(',').map(t => t.trim()) : [];
                        return Array.from(activeTags).some(selected => entryTags.includes(selected));
                    });

                renderDiaryCards(filtered);
            });
        });
    }

    // 4. Render Diary Cards with Date Display
    function renderDiaryCards(entries) {
        listContainer.innerHTML = '';
        entries.forEach((entry, index) => {
            const tags = entry.tags ? entry.tags.split(',').map(t => t.trim()) : [];
            const tagsHtml = `<div class="d-flex flex-wrap gap-2 mb-4">
                ${tags.map(tag => `<span class="badge badge-institute"><i class="bi bi-tag me-1"></i>${tag}</span>`).join('')}
            </div>`;

            const cardHtml = `
                <div class="col-12 mb-5" data-aos="fade-up" data-aos-delay="${index * 30}" id="${entry.id_ref}">
                    <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                                <div>
                                    <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                        <i class="bi bi-bookmark-star me-2" style="color: var(--accent-color);"></i>${entry.title}
                                    </h4>
                                    <span class="text-muted small italic"><i class="bi bi-folder2-open me-1"></i> ${entry.category}</span>
                                </div>
                                <div class="mt-2 mt-md-0">
                                    <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                        <i class="bi bi-calendar3 me-1"></i> ${entry.date}
                                    </span>
                                </div>
                            </div>

                            ${tagsHtml}

                            <div class="row">
                                <div class="col-lg-7 border-end">
                                    <div class="diary-narrative small text-secondary">
                                        ${entry.paragraphs.map(p => `<p class="mb-3 text-justify" style="line-height: 1.7; font-size: 15px;">${p}</p>`).join('')}
                                    </div>
                                </div>
                                <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                    ${entry.image_path ? `
                                        <div class="mb-3">
                                            <a href="${entry.image_path}" class="glightbox" data-gallery="diary-gallery" title="${entry.title}">
                                                <img src="${entry.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover;" alt="${entry.title}">
                                            </a>
                                            ${entry.image_caption ? `<div class="mt-2 p-3 bg-light rounded border-start border-3 italic small text-muted" style="border-color: var(--accent-color) !important;">${entry.image_caption}</div>` : ''}
                                        </div>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            listContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        if (typeof GLightbox === 'function') GLightbox({ selector: '.glightbox' });
    }

    renderDiaryCards(allEntries);
}


/**
 * Renders the Gallery with a multi-select tag filter and responsive image grid.
 * Features full-width clickable previews and styled descriptions.
 * @param {Object} data - The gallery object from gallery.json.
 */
function renderFullGalleryDetails(data) {
    const listContainer = document.getElementById('details-list-container');
    const descriptionSection = document.querySelector('.section-title');
    if (!listContainer || !data) return;

    const allImages = data;

    // 1. Extract Unique Tags for Filtering
    const uniqueTags = new Set();
    allImages.forEach(img => {
        if (img.tags) {
            img.tags.split(',').forEach(t => uniqueTags.add(t.trim()));
        }
    });

    // 2. Insert Multi-Select Filter UI
    if (descriptionSection) {
        const oldFilter = document.getElementById('gallery-filter-container');
        if (oldFilter) oldFilter.remove();

        const filterHtml = `
            <div id="gallery-filter-container" class="col-12 mb-5 text-center" data-aos="fade-up">
                <h6 class="fw-bold mb-3 small text-uppercase" style="letter-spacing: 1px; color: var(--accent-color);">
                    <i class="bi bi-funnel-fill me-2"></i>Filter by Themes (Multi-select):
                </h6>
                <div class="d-flex flex-wrap justify-content-center gap-2" id="gallery-tags-group">
                    <button class="btn btn-sm btn-outline-primary active gallery-filter-btn" data-tag="all">
                        <i class="bi bi-layers-half me-1"></i>All Images
                    </button>
                    ${Array.from(uniqueTags).map(tag => `
                        <button class="btn btn-sm btn-outline-primary gallery-filter-btn" data-tag="${tag}">
                            <i class="bi bi-hash me-1"></i>${tag}
                        </button>
                    `).join('')}
                </div>
            </div>`;
        descriptionSection.insertAdjacentHTML('afterend', filterHtml);

        // Multi-select Logic
        let activeTags = new Set(['all']);

        document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tag = this.getAttribute('data-tag');

                if (tag === 'all') {
                    activeTags.clear();
                    activeTags.add('all');
                } else {
                    activeTags.delete('all');
                    if (activeTags.has(tag)) activeTags.delete(tag);
                    else activeTags.add(tag);
                }

                if (activeTags.size === 0) activeTags.add('all');

                // Update UI state
                document.querySelectorAll('.gallery-filter-btn').forEach(b => {
                    const bTag = b.getAttribute('data-tag');
                    if (activeTags.has(bTag)) b.classList.add('active');
                    else b.classList.remove('active');
                });

                // Apply Multi-filter
                const filtered = activeTags.has('all')
                    ? allImages
                    : allImages.filter(img => {
                        const imgTags = img.tags ? img.tags.split(',').map(t => t.trim()) : [];
                        return Array.from(activeTags).some(selected => imgTags.includes(selected));
                    });

                renderGalleryGrids(filtered);
            });
        });
    }

    // 3. Helper to render image grid
    function renderGalleryGrids(images) {
        // Clear container and reset for grid layout
        listContainer.innerHTML = '';
        listContainer.className = "row gy-4"; // Ensure standard Bootstrap grid

        if (images.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-muted py-5 col-12">No images found for these themes.</p>';
            return;
        }

        images.forEach((img, index) => {
            const tagsHtml = img.tags ? img.tags.split(',').map(t =>
                `<span class="badge badge-institute me-1 mb-1" style="font-size: 10px;">#${t.trim()}</span>`
            ).join('') : '';

            const gridHtml = `
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 30}">
                    <div class="card h-100 shadow-sm border-0" style="border-radius: 12px; overflow: hidden;">
                        <div class="position-relative overflow-hidden">
                            <a href="${img.image_path}" class="glightbox" data-gallery="full-gallery" title="${img.title}">
                                <img src="${img.image_path}" class="img-fluid w-100" style="height: 250px; object-fit: cover; transition: 0.3s;" alt="${img.title}">
                                <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 opacity-0 hover-overlay" style="transition: 0.3s;">
                                    <i class="bi bi-zoom-in text-white fs-2"></i>
                                </div>
                            </a>
                        </div>
                        
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="fw-bold text-dark mb-0" style="font-size: 16px;">${img.title}</h5>
                                <span class="badge bg-light text-primary border-0 small" style="font-size: 10px; text-transform: uppercase;">${img.category}</span>
                            </div>
                            <p class="text-secondary small mb-3" style="line-height: 1.5;">${img.description}</p>
                            <div class="mt-auto">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                </div>`;
            listContainer.insertAdjacentHTML('beforeend', gridHtml);
        });

        // Initialise GLightbox for gallery
        if (typeof GLightbox === 'function') {
            GLightbox({ selector: '.glightbox' });
        }
    }

    // Initial Render
    renderGalleryGrids(allImages);
}


/**
 * Renders the EA Logos section using a clean, modern grid.
 * Optimized for displaying both static PNGs and animated GIFs.
 * @param {Object} data - The logos object from ea_logo.json.
 */
function renderFullLogoDetails(data) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !data) return;

    // Set the container to a Bootstrap row grid
    listContainer.innerHTML = '';
    listContainer.className = "row gy-4";

    data.forEach((logo, index) => {
        // Determine if the file is an animation for potential labeling
        const isAnimated = logo.image_path.toLowerCase().endsWith('.gif');

        const cardHtml = `
            <div class="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 30}">
                <div class="card h-100 shadow-sm border-0" style="border-radius: 12px; overflow: hidden; transition: transform 0.3s ease;">
                    
                    <div class="position-relative d-flex align-items-center justify-content-center bg-white p-4" style="height: 200px;">
                        <a href="${logo.image_path}" class="glightbox" data-gallery="logo-gallery" title="${logo.title}">
                            <img src="${logo.image_path}" 
                                 class="img-fluid" 
                                 style="max-height: 150px; object-fit: contain;" 
                                 alt="${logo.title}">
                            
                            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-10 opacity-0 hover-overlay" style="transition: 0.3s;">
                                <i class="bi bi-fullscreen text-dark fs-4"></i>
                            </div>
                        </a>
                        
                        ${isAnimated ? `
                            <span class="position-absolute top-0 end-0 m-2 badge rounded-pill bg-primary" style="font-size: 10px;">
                                <i class="bi bi-play-circle me-1"></i>GIF
                            </span>` : ''}
                    </div>
                    
                    <div class="card-body p-3 text-center border-top bg-light">
                        <h5 class="fw-bold text-dark mb-1" style="font-size: 16px;">${logo.title}</h5>
                        ${logo.description ? `
                            <p class="text-secondary x-small mb-0" style="line-height: 1.4;">${logo.description}</p>
                        ` : `
                            <span class="text-muted x-small italic">${logo.category.toUpperCase()} Assets</span>
                        `}
                    </div>
                </div>
            </div>`;

        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Re-initialise GLightbox to handle the new logo assets
    if (typeof GLightbox === 'function') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true
        });
    }
}




// *********************************************************************
/**
 * Generalised controller to render section details with a sticky title and row-based list.
 * @param {string} sectionKey - The key in SITE_DATA (e.g., 'academic_information')
 */
function renderSectionDetailsPage(sectionKey) {
    const data = SITE_DATA[sectionKey];
    // if (!data) return;
    // If the section doesn't exist in your SITE_DATA, redirect to 404
    if (!data) {
        window.location.href = '404.html';
        return;
    }
    console.log(`Rendering ${sectionKey} details page...`);

    // 1. Update the Sticky Title in the top bar
    const stickyTitle = document.querySelector('.cv-nav-title');
    if (stickyTitle) {
        stickyTitle.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i> ${data.section_info.title}`;
    }

    // 2. Update the Main Section Heading and tagline
    const mainTitle = document.getElementById('section-main-title');
    const mainDesc = document.getElementById('section-main-description');

    // if (mainTitle) {
    //     mainTitle.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i> ${data.section_info.title}`;
    // }
    if (mainDesc) {
        mainDesc.textContent = data.section_info.details;
    }

    // 3. Delegate list rendering based on section type
    if (sectionKey === 'academic_information') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'academic_information'));
        renderFullAcademicDetails(data.degrees);
    }
    else if (sectionKey === 'professional_experiences') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'professional_experiences'));
        renderFullProfessionalDetails(data.experiences);
    }
    else if (sectionKey === 'skills_tools') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'skills_tools'));
        renderFullSkillsToolsDetails(data.skills);
    }
    else if (sectionKey === 'honors_awards') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'honors_awards'));
        renderFullHonorsAwardsDetails(data.honorsawards);
    }
    else if (sectionKey === 'courses_trainings_certificates') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'courses_trainings_certificates'));
        renderFullCoursesTrainingsCertificatesDetails(data.coursestrainingscertificates);
    }
    else if (sectionKey === 'projects') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'projects'));
        renderFullProjectsDetails(data.projects);
    }
    else if (sectionKey === 'oranisational_memberships') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'oranisational_memberships'));
        renderFullOrganisationalMembershipDetails(data.memberships);
    }
    else if (sectionKey === 'sessions_events') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'sessions_events'));
        renderFullSessionsEventsDetails(data.sessionsevents);
    }
    else if (sectionKey === 'languages') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'languages'));
        renderFullLanguageDetails(data.languages);
    }
    else if (sectionKey === 'portfolios') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'portfolios'));
        renderFullPortfoliosDetails(data.portfolios);
    }
    else if (sectionKey === 'volunteering_services') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'volunteering_services'));
        renderFullVolunteeringServicesDetails(data.volunteerings);
    }
    else if (sectionKey === 'publications') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'publications'));
        renderFullPublicationsDetails(data.publications);
    }
    else if (sectionKey === 'contact_details') {
        console.log(`Showing ${sectionKey} details page:`, (sectionKey === 'contact_details'));
        renderFullContactsDetails(data.contacts);
    }
    else{
        if (!SITE_DATA[sectionKey]) {
            window.location.href = '404.html';
            return;
        }
        console.warn(`Unknown section type: ${sectionKey}`);
    }
}


/**
 * Renders Academic Information using a modern card-based layout instead of a resume timeline.
 * Groups by degree level and maps all exact JSON keys.
 * @param {Array} degrees - The degrees array from academic_information.json.
 */
function renderFullAcademicDetails(degrees) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !degrees) return;

    listContainer.innerHTML = ''; // Clear existing content

    // 1. Group by level
    const grouped = degrees.reduce((acc, d) => {
        const level = d.degree_level || "Other";
        if (!acc[level]) acc[level] = [];
        acc[level].push(d);
        return acc;
    }, {});

    Object.keys(grouped).forEach((level) => {
        // Extract the icon class from the first item in the group
        const groupIcon = grouped[level][0].icon_class || 'bi bi-mortarboard';

        // Category Header with Group Icon added
        const categoryHeader = `
            <div class="col-12 mt-5 mb-3" data-aos="fade-up">
                <h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                    <i class="${groupIcon} me-2"></i>${level}
                </h2>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', categoryHeader);

        grouped[level].forEach((item) => {
            const time = item.timeframe_details || {};

            // Collaboration logic
            let collabHtml = '';
            if (item.collaboration && item.collaboration.length > 0) {
                collabHtml = `
                    <div class="p-3 mb-3 small" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
                        <span class="fw-bold"><i class="bi bi-people-fill me-2"></i>Institutional Collaboration:</span>
                        <ul class="mb-0 mt-2 small">
                            ${item.collaboration.map(c => `
                                <li><strong>${c.collaboration_type}:</strong> ${c.degree_major} — 
                                <a href="${c.institution_link}" target="_blank">${c.institution_name}</a> (${c.institution_location})</li>
                            `).join('')}
                        </ul>
                    </div>`;
            }

            // Research Projects logic
            let projectsHtml = '';
            if (item.research_projects && item.research_projects.length > 0) {
                projectsHtml = `
                    <div class="mt-4">
                        <h6 class="fw-bold"><i class="bx bxs-flask me-2"></i>Research and Projects</h6>
                        <div class="list-group list-group-flush small">
                            ${item.research_projects.map(rp => `
                                <div class="list-group-item px-0 bg-transparent">
                                    <div class="d-flex justify-content-between">
                                        <strong>${rp.type}:</strong>
                                        ${rp.link ? `<a href="${rp.link}" target="_blank"><i class="bx bx-link-external"></i></a>` : ''}
                                    </div>
                                    <span class="text-secondary">${rp.title}</span>
                                    ${rp.tools ? `<div class="fst-italic mt-1 text-muted"><span class="fw-bold">Tools:</span> ${rp.tools}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
            }

            const cardHtml = `
                <div class="col-12 mb-4" data-aos="fade-up">
                    <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                                <div>
                                    <h4 class="fw-bold text-dark mb-1" style="font-size: 16px;">
                                        ${item.degree_major} — ${item.degree_short_name ? `(${item.degree_short_name})` : ''}
                                    </h4>
                                    <p class="text-secondary mb-0">
                                        ${item.department_name}
                                    </p>
                                </div>
                            </div>

                            <div class="mb-3">
                                <i class="bi bi-building-fill me-2 text-muted"></i>
                                <a href="${item.institution_link}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color);">
                                    ${item.institution_name}
                                </a>
                                <span class="ms-2 text-muted small"><i class="bi bi-geo-alt me-1"></i>${item.institution_location}</span>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mb-4">
                                <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${time.start_date} – ${time.end_date}</span>
                                <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${time.max_duration}</span>
                                <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${item.degree_type}</span>
                                <span class="badge badge-status"><i class="bx bx-medal me-1"></i> ${time.award_date}</span>
                            </div>

                            <div class="row">
                                <div class="col-lg-7 border-end">
                                    <p class="mb-3 small"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${item.specialisation}</p>
                                    <div class="text-justify mb-4 small" style="line-height: 1.6;">
                                        <strong><i class="bi bi-file me-1"></i> Details:</strong> ${item.description_full}
                                    </div>
                                    <p class="mb-0 small"><strong><i class="bi bi-person-arms-up me-2"></i>Activities:</strong> ${item.activities_involvement}</p>
                                </div>
                                <div class="col-lg-5 mt-4 mt-lg-0">
                                    ${collabHtml}
                                    ${item.scholarship ? `
                                        <div class="mb-3 small">
                                            <strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong>
                                            <div class="text-muted mt-1">${item.scholarship.scholarship_name}</div>
                                        </div>` : ''}
                                    <div class="mb-3 small">
                                        <strong><i class="bx bx-bulb me-1"></i> Research Topic:</strong>
                                        <p class="small text-secondary mt-1">${item.research_topic}</p>
                                    </div>
                                    ${item.thesis_details && item.thesis_details.thesis_title ? `
                                        <div class="mb-3 small">
                                            <strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${item.thesis_details.thesis_title}
                                            <div class="text-muted small mt-1">Length: ${item.thesis_details.thesis_length}</div>
                                        </div>` : ''}
                                </div>
                            </div>

                            ${projectsHtml}

                            <div class="mt-4 pt-3 border-top">
                                <span class="fw-bold small text-uppercase">
                                    <i class="bi bi-tags-fill me-2"></i>Skills: 
                                </span>
                                <span class="mt-2 text-muted italic small">${item.related_skills}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            listContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    });
}


/**
 * Renders Professional Experiences using a modern card-based layout with a three-level hierarchy.
 * Levels: 1. Category Heading, 2. Organisation Info, 3. Role Details Card.
 * @param {Array} experiences - The array from professional_experiences.json.
 */
function renderFullProfessionalDetails(experiences) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !experiences) return;

    listContainer.innerHTML = ''; // Clear existing content

    // 1. Level 1: Categories (e.g., Academic Research & Tertiary Teaching_XX)
    experiences.forEach((category) => {
        const categoryHeader = `
            <div class="col-12 mt-5 mb-3" data-aos="fade-up">
                <h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                    <i class="${(category.organisation && category.organisation.length > 0) ? category.organisation[0].icon_class : 'bi bi-briefcase-fill'} me-2"></i>${category.category}
                </h2>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', categoryHeader);

        // 2. Level 2: Organisations within the category
        category.organisation.forEach((org) => {
            const orgHeader = `
                <div class="col-12 mt-4 mb-2 ps-2" data-aos="fade-up">
                    <h3 class="fw-bold mb-1" style="font-size: 16px; color: var(--heading-color);">
                        <i class="bi bi-building-fill me-2 text-muted"></i> 
                        <a href="${org.link}" target="_blank" class="text-decoration-none" style="color: var(--accent-color);">${org.organization}</a>
                        <span class="text-muted small ms-2"><i class="bi bi-geo-alt me-1"></i>${org.location || ''}</span>
                    </h3>
                </div>`;
            listContainer.insertAdjacentHTML('beforeend', orgHeader);

            // 3. Level 3: Roles within the Organisation (Modern Cards)
            org.roles.forEach((role) => {
                const time = role.timeframe_details || {};

                // Dynamic Duration Calculation matching the index page logic
                const calculatedDuration = (typeof calculateDuration === 'function')
                    ? calculateDuration(time.start_date, time.end_date)
                    : (time.duration || '');

                // Process Role Lists
                const renderList = (list, title, icon) => {
                    if (!list || list.length === 0) return '';
                    return `
                        <div class="mt-3">
                            <strong class="small"><i class="${icon} me-2"></i>${title}:</strong>
                            <ul class="mb-0 small mt-1 list-unstyled">
                                ${list.map(item => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i> <span>${item}</span></li>`).join('')}
                            </ul>
                        </div>`;
                };

                const descListHtml = renderList(role.description_list, "Role Summary", "bi bi-info-circle");
                const respListHtml = renderList(role.responsibilities_list, "Key Responsibilities", "bi bi-check2-circle");
                const courseListHtml = renderList(role.course_involvement, "Course Involvement", "bi bi-mortarboard");

                // Status Badge Logic: Show only if the job is ongoing ("Present")
                const isOngoing = time.end_date === "Present";
                const statusBadgeHtml = isOngoing ? `
                    <span class="badge badge-status">
                        <i class="bx bx-medal me-1"></i> Ongoing
                    </span>` : '';

                const cardHtml = `
                    <div class="col-12 mb-4" data-aos="fade-up" id="${role.role_id}">
                        <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                                    <h4 class="fw-bold text-dark mb-1" style="font-size: 16px;">${role.title}</h4>
                                </div>

                                <div class="d-flex flex-wrap gap-2 mb-4">
                                    <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${time.start_date} – ${time.end_date}</span>
                                    <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${calculatedDuration}</span>
                                    <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${role.role_type}</span>
                                    ${statusBadgeHtml}
                                </div>

                                <div class="row">
                                    <div class="col-lg-7 border-end">
                                        <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                            <strong><i class="bi bi-file-earmark-text me-1"></i> About the Role:</strong> ${role.about_job}
                                        </div>
                                        ${respListHtml}
                                    </div>
                                    <div class="col-lg-5 mt-4 mt-lg-0">
                                        ${descListHtml}
                                        ${courseListHtml}
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-top">
                                    <span class="fw-bold small">
                                        <i class="bi bi-tags-fill me-2"></i>Competencies: 
                                    </span>
                                    <span class="mt-2 text-muted italic small">${role.related_skills || ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                listContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        });
    });
}


/**
 * Renders Skills and Tools using a modern card-based layout.
 * Features proficiency progress bars, tag-based tool lists, and parsed professional application components.
 * @param {Array} skills - The skills array from skills_tools.json.
 */
function renderFullSkillsToolsDetails(skills) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !skills) return;

    listContainer.innerHTML = ''; // Clear existing content

    skills.forEach((skill, index) => {
        // 1. Process short_description into modern badges
        const tags = skill.short_description ? skill.short_description.split(',').map(tag => tag.trim()) : [];
        const tagsHtml = tags.length > 0
            ? `<div class="mt-3 d-flex flex-wrap gap-2">
                ${tags.map(tag => `<span class="badge bg-light text-dark border-0 shadow-sm px-3 py-2" style="font-size: 12px; font-weight: 500;">${tag}</span>`).join('')}
               </div>`
            : '';

        // 2. Parse details_description into a structured list
        let descriptionListHtml = '';
        if (skill.details_description) {
            const components = skill.details_description.split(/\.(?=\s|[A-Z])/).filter(c => c.trim().length > 0);

            descriptionListHtml = `
                <ul class="mb-0 ps-0 mt-2 list-unstyled">
                    ${components.map(item => {
                        if (item.includes(':')) {
                            const [key, val] = item.split(':');
                            return `<li class="mb-2 d-flex align-items-start small">
                                        <i class="bi bi-check2-circle text-primary me-2 mt-1"></i>
                                        <span><strong style="color: var(--heading-color);">${key.trim()}:</strong> ${val ? val.trim() : ''}.</span>
                                    </li>`;
                        }
                        return `<li class="mb-2 d-flex align-items-start small">
                                    <i class="bi bi-check2-circle text-primary me-2 mt-1"></i>
                                    <span>${item.trim()}.</span>
                                </li>`;
                    }).join('')}
                </ul>`;
        }

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
                            <h4 class="fw-bold text-dark mb-0" style="font-size: 18px;">
                                <i class="${skill.icon_class || 'bi bi-tools'} me-2" style="color: var(--accent-color);"></i>${skill.category}
                            </h4>
                            <span class="badge badge-duration" style="font-size: 13px;">
                                <i class="bi bi-lightning-fill me-1"></i> ${skill.level}% Proficiency
                            </span>
                        </div>

                        <div class="progress mb-4" style="height: 8px; background-color: #f0f0f0; border-radius: 10px;">
                            <div class="progress-bar shadow-none" role="progressbar" 
                                 style="width: ${skill.level}%; background-color: var(--accent-color); border-radius: 10px;" 
                                 aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <h6 class="fw-bold mb-3" style="font-size: 14px; color: var(--heading-color);">
                                    <i class="bi bi-briefcase me-2"></i>Professional Application
                                </h6>
                                <div class="text-justify" style="line-height: 1.6;">
                                    ${descriptionListHtml}
                                </div>
                            </div>

                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4">
                                <h6 class="fw-bold mb-1" style="font-size: 14px; color: var(--heading-color);">
                                    <i class="bi bi-stack me-2"></i>Technologies & Frameworks
                                </h6>
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}


/**
 * Renders Honors and Awards using a modern card-based layout.
 * Features a dual-column grid for organizational context and exhaustive descriptions.
 * @param {Array} awards - The honorsawards array from honors_awards.json.
 */
function renderFullHonorsAwardsDetails(awards) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !awards) return;

    listContainer.innerHTML = ''; // Clear existing content

    awards.forEach((award, index) => {
        // Issuer Organization details
        const issuer = award.issuer_organization || {};
        const associated = award.associated_organization || {};

        // Build Associated Organization HTML if it exists
        let associatedHtml = '';
        if (associated.name && associated.name.trim() !== "") {
            associatedHtml = `
                <div class="p-3 mb-3 small" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
                    <span class="fw-bold"><i class="bi bi-link-45deg me-2"></i>Associated Partner:</span>
                    <div class="mt-1">
                        <a href="${associated.link || '#'}" target="_blank" class="text-decoration-none fw-bold" style="color: var(--accent-color);">
                            ${associated.name}
                        </a>
                        ${associated.location ? `<span class="text-muted small"> (${associated.location})</span>` : ''}
                    </div>
                </div>`;
        }

        // Handle award link button
        const linkHtml = award.award_link
            ? `<div class="mt-3">
                <a href="${award.award_link}" target="_blank" class="btn btn-sm w-100 btn-outline-primary" style="font-size: 13px; border-radius: 6px;">
                    <i class="bi bi-shield-check me-1"></i> View Details
                </a>
               </div>`
            : '';

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${award.icon_class || 'bi bi-award'} me-2" style="color: var(--accent-color);"></i>${award.title}
                            </h4>
                        </div>

                        <div class="mb-3">
                            <i class="bi bi-building-fill me-2 text-muted"></i>
                            <a href="${issuer.link || '#'}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color); font-size: 16px;">
                                ${issuer.name}
                            </a>
                            ${issuer.location ? `<span class="ms-2 text-muted small"><i class="bi bi-geo-alt me-1"></i>${issuer.location}</span>` : ''}
                        </div>

                        <div class="mb-4">
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${award.date}
                            </span>
                            <span class="badge badge-institute" style="white-space: normal; text-align: left; line-height: 1.4;">
                                <i class="bi bi-patch-check me-1"></i> ${award.short_description}
                            </span>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                    <strong><i class="bi bi-file-earmark-text me-1"></i> Full Description:</strong> 
                                    ${award.description_full}
                                </div>
                            </div>
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4">
                                ${associatedHtml}
                                ${linkHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}


/**
 * Renders Courses, Trainings and Certificates using a modern card-based layout.
 * Features full-width clickable preview images for certificates.
 * @param {Array} items - The coursestrainingscertificates array from JSON.
 */
function renderFullCoursesTrainingsCertificatesDetails(items) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !items) return;

    listContainer.innerHTML = ''; // Clear existing content

    items.forEach((item, index) => {
        const details = item.details || {};

        // Process Key Information into a bulleted list
        let keyInfoHtml = '';
        if (details.key_information && details.key_information.length > 0) {
            keyInfoHtml = `
                <div class="mt-3">
                    <strong class="small"><i class="bi bi-list-check me-2"></i>Key Program Highlights:</strong>
                    <ul class="mb-0 mt-2 small list-unstyled">
                        ${details.key_information.map(info => `
                            <li class="mb-2 d-flex align-items-start">
                                <i class="bi bi-patch-check-fill text-primary me-2 mt-1"></i>
                                <span>${info}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>`;
        }

        // Action Buttons logic
        const courseLinkBtn = details.course_link
            ? `<a href="${details.course_link}" target="_blank" class="btn btn-sm btn-outline-secondary w-100 mb-2" style="font-size: 13px;">
                <i class="bi bi-journal-bookmark me-1"></i> View Course Page
               </a>` : '';

        const certLinkBtn = details.certificate_link
            ? `<a href="${details.certificate_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                <i class="bi bi-shield-lock me-1"></i> Verify Certificate
               </a>` : '';

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${item.icon_class || 'bi bi-book'} me-2" style="color: var(--accent-color);"></i>${item.title}
                            </h4>
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${details.date}
                            </span>
                        </div>

                        <div class="mb-3">
                            <i class="bi bi-building-fill me-2 text-muted"></i>
                            <span class="fw-bold" style="color: var(--heading-color);">${details.offering_organization}</span>
                            ${details.funding_organization ? `<span class="ms-1 text-muted small"> (Funded by: ${details.funding_organization})</span>` : ''}
                        </div>

                        <div class="mb-4 d-flex flex-wrap gap-2">
                            ${details.type.split(',').map(t => `<span class="badge badge-institute"><i class="bi bi-tag-fill me-1"></i> ${t.trim()}</span>`).join('')}
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                ${details.description ? `
                                    <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                        <strong><i class="bi bi-info-circle me-1"></i> Program Description:</strong> 
                                        ${details.description}
                                    </div>` : ''}
                                ${keyInfoHtml}
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column justify-content-between">
                                <div>
                                    ${item.image_path ? `
                                        <div class="mb-3">
                                            <a href="${item.image_path}" class="glightbox" data-gallery="cert-gallery" title="${item.title}">
                                                <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover;" alt="${item.title}">
                                            </a>
                                        </div>` : ''}
                                    <p class="small text-muted mb-2 fst-italic"><i class="bi bi-quote me-1"></i>${item.source}</p>
                                </div>
                                <div class="mt-auto">
                                    ${courseLinkBtn}
                                    ${certLinkBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Re-initialise GLightbox if it exists to enable the preview
    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Projects using a modern card-based layout.
 * Ensures duration is calculated and formatted specifically as "X yrs Y mos".
 * @param {Array} projects - The projects array from projects.json.
 */
function renderFullProjectsDetails(projects) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !projects) return;

    listContainer.innerHTML = ''; // Clear existing content

    projects.forEach((item, index) => {
        const time = item.timeframe_details || {};

        // 1. Precise Duration Calculation (yrs and mos)
        const calculatePreciseDuration = (start, end) => {
            const startDate = new Date(start);
            const endDate = end === "Present" ? new Date() : new Date(end);

            if (isNaN(startDate) || isNaN(endDate)) return "";

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();

            if (months < 0) {
                years--;
                months += 12;
            }

            const yrsStr = years > 0 ? `${years} yrs ` : "";
            const mosStr = months > 0 ? `${months} mos` : "";
            return (yrsStr + mosStr).trim();
        };

        const durationStr = calculatePreciseDuration(time.start_date, time.end_date);

        // Extract and join collaborator names
        const collaboratorNames = (item.collaboration_organization && item.collaboration_organization.length > 0)
            ? item.collaboration_organization.filter(c => c.name && c.name.trim() !== "").map(c => c.name).join(', ')
            : '';

        // Process Funding Organisations
        let fundingOrgHtml = '';
        if (item.funding_organization && item.funding_organization.length > 0) {
            const validFunding = item.funding_organization.filter(f => f.name && f.name.trim() !== "");
            if (validFunding.length > 0) {
                fundingOrgHtml = `
                    <div class="mb-3">
                        <strong><i class="bi bi-building me-2"></i>Funding Organisation:</strong>
                        <ul class="list-unstyled mt-1 mb-0 ps-0">
                            ${validFunding.map(f => `
                                <li class="mb-1">
                                    <i class="bi bi-patch-check-fill text-primary"></i>
                                    <a href="${f.link || '#'}" target="_blank" class="text-decoration-none" style="color: var(--accent-color);">
                                        ${f.name}
                                    </a> 
                                    ${f.location ? `<span class="text-muted small">, ${f.location}</span>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
            }
        }

        // Process Collaboration Organisations
        let collabOrgHtml = '';
        if (item.collaboration_organization && item.collaboration_organization.length > 0) {
            const validCollab = item.collaboration_organization.filter(c => c.name && c.name.trim() !== "");
            if (validCollab.length > 0) {
                collabOrgHtml = `
                    <div class="mb-3 small p-3 bg-light rounded border-start border-3" style="border-color: #6c757d !important;">
                        <strong><i class="bi bi-building me-2"></i>Key Collaborators:</strong>
                        <ul class="list-unstyled mt-2 mb-0 ps-0">
                            ${validCollab.map(c => `
                                <li class="mb-2 d-flex align-items-start">
                                    <i class="bi bi-patch-check-fill me-1 text-primary"></i>
                                    <span>
                                        <a href="${c.link || '#'}" target="_blank" class="text-dark fw-bold text-decoration-none">
                                            ${c.name}
                                        </a> 
                                        ${c.location ? `<span class="text-muted x-small">, ${c.location}</span>` : ''}
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
            }
        }

        const projectLinkBtn = item.url_link
            ? `<div class="mt-auto">
                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> View Project/Publication
                </a>
               </div>` : '';

        const cardHtml = `
            <div class="col-12 mb-5" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-lightbulb'} me-2" style="color: var(--accent-color);"></i>${item.title}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-person-badge me-1"></i> ${item.role} 
                                    ${collaboratorNames ? `<span class="text-muted"> | ${collaboratorNames}</span>` : ''}
                                </p>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <span class="badge badge-institute"><i class="bi bi-layers-half me-1"></i> ${item.basic_details}</span>
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${time.start_date} – ${time.end_date}
                            </span>
                            ${durationStr ? `
                            <span class="badge badge-duration">
                                <i class="bi bi-hourglass-split me-1"></i> ${durationStr}
                            </span>` : ''}
                            <span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> ${item.status}</span>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-4 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Project Overview</h6>
                                    ${item.long_description}
                                </div>
                                <div class="small p-3 bg-light rounded">
                                    <strong><i class="bi bi-gift me-2"></i>Funding Status:</strong> ${item.funding}
                                    ${fundingOrgHtml}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${item.image_path ? `
                                    <div class="mb-3 mt-2">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="project-gallery" title="${item.title}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${item.title}">
                                        </a>
                                    </div>` : ''}
                                
                                ${collabOrgHtml}
                                
                                ${projectLinkBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Organisational Memberships using a modern card-based layout.
 * Includes precise "yrs and mos" duration calculation and multi-organisation joining.
 * @param {Array} memberships - The memberships array from oranisational_memberships.json.
 */
function renderFullOrganisationalMembershipDetails(memberships) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !memberships) return;

    listContainer.innerHTML = ''; // Clear existing content

    memberships.forEach((item, index) => {
        const time = item.timeframe_details || {};

        // 1. Precise Duration Calculation (yrs and mos)
        const calculatePreciseDuration = (start, end) => {
            const startDate = new Date(start);
            const endDate = end === "Present" ? new Date() : new Date(end);

            if (isNaN(startDate) || isNaN(endDate)) return "";

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();

            if (months < 0) {
                years--;
                months += 12;
            }

            const yrsStr = years > 0 ? `${years} yrs ` : "";
            const mosStr = months > 0 ? `${months} mos` : "";
            const result = (yrsStr + mosStr).trim();
            return result === "" ? "1 mo" : result; // Default for very short durations
        };

        const durationStr = calculatePreciseDuration(time.start_date, time.end_date);

        // 2. Extract and join organisation names for the subtitle
        const orgNames = (item.membership_organization && item.membership_organization.length > 0)
            ? item.membership_organization.filter(o => o.name && o.name.trim() !== "").map(o => o.name).join(' | ')
            : '';

        // 3. Process Detailed Organisation Blocks for the right column
        let orgDetailsHtml = '';
        if (item.membership_organization && item.membership_organization.length > 0) {
            const validOrgs = item.membership_organization.filter(o => o.name && o.name.trim() !== "");
            if (validOrgs.length > 0) {
                orgDetailsHtml = `
                    <div class="mb-3 small">
                        <strong><i class="bi bi-building me-2"></i>Affiliated Organisation(s):</strong>
                        <ul class="list-unstyled mt-2 mb-0 ps-0">
                            ${validOrgs.map(o => `
                                <li class="mb-2 d-flex align-items-start">
                                    <i class="bi bi-patch-check-fill me-2 text-primary"></i>
                                    <span>
                                        <a href="${o.link || '#'}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color);">
                                            ${o.name}
                                        </a> 
                                        ${o.location ? `<span class="text-muted x-small">, ${o.location}</span>` : ''}
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
            }
        }

        // Action Button logic
        const actionBtn = item.url_link
            ? `<div class="mt-auto">
                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Professional Profile/Link
                </a>
               </div>` : '';

        // Determine status badge color
        const isOngoing = time.end_date === "Present";
        const statusText = isOngoing ? "Active" : "";

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-person-badge'} me-2" style="color: var(--accent-color);"></i>${item.title}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-award me-1"></i> ${item.role} 
                                    ${orgNames ? `<span class="text-muted"> | ${orgNames}</span>` : ''}
                                </p>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${time.start_date} – ${time.end_date}
                            </span>
                            ${durationStr ? `
                            <span class="badge badge-duration">
                                <i class="bi bi-hourglass-split me-1"></i> ${durationStr}
                            </span>` : ''}
                            ${statusText ? `
                            <span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> ${statusText}</span>` : ''}
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Membership Summary</h6>
                                    ${item.description_full}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${orgDetailsHtml}

                                ${item.image_path ? `
                                    <div class="mb-3">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="membership-gallery" title="${item.title}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 180px;" alt="${item.title}">
                                        </a>
                                    </div>` : ''}
                                
                                ${actionBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Initialise GLightbox for membership previews
    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Sessions and Events using a modern card-based layout.
 * Maps exact JSON keys and includes dynamic duration calculation.
 * @param {Array} events - The sessionsevents array from sessions_events.json.
 */
function renderFullSessionsEventsDetails(events) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !events) return;

    listContainer.innerHTML = ''; // Clear existing content

    events.forEach((item, index) => {
        // Action Button logic
        const actionBtn = item.url_link
            ? `<div class="mt-auto">
                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-link-45deg me-1"></i> Event Details
                </a>
               </div>` : '';

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-calendar-event'} me-2" style="color: var(--accent-color);"></i>${item.title}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-building me-1"></i> ${item.organization} 
                                    <span class="text-muted small ms-1"><i class="bi bi-geo-alt me-1"></i>${item.location}</span>
                                </p>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${item.date}
                            </span>
                            <span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> ${item.type}</span>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Session Overview</h6>
                                    ${item.description}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${item.image_path ? `
                                    <div class="mb-3">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="event-gallery" title="${item.title}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 180px;" alt="${item.title}">
                                        </a>
                                    </div>` : ''}
                                
                                ${actionBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Initialise GLightbox for event previews
    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Language proficiency using a modern card-based layout.
 * Maps exact JSON keys and includes structured proficiency breakdowns.
 * @param {Array} languages - The languages array from languages.json.
 */
function renderFullLanguageDetails(languages) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !languages) return;

    listContainer.innerHTML = ''; // Clear existing content

    languages.forEach((item, index) => {
        // Process Test Scores and Proficiency Breakdowns
        let testsHtml = '';
        if (item.test_scores && item.test_scores.length > 0) {
            testsHtml = item.test_scores.map(test => {
                if (!test.test_name && !test.proficiency_breakdown) return '';

                const pb = test.proficiency_breakdown || {};
                return `
                    <div class="mb-3 p-3 bg-light rounded border-start border-3" style="border-color: #6c757d !important;">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="small"><i class="bi bi-journal-check me-2"></i>${test.test_name || 'Proficiency Details'}</strong>
                            ${test.test_score ? `<span class="badge bg-white text-dark border shadow-sm">Score: ${test.test_score}</span>` : ''}
                        </div>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            <span class="badge badge-institute" style="font-size: 11px;">L: ${pb.listening}</span>
                            <span class="badge badge-institute" style="font-size: 11px;">R: ${pb.reading}</span>
                            <span class="badge badge-institute" style="font-size: 11px;">W: ${pb.writing}</span>
                            <span class="badge badge-institute" style="font-size: 11px;">S: ${pb.speaking}</span>
                        </div>
                        ${test.test_year ? `<div class="text-muted x-small mt-2"><i class="bi bi-calendar-event me-1"></i>Year: ${test.test_year}</div>` : ''}
                    </div>`;
            }).join('');
        }

        // Action Button logic
        const actionBtn = item.url_link
            ? `<div class="mt-auto">
                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-link-45deg me-1"></i> Verification/Link
                </a>
               </div>` : '';

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-translate'} me-2" style="color: var(--accent-color);"></i>${item.language}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-star me-1"></i> ${item.status}
                                </p>
                            </div>
                            <div class="mt-2 mt-md-0">
                                <span class="badge badge-status px-3 py-2" style="font-size: 13px;">
                                    <i class="bi bi-bar-chart-line me-1"></i> ${item.proficiency_level}
                                </span>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Competency Overview</h6>
                                    ${item.details}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${testsHtml}

                                ${item.image_path ? `
                                    <div class="mb-3">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="lang-gallery" title="${item.language}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 180px;" alt="${item.language}">
                                        </a>
                                    </div>` : ''}
                                
                                ${actionBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Initialise GLightbox for any previews
    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Portfolios using a modern card-based layout.
 * Maps exact JSON keys and highlights technical repository links.
 * @param {Array} portfolios - The portfolios array from portfolios.json.
 */
function renderFullPortfoliosDetails(portfolios) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !portfolios) return;

    listContainer.innerHTML = ''; // Clear existing content

    portfolios.forEach((item, index) => {
        // Action Button logic for the repository link
        const actionBtn = item.portfolio_url
            ? `<div class="mt-auto">
                <a href="${item.portfolio_url}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-github me-1"></i> View Repository
                </a>
               </div>` : '';

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-folder-symlink'} me-2" style="color: var(--accent-color);"></i>${item.title}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-link-45deg me-1"></i> 
                                    <a href="${item.portfolio_url}" target="_blank" class="text-decoration-none text-muted">
                                        ${item.portfolio_url.replace('https://', '')}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-8 border-end">
                                <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Technical Contribution</h6>
                                    ${item.description}
                                </div>
                            </div>
                            
                            <div class="col-lg-4 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${actionBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}


/**
 * Renders Volunteering Services using a modern card-based layout.
 * Includes precise duration calculation and clickable image previews.
 * @param {Array} volunteerings - The volunteerings array from volunteering_services.json.
 */
function renderFullVolunteeringServicesDetails(volunteerings) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !volunteerings) return;

    listContainer.innerHTML = ''; // Clear existing content

    volunteerings.forEach((item, index) => {
        const time = item.timeframe_details || {};

        // 1. Precise Duration Calculation (yrs and mos)
        const calculatePreciseDuration = (start, end) => {
            const startDate = new Date(start);
            const endDate = end === "Present" ? new Date() : new Date(end);

            if (isNaN(startDate) || isNaN(endDate)) return "";

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();

            if (months < 0) {
                years--;
                months += 12;
            }

            const yrsStr = years > 0 ? `${years} yrs ` : "";
            const mosStr = months > 0 ? `${months} mos` : "";
            return (yrsStr + mosStr).trim() || "1 mo";
        };

        const durationStr = calculatePreciseDuration(time.start_date, time.end_date);

        // Action Button logic
        const actionBtn = item.url_link
            ? `<div class="mt-auto">
                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Verification/Link
                </a>
               </div>` : '';

        // Status logic
        const isOngoing = time.end_date === "Present";

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div>
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${item.icon_class || 'bi bi-heart'} me-2" style="color: var(--accent-color);"></i>${item.title}
                                </h4>
                                <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                    <i class="bi bi-building me-1"></i> ${item.organization} 
                                    <span class="text-muted small ms-1"><i class="bi bi-geo-alt me-1"></i>${item.location}</span>
                                </p>
                            </div>
                            <div class="mt-2 mt-md-0">
                                <span class="badge badge-institute"><i class="bi bi-heart-fill me-1"></i> ${item.cause}</span>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-calendar3 me-1"></i> ${time.start_date} – ${time.end_date}
                            </span>
                            ${durationStr ? `
                            <span class="badge badge-duration">
                                <i class="bi bi-hourglass-split me-1"></i> ${durationStr}
                            </span>` : ''}
                            <span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> ${isOngoing ? 'Ongoing' : 'Completed'}</span>
                        </div>

                        <div class="row">
                            <div class="col-lg-7 border-end">
                                <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                    <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Service Narrative</h6>
                                    <p class="fw-bold text-dark mb-2">${item.summary_text}</p>
                                    ${item.description_full}
                                </div>
                            </div>
                            
                            <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                                ${item.image_path ? `
                                    <div class="mb-3">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="vol-gallery" title="${item.title}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${item.title}">
                                        </a>
                                    </div>` : ''}
                                
                                ${actionBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Initialise GLightbox for image previews
    if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.glightbox' });
    }
}


/**
 * Renders Publications using a modern card-based layout with a 3-tier hierarchy.
 * Levels: Category (Journal/Conf) -> Sub-type -> Publication Card.
 * Includes citation copying and abstract expansion.
 * @param {Object} data - The publications object from publications.json.
 */
function renderFullPublicationsDetails(data) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !data) return;

    listContainer.innerHTML = ''; // Clear existing content

    // Iterate through publication categories (journals, conferences, posters)
    Object.keys(data).forEach((key) => {
        const group = data[key];
        if (!group || !group.items) return;

        // 1. Level 1 & 2: Category and Sub-type Header
        const groupHeader = `
            <div class="col-12 mt-5 mb-3" data-aos="fade-up">
                <h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                    <i class="${group.icon_class} me-2"></i>${group.type} - ${group.sub_type} (${group.items.length} items)
                </h2>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', groupHeader);

        // 2. Level 3: Individual Publication Cards
        group.items.forEach((item, index) => {
            const link = item.journal_link || item.conference_link || "";

            // Strip HTML tags for clean clipboard copying
            const cleanCitation = item.citation_text.replace(/<\/?[^>]+(>|$)/g, "").replace(/"/g, '&quot;');

            // Extract year from citation if possible
            const yearMatch = item.citation_text.match(/\d{4}/);
            const pubYear = yearMatch ? yearMatch[0] : "N/A";

            const cardHtml = `
                <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                    <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                        <div class="card-body p-4">
                            
                            <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                                <h4 class="fw-bold text-dark mb-1 col-lg-10 ps-0" style="font-size: 16px; line-height: 1.4;">
                                    ${item.title}
                                </h4>
                                <span class="badge badge-dates px-3 py-2 mt-2 mt-lg-0">
                                    <i class="bi bi-calendar3 me-1"></i> ${pubYear}
                                </span>
                            </div>

                            <div class="mb-3 text-muted small" style="line-height: 1.5;">
                                <i class="bi bi-quote me-1"></i>${item.citation_text}
                            </div>

                            <div class="d-flex flex-wrap gap-2 mb-4">
                                <span class="badge badge-institute"><i class="bi bi-bookmark-fill me-1"></i> ${group.sub_type}</span>
                                ${link ? `<span class="badge badge-status"><i class="bi bi-link-45deg me-1"></i> Peer Reviewed</span>` : ''}
                            </div>

                            <div class="row">
                                <div class="col-lg-8 border-end">
                                    
                                    <div class="p-3 bg-light rounded small text-justify" style="line-height: 1.6; border: 1px dashed #ccc;">
                                        <strong>Abstract: </strong> ${item.abstract}
                                    </div>
                                </div>
                                
                                <div class="col-lg-4 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column gap-2">
                                    <button class="btn btn-sm btn-outline-secondary w-100 citation-btn" 
                                            data-citation="${cleanCitation}"
                                            onclick="handleCopyAction(this, 'Citation')"
                                            style="font-size: 13px; transition: all 0.3s ease;">
                                        <i class="bi bi-clipboard-plus me-1"></i> Copy Citation
                                    </button>
                                    
                                    ${link ? `
                                    <a href="${link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                                        <i class="bi bi-box-arrow-up-right me-1"></i> View DOI/Link
                                    </a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            listContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    });
}


/**
 * Renders Contact Details with modern cards, dynamic map embedding, and profile links.
 * Filters out keys containing '_cv' and uses icons directly from JSON.
 * @param {Object} contactMethods - The contacts object from contact_details.json.
 */
function renderFullContactsDetails(contactMethods) {
    const listContainer = document.getElementById('details-list-container');
    if (!listContainer || !contactMethods) return;

    listContainer.innerHTML = ''; // Clear content

    // 1. Filter keys: Ignore anything with '_cv'
    const filteredKeys = Object.keys(contactMethods).filter(key => !key.includes('_cv'));

    filteredKeys.forEach((key, index) => {
        const item = contactMethods[key];
        const isLocation = key === 'location';

        // Define Action Labels
        let btnText = "Visit Profile";
        let btnIcon = "bi-box-arrow-up-right";
        if (key === 'email') { btnText = "Send Email"; btnIcon = "bi-envelope-at"; }
        if (key === 'location') { btnText = "Open Maps"; btnIcon = "bi-map"; }

        // Logic to fix the broken map link and generate an embed source
        const cleanLocationText = item.text.replace('_XX', '');

        // const mapEmbedSource = `https://maps.google.com/maps?q=${encodeURIComponent(cleanLocationText)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        const mapEmbedSource = item.link;
        const mapDirectLink = `https://www.google.com/maps/search/${encodeURIComponent(cleanLocationText)}`;

        const cardHtml = `
            <div class="col-12 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                    <div class="card-body p-4">
                        
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                            <div class="d-flex align-items-center">
                                <div class="icon-box me-3 d-flex align-items-center justify-content-center" 
                                     style="width: 50px; height: 50px; background: rgba(var(--accent-color-rgb), 0.1); border-radius: 12px; color: var(--accent-color);">
                                    <i class="${item.icon_class}" style="font-size: 24px;"></i>
                                </div>
                                <h4 class="fw-bold text-dark mb-0" style="font-size: 18px;">${item.title}</h4>
                            </div>
                            <span class="badge badge-status px-3 py-2 mt-2 mt-md-0" style="font-size: 12px;">
                                <i class="bi bi-shield-check me-1"></i> Verified
                            </span>
                        </div>

                        <div class="row ${isLocation ? 'gy-4' : 'align-items-center'}">
                            <div class="${isLocation ? 'col-12' : 'col-lg-8 border-end'}">
                                <div class="small">
                                    <h6 class="fw-bold small text-uppercase mb-1" style="color: var(--accent-color); letter-spacing: 0.5px;">Contact Info</h6>
                                    <p class="mb-1 text-dark fw-bold" style="font-size: 16px;">${item.text}</p>
                                    
                                    <div class="mt-2 p-2 bg-light rounded border">
                                        <small class="text-muted d-block mb-1"><i class="bi bi-link-45deg"></i> Full Resource Link:</small>
                                        <a href="${isLocation ? mapDirectLink : item.link}" target="_blank" class="text-break" style="font-size: 14px; color: var(--accent-color);">
                                            ${isLocation ? mapDirectLink : item.link}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            ${!isLocation ? `
                            <div class="col-lg-4 mt-3 mt-lg-0 ps-lg-4">
                                <a href="${item.link}" target="_blank" class="btn btn-primary w-100 shadow-sm d-flex align-items-center justify-content-center" 
                                   style="font-size: 14px; background-color: var(--accent-color); border: none; padding: 12px; border-radius: 8px;">
                                    <i class="bi ${btnIcon} me-2"></i> ${btnText}
                                </a>
                            </div>` : ''}

                            ${isLocation ? `
                            <div class="col-12 mt-3">
                                <div class="rounded overflow-hidden shadow-sm border" style="height: 300px;">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src="${mapEmbedSource}"
                                        style="filter: grayscale(0.3) contrast(1.1);">
                                    </iframe>
                                </div>
                                <div class="mt-3">
                                    <a href="${mapDirectLink}" target="_blank" class="btn btn-primary w-100" 
                                       style="background-color: var(--accent-color); border: none; padding: 10px;">
                                        <i class="bi bi-geo-alt-fill me-2"></i> Open Large Map
                                    </a>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>`;
        listContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}











// *********************************************************************
/**
 * Re-initialize UI Libraries
 */
function initExternalLibraries() {
    // AOS (Animations)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
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


