/**
 * KAPISH RAWAT - PORTFOLIO INTERACTIVITY SCRIPT
 * Modern Vanilla JS with Canvas Particles, Typing Effects, Modals, & Filters
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Background Particle & Constellation Canvas
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 35 : 70;
    const connectionDist = 120;
    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }

      draw(isLight) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(99, 102, 241, 0.45)' : 'rgba(56, 189, 248, 0.5)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isLight);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = 1 - dist / connectionDist;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(99, 102, 241, ${opacity * 0.18})`
              : `rgba(99, 102, 241, ${opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  }

  /* ==========================================================================
     2. Dynamic Text Typing Effect
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const words = [
      'BCA 1st Year Student',
      'Full-Stack Developer',
      'C / C++ Programmer',
      'Python & MySQL Builder',
      'UI/UX Design Enthusiast'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400; // Pause before new word
      }

      setTimeout(type, typingSpeed);
    }
    setTimeout(type, 800);
  }

  /* ==========================================================================
     3. Theme Switcher (Dark / Light)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('kr_theme') || 'dark';

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kr_theme', theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.className = 'fa-solid fa-moon';
          themeToggle.setAttribute('title', 'Switch to Dark Mode');
        } else {
          icon.className = 'fa-solid fa-sun';
          themeToggle.setAttribute('title', 'Switch to Light Mode');
        }
      }
    }
  }

  // Init theme
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode!`);
    });
  }

  /* ==========================================================================
     4. Sticky Header & ScrollSpy Navigation
     ========================================================================== */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Sticky header blur
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTop) {
      if (scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // ScrollSpy active link detection
    let currentId = '';
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 120;
      const sectionHeight = sec.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. Mobile Menu Toggle
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     6. Stats Number Counter Animation
     ========================================================================== */
  const statsElements = document.querySelectorAll('.stat-num');
  let animatedStats = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedStats) {
            animatedStats = true;
            statsElements.forEach((el) => countUp(el));
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  } else {
    statsElements.forEach((el) => countUp(el));
  }

  /* ==========================================================================
     7. Skills Progress Bars & Category Filter
     ========================================================================== */
  const progressFills = document.querySelectorAll('.progress-fill');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.getAttribute('data-width');
            fill.style.width = targetWidth;
          }
        });
      },
      { threshold: 0.2 }
    );
    progressFills.forEach((fill) => skillsObserver.observe(fill));
  } else {
    progressFills.forEach((fill) => {
      fill.style.width = fill.getAttribute('data-width');
    });
  }

  // Skills Filtering
  const skillFilters = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     8. Projects Category Filter & Modal Details
     ========================================================================== */
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Project Details Database (for rich modal views)
  const projectDatabase = {
    taskpulse: {
      title: 'TaskPulse - Productivity & Task Engine',
      category: 'Web App / Full-Stack',
      tags: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'REST API', 'LocalStorage'],
      description:
        'A comprehensive kanban and priority productivity management system. Built with modern modular JavaScript, featuring real-time task filtering, category grouping, drag-and-drop mechanics, priority badges, and persistent browser storage.',
      highlights: [
        'Interactive Drag-and-Drop Kanban interface (Todo, In Progress, Done)',
        'Local persistence engine with export/import backup capabilities',
        'Search and filter by priority tag (High, Medium, Low) and project category',
        'Productivity velocity charts and daily completion analytics'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    },
    novabank: {
      title: 'NovaBank - High-Performance C++ Financial Engine',
      category: 'Systems & Algorithms',
      tags: ['C++', 'OOP', 'STL', 'File Streams', 'Memory Optimization'],
      description:
        'A high-performance banking and ledger system built in modern C++. Employs Object-Oriented Principles, data structures, and binary file streams to guarantee data persistence and fast multi-account transactional processing.',
      highlights: [
        'Secure PIN authentication and encrypted transaction ledger logging',
        'Account management: Savings, Checking, and Investment portfolios with compound interest engines',
        'Binary file persistence ensuring zero data corruption during sudden shutdowns',
        'O(log N) lookup time utilizing balanced tree indexing'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    },
    weatherlens: {
      title: 'WeatherLens - Real-Time Meteorological Dashboard',
      category: 'Web Application',
      tags: ['HTML5', 'CSS3', 'JavaScript Fetch API', 'Glassmorphism UI'],
      description:
        'An elegant glassmorphic weather application connecting to live REST meteorological endpoints. Provides instantaneous localized weather forecasts, humidity levels, air quality index, and dynamic UI theme changes based on sunrise/sunset.',
      highlights: [
        'Live weather queries with automatic geolocation fallback',
        '5-Day dynamic weather forecast with interactive temperature graphs',
        'Sleek responsive glassmorphic cards with responsive CSS grid layout',
        'Graceful error handling for missing API keys or offline states'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    },
    smartstore: {
      title: 'SmartStore - Relational Inventory & Database Manager',
      category: 'Python & MySQL',
      tags: ['Python', 'MySQL', 'Relational Schema', 'CRUD Architecture'],
      description:
        'A robust enterprise inventory and sales management solution combining Python logic with a normalized MySQL database schema. Tracks product SKUs, stock thresholds, supplier catalogs, and automates low-stock notifications.',
      highlights: [
        'Full relational database schema designed with 3rd Normal Form (3NF)',
        'Automated alerts triggered when inventory drops below critical thresholds',
        'SQL stored procedures and triggers for audit logging and rapid query aggregation',
        'One-click CSV/PDF export of sales reports and inventory valuation'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    },
    algovisualizer: {
      title: 'AlgoVisualizer - Algorithm Sandbox & Memory Tracer',
      category: 'C & Web Sandbox',
      tags: ['C', 'JavaScript', 'HTML5 Canvas', 'Data Structures & Algorithms'],
      description:
        'An interactive educational visualizer crafted to demystify complex sorting and searching algorithms. Compares time and space complexities in real time with step-by-step memory pointer highlights.',
      highlights: [
        'Visualization of QuickSort, MergeSort, HeapSort, and Binary Search',
        'Color-coded states for Pointers, Pivots, Swaps, and Sorted partitions',
        'Speed slider and custom array input generator',
        'Direct side-by-side C vs JavaScript implementation code snippets'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    },
    portfolio: {
      title: 'Personal Developer Brand & Portfolio v1.0',
      category: 'Frontend & UI/UX',
      tags: ['HTML5', 'CSS3 Variables', 'Vanilla JavaScript', 'Canvas API'],
      description:
        'The very website you are exploring! Engineered from the ground up without heavy bulky frameworks, focusing on pristine performance, modern design aesthetics, accessibility, and fluid micro-animations.',
      highlights: [
        'Custom lightweight particle constellation engine on HTML5 Canvas',
        'Dark / Light theme switching with localStorage synchronization',
        'Accessible, semantic HTML structure with high Google Lighthouse performance',
        'Fully responsive layout tuned for all screen resolutions'
      ],
      github: 'https://github.com/kapishrawat',
      demo: '#'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-body');
  const projectDetailsButtons = document.querySelectorAll('.project-details-btn');

  projectDetailsButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectDatabase[projId];
      if (data && projectModal && projectModalContent) {
        projectModalContent.innerHTML = `
          <div style="margin-bottom: 1.5rem;">
            <span class="section-tag" style="margin-bottom: 0.6rem;">${data.category}</span>
            <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 0.8rem; color: var(--text-primary);">${data.title}</h2>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.2rem;">
              ${data.tags.map((t) => `<span class="stack-tag">${t}</span>`).join('')}
            </div>
          </div>
          <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">${data.description}</p>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.4rem; margin-bottom: 1.8rem;">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.8rem;">Key Architecture Highlights:</h4>
            <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
              ${data.highlights.map((h) => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.65rem 1.4rem; font-size: 0.9rem;">
              <i class="fa-brands fa-github"></i> View GitHub Repository
            </a>
            <button class="btn btn-secondary close-modal-action" style="padding: 0.65rem 1.4rem; font-size: 0.9rem;">
              Close Details
            </button>
          </div>
        `;
        projectModal.classList.add('active');

        // Close on action button click
        projectModalContent.querySelector('.close-modal-action').addEventListener('click', () => {
          projectModal.classList.remove('active');
        });
      }
    });
  });

  // Modal Closers
  const allModals = document.querySelectorAll('.modal-backdrop');
  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        modal.classList.remove('active');
      }
    });
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((m) => m.classList.remove('active'));
    }
  });

  /* ==========================================================================
     9. Resume Modal Preview Trigger
     ========================================================================== */
  const resumeTriggers = document.querySelectorAll('.open-resume-btn');
  const resumeModal = document.getElementById('resume-modal');

  resumeTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
      }
    });
  });

  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     10. 3D Tilt Effect on Hero Dev Card
     ========================================================================== */
  const heroCard = document.querySelector('.hero-card-3d');
  if (heroCard && window.innerWidth > 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ==========================================================================
     11. Contact Form, Validation, & Mock Storage
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-count');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCounter.textContent = `${currentLength} / 500`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Submit Button Loading State
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      // Simulate sending to server / saving locally
      setTimeout(() => {
        const contactMsg = {
          name,
          email,
          subject: subject || 'General Inquiry',
          message,
          timestamp: new Date().toISOString()
        };

        const existingMsgs = JSON.parse(localStorage.getItem('kr_messages') || '[]');
        existingMsgs.push(contactMsg);
        localStorage.setItem('kr_messages', JSON.stringify(existingMsgs));

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        showToast('Thank you, ' + name + '! Your message was received.');
      }, 1000);
    });
  }

  /* ==========================================================================
     12. One-Click Copy Email to Clipboard
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'kapishrawat.dev@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard!');
        });
      } else {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Email copied to clipboard!');
      }
    });
  }

  /* ==========================================================================
     13. Toast Notification Helper
     ========================================================================== */
  function showToast(message, type = 'info') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      toast = document.createElement('div');
      toast.className = 'toast';
      container.appendChild(toast);
      document.body.appendChild(container);
    }

    const icon =
      type === 'error'
        ? '<i class="fa-solid fa-circle-exclamation" style="color: var(--accent-rose);"></i>'
        : '<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  window.showToast = showToast;

  /* Dynamic Year in Footer */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
