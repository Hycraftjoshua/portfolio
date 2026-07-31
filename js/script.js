// ============================================
// MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close the mobile menu automatically when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============================================
// LIGHT / DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// On page load, use the visitor's saved preference (or dark by default)
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  }
});

// ============================================
// CONTACT + FEEDBACK FORMS — validation & submission
// ============================================
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setupForm(formId, statusId, { requireEmail }) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Clear old error states
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    status.textContent = '';
    status.className = '';

    // Check every required field is filled in
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    // Check the email field specifically looks like a real email
    if (requireEmail) {
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
        emailField.classList.add('error');
        valid = false;
      }
    }

    if (!valid) {
      status.textContent = 'Please fill in all required fields correctly.';
      status.className = 'error';
      return;
    }

    // Show a submitting state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
        status.className = 'success';
        form.reset();
      } else {
        status.textContent = 'Something went wrong sending that. Please try again or email me directly.';
        status.className = 'error';
      }
    } catch (err) {
      status.textContent = 'Network error — please check your connection and try again.';
      status.className = 'error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

setupForm('contact-form', 'form-status', { requireEmail: true });
setupForm('feedback-form', 'feedback-status', { requireEmail: false });

// ============================================
// SCROLL REVEAL — sections fade/slide in as they enter view
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // only animate in once
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// DEMO TABS
// ============================================
const demoTabs = document.querySelectorAll('.demo-tab');
const demoPanels = document.querySelectorAll('.demo-panel');

demoTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    demoTabs.forEach(t => t.classList.remove('active'));
    demoPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`demo-${tab.dataset.tab}`).classList.add('active');
  });
});

// ============================================
// SAVINGS CALCULATOR
// ============================================
const calcBtn = document.getElementById('calc-btn');
const calcResult = document.getElementById('calc-result');

calcBtn.addEventListener('click', () => {
  const hours = parseFloat(document.getElementById('calc-hours').value) || 0;
  const rate = parseFloat(document.getElementById('calc-rate').value) || 0;

  // Assumes automation removes ~80% of the manual time spent on the task
  const weeklySavingsHours = hours * 0.8;
  const weeklySavingsMoney = weeklySavingsHours * rate;
  const monthlySavingsMoney = weeklySavingsMoney * 4.33;
  const yearlySavingsMoney = weeklySavingsMoney * 52;

  calcResult.innerHTML = `
    By automating this task, you could save roughly
    <strong>${weeklySavingsHours.toFixed(1)} hours/week</strong> —
    that's about <strong>$${monthlySavingsMoney.toFixed(0)}/month</strong>
    or <strong>$${yearlySavingsMoney.toFixed(0)}/year</strong> in reclaimed time.
  `;
  calcResult.classList.add('show');
});

// ============================================
// CHAT DEMO — simple rule-based responses
// ============================================
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');

function addChatMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getBotReply(input) {
  const text = input.toLowerCase();

  if (text.includes('book') || text.includes('appointment') || text.includes('reservation')) {
    return "I can help with that. What date and time works best for you, and I'll check availability right away.";
  }
  if (text.includes('hour') || text.includes('open') || text.includes('time')) {
    return "We're open Monday to Saturday, 9am to 6pm. Let me know if you'd like to book a slot in that window.";
  }
  if (text.includes('complaint') || text.includes('issue') || text.includes('problem')) {
    return "I'm sorry to hear that. Could you share a few details? I'll log this and escalate it to the team right away.";
  }
  if (text.includes('price') || text.includes('cost') || text.includes('pricing')) {
    return "Pricing depends on the service — happy to connect you with the right person for an exact quote.";
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return "Hey there! How can I help you today?";
  }
  return "Got it — I've noted that down. In a real deployment, I'd route this to the right workflow (booking, support, or escalation) automatically.";
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;

  addChatMessage(value, 'user');
  chatInput.value = '';

  setTimeout(() => {
    addChatMessage(getBotReply(value), 'bot');
  }, 500);
});
