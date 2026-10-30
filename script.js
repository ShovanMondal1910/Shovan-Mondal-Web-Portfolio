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
      'Full-Stack Software Engineer',
      'Web Architect & Problem Solver',
      'React & Node.js Specialist',
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
      '.cert-card, .certification-card, .testimonial-card, .blog-card, .blog-post-card, ' +
      '.achievement-card, .publication-card, .project-card, .skill-card, .edu-card, .volunteer-card, .contact-card'
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

    applyStagger('.edu-card', 0.12);
    applyStagger('.cert-card', 0.12);
    applyStagger('.certification-card', 0.12);
    applyStagger('.testimonial-card', 0.14);
    applyStagger('.blog-card', 0.12);
    applyStagger('.blog-post-card', 0.12);
    applyStagger('.project-card', 0.1);
    applyStagger('.volunteer-card', 0.12);
    applyStagger('.achievement-card', 0.12);
    applyStagger('.publication-card', 0.14);
    applyStagger('.faq-item', 0.08);
    applyStagger('.contact-card', 0.14);

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
     11.5. ONE-CLICK CLIPBOARD COPY FOR CONTACT CHANNELS
     ================================================================== */
  (function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-action-btn');
    if (!copyBtns.length) return;

    copyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const copyText = btn.getAttribute('data-copy-text');
        if (!copyText) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(copyText);
          } else {
            const tempInput = document.createElement('textarea');
            tempInput.value = copyText;
            tempInput.style.position = 'fixed';
            tempInput.style.left = '-9999px';
            tempInput.style.top = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }

          btn.classList.add('copied');
          const tooltip = btn.querySelector('.copy-tooltip');
          const originalText = tooltip ? tooltip.textContent : 'Copy';
          if (tooltip) tooltip.textContent = 'Copied!';

          setTimeout(() => {
            btn.classList.remove('copied');
            if (tooltip) tooltip.textContent = originalText;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
      });
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
    const interactives = 'a, button, input, textarea, select, label, .skill-card, .skill-circle-card, .project-card, [role="button"], .cert-preview-trigger, .cert-modal-close, .cert-modal-btn, .cert-modal-backdrop, .blog-modal-close, .blog-modal-done-btn, .blog-modal-backdrop, .copy-action-btn, .social-link';
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

    const footerBackToTop = document.getElementById('footerBackToTop');
    if (footerBackToTop) {
      footerBackToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  })();


  /* ==================================================================
     14. SKILL CARD 3D TILT MICRO-INTERACTIONS
     ================================================================== */
  (function initSkillCardTilt() {
    const cards = document.querySelectorAll('.skill-card, .skill-circle-card, .cert-card');

    cards.forEach(card => {
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
    const laptopToast = document.getElementById('laptopToast');

    if (!stage) return;

    // 3D Mouse Parallax Tilt
    let isHovering = false;
    stage.addEventListener('mouseenter', () => { isHovering = true; });

    stage.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = -y * 12;
      const tiltY = x * 12;

      stage.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    stage.addEventListener('mouseleave', () => {
      isHovering = false;
      stage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });

    let boostTimer = null;

    function triggerCoffeeBoost() {
      if (coffeeUnit) {
        coffeeUnit.classList.remove('caffeine-burst');
        void coffeeUnit.offsetWidth; // re-flow
        coffeeUnit.classList.add('caffeine-burst');
      }
      if (coffeeToast) {
        coffeeToast.classList.add('show-toast');
      }

      if (laptopUnit) {
        laptopUnit.classList.remove('laptop-supercharged');
        void laptopUnit.offsetWidth; // re-flow
        laptopUnit.classList.add('laptop-supercharged');
      }
      if (laptopToast) {
        laptopToast.classList.add('show-toast');
      }

      clearTimeout(boostTimer);
      boostTimer = setTimeout(() => {
        if (coffeeUnit) coffeeUnit.classList.remove('caffeine-burst');
        if (coffeeToast) coffeeToast.classList.remove('show-toast');
        if (laptopUnit) laptopUnit.classList.remove('laptop-supercharged');
        if (laptopToast) laptopToast.classList.remove('show-toast');
      }, 2000);
    }

    function triggerLaptopBoost() {
      if (laptopUnit) {
        laptopUnit.classList.remove('laptop-supercharged');
        void laptopUnit.offsetWidth;
        laptopUnit.classList.add('laptop-supercharged');
      }
      if (laptopToast) {
        laptopToast.classList.add('show-toast');
      }

      clearTimeout(boostTimer);
      boostTimer = setTimeout(() => {
        if (laptopUnit) laptopUnit.classList.remove('laptop-supercharged');
        if (laptopToast) laptopToast.classList.remove('show-toast');
      }, 1800);
    }

    if (coffeeUnit) {
      coffeeUnit.addEventListener('click', triggerCoffeeBoost);
      coffeeUnit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerCoffeeBoost();
        }
      });
    }

    if (laptopUnit) {
      laptopUnit.addEventListener('click', triggerLaptopBoost);
      laptopUnit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerLaptopBoost();
        }
      });
    }
  })();

  /* ==================================================================
     14.8. TECHNICAL SKILLS CATEGORY FILTER
     ================================================================== */
  (function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter-btn');
    const cards = document.querySelectorAll('.skills-grid .skill-card');
    const languagesStream = document.getElementById('languagesStreamSection');
    const frameworksStream = document.getElementById('frameworksStreamSection');
    const toolsStream = document.getElementById('toolsStreamSection');
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Toggle circular streams visibility across the 3 stream tiers
        if (languagesStream) {
          languagesStream.style.display = (filter === 'all' || filter === 'languages') ? 'block' : 'none';
        }

        if (frameworksStream) {
          frameworksStream.style.display = (filter === 'all' || filter === 'frontend' || filter === 'backend') ? 'block' : 'none';
        }

        if (toolsStream) {
          toolsStream.style.display = (filter === 'all' || filter === 'databases' || filter === 'tools') ? 'block' : 'none';
        }

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  })();


  /* ==================================================================
     14.9. PROJECTS CATEGORY FILTER
     ================================================================== */
  (function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            requestAnimationFrame(() => {
              card.classList.add('in-view');
            });
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  })();


  /* ==================================================================
     14.10. PROJECTS MOBILE EXPAND TOGGLE
     ================================================================== */
  (function initProjectsMobileToggle() {
    const caseHints = document.querySelectorAll('.project-case-hint');
    if (!caseHints.length) return;

    caseHints.forEach(hint => {
      hint.addEventListener('click', () => {
        const card = hint.closest('.project-card');
        if (card) {
          card.classList.toggle('is-expanded');
        }
      });
    });
  })();


  /* ==================================================================
     14.11. CERTIFICATIONS CATEGORY FILTER
     ================================================================== */
  (function initCertificationsFilter() {
    const filterButtons = document.querySelectorAll('.cert-filter-btn');
    const cards = document.querySelectorAll('.cert-card[data-category]');
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            requestAnimationFrame(() => {
              card.classList.add('in-view');
            });
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  })();


  /* ==================================================================
     14.12. CERTIFICATE LIGHTBOX MODAL PREVIEW
     ================================================================== */
  (function initCertModal() {
    const modal = document.getElementById('certModal');
    const modalClose = document.getElementById('certModalClose');
    const modalBackdrop = document.getElementById('certModalBackdrop');
    const modalImg = document.getElementById('certModalImg');
    const modalPdf = document.getElementById('certModalPdf');
    const modalOrg = document.getElementById('certModalOrg');
    const modalHeading = document.getElementById('certModalHeading');
    const modalDate = document.getElementById('certModalDate');
    const modalFullscreenBtn = document.getElementById('certModalFullscreenBtn');

    if (!modal) return;

    function openModal(trigger) {
      const src = trigger.getAttribute('data-cert-src');
      const type = trigger.getAttribute('data-cert-type') || 'image';
      const title = trigger.getAttribute('data-cert-title') || 'Certificate';
      const issuer = trigger.getAttribute('data-cert-issuer') || 'Verified Credential';
      const date = trigger.getAttribute('data-cert-date') || '';

      if (modalOrg) modalOrg.textContent = issuer;
      if (modalHeading) modalHeading.textContent = title;
      if (modalDate) modalDate.textContent = date;
      if (modalFullscreenBtn) modalFullscreenBtn.href = src;

      if (type === 'pdf') {
        if (modalImg) {
          modalImg.classList.remove('active');
          modalImg.src = '';
        }
        if (modalPdf) {
          modalPdf.src = src;
          modalPdf.classList.add('active');
        }
      } else {
        if (modalPdf) {
          modalPdf.classList.remove('active');
          modalPdf.src = '';
        }
        if (modalImg) {
          modalImg.src = src;
          modalImg.classList.add('active');
        }
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');

      // Ensure custom pointer dot and ring remain fully visible over modal
      const dot = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        if (modalImg) modalImg.src = '';
        if (modalPdf) modalPdf.src = '';
      }, 300);
    }

    // Attach click listeners to all preview triggers (buttons and thumbnail banners)
    const triggers = document.querySelectorAll('.cert-preview-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(trigger);
      });
      // Keyboard accessible
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(trigger);
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  })();


  /* ==================================================================
     14.13. BLOG & ARTICLES CATEGORY FILTER
     ================================================================== */
  (function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const cards = document.querySelectorAll('.blog-card[data-category]');
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            requestAnimationFrame(() => {
              card.classList.add('in-view');
            });
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  })();


  /* ==================================================================
     14.14. BLOG ARTICLE READER MODAL (FULL ARTICLES CONTENT)
     ================================================================== */
  (function initBlogModal() {
    const modal = document.getElementById('blogModal');
    const modalClose = document.getElementById('blogModalClose');
    const modalDoneBtn = document.getElementById('blogModalDoneBtn');
    const modalBackdrop = document.getElementById('blogModalBackdrop');
    const modalCategory = document.getElementById('blogModalCategory');
    const modalDate = document.getElementById('blogModalDate');
    const modalTime = document.getElementById('blogModalTime');
    const modalTitle = document.getElementById('blogModalTitle');
    const modalBody = document.getElementById('blogModalBody');
    const modalTags = document.getElementById('blogModalTags');

    if (!modal) return;

    // Comprehensive Technical Article Database
    const articlesData = {
      'art-1': {
        category: 'Frontend Architecture',
        date: 'October 2024',
        time: '6 min read',
        title: 'Mastering Responsive UI with Fluid Typography & Modern CSS Grid',
        tags: ['CSS Grid', 'Fluid Typography', 'clamp()', 'Subgrid', 'UI Architecture', 'Responsive Design'],
        body: `
          <p>For years, responsive web design revolved entirely around fixed breakpoints (<code>@media (min-width: 768px)</code>, <code>1024px</code>, <code>1280px</code>). As device aspect ratios proliferated from compact smart devices to ultra-wide 4K monitors, this breakpoint-heavy approach spawned fragile stylesheets characterized by abrupt visual jumps, jarring reflows, and endless media query overrides.</p>
          
          <h3>The Power of Mathematical Fluid Typography</h3>
          <p>Modern CSS allows us to treat typography and spatial padding as continuous mathematical gradients rather than stepped discrete values. The key lies in leveraging <code>clamp(MIN, VAL, MAX)</code>:</p>

          <pre class="blog-code-block"><code>/* Seamless fluid scaling without a single breakpoint */
:root {
  --fluid-min-width: 360;
  --fluid-max-width: 1440;
  
  --fluid-h1-min: 2rem;
  --fluid-h1-max: 3.5rem;
  
  /* Dynamic slope calculation: y = mx + b */
  --h1-title: clamp(
    2rem,
    1.45rem + 2.45vw,
    3.5rem
  );
}</code></pre>

          <p>This formulation ensures text seamlessly tracks viewport expansion smoothly across every single pixel, maintaining optimal typographic line lengths (45–75 characters per line) and completely eliminating Cumulative Layout Shift (CLS) on device orientation changes.</p>

          <h3>Replacing Fragile Flex Wrappers with CSS Grid <code>auto-fit</code></h3>
          <p>Instead of manually computing percentage widths and margins for grid cards across 4 different breakpoints, CSS Grid's <code>minmax()</code> with <code>auto-fit</code> lets the browser calculate layout geometry natively:</p>

          <pre class="blog-code-block"><code>.card-container {
  display: grid;
  /* Self-organizing responsive columns without media queries */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}</code></pre>

          <blockquote>
            <strong>Key Engineering Takeaway:</strong> Declarative CSS mathematics shifts viewport computation directly into browser layout engines, reducing stylesheet size by up to 40% and providing a buttery-smooth viewing experience across all screen factors.
          </blockquote>
        `
      },
      'art-2': {
        category: 'Systems & Backend',
        date: 'September 2024',
        time: '8 min read',
        title: 'File I/O vs. Relational Databases: Performance Benchmarks in Java',
        tags: ['Java', 'NIO.2', 'JDBC', 'MySQL', 'Benchmarking', 'Systems Performance'],
        body: `
          <p>When engineering high-throughput backend applications, choosing the right persistence mechanism is critical. In this benchmark experiment, we set out to analyze the latency, disk usage, and throughput profiles of standard Java File I/O (buffered streams and memory-mapped files) versus relational database storage via MySQL/JDBC when processing 1,000,000 operational records.</p>
          
          <h3>Experimental Setup & Benchmarking Methodology</h3>
          <p>We evaluated three distinct ingestion strategies using Java 17 and OpenJDK JMH (Java Microbenchmark Harness) running on NVMe PCIe Gen4 SSDs:</p>
          <ul>
            <li><strong>Strategy A:</strong> Standard <code>BufferedWriter</code> with serialized text output (Append-only log).</li>
            <li><strong>Strategy B:</strong> Java NIO.2 <code>FileChannel</code> with <code>MappedByteBuffer</code> directly memory-mapping OS kernel pages.</li>
            <li><strong>Strategy C:</strong> MySQL 8.0 InnoDB through JDBC utilizing connection pooling (HikariCP) and multi-row batched prepared statements.</li>
          </ul>

          <pre class="blog-code-block"><code>// High-performance Java NIO.2 Memory-Mapped File write
try (FileChannel channel = FileChannel.open(path, 
        StandardOpenOption.READ, 
        StandardOpenOption.WRITE, 
        StandardOpenOption.CREATE)) {
    
    MappedByteBuffer buffer = channel.map(
        FileChannel.MapMode.READ_WRITE, 0, BUFFER_SIZE);
    
    for (Record record : batchRecords) {
        buffer.putLong(record.getId());
        buffer.putDouble(record.getValue());
        buffer.put(record.getFlags());
    }
}</code></pre>

          <h3>Benchmark Findings & Latency Distribution</h3>
          <ul>
            <li><strong>Sequential Ingestion:</strong> NIO.2 Memory-Mapped files achieved a staggering <strong>820,000 records/sec</strong>, compared to 145,000 records/sec for buffered streams and 48,000 records/sec for batched JDBC insertions.</li>
            <li><strong>Random Lookups:</strong> When querying non-sequential entries, MySQL B-Tree indexing dominated, executing indexed queries in <strong>0.8ms</strong> versus full linear scans required by raw binary files.</li>
            <li><strong>Memory Overhead:</strong> Memory-mapped buffers leverage kernel page caching, resulting in negligible garbage collection pressure compared to ORM object instantiation.</li>
          </ul>

          <blockquote>
            <strong>Architectural Verdict:</strong> For high-frequency append-only event streams (such as telemetry, audit logs, or financial tickers), NIO.2 memory-mapped flat files provide orders of magnitude higher throughput. For structured relational data requiring ACID transactions and ad-hoc filtered retrieval, relational engines remain indispensable.
          </blockquote>
        `
      },
      'art-3': {
        category: 'Algorithms & Logic',
        date: 'August 2024',
        time: '10 min read',
        title: 'Demystifying Dynamic Programming: From Recursion Tree to Tabulation',
        tags: ['Dynamic Programming', 'Memoization', 'Tabulation', 'Algorithms', 'Big-O Analysis', 'Problem Solving'],
        body: `
          <p>Dynamic Programming (DP) is frequently cited by computer science students and engineers as one of the most challenging algorithmic concepts. However, DP is not a mystical technique—it is simply careful recursion combined with systematic state caching to eliminate redundant subproblem computation.</p>
          
          <h3>The Core Principles: When to Apply DP</h3>
          <p>Any computational problem is a candidate for Dynamic Programming if and only if it exhibits two properties:</p>
          <ol>
            <li><strong>Optimal Substructure:</strong> The optimal solution to the global problem can be constructed from optimal solutions to its constituent subproblems.</li>
            <li><strong>Overlapping Subproblems:</strong> The recursive tree repeatedly evaluates identical states with identical parameters.</li>
          </ol>

          <h3>Evolution of a Solution: The 3-Stage Workflow</h3>
          <p>Rather than jumping directly to an intricate 2D table, seasoned problem solvers follow a systematic 3-step evolutionary path:</p>

          <pre class="blog-code-block"><code>// Step 1: Naive Recursion — O(2^n) exponential time
int fib(int n) {
    if (n &lt;= 1) return n;
    return fib(n - 1) + fib(n - 2); // Recalculates same subtrees
}

// Step 2: Top-Down Memoization — O(n) time, O(n) call stack + memo
int fibMemo(int n, int[] memo) {
    if (n &lt;= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

// Step 3: Bottom-Up Tabulation with O(1) Space Optimization
int fibOptimal(int n) {
    if (n &lt;= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i &lt;= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}</code></pre>

          <blockquote>
            <strong>Key Problem-Solving Mental Model:</strong> Always draw the recursive state decision tree first. Identify the minimal state variables that define a subproblem. Once memoization is verified, invert the evaluation order to build a bottom-up table, then look for opportunities to roll space forward.
          </blockquote>
        `
      },
      'art-4': {
        category: 'Full-Stack Engineering',
        date: 'July 2024',
        time: '7 min read',
        title: 'Architecting Scalable REST APIs with Node.js, Express & MongoDB',
        tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API', 'Scalability', 'JWT'],
        body: `
          <p>Building a prototype REST API with Express and MongoDB takes less than an hour. However, evolving that prototype into a resilient, production-grade microservice capable of sustaining thousands of concurrent requests requires rigorous architectural discipline.</p>
          
          <h3>Layered Architectural Separation of Concerns</h3>
          <p>Tightly coupling route definitions, database queries, and business logic into monolithic controller files creates an unmaintainable codebase. In high-scale services, we enforce strict boundary separation:</p>
          <ul>
            <li><strong>Routes Layer:</strong> Declares endpoints, attaches authentication guards, and binds schema validators.</li>
            <li><strong>Controller Layer:</strong> Parses HTTP requests, extracts parameters, and translates service outputs into standard JSON payloads.</li>
            <li><strong>Service Layer:</strong> Pure business logic, authorization policies, and cross-model orchestration.</li>
            <li><strong>Repository / Model Layer:</strong> Optimized database interactions, Mongoose schema hooks, and aggregation pipelines.</li>
          </ul>

          <pre class="blog-code-block"><code>// Centralized Async Error Boundary Middleware
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// High-throughput query execution with lean projections
const listActiveProducts = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, category } = req.query;
  
  const query = { status: 'published' };
  if (category) query.category = category;

  // .lean() skips heavyweight Mongoose document hydration
  const products = await Product.find(query)
    .select('name price slug thumbnail rating')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean()
    .exec();

  res.status(200).json({ success: true, count: products.length, data: products });
});</code></pre>

          <h3>Critical Performance Optimizations for MongoDB</h3>
          <p>Two simple architectural choices can yield 10x throughput improvements under heavy load:</p>
          <ol>
            <li><strong>Using <code>.lean()</code> for Read Operations:</strong> By instructing Mongoose to bypass the creation of virtual getters, setters, and change-tracking metadata, JSON serialization throughput triples.</li>
            <li><strong>Targeted Compound Indexes:</strong> Creating indexes matching the exact equality, sort, and range queries (ESR rule) transforms table-scans into near-instantaneous index seeks.</li>
          </ol>

          <blockquote>
            <strong>Production Rule:</strong> Combine stateless JWT auth with rate limiting (express-rate-limit) and Redis caching for read-heavy routes to ensure graceful scaling without overloading the primary MongoDB cluster.
          </blockquote>
        `
      }
    };

    function openArticleModal(articleId) {
      const data = articlesData[articleId];
      if (!data) return;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalDate) modalDate.textContent = data.date;
      if (modalTime) modalTime.textContent = data.time;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBody) modalBody.innerHTML = data.body;

      if (modalTags) {
        modalTags.innerHTML = '';
        data.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'blog-tag';
          span.textContent = tag;
          modalTags.appendChild(span);
        });
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');

      // Ensure custom pointer dot and ring remain fully visible over modal
      const dot = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    }

    function closeArticleModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }

    // Attach click listeners to all article triggers
    const triggers = document.querySelectorAll('.blog-modal-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = trigger.getAttribute('data-article-id');
        openArticleModal(articleId);
      });
      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const articleId = trigger.getAttribute('data-article-id');
          openArticleModal(articleId);
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeArticleModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeArticleModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeArticleModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeArticleModal();
      }
    });
  })();


  /* ==================================================================
     15. VOLUNTEER WORK & CONTRIBUTIONS CATEGORY FILTER
     ================================================================== */
  (function initVolunteerFilter() {
    const filterBtns = document.querySelectorAll('.volunteer-filter-btn');
    const cards = document.querySelectorAll('.volunteer-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetFilter = btn.getAttribute('data-filter') || 'all';

        // Update active class on filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (targetFilter === 'all' || category === targetFilter) {
            card.classList.remove('is-hidden');
            // Re-trigger reveal animation smoothly
            requestAnimationFrame(() => {
              card.classList.add('in-view');
            });
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  })();


  /* ==================================================================
     16. FOOTER BACK-TO-TOP SMOOTH SCROLL
     ================================================================== */
  (function initFooterBackToTop() {
    const backToTopBtn = document.getElementById('footerBackToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  })();



  /* ==================================================================
     17. DIRECT CHANNELS & PROFILES SCROLL & HIGHLIGHT
     ================================================================== */
  (function initDirectChannelsScroll() {
    const channelCard = document.getElementById('contact-channels');
    if (!channelCard) return;

    // Contact triggers: "Contact Me" and "Let's Talk" buttons across hero and navbar
    const contactTriggers = document.querySelectorAll(
      '.nav-cta-btn, .btn-hero-contact, a[href="#contact"], a[href="#contact-channels"]'
    );

    function scrollToChannels(e) {
      // Don't intercept clicks that originate from inside the card itself (like copy buttons)
      if (channelCard.contains(e.target)) return;

      e.preventDefault();

      // Close mobile navigation drawer if open
      const nav = document.querySelector('nav') || document.querySelector('.navbar');
      const toggle = document.querySelector('.nav-toggle');
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      // Calculate scroll target positioning with navbar offset
      const navHeight = nav ? nav.getBoundingClientRect().height : 80;
      const cardRect = channelCard.getBoundingClientRect();
      const targetTop = cardRect.top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      // Highlight the "DIRECT CHANNELS & PROFILES" card with a glowing pulse
      channelCard.classList.remove('channels-focused');
      void channelCard.offsetWidth; // force reflow
      channelCard.classList.add('channels-focused');

      setTimeout(() => {
        channelCard.classList.remove('channels-focused');
      }, 2600);
    }

    contactTriggers.forEach(btn => {
      btn.addEventListener('click', scrollToChannels);
    });

    // If page is loaded with hash #contact-channels or #contact, smooth scroll and highlight
    if (window.location.hash === '#contact-channels' || window.location.hash === '#contact') {
      setTimeout(() => {
        const nav = document.querySelector('nav') || document.querySelector('.navbar');
        const navHeight = nav ? nav.getBoundingClientRect().height : 80;
        const targetTop = channelCard.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
        channelCard.classList.add('channels-focused');
        setTimeout(() => channelCard.classList.remove('channels-focused'), 2600);
      }, 450);
    }
  })();

  /* ==================================================================
     17. CONSOLE BRANDING & WELCOME
     ================================================================== */
  console.log(
    '%c Shovan Mondal - Web Portfolio %c Loaded Successfully 🚀 ',
    'background: #0077cc; color: #ffffff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #00aaff; color: #0a0a14; padding: 4px 8px; border-radius: 0 4px 4px 0; font-weight: bold;'
  );

});
