const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('project-modal-title');
const modalKicker = document.getElementById('project-modal-kicker');
const modalShot = document.getElementById('project-modal-shot');
const modalNoShot = document.getElementById('project-modal-noshot');
const modalLink = document.getElementById('project-modal-link');
const modalNoLink = document.getElementById('project-modal-nolink');
const shotPrev = document.getElementById('shot-prev');
const shotNext = document.getElementById('shot-next');
const shotDots = document.getElementById('shot-dots');
let lastFocused = null;
let currentShots = [];
let currentShotIndex = 0;

function showShot(index) {
  if (!currentShots.length) return;
  currentShotIndex = (index + currentShots.length) % currentShots.length;
  modalShot.classList.remove('is-loaded');
  modalShot.onload = () => modalShot.classList.add('is-loaded');
  modalShot.onerror = () => modalShot.classList.remove('is-loaded');
  modalShot.src = currentShots[currentShotIndex];
  shotDots.querySelectorAll('span').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentShotIndex);
  });
}

function openProjectModal(card) {
  const { title, kicker, shot, link, linkLabel } = card.dataset;

  modalTitle.textContent = title || '';
  modalKicker.textContent = kicker || '';

  currentShots = (shot || '').split(',').map((s) => s.trim()).filter(Boolean);
  shotDots.innerHTML = '';
  modalShot.removeAttribute('src');
  modalShot.classList.remove('is-loaded');

  if (currentShots.length) {
    modalShot.alt = `${title} screenshot`;
    currentShots.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => showShot(i));
      shotDots.appendChild(dot);
    });
    const multiple = currentShots.length > 1;
    shotPrev.hidden = !multiple;
    shotNext.hidden = !multiple;
    shotDots.hidden = !multiple;
    showShot(0);
  } else {
    shotPrev.hidden = true;
    shotNext.hidden = true;
    shotDots.hidden = true;
  }

  if (link) {
    modalLink.href = link;
    modalLink.textContent = '';
    const label = document.createElement('span');
    label.textContent = (linkLabel || 'View project') + ' ';
    modalLink.appendChild(label);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '&#8599;';
    modalLink.appendChild(arrow);
    modalLink.hidden = false;
    modalNoLink.hidden = true;
  } else {
    modalLink.hidden = true;
    modalNoLink.hidden = false;
  }

  lastFocused = document.activeElement;
  modal.hidden = false;
  modal.querySelector('.project-modal-close').focus();
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  lastFocused?.focus();
}

shotPrev?.addEventListener('click', () => showShot(currentShotIndex - 1));
shotNext?.addEventListener('click', () => showShot(currentShotIndex + 1));

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

modal?.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeProjectModal);
});

document.addEventListener('keydown', (event) => {
  if (!modal || modal.hidden) return;
  if (event.key === 'Escape') closeProjectModal();
  if (event.key === 'ArrowLeft') showShot(currentShotIndex - 1);
  if (event.key === 'ArrowRight') showShot(currentShotIndex + 1);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
