

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


function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  update();
  setInterval(update, 1000);
}


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


function initScrollToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjybryoa'; // ← вставь сюда свою ссылку

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          note.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
          form.reset();
        } else {
          note.textContent = 'Something went wrong sending your message. Please email me directly instead.';
        }
      })
      .catch(() => {
        note.textContent = 'Something went wrong sending your message. Please email me directly instead.';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      });
  });
}
