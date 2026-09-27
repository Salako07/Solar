// ==========================================================================
// Pip Energy — site interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ======================================================================
    // Navigation
    // ======================================================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    const updateNavbar = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const setMenuOpen = (open) => {
        navLinks.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    navToggle.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('is-open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
    });

    // ======================================================================
    // Solutions — pills swap in the details for each solution type
    // ======================================================================

    const solutions = {
        residential: 'Reliable home solar systems designed to reduce your electricity costs and provide backup power during outages. Custom system sizing, quality components and professional installation.',
        commercial: 'Business solar systems designed to reduce operational costs and ensure reliable power for your operations. Load assessment, energy cost reduction and scalable solutions.',
        critical: 'Specialized solar solutions for hospitals, facilities, and organizations requiring dependable power systems. High-capacity systems with reliable backup and ongoing support.'
    };
    const solutionDefault = document.getElementById('solutionDesc').textContent;
    const solutionDesc = document.getElementById('solutionDesc');
    const solutionPills = document.querySelectorAll('.glass-pill');

    const showSolution = (key) => {
        solutionPills.forEach(pill => {
            const active = pill.dataset.solution === key;
            pill.classList.toggle('is-active', active);
            pill.setAttribute('aria-pressed', String(active));
        });
        solutionDesc.textContent = solutions[key] || solutionDefault;
    };

    solutionPills.forEach(pill => {
        pill.setAttribute('aria-pressed', 'false');
        pill.addEventListener('click', () => {
            const isActive = pill.classList.contains('is-active');
            showSolution(isActive ? null : pill.dataset.solution);
        });
    });

    document.querySelectorAll('[data-solution-link]').forEach(link => {
        link.addEventListener('click', () => showSolution(link.dataset.solutionLink));
    });

    // ======================================================================
    // Metrics — count up when visible
    // ======================================================================

    const animateCount = (el) => {
        const target = Number(el.dataset.count);
        if (prefersReducedMotion) {
            el.textContent = target;
            return;
        }
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // ======================================================================
    // Projects carousel
    // ======================================================================

    const projects = [
        {
            title: 'Gas Station Solar Installation',
            location: 'Ikeja, Lagos',
            image: 'assets/project-ikeja-gas-1.jpeg',
            alt: 'Gas station solar installation in Ikeja, Lagos',
            size: 30, inverter: 30, storage: 60,
            description: 'Commercial rooftop installation providing reliable power for continuous gas station operations, reducing dependency on generators and grid.'
        },
        {
            title: 'Co-working Hub Solar Installation',
            location: 'Lagos, Nigeria',
            image: 'assets/s21.jpeg',
            alt: 'Co-working hub solar installation in Lagos',
            size: 70, inverter: 60, storage: 150,
            description: 'Large-scale commercial installation powering a modern co-working hub with reliable, uninterrupted energy. Advanced battery storage ensures 24/7 operations.'
        },
        {
            title: 'Premium Residential Solar System',
            location: 'Lagos, Nigeria',
            image: 'assets/s31.png',
            alt: 'Residential solar installation in Lagos',
            size: 20.6, inverter: 20, storage: 60,
            description: 'High-performance residential installation delivering complete energy independence, with seamless power backup and grid-tie capabilities.'
        },
        {
            title: 'Hospital Solar Installation',
            location: 'Abia State, Nigeria',
            image: 'assets/s41.jpeg',
            alt: 'Hospital solar installation in Abia State',
            size: 15.3, inverter: 16, storage: 30,
            description: 'Critical healthcare infrastructure powered by reliable solar energy, ensuring uninterrupted power for life-saving medical equipment.'
        }
    ];

    // Gauge fill is relative to the largest project in the portfolio
    const gaugeMax = {
        size: Math.max(...projects.map(p => p.size)),
        inverter: Math.max(...projects.map(p => p.inverter)),
        storage: Math.max(...projects.map(p => p.storage))
    };

    const projectImage = document.getElementById('projectImage');
    const projectTitle = document.getElementById('projectTitle');
    const projectLocation = document.getElementById('projectLocation');
    const projectDesc = document.getElementById('projectDesc');
    const gauges = document.querySelectorAll('.gauge');
    let projectIndex = 0;
    let gaugesVisible = false;

    // Preload project images so switching is instant
    projects.forEach(p => { const img = new Image(); img.src = p.image; });

    const updateGauges = () => {
        const project = projects[projectIndex];
        gauges.forEach(gauge => {
            const key = gauge.dataset.gauge;
            gauge.querySelector('strong').textContent = project[key];
            gauge.style.setProperty('--p', gaugesVisible ? (project[key] / gaugeMax[key]).toFixed(3) : 0);
        });
    };

    const showProject = (index) => {
        projectIndex = (index + projects.length) % projects.length;
        const project = projects[projectIndex];
        projectImage.classList.add('is-fading');
        window.setTimeout(() => {
            projectImage.src = project.image;
            projectImage.alt = project.alt;
            projectImage.classList.remove('is-fading');
        }, prefersReducedMotion ? 0 : 250);
        projectTitle.textContent = project.title;
        projectLocation.textContent = project.location;
        projectDesc.textContent = project.description;
        updateGauges();
    };

    document.getElementById('projectPrev').addEventListener('click', () => showProject(projectIndex - 1));
    document.getElementById('projectNext').addEventListener('click', () => showProject(projectIndex + 1));
    updateGauges();

    // ======================================================================
    // Process stepper
    // ======================================================================

    const steps = [
        {
            title: 'Site Visit & Assessment',
            description: 'We visit your location to assess your energy needs, roof condition, and available space for solar panels.',
            image: 'assets/design/process-home.webp',
            alt: 'A modern home at sunset'
        },
        {
            title: 'Custom System Design',
            description: 'We design a solar system tailored to your power consumption and budget, with transparent pricing.',
            image: 'assets/design/metrics-farm.webp',
            alt: 'Aerial view of rows of solar panels'
        },
        {
            title: 'Professional Installation',
            description: 'Our experienced team installs your system with attention to quality and safety standards.',
            image: 'assets/project-ikeja-gas-2.jpeg',
            alt: 'Solar panels installed on a commercial rooftop'
        },
        {
            title: 'Pip Shield Aftercare',
            description: 'Pip Shield covers your system with insurance and operations & maintenance plans, so there are no unexpected costs after installation.',
            image: 'assets/s24.jpeg',
            alt: 'Completed solar installation'
        }
    ];

    const stepDots = document.querySelectorAll('.step-dot');
    const stepImage = document.getElementById('stepImage');
    const stepNum = document.getElementById('stepNum');
    const stepTitle = document.getElementById('stepTitle');
    const stepDesc = document.getElementById('stepDesc');
    const processPanel = document.querySelector('.process-panel');
    let stepIndex = 0;
    let stepTimer = null;

    steps.forEach(s => { const img = new Image(); img.src = s.image; });

    const showStep = (index) => {
        stepIndex = (index + steps.length) % steps.length;
        const step = steps[stepIndex];
        stepDots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === stepIndex);
            dot.setAttribute('aria-selected', String(i === stepIndex));
        });
        processPanel.classList.add('is-fading');
        stepImage.classList.add('is-fading');
        window.setTimeout(() => {
            stepNum.textContent = String(stepIndex + 1).padStart(2, '0');
            stepTitle.textContent = step.title;
            stepDesc.textContent = step.description;
            stepImage.src = step.image;
            stepImage.alt = step.alt;
            processPanel.classList.remove('is-fading');
            stepImage.classList.remove('is-fading');
        }, prefersReducedMotion ? 0 : 250);
    };

    const startStepTimer = () => {
        if (prefersReducedMotion) return;
        window.clearInterval(stepTimer);
        stepTimer = window.setInterval(() => showStep(stepIndex + 1), 6000);
    };

    stepDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showStep(Number(dot.dataset.step));
            startStepTimer();
        });
    });

    // "Pip Shield" links (nav and footer) open the aftercare step
    document.querySelectorAll('a[href="#pip-shield"]').forEach(link => {
        link.addEventListener('click', () => {
            showStep(3);
            startStepTimer();
        });
    });

    // ======================================================================
    // Solar calculator
    // ======================================================================

    const applianceCatalog = [
        { name: 'LED Bulb', watts: 10 },
        { name: 'Ceiling Fan', watts: 75 },
        { name: 'Standing Fan', watts: 55 },
        { name: 'Refrigerator', watts: 150 },
        { name: 'Deep Freezer', watts: 200 },
        { name: 'TV (LED)', watts: 80 },
        { name: 'Laptop', watts: 65 },
        { name: 'Desktop Computer', watts: 200 },
        { name: 'Phone Charger', watts: 10 },
        { name: 'Wi-Fi Router', watts: 15 },
        { name: 'Air Conditioner (1HP)', watts: 900 },
        { name: 'Air Conditioner (1.5HP)', watts: 1200 },
        { name: 'Air Conditioner (2HP)', watts: 1500 },
        { name: 'Washing Machine', watts: 500 },
        { name: 'Microwave', watts: 1000 },
        { name: 'Electric Oven', watts: 2000 },
        { name: 'Electric Iron', watts: 1000 },
        { name: 'Water Heater', watts: 1500 },
        { name: 'Water Pump', watts: 750 },
        { name: 'Water Dispenser', watts: 500 },
        { name: 'Printer/Copier', watts: 300 }
    ];

    const presets = {
        small: [
            { name: 'LED Bulb', watts: 10, hours: 5, quantity: 10 },
            { name: 'Ceiling Fan', watts: 75, hours: 8, quantity: 3 },
            { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
            { name: 'TV (LED)', watts: 80, hours: 6, quantity: 1 },
            { name: 'Laptop', watts: 65, hours: 6, quantity: 1 },
            { name: 'Phone Charger', watts: 10, hours: 3, quantity: 2 }
        ],
        large: [
            { name: 'LED Bulb', watts: 10, hours: 8, quantity: 25 },
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
        factory: [
            { name: 'LED High-Bay Light', watts: 100, hours: 12, quantity: 20 },
            { name: 'Industrial Fan', watts: 250, hours: 10, quantity: 6 },
            { name: 'Electric Motor (5HP)', watts: 3730, hours: 6, quantity: 2 },
            { name: 'Air Compressor', watts: 2200, hours: 4, quantity: 1 },
            { name: 'Air Conditioner (2HP)', watts: 1500, hours: 8, quantity: 2 },
            { name: 'Desktop Computer', watts: 200, hours: 8, quantity: 4 },
            { name: 'Water Pump', watts: 750, hours: 3, quantity: 1 }
        ],
        office: [
            { name: 'LED Bulb', watts: 15, hours: 10, quantity: 20 },
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

    const PEAK_SUN_HOURS = 5;
    const SAFETY_MARGIN = 1.2;
    const PANEL_WATTS = 400;
    const BATTERY_FACTOR = 1.2; // 20% extra for efficiency loss
    const GRID_RATE = 205.5; // ₦ per kWh
    const CUSTOM = '__custom';

    const form = document.getElementById('applianceForm');
    const applianceSelect = document.getElementById('applianceSelect');
    const wattsInput = document.getElementById('applianceWatts');
    const hoursSelect = document.getElementById('applianceHours');
    const quantitySelect = document.getElementById('applianceQuantity');
    const customNameField = document.getElementById('customNameField');
    const nameInput = document.getElementById('applianceName');
    const formError = document.getElementById('formError');
    const applianceList = document.getElementById('applianceList');
    const presetButtons = document.querySelectorAll('.preset');

    const results = {
        dailyLoad: document.getElementById('dailyLoad'),
        panelCount: document.getElementById('panelCount'),
        batteryCapacity: document.getElementById('batteryCapacity'),
        systemSize: document.getElementById('systemSize'),
        annualSavings: document.getElementById('annualSavings')
    };

    let appliances = [];
    let nextId = 1;

    // Populate selects
    applianceCatalog.forEach(item => {
        applianceSelect.add(new Option(`${item.name} (${item.watts}W)`, item.name));
    });
    applianceSelect.add(new Option('Other (enter your own)', CUSTOM));

    [0.5, ...Array.from({ length: 24 }, (_, i) => i + 1)].forEach(h => {
        hoursSelect.add(new Option(`${h} ${h === 1 ? 'hr' : 'hrs'}`, h));
    });
    hoursSelect.value = '6';

    Array.from({ length: 30 }, (_, i) => i + 1).forEach(q => {
        quantitySelect.add(new Option(q, q));
    });
    quantitySelect.value = '1';

    applianceSelect.addEventListener('change', () => {
        const isCustom = applianceSelect.value === CUSTOM;
        customNameField.hidden = !isCustom;
        const item = applianceCatalog.find(a => a.name === applianceSelect.value);
        if (item) wattsInput.value = item.watts;
        if (isCustom) {
            wattsInput.value = '';
            nameInput.focus();
        }
    });

    const formatNumber = (value, digits = 0) =>
        value.toLocaleString('en-NG', { minimumFractionDigits: digits, maximumFractionDigits: digits });

    const escapeHtml = (str) => str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const icons = {
        plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/></svg>'
    };

    const renderAppliances = () => {
        if (appliances.length === 0) {
            applianceList.innerHTML = '<p class="appliance-empty">No appliances added yet. Pick a preset or add your first appliance above.</p>';
            return;
        }
        applianceList.innerHTML = appliances.map(a => `
            <div class="appliance">
                <div class="appliance-row">${icons.plug}<span>${escapeHtml(a.name)} (${a.quantity})</span></div>
                <div class="appliance-row is-meta">${icons.clock}<span>${a.hours} hrs/day &middot; ${formatNumber(a.watts)}W</span></div>
                <button type="button" class="appliance-remove" data-id="${a.id}" aria-label="Remove ${escapeHtml(a.name)}">${icons.trash}</button>
            </div>
        `).join('');
    };

    const calculate = () => {
        const daily = appliances.reduce((sum, a) => sum + a.watts * a.hours * a.quantity / 1000, 0);
        const systemSize = (daily / PEAK_SUN_HOURS) * SAFETY_MARGIN;
        const panels = Math.ceil((systemSize * 1000) / PANEL_WATTS);
        const battery = daily * BATTERY_FACTOR;
        const savings = daily * 365 * GRID_RATE;

        results.dailyLoad.textContent = `${formatNumber(daily, daily > 0 && daily < 10 ? 2 : 1)} kWh`;
        results.panelCount.textContent = formatNumber(panels);
        results.batteryCapacity.textContent = `${formatNumber(battery, 1)} kWh`;
        results.systemSize.textContent = `${formatNumber(systemSize, 1)} kW`;
        results.annualSavings.textContent = `₦${formatNumber(savings)}`;
    };

    const update = () => {
        renderAppliances();
        calculate();
    };

    const addAppliance = ({ name, watts, hours, quantity }) => {
        appliances.push({ id: nextId++, name, watts, hours, quantity });
    };

    const showError = (message) => {
        formError.textContent = message;
        formError.hidden = !message;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selected = applianceSelect.value;
        const name = selected === CUSTOM ? nameInput.value.trim() : selected;
        const watts = parseFloat(wattsInput.value);
        const hours = parseFloat(hoursSelect.value);
        const quantity = parseInt(quantitySelect.value, 10);

        if (!name) {
            showError(selected === CUSTOM ? 'Please enter the appliance name.' : 'Please select an appliance.');
            return;
        }
        if (!watts || watts <= 0) {
            showError('Please enter the power rating in watts.');
            return;
        }
        showError('');
        addAppliance({ name, watts, hours, quantity });
        presetButtons.forEach(btn => btn.classList.remove('is-active'));
        update();

        applianceSelect.selectedIndex = 0;
        wattsInput.value = '';
        nameInput.value = '';
        customNameField.hidden = true;
        hoursSelect.value = '6';
        quantitySelect.value = '1';
    });

    applianceList.addEventListener('click', (e) => {
        const btn = e.target.closest('.appliance-remove');
        if (!btn) return;
        appliances = appliances.filter(a => a.id !== Number(btn.dataset.id));
        update();
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            appliances = [];
            presets[btn.dataset.preset].forEach(addAppliance);
            presetButtons.forEach(b => b.classList.toggle('is-active', b === btn));
            showError('');
            update();
        });
    });

    document.getElementById('resetCalculator').addEventListener('click', () => {
        appliances = [];
        presetButtons.forEach(b => b.classList.remove('is-active'));
        showError('');
        update();
    });

    update();

    // ======================================================================
    // Scroll reveal & in-view triggers
    // ======================================================================

    const revealTargets = document.querySelectorAll(
        '.metrics, .technology, .projects, .process, .footprint, .calculator, .cta, .footer'
    );

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        revealTargets.forEach(el => el.classList.add('reveal'));
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(el => revealObserver.observe(el));
    }

    const onceInView = (el, callback) => {
        if (!el) return;
        if (!('IntersectionObserver' in window)) {
            callback();
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                callback();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(el);
    };

    onceInView(document.querySelector('.metrics-grid'), () => {
        document.querySelectorAll('[data-count]').forEach(animateCount);
    });

    onceInView(document.querySelector('.projects-gauges'), () => {
        gaugesVisible = true;
        updateGauges();
    });

    onceInView(document.querySelector('.process-card'), startStepTimer);
});
