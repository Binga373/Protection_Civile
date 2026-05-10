 /* ===================================================
   PROTECTION CIVILE DE BENI - SCRIPTS PREMIUM
   Version: 2.1 - Responsive Optimisé
   =================================================== */

(function() {
    'use strict';
    
    // ========== CONFIGURATION ==========
    const CONFIG = {
        preloaderDelay: 1500,
        particleCount: 40,
        scrollThreshold: 400,
        counterDuration: 2000,
        notificationDuration: 4000,
        mobileBreakpoint: 991,
    };
    
    // ========== UTILITAIRES ==========
    const Utils = {
        isMobile: () => window.innerWidth <= CONFIG.mobileBreakpoint,
        
        isTouchDevice: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        animateValue: (element, target, duration) => {
            const startTime = performance.now();
            const startValue = 0;
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fonction d'easing ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(update);
        },
    };
    
    // ========== DOM ELEMENTS ==========
    const DOM = {
        preloader: document.getElementById('preloader'),
        hamburger: document.getElementById('hamburger'),
        navMenu: document.getElementById('navMenu'),
        navLinks: document.querySelectorAll('.nav-link'),
        header: document.getElementById('header'),
        scrollTopBtn: document.getElementById('scrollTopBtn'),
        alertButton: document.getElementById('alertButton'),
        emergencyModal: document.getElementById('emergencyModal'),
        modalClose: document.querySelector('.modal-close-btn'),
        modalFormLink: document.querySelector('.modal-form-btn'),
        contactForm: document.getElementById('contactForm'),
        newsletterForm: document.querySelector('.newsletter-form'),
        particlesContainer: document.getElementById('particles'),
        counters: document.querySelectorAll('.counter'),
        heroCounters: document.querySelectorAll('.hero-stat-number'),
        preventionCards: document.querySelectorAll('.prevention-card'),
    };
    
    // ========== PRELOADER ==========
    function initPreloader() {
        if (!DOM.preloader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.preloader.classList.add('hidden');
                
                DOM.preloader.addEventListener('transitionend', () => {
                    DOM.preloader.style.display = 'none';
                }, { once: true });
            }, CONFIG.preloaderDelay);
        });
    }
    
    // ========== PARTICULES HÉRO ==========
    function initParticles() {
        if (!DOM.particlesContainer || Utils.prefersReducedMotion()) return;
        
        const fragment = document.createDocumentFragment();
        const count = Utils.isMobile() ? 20 : CONFIG.particleCount;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 3 + 1.5;
            const left = Math.random() * 100;
            const duration = Math.random() * 8 + 8;
            const delay = Math.random() * 4;
            const opacity = Math.random() * 0.06 + 0.03;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                background: rgba(255,255,255,${opacity});
            `;
            
            fragment.appendChild(particle);
        }
        
        DOM.particlesContainer.appendChild(fragment);
    }
    
    // ========== MENU MOBILE ==========
    function initMobileMenu() {
        if (!DOM.hamburger || !DOM.navMenu) return;
        
        const overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1399;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        function openMenu() {
            DOM.hamburger.classList.add('active');
            DOM.navMenu.classList.add('active');
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        }
        
        function closeMenu() {
            DOM.hamburger.classList.remove('active');
            DOM.navMenu.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
        
        DOM.hamburger.addEventListener('click', () => {
            if (DOM.navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        overlay.addEventListener('click', closeMenu);
        
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (Utils.isMobile()) {
                    closeMenu();
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Fermer le menu lors du redimensionnement
        window.addEventListener('resize', Utils.debounce(() => {
            if (!Utils.isMobile() && DOM.navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 200));
    }
    
    // ========== HEADER SCROLL ==========
    function initHeaderScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            // Style du header
            if (scrollY > 50) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
            
            // Bouton scroll top
            if (DOM.scrollTopBtn) {
                if (scrollY > CONFIG.scrollThreshold) {
                    DOM.scrollTopBtn.classList.add('show');
                } else {
                    DOM.scrollTopBtn.classList.remove('show');
                }
            }
            
            // Navigation active
            updateActiveNavigation(scrollY);
            
            lastScroll = scrollY;
        }, 100));
        
        if (DOM.scrollTopBtn) {
            DOM.scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth',
                });
            });
        }
    }
    
    // ========== NAVIGATION ACTIVE ==========
    function updateActiveNavigation(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // ========== COMPTEURS ANIMÉS ==========
    function initCounters() {
        if (Utils.prefersReducedMotion()) {
            // Afficher directement les valeurs
            document.querySelectorAll('.counter, .hero-stat-number').forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                if (target) el.textContent = target.toLocaleString() + '+';
            });
            return;
        }
        
        // Observer pour les compteurs d'impact
        const impactSection = document.getElementById('impact');
        if (impactSection && DOM.counters.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        DOM.counters.forEach(counter => {
                            const target = parseInt(counter.getAttribute('data-target'));
                            if (target) {
                                Utils.animateValue(counter, target, CONFIG.counterDuration);
                            }
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(impactSection);
        }
        
        // Compteurs du héro
        if (DOM.heroCounters.length) {
            DOM.heroCounters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (target) {
                    counter.textContent = target.toLocaleString() + '+';
                }
            });
        }
    }
    
    // ========== MODAL URGENCE ==========
    function initEmergencyModal() {
        if (!DOM.alertButton || !DOM.emergencyModal) return;
        
        function openModal() {
            DOM.emergencyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const closeBtn = DOM.emergencyModal.querySelector('.modal-close-btn');
            if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
        }
        
        function closeModal() {
            DOM.emergencyModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Refocus
            if (DOM.alertButton) DOM.alertButton.focus();
        }
        
        DOM.alertButton.addEventListener('click', openModal);
        
        if (DOM.modalClose) {
            DOM.modalClose.addEventListener('click', closeModal);
        }
        
        DOM.emergencyModal.addEventListener('click', (e) => {
            if (e.target === DOM.emergencyModal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.emergencyModal.classList.contains('active')) {
                closeModal();
            }
        });
        
        if (DOM.modalFormLink) {
            DOM.modalFormLink.addEventListener('click', () => {
                setTimeout(closeModal, 300);
            });
        }
    }
    
    // ========== FORMULAIRE DE CONTACT ==========
    function initContactForm() {
        if (!DOM.contactForm) return;
        
        DOM.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                nom: document.getElementById('nom')?.value.trim(),
                telephone: document.getElementById('telephone')?.value.trim(),
                localite: document.getElementById('localite')?.value.trim(),
                sujet: document.getElementById('sujet')?.value,
                message: document.getElementById('message')?.value.trim(),
            };
            
            // Validation
            if (!formData.nom || !formData.telephone || !formData.localite || !formData.sujet || !formData.message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Validation téléphone
            const phoneRegex = /^\+?[\d\s-]{8,}$/;
            if (!phoneRegex.test(formData.telephone)) {
                showNotification('Veuillez entrer un numéro de téléphone valide.', 'error');
                return;
            }
            
            // Simulation d'envoi
            console.log('📩 Formulaire soumis :', formData);
            
            // Feedback
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('✅ Message envoyé avec succès ! Nous vous contacterons rapidement.', 'success');
                DOM.contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // ========== NEWSLETTER ==========
    function initNewsletter() {
        if (!DOM.newsletterForm) return;
        
        DOM.newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                showNotification('Veuillez entrer votre email.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showNotification('Veuillez entrer un email valide.', 'error');
                return;
            }
            
            console.log('📧 Newsletter :', emailInput.value.trim());
            showNotification('✅ Inscription réussie ! Merci de votre intérêt.', 'success');
            this.reset();
        });
    }
    
    // ========== NOTIFICATIONS ==========
    function showNotification(message, type = 'success') {
        // Supprimer les notifications existantes
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Déclencher l'animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
        });
        
        // Supprimer après le délai
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            }, { once: true });
        }, CONFIG.notificationDuration);
    }
    
    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const headerOffset = DOM.header ? DOM.header.offsetHeight + 20 : 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth',
                });
            });
        });
    }
    
    // ========== CARTES PRÉVENTION (TACTILE) ==========
    function initPreventionCards() {
        if (!DOM.preventionCards.length) return;
        
        DOM.preventionCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Ne pas déclencher le flip si on clique sur un lien à l'intérieur
                if (e.target.closest('a, button')) return;
                
                if (Utils.isTouchDevice() || Utils.isMobile()) {
                    this.classList.toggle('flipped');
                }
            });
            
            // Réinitialiser le flip au redimensionnement
            card.addEventListener('mouseleave', function() {
                if (Utils.isTouchDevice() && this.classList.contains('flipped')) {
                    // Garder flipped sur mobile jusqu'au prochain clic
                }
            });
        });
    }
    
    // ========== AOS INITIALISATION ==========
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                disable: Utils.prefersReducedMotion() ? true : false,
                disableOnMobile: false,
            });
        }
    }
    
    // ========== RESIZE HANDLER ==========
    function initResizeHandler() {
        window.addEventListener('resize', Utils.debounce(() => {
            // Ajustements dynamiques si nécessaire
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 200));
        
        // Set initial vh
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // ========== INITIALISATION ==========
    function init() {
        initPreloader();
        initParticles();
        initMobileMenu();
        initHeaderScroll();
        initCounters();
        initEmergencyModal();
        initContactForm();
        initNewsletter();
        initSmoothScroll();
        initPreventionCards();
        initAOS();
        initResizeHandler();
        
        // Log
        console.log('%c🛡️ Protection Civile de Beni %c| Site Premium Initialisé',
            'color: #e67e22; font-weight: bold; font-size: 1.1em;',
            'color: #64748b;');
        console.log('%c✓ Preloader %c✓ Particles %c✓ Menu %c✓ Compteurs %c✓ Modal %c✓ Formulaires',
            'color: #27ae60;', 'color: #27ae60;', 'color: #27ae60;',
            'color: #27ae60;', 'color: #27ae60;', 'color: #27ae60;');
    }
    
    // ========== DÉMARRAGE ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
