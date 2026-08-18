/**
 * Lead capture form with validation, honeypot anti-spam,
 * rate limiting, and CRM abstraction layer.
 */

import { sanitize, isValidEmail, isValidPhone, safeSetText } from './utils.js';

// Rate limiting config
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const submissions = [];

/**
 * CRM Adapter interface.
 * Replace this with your actual CRM integration (GoHighLevel, HubSpot, etc.)
 */
const CRMAdapter = {
  /**
   * Submit lead data to CRM.
   * @param {Object} data - Sanitized form data
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async submit(data) {
    const endpoint = import.meta.env.VITE_CRM_ENDPOINT;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          return { success: false, message: 'There was an issue submitting your information. Please try again or call us directly.' };
        }

        return { success: true };
      } catch {
        return { success: false, message: 'Unable to reach the server. Please try again later or call us at (559) 737-0273.' };
      }
    }

    // Fallback: log to console in development
    console.info('[Lead Submission]', data);
    return { success: true };
  },
};

/**
 * Check if rate limit has been exceeded.
 * @returns {boolean}
 */
function isRateLimited() {
  const now = Date.now();
  // Clean old entries
  while (submissions.length > 0 && submissions[0] < now - RATE_LIMIT_WINDOW_MS) {
    submissions.shift();
  }
  return submissions.length >= RATE_LIMIT_MAX;
}

/**
 * Validate form fields and return errors.
 * @param {HTMLFormElement} form
 * @returns {{valid: boolean, errors: Object}}
 */
function validateForm(form) {
  const errors = {};
  const data = new FormData(form);

  // Required text fields
  const requiredFields = ['firstName', 'lastName', 'businessName', 'phone', 'email'];
  requiredFields.forEach(name => {
    const value = (data.get(name) || '').toString().trim();
    if (!value) {
      errors[name] = 'This field is required.';
    } else if (value.length > 200) {
      errors[name] = 'Please use fewer than 200 characters.';
    }
  });

  // Email validation
  const email = (data.get('email') || '').toString().trim();
  if (email && !isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Phone validation
  const phone = (data.get('phone') || '').toString().trim();
  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Show field-level errors.
 * @param {HTMLFormElement} form
 * @param {Object} errors
 */
function showErrors(form, errors) {
  // Clear previous errors
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) safeSetText(errorEl, '');
  });

  // Set new errors
  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) return;
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) safeSetText(errorEl, message);
  });
}

/**
 * Collect and sanitize form data.
 * @param {HTMLFormElement} form
 * @returns {Object}
 */
function collectFormData(form) {
  const data = new FormData(form);
  const result = {};

  for (const [key, value] of data.entries()) {
    if (key === 'hp_field') continue; // Skip honeypot
    result[key] = sanitize(value.toString());
  }

  result.submittedAt = new Date().toISOString();
  result.pageUrl = window.location.href;

  return result;
}

/**
 * Initialize lead capture form.
 */
export function initForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const formWrapper = form.closest('.form-card') || form.parentElement;
  const successEl = formWrapper?.querySelector('.form-success');
  const formAlert = form.querySelector('.form-alert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('[name="hp_field"]');
    if (honeypot && honeypot.value) {
      // Bot detected, silently show success to avoid tipping off
      if (successEl) {
        form.style.display = 'none';
        successEl.classList.add('is-visible');
      }
      return;
    }

    // Rate limit check
    if (isRateLimited()) {
      if (formAlert) {
        formAlert.className = 'alert alert--error form-alert';
        safeSetText(formAlert, 'You have submitted too many requests. Please try again later or call us at (559) 737-0273.');
        formAlert.style.display = 'flex';
      }
      return;
    }

    // Validate
    const { valid, errors } = validateForm(form);
    if (!valid) {
      showErrors(form, errors);
      // Focus first error field
      const firstErrorField = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Clear previous errors
    showErrors(form, {});
    if (formAlert) formAlert.style.display = 'none';

    // Disable button
    if (submitBtn) {
      submitBtn.disabled = true;
      safeSetText(submitBtn, 'Submitting...');
    }

    // Collect data
    const formData = collectFormData(form);

    // Submit to CRM
    const result = await CRMAdapter.submit(formData);

    if (result.success) {
      submissions.push(Date.now());
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('is-visible');
      }
    } else {
      if (formAlert) {
        formAlert.className = 'alert alert--error form-alert';
        safeSetText(formAlert, result.message || 'Something went wrong. Please try again.');
        formAlert.style.display = 'flex';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        safeSetText(submitBtn, 'Submit Application');
      }
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      if (!group) return;
      const name = input.name;
      if (!name) return;

      const value = input.value.trim();
      let error = '';

      if (input.hasAttribute('required') && !value) {
        error = 'This field is required.';
      } else if (name === 'email' && value && !isValidEmail(value)) {
        error = 'Please enter a valid email address.';
      } else if (name === 'phone' && value && !isValidPhone(value)) {
        error = 'Please enter a valid phone number.';
      }

      if (error) {
        group.classList.add('has-error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) safeSetText(errorEl, error);
      } else {
        group.classList.remove('has-error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) safeSetText(errorEl, '');
      }
    });
  });
}
