/**
 * site-index.js - Comprehensive Home Page Controller
 * Dynamically populates every section of index.html with cached JSON data.
 */
const SiteIndex = {
    init() {
        console.log("Initializing all Index Page modules...");

        // // --- 0. DATA SYNCHRONIZATION ---
        // // Recalculates all numbers from raw data sources
        // SiteUtil.syncGlobalMetrics();

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

        console.log("Index Page synchronization complete.");
    },

    /**
     * Hero Section Rendering
     * Targets: #hero
     */
    render_hero() {
        const data = SiteCore.get('personal_information');
        const siteData = SiteCore.get('site');
        const hero = document.getElementById('hero');
        if (!data || !hero) return;

        const heroData = data.hero;

        // 1. Fix: Dynamic Background Image
        const bgImg = hero.querySelector('img');
        if (bgImg && siteData?.assets?.images?.site_background) {
            bgImg.src = siteData.assets.images.site_background;

            // Ensure image is visible and not hidden by AOS or CSS
            bgImg.style.display = 'block';
            bgImg.style.opacity = '1';

            // REMOVE the gray background class so it doesn't "peek through"
            hero.classList.remove('light-background');
        }

        // 2. Main Name Title
        const h2 = hero.querySelector('h2');
        if (h2) h2.textContent = heroData.title_main;

        // 3. Typed.js
        const typed = hero.querySelector('.typed');
        if (typed && heroData.main_keywards?.hero_slogan) {
            const items = heroData.main_keywards.hero_slogan
                .map(s => `<i class="${s.icon_class}"></i> ${s.text}`)
                .join(', ');
            typed.setAttribute('data-typed-items', items);
            if (window.initTypedAnimation) window.initTypedAnimation();
        }

        // 4. Subtitle Paragraphs
        const paragraphs = hero.querySelectorAll('p');
        if (paragraphs[1]) paragraphs[1].textContent = heroData.title_researcher;
        if (paragraphs[2]) {
            paragraphs[2].innerHTML = `
            ${heroData.title_institute_primary}<br>
            ${heroData.title_institute_secondary}<br>
            ${heroData.tagline}
        `;
        }
    },


    /**
     * About Section Rendering
     * Targets: #about
     */
    render_about() {
        const data = SiteCore.get('personal_information');
        const about = document.getElementById('about');
        if (!data || !about) return;

        const summary = data.profile_summary;
        const fullText = data.about_full_text;

        // 1. Title & Intro
        const mainTitle = about.querySelector('.section-title h2');
        if (mainTitle) {
            mainTitle.innerHTML = `${summary.title} <a href="curriculum-vitae.html?mode=standard"><i class="bx bx-printer ms-2"></i></a>`;
        }
        const intro = about.querySelector('.section-title h6');
        if (intro) intro.innerHTML = summary.intro_paragraph_html;

        // 2. Overview Content (Left & Right Columns)
        const contentBox = about.querySelector('.content');
        if (contentBox) {
            const subtitle = contentBox.querySelector('h3');
            if (subtitle) subtitle.textContent = summary.subtitle;

            const uls = contentBox.querySelectorAll('ul');

            // Populate Left Column
            if (uls[0] && summary.key_points_left) {
                uls[0].innerHTML = summary.key_points_left.map(p => `
                    <li><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> <span>${p.text}</span></li>
                `).join('');
            }

            // Populate Right Column (Handling potential links)
            if (uls[1] && summary.key_points_right) {
                uls[1].innerHTML = summary.key_points_right.map(p => `
                    <li><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> 
                        <span>${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer">${p.text}</a>` : p.text}</span>
                    </li>
                `).join('');
            }
        }

        // 3. Research Area & Recent Works (Bottom List)
        const bottomList = about.querySelector('.col-lg-12 ul');
        if (bottomList) {
            const res = summary.research_area;
            const works = summary.recent_works;
            bottomList.innerHTML = `
                <li><i class="${res.icon_class} me-2 accent-color"></i> <strong>${res.title}:</strong> <span>${res.text}</span></li>
                <li><i class="${works.icon_class} me-2 accent-color"></i> <strong>${works.title}:</strong> <span>${works.text}</span></li>
            `;
        }

        // 4. Detailed "About Me" Section
        const aboutMeTitle = about.querySelector('.section-title:last-of-type h2');
        if (aboutMeTitle) aboutMeTitle.innerHTML = `<i class="${fullText.icon_class} ms-2"></i> ${fullText.title}`;

        const aboutMeText = about.querySelector('.section-title:last-of-type p');
        if (aboutMeText) aboutMeText.innerHTML = fullText.paragraph_html;
    },


    /**
     * Key Information (Metrics) Rendering
     * Targets: #key_information
     */
    render_key_information() {
        const data = SiteCore.get('key_information');
        const section = document.getElementById('key_information');
        if (!data || !section) return;

        // 1. Update Section Header
        const titleBox = section.querySelector('.section-title');
        if (titleBox && data.section_info) {
            const h2 = titleBox.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            }
            const h6 = titleBox.querySelector('h6');
            if (h6) {
                h6.textContent = data.section_info.details;
            }
        }

        // 2. Update Metrics Grid
        const container = section.querySelector('.row.gy-4');
        if (container && data.metrics) {
            container.innerHTML = data.metrics.map(m => `
            <div class="col-lg-3 col-md-6">
                <div class="stats-item">
                    <i class="${m.icon_class}"></i>
                    <span data-purecounter-start="0" 
                          data-purecounter-end="${m.value}" 
                          data-purecounter-duration="1.5" 
                          data-purecounter-once="true"
                          class="purecounter">${m.value}</span>
                    <p><strong>${m.strong_text}</strong> ${m.description}</p>
                </div>
            </div>
        `).join('');
        }

        // 3. Re-initialize PureCounter for dynamic elements
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }
    },


    /**
     * Renders Academic Information section
     * Target: #academic_information
     */
    render_academic_information() {
        const data = SiteCore.get('academic_information');
        const section = document.getElementById('academic_information');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section-details.html?section=academic_information"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        // 3. Clear and Populate Summary Box
        // Scope the search to the first row only to find the Summary ULs
        const summaryRow = contentContainer.querySelector('.row');
        if (summaryRow && data.summary) {
            const summaryTitle = summaryRow.querySelector('.resume-title');
            if (summaryTitle) summaryTitle.textContent = data.summary.title;

            const summaryLists = summaryRow.querySelectorAll('ul');
            if (summaryLists.length >= 2 && data.summary.status_list) {
                // Populate left and right summary columns
                summaryLists[0].innerHTML = data.summary.status_list[0]
                    .map(item => `<li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`)
                    .join('');
                summaryLists[1].innerHTML = data.summary.status_list[1]
                    .map(item => `<li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`)
                    .join('');
            }
        }

        // 4. THE FIX: Remove only TOP-LEVEL degree rows
        // We iterate through direct children to avoid deleting the inner row of the summary.
        const topLevelRows = Array.from(contentContainer.children).filter(el => el.classList.contains('row'));
        for (let i = 1; i < topLevelRows.length; i++) {
            topLevelRows[i].remove();
        }

        // 5. Rebuild Degree Levels
        const groupedDegrees = data.degrees.reduce((acc, deg) => {
            if (!acc[deg.degree_level]) acc[deg.degree_level] = [];
            acc[deg.degree_level].push(deg);
            return acc;
        }, {});

        Object.keys(groupedDegrees).forEach(level => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row mt-5'; // Match static HTML spacing

            rowDiv.innerHTML = `
                <div class="col-lg-12">
                    <h2 class="pub-category-title"><i class="bi bi-mortarboard-fill me-2"></i> ${level}</h2>
                    ${groupedDegrees[level].map(deg => this._build_academic_item(deg)).join('')}
                </div>`;

            contentContainer.appendChild(rowDiv);
        });
    },

    /**
     * Helper to build individual degree items
     */
    _build_academic_item(degree) {
        // Collaboration Box
        const collabHtml = (degree.collaboration && degree.collaboration.length > 0) ? `
            <div class="collab-box rounded mb-3 p-3 bg-light border">
                <strong><i class="bi bi-people me-1"></i> Collaboration:</strong>
                <span class="ms-2">
                    ${degree.collaboration.map(c => `
                        <strong>${c.collaboration_type}:</strong> ${c.degree_major}, 
                        <a href="${c.institution_link}" target="_blank">${c.institution_name} <i class="bx bx-link-external ms-1 small"></i></a>, 
                        <span class="text-muted"> ${c.institution_location}</span>
                    `).join('; ')}
                </span>
            </div>` : '';

        const thesisHtml = degree.thesis_details?.thesis_title ?
            `<p class="mb-3"><strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${degree.thesis_details.thesis_title} (${degree.thesis_details.thesis_length})</p>` : '';

        return `
            <div class="resume-item border-start ps-4 pb-5" id="${degree.degree_id}">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                        <h4 class="text-primary fw-bold mb-1">${degree.degree_major}</h4>
                        <p class="mb-1 ms-2 fw-bold">${degree.department_name}</p>
                        <h6 class="fw-bold">
                            <a href="${degree.institution_link}" target="_blank">${degree.institution_name} <i class="bx bx-link-external ms-1 small"></i></a>
                            <span class="text-muted small ms-2"><i class="bi bi-geo-alt me-1"></i> ${degree.institution_location}</span>
                        </h6>
                    </div>
                    <div class="text-md-end mb-3">
                        <span class="badge badge-dates d-block mb-1"><i class="bi bi-calendar3 me-1"></i> ${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                        <span class="badge badge-duration d-block mb-1"><i class="bi bi-hourglass-split me-1"></i> ${degree.timeframe_details.max_duration}</span>
                        <div class="d-flex gap-1 justify-content-md-end">
                            <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${degree.degree_type}</span>
                            <span class="badge badge-status"><i class="bx bx-medal me-1"></i> ${degree.timeframe_details.award_date}</span>
                        </div>
                    </div>
                </div>
                <div class="ms-2">
                    <p class="mb-2"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${degree.specialisation}</p>
                    ${collabHtml}
                    <details class="details-box">
                        <summary><i class="bi bi-eye me-1"></i> More Details</summary>
                        <div class="ps-3 border-start mt-3">
                            <p><strong><i class="bi bi-mortarboard me-1"></i> Degree:</strong> ${degree.degree_short_name || degree.degree_major}</p>
                            ${degree.scholarship ? `<p><strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong> ${degree.scholarship.scholarship_name}</p>` : ''}
                            <p><strong><i class="bi bi-lightbulb me-1"></i> Research Topic:</strong> ${degree.research_topic}</p>
                            <p><strong><i class="bi bi-file-text me-1"></i> Details:</strong> ${degree.description_full}</p>
                            <p><strong><i class="bi bi-person-arms-up me-1"></i> Activities:</strong> ${degree.activities_involvement}</p>
                            ${thesisHtml}
                            <div class="mt-3">
                                <strong><i class="bx bxs-flask me-1"></i> Research and Projects:</strong>
                                <ul class="list-unstyled ms-4 mt-2">
                                    ${degree.research_projects.map(rp => `<li><i class="bi bi-dot text-primary me-2"></i> <strong>${rp.type}:</strong> ${rp.title}</li>`).join('')}
                                </ul>
                            </div>
                            <p class="mt-3 mb-1"><strong><i class="bi bi-tags me-1"></i> Skills:</strong> <span class="text-muted">${degree.related_skills}</span></p>
                        </div>
                    </details>
                </div>
            </div>`;
    },


    /**
     * Renders Professional Experiences section
     * Target: #professional_experiences
     */
    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        const section = document.getElementById('professional_experiences');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section-details.html?section=professional_experiences"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify Content Container and Clear Rows
        const contentContainer = section.querySelectorAll('.container')[1];
        if (!contentContainer) return;

        // Clear all previous rows to rebuild
        contentContainer.innerHTML = '';

        // 3. Render Summary Box (Expertise & Interests)
        if (data.summary) {
            const summaryRow = document.createElement('div');
            summaryRow.className = 'row';

            const expertise = data.summary.expertise_list[0];
            const interests = data.summary.expertise_list[1];

            summaryRow.innerHTML = `
                <div class="col-lg-12">
                    <div class="collab-box rounded p-4 shadow-sm border-start border-4 border-primary">
                        <h3 class="resume-title mt-0">${expertise.title}</h3>
                        <ul class="list-unstyled ms-3 mb-4">
                            ${expertise.areas_of_expertise.map(item => `<li><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`).join('')}
                        </ul>

                        <h3 class="resume-title">${interests.title}</h3>
                        <div class="row mt-3">
                            ${interests.research_interests_columns.map(col => `
                                <div class="col-md-4 border-start-md">
                                    <ul class="list-unstyled ms-3">
                                        ${col.map(item => `<li><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            contentContainer.appendChild(summaryRow);
        }

        // 4. Render Categorized Experiences
        if (data.experiences) {
            data.experiences.forEach(cat => {
                const catRow = document.createElement('div');
                catRow.className = 'row mt-4';

                let catHtml = `
                    <div class="col-lg-12">
                        <div class="resume-category-group mb-5">
                            <h2 class="pub-category-title"><i class="${cat.organisation[0]?.icon_class || 'bx bx-briefcase'} me-2"></i> ${cat.category}</h2>
                            ${cat.organisation.map(org => `
                                <div class="ms-3 mb-5">
                                    <h3 class="resume-title">
                                        <i class="bi bi-building me-1"></i>
                                        <a href="${org.link}" target="_blank">${org.organization} <i class="bx bx-link-external ms-1 small"></i></a>
                                        <span class="ms-2 small text-muted fw-normal"><i class="bi bi-geo-alt me-1"></i> ${org.location}</span>
                                    </h3>
                                    ${org.roles.map(role => this._build_professional_item(role)).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>`;

                catRow.innerHTML = catHtml;
                contentContainer.appendChild(catRow);
            });
        }
    },

    /**
     * Helper to build individual professional role cards
     */
    _build_professional_item(role) {
        // Calculate dynamic duration using SiteUtil
        const duration = role.timeframe_details.duration || SiteUtil.calculateDuration(role.timeframe_details.start_date, role.timeframe_details.end_date);

        // Details and Responsibilities lists
        const detailsList = role.description_list?.length > 0 ? `
            <p><strong><i class="bi bi-file me-1"></i> Details:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.description_list.map(item => `<li><i class="bi bi-dot text-primary"></i> ${item}</li>`).join('')}
            </ul>` : '';

        const responsibilitiesList = role.responsibilities_list?.length > 0 ? `
            <p><strong><i class="bi bi-person-raised-hand me-1"></i> Responsibilities:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.responsibilities_list.map(item => `<li><i class="bi bi-dot text-primary"></i> ${item}</li>`).join('')}
            </ul>` : '';

        // Course Involvement (for Teaching/Training)
        const coursesHtml = role.course_involvement?.length > 0 ? `
            <p><strong><i class="bi bi-book me-1"></i> Course Involvement:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.course_involvement.map(c => `<li><i class="bi bi-dot text-primary"></i> ${c}</li>`).join('')}
            </ul>` : '';

        return `
            <div class="resume-item border-start ps-4 pb-4" id="${role.role_id}">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <h4 class="text-primary fw-bold mb-1">${role.title}</h4>
                    <div class="text-md-end mb-3">
                        <span class="badge badge-dates d-block mb-1"><i class="bi bi-calendar3 me-1"></i> ${role.timeframe_details.start_date} – ${role.timeframe_details.end_date}</span>
                        <span class="badge badge-duration d-block mb-1"><i class="bi bi-hourglass-split me-1"></i> ${duration}</span>
                        <div class="d-flex gap-1 justify-content-md-end">
                            <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${role.role_type}</span>
                            ${role.timeframe_details.end_date === 'Present' ? `<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>` : ''}
                        </div>
                    </div>
                </div>
                <p class="mb-2"><strong><i class="bi bi-file-text me-1"></i> About Job:</strong> ${role.about_job}</p>
                <details class="details-box">
                    <summary><i class="bi bi-eye me-1"></i> More Details</summary>
                    <div class="ps-3 border-start mt-3">
                        ${detailsList}
                        ${responsibilitiesList}
                        ${coursesHtml}
                        ${role.related_skills ? `<p class="mt-3 mb-1"><strong><i class="bi bi-tags me-1"></i> Competencies:</strong> <span class="text-muted">${role.related_skills}</span></p>` : ''}
                    </div>
                </details>
            </div>`;
    },


    /**
     * Renders the main Expertise, Skills & Achievements wrapper header
     * Target: #expertise_skills_achievements
     */
    render_expertise_skills_achievements() {
        const data = SiteCore.get('expertise_skills_achievements');
        const section = document.getElementById('expertise_skills_achievements');
        if (!data || !section) return;

        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                    <a href="section-details.html?section=expertise_skills_achievements"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = info.details;
        }
    },

    /**
     * Renders the Skills and Tools subsection with dynamic progress bars
     * Target: #skills_tools
     */
    render_skills_tools() {
        const data = SiteCore.get('skills_tools');
        const section = document.getElementById('skills_tools');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                    <a href="section-details.html?section=skills_tools"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = info.details;
        }

        // 2. Clear and Render Skills Grid
        const skillsContent = section.querySelector('.skills-content');
        if (skillsContent && data.skills) {

            // --- THE FIX: Clear existing static progress bars ---
            skillsContent.innerHTML = '';

            // Split skills into two columns
            const mid = Math.ceil(data.skills.length / 2);
            const col1Data = data.skills.slice(0, mid);
            const col2Data = data.skills.slice(mid);

            const buildColumn = (items) => {
                return `
                    <div class="col-lg-6">
                        ${items.map(s => `
                            <div class="progress">
                                <span class="skill">${s.category}: ${s.short_description} <i class="val">${s.level}%</i></span>
                                <div class="progress-bar-wrap">
                                    <div class="progress-bar" role="progressbar" 
                                         aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100" 
                                         style="width: ${s.level}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
            };

            skillsContent.innerHTML = buildColumn(col1Data) + buildColumn(col2Data);
        }
    },

    /**
     * Renders Honors and Awards section
     * Target: #honors_awards
     */
    render_honors_awards() {
        const data = SiteCore.get('honors_awards');
        const section = document.getElementById('honors_awards');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section-details.html?section=honors_awards"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify the Grid Container and Row
        // Target the second container which houses the grid
        const containers = section.querySelectorAll('.container');
        const gridContainer = containers[1];
        if (!gridContainer) return;
        console.log('-----> here 1111', containers, gridContainer)

        const gridRow = gridContainer.querySelector('.row.gy-4');
        if (gridRow && data.honorsawards) {
            console.log('----->', gridRow, data.honorsawards);
            // --- THE FIX: Clear existing static service items ---
            gridRow.innerHTML = '';

            const awardsHtml = data.honorsawards.map(award => {
                console.log('----->', award.title);
                // Dynamic Status Badge: Check if date contains "Ongoing"
                const isOngoing = award.date && award.date.toLowerCase().includes('ongoing');
                const statusBadge = isOngoing
                    ? `<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>`
                    : '';

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up">
                        <div class="icon flex-shrink-0">
                            <i class="${award.icon_class || 'bi bi-award'}"></i>
                        </div>
                        <div>
                        hello
                            <h4 class="title">
                                <a href="section-details.html?section=honors_awards&award=${award.id_ref}" class="stretched-link">
                                    ${award.title}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${award.date}</span>
                                ${statusBadge}
                                <span class="badge badge-institute"><i class="bi bi-building me-1"></i> ${award.issuer_organization.name}</span>
                            </div>
                            <p class="description">${award.short_description}</p>
                        </div>
                    </div>`;
            }).join('');

            console.log('xxx----->', awardsHtml);
            gridRow.innerHTML = awardsHtml;
        }
    },




    /**
     * Courses and Certificates
     */
    renderCertificates() {
        const data = SiteCore.get('courses_trainings_certificates');
        const container = document.querySelector('#courses_trainings_certificates .isotope-container');
        if (!data || !container) return;

        container.innerHTML = data.coursestrainingscertificates.slice(0, 12).map((c, i) => `
            <div class="col-lg-4 col-md-6 portfolio-item isotope-item" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="portfolio-content h-100">
                    <img src="${c.image_path}" class="img-fluid" alt="${c.title}">
                    <div class="portfolio-info">
                        <h4>${c.title}</h4>
                        <p>${c.source}</p>
                        <a href="${c.image_path}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Publications with Categories
     */
    renderPublications() {
        const data = SiteCore.get('publications');
        const container = document.querySelector('#publications .row');
        if (!data || !container) return;

        container.innerHTML = Object.keys(data.publications).map(key => {
            const group = data.publications[key];
            return `
                <div class="col-lg-12">
                    <div class="resume-category-group mb-5">
                        <h2 class="resume-category-title"><i class="${group.icon_class}"></i> ${group.type} (${group.items.length})</h2>
                        ${group.items.map(item => `
                            <div class="resume-item border-start ps-4 pb-4">
                                <div class="d-flex justify-content-between align-items-start flex-wrap">
                                    <h4 class="text-primary fw-bold pe-3">${item.title}</h4>
                                    <div class="d-flex gap-1">
                                        <button class="badge border-0 badge-dates" onclick="handleCopyAction(this, 'Citation')" data-citation="${item.citation_text.replace(/"/g, '&quot;')}">
                                            <i class="bi bi-clipboard-plus me-1"></i> Copy
                                        </button>
                                        <a href="${item.journal_link || item.conference_link}" target="_blank" class="badge badge-status"><i class="bi bi-box-arrow-up-right"></i></a>
                                    </div>
                                </div>
                                <p class="mb-2 small">${item.citation_text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }).join('');
    },

    /**
     * Grid-based Sections (Projects, Memberships, Events, Languages, Portfolios, Volunteering)
     * Using a shared template logic for brevity
     */
    renderProjects() {
        this._renderGrid('projects', '#projects .row.gy-4', 'role', 'short_description');
    },
    renderMemberships() {
        this._renderGrid('oranisational_memberships', '#oranisational_memberships .row.gy-4', 'title', 'description_full');
    },
    renderEvents() {
        this._renderGrid('sessions_events', '#sessions_events .row.gy-4', 'title', 'description');
    },
    renderLanguages() {
        this._renderGrid('languages', '#languages .row.gy-4', 'language', 'proficiency_level');
    },
    renderPortfolios() {
        this._renderGrid('portfolios', '#portfolios .row.gy-4', 'title', 'description');
    },
    renderVolunteering() {
        this._renderGrid('volunteering_services', '#volunteering_services .row.gy-4', 'title', 'summary_text');
    },

    _renderGrid(dataKey, selector, titleKey, descKey) {
        const data = SiteCore.get(dataKey);
        const container = document.querySelector(selector);
        if (!data || !container) return;

        const items = data.projects || data.memberships || data.sessionsevents || data.languages || data.portfolios || data.volunteerings;
        container.innerHTML = items.map((item, i) => `
            <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="icon flex-shrink-0"><i class="${item.icon_class || 'bi bi-info-circle'}"></i></div>
                <div>
                    <h4 class="title">${item[titleKey]}</h4>
                    <p class="description small">${item[descKey]}</p>
                </div>
            </div>
        `).join('');
    },

    /**
     * Contact Details
     */
    renderContact() {
        const data = SiteCore.get('contact_details');
        const container = document.querySelector('#contact_details .row.gy-4');
        if (!data || !container) return;

        const methods = Object.keys(data.contacts).filter(k => !k.includes('_cv'));
        const html = methods.map(k => {
            const item = data.contacts[k];
            return `
                <div class="col-lg-4 col-md-6 service-item d-flex">
                    <div class="icon flex-shrink-0"><i class="${item.icon_class}"></i></div>
                    <div>
                        <h4 class="title"><a href="${item.link}" class="stretched-link">${item.title}</a></h4>
                        <p class="description">${item.text}</p>
                    </div>
                </div>`;
        }).join('');

        // Preserve Map Container if it exists
        const mapHtml = `<div class="col-lg-12 mt-4"><div class="rounded shadow-sm border overflow-hidden">
            <iframe src="${data.contacts.location.link}" style="border:0; width: 100%; height: 270px;" allowfullscreen="" loading="lazy"></iframe>
        </div></div>`;
        container.innerHTML = html + mapHtml;
    }
};