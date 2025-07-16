// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    
    // Debug log
    console.log('Theme applied:', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    
    // Debug log
    console.log('Theme toggled to:', this.theme);
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 400);
  }

  setupToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
      console.log('Theme toggle setup complete');
    } else {
      console.error('Theme toggle button not found');
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupScrollEffects();
  }

  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        }
      });

      // Close menu when clicking on a link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          
          // Reset hamburger
          const spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        });
      });
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (navbar) {
        if (currentScrollY > 100) {
          navbar.style.background = 'rgba(10, 10, 10, 0.95)';
          navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.1)';
          navbar.style.boxShadow = 'none';
        }
      }

      lastScrollY = currentScrollY;
    });
  }
}

// Modal Management
class ModalManager {
  constructor() {
    this.modal = document.getElementById('demo-modal');
    this.init();
  }

  init() {
    this.setupTriggers();
    this.setupCloseHandlers();
    this.setupFormSubmission();
  }

  setupTriggers() {
    // Demo buttons
    const demoButtons = [
      document.getElementById('demo-btn'),
      document.getElementById('hero-demo-btn'),
      document.querySelector('.footer-demo-btn')
    ];

    demoButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.openModal());
      }
    });
  }

  setupCloseHandlers() {
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (this.modal) {
      this.modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Set minimum date to today
      const dateInput = document.getElementById('demo-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }

      // Focus first input
      setTimeout(() => {
        const firstInput = this.modal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  setupFormSubmission() {
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
      demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleDemoSubmission(new FormData(demoForm));
      });
    }
  }

  handleDemoSubmission(formData) {
    const submitBtn = document.querySelector('#demo-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Scheduling...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate API call with better UX
    setTimeout(() => {
      // Create success message
      const successMsg = document.createElement('div');
      successMsg.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #00d4ff 0%, #6366f1 100%);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 1rem;
          animation: slideIn 0.3s ease;
        ">
          <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
          Demo scheduled successfully! We'll contact you shortly.
        </div>
      `;
      
      const modalBody = document.querySelector('.modal-body');
      modalBody.insertBefore(successMsg, modalBody.firstChild);
      
      setTimeout(() => {
        this.closeModal();
        document.getElementById('demo-form').reset();
        successMsg.remove();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 2000);
    }, 1500);
  }
}

// Form Management
class FormManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupFormValidation();
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmission(new FormData(contactForm));
      });
    }
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    field.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: slideIn 0.2s ease;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  handleContactSubmission(formData) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate all fields
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      return;
    }
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate API call
    setTimeout(() => {
      // Create success message
      const successMsg = document.createElement('div');
      successMsg.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #00d4ff 0%, #6366f1 100%);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 1rem;
          animation: slideIn 0.3s ease;
        ">
          <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
          Message sent successfully! We'll get back to you within 24 hours.
        </div>
      `;
      
      const contactSection = document.querySelector('.contact-form');
      contactSection.insertBefore(successMsg, contactSection.firstChild);
      
      setTimeout(() => {
        document.getElementById('contact-form').reset();
        successMsg.remove();
      }, 3000);
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }, 2000);
  }
}

// Animation Management
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupHoverEffects();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .solution-item, .contact-item').forEach(el => {
      observer.observe(el);
    });
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-visual, .energy-grid');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach(el => {
        if (el) {
          el.style.transform = `translateY(${rate}px)`;
        }
      });
    });
  }

  setupHoverEffects() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .demo-button');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeScrollHandlers();
    this.preloadCriticalResources();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  optimizeScrollHandlers() {
    let ticking = false;
    
    function updateScrollPosition() {
      // Handle scroll-based animations here
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  preloadCriticalResources() {
    // Preload critical fonts and resources
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
}

// Utility Functions
class Utils {
  static formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const modalManager = new ModalManager();
  const formManager = new FormManager();
  const animationManager = new AnimationManager();
  const performanceManager = new PerformanceManager();

  // Add loading animation completion
  document.body.classList.add('loaded');
  
  // Add custom cursor effect for interactive elements
  const interactiveElements = document.querySelectorAll('button, a, .service-card, .theme-toggle');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'default';
    });
  });
  
  // Console welcome message
  console.log('%c🚀 AZR Holdings - Futuristic Energy Solutions', 
    'color: #00d4ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);');
  console.log('%c⚡ Website loaded successfully with advanced theme management!', 
    'color: #8b5cf6; font-size: 14px;');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    NavigationManager,
    ModalManager,
    FormManager,
    AnimationManager,
    PerformanceManager,
    Utils
  };
}