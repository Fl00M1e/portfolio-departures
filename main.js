/**
 * main.js
 * No build step, no dependencies — plain DOM APIs.
 */

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initClock();
  initFlapBoard();
  initMobileNav();
  initScrollToTop();
  initContactForm();
});

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------
 * Live clock in the board header, like a real departures sign.
 * ----------------------------------------------------- */
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------
 * Split-flap reveal: each line scrambles through random
 * characters before settling on its final text, left to right.
 * ----------------------------------------------------- */
const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function initFlapBoard() {
  const fields = document.querySelectorAll('[data-flap]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  fields.forEach((field, index) => {
    const finalText = field.dataset.flap;
    if (prefersReduced) {
      field.textContent = finalText;
      return;
    }
    // stagger each row so they don't all flip at once
    setTimeout(() => animateFlap(field, finalText), index * 350);
  });
}

function animateFlap(field, finalText) {
  const length = finalText.length;
  let frame = 0;
  const totalFrames = 16;

  const interval = setInterval(() => {
    frame += 1;
    const settledCount = Math.floor((frame / totalFrames) * length);

    let output = '';
    for (let i = 0; i < length; i += 1) {
      if (i < settledCount) {
        output += finalText[i];
      } else if (finalText[i] === ' ') {
        output += ' ';
      } else {
        output += FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
      }
    }
    field.textContent = output;

    if (frame >= totalFrames) {
      field.textContent = finalText;
      clearInterval(interval);
    }
  }, 40);
}

/* -------------------------------------------------------
 * Mobile nav toggle
 * ----------------------------------------------------- */
function initMobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* -------------------------------------------------------
 * Back-to-top button
 * ----------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* -------------------------------------------------------
 * Contact form — demo only, no real submission.
 * Swap fakeSubmit() for a real fetch() call to your backend
 * or a form service (Formspree, Getform, etc).
 * ----------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fakeSubmit(new FormData(form)).then(() => {
      note.textContent = "Thanks — this demo form doesn't send anywhere yet. Wire it up to your own inbox or a form service before going live.";
      form.reset();
    }).finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    });
  });
}

function fakeSubmit(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Demo form data:', Object.fromEntries(formData));
      resolve();
    }, 500);
  });
}
