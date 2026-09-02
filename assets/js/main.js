(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const cursorDot = document.getElementById('cursorDot');
  const bookingForm = document.getElementById('bookingForm');
  const formNote = document.getElementById('formNote');
  const yearEl = document.getElementById('year');
  const certForm = document.getElementById('certForm');
  const certInput = document.getElementById('certId');
  const certResult = document.getElementById('certResult');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shrink on scroll
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal via IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Custom cursor dot (desktop only)
  if (cursorDot && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.querySelectorAll('a, button, .gallery-item, summary').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }

  // Certificate registry (sample records — swap for a real lookup API)
  const CERT_REGISTRY = {
    'LUME-FND-2024-0142': {
      course: 'Nail Art Fundamentals', level: 'Foundation',
      graduate: 'J. Alvarez', issued: '2024-03-10', status: 'valid',
    },
    'LUME-SCP-2024-0087': {
      course: 'Sculpting & Extensions', level: 'Intermediate',
      graduate: 'R. Okafor', issued: '2024-09-22', status: 'valid',
    },
    'LUME-3DA-2025-0019': {
      course: '3D Art & Portfolio Studio', level: 'Advanced',
      graduate: 'S. Tanaka', issued: '2025-02-14', status: 'valid',
    },
    'LUME-FND-2019-0005': {
      course: 'Nail Art Fundamentals', level: 'Foundation',
      graduate: 'M. Dupont', issued: '2019-06-01', status: 'superseded',
    },
  };

  const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  const renderCertResult = (idRaw) => {
    const id = idRaw.trim().toUpperCase();
    if (!id) {
      certResult.innerHTML = '';
      return;
    }
    const record = CERT_REGISTRY[id];
    if (!record) {
      certResult.innerHTML = `
        <div class="cert-card is-notfound">
          <span class="cert-status">Not found</span>
          <p class="cert-note">No certificate matches “${escapeHtml(id)}”. Double‑check the ID printed on the
            certificate, or contact the studio to verify by graduate name.</p>
        </div>`;
      return;
    }
    if (record.status === 'superseded') {
      certResult.innerHTML = `
        <div class="cert-card is-superseded">
          <span class="cert-status">Superseded curriculum</span>
          <dl class="cert-details">
            <div><dt>Course</dt><dd>${record.course}</dd></div>
            <div><dt>Level</dt><dd>${record.level}</dd></div>
            <div><dt>Graduate</dt><dd>${record.graduate}</dd></div>
            <div><dt>Issued</dt><dd>${record.issued}</dd></div>
          </dl>
          <p class="cert-note">This certificate is genuine but was issued under a retired curriculum
            version. We recommend the holder complete a refresher module to bring it current.</p>
        </div>`;
      return;
    }
    certResult.innerHTML = `
      <div class="cert-card is-valid">
        <span class="cert-status">Valid credential</span>
        <dl class="cert-details">
          <div><dt>Course</dt><dd>${record.course}</dd></div>
          <div><dt>Level</dt><dd>${record.level}</dd></div>
          <div><dt>Graduate</dt><dd>${record.graduate}</dd></div>
          <div><dt>Issued</dt><dd>${record.issued}</dd></div>
        </dl>
        <p class="cert-note">This credential is active and in good standing with LUMÉ Academy.</p>
      </div>`;
  };

  if (certForm) {
    certForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderCertResult(certInput.value);
    });
  }

  // Booking form (client-side only — no backend wired up yet)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      const name = (data.get('name') || '').toString().trim();
      if (!name) return;
      formNote.textContent = `Thanks, ${name.split(' ')[0]} — we'll be in touch within one business day.`;
      bookingForm.reset();
    });
  }
})();
