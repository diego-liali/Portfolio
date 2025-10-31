document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navegador');
    const menuLinks = document.querySelectorAll('.menu-link');
    const navHeight = nav ? nav.offsetHeight : 0;

    /* Atualiza o ano do footer automaticamente */
    const footerP = document.querySelector('footer p');
    if (footerP) {
        const year = new Date().getFullYear();
        footerP.textContent = footerP.textContent.replace(/\b20\d{2}\b/, year);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const targetPosition = target.offsetTop - navHeight - 12; // 12px margem
                    window.scrollTo({
                        top: targetPosition >= 0 ? targetPosition : 0,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    const sections = Array.from(menuLinks)
        .map(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const el = document.querySelector(href);
                return el ? { id: href.slice(1), el, link } : null;
            }
            return null;
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sections.forEach(s => {
                        s.link.classList.remove('ativo');
                        s.link.removeAttribute('aria-current');
                    });
                    const active = sections.find(s => s.id === entry.target.id);
                    if (active) {
                        active.link.classList.add('ativo');
                        active.link.setAttribute('aria-current', 'page');
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        sections.forEach(s => observer.observe(s.el));
    }
});