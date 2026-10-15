// Tiny i18n: elements carry data-i18n="key"; each page defines window.T
// = { en: {...}, ka: {...}, ru: {...} }. Choice is remembered per browser.
(function () {
    var LANGS = ['en', 'ka', 'ru'];

    function stored() {
        try { return localStorage.getItem('gerappa-lang'); } catch (e) { return null; }
    }
    function remember(l) {
        try { localStorage.setItem('gerappa-lang', l); } catch (e) { /* private mode */ }
    }
    function initial() {
        var s = stored();
        if (LANGS.indexOf(s) >= 0) return s;
        var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
        return LANGS.indexOf(nav) >= 0 ? nav : 'en';
    }

    function apply(lang) {
        var dict = (window.T && window.T[lang]) || {};
        var fallback = (window.T && window.T.en) || {};
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            var v = dict[k] != null ? dict[k] : fallback[k];
            if (v != null) el.innerHTML = v;
        });
        if (dict._title) document.title = dict._title;
        document.querySelectorAll('.lang button').forEach(function (b) {
            b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
        });
        remember(lang);
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.lang button').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.dataset.lang); });
        });
        apply(initial());
    });
})();
