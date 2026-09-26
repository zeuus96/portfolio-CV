/* ===========================================================
   app.js — Portfolio interactions & effects

   Ordering matters here: anything that makes content VISIBLE
   runs first, and every decorative effect is sandboxed, so a
   failure in an effect can never leave the page blank.
   =========================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var canAnimate = root.classList.contains('js-motion');

  // Run a decorative effect without letting it break anything else
  function safe(fn) {
    try { fn(); } catch (err) {
      if (window.console && console.warn) console.warn('[portfolio] effect skipped:', err);
    }
  }

  /* =====================================================
     0. Theme toggle (light / dark, persisted)
     ===================================================== */

  safe(function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isLight = root.getAttribute('data-theme') === 'light';
      var next = isLight ? 'dark' : 'light';

      if (next === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');

      try { localStorage.setItem('hn-theme', next); } catch (e) {}
    });
  });

  /* =====================================================
     0b. Language toggle (EN / FR, persisted)
     ===================================================== */

  var I18N = {
    'nav.about': { en: 'About', fr: 'À propos' },
    'nav.experience': { en: 'Experience', fr: 'Expérience' },
    'nav.skills': { en: 'Skills', fr: 'Compétences' },
    'nav.certifications': { en: 'Certifications', fr: 'Certifications' },
    'nav.contact': { en: 'Contact', fr: 'Contact' },

    'hero.eyebrow': { en: 'Software Engineer', fr: 'Ingénieur logiciel' },
    'hero.summary': {
      en: 'Senior Fullstack Java engineer with 5+ years building production-grade backends, microservices and cloud infrastructure for fintech, automotive and insurance clients. Currently working at <strong>Crédit Agricole</strong>.',
      fr: 'Ingénieur Java Fullstack senior, plus de 5 ans à concevoir des backends de production, des microservices et des infrastructures cloud pour la finance, l’automobile et l’assurance. Actuellement en poste chez <strong>Crédit Agricole</strong>.'
    },
    'hero.cta1': { en: 'View experience', fr: 'Voir le parcours' },
    'hero.cta2': { en: 'Get in touch', fr: 'Me contacter' },
    'hero.scroll': { en: 'Scroll', fr: 'Défiler' },

    'about.label': { en: 'Who I am', fr: 'Qui je suis' },
    'about.title': {
      en: 'Engineering with precision,<br/>leading with purpose',
      fr: 'Une ingénierie précise,<br/>un leadership assumé'
    },
    'about.p1': {
      en: 'I’m a full-stack Java engineer specialising in backend architecture, cloud-native infrastructure and DevOps practices. Over five years I’ve contributed to high-stakes projects in banking, automotive fleet management, and insurance — always with a focus on clean code, maintainable systems and team growth.',
      fr: 'Je suis ingénieur full-stack Java, spécialisé en architecture backend, infrastructure cloud-native et pratiques DevOps. Depuis cinq ans, je contribue à des projets à forts enjeux dans la banque, la gestion de flotte automobile et l’assurance — toujours avec le souci d’un code propre, de systèmes maintenables et de la montée en compétence des équipes.'
    },
    'about.p2': {
      en: 'Beyond shipping features, I’ve led technical migrations, defined CI/CD standards on Azure DevOps and GitLab, and facilitated knowledge transfer workshops for cross-functional teams. I also teach Java and web development as a part-time instructor.',
      fr: 'Au-delà des livraisons, j’ai piloté des migrations techniques, défini des standards CI/CD sur Azure DevOps et GitLab, et animé des ateliers de transfert de compétences pour des équipes transverses. J’enseigne également Java et le développement web en tant que professeur vacataire.'
    },
    'about.stat1': { en: 'Years of experience', fr: 'Années d’expérience' },
    'about.stat2': { en: 'Projects delivered', fr: 'Projets livrés' },
    'about.stat3': { en: 'Languages spoken', fr: 'Langues parlées' },
    'about.stat4': { en: 'Certifications', fr: 'Certifications' },

    'exp.label': { en: 'Career', fr: 'Parcours' },
    'exp.title': { en: 'Experience', fr: 'Expérience' },
    'badge.current': { en: 'Current', fr: 'Actuel' },

    'job1.role': { en: 'Java / DevOps Engineer', fr: 'Ingénieur Java / DevOps' },
    'job1.dates': { en: 'Oct 2025 — Present', fr: 'Oct 2025 — Présent' },
    'job1.project': { en: 'Project: Découverte Habitat (Programme Loan IT)', fr: 'Projet : Découverte Habitat (Programme Loan IT)' },
    'job1.desc': {
      en: 'Refactoring of the pre-sales Habitat journey to improve collaborator experience and modernise the information system, focusing on discovery and financing proposal phases.',
      fr: 'Refonte du parcours avant-vente Habitat pour améliorer l’expérience des collaborateurs et moderniser le système d’information, sur les phases de découverte et de proposition de financement.'
    },
    'job1.t1': { en: 'Backend service design and development in Java / Spring Boot aligned with CA-TS architecture standards', fr: 'Conception et développement de services backend en Java / Spring Boot conformes aux standards d’architecture CA-TS' },
    'job1.t2': { en: 'Technical stack modernisation — version upgrades, dependency management, compatibility resolution', fr: 'Modernisation de la pile technique — montées de version, gestion des dépendances, résolution de compatibilité' },
    'job1.t3': { en: 'Unit and integration testing; delivery across DEV, QUALIF and PROD environments', fr: 'Tests unitaires et d’intégration ; livraisons sur les environnements DEV, QUALIF et PROD' },
    'job1.t4': { en: 'CI/CD pipeline contribution, deployment industrialisation and DevOps best practices', fr: 'Contribution aux pipelines CI/CD, industrialisation des déploiements et bonnes pratiques DevOps' },
    'job1.t5': { en: 'Technical documentation per CATS referential', fr: 'Documentation technique selon le référentiel CATS' },

    'job2.role': { en: 'Java / DevOps Engineer', fr: 'Ingénieur Java / DevOps' },
    'job2.dates': { en: 'Apr 2024 — Oct 2025', fr: 'Avr 2024 — Oct 2025' },
    'job2.project': { en: 'Project: Watèa by Michelin — Electric Fleet Management', fr: 'Projet : Watèa by Michelin — Gestion de flotte électrique' },
    'job2.desc': {
      en: 'Foundation team integration on Watèa, an innovative electric fleet management solution, delivering industrialisation, code quality and DevOps infrastructure optimisation.',
      fr: 'Intégration à l’équipe socle de Watèa, solution innovante de gestion de flotte électrique, avec un focus sur l’industrialisation, la qualité de code et l’optimisation de l’infrastructure DevOps.'
    },
    'job2.t1': { en: 'Technical lead on Java 17 / Spring Boot 2.7.x → Java 21 / Spring Boot 3.x migration; refactored common modules into a shared library for all Feature Teams', fr: 'Pilote technique de la migration Java 17 / Spring Boot 2.7.x → Java 21 / Spring Boot 3.x ; refactorisation des modules communs en librairie partagée pour toutes les Feature Teams' },
    'job2.t2': { en: 'Code quality guardian: SonarQube, code reviews, CI/CD on Azure DevOps', fr: 'Garant de la qualité de code : SonarQube, revues de code, CI/CD sur Azure DevOps' },
    'job2.t3': { en: 'Cloud infrastructure management with Terraform and Azure; automated environment deployments', fr: 'Gestion de l’infrastructure cloud avec Terraform et Azure ; déploiements d’environnements automatisés' },
    'job2.t4': { en: 'Refactored critical components for maintainability and performance', fr: 'Refactorisation de composants critiques pour la maintenabilité et la performance' },
    'job2.t5': { en: 'Workshops and technical mentoring for developer upskilling on new stack', fr: 'Ateliers et mentorat technique pour la montée en compétence des développeurs sur la nouvelle stack' },
    'job2.t6': { en: 'Automated testing with Cypress', fr: 'Tests automatisés avec Cypress' },

    'job3.dates': { en: 'Oct 2023 — Apr 2024', fr: 'Oct 2023 — Avr 2024' },
    'job3.role': { en: 'Java Developer', fr: 'Développeur Java' },
    'job3.project': { en: 'Project: ULTIM — Tyre Management (storage, retreading, RFID)', fr: 'Projet : ULTIM — Gestion des pneumatiques (stockage, rechapage, RFID)' },
    'job3.desc': {
      en: 'Migration and development of the ULTIM project covering full tyre lifecycle management including storage, retreading and RFID tracking.',
      fr: 'Migration et développement du projet ULTIM, couvrant l’ensemble du cycle de vie des pneumatiques : stockage, rechapage et traçabilité RFID.'
    },
    'job3.t1': { en: 'Rewrote legacy microservices from Java 8 / Vert.X to Java 17 / Spring Boot 3', fr: 'Réécriture de microservices existants de Java 8 / Vert.X vers Java 17 / Spring Boot 3' },
    'job3.t2': { en: 'Implemented robust message consumers using WebSphere and Kafka', fr: 'Mise en place de consommateurs de messages robustes avec WebSphere et Kafka' },
    'job3.t3': { en: 'Automated testing with Karate; database versioning with Liquibase', fr: 'Tests automatisés avec Karate ; versionnage de base de données avec Liquibase' },
    'job3.t4': { en: 'Azure Data Factory (ADF) pipeline design', fr: 'Conception de pipelines Azure Data Factory (ADF)' },
    'job3.t5': { en: 'MongoDB migration scripts; CI/CD on GitLab', fr: 'Scripts de migration MongoDB ; CI/CD sur GitLab' },

    'job4.role': { en: 'Part-Time Instructor', fr: 'Professeur vacataire' },
    'job4.dates': { en: 'Oct 2024 — Present', fr: 'Oct 2024 — Présent' },
    'job4.desc': {
      en: 'Teaching programming fundamentals, OOP, Java and web development to engineering students. Preparing course materials, demos, and practical workshops. Evaluating student progress through directed sessions and examinations.',
      fr: 'Enseignement des fondamentaux de la programmation, de la POO, de Java et du développement web à des étudiants ingénieurs. Préparation des supports de cours, démonstrations et travaux pratiques. Évaluation des étudiants via des séances dirigées et des examens.'
    },

    'job5.role': { en: 'Java / Angular Fullstack Developer', fr: 'Développeur Fullstack Java / Angular' },
    'job5.dates': { en: 'Jan 2023 — Jun 2023', fr: 'Janv 2023 — Juin 2023' },
    'job5.project': { en: 'Project: Banking credit request application (from scratch)', fr: 'Projet : Application bancaire de demande de crédit (from scratch)' },
    'job5.desc': {
      en: 'Built a banking application enabling agents to submit credit requests, implementing the Bankerise core banking solution.',
      fr: 'Développement d’une application bancaire permettant aux agents de soumettre des demandes de crédit, sur la solution cœur bancaire Bankerise.'
    },
    'job5.t1': { en: 'BPMN business process design with Flowable; form creation with Formio', fr: 'Conception de processus métier BPMN avec Flowable ; création de formulaires avec Formio' },
    'job5.t2': { en: 'Full security module ownership: Keycloak configuration, Spring Security, OAuth2', fr: 'Prise en charge complète du module sécurité : configuration Keycloak, Spring Security, OAuth2' },
    'job5.t3': { en: 'Terraform-provisioned Keycloak infrastructure', fr: 'Infrastructure Keycloak provisionnée avec Terraform' },
    'job5.t4': { en: 'Data migration scripts from Excel files to database and Keycloak', fr: 'Scripts de migration de données Excel vers la base et Keycloak' },
    'job5.t5': { en: 'CI/CD integration on GitLab; post-production debugging', fr: 'Intégration CI/CD sur GitLab ; débogage post-production' },

    'job6.role': { en: 'Java / Angular Fullstack Developer', fr: 'Développeur Fullstack Java / Angular' },
    'job6.dates': { en: 'Sep 2021 — Oct 2022', fr: 'Sept 2021 — Oct 2022' },
    'job6.project': { en: 'Project: Insurance contract management platform (client: AMI Assurance)', fr: 'Projet : Plateforme de gestion de contrats d’assurance (client : AMI Assurance)' },
    'job6.desc': {
      en: 'Web solution for insurance agents to manage contracts and their clients, from requirements gathering through to production support.',
      fr: 'Solution web permettant aux agents d’assurance de gérer les contrats et leurs clients, du recueil des besoins jusqu’au support en production.'
    },
    'job6.t1': { en: 'Participated in client meetings to gather and refine requirements', fr: 'Participation aux réunions avec le client pour recueillir et affiner les besoins' },
    'job6.t2': { en: 'Built full CRUD UI screens with reusable TypeScript components and services', fr: 'Développement d’interfaces CRUD complètes avec composants et services TypeScript réutilisables' },
    'job6.t3': { en: 'Owned the security module — OAuth2, Google reCAPTCHA, brute-force protection', fr: 'En charge du module de sécurité — OAuth2, Google reCAPTCHA, protection contre le brute-force' },
    'job6.t4': { en: 'Developed external API integrations, including Tunisian ATTT vehicle data', fr: 'Développement d’intégrations d’API externes, dont les données véhicules de l’ATTT tunisienne' },
    'job6.t5': { en: 'Wrote data migration scripts from Excel files to the database', fr: 'Scripts de migration de données depuis des fichiers Excel vers la base de données' },
    'job6.t6': { en: 'Maintained several microservices; system and regression testing after QA feedback', fr: 'Maintenance de plusieurs microservices ; tests système et de régression après retours de l’équipe QA' },

    'job7.role': { en: 'Java / Angular Fullstack Developer', fr: 'Développeur Fullstack Java / Angular' },
    'job7.dates': { en: 'Mar 2021 — Aug 2021', fr: 'Mars 2021 — Août 2021' },
    'job7.project': { en: 'Project: ETL Bridge — internal SaaS data migration platform', fr: 'Projet : ETL Bridge — plateforme SaaS interne de migration de données' },
    'job7.desc': {
      en: 'Internal SaaS product built as a small Agile Scrum team (1 product owner, 2 developers, 1 tech lead), enabling data extraction and migration between heterogeneous sources.',
      fr: 'Produit SaaS interne développé au sein d’une petite équipe Agile Scrum (1 product owner, 2 développeurs, 1 tech lead), permettant l’extraction et la migration de données entre sources hétérogènes.'
    },
    'job7.t1': { en: 'Built CRUD UI screens with reusable TypeScript components and services', fr: 'Développement d’interfaces CRUD avec composants et services TypeScript réutilisables' },
    'job7.t2': { en: 'Developed plugins to extract data from multiple heterogeneous sources', fr: 'Développement de plugins pour extraire les données de sources hétérogènes' },
    'job7.t3': { en: 'Developed plugins to migrate data from one source to another', fr: 'Développement de plugins pour migrer les données d’une source à une autre' },
    'job7.t4': { en: 'Debugged and maintained the platform; resolved reported bugs', fr: 'Débogage et maintenance de la plateforme ; correction des bugs signalés' },
    'job7.t5': { en: 'Helped keep technical documentation up to date', fr: 'Aide à la mise à jour de la documentation technique' },

    'job8.role': { en: 'Part-Time Instructor', fr: 'Professeur vacataire' },
    'job8.dates': { en: 'Nov 2022 — Feb 2023', fr: 'Nov 2022 — Févr 2023' },
    'job8.desc': {
      en: 'Designed and delivered a Spring / Spring Boot initiation programme for 15 students. Covered OOP fundamentals, Java framework architecture and built a stock management application with Spring Boot and Thymeleaf.',
      fr: 'Conception et animation d’un programme d’initiation à Spring / Spring Boot pour 15 étudiants. Fondamentaux de la POO, architecture des frameworks Java, et réalisation d’une application de gestion de stock avec Spring Boot et Thymeleaf.'
    },

    'skills.label': { en: 'Tech stack', fr: 'Stack technique' },
    'skills.title': { en: 'Skills', fr: 'Compétences' },
    'skills.backend': { en: 'Backend', fr: 'Backend' },
    'skills.devops': { en: 'DevOps &amp; Cloud', fr: 'DevOps &amp; Cloud' },
    'skills.frontend': { en: 'Frontend', fr: 'Frontend' },
    'skills.data': { en: 'Data &amp; Messaging', fr: 'Données &amp; Messagerie' },
    'skills.security': { en: 'Security &amp; API', fr: 'Sécurité &amp; API' },
    'skills.testing': { en: 'Testing &amp; Quality', fr: 'Tests &amp; Qualité' },
    'skills.codeReview': { en: 'Code Review', fr: 'Revue de code' },
    'skills.architecture': { en: 'Architecture', fr: 'Architecture' },
    'skills.di': { en: 'Dependency Injection', fr: 'Injection de dépendances' },
    'skills.methods': { en: 'Methods &amp; Tools', fr: 'Méthodes &amp; Outils' },

    'certs.label': { en: 'Credentials', fr: 'Diplômes & certifications' },
    'certs.title': { en: 'Certifications &amp; Education', fr: 'Certifications &amp; Formation' },
    'certs.degree': { en: 'National Engineering Degree in Computer Science', fr: 'Diplôme national d’ingénieur en informatique' },
    'cert1.title': { en: 'TOEIC Pass Certificate', fr: 'Certificat TOEIC' },
    'cert1.sub': { en: 'Score: 746', fr: 'Score : 746' },
    'cert2.title': { en: 'Angular &amp; Spring Boot Training', fr: 'Formation Angular &amp; Spring Boot' },
    'cert2.sub': { en: 'Full-stack web development', fr: 'Développement web full-stack' },
    'cert3.title': { en: 'Scrum Foundation Professional Certificate', fr: 'Certificat professionnel Scrum Foundation' },
    'cert4.title': { en: 'Business Intelligence Foundation Professional', fr: 'Certificat Business Intelligence Foundation' },
    'cert5.title': { en: 'Project Management Essentials Certified', fr: 'Certification essentielle en gestion de projet' },
    'cert6.title': { en: 'Gravitee Event-native API Management', fr: 'Gravitee — Gestion d’API event-native' },
    'cert6.sub': { en: 'Foundations', fr: 'Fondamentaux' },

    'contact.label': { en: 'Let’s connect', fr: 'Restons en contact' },
    'contact.title': { en: 'Contact', fr: 'Contact' },
    'contact.lead': {
      en: 'Available for engineering roles, technical consulting and teaching opportunities. Reach out and I’ll get back to you promptly.',
      fr: 'Disponible pour des postes d’ingénieur, du conseil technique ou des missions d’enseignement. Écrivez-moi, je réponds rapidement.'
    },
    'contact.email': { en: 'Email', fr: 'E-mail' },
    'contact.phone': { en: 'Phone', fr: 'Téléphone' },

    'form.name': { en: 'Name', fr: 'Nom' },
    'form.namePh': { en: 'Your name', fr: 'Votre nom' },
    'form.email': { en: 'Email', fr: 'E-mail' },
    'form.subject': { en: 'Subject', fr: 'Objet' },
    'form.subjectPh': { en: 'What’s this about?', fr: 'Objet du message' },
    'form.message': { en: 'Message', fr: 'Message' },
    'form.messagePh': { en: 'Tell me more…', fr: 'Dites-m’en plus…' },
    'form.send': { en: 'Send message', fr: 'Envoyer' },
    'form.sending': { en: 'Sending…', fr: 'Envoi…' },
    'form.sent': { en: '✓ Message sent. I’ll get back to you shortly.', fr: '✓ Message envoyé. Je reviens vers vous rapidement.' },
    'form.error': { en: 'Something went wrong — please email me directly instead.', fr: 'Une erreur est survenue — merci de m’écrire directement par e-mail.' },

    'footer.copy': { en: '© 2026 Hamza Naceur. Built with precision.', fr: '© 2026 Hamza Naceur. Conçu avec précision.' }
  };

  var ROLES = {
    en: ['Senior Java Full-Stack Developer', 'DevOps & Cloud Practitioner', 'Technical Leader', 'Part-Time Instructor'],
    fr: ['Développeur Java Full-Stack Senior', 'Praticien DevOps & Cloud', 'Leader Technique', 'Professeur vacataire']
  };

  function currentLang() {
    return root.getAttribute('data-lang') === 'fr' ? 'fr' : 'en';
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var entry = I18N[el.getAttribute('data-i18n')];
      if (entry) el.innerHTML = entry[lang] || entry.en;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var entry = I18N[el.getAttribute('data-i18n-placeholder')];
      if (entry) el.setAttribute('placeholder', entry[lang] || entry.en);
    });

    var label = document.getElementById('langToggleLabel');
    if (label) label.textContent = lang === 'fr' ? 'EN' : 'FR';

    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);
  }

  safe(function () {
    applyLang(currentLang());

    var btn = document.getElementById('langToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var next = currentLang() === 'fr' ? 'en' : 'fr';
      applyLang(next);
      try { localStorage.setItem('hn-lang', next); } catch (e) {}
    });
  });

  function revealAll() {
    document.querySelectorAll('.reveal, .section-title').forEach(function (el) {
      el.classList.add('visible');
    });
    document.querySelectorAll('.counter').forEach(function (el) {
      el.textContent = el.dataset.to || el.textContent;
    });
    document.querySelectorAll('.section-label').forEach(function (el) {
      if (el.dataset.text) el.textContent = el.dataset.text;
    });
  }

  /* =====================================================
     1. Reveals, counters and decoding labels
     ===================================================== */

  var CHARS = '!<>-_\\/[]{}—=+*^?#01';

  function decode(el) {
    var final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    if (reduceMotion) { el.textContent = final; return; }

    var frame = 0;
    var total = final.length * 3 + 12;

    (function run() {
      var out = '';
      for (var k = 0; k < final.length; k++) {
        if (frame > k * 3 + 6) out += final.charAt(k);
        else if (frame > k * 3) out += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        else out += ' ';
      }
      el.textContent = out;
      frame++;
      if (frame <= total) setTimeout(run, 28);
      else el.textContent = final;
    })();
  }

  function countUp(el) {
    var target = parseInt(el.dataset.to, 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }

    var duration = 1100;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  if (!canAnimate || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    // Stagger the tags inside each revealing block
    document.querySelectorAll('.reveal').forEach(function (block) {
      block.querySelectorAll('.tag, .stag').forEach(function (tag, idx) {
        tag.style.transitionDelay = Math.min(idx * 45, 500) + 'ms';
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.classList.contains('counter')) countUp(el);
        else if (el.classList.contains('section-label')) decode(el);
        else el.classList.add('visible');

        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document
      .querySelectorAll('.reveal, .section-title, .section-label, .counter')
      .forEach(function (el) { observer.observe(el); });
  }

  // Failsafe: the hero entrance is a one-shot, so drop the class that
  // holds it at opacity 0 once it has certainly finished.
  setTimeout(function () { root.classList.remove('anim'); }, 2400);

  /* =====================================================
     2. Navbar, reading progress, active link, back to top
     ===================================================== */

  var navbar = document.getElementById('navbar');
  var progress = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  var rail = document.getElementById('tlRail');
  var timeline = document.querySelector('.timeline');
  var dots = document.querySelectorAll('.timeline .marker-dot');

  function updateTimeline() {
    if (!rail || !timeline || !dots.length) return;

    var rect = timeline.getBoundingClientRect();
    var trigger = window.innerHeight * 0.62;
    var lastDot = dots[dots.length - 1];
    var maxHeight = lastDot.getBoundingClientRect().top - rect.top + 7;
    var filled = Math.max(0, Math.min(trigger - rect.top, maxHeight));

    rail.style.height = filled + 'px';

    dots.forEach(function (dot) {
      var offset = dot.getBoundingClientRect().top - rect.top;
      dot.classList.toggle('reached', filled >= offset);
    });
  }

  function onScroll() {
    var y = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', y > 40);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    if (toTop) toTop.classList.toggle('show', y > 600);

    var current = '';
    sections.forEach(function (section) {
      if (y >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    updateTimeline();
  }

  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { onScroll(); queued = false; });
  }, { passive: true });

  window.addEventListener('resize', updateTimeline);

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* =====================================================
     3. Mobile menu
     ===================================================== */

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* =====================================================
     4. Contact form
     ===================================================== */

  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var lang = currentLang();
      var btn = form.querySelector('.form-submit');
      var restLabel = (I18N['form.send'] && I18N['form.send'][lang]) || 'Send message';

      // Honeypot: real visitors never fill this hidden field
      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.value) return;

      btn.textContent = (I18N['form.sending'] && I18N['form.sending'][lang]) || 'Sending…';
      btn.style.opacity = '0.7';
      btn.disabled = true;
      note.style.color = '';
      note.textContent = '';

      // Web3Forms — free, no backend of your own needed.
      // Get a key at https://web3forms.com (just an email address, no
      // account) and paste it into the access_key hidden input above.
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            note.textContent = (I18N['form.sent'] && I18N['form.sent'][lang]) || 'Message sent.';
            form.reset();
          } else {
            throw new Error((result.data && result.data.message) || 'Request failed');
          }
        })
        .catch(function () {
          note.style.color = '#ff6b6b';
          note.textContent = (I18N['form.error'] && I18N['form.error'][lang]) ||
            'Something went wrong — please email me directly instead.';
        })
        .finally(function () {
          btn.textContent = restLabel;
          btn.style.opacity = '';
          btn.disabled = false;
          setTimeout(function () { note.textContent = ''; note.style.color = ''; }, 7000);
        });
    });
  }

  /* =====================================================
     5. Smooth scroll for in-page anchors
     ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* =====================================================
     6. Typed role in the hero
     ===================================================== */

  safe(function () {
    var typedEl = document.getElementById('typed-role');
    if (!typedEl) return;

    var roles = ROLES[currentLang()] || ROLES.en;

    if (reduceMotion) { typedEl.textContent = roles[0]; return; }

    var roleIndex = 0, charIndex = 0, deleting = false;

    (function typeRole() {
      var role = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = role.substring(0, charIndex);

      var delay = deleting ? 42 : 78;
      if (!deleting && charIndex === role.length) {
        delay = 2000;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }
      setTimeout(typeRole, delay);
    })();
  });

  /* =====================================================
     7. The code block types itself in
     ===================================================== */

  safe(function () {
    var pre = document.querySelector('.code-body');
    if (!pre || reduceMotion) return;

    var walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT, null, false);
    var parts = [];
    var node;
    while ((node = walker.nextNode())) parts.push({ node: node, text: node.nodeValue });
    if (!parts.length) return;

    // Lock the height so the card doesn't grow while typing
    pre.style.minHeight = pre.offsetHeight + 'px';
    parts.forEach(function (p) { p.node.nodeValue = ''; });

    var caret = document.createElement('span');
    caret.className = 'code-caret';

    var i = 0, j = 0;
    var PER_FRAME = 5;
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      parts.forEach(function (p) { p.node.nodeValue = p.text; });
      if (caret.parentNode) caret.parentNode.removeChild(caret);
    }

    function tick() {
      var budget = PER_FRAME;
      while (budget > 0 && i < parts.length) {
        var part = parts[i];
        if (j === 0 && part.node.parentNode) {
          part.node.parentNode.insertBefore(caret, part.node.nextSibling);
        }
        if (j < part.text.length) {
          part.node.nodeValue += part.text.charAt(j);
          j++;
          budget--;
        } else {
          i++;
          j = 0;
        }
      }
      if (i < parts.length) requestAnimationFrame(tick);
      else finish();
    }

    setTimeout(function () { requestAnimationFrame(tick); }, 900);
    // If anything stalls the animation, show the full code anyway
    setTimeout(finish, 9000);
  });

  /* =====================================================
     8. Hero node network — microservice topology, drifting
     ===================================================== */

  safe(function () {
    var canvas = document.getElementById('heroCanvas');
    var hero = document.getElementById('hero');
    if (!canvas || !hero || reduceMotion) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = 0, h = 0, nodes = [], raf = null, running = false;
    var pointer = { x: -9999, y: -9999 };
    var LINK = 20000;   // squared link distance between nodes
    var REACH = 28000;  // squared reach of the pointer

    function seed() {
      var count = Math.max(16, Math.min(44, Math.round((w * h) / 27000)));
      nodes = [];
      for (var k = 0; k < count; k++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: Math.random() * 1.3 + 0.9
        });
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = hero.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      var a, p;
      for (a = 0; a < nodes.length; a++) {
        p = nodes[a];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      ctx.lineWidth = 1;

      for (var m = 0; m < nodes.length; m++) {
        for (var n = m + 1; n < nodes.length; n++) {
          var q = nodes[m], r = nodes[n];
          var dx = q.x - r.x, dy = q.y - r.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK) {
            ctx.strokeStyle = 'rgba(0,194,255,' + ((1 - d2 / LINK) * 0.15).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(q.x, q.y);
            ctx.lineTo(r.x, r.y);
            ctx.stroke();
          }
        }
      }

      for (var s = 0; s < nodes.length; s++) {
        var t = nodes[s];
        var px = t.x - pointer.x, py = t.y - pointer.y;
        var pd = px * px + py * py;
        var near = pd < REACH;

        if (near) {
          ctx.strokeStyle = 'rgba(0,194,255,' + ((1 - pd / REACH) * 0.45).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(t.x, t.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = near ? 'rgba(0,255,157,0.8)' : 'rgba(0,194,255,0.4)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, near ? t.r * 1.6 : t.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; frame(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    hero.addEventListener('pointermove', function (e) {
      var rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    });
    hero.addEventListener('pointerleave', function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    resize();
    start();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start(); else stop();
      }, { threshold: 0 }).observe(hero);
    }
  });

  /* =====================================================
     9. Cursor spotlight
     ===================================================== */

  safe(function () {
    var el = document.getElementById('spotlight');
    if (!el || reduceMotion || !finePointer) return;

    var x = 0, y = 0, pending = false;

    window.addEventListener('pointermove', function (e) {
      x = e.clientX;
      y = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        el.classList.add('on');
        pending = false;
      });
    }, { passive: true });
  });

  /* =====================================================
     10. Hero parallax + code block tilt
     ===================================================== */

  safe(function () {
    var hero = document.getElementById('hero');
    var block = document.querySelector('.code-block');
    if (!hero || !block || reduceMotion || !finePointer) return;

    hero.addEventListener('pointermove', function (e) {
      var rect = hero.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      block.style.transform =
        'perspective(1200px) rotateY(' + (nx * 7).toFixed(2) + 'deg) rotateX(' +
        (-ny * 7).toFixed(2) + 'deg) translate3d(' + (nx * -14).toFixed(1) + 'px,' +
        (ny * -10).toFixed(1) + 'px,0)';
    });

    hero.addEventListener('pointerleave', function () { block.style.transform = ''; });
  });

  /* =====================================================
     11. Cursor-tracked glow inside cards
     ===================================================== */

  safe(function () {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll('.timeline-card, .skill-category, .cert-card')
      .forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty('--gx', (e.clientX - rect.left) + 'px');
          card.style.setProperty('--gy', (e.clientY - rect.top) + 'px');
        });
      });
  });

  /* =====================================================
     12. Magnetic buttons
     ===================================================== */

  safe(function () {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta')
      .forEach(function (btn) {
        btn.addEventListener('pointermove', function (e) {
          var rect = btn.getBoundingClientRect();
          var dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
          var dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
          btn.style.transform =
            'translate(' + (dx * 10).toFixed(1) + 'px,' + (dy * 8).toFixed(1) + 'px)';
        });
        btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
      });
  });

  onScroll();
})();
