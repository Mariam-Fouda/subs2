const subscribeButtons = document.querySelectorAll('.subscribe-btn');
const modal = document.getElementById('subscriptionModal');
const closeBtn = document.querySelector('.close-btn');
const planNameEl = document.getElementById('planName');
const planPriceEl = document.getElementById('planPrice');
const planDurationEl = document.getElementById('planDuration');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const continueBtn = document.getElementById('continueBtn');
const completeBtn = document.getElementById('completeBtn');
const successMessage = document.getElementById('successMessage');
let currentSubscription = {
    plan: '',
    price: '',
    duration: ''
};
const storage = {
    setItem: function(key, value) {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(key, value);
            } else {
                memoryStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn("Storage error:", e);
            memoryStorage.setItem(key, value);
        }
    },
    getItem: function(key) {
        try {
            if (this.isLocalStorageAvailable()) {
                return localStorage.getItem(key);
            } else {
                return memoryStorage.getItem(key);
            }
        } catch (e) {
            console.warn("Storage error:", e);
            return memoryStorage.getItem(key);
        }
    },
    isLocalStorageAvailable: function() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
};
subscribeButtons.forEach(button => {
    button.addEventListener('click', function() {
        currentSubscription.plan = this.getAttribute('data-plan');
        currentSubscription.price = this.getAttribute('data-price') + 'L.E';
        currentSubscription.duration = this.getAttribute('data-duration');
        planNameEl.textContent = getEnglishPlanName(currentSubscription.plan);
        planPriceEl.textContent = currentSubscription.price;
        planDurationEl.textContent = currentSubscription.duration;
        modal.style.display = 'flex';
        resetForm();
    });
});
function getEnglishPlanName(plan) {
    switch(plan) {
        case 'weekly':
            return ' Weekly package';
        case 'monthly':
            return 'Monthly package ';
        case 'yearly':
            return 'Yearly package ';
        default:
            return '';
    }
}
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
continueBtn.addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    if (name === '' || email === '') {
        alert('Please fill in all fields');
        return;
    }    
    if (!validateEmail(email)) {
        alert('Please enter valid email address');
        return;
    }
    const userData = {
        name: name,
        email: email,
        subscription: currentSubscription
    };    
    storage.setItem('userData', JSON.stringify(userData));
    step1.style.display = 'none';
    step2.style.display = 'block';
});
completeBtn.addEventListener('click', function() {
    const code = document.getElementById('code').value.trim();
    if (code === '') {
        alert('Please enter the subscribtion code');
        return;
    }
    const userDataStr = storage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : {};
    userData.subscriptionCode = code;
    storage.setItem('userData', JSON.stringify(userData));
    const subscriptionsStr = storage.getItem('subscriptions');
    const subscriptions = subscriptionsStr ? JSON.parse(subscriptionsStr) : [];   
    subscriptions.push({
        name: userData.name,
        email: userData.email,
        plan: currentSubscription.plan,
        price: currentSubscription.price,
        duration: currentSubscription.duration,
        code: code,
        date: new Date().toLocaleDateString()
    });
    storage.setItem('subscriptions', JSON.stringify(subscriptions));
    step2.style.display = 'none';
    successMessage.style.display = 'block';
    setTimeout(function() {
        modal.style.display = 'none';
        resetForm();
    }, 3000);
});
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('code').value = '';
    step1.style.display = 'block';
    step2.style.display = 'none';
    successMessage.style.display = 'none';
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}