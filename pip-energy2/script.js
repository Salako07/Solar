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
    // Load Calculator Functionality
    // ==========================================================================

    const calculatorState = {
        appliances: [],
        dailyConsumption: 0,
        peakLoad: 0
    };

    // Preset configurations
    const presets = {
        small: [
            { name: 'LED Bulbs (10W)', watts: 10, hours: 5, quantity: 10 },
            { name: 'Ceiling Fan', watts: 75, hours: 8, quantity: 3 },
            { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
            { name: 'TV (LED)', watts: 80, hours: 6, quantity: 1 },
            { name: 'Laptop', watts: 65, hours: 6, quantity: 1 },
            { name: 'Phone Charger', watts: 10, hours: 3, quantity: 2 }
        ],
        medium: [
            { name: 'LED Bulbs (10W)', watts: 10, hours: 6, quantity: 15 },
            { name: 'Ceiling Fan', watts: 75, hours: 10, quantity: 5 },
            { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
            { name: 'Air Conditioner (1.5HP)', watts: 1200, hours: 8, quantity: 2 },
            { name: 'TV (LED)', watts: 80, hours: 8, quantity: 2 },
            { name: 'Laptop', watts: 65, hours: 8, quantity: 2 },
            { name: 'Washing Machine', watts: 500, hours: 1, quantity: 1 },
            { name: 'Microwave', watts: 1000, hours: 0.5, quantity: 1 },
            { name: 'Water Pump', watts: 750, hours: 2, quantity: 1 }
        ],
        large: [
            { name: 'LED Bulbs (10W)', watts: 10, hours: 8, quantity: 25 },
            { name: 'Ceiling Fan', watts: 75, hours: 12, quantity: 8 },
            { name: 'Refrigerator', watts: 150, hours: 24, quantity: 2 },
            { name: 'Deep Freezer', watts: 200, hours: 24, quantity: 1 },
            { name: 'Air Conditioner (1.5HP)', watts: 1200, hours: 10, quantity: 4 },
            { name: 'TV (LED)', watts: 80, hours: 10, quantity: 3 },
            { name: 'Laptop', watts: 65, hours: 10, quantity: 3 },
            { name: 'Desktop Computer', watts: 200, hours: 8, quantity: 1 },
            { name: 'Washing Machine', watts: 500, hours: 1.5, quantity: 1 },
            { name: 'Microwave', watts: 1000, hours: 1, quantity: 1 },
            { name: 'Electric Oven', watts: 2000, hours: 1, quantity: 1 },
            { name: 'Water Heater', watts: 1500, hours: 2, quantity: 1 },
            { name: 'Water Pump', watts: 750, hours: 3, quantity: 1 }
        ],
        office: [
            { name: 'LED Bulbs (15W)', watts: 15, hours: 10, quantity: 20 },
            { name: 'Ceiling Fan', watts: 75, hours: 10, quantity: 6 },
            { name: 'Air Conditioner (2HP)', watts: 1500, hours: 10, quantity: 3 },
            { name: 'Desktop Computer', watts: 200, hours: 10, quantity: 10 },
            { name: 'Laptop', watts: 65, hours: 10, quantity: 5 },
            { name: 'Printer/Copier', watts: 300, hours: 4, quantity: 2 },
            { name: 'Water Dispenser', watts: 500, hours: 8, quantity: 2 },
            { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
            { name: 'Microwave', watts: 1000, hours: 1, quantity: 1 }
        ]
    };

    // DOM elements
    const addApplianceBtn = document.getElementById('addAppliance');
    const appliancesList = document.getElementById('appliancesList');
    const resetCalculatorBtn = document.getElementById('resetCalculator');
    const presetButtons = document.querySelectorAll('.btn-preset');

    // Form inputs
    const nameInput = document.getElementById('applianceName');
    const wattsInput = document.getElementById('applianceWatts');
    const hoursInput = document.getElementById('applianceHours');
    const quantityInput = document.getElementById('applianceQuantity');

    // Result elements
    const dailyConsumptionEl = document.getElementById('dailyConsumption');
    const monthlyConsumptionEl = document.getElementById('monthlyConsumption');
    const peakLoadEl = document.getElementById('peakLoad');
    const systemSizeEl = document.getElementById('systemSize');
    const panelCountEl = document.getElementById('panelCount');
    const batteryCapacityEl = document.getElementById('batteryCapacity');
    const annualSavingsEl = document.getElementById('annualSavings');

    // Add appliance function
    function addAppliance(name, watts, hours, quantity = 1) {
        if (!name || !watts || !hours) {
            alert('Please fill in all fields');
            return;
        }

        const appliance = {
            id: Date.now(),
            name: name,
            watts: parseFloat(watts),
            hours: parseFloat(hours),
            quantity: parseInt(quantity)
        };

        calculatorState.appliances.push(appliance);
        renderAppliances();
        calculateResults();
        clearInputs();
    }

    // Render appliances list
    function renderAppliances() {
        if (calculatorState.appliances.length === 0) {
            appliancesList.innerHTML = '<p style="text-align: center; opacity: 0.5; padding: 2rem;">No appliances added yet. Add your first appliance above or use a preset.</p>';
            return;
        }

        appliancesList.innerHTML = calculatorState.appliances.map(appliance => {
            const dailyEnergy = (appliance.watts * appliance.hours * appliance.quantity / 1000).toFixed(2);
            return `
                <div class="appliance-item">
                    <div class="appliance-info">
                        <div class="appliance-name">${appliance.name}</div>
                        <div class="appliance-details">
                            ${appliance.watts}W × ${appliance.hours}h × ${appliance.quantity} unit${appliance.quantity > 1 ? 's' : ''}
                        </div>
                    </div>
                    <div class="appliance-consumption">${dailyEnergy} kWh/day</div>
                    <button class="btn-remove-appliance" onclick="removeAppliance(${appliance.id})">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Remove appliance function (needs to be global)
    window.removeAppliance = function(id) {
        calculatorState.appliances = calculatorState.appliances.filter(a => a.id !== id);
        renderAppliances();
        calculateResults();
    };

    // Calculate results
    function calculateResults() {
        // Calculate daily consumption
        let totalDailyConsumption = 0;
        let totalPeakLoad = 0;

        calculatorState.appliances.forEach(appliance => {
            const dailyEnergy = appliance.watts * appliance.hours * appliance.quantity / 1000;
            totalDailyConsumption += dailyEnergy;
            totalPeakLoad += appliance.watts * appliance.quantity;
        });

        calculatorState.dailyConsumption = totalDailyConsumption;
        calculatorState.peakLoad = totalPeakLoad;

        // Update display
        dailyConsumptionEl.textContent = totalDailyConsumption.toFixed(2) + ' kWh';
        monthlyConsumptionEl.textContent = (totalDailyConsumption * 30).toFixed(2) + ' kWh';
        peakLoadEl.textContent = totalPeakLoad.toLocaleString() + ' W';

        // Calculate system size (with 20% safety margin, 5 peak sun hours)
        const peakSunHours = 5;
        const safetyMargin = 1.2;
        const systemSize = (totalDailyConsumption / peakSunHours) * safetyMargin;
        systemSizeEl.textContent = systemSize.toFixed(2) + ' kW';

        // Calculate number of panels (assuming 400W panels)
        const panelWattage = 400;
        const panelCount = Math.ceil((systemSize * 1000) / panelWattage);
        panelCountEl.textContent = panelCount + ' panels';

        // Calculate battery capacity (1 day backup)
        const batteryCapacity = totalDailyConsumption * 1.2; // 20% extra for efficiency loss
        batteryCapacityEl.textContent = batteryCapacity.toFixed(2) + ' kWh';

        // Calculate annual savings (assuming ₦205.50 per kWh)
        const gridRate = 205.50;
        const annualSavings = totalDailyConsumption * 365 * gridRate;
        annualSavingsEl.textContent = '₦' + annualSavings.toLocaleString('en-NG', { maximumFractionDigits: 0 });
    }

    // Clear input fields
    function clearInputs() {
        nameInput.value = '';
        wattsInput.value = '';
        hoursInput.value = '';
        quantityInput.value = '1';
    }

    // Reset calculator
    function resetCalculator() {
        if (calculatorState.appliances.length === 0) return;

        if (confirm('Are you sure you want to reset the calculator? All appliances will be removed.')) {
            calculatorState.appliances = [];
            renderAppliances();
            calculateResults();

            // Remove active state from presets
            presetButtons.forEach(btn => btn.classList.remove('active'));
        }
    }

    // Load preset
    function loadPreset(presetName) {
        calculatorState.appliances = [];

        const presetData = presets[presetName];
        presetData.forEach(appliance => {
            calculatorState.appliances.push({
                id: Date.now() + Math.random(),
                name: appliance.name,
                watts: appliance.watts,
                hours: appliance.hours,
                quantity: appliance.quantity
            });
        });

        renderAppliances();
        calculateResults();

        // Update active state
        presetButtons.forEach(btn => {
            if (btn.dataset.preset === presetName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Event listeners
    if (addApplianceBtn) {
        addApplianceBtn.addEventListener('click', () => {
            addAppliance(
                nameInput.value.trim(),
                wattsInput.value,
                hoursInput.value,
                quantityInput.value || 1
            );
        });

        // Add on Enter key
        [nameInput, wattsInput, hoursInput, quantityInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        addAppliance(
                            nameInput.value.trim(),
                            wattsInput.value,
                            hoursInput.value,
                            quantityInput.value || 1
                        );
                    }
                });
            }
        });
    }

    if (resetCalculatorBtn) {
        resetCalculatorBtn.addEventListener('click', resetCalculator);
    }

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loadPreset(btn.dataset.preset);
        });
    });

    // Initialize calculator display
    if (appliancesList) {
        renderAppliances();
        calculateResults();
    }

    // ==========================================================================
    // Project Gallery Functionality
    // ==========================================================================

    class ProjectGallery {
        constructor(galleryElement) {
            this.gallery = galleryElement;
            this.track = galleryElement.querySelector('.gallery-track');
            this.images = galleryElement.querySelectorAll('.project-image');
            this.prevBtn = galleryElement.querySelector('.gallery-prev');
            this.nextBtn = galleryElement.querySelector('.gallery-next');
            this.indicators = galleryElement.querySelectorAll('.indicator');
            this.currentIndex = 0;
            this.totalImages = this.images.length;

            this.init();
        }

        init() {
            // Navigation button events
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.prev();
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.next();
                });
            }

            // Indicator click events
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToSlide(index);
                });
            });

            // Keyboard navigation
            this.gallery.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });

            // Touch/Swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            this.track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }

        handleSwipe(startX, endX) {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next(); // Swipe left
                } else {
                    this.prev(); // Swipe right
                }
            }
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.totalImages;
            this.updateGallery();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
            this.updateGallery();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateGallery();
        }

        updateGallery() {
            // Move the track
            const offset = -this.currentIndex * 100;
            this.track.style.transform = `translateX(${offset}%)`;

            // Update indicators
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    // Initialize all project galleries
    const projectGalleries = document.querySelectorAll('.project-gallery');
    projectGalleries.forEach(gallery => {
        new ProjectGallery(gallery);
    });

    // ==========================================================================
    // Console Message
    // ==========================================================================

    console.log('%c⚡ Pip Energy - Engineering Tomorrow\'s Sustainable Future',
        'font-size: 16px; font-weight: bold; color: #3E8E6A;');
    console.log('%cBuilt with precision, powered by innovation',
        'font-size: 12px; color: #1B3A57;');

})();