const subscribeButtons = document.querySelectorAll('.subscribe-btn');
const modal = document.getElementById('subscriptionModal');
const closeBtn = document.querySelector('.close-btn');
const planNameEl = document.getElementById('planName');
const planPriceEl = document.getElementById('planPrice');
const planDurationEl = document.getElementById('planDuration');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2'); 
const continueBtn = document.getElementById('continueBtn');
const payBtn = document.getElementById('payBtn');
const successMessage = document.getElementById('successMessage');

let currentSubscription = {
  plan: '',
  price: '',
  duration: ''
};
let generatedCode = '';

subscribeButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentSubscription.plan = button.getAttribute('data-plan');
    currentSubscription.price = button.getAttribute('data-price') + ' L.E';
    currentSubscription.duration = button.getAttribute('data-duration');
    planNameEl.textContent = getEnglishPlanName(currentSubscription.plan);
    planPriceEl.textContent = currentSubscription.price;
    planDurationEl.textContent = currentSubscription.duration;
    modal.style.display = 'flex';
    resetForm();
  });
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

continueBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!name || !email) return alert("Please enter both name and email.");
  if (!validateEmail(email)) return alert("Please enter a valid email address.");
  const userData = {
    name,
    email,
    subscription: currentSubscription
  };
  localStorage.setItem('userData', JSON.stringify(userData));
  document.getElementById("payAmount").textContent = currentSubscription.price;
  step1.style.display = "none";
  document.getElementById("stepPayment").style.display = "block";
  document.getElementById("codeSection").style.display = "none";
});

payBtn.addEventListener('click', () => {
  alert("Payment successful!");
  document.getElementById("codeSection").style.display = "block";
  generatedCode = generateSubscriptionCode();
  alert("The code is: " + generatedCode);
  const userDataStr = localStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};
  userData.subscriptionCode = generatedCode;
  localStorage.setItem('userData', JSON.stringify(userData));
  const subscriptionsStr = localStorage.getItem('subscriptions');
  const subscriptions = subscriptionsStr ? JSON.parse(subscriptionsStr) : [];
  subscriptions.push({
    name: userData.name,
    email: userData.email,
    plan: currentSubscription.plan,
    price: currentSubscription.price,
    duration: currentSubscription.duration,
    code: generatedCode,
    date: new Date().toLocaleDateString()
  });
  localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
});

document.getElementById("completeBtn").addEventListener("click", () => {
  const enteredCode = document.getElementById("code").value.trim();
  if (enteredCode === generatedCode) {
    document.getElementById("stepPayment").style.display = "none";
    successMessage.innerHTML = `
      <p>Subscription successful!</p>
      <p>The code is: <strong>${generatedCode}</strong></p>
    `;
    successMessage.style.display = "block";
    setTimeout(() => {
      modal.style.display = "none";
      resetForm();
    }, 5000);
  } else {
    alert("Invalid code. Please try again.");
  }
});

function getEnglishPlanName(plan) {
  switch (plan.toLowerCase()) {
    case 'weekly': return 'Weekly package';
    case 'monthly': return 'Monthly package';
    case 'yearly': return 'Yearly package';
    default: return plan;
  }
}

function generateSubscriptionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function resetForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('code').value = '';
  step1.style.display = 'block';
  document.getElementById("stepPayment").style.display = "none";
  document.getElementById("codeSection").style.display = "none";
  successMessage.style.display = 'none';
}
