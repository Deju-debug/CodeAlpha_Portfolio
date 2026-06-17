'use strict';

/* ============================================
   Theme Toggle (Dark / Light Mode)
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
  return localStorage.getItem('theme');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    setTheme(stored);
  } else if (prefersDark.matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

prefersDark.addEventListener('change', (e) => {
  if (!getStoredTheme()) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

initTheme();

/* ============================================
   Mobile Navigation
   ============================================ */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

function closeNav() {
  navMenu.classList.remove('is-open');
  navToggle.classList.remove('is-active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
    closeNav();
  }
});

/* ============================================
   Header Scroll Effect
   ============================================ */
const header = document.getElementById('header');

function handleHeaderScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

/* ============================================
   Active Navigation Link
   ============================================ */
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);

    if (link && scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNavLink, { passive: true });

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */
const animateElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        const progressBar = entry.target.querySelector('.skill-card__progress');
        if (progressBar) {
          const progress = progressBar.dataset.progress;
          progressBar.style.setProperty('--progress', `${progress}%`);
          entry.target.classList.add('is-visible');
        }

        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

animateElements.forEach((el) => scrollObserver.observe(el));

/* ============================================
   Typing Animation (Hero Section)
   ============================================ */
const typingElement = document.getElementById('typing-text');
const typingPhrases = [
  'Software Engineer',
  'Web Developer',
  'Problem Solver',
  'UI Enthusiast',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    typingDelay = 500;
  }

  setTimeout(typeEffect, typingDelay);
}

if (typingElement && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typeEffect();
} else if (typingElement) {
  typingElement.textContent = typingPhrases[0];
}

/* ============================================
   Contact Form Validation
   ============================================ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const validators = {
  name: (value) => {
    if (!value.trim()) return 'Name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Message is required.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  input.classList.toggle('is-error', Boolean(message));
  errorEl.textContent = message;
}

function validateField(fieldId) {
  const input = document.getElementById(fieldId);
  const error = validators[fieldId](input.value);
  showError(fieldId, error);
  return !error;
}

['name', 'email', 'message'].forEach((fieldId) => {
  const input = document.getElementById(fieldId);
  input.addEventListener('blur', () => validateField(fieldId));
  input.addEventListener('input', () => {
    if (input.classList.contains('is-error')) {
      validateField(fieldId);
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.hidden = true;

  const isValid = ['name', 'email', 'message'].every(validateField);

  if (isValid) {
    formSuccess.hidden = false;
    contactForm.reset();
    ['name', 'email', 'message'].forEach((fieldId) => showError(fieldId, ''));

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 5000);
  }
});

/* ============================================
   Footer Year
   ============================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================
   Smooth Scroll for anchor links (fallback)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
