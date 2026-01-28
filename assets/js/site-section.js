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
            this.render_about();

            // --- 2. METRICS & STATS ---
            this.render_key_information();

            // --- 3. RESUME / TIMELINES ---
            this.render_academic_information();
            this.render_professional_experiences();

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
    },


    /**
     * About Section Rendering
     * Targets: #about
     * Following the data-driven approach used in site-index.js
     */
    render_about() {
        // Correct data retrieval pattern from site-index.js
        const data = SiteCore.get('personal_information');
        const about = document.getElementById('about');
        if (!data || !about) return;

        const summary = data.profile_summary;
        const fullText = data.about_full_text;

        // 1. Title & Intro mapping
        const mainTitle = about.querySelector('.section-title h2');
        if (mainTitle) {
            mainTitle.innerHTML = `${summary.title} <a href="curriculum_vitae.html?type=standard"><i class="bx bx-printer ms-2"></i></a>`;
        }
        const intro = about.querySelector('.section-title h6');
        if (intro) intro.innerHTML = summary.intro_paragraph_html;

        // 2. Formal photo mapping
        const formalPhotoWrap = about.querySelector('.formal-photo');
        if (formalPhotoWrap && data?.assets?.images?.profile_image_formal) {
            const link = formalPhotoWrap.querySelector('a');
            const img = formalPhotoWrap.querySelector('img');
            const photoPath = data.assets.images.profile_image_formal;

            if (link) link.href = photoPath;
            if (img) img.src = photoPath;
        }

        // 3. Overview Content mapping
        const contentBox = about.querySelector('.content');
        if (contentBox) {
            const subtitle = contentBox.querySelector('h3');
            if (subtitle) subtitle.textContent = summary.subtitle;

            const uls = contentBox.querySelectorAll('ul');

            // Left Column mapping
            if (uls[0] && summary.key_points_left) {
                uls[0].innerHTML = summary.key_points_left.map((p) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> <span>${p.text}</span></li>
                `).join('');
            }

            // Right Column mapping
            if (uls[1] && summary.key_points_right) {
                uls[1].innerHTML = summary.key_points_right.map((p) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> 
                        <span>${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer">${p.text}</a>` : p.text}</span>
                    </li>
                `).join('');
            }
        }

        // 4. Research Area & Recent Works (Bottom List)
        const bottomList = about.querySelector('.col-lg-12 ul');
        if (bottomList) {
            const res = summary.research_area;
            const works = summary.recent_works;
            bottomList.innerHTML = `
                <li data-aos="fade-in" data-aos-delay="100"><i class="${res.icon_class} me-2 accent-color"></i> <strong>${res.title}:</strong> <span>${res.text}</span></li>
                <li data-aos="fade-in" data-aos-delay="100"><i class="${works.icon_class} me-2 accent-color"></i> <strong>${works.title}:</strong> <span>${works.text}</span></li>
            `;
        }

        // 5. Detailed "About Me" Section mapping
        const aboutMeTitle = about.querySelector('.section-title:last-of-type h2');
        if (aboutMeTitle) aboutMeTitle.innerHTML = `<i class="${fullText.icon_class} ms-2"></i> ${fullText.title}`;

        const aboutMeText = about.querySelector('.section-title:last-of-type p');
        if (aboutMeText) aboutMeText.innerHTML = fullText.paragraph_html;
    },


    /**
     * Key Information (Metrics) Rendering
     * Targets: #key_information
     * Patterns adapted from site-index.js
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

        // 2. Update Metrics Grid using dynamic mapping
        const container = section.querySelector('.row.gy-4');
        if (container && data.metrics) {
            container.innerHTML = data.metrics.map((m, index) => `
            <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 4) * 100}">
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

        // 3. Re-initialize PureCounter for the newly injected dynamic elements
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }

        console.log("Key Information section synchronized with JSON data.");
    },


    /**
     * Renders Academic Information section
     * Target: #academic_information
     * Format: Matches section_details.html card structure
     */
    render_academic_information() {
        const data = SiteCore.get('academic_information');
        const section = document.getElementById('academic_information');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        // 2. Clear and Prepare Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Group Degrees by Level (e.g., PhD, Master's)
        const groupedDegrees = data.degrees.reduce((acc, deg) => {
            if (!acc[deg.degree_level]) acc[deg.degree_level] = [];
            acc[deg.degree_level].push(deg);
            return acc;
        }, {});

        // 4. Build the HTML structure exactly as in section_details.html
        Object.keys(groupedDegrees).forEach(level => {
            // Level Header Row
            const headerRow = document.createElement('div');
            headerRow.className = 'col-12 mt-5 mb-3';
            headerRow.setAttribute('data-aos', 'fade-up');
            headerRow.innerHTML = `<h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                <i class="bi bi-mortarboard-fill me-2"></i>${level.toUpperCase()}</h2>`;
            contentContainer.appendChild(headerRow);

            // Degree Cards
            groupedDegrees[level].forEach(deg => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.innerHTML = this._build_details_academic_card(deg);
                contentContainer.appendChild(cardCol);
            });
        });
    },

    /**
     * Helper to build the specific card structure from section_details.html
     */
    _build_details_academic_card(degree) {
        // Build Collaboration Box
        const collabHtml = (degree.collaboration && degree.collaboration.length > 0) ? `
            <div class="p-3 mb-3 small" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
                <span class="fw-bold"><i class="bi bi-people-fill me-2"></i>Institutional Collaboration:</span>
                <ul class="mb-0 mt-2 small">
                    ${degree.collaboration.map(c => `<li><strong>${c.collaboration_type}:</strong> ${c.degree_major} — 
                    <a href="${c.institution_link}" target="_blank">${c.institution_name}</a> (${c.institution_location})</li>`).join('')}
                </ul>
            </div>` : '';

        // Build Research/Projects List
        const projectsHtml = degree.research_projects.map(rp => `
            <div class="list-group-item px-0 bg-transparent">
                <div class="d-flex justify-content-between"><strong>${rp.type}:</strong></div>
                <span class="text-secondary">${rp.title}</span>
                <div class="fst-italic mt-1 text-muted"><span class="fw-bold">Tools:</span> ${rp.tools}</div>
            </div>`).join('');

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 16px;">${degree.degree_major} — (${degree.degree_short_name || ''})</h4>
                            <p class="text-secondary mb-0">${degree.department_name}</p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <i class="bi bi-building-fill me-2 text-muted"></i>
                        <a href="${degree.institution_link}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color);">${degree.institution_name}</a>
                        <span class="ms-2 text-muted small"><i class="bi bi-geo-alt me-1"></i>${degree.institution_location}</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                        <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${degree.timeframe_details.max_duration}</span>
                        <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${degree.degree_type}</span>
                        <span class="badge badge-status"><i class="bx bx-medal me-1"></i> ${degree.timeframe_details.award_date}</span>
                    </div>
                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <p class="mb-3 small"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${degree.specialisation}</p>
                            <div class="text-justify mb-4 small" style="line-height: 1.6;"><strong><i class="bi bi-file me-1"></i> Details:</strong> ${degree.description_full}</div>
                            <p class="mb-0 small"><strong><i class="bi bi-person-arms-up me-2"></i>Activities:</strong> ${degree.activities_involvement}</p>
                        </div>
                        <div class="col-lg-5 mt-4 mt-lg-0">
                            ${collabHtml}                            
                            <div class="mb-3 small"><strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong>
                                <div class="text-muted mt-1">${degree.scholarship ? degree.scholarship.scholarship_name : 'N/A'}</div>
                            </div>
                            <div class="mb-3 small"><strong><i class="bx bx-bulb me-1"></i> Research Topic:</strong>
                                <p class="small text-secondary mt-1">${degree.research_topic}</p>
                            </div>
                            ${degree.thesis_details.thesis_title ? `<div class="mb-3 small"><strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${degree.thesis_details.thesis_title} 
                                <div class="text-muted small mt-1">Length: ${degree.thesis_details.thesis_length}</div></div>` : ''}
                        </div>
                    </div>
                    <div class="mt-4">
                        <h6 class="fw-bold"><i class="bx bxs-flask me-2"></i>Research and Projects</h6>
                        <div class="list-group list-group-flush small">${projectsHtml}</div>
                    </div>
                    <div class="mt-4 pt-3 border-top">
                        <span class="fw-bold small text-uppercase"><i class="bi bi-tags-fill me-2"></i>Skills:</span>
                        <span class="mt-2 text-muted italic small">${degree.related_skills}</span>
                    </div>
                </div>
            </div>`;
    },



    /**
     * Renders Professional Experiences section
     * Target: #professional_experiences
     * Format: Matches section_details.html card structure
     */
    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        const section = document.getElementById('professional_experiences');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Render Categorized Experiences
        if (data.experiences) {
            data.experiences.forEach(cat => {
                // Category Header (e.g., Research Experiences)
                const catHeader = document.createElement('div');
                catHeader.className = 'col-12 mt-5 mb-3';
                catHeader.setAttribute('data-aos', 'fade-up');
                catHeader.innerHTML = `<h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                    <i class="${cat.organisation[0]?.icon_class || 'bx bx-briefcase'} me-2"></i>${cat.category.toUpperCase()}</h2>`;
                contentContainer.appendChild(catHeader);

                // Organisations and Roles
                cat.organisation.forEach(org => {
                    // Organisation Sub-header
                    const orgHeader = document.createElement('div');
                    orgHeader.className = 'col-12 mt-4 mb-2 ps-2';
                    orgHeader.setAttribute('data-aos', 'fade-up');
                    orgHeader.innerHTML = `
                        <h3 class="fw-bold mb-1" style="font-size: 16px; color: var(--heading-color);">
                            <i class="bi bi-building-fill me-2 text-muted"></i>
                            <a href="${org.link}" target="_blank" class="text-decoration-none" style="color: var(--accent-color);">${org.organization}</a>
                            <span class="text-muted small ms-2"><i class="bi bi-geo-alt me-1"></i>${org.location}</span>
                        </h3>`;
                    contentContainer.appendChild(orgHeader);

                    // Render Role Cards for this Organisation
                    org.roles.forEach(role => {
                        const cardCol = document.createElement('div');
                        cardCol.className = 'col-12 mb-4';
                        cardCol.setAttribute('data-aos', 'fade-up');
                        cardCol.innerHTML = this._build_details_experience_card(role);
                        contentContainer.appendChild(cardCol);
                    });
                });
            });
        }
    },

    /**
     * Helper to build the specific professional card structure from section_details.html
     */
    /**
     * Helper to build the specific professional card structure from section_details.html
     * Targets: col-lg-7 (Left) and col-lg-5 (Right)
     */
    _build_details_experience_card(role) {
        // 1. Left Side: Key Responsibilities
        const responsibilitiesHtml = role.responsibilities_list?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-check2-circle me-2"></i>Key Responsibilities:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.responsibilities_list.map(item => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${item}</span></li>`).join('')}
                </ul>
            </div>` : '';

        // 2. Right Side: Role Summary
        const summaryHtml = role.description_list?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-info-circle me-2"></i>Role Summary:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.description_list.map(item => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${item}</span></li>`).join('')}
                </ul>
            </div>` : '';

        // 3. Right Side: Course Involvement (The New Addition)
        const courseInvolvementHtml = role.course_involvement?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-book me-2"></i>Course Involvement:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.course_involvement.map(course => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${course}</span></li>`).join('')}
                </ul>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <h4 class="fw-bold text-dark mb-1" style="font-size: 16px;">${role.title}</h4>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${role.timeframe_details.start_date} – ${role.timeframe_details.end_date}</span>
                        <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${role.timeframe_details.duration || 'N/A'}</span>
                        <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${role.role_type}</span>
                        ${role.timeframe_details.end_date === 'Present' ? '<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>' : ''}
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                <strong><i class="bi bi-file-earmark-text me-1"></i> About the Role:</strong> ${role.about_job}
                            </div>
                            ${responsibilitiesHtml}
                        </div>
                        <div class="col-lg-5 mt-4 mt-lg-0">
                            ${summaryHtml}
                            ${courseInvolvementHtml}
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-top">
                        <span class="fw-bold small">
                            <i class="bi bi-tags-fill me-2"></i>Competencies:
                        </span>
                        <span class="mt-2 text-muted italic small">${role.related_skills || 'N/A'}</span>
                    </div>
                </div>
            </div>`;
    },


};
