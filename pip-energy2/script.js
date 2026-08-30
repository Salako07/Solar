// ==========================================================================
// Pip Energy - Interactive JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('open');
            });
        });
    }

    // 3. Smooth Scroll for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // 4. Load Calculator Engine
    // ==========================================================================
    const GRID_TARIFF_NAIRA_PER_KWH = 225; // ₦225/kWh as specified in design
    const PEAK_SUN_HOURS = 4.5;
    const SYSTEM_OVERHEAD_FACTOR = 1.25; // 25% safety & inverter efficiency margin

    // Preset Configurations
    const presetsData = {
        retail: [
            { id: 1, name: 'Air Conditioners (1.5 HP)', watts: 1200, qty: 4, hours: 10 },
            { id: 2, name: 'Industrial Freezers', watts: 350, qty: 2, hours: 24 },
            { id: 3, name: 'POS & Desktop Systems', watts: 120, qty: 2, hours: 12 },
            { id: 4, name: 'Commercial Lighting', watts: 15, qty: 20, hours: 12 }
        ],
        residential: [
            { id: 1, name: 'Inverter Air Conditioners (1.5 HP)', watts: 1100, qty: 3, hours: 10 },
            { id: 2, name: 'Deep Freezer & Refrigerator', watts: 250, qty: 2, hours: 24 },
            { id: 3, name: 'Water Pump (1.5 HP)', watts: 1100, qty: 1, hours: 2 },
            { id: 4, name: 'Smart Home & Entertainment', watts: 300, qty: 1, hours: 12 },
            { id: 5, name: 'LED Lighting', watts: 12, qty: 25, hours: 8 }
        ],
        restaurant: [
            { id: 1, name: 'Commercial Freezers / Chillers', watts: 400, qty: 4, hours: 24 },
            { id: 2, name: 'Dining Area ACs (2.0 HP)', watts: 1800, qty: 3, hours: 12 },
            { id: 3, name: 'Kitchen Exhaust & Prep Equipment', watts: 1500, qty: 1, hours: 10 },
            { id: 4, name: 'Ambient Lighting & POS', watts: 15, qty: 30, hours: 14 }
        ],
        clinic: [
            { id: 1, name: 'Vaccine & Cold Storage Freezers', watts: 350, qty: 3, hours: 24 },
            { id: 2, name: 'Consultation & Lab ACs (1.5 HP)', watts: 1200, qty: 3, hours: 12 },
            { id: 3, name: 'Diagnostic & Lab Equipment', watts: 800, qty: 2, hours: 8 },
            { id: 4, name: '24/7 Facility Lighting', watts: 15, qty: 25, hours: 24 }
        ],
        factory: [
            { id: 1, name: 'Heavy Duty Motors & Machinery', watts: 3500, qty: 2, hours: 8 },
            { id: 2, name: 'Industrial Ventilation & Blowers', watts: 1200, qty: 4, hours: 12 },
            { id: 3, name: 'Industrial Chillers', watts: 750, qty: 3, hours: 24 },
            { id: 4, name: 'Warehouse High-Bay LED Lights', watts: 50, qty: 20, hours: 12 }
        ]
    };

    let currentAppliances = JSON.parse(JSON.stringify(presetsData.retail));

    // DOM Elements
    const addedAppliancesList = document.getElementById('addedAppliancesList');
    const profileDailyLoad = document.getElementById('profileDailyLoad');
    const profileSystemSize = document.getElementById('profileSystemSize');
    const profileAnnualSavings = document.getElementById('profileAnnualSavings');
    const btnQuoteAction = document.getElementById('btnQuoteAction');
    const btnAddAppliance = document.getElementById('btnAddAppliance');
    const applianceSelect = document.getElementById('applianceSelect');
    const applianceQty = document.getElementById('applianceQty');
    const applianceHours = document.getElementById('applianceHours');
    const presetButtons = document.querySelectorAll('.btn-preset');

    // Render Appliances in UI
    function renderApplianceList() {
        if (!addedAppliancesList) return;

        if (currentAppliances.length === 0) {
            addedAppliancesList.innerHTML = `
                <div style="text-align: center; padding: 1.5rem; color: #5E5E5E; font-size: 0.95rem;">
                    No appliances selected. Pick a preset or add equipment above.
                </div>
            `;
            return;
        }

        addedAppliancesList.innerHTML = currentAppliances.map(item => `
            <div class="appliance-item-row" data-id="${item.id}">
                <div class="item-row-left">
                    <div class="item-icon-wrap">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                    </div>
                    <div>
                        <h5 class="item-title">${item.name}</h5>
                        <p class="item-detail">Qty: ${item.qty} • ${item.hours} hrs/day (${item.watts}W)</p>
                    </div>
                </div>
                <button type="button" class="btn-item-remove" data-id="${item.id}" aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Attach delete handlers
        addedAppliancesList.querySelectorAll('.btn-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id, 10);
                currentAppliances = currentAppliances.filter(a => a.id !== id);
                renderApplianceList();
                calculateEnergyProfile();
            });
        });
    }

    // Calculation Routine
    function calculateEnergyProfile() {
        let totalDailyKWh = 0;

        currentAppliances.forEach(item => {
            const itemKWh = (item.watts * item.qty * item.hours) / 1000;
            totalDailyKWh += itemKWh;
        });

        // Round daily load
        const dailyLoadFormatted = Math.round(totalDailyKWh) || 0;

        // System sizing
        const recommendedKwp = Math.ceil((totalDailyKWh / PEAK_SUN_HOURS) * SYSTEM_OVERHEAD_FACTOR) || 0;
        const recommendedBatteryKwh = Math.round(totalDailyKWh * 0.5) || 0; // standard 50% overnight battery storage

        // Annual Savings (kWh * 365 days * ₦225 tariff)
        const annualSavingsNaira = Math.round(totalDailyKWh * 365 * GRID_TARIFF_NAIRA_PER_KWH) || 0;

        // Update DOM
        if (profileDailyLoad) {
            profileDailyLoad.textContent = dailyLoadFormatted;
        }

        if (profileSystemSize) {
            if (recommendedKwp === 0) {
                profileSystemSize.textContent = '0 kWp Solar + 0 kWh Battery';
            } else {
                profileSystemSize.textContent = `${recommendedKwp} kWp Solar + ${recommendedBatteryKwh} kWh Battery`;
            }
        }

        if (profileAnnualSavings) {
            profileAnnualSavings.textContent = `₦ ${annualSavingsNaira.toLocaleString('en-NG')}`;
        }

        // Update WhatsApp CTA link with pre-filled message
        if (btnQuoteAction) {
            const msg = `Hi Pip Energy, I used your solar calculator for my business.\n\nEstimated Daily Load: ${dailyLoadFormatted} kWh\nRecommended System: ${recommendedKwp} kWp Solar + ${recommendedBatteryKwh} kWh Battery\n\nI would like a detailed technical audit and quote.`;
            btnQuoteAction.href = `https://wa.me/2348000000000?text=${encodeURIComponent(msg)}`;
        }
    }

    // Switch Presets
    function loadPreset(presetKey) {
        if (!presetsData[presetKey]) return;
        currentAppliances = JSON.parse(JSON.stringify(presetsData[presetKey]));
        
        presetButtons.forEach(btn => {
            if (btn.dataset.preset === presetKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        renderApplianceList();
        calculateEnergyProfile();
    }

    // Preset button clicks
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loadPreset(btn.dataset.preset);
        });
    });

    // Solutions Cards "Learn more" click: loads relevant preset and jumps to calculator
    document.querySelectorAll('.solution-link[data-preset]').forEach(link => {
        link.addEventListener('click', (e) => {
            const presetKey = link.dataset.preset;
            if (presetKey) {
                loadPreset(presetKey);
            }
        });
    });

    // Add Custom Appliance Form
    if (btnAddAppliance && applianceSelect) {
        btnAddAppliance.addEventListener('click', () => {
            const selectedOpt = applianceSelect.options[applianceSelect.selectedIndex];
            const name = selectedOpt.text;
            const watts = parseInt(selectedOpt.dataset.watts, 10) || 500;
            const qty = parseInt(applianceQty.value, 10) || 1;
            const hours = parseInt(applianceHours.value, 10) || 8;

            const newItem = {
                id: Date.now(),
                name: name,
                watts: watts,
                qty: qty,
                hours: hours
            };

            currentAppliances.push(newItem);
            renderApplianceList();
            calculateEnergyProfile();

            // Deselect presets active highlight
            presetButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // Auto-update hours input when changing appliance dropdown
    if (applianceSelect) {
        applianceSelect.addEventListener('change', () => {
            const selectedOpt = applianceSelect.options[applianceSelect.selectedIndex];
            const defaultHours = selectedOpt.dataset.hours;
            if (defaultHours && applianceHours) {
                applianceHours.value = defaultHours;
            }
        });
    }

    // Initialize Calculator on Page Load
    renderApplianceList();
    calculateEnergyProfile();
});