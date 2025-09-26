// SS EDITING STUDIO - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initNavigation();
    initSmoothScrolling();
    initContactForm();
    initDemoReel();
    initScrollEffects();
    initPortfolioItems();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn[href^="#"]');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Simulate form submission
                submitForm(formObject);
            }
        });
    }
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'message'];
    let isValid = true;
    
    // Clear previous error states
    document.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('error');
    });
    
    // Clear existing error messages
    document.querySelectorAll('.field-error').forEach(error => {
        error.remove();
    });
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            const fieldElement = document.getElementById(field);
            if (fieldElement) {
                fieldElement.classList.add('error');
                showFieldError(fieldElement, 'This field is required');
            }
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.classList.add('error');
            showFieldError(emailField, 'Please enter a valid email address');
        }
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-brand-primary)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

function submitForm(data) {
    const submitButton = document.querySelector('#contactForm .btn--primary');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create mailto link
        const projectType = data['project-type'] ? ` - ${data['project-type']}` : '';
        const subject = encodeURIComponent(`New Project Inquiry${projectType}`);
        const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
${data['project-type'] ? `Project Type: ${data['project-type']}` : ''}

Message:
${data.message}

---
Sent from SS EDITING STUDIO website
        `);
        
        const mailtoLink = `mailto:editswithssedits@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Thank you! Your message has been prepared. Please send the email to complete your inquiry.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Clear any error states
        document.querySelectorAll('.form-control').forEach(field => {
            field.classList.remove('error');
        });
        document.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
        
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-brand-primary)' : 'var(--color-brand-secondary)'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Demo reel functionality
function initDemoReel() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Simulate video player activation
            this.style.background = 'linear-gradient(135deg, rgba(255, 69, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)';
            
            const playIcon = this.querySelector('i');
            if (playIcon) {
                playIcon.className = 'fas fa-pause-circle';
            }
            
            const title = this.querySelector('p');
            if (title) {
                title.textContent = 'Demo Reel Playing...';
            }
            
            const subtitle = this.querySelector('span');
            if (subtitle) {
                subtitle.textContent = 'Click to pause';
            }
            
            // Add pulsing effect
            this.style.animation = 'pulse 2s infinite';
            
            // Show notification
            showNotification('Demo reel would play here. In a real implementation, this would load and play your actual demo reel video.', 'info');
            
            // Reset after 3 seconds for demo purposes
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, rgba(255, 69, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)';
                if (playIcon) {
                    playIcon.className = 'fas fa-play-circle';
                }
                if (title) {
                    title.textContent = 'Professional Demo Reel';
                }
                if (subtitle) {
                    subtitle.textContent = 'Click to view our latest work showcase';
                }
                this.style.animation = 'none';
            }, 3000);
        });
    }
}

// Portfolio items interaction
function initPortfolioItems() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`"${title}" portfolio would be displayed here. In a real implementation, this would show specific project examples and case studies.`, 'info');
        });
    });
}

// Scroll-based effects
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .category-item, .review-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero background
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            const speed = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${speed}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Add CSS for animations and responsive menu
const style = document.createElement('style');
style.textContent = `
    .nav-menu {
        transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            border-top: 1px solid rgba(255, 69, 0, 0.2);
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    .navbar.scrolled {
        background: rgba(5, 5, 5, 0.98);
        backdrop-filter: blur(15px);
        box-shadow: 0 2px 20px rgba(255, 69, 0, 0.1);
    }
    
    .form-control.error {
        border-color: var(--color-brand-primary);
        box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.2);
    }
    
    .service-card,
    .category-item,
    .review-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .service-card.animate-in,
    .category-item.animate-in,
    .review-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .nav-link.active {
        color: var(--color-brand-primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Additional responsive styles for better mobile experience */
    @media (max-width: 480px) {
        .nav-menu {
            padding: 1.5rem 1rem;
        }
        
        .nav-link {
            padding: 0.5rem 0;
            font-size: var(--font-size-lg);
        }
        
        .hero-content {
            padding-left: var(--space-16);
            padding-right: var(--space-16);
        }
        
        .reviews-grid {
            gap: var(--space-24);
        }
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Focus styles for accessibility */
    .btn:focus-visible,
    .nav-link:focus-visible,
    .form-control:focus-visible {
        outline: 2px solid var(--color-brand-primary);
        outline-offset: 2px;
    }
    
    /* Loading state for buttons */
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: var(--color-text-secondary);
    }
    
    /* Hover effects for interactive elements */
    .category-item {
        cursor: pointer;
    }
    
    .video-placeholder {
        cursor: pointer;
    }
    
    .video-placeholder:focus-visible {
        outline: 2px solid var(--color-brand-primary);
        outline-offset: 4px;
    }
`;

document.head.appendChild(style);

// Preloader handling
window.addEventListener('load', function() {
    // Hide preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 300);
    }
    
    // Initialize final animations
    document.body.classList.add('loaded');
    
    // Set initial animation delays for staggered entrance
    const animateElements = document.querySelectorAll('.service-card, .category-item, .review-card');
    animateElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    }
});

// Touch gestures for mobile menu
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Detect horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && hamburger) {
            // Swipe left to close menu
            if (deltaX < -50 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }
}, { passive: true });