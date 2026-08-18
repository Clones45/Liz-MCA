/**
 * Navigation module: responsive mobile menu, scroll-based header,
 * active link detection.
 */

import { throttle } from './utils.js';

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!header) return;

  // Scroll-based header compacting
  const onScroll = throttle(() => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state

  // Mobile menu toggle
  if (menuToggle && mobileNav && mobileOverlay) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      toggleMobileMenu(!isOpen);
    });

    mobileOverlay.addEventListener('click', () => {
      toggleMobileMenu(false);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggleMobileMenu(false);
        menuToggle.focus();
      }
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      mobileNav.classList.add('is-open');
      mobileOverlay.classList.add('is-visible');
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('is-open');
      mobileOverlay.classList.remove('is-visible');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Set active nav link based on current page
  setActiveLink();
}

function setActiveLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const fileName = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop() || 'index.html';

    // Normalize: treat empty href, './', and 'index.html' as home
    const normalizedCurrent = (fileName === '' || fileName === 'index.html') ? 'index.html' : fileName;
    const normalizedLink = (linkFile === '' || linkFile === '.' || linkFile === './') ? 'index.html' : linkFile;

    if (normalizedCurrent === normalizedLink) {
      link.classList.add('is-active');
    }
  });
}
