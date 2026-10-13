/**
 * ====================================================================
 *  Shovan Mondal - Portfolio Interactive Scripts (script.js)
 *  Author: Shovan Mondal
 *  Description: Complete interactive logic including:
 *    - Spider web canvas physics simulation
 *    - Particles.js initialization
 *    - Dynamic typewriter animation
 *    - Animated statistic counters
 *    - 3D magnetic buttons & skill card tilt
 *    - Mobile navigation drawer & accessible toggles
 *    - Smooth scrolling with navbar offset & ScrollSpy
 *    - Social buttons ripple effect & keyboard support
 *    - Unified high-performance IntersectionObserver reveal animations
 *    - Accessible FAQ accordion
 *    - Interactive contact form with floating labels & status feedback
 *    - Smooth custom cursor with lerping trailing ring
 *    - Floating Back-to-Top button
 * ====================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================================
     1. SPIDER WEB CANVAS SIMULATION (About Section)
     ================================================================== */
  (function initSpiderWebCanvas() {
    const canvas = document.getElementById('spider-web-canvas');
    const aboutSection = document.getElementById('about');
    if (!canvas || !aboutSection) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let nodes = [];
    let mouse = { x: -9999, y: -9999 };
    let animationFrameId = null;
    let isSectionVisible = true;

    const NODE_COUNT = window.innerWidth < 768 ? 40 : 90;
    const MAX_DIST = 140;
    const REPEL_RADIUS = 120;
    const REPEL_STRENGTH = 4;

    function resize() {
      width = canvas.width = aboutSection.offsetWidth;
      height = canvas.height = aboutSection.offsetHeight;
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 2 + 1.2
        });
      }
    }

    function draw() {
      if (!isSectionVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Drift
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off canvas boundaries
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Repel from mouse cursor
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          n.x += (dx / dist) * force * REPEL_STRENGTH;
          n.y += (dy / dist) * force * REPEL_STRENGTH;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 225, 255, 0.75)';
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw web connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(160, 210, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      const rect = aboutSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        const rect = aboutSection.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }

    aboutSection.addEventListener('mousemove', onMouseMove);
    aboutSection.addEventListener('mouseleave', onMouseLeave);
    aboutSection.addEventListener('touchmove', onTouchMove, { passive: true });
    aboutSection.addEventListener('touchend', onMouseLeave);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        createNodes();
      }, 100);
    });

    // Pause canvas calculation when off screen to optimize performance
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionVisible = entry.isIntersecting;
        if (isSectionVisible && !animationFrameId) {
          draw();
        }
      });
    }, { threshold: 0.05 });
    visibilityObserver.observe(aboutSection);

    resize();
    createNodes();
    draw();
  })();


  /* ==================================================================
     2. PARTICLES.JS INTEGRATION
     ================================================================== */
  (function initParticles() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particlesContainer = document.getElementById('particles-js');

    if (!isMobile && particlesContainer && typeof particlesJS === 'function') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 70, density: { enable: true, value_area: 800 } },
          color: { value: '#00aaff' },
          shape: { type: 'circle' },
          opacity: { value: 0.45, random: true },
          size: { value: 2.8, random: true },
          line_linked: {
            enable: true,
            distance: 140,
            color: '#0077cc',
            opacity: 0.28,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.8,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out'
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' }
          },
          modes: {
            repulse: { distance: 90, duration: 0.4 },
            push: { particles_nb: 3 }
          }
        },
        retina_detect: true
      });
    }
  })();


  /* ==================================================================
     3. DYNAMIC TYPEWRITER ANIMATION
     ================================================================== */
  (function initTypewriter() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const professions = [
      'Web Developer & Problem Solver',
      'Full-Stack Engineer',
      'UI/UX & Frontend Developer',
      'Competitive Programmer'
    ];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentProfession = professions[professionIndex];

      if (isDeleting) {
        typingText.textContent = currentProfession.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingText.textContent = currentProfession.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentProfession.length) {
        isDeleting = true;
        setTimeout(type, 1600);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        professionIndex = (professionIndex + 1) % professions.length;
        setTimeout(type, 450);
      } else {
        const speed = isDeleting ? 45 : 120;
        setTimeout(type, speed);
      }
    }

    setTimeout(type, 800);
  })();


  /* ==================================================================
     4. ANIMATED STATISTIC COUNTERS
     ================================================================== */
  (function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const aboutSection = document.getElementById('about');
    if (!statNumbers.length || !aboutSection) return;

    let animated = false;

    function animateNumbers() {
      if (animated) return;
      animated = true;

      statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target')) || 0;
        const duration = 1800; // ms
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        let current = 0;
        let frame = 0;

        const counterTimer = setInterval(() => {
          frame++;
          current += increment;
          if (frame >= totalFrames || current >= target) {
            stat.textContent = target;
            clearInterval(counterTimer);
          } else {
            stat.textContent = Math.floor(current);
          }
        }, frameDuration);
      });
    }

    // Ensure about section has visible class
    aboutSection.classList.add('visible');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animateNumbers();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(aboutSection);

    // If section is already within viewport on page load, trigger counter animation immediately
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateNumbers();
    }
  })();


  /* ==================================================================
     5. 3D MAGNETIC BUTTON EFFECT
     ================================================================== */
  (function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 8;
        const angleY = -(x - centerX) / 8;

        button.style.transform = `perspective(600px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-2px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  })();


  /* ==================================================================
     6. MOBILE NAVIGATION DRAWER & ACCESSIBLE TOGGLES
     ================================================================== */
  /* ==================================================================
     6. MOBILE NAVIGATION DRAWER, DROPDOWN & NAVBAR SCROLL
     ================================================================== */
  (function initNavbarControls() {
    const nav = document.querySelector('nav') || document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const dropdown = document.getElementById('navDropdown');
    const dropdownToggle = dropdown ? dropdown.querySelector('.dropdown-toggle') : null;

    // Navbar compact/glow state on scroll
    window.addEventListener('scroll', () => {
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }
    }, { passive: true });

    // Handle 'More' dropdown toggle
    if (dropdown && dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (!nav || !toggle) return;

    function closeNav() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (dropdown) {
        dropdown.classList.remove('open');
      }
    }

    function toggleNav() {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', isOpen);
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Close nav when clicking any link
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && nav.classList.contains('open')) {
        closeNav();
      }
    });

    // Close when clicking outside nav
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target)) {
        closeNav();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (nav.classList.contains('open')) closeNav();
        if (dropdown) {
          dropdown.classList.remove('open');
          if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  })();


  /* ==================================================================
     7. SMOOTH SCROLLING & ACTIVE LINK SCROLLSPY
     ================================================================== */
  (function initScrollSpy() {
    const nav = document.querySelector('nav') || document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const dropdown = document.getElementById('navDropdown');
    const dropdownToggle = dropdown ? dropdown.querySelector('.dropdown-toggle') : null;
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
      .map(a => {
        const href = a.getAttribute('href');
        return href && href.startsWith('#') && href.length > 1 ? document.querySelector(href) : null;
      })
      .filter((sec, idx, self) => sec && self.indexOf(sec) === idx);

    // Smooth scroll on link click with dynamic navbar offset
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight = nav ? nav.getBoundingClientRect().height : 70;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 6;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      });
    });

    // Highlight active section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          let dropdownActive = false;

          navLinks.forEach(a => {
            const isMatch = a.getAttribute('href') === `#${currentId}`;
            a.classList.toggle('active', isMatch);
            if (isMatch && a.classList.contains('dropdown-link')) {
              dropdownActive = true;
            }
          });

          if (dropdownToggle) {
            dropdownToggle.classList.toggle('active', dropdownActive);
          }
        }
      });
    }, {
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s));
  })();


  /* ==================================================================
     8. SOCIAL LINKS RIPPLE EFFECT & KEYBOARD SUPPORT
     ================================================================== */
  (function initSocialRipple() {
    function createRipple(e, el) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'social-ripple';

      const x = (e.clientX !== undefined ? e.clientX : (rect.left + rect.width / 2)) - rect.left;
      const y = (e.clientY !== undefined ? e.clientY : (rect.top + rect.height / 2)) - rect.top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      el.appendChild(ripple);

      // Force reflow and activate animation
      window.getComputedStyle(ripple).opacity;
      ripple.classList.add('visible');

      setTimeout(() => {
        ripple.remove();
      }, 520);
    }

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(el => {
      el.addEventListener('pointerdown', (ev) => createRipple(ev, el));
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          createRipple({
            clientX: el.getBoundingClientRect().left + el.offsetWidth / 2,
            clientY: el.getBoundingClientRect().top + el.offsetHeight / 2
          }, el);
        }
      });
    });
  })();


  /* ==================================================================
     9. UNIFIED SCROLL-REVEAL & STAGGERED ENTRANCES
     ================================================================== */
  (function initScrollReveals() {
    // Reveal elements with .in-view
    const revealEls = document.querySelectorAll('.reveal');
    const headings = document.querySelectorAll(
      '.experience-title, .skills-title, .education-title, ' +
      '.achievements-title, .publications-title, .faq-title, .section-title, .contact-title'
    );
    const cardItems = document.querySelectorAll(
      '.certification-card, .testimonial-card, .blog-post-card, ' +
      '.achievement-card, .publication-card, .project-card, .skill-card'
    );
    const timelineItems = document.querySelectorAll('.experience-item, .timeline-item');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactElements = document.querySelectorAll('.info-item, .contact-form, .contact-info-card');

    function createBatchObserver(elements, activeClass, threshold = 0.12) {
      if (!elements || !elements.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClass);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold });

      elements.forEach(el => obs.observe(el));
    }

    createBatchObserver(revealEls, 'in-view', 0.1);
    createBatchObserver(headings, 'in-view', 0.2);
    createBatchObserver(cardItems, 'in-view', 0.1);
    createBatchObserver(cardItems, 'visible', 0.1);
    createBatchObserver(timelineItems, 'visible', 0.1);
    createBatchObserver(faqItems, 'visible', 0.12);

    // Stagger animation delays for cards
    function applyStagger(selector, step = 0.1) {
      const items = document.querySelectorAll(selector);
      items.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 5) * step}s`;
      });
    }

    applyStagger('.certification-card', 0.12);
    applyStagger('.testimonial-card', 0.14);
    applyStagger('.blog-post-card', 0.12);
    applyStagger('.project-card', 0.1);

    // Contact items entrance transition
    if (contactElements.length) {
      const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            contactObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      contactElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;
        contactObserver.observe(el);
      });
    }
  })();


  /* ==================================================================
     10. ACCESSIBLE FAQ ACCORDION
     ================================================================== */
  (function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();


  /* ==================================================================
     11. INTERACTIVE CONTACT FORM & STATUS FEEDBACK
     ================================================================== */
  (function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Floating label check on existing values
    const formGroups = document.querySelectorAll('.form-group.floating');
    formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      if (!input || !label) return;

      function updateLabelState() {
        if (input.value && input.value.trim() !== '') {
          label.style.top = '-20px';
          label.style.fontSize = '0.8rem';
          label.style.color = '#00aaff';
        } else if (document.activeElement !== input) {
          label.style.top = '';
          label.style.fontSize = '';
          label.style.color = '';
        }
      }

      input.addEventListener('focus', () => {
        label.style.top = '-20px';
        label.style.fontSize = '0.8rem';
        label.style.color = '#00aaff';
      });

      input.addEventListener('blur', updateLabelState);
      input.addEventListener('input', updateLabelState);
      updateLabelState();
    });

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (formSuccess) formSuccess.style.display = 'none';
      if (formError) formError.style.display = 'none';

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('span');
        if (btnText) btnText.textContent = 'SENDING...';
        const icon = submitBtn.querySelector('.submit-icon');
        if (icon) icon.style.opacity = '0';
      }

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const payload = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        message: messageInput ? messageInput.value.trim() : ''
      };

      try {
        // Simulated network request (replace with actual backend endpoint if desired)
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({ ok: true, status: 200, message: 'Message sent successfully!' });
          }, 1200);
        });

        if (response.ok) {
          if (formSuccess) formSuccess.style.display = 'flex';
          contactForm.reset();
          // Reset floating labels
          formGroups.forEach(g => {
            const l = g.querySelector('label');
            if (l) {
              l.style.top = '';
              l.style.fontSize = '';
              l.style.color = '';
            }
          });
        } else {
          if (formError) formError.style.display = 'flex';
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        if (formError) formError.style.display = 'flex';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('span');
          if (btnText) btnText.textContent = 'SEND MESSAGE';
          const icon = submitBtn.querySelector('.submit-icon');
          if (icon) icon.style.opacity = '1';
        }

        // Auto-dismiss notification after 5 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.style.display = 'none';
          if (formError) formError.style.display = 'none';
        }, 5000);
      }
    });
  })();


  /* ==================================================================
     12. CUSTOM SMOOTH LERPING CURSOR
     ================================================================== */
  (function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // Only run custom cursor on non-touch devices with fine pointers
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let cursorActive = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorActive) {
        cursorActive = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Dot follows immediately
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Ring lags behind with smooth interpolation (lerp)
    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect over interactive elements
    const interactives = 'a, button, input, textarea, select, label, .skill-card, .project-card, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Window leave & enter detection
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (cursorActive) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });
  })();


  /* ==================================================================
     13. FLOATING BACK-TO-TOP BUTTON
     ================================================================== */
  (function initBackToTop() {
    let backToTopBtn = document.getElementById('back-to-top');

    // Dynamically create button if not present in HTML
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'back-to-top';
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.setAttribute('aria-label', 'Back to top');
      backToTopBtn.setAttribute('title', 'Back to top');
      backToTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  })();


  /* ==================================================================
     14. SKILL CARD 3D TILT MICRO-INTERACTIONS
     ================================================================== */
  (function initSkillCardTilt() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -5;
        const tiltY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();


  /* ==================================================================
     14.5. CYBERPUNK WORKSPACE INTERACTION (Laptop & Coffee Cup)
     ================================================================== */
  (function initCyberWorkspace() {
    const stage = document.getElementById('cyberWorkspace');
    const coffeeUnit = document.getElementById('coffeeUnit');
    const coffeeToast = document.getElementById('coffeeToast');

    const laptopUnit = document.getElementById('laptopUnit');

    if (!stage) return;

    // 3D Mouse Parallax Tilt
    let isHovering = false;
    stage.addEventListener('mouseenter', () => { isHovering = true; });

    stage.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const tiltX = -y * 14;
      const tiltY = x * 14;

      stage.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    stage.addEventListener('mouseleave', () => {
      isHovering = false;
      stage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });

    // Coffee Cup Click Interaction
    if (coffeeUnit && coffeeToast) {
      coffeeUnit.addEventListener('click', () => {
        coffeeUnit.classList.add('caffeine-burst');
        coffeeToast.classList.add('show-toast');

        // Laptop cyber boost glow
        if (laptopUnit) {
          laptopUnit.style.filter = 'drop-shadow(0 0 25px rgba(0, 245, 160, 0.7))';
          setTimeout(() => {
            laptopUnit.style.filter = '';
          }, 1500);
        }

        setTimeout(() => {
          coffeeUnit.classList.remove('caffeine-burst');
          coffeeToast.classList.remove('show-toast');
        }, 1800);
      });
    }
  })();


  /* ==================================================================
     15. CONSOLE BRANDING & WELCOME
     ================================================================== */
  console.log(
    '%c Shovan Mondal - Web Portfolio %c Loaded Successfully 🚀 ',
    'background: #0077cc; color: #ffffff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #00aaff; color: #0a0a14; padding: 4px 8px; border-radius: 0 4px 4px 0; font-weight: bold;'
  );

});
