/**
 * site-util.js - Global Utilities
 */
const SiteUtil = {
    /**
     * Returns the provided year or the current year if set to 'AUTO'.
     */
    getCopyrightYear(yearValue) {
        if (!yearValue) return new Date().getFullYear();
        const strYear = String(yearValue).toUpperCase();
        return strYear === 'AUTO' ? new Date().getFullYear() : yearValue;
    },

    /**
     * Ported from site-loader-old.js
     */
    calculateUniqueYears(intervals) {
        if (!intervals || intervals.length === 0) return 0;

        intervals.sort((a, b) => a.start - b.start);
        const merged = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const last = merged[merged.length - 1];
            const current = intervals[i];
            if (current.start <= last.end) {
                last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
            } else {
                merged.push(current);
            }
        }

        const totalMs = merged.reduce((sum, interval) => sum + (interval.end - interval.start), 0);
        return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25));
    },

    /**
     * Master Synchronization Logic
     */
    syncGlobalMetrics() {
        console.log("Syncing metrics across modules...");
        const keyInfo = SiteCore.get('key_information');
        if (!keyInfo) return;

        // 1. Calculate Teaching Years
        const teachingIntervals = [];
        const prof = SiteCore.get('professional_experiences');
        if (prof?.experiences) {
            prof.experiences.forEach(cat => {
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

        // FIXED: Call using SiteUtil instead of 'this' to avoid TypeError
        const totalTeachingYears = SiteUtil.calculateUniqueYears(teachingIntervals);

        // 2. Count Items
        const totalProjects = SiteCore.get('projects')?.projects?.length || 0;
        let totalPubs = 0;
        const pubs = SiteCore.get('publications')?.publications;
        if (pubs) Object.values(pubs).forEach(cat => { if (cat.items) totalPubs += cat.items.length; });

        const totalInstitutions = SiteCore.get('academic_information')?.degrees?.length || 0;
        const totalCerts = SiteCore.get('courses_trainings_certificates')?.coursestrainingscertificates?.length || 0;

        // 3. Update memory object
        keyInfo.metrics.forEach(m => {
            const desc = m.description.toLowerCase();
            const strong = m.strong_text.toLowerCase();
            if (desc.includes("teaching")) m.value = totalTeachingYears || m.value;
            if (strong.includes("projects")) m.value = totalProjects || m.value;
            if (strong.includes("publications")) m.value = totalPubs || m.value;
            if (desc.includes("academic and research")) m.value = totalInstitutions || m.value;
            if (strong.includes("certificates")) m.value = totalCerts || m.value;
        });
    },

    /**
     * Calculates duration between two dates.
     * Ported from site-loader-old.js
     */
    calculateDuration(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        let end = (endDateStr === "Present" || !endDateStr) ? new Date() : new Date(endDateStr);

        if (isNaN(start)) return "";
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
        return duration === "" ? "1 mo" : duration.trim();
    }
};