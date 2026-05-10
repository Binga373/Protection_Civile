/* ===================================================
   PROTECTION CIVILE DE BENI - SCRIPTS PREMIUM
   Version: 2.0
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== INITIALISATION AOS ==========
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
    });
    
    // ========== PRELOADER ==========
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1500);
    
    // ========== ÉLÉMENTS DOM ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const header = document.getElementById('header');
    const alertButton = document.getElementById('alertButton');
    const emergencyModal = document.getElementById('emergencyModal');
    const modalClose = document.querySelector('.modal-close-btn');
    const contactForm = document.getElementById('contactForm');
    const particlesContainer = document.getElementById('particles');
    
    // ========== PARTICULES HÉRO ==========
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // ========== MENU MOBILE ==========
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ========== HEADER SCROLL ==========
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Header style
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll top button
        if (scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
        
        // Navigation active
        updateActiveNav(scrollY);
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========== NAVIGATION ACTIVE ==========
    function updateActiveNav(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ========== COMPTEURS ANIMÉS ==========
    const counters = document.querySelectorAll('.counter');
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = Date.now();
            
            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // Ease-out
                const current = Math.floor(eased * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(update);
        });
    }
    
    // Observer pour déclencher les compteurs
    const impactSection = document.getElementById('impact');
    if (impactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(impactSection);
    }
    
    // Compteurs du héro
    const heroCounters = document.querySelectorAll('.hero-stat-number');
    const heroSection = document.getElementById('home');
    if (heroSection && heroCounters.length > 0) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroCounters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        counter.textContent = target + '+';
                    });
                    heroObserver.unobserve(entry.target);
                }
            });
        });
        heroObserver.observe(heroSection);
    }
    
    // ========== MODAL URGENCE ==========
    if (alertButton) {
        alertButton.addEventListener('click', function() {
            emergencyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeModal() {
        emergencyModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    emergencyModal.addEventListener('click', function(e) {
        if (e.target === emergencyModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emergencyModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Fermer la modal en cliquant sur le lien formulaire
    const modalFormLink = document.querySelector('.modal-form-btn');
    if (modalFormLink) {
        modalFormLink.addEventListener('click', function() {
            setTimeout(closeModal, 300);
        });
    }
    
    // ========== FORMULAIRE DE CONTACT ==========
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nom = document.getElementById('nom').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const localite = document.getElementById('localite').value.trim();
            const sujet = document.getElementById('sujet').value;
            const message = document.getElementById('message').value.trim();
            
            if (!nom || !telephone || !localite || !sujet || !message) {
                showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
                return;
            }
            
            // Simulation d'envoi
            const formData = { nom, telephone, localite, sujet, message };
            console.log('Formulaire soumis :', formData);
            
            showNotification('Message envoyé avec succès ! Nous vous contacterons rapidement.', 'success');
            contactForm.reset();
        });
    }
    
    // ========== NEWSLETTER ==========
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                showNotification('Inscription à la newsletter réussie !', 'success');
                this.reset();
            }
        });
    }
    
    // ========== NOTIFICATIONS ==========
    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
    
    // ========== SMOOTH SCROLL POUR LIENS INTERNES ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
    
    // ========== ANIMATION DES CARTES DE PRÉVENTION AU CLIC (MOBILE) ==========
    const preventionCards = document.querySelectorAll('.prevention-card');
    preventionCards.forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('flipped');
            }
        });
    });
    
    console.log('🛡️ Protection Civile de Beni - Site Premium Initialisé');
});
