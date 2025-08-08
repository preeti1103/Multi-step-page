document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const form = document.getElementById('multiStepForm');
    const steps = document.querySelectorAll('.form-step');
    const sidebarSteps = document.querySelectorAll('.sidebar .step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const confirmButton = document.querySelector('.confirm-btn');
    const changePlanButton = document.querySelector('.btn-change');
    const billingToggle = document.getElementById('billing');

    // Form data object
    const formData = {
        personalInfo: {},
        plan: {},
        addons: [],
        billing: 'monthly'
    };

    // Current step
    let currentStep = 1;

    // Initialize form
    initForm();

    // Event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', goToNextStep);
    });

    backButtons.forEach(button => {
        button.addEventListener('click', goToPreviousStep);
    });

    confirmButton.addEventListener('click', confirmForm);
    changePlanButton.addEventListener('click', () => goToStep(2));
    billingToggle.addEventListener('change', toggleBilling);

    // Form validation for step 1
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);

    // Plan selection
    const planOptions = document.querySelectorAll('.plan-option input');
    planOptions.forEach(option => {
        option.addEventListener('change', updateSelectedPlan);
    });

    // Addon selection
    const addonOptions = document.querySelectorAll('.addon-option input');
    addonOptions.forEach(option => {
        option.addEventListener('change', updateSelectedAddons);
    });

    // Functions
    function initForm() {
        updateSidebar();
        updateBillingDisplay();
    }

    function goToNextStep() {
        if (currentStep === 1 && !validateStep1()) return;

        if (currentStep < steps.length) {
            // Save form data before moving to next step
            saveStepData(currentStep);

            // Hide current step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');

            // Update current step
            currentStep++;

            // Show next step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

            // Update sidebar
            updateSidebar();

            // If going to summary step, update summary
            if (currentStep === 4) {
                updateSummary();
            }
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            // Hide current step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');

            // Update current step
            currentStep--;

            // Show previous step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

            // Update sidebar
            updateSidebar();
        }
    }

    function goToStep(step) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');

        // Update current step
        currentStep = step;

        // Show target step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

        // Update sidebar
        updateSidebar();
    }

    function updateSidebar() {
        sidebarSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));

            step.classList.remove('active');
            if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
    }

    function saveStepData(step) {
        switch (step) {
            case 1:
                formData.personalInfo = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value
                };
                break;
            case 2:
                // Plan data is saved in updateSelectedPlan
                break;
            case 3:
                // Addons data is saved in updateSelectedAddons
                break;
        }
    }

    function validateStep1() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        return isNameValid && isEmailValid && isPhoneValid;
    }

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = nameInput.nextElementSibling;

        if (name === '') {
            errorElement.textContent = 'This field is required';
            nameInput.style.borderColor = 'hsl(354, 84%, 57%)';
            return false;
        }

        errorElement.textContent = '';
        nameInput.style.borderColor = 'hsl(229, 24%, 87%)';
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = emailInput.nextElementSibling;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            errorElement.textContent = 'This field is required';
            emailInput.style.borderColor = 'hsl(354, 84%, 57%)';
            return false;
        }

        if (!emailRegex.test(email)) {
            errorElement.textContent = 'Please enter a valid email';
            emailInput.style.borderColor = 'hsl(354, 84%, 57%)';
            return false;
        }

        errorElement.textContent = '';
        emailInput.style.borderColor = 'hsl(229, 24%, 87%)';
        return true;
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const errorElement = phoneInput.nextElementSibling;
        const phoneRegex = /^\+?[\d\s-]+$/;

        if (phone === '') {
            errorElement.textContent = 'This field is required';
            phoneInput.style.borderColor = 'hsl(354, 84%, 57%)';
            return false;
        }

        if (!phoneRegex.test(phone)) {
            errorElement.textContent = 'Please enter a valid phone number';
            phoneInput.style.borderColor = 'hsl(354, 84%, 57%)';
            return false;
        }

        errorElement.textContent = '';
        phoneInput.style.borderColor = 'hsl(229, 24%, 87%)';
        return true;
    }

    function toggleBilling() {
        formData.billing = billingToggle.checked ? 'yearly' : 'monthly';
        updateBillingDisplay();
        updateSelectedPlan();
    }

    function updateBillingDisplay() {
        const monthlyLabel = document.querySelector('.billing-toggle .monthly');
        const yearlyLabel = document.querySelector('.billing-toggle .yearly');

        if (formData.billing === 'monthly') {
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');

            // Update plan prices
            document.querySelectorAll('.plan-details .price').forEach(price => {
                const plan = price.closest('.plan-option').querySelector('input').value;
                price.textContent = plan === 'arcade' ? '$9/mo' :
                    plan === 'advanced' ? '$12/mo' : '$15/mo';
            });

            // Update addon prices
            document.querySelectorAll('.addon-price').forEach(price => {
                const addon = price.closest('.addon-option').querySelector('input').value;
                price.textContent = addon === 'online-service' ? '+$1/mo' :
                    addon === 'larger-storage' ? '+$2/mo' : '+$2/mo';
            });
        } else {
            monthlyLabel.classList.remove('active');
            yearlyLabel.classList.add('active');

            // Update plan prices
            document.querySelectorAll('.plan-details .price').forEach(price => {
                const plan = price.closest('.plan-option').querySelector('input').value;
                price.textContent = plan === 'arcade' ? '$90/yr' :
                    plan === 'advanced' ? '$120/yr' : '$150/yr';
                // Add free months text
                const freeMonths = document.createElement('p');
                freeMonths.className = 'free-months';
                freeMonths.textContent = '2 months free';
                price.parentNode.appendChild(freeMonths);
            });

            // Update addon prices
            document.querySelectorAll('.addon-price').forEach(price => {
                const addon = price.closest('.addon-option').querySelector('input').value;
                price.textContent = addon === 'online-service' ? '+$10/yr' :
                    addon === 'larger-storage' ? '+$20/yr' : '+$20/yr';
            });
        }
    }

    function updateSelectedPlan() {
        const selectedPlan = document.querySelector('.plan-option input:checked');

        if (selectedPlan) {
            const planName = selectedPlan.value;
            const planLabel = selectedPlan.nextElementSibling.querySelector('h3').textContent;

            formData.plan = {
                name: planName,
                label: planLabel,
                billing: formData.billing,
                price: formData.billing === 'monthly' ?
                    (planName === 'arcade' ? 9 : planName === 'advanced' ? 12 : 15) :
                    (planName === 'arcade' ? 90 : planName === 'advanced' ? 120 : 150)
            };
        }
    }

    function updateSelectedAddons() {
        formData.addons = [];

        document.querySelectorAll('.addon-option input:checked').forEach(addon => {
            const addonName = addon.value;
            const addonLabel = addon.nextElementSibling.querySelector('h3').textContent;

            formData.addons.push({
                name: addonName,
                label: addonLabel,
                price: formData.billing === 'monthly' ?
                    (addonName === 'online-service' ? 1 :
                        addonName === 'larger-storage' ? 2 : 2) :
                    (addonName === 'online-service' ? 10 :
                        addonName === 'larger-storage' ? 20 : 20)
            });
        });
    }

    function updateSummary() {
        if (!formData.plan.name) {
            goToStep(2);
            return;
        }

        // Update selected plan in summary
        const selectedPlanElement = document.getElementById('selected-plan');
        const planPriceElement = document.querySelector('.summary-plan .plan-price');

        selectedPlanElement.textContent = `${formData.plan.label} (${formData.billing === 'monthly' ? 'Monthly' : 'Yearly'})`;
        planPriceElement.textContent = formData.billing === 'monthly' ?
            `$${formData.plan.price}/mo` : `$${formData.plan.price}/yr`;

        // Update addons in summary
        const addonsContainer = document.querySelector('.summary-addons');
        addonsContainer.innerHTML = '';

        let totalPrice = formData.plan.price;

        formData.addons.forEach(addon => {
            const addonElement = document.createElement('div');
            addonElement.className = 'addon-item';

            addonElement.innerHTML = `
                <span class="addon-name">${addon.label}</span>
                <span class="addon-price">+$${addon.price}/${formData.billing === 'monthly' ? 'mo' : 'yr'}</span>
            `;

            addonsContainer.appendChild(addonElement);
            totalPrice += addon.price;
        });

        // Update total price
        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = formData.billing === 'monthly' ?
            `$${totalPrice}/mo` : `$${totalPrice}/yr`;
    }

    function confirmForm() {
        // In a real app, you would send the formData to a server here
        console.log('Form submitted:', formData);

        // Show thank you step
        goToNextStep();
    }
});