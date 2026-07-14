(function(){ if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: '2ZAwsZfQRiTQB4yva' }); })();

(function() {
    var s = 'background:#4361EE;color:#fff;font-weight:700;padding:4px 0 4px 10px;border-radius:4px 0 0 4px;font-size:12px;';
    var d = 'background:#1A1A2E;color:#6B8AFF;padding:4px 10px 4px 0;border-radius:0 4px 4px 0;font-size:12px;';
    console.log('\n%c Anonyme C&D %c Codes & Design Studio \n', s, d);
})();

document.addEventListener('DOMContentLoaded', () => {

    // scroll
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 500);
    });
    if (scrollTop) {
        scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // mobile nav
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let _savedY = 0;

    function openMobileMenu() {
        _savedY = window.scrollY;
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + _savedY + 'px';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, _savedY);
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) closeMobileMenu();
            else openMobileMenu();
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // active link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop, height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector('.nav-links a[href="#' + id + '"]');
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

    // counters
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000, step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + suffix;
        }, 16);
    }
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-target]').forEach(c => counterObserver.observe(c));

    // modal
    const overlay = document.createElement('div');
    overlay.className = 'service-overlay';
    overlay.innerHTML = '<div class="service-overlay-content"><button class="service-overlay-close">&times;</button><h3></h3><div class="service-overlay-text"></div></div>';
    document.body.appendChild(overlay);
    const overlayTitle = overlay.querySelector('h3');
    const overlayText = overlay.querySelector('.service-overlay-text');
    const overlayClose = overlay.querySelector('.service-overlay-close');

    document.querySelectorAll('.service-card').forEach(card => {
        const preview = card.querySelector('.service-card-preview');
        const detail = card.querySelector('.service-card-detail');
        if (preview && detail) {
            preview.addEventListener('click', () => {
                overlayTitle.textContent = detail.querySelector('h3').textContent;
                overlayText.innerHTML = '';
                detail.querySelectorAll('p').forEach(p => {
                    const np = document.createElement('p'); np.textContent = p.textContent; overlayText.appendChild(np);
                });
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
    function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
    overlayClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // careers
    const careersContent = document.querySelector('.careers-content');
    const careersSection = document.getElementById('careers');
    document.querySelectorAll('a[href="#careers"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            if (careersContent) {
                if (careersContent.style.display === 'none') {
                    careersContent.style.display = 'block';
                    careersSection.style.padding = '80px 0';
                } else {
                    careersContent.style.display = 'none';
                    careersSection.style.padding = '0';
                }
                setTimeout(() => careersSection.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        });
    });

    // helpers
    function sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[\d\s\+\-\(\)]{8,20}$/.test(phone);
    }

    const formSubmitTimestamps = {};
    function isRateLimited(formId, cooldownMs) {
        const now = Date.now();
        if (formSubmitTimestamps[formId] && (now - formSubmitTimestamps[formId]) < cooldownMs) {
            return true;
        }
        formSubmitTimestamps[formId] = now;
        return false;
    }

    function hasHoneypotFilled(form, fieldName) {
        const field = form.querySelector('[name="' + fieldName + '"]');
        return field && field.value.length > 0;
    }

    // email decode
    document.querySelectorAll('.protected-email').forEach(el => {
        const user = el.dataset.user;
        const domain = el.dataset.domain;
        const email = user + '@' + domain;
        el.textContent = email;
        el.href = 'mai' + 'lto:' + email;
    });

    // forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            if (hasHoneypotFilled(contactForm, 'website')) return;
            if (isRateLimited('contact', 30000)) {
                alert(currentLang === 'fr' ? 'Veuillez patienter avant de renvoyer un message.' : 'Please wait before sending another message.');
                return;
            }
            const fd = new FormData(contactForm);
            const name = sanitize(fd.get('name').trim());
            const email = fd.get('email').trim();
            const phone = fd.get('phone').trim();
            const message = fd.get('message').trim();
            if (!name || name.length < 2) { alert(currentLang === 'fr' ? 'Veuillez entrer un nom valide.' : 'Please enter a valid name.'); return; }
            if (!validateEmail(email)) { alert(currentLang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email.'); return; }
            if (phone && !validatePhone(phone)) { alert(currentLang === 'fr' ? 'Veuillez entrer un telephone valide.' : 'Please enter a valid phone number.'); return; }
            if (!message || message.length < 10) { alert(currentLang === 'fr' ? 'Votre message doit contenir au moins 10 caracteres.' : 'Your message must contain at least 10 characters.'); return; }
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';

            // Remplacez VOTRE_SERVICE_ID et VOTRE_CONTACT_TEMPLATE_ID (depuis emailjs.com)
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_6qgvizq', 'template_tj1n4da', {
                    from_name: name,
                    from_email: email,
                    phone: phone,
                    service: fd.get('service'),
                    message: message
                }).then(function() {
                    alert(currentLang === 'fr'
                        ? 'Merci ' + name + ' ! Votre message a bien ete envoye. Nous vous recontacterons sous 24h.'
                        : 'Thank you ' + name + '! Your message has been sent. We will get back to you within 24 hours.');
                    contactForm.reset();
                }, function(error) {
                    alert(currentLang === 'fr' ? 'Erreur lors de l\'envoi. Veuillez reessayer.' : 'Sending error. Please try again.');
                    console.error('EmailJS error:', error);
                }).finally(function() { submitBtn.disabled = false; submitBtn.style.opacity = '1'; });
            } else {
                alert(currentLang === 'fr'
                    ? 'Merci ' + name + ' ! Votre message a bien ete envoye. Nous vous recontacterons sous 24h.'
                    : 'Thank you ' + name + '! Your message has been sent. We will get back to you within 24 hours.');
                contactForm.reset();
                submitBtn.disabled = false; submitBtn.style.opacity = '1';
            }
        });
    }

    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', e => {
            e.preventDefault();
            if (hasHoneypotFilled(careerForm, 'company_url')) return;
            if (isRateLimited('career', 30000)) {
                alert(currentLang === 'fr' ? 'Veuillez patienter avant de renvoyer une candidature.' : 'Please wait before sending another application.');
                return;
            }
            const fd = new FormData(careerForm);
            const name = sanitize(fd.get('name').trim());
            const email = fd.get('email').trim();
            const phone = fd.get('phone').trim();
            const motivation = fd.get('motivation').trim();
            if (!name || name.length < 2) { alert(currentLang === 'fr' ? 'Veuillez entrer un nom valide.' : 'Please enter a valid name.'); return; }
            if (!validateEmail(email)) { alert(currentLang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email.'); return; }
            if (!validatePhone(phone)) { alert(currentLang === 'fr' ? 'Veuillez entrer un telephone valide.' : 'Please enter a valid phone number.'); return; }
            if (!motivation || motivation.length < 20) { alert(currentLang === 'fr' ? 'Votre lettre de motivation doit contenir au moins 20 caracteres.' : 'Your cover letter must contain at least 20 characters.'); return; }
            var careerBtn = careerForm.querySelector('button[type="submit"]');
            careerBtn.disabled = true;
            careerBtn.style.opacity = '0.6';

            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_6qgvizq', 'template_wg11978', {
                    from_name: name,
                    from_email: email,
                    phone: phone,
                    poste: fd.get('poste'),
                    motivation: motivation
                }).then(function() {
                    alert(currentLang === 'fr'
                        ? 'Merci ' + name + ' ! Votre candidature a bien ete envoyee.'
                        : 'Thank you ' + name + '! Your application has been sent.');
                    careerForm.reset();
                }, function(error) {
                    alert(currentLang === 'fr' ? 'Erreur lors de l\'envoi. Veuillez reessayer.' : 'Sending error. Please try again.');
                    console.error('EmailJS error:', error);
                }).finally(function() { careerBtn.disabled = false; careerBtn.style.opacity = '1'; });
            } else {
                alert(currentLang === 'fr'
                    ? 'Merci ' + name + ' ! Votre candidature a bien ete envoyee.'
                    : 'Thank you ' + name + '! Your application has been sent.');
                careerForm.reset();
                careerBtn.disabled = false; careerBtn.style.opacity = '1';
            }
        });
    }

    // smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.getAttribute('href').includes('careers')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const t = document.querySelector(this.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // i18n
    let currentLang = 'fr';

    const siteContent = {
        fr: {
            // Nav
            'nav.home': 'Accueil', 'nav.about': 'A propos', 'nav.services': 'Services',
            'nav.why': 'Pourquoi Nous', 'nav.careers': 'Carrieres', 'nav.contact': 'Contact',
            // Hero
            'hero.badge': 'TUM CORPORATION',
            'hero.title1': 'Developpez votre', 'hero.title2': 'Business',
            'hero.title3': 'et devenez une reference nationale et internationale',
            'hero.desc': 'Consulting strategique, sourcing international, branding et logistique internationale.',
            'hero.cta1': 'Decouvrir nos services', 'hero.cta2': 'Nous contacter',
            'stat.clients': 'Clients', 'stat.countries': 'Pays', 'stat.projects': 'Projets', 'stat.years': 'Exp.',
            'stat.caption': 'Afrique • Asie • Europe • Amerique',
            // About
            'about.tag': 'Qui sommes-nous', 'about.title': 'TATO UNIVERSAL MARKET CORPORATION',
            'about.certified': 'Certifie', 'about.partner': 'Partenaire de confiance',
            'about.desc': 'TATO UNIVERSAL MARKET CORPORATION est une societe de commerce international et de developpement d\'affaires qui accompagne les entreprises, les investisseurs et les entrepreneurs dans leurs projets de croissance et de developpement strategique.',
            'about.body1': 'Grace a une approche orientee resultats, nous concevons et mettons en oeuvre des solutions adaptees aux enjeux de nos clients, en combinant expertise operationnelle, reseau international et connaissance des marches.',
            'about.body2': 'Notre engagement repose sur des valeurs fortes : excellence, integrite, innovation et performance. Nous oeuvrons chaque jour a creer de la valeur durable pour nos partenaires et a contribuer au developpement economique des entreprises que nous accompagnons.',
            'about.f1.title': 'Vision Globale',
            'about.f1.desc': 'Faire de TUM Corporation une entreprise de reference en Afrique et a l\'international dans le conseil, le developpement des affaires et le commerce international.',
            'about.f2.title': 'Expertise Metier',
            'about.f2.desc': 'Une comprehension approfondie des enjeux economiques, commerciaux et strategiques au service de la performance et de la croissance des entreprises.',
            'about.f3.title': 'Accompagnement Sur-mesure',
            'about.f3.desc': 'Chaque projet est un engagement a long terme : ecoute, conseil strategique, mise en oeuvre operationnelle et suivi continu.',
            // Services
            'services.tag': 'Nos Services',
            'services.title': 'Des solutions completes pour votre entreprise',
            'services.desc': 'Chez TATO UNIVERSAL MARKET CORPORATION, nous developpons des solutions strategiques et operationnelles destinees a accompagner les entreprises, les investisseurs et les entrepreneurs dans leurs enjeux de croissance, de transformation et d\'expansion.',
            'svc.hint': 'Cliquez pour en savoir +', 'svc.close': 'Fermer',
            'svc1.title': 'Analyse Strategique et Developpement',
            'svc2.title': 'Gestion d\'Entreprise et Branding',
            'svc3.title': 'Sourcing et Approvisionnement',
            'svc4.title': 'Logistique Internationale',
            'svc5.title': 'Mise en Relation d\'Affaires',
            'svc6.title': 'Conseil en Import-Export',
            'svc1.p1': 'Nous accompagnons les entreprises et entrepreneurs dans l\'analyse approfondie de leur environnement economique, concurrentiel et sectoriel, afin d\'identifier avec precision les leviers de croissance et les opportunites de developpement.',
            'svc1.p2': 'Nos interventions visent a eclairer la prise de decision strategique, a renforcer la capacite d\'anticipation des organisations et a optimiser leur positionnement sur leurs marches.',
            'svc1.p3': 'A travers une analyse rigoureuse des donnees de marche, des tendances sectorielles et des objectifs propres a chaque organisation, nous concevons des recommandations strategiques et des plans d\'action operationnels.',
            'svc2.p1': 'La performance durable d\'une organisation repose sur une structuration solide, une gouvernance efficace et une vision strategique clairement definie. TUM Corporation accompagne les entreprises dans la structuration et la transformation de leur organisation.',
            'svc2.p2': 'Notre intervention s\'etend egalement a la gestion globale de l\'entreprise, incluant le suivi administratif, la structuration des operations financieres et la mise en place d\'outils de pilotage.',
            'svc2.p3': 'En parallele, nous accompagnons nos clients dans la construction de leur positionnement strategique, de leur image de marque et de leur identite institutionnelle.',
            'svc3.p1': 'Nous mettons a disposition notre expertise en recherche, selection et qualification de fournisseurs afin de garantir des solutions d\'approvisionnement fiables, competitives et conformes aux exigences de qualite.',
            'svc3.p2': 'Notre accompagnement couvre l\'identification des partenaires, l\'evaluation des capacites de production, la negociation commerciale ainsi que le suivi des operations d\'approvisionnement.',
            'svc4.p1': 'La maitrise des flux logistiques constitue un enjeu majeur dans le commerce international. TUM Corporation accompagne ses partenaires dans la coordination des operations logistiques.',
            'svc4.p2': 'Nos services comprennent l\'organisation des expeditions, la coordination des differents intervenants et le suivi des operations internationales, permettant d\'optimiser les delais et les couts.',
            'svc5.p1': 'TUM Corporation agit en tant que facilitateur strategique de connexions d\'affaires a forte valeur ajoutee entre entreprises, investisseurs, fournisseurs et institutions.',
            'svc5.p2': 'Grace a une approche fondee sur l\'analyse des besoins et la selection rigoureuse des acteurs, nous intervenons comme un intermediaire de confiance dans la structuration de partenariats strategiques.',
            'svc5.p3': 'Notre expertise et notre reseau international nous permettent de faciliter l\'acces a des opportunites d\'investissement, de developpement commercial et d\'expansion de marche.',
            'svc6.p1': 'TUM Corporation accompagne les entreprises dans leurs operations de commerce international en leur apportant une expertise technique, reglementaire et operationnelle.',
            'svc6.p2': 'Nous conseillons nos clients sur les procedures d\'importation et d\'exportation, les exigences documentaires et les pratiques commerciales internationales.',
            // Why Us
            'why.tag': 'Pourquoi Nous Choisir',
            'why.title': 'L\'excellence au coeur de chaque projet',
            'why.desc': 'Des valeurs fortes et une expertise reconnue pour un partenariat de confiance.',
            'why1.title': 'Reseau International', 'why1.desc': 'Partenaires verifies dans plus de 15 pays a travers le monde.',
            'why2.title': 'Fiabilite', 'why2.desc': 'Transparence et rigueur dans chaque etape de votre projet.',
            'why3.title': 'Experience', 'why3.desc': 'Des annees d\'expertise dans le commerce et consulting international.',
            'why4.title': 'Sur-mesure', 'why4.desc': 'Chaque solution est taillee pour vos besoins specifiques.',
            // Careers
            'careers.tag': 'Carrieres', 'careers.title': 'Rejoignez notre equipe',
            'careers.desc': 'Contribuez a connecter l\'Afrique aux marches mondiaux.',
            'career1.title': 'Agent Commercial', 'career1.badge': 'CDD - 1 an',
            'career1.desc': 'Developper le portefeuille clients et assurer la promotion des services de TUM Corporation aupres des entreprises et entrepreneurs.',
            'career2.title': 'Assistante de Direction et Commerciale', 'career2.badge': 'CDD - 1 an',
            'career2.desc': 'Assister la direction dans la gestion administrative et commerciale, coordonner les activites et assurer le suivi des dossiers clients.',
            'career.location': 'Abidjan, Cote d\'Ivoire', 'career.time': 'Temps plein',
            'career.form.title': 'Postuler / Recherche de poste',
            'career.form.desc': 'Remplissez ce formulaire pour soumettre votre candidature. Nous vous recontacterons dans les plus brefs delais.',
            'career.form.name': 'Nom complet *', 'career.form.email': 'Email *',
            'career.form.phone': 'Telephone *', 'career.form.poste': 'Poste souhaite *',
            'career.form.poste.default': 'Choisir un poste',
            'career.form.poste.1': 'Agent Commercial',
            'career.form.poste.2': 'Assistante de Direction et Commerciale',
            'career.form.poste.3': 'Candidature spontanee',
            'career.form.motivation': 'Lettre de motivation *',
            'career.form.submit': 'Envoyer ma candidature',
            // Contact
            'contact.title': 'Parlons de votre projet',
            'contact.desc': 'Contactez-nous pour discuter de vos besoins. Notre equipe vous repond sous 24h.',
            'contact.address.label': 'Adresse', 'contact.phone.label': 'Telephone',
            'contact.email.label': 'Email', 'contact.hours.label': 'Horaires',
            'contact.hours.value': 'Lun - Ven : 8h - 18h',
            'form.name': 'Nom complet', 'form.email': 'Email', 'form.phone': 'Telephone',
            'form.service': 'Service souhaite', 'form.service.default': 'Choisir un service',
            'form.message': 'Votre message',
            'form.submit': 'Envoyer le message', 'form.whatsapp': 'Ecrire sur WhatsApp',
            // Footer
            'footer.desc': 'Societe de commerce international et de developpement d\'affaires. Connecting the global markets and boosting your business.',
            'footer.links': 'Liens Rapides', 'footer.services': 'Services', 'footer.contact': 'Contact',
            'footer.rights': 'Tous droits reserves.',
            'footer.privacy': 'Politique de confidentialite', 'footer.terms': 'Conditions d\'utilisation',
            'footer.svc1': 'Analyse Strategique', 'footer.svc2': 'Branding', 'footer.svc3': 'Sourcing',
            'footer.svc4': 'Logistique', 'footer.svc5': 'Import-Export'
        },
        en: {
            'nav.home': 'Home', 'nav.about': 'About', 'nav.services': 'Services',
            'nav.why': 'Why Us', 'nav.careers': 'Careers', 'nav.contact': 'Contact',
            'hero.badge': 'TUM CORPORATION',
            'hero.title1': 'Grow your', 'hero.title2': 'Business',
            'hero.title3': 'and become a national and international reference',
            'hero.desc': 'Strategic consulting, international sourcing, branding and international logistics.',
            'hero.cta1': 'Discover our services', 'hero.cta2': 'Contact us',
            'stat.clients': 'Clients', 'stat.countries': 'Countries', 'stat.projects': 'Projects', 'stat.years': 'Exp.',
            'stat.caption': 'Africa • Asia • Europe • America',
            'about.tag': 'About Us', 'about.title': 'TATO UNIVERSAL MARKET CORPORATION',
            'about.certified': 'Certified', 'about.partner': 'Trusted partner',
            'about.desc': 'TATO UNIVERSAL MARKET CORPORATION is an international trade and business development company that supports businesses, investors and entrepreneurs in their growth and strategic development projects.',
            'about.body1': 'Through a results-oriented approach, we design and implement solutions adapted to our clients\' challenges, combining operational expertise, international network and market knowledge.',
            'about.body2': 'Our commitment is based on strong values: excellence, integrity, innovation and performance. We work every day to create lasting value for our partners and contribute to the economic development of the businesses we support.',
            'about.f1.title': 'Global Vision',
            'about.f1.desc': 'Making TUM Corporation a reference company in Africa and internationally in consulting, business development and international trade.',
            'about.f2.title': 'Industry Expertise',
            'about.f2.desc': 'A deep understanding of economic, commercial and strategic challenges serving business performance and growth.',
            'about.f3.title': 'Tailored Support',
            'about.f3.desc': 'Each project is a long-term commitment: listening, strategic advice, operational implementation and continuous monitoring.',
            'services.tag': 'Our Services',
            'services.title': 'Complete solutions for your business',
            'services.desc': 'At TATO UNIVERSAL MARKET CORPORATION, we develop strategic and operational solutions to support businesses, investors and entrepreneurs in their growth, transformation and expansion challenges.',
            'svc.hint': 'Click to learn more', 'svc.close': 'Close',
            'svc1.title': 'Strategic Analysis and Development',
            'svc2.title': 'Business Management and Branding',
            'svc3.title': 'Sourcing and Procurement',
            'svc4.title': 'International Logistics',
            'svc5.title': 'Business Matchmaking',
            'svc6.title': 'Import-Export Consulting',
            'svc1.p1': 'We support businesses and entrepreneurs in the in-depth analysis of their economic, competitive and sectoral environment, to precisely identify growth levers and development opportunities.',
            'svc1.p2': 'Our interventions aim to inform strategic decision-making, strengthen organizational anticipation capacity and optimize market positioning.',
            'svc1.p3': 'Through rigorous analysis of market data, sector trends and each organization\'s specific objectives, we design strategic recommendations and operational action plans.',
            'svc2.p1': 'Sustainable organizational performance relies on solid structuring, effective governance and a clearly defined strategic vision. TUM Corporation supports companies in structuring and transforming their organization.',
            'svc2.p2': 'Our intervention also extends to overall business management, including administrative monitoring, financial operations structuring and implementation of performance indicators.',
            'svc2.p3': 'In parallel, we support our clients in building their strategic positioning, brand image and institutional identity.',
            'svc3.p1': 'We provide our expertise in supplier research, selection and qualification to ensure reliable, competitive procurement solutions that meet quality requirements.',
            'svc3.p2': 'Our support covers partner identification, production capacity assessment, commercial negotiation and procurement operations monitoring.',
            'svc4.p1': 'Mastering logistics flows is a major challenge in international trade. TUM Corporation supports its partners in coordinating logistics operations.',
            'svc4.p2': 'Our services include organizing shipments, coordinating various stakeholders and monitoring international operations to optimize deadlines and costs.',
            'svc5.p1': 'TUM Corporation acts as a strategic facilitator of high-value business connections between companies, investors, suppliers and institutions.',
            'svc5.p2': 'Through a needs-based approach and rigorous actor selection, we act as a trusted intermediary in structuring strategic, commercial and industrial partnerships.',
            'svc5.p3': 'Our expertise and international network enable us to facilitate access to investment, commercial development and market expansion opportunities.',
            'svc6.p1': 'TUM Corporation supports businesses in their international trade operations by providing technical, regulatory and operational expertise.',
            'svc6.p2': 'We advise our clients on import and export procedures, documentary requirements and international commercial practices.',
            'why.tag': 'Why Choose Us',
            'why.title': 'Excellence at the heart of every project',
            'why.desc': 'Strong values and recognized expertise for a trusted partnership.',
            'why1.title': 'International Network', 'why1.desc': 'Verified partners in over 15 countries worldwide.',
            'why2.title': 'Reliability', 'why2.desc': 'Transparency and rigor at every step of your project.',
            'why3.title': 'Experience', 'why3.desc': 'Years of expertise in international trade and consulting.',
            'why4.title': 'Custom Solutions', 'why4.desc': 'Each solution is tailored to your specific needs.',
            'careers.tag': 'Careers', 'careers.title': 'Join our team',
            'careers.desc': 'Help connect Africa to global markets.',
            'career1.title': 'Sales Agent', 'career1.badge': 'Fixed-term - 1 year',
            'career1.desc': 'Develop the client portfolio and promote TUM Corporation services to businesses and entrepreneurs.',
            'career2.title': 'Executive and Commercial Assistant', 'career2.badge': 'Fixed-term - 1 year',
            'career2.desc': 'Assist management in administrative and commercial operations, coordinate activities and ensure client file follow-up.',
            'career.location': 'Abidjan, Ivory Coast', 'career.time': 'Full-time',
            'career.form.title': 'Apply / Job Search',
            'career.form.desc': 'Fill in this form to submit your application. We will contact you as soon as possible.',
            'career.form.name': 'Full name *', 'career.form.email': 'Email *',
            'career.form.phone': 'Phone *', 'career.form.poste': 'Desired position *',
            'career.form.poste.default': 'Choose a position',
            'career.form.poste.1': 'Sales Agent',
            'career.form.poste.2': 'Executive and Commercial Assistant',
            'career.form.poste.3': 'Spontaneous application',
            'career.form.motivation': 'Cover letter *',
            'career.form.submit': 'Send my application',
            'contact.title': 'Let\'s talk about your project',
            'contact.desc': 'Contact us to discuss your needs. Our team responds within 24 hours.',
            'contact.address.label': 'Address', 'contact.phone.label': 'Phone',
            'contact.email.label': 'Email', 'contact.hours.label': 'Hours',
            'contact.hours.value': 'Mon - Fri: 8am - 6pm',
            'form.name': 'Full Name', 'form.email': 'Email', 'form.phone': 'Phone',
            'form.service': 'Desired Service', 'form.service.default': 'Choose a service',
            'form.message': 'Your message',
            'form.submit': 'Send Message', 'form.whatsapp': 'Write on WhatsApp',
            'footer.desc': 'International trade and business development company. Connecting the global markets and boosting your business.',
            'footer.links': 'Quick Links', 'footer.services': 'Services', 'footer.contact': 'Contact',
            'footer.rights': 'All rights reserved.',
            'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service',
            'footer.svc1': 'Strategic Analysis', 'footer.svc2': 'Branding', 'footer.svc3': 'Sourcing',
            'footer.svc4': 'Logistics', 'footer.svc5': 'Import-Export'
        }
    };

    function switchLanguage(lang) {
        currentLang = lang;

        // 1. Translate all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (siteContent[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = siteContent[lang][key];
                } else if (el.tagName === 'OPTION' && el.value === '') {
                    el.textContent = siteContent[lang][key];
                } else {
                    el.textContent = siteContent[lang][key];
                }
            }
        });

        // 2. Translate service cards (titles, hints, detail texts, close buttons)
        const svcKeys = ['svc1','svc2','svc3','svc4','svc5','svc6'];
        const svcCards = document.querySelectorAll('.service-card');
        svcCards.forEach((card, i) => {
            const key = svcKeys[i];
            if (!key) return;
            const t = siteContent[lang];
            card.querySelectorAll('.service-card-preview h3, .service-card-detail h3').forEach(h => {
                h.textContent = t[key + '.title'] || h.textContent;
            });
            card.querySelectorAll('.service-toggle-hint').forEach(h => {
                h.textContent = t['svc.hint'];
            });
            card.querySelectorAll('.service-close-btn').forEach(b => {
                b.textContent = t['svc.close'];
            });
            const paragraphs = card.querySelectorAll('.service-card-detail p');
            paragraphs.forEach((p, j) => {
                const pk = key + '.p' + (j + 1);
                if (t[pk]) p.textContent = t[pk];
            });
        });

        // 3. Translate career cards
        const careerCards = document.querySelectorAll('.career-card');
        careerCards.forEach((card, i) => {
            const n = i + 1;
            const t = siteContent[lang];
            const title = card.querySelector('.career-header h3');
            const badge = card.querySelector('.career-badge');
            const desc = card.querySelector('p');
            const metaSpans = card.querySelectorAll('.career-meta span');
            if (title && t['career' + n + '.title']) title.textContent = t['career' + n + '.title'];
            if (badge && t['career' + n + '.badge']) badge.textContent = t['career' + n + '.badge'];
            if (desc && t['career' + n + '.desc']) desc.textContent = t['career' + n + '.desc'];
            if (metaSpans[0]) {
                const svg0 = metaSpans[0].querySelector('svg').outerHTML;
                metaSpans[0].innerHTML = svg0 + '\n                                ' + t['career.location'];
            }
            if (metaSpans[1]) {
                const svg1 = metaSpans[1].querySelector('svg').outerHTML;
                metaSpans[1].innerHTML = svg1 + '\n                                ' + t['career.time'];
            }
        });

        // 4. Translate career form
        const cfTitle = document.querySelector('.career-form-section h3');
        const cfDesc = document.querySelector('.career-form-section > p');
        const t = siteContent[lang];
        if (cfTitle) cfTitle.textContent = t['career.form.title'];
        if (cfDesc) cfDesc.textContent = t['career.form.desc'];
        const cfLabels = document.querySelectorAll('.career-form label');
        const labelKeys = ['career.form.name','career.form.email','career.form.phone','career.form.poste','career.form.motivation'];
        cfLabels.forEach((l, i) => { if (t[labelKeys[i]]) l.textContent = t[labelKeys[i]]; });
        const cfOptions = document.querySelectorAll('#career-poste option');
        const optKeys = ['career.form.poste.default','career.form.poste.1','career.form.poste.2','career.form.poste.3'];
        cfOptions.forEach((o, i) => { if (t[optKeys[i]]) o.textContent = t[optKeys[i]]; });
        const cfSubmit = document.querySelector('.career-form .btn');
        if (cfSubmit) {
            const svg = cfSubmit.querySelector('svg');
            cfSubmit.innerHTML = '';
            if (svg) cfSubmit.appendChild(svg);
            cfSubmit.appendChild(document.createTextNode('\n                            ' + t['career.form.submit']));
        }

        // 5. Translate footer service links
        const footerSvcLinks = document.querySelectorAll('.footer-grid > div:nth-child(3) .footer-links a');
        const fSvcKeys = ['footer.svc1','footer.svc2','footer.svc3','footer.svc4','footer.svc5'];
        footerSvcLinks.forEach((a, i) => { if (t[fSvcKeys[i]]) a.textContent = t[fSvcKeys[i]]; });

        // 6. Stats caption (innerHTML for bullet)
        const caption = document.querySelector('.hero-stats-caption');
        if (caption) caption.innerHTML = t['stat.caption'];

        // 7. Update lang attribute & buttons
        document.querySelectorAll('.lang-switch button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.documentElement.lang = lang;
    }

    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });
});
