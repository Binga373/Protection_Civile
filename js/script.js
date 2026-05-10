/* ===================================================
   PROTECTION CIVILE DE BENI - SCRIPTS
   Auteur: Protection Civile de Beni
   Version: 1.0
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ÉLÉMENTS DOM ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTop');
    const header = document.getElementById('header');
    const alertButton = document.getElementById('alertButton');
    const emergencyModal = document.getElementById('emergencyModal');
    const modalClose = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    const statsNumbers = document.querySelectorAll('.stats-number');
    
    // ========== MENU MOBILE ==========
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change l'icône du hamburger
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            
            // Mise à jour du lien actif
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // ========== SCROLL TOP BUTTON ==========
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
        
        // Changement de style du header au scroll
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========== MODAL URGENCE ==========
    alertButton.addEventListener('click', function() {
        emergencyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeModal() {
        emergencyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    emergencyModal.addEventListener('click', function(e) {
        if (e.target === emergencyModal) {
            closeModal();
        }
    });
    
    // Fermer la modal avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emergencyModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ========== FORMULAIRE DE CONTACT ==========
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des valeurs
        const nom = document.getElementById('nom').value;
        const telephone = document.getElementById('telephone').value;
        const localite = document.getElementById('localite').value;
        const sujet = document.getElementById('sujet').value;
        const message = document.getElementById('message').value;
        
        // Validation simple
        if (!nom || !telephone || !localite || !sujet || !message) {
            showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
            return;
        }
        
        // Simulation d'envoi (à remplacer par une vraie API)
        console.log('Formulaire soumis:', {
            nom,
            telephone,
            localite,
            sujet,
            message
        });
        
        // Message de succès
        showNotification('Votre message a été envoyé avec succès ! Nous vous contacterons dans les plus brefs délais.', 'success');
        
        // Reset du formulaire
        contactForm.reset();
    });
    
    // ========== COMPTEUR ANIMÉ ==========
    function animateStats() {
        statsNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 secondes
            const step = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target.toLocaleString() + '+';
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + '+';
                }
            }, 16);
        });
    }
    
    // Intersection Observer pour déclencher l'animation
    const statsSection = document.getElementById('statistiques');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // ========== NOTIFICATIONS ==========
    function showNotification(message, type = 'success') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Afficher avec animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Supprimer après 4 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // ========== NAVIGATION ACTIVE AU SCROLL ==========
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    console.log('Protection Civile de Beni - Site web initialisé avec succès.');
});
