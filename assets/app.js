(() => {
  const htmlLang = document.documentElement.lang || 'en';

  const applyReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  };

  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        const el = entry.target;
        const target = Number(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          el.textContent = Math.floor(progress * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        el.dataset.done = '1';
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => observer.observe(c));
  };

  const animateBars = () => {
    const bars = document.querySelectorAll('.bar-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = `${entry.target.dataset.value}%`;
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((bar) => observer.observe(bar));
  };

  const setupAccordion = () => {
    document.querySelectorAll('.faq').forEach((faqWrap) => {
      faqWrap.querySelectorAll('.faq-q').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          faqWrap.querySelectorAll('.faq-item').forEach((el) => {
            if (el !== item) el.classList.remove('open');
          });
          item.classList.toggle('open');
        });
      });
    });
  };

  const switchPathByLang = (targetLang) => {
    const currentPath = window.location.pathname;
    const clean = currentPath.replace(/\/$/, '') || '/index.html';
    const map = {
      en: '/index.html',
      de: '/de/index.html',
      fr: '/fr/index.html',
      es: '/es/index.html',
      it: '/it/index.html'
    };
    const currentLangMatch = clean.match(/^\/(de|fr|es|it)\/index\.html$/);
    const section = clean.split('#')[1] || '';

    let destination = map[targetLang];
    if (currentLangMatch && targetLang !== 'en') {
      destination = `/${targetLang}/index.html`;
    }
    if (!currentLangMatch && targetLang !== 'en') {
      destination = `/${targetLang}/index.html`;
    }

    if (section) destination += `#${section}`;
    window.location.href = destination;
  };

  const setupLanguageMenus = () => {
    document.querySelectorAll('.lang').forEach((wrap) => {
      const toggle = wrap.querySelector('.lang-toggle');
      const links = wrap.querySelectorAll('[data-lang]');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.toggle('open');
      });

      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          switchPathByLang(link.dataset.lang);
        });
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.lang').forEach((wrap) => wrap.classList.remove('open'));
    });
  };

  const setupDrawer = () => {
    const openBtn = document.querySelector('[data-drawer-open]');
    const closeBtn = document.querySelector('[data-drawer-close]');
    const drawer = document.querySelector('.drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    if (!openBtn || !drawer || !backdrop) return;

    const close = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    };
    const open = () => {
      drawer.classList.add('open');
      backdrop.classList.add('open');
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    drawer.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', close));
  };

  const setupModal = () => {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    const openers = document.querySelectorAll('[data-modal-open]');
    const closers = document.querySelectorAll('[data-modal-close]');

    const close = () => modal.classList.remove('open');
    const open = () => modal.classList.add('open');

    openers.forEach((o) => o.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closers.forEach((c) => c.addEventListener('click', close));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  const setupForms = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+()\-\d\s]{7,20}$/;

    document.querySelectorAll('form[data-lead-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = {
          name: form.querySelector('[name="name"]'),
          email: form.querySelector('[name="email"]'),
          phone: form.querySelector('[name="phone"]')
        };

        let valid = true;
        if (!fields.name.value.trim()) {
          valid = false;
          form.querySelector('[data-error="name"]').textContent = form.dataset.errRequired;
        } else {
          form.querySelector('[data-error="name"]').textContent = '';
        }

        if (!emailRegex.test(fields.email.value.trim())) {
          valid = false;
          form.querySelector('[data-error="email"]').textContent = form.dataset.errEmail;
        } else {
          form.querySelector('[data-error="email"]').textContent = '';
        }

        if (!phoneRegex.test(fields.phone.value.trim())) {
          valid = false;
          form.querySelector('[data-error="phone"]').textContent = form.dataset.errPhone;
        } else {
          form.querySelector('[data-error="phone"]').textContent = '';
        }

        if (!valid) return;
        form.reset();
        const msg = form.querySelector('.form-success');
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3400);
      });
    });
  };

  applyReveal();
  animateCounters();
  animateBars();
  setupAccordion();
  setupLanguageMenus();
  setupDrawer();
  setupModal();
  setupForms();

  document.querySelectorAll('.lang-current').forEach((el) => {
    const labels = {
      en: '🇬🇧 English',
      de: '🇩🇪 Deutsch',
      fr: '🇫🇷 Français',
      es: '🇪🇸 Español',
      it: '🇮🇹 Italiano'
    };
    el.textContent = labels[htmlLang] || labels.en;
  });
})();
