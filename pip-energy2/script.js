// Pip Energy - Premium Landing Page Interactions
// Tesla-level UX with smooth animations and intelligent behavior

(function() {
    'use strict';

    // ==========================================================================
    // Smooth Scroll Animation Observer
    // ==========================================================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        animateOnScroll.observe(el);
    });

    // ==========================================================================
    // Counter Animation for Stats
    // ==========================================================================

    function animateCounter(element, target, duration = 2000, decimals = 0) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = decimals > 0
                ? current.toFixed(decimals)
                : Math.floor(current).toLocaleString();
        }, 16);
    }

    // Counter observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.getAttribute('data-target'));
                const decimals = element.classList.contains('stat-number') ? 1 : 0;

                animateCounter(element, target, 2000, decimals);
                counterObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe stat numbers and counters
    document.querySelectorAll('.stat-number, .counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ==========================================================================
    // Navbar Scroll Behavior
    // ==========================================================================

    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Don't prevent default for # only links
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Mobile Navigation Toggle
    // ==========================================================================

    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================================================
    // Parallax Effect for Hero Background
    // ==========================================================================

    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        let parallaxTicking = false;

        function updateParallax() {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;

            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }

            parallaxTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(updateParallax);
                parallaxTicking = true;
            }
        });
    }

    // ==========================================================================
    // Interactive Card Tilt Effect
    // ==========================================================================

    const cards = document.querySelectorAll('.solution-card, .impact-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });

    function handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    function resetCardTilt(e) {
        const card = e.currentTarget;
        card.style.transform = '';
    }

    // ==========================================================================
    // Tech Circle Animation
    // ==========================================================================

    const techCircle = document.querySelector('.tech-circle');

    if (techCircle) {
        let rotation = 0;

        function rotateTechCircle() {
            rotation += 0.2;
            techCircle.style.transform = `rotate(${rotation}deg)`;
            requestAnimationFrame(rotateTechCircle);
        }

        // Start rotation when in view
        const techObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    rotateTechCircle();
                    techObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        techObserver.observe(techCircle);
    }

    // ==========================================================================
    // Button Ripple Effect
    // ==========================================================================

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles dynamically
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);

    // ==========================================================================
    // Preload Critical Images
    // ==========================================================================

    function preloadImages() {
        const images = ['logo.jpg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    // ==========================================================================
    // Performance Optimization - Lazy Load Images
    // ==========================================================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================================================
    // Accessibility - Keyboard Navigation
    // ==========================================================================

    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    // ==========================================================================
    // Form Validation (if contact form exists)
    // ==========================================================================

    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const formData = new FormData(contactForm);
            let isValid = true;

            formData.forEach((value, key) => {
                if (!value.trim()) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Handle form submission
                console.log('Form is valid, ready to submit');
                // Add your form submission logic here
            } else {
                console.log('Please fill in all fields');
            }
        });
    }

    // ==========================================================================
    // Track CTA Interactions
    // ==========================================================================

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();

            // Log interaction (can be replaced with analytics)
            console.log('CTA clicked:', buttonText);

            // You can add analytics tracking here
            // Example: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': buttonText });
        });
    });

    // ==========================================================================
    // Loading Animation Complete
    // ==========================================================================

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ==========================================================================
    // Intersection Observer for Process Timeline
    // ==========================================================================

    const processSteps = document.querySelectorAll('.process-step');

    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 100}ms`;
    });

    // ==========================================================================
    // Mobile-Specific Optimizations
    // ==========================================================================

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;

    if (isMobile) {
        // Disable 3D tilt on mobile for performance
        cards.forEach(card => {
            card.removeEventListener('mousemove', handleCardTilt);
            card.removeEventListener('mouseleave', resetCardTilt);
        });

        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';

        // Add touch feedback for buttons
        document.querySelectorAll('.btn, .solution-card, .impact-card').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.9';
            });
            element.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }

    // ==========================================================================
    // Cursor Enhancement for Premium Feel (Desktop Only)
    // ==========================================================================

    if (window.innerWidth > 968 && !isMobile) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'custom-cursor-follower';
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

            requestAnimationFrame(animateFollower);
        }

        animateFollower();

        // Add cursor styles
        const cursorStyles = document.createElement('style');
        cursorStyles.textContent = `
            .custom-cursor,
            .custom-cursor-follower {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
            }

            .custom-cursor {
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                margin-left: -4px;
                margin-top: -4px;
            }

            .custom-cursor-follower {
                width: 32px;
                height: 32px;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                margin-left: -16px;
                margin-top: -16px;
            }

            .btn:hover ~ .custom-cursor-follower,
            a:hover ~ .custom-cursor-follower {
                transform: scale(1.5);
            }
        `;
        document.head.appendChild(cursorStyles);
    }

    // ==========================================================================
    // Console Message
    // ==========================================================================

    console.log('%c⚡ Pip Energy - Engineering Tomorrow\'s Sustainable Future',
        'font-size: 16px; font-weight: bold; color: #3E8E6A;');
    console.log('%cBuilt with precision, powered by innovation',
        'font-size: 12px; color: #1B3A57;');

})();