// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Language system
let currentLanguage = localStorage.getItem('dve-language') || 'nl';

// Language functions
function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('dve-language', lang);
    
    // Update all elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update meta title and description
    const title = document.querySelector('title[data-i18n]');
    if (title && translations[lang]) {
        const titleKey = title.getAttribute('data-i18n');
        if (translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        }
    }
    
    const metaDesc = document.querySelector('meta[data-i18n-content]');
    if (metaDesc && translations[lang]) {
        const descKey = metaDesc.getAttribute('data-i18n-content');
        if (translations[lang][descKey]) {
            metaDesc.setAttribute('content', translations[lang][descKey]);
        }
    }
    
    // Update html lang attribute
    document.documentElement.setAttribute('lang', translations[lang].lang_code || lang);
    
    // Update active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    console.log(`Language switched to: ${lang}`);
}

function initializeLanguage() {
    // Set initial language
    updateLanguage(currentLanguage);
    
    // Add event listeners to language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            if (lang && lang !== currentLanguage) {
                updateLanguage(lang);
            }
        });
    });
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language system first
    initializeLanguage();
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.querySelector('#over-ons');
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initialize map
    initializeMap();

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Intersection Observer for animations
    const observeElements = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    observeElements.forEach(el => observer.observe(el));

    // Add hover effects to cards
    addCardHoverEffects();
});

// Map functionality
function initializeMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    const mapElement = document.getElementById('drenthe-kaart');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    try {
        // Initialize map centered on Drenthe
        const map = L.map('drenthe-kaart', {
            scrollWheelZoom: false,
            doubleClickZoom: true,
            touchZoom: true,
            dragging: true,
            zoomControl: true
        }).setView([52.9, 6.6], 9);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Define praktijk data
        const praktijken = [
            {
                naam: 'Ergotherapie in Drenthe',
                logo: 'assets/images/ergotherapie-in-drenthe-logo.png',
                website: 'https://www.ergotherapiedrenthe.nl/',
                regio: 'Zweeloo en omstreken',
                specialisatie: 'Volwassenen en kinderen',
                lat: 52.7952563,
                lng: 6.7282738
            },
            {
                naam: 'Ergotherapie Roorda',
                logo: 'assets/images/roorda-logo.png',
                website: 'https://ergotherapieroorda.nl/',
                regio: 'Hoogeveen',
                specialisatie: 'Kinderen',
                lat: 52.7158451,
                lng: 6.4986021
            },
            {
                naam: 'Fytac',
                logo: 'assets/images/fytac-logo.png',
                website: 'https://fytac.nl',
                regio: 'Meppel',
                specialisatie: 'Volwassenen',
                lat: 52.6941668,
                lng: 6.189204
            }
        ];

        // Custom marker icon
        const createCustomIcon = () => {
            return L.divIcon({
                className: 'custom-marker',
                html: '<div class="marker-pin"><i class="fas fa-user-md"></i></div>',
                iconSize: [30, 40],
                iconAnchor: [15, 40],
                popupAnchor: [0, -40]
            });
        };

        // Add markers to map
        praktijken.forEach(praktijk => {
            const marker = L.marker([praktijk.lat, praktijk.lng], {
                icon: createCustomIcon()
            }).addTo(map);

            // Create popup content
            const popupContent = `
                <div class="popup-content">
                    <div class="popup-header">
                        <img src="${praktijk.logo}" alt="${praktijk.naam}" class="popup-logo" onerror="this.style.display='none'">
                        <div class="popup-info">
                            <h4>${praktijk.naam}</h4>
                            <p class="popup-location">${praktijk.regio}</p>
                        </div>
                    </div>
                    <div class="popup-specialisatie">${praktijk.specialisatie}</div>
                    <div style="margin-top: 10px;">
                        <a href="${praktijk.website}" target="_blank" class="btn btn-small btn-primary" style="text-decoration: none;">
                            <i class="fas fa-external-link-alt"></i> Website bezoeken
                        </a>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
        });

        // Show on map functionality
        const showOnMapButtons = document.querySelectorAll('.show-on-map');
        showOnMapButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lat = parseFloat(e.target.dataset.lat);
                const lng = parseFloat(e.target.dataset.lng);
                
                if (lat && lng) {
                    // Scroll to map
                    mapElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Fly to location on map
                    setTimeout(() => {
                        map.flyTo([lat, lng], 12, {
                            animate: true,
                            duration: 1.5
                        });
                    }, 500);
                }
            });
        });

        // Store map reference globally for debugging
        window.drentskaart = map;

    } catch (error) {
        console.error('Error initializing map:', error);
        mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f8f9fa; color: #666;">Kaart kon niet worden geladen</div>';
    }
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simple validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        const message = translations[currentLanguage]?.form_fill_all || 'Vul alle velden in.';
        showNotification(message, 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        const message = translations[currentLanguage]?.form_valid_email || 'Voer een geldig e-mailadres in.';
        showNotification(message, 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    const sendingText = translations[currentLanguage]?.form_sending || 'Versturen...';
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${sendingText}`;
    submitButton.disabled = true;
    
    setTimeout(() => {
        const successMessage = translations[currentLanguage]?.form_success || 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.';
        showNotification(successMessage, 'success');
        e.target.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add card hover effects
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.praktijk-card, .feature, .contact-card, .mv-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${rate}px)`;
    }
});

// Add CSS animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(style);

// Debug functions
window.debugMap = function() {
    console.log('Map instance:', window.drentskaart);
    console.log('Map container:', document.getElementById('drenthe-kaart'));
    console.log('Leaflet loaded:', typeof L !== 'undefined');
};

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DVE website loaded successfully');
    });
} else {
    console.log('DVE website loaded successfully');
}