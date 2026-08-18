/**
 * FAQ accordion with accessible keyboard navigation.
 */

export function initFAQ() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    if (!trigger || !panel) return;

    // Set initial ARIA attributes
    const panelId = panel.id || `panel-${Math.random().toString(36).slice(2, 9)}`;
    const triggerId = trigger.id || `trigger-${Math.random().toString(36).slice(2, 9)}`;

    panel.id = panelId;
    trigger.id = triggerId;
    trigger.setAttribute('aria-controls', panelId);
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', triggerId);

    trigger.addEventListener('click', () => {
      toggleItem(item, items);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item, items);
      }
    });
  });
}

function toggleItem(item, allItems) {
  const isOpen = item.classList.contains('is-open');
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');
  const inner = panel?.querySelector('.accordion-panel-inner');

  if (!panel || !inner) return;

  // Close all others
  allItems.forEach(other => {
    if (other !== item && other.classList.contains('is-open')) {
      closeItem(other);
    }
  });

  if (isOpen) {
    closeItem(item);
  } else {
    item.classList.add('is-open');
    trigger?.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = inner.scrollHeight + 'px';
  }
}

function closeItem(item) {
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');

  item.classList.remove('is-open');
  trigger?.setAttribute('aria-expanded', 'false');
  if (panel) panel.style.maxHeight = '0';
}
