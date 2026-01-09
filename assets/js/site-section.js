const SiteSection = {
    init() {
        const s = new URLSearchParams(location.search).get('section');
        if (!s) return;
        const d = SiteCore.get(s);
        const c = document.getElementById('section-items');
        if (!d || !c) return;
        d.items.forEach(i => c.appendChild(SiteCore.card({title: i.title, body: SiteCore.el('p', {text: i.summary})})));
    }
};
