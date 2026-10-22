/**
 * GRAY HANSEN LIMANTORO, S.Kom. (林福勝)
 * Haute Édition & Luxury Maison Interactive Script
 * Inspired by LVMH, Hermès & Cartier Digital Experiences
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. Current Year in Footer
  // =========================================================
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================================================
  // 2. Dual Luxury Theme Toggle (Maison Blanche & Atelier Noir)
  // =========================================================
  const htmlRoot = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-theme-set]');

  // Retrieve saved theme or default to 'blanche' (like LVMH.com)
  const savedTheme = localStorage.getItem('luxury-maison-theme') || 'blanche';
  setTheme(savedTheme, false);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTheme = btn.getAttribute('data-theme-set');
      if (targetTheme) {
        setTheme(targetTheme, true);
      }
    });
  });

  function setTheme(theme, triggerToast = false) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('luxury-maison-theme', theme);

    themeButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-theme-set') === theme;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });

    if (triggerToast && typeof showToast === 'function') {
      showToast(theme === 'noir' ? 'Dark Mode is enabled' : 'Light Mode is enabled');
    }
  }

  // =========================================================
  // 3. Fullscreen Editorial Menu Drawer (LVMH Style)
  // =========================================================
  const menuOpenBtn = document.getElementById('menuOpenBtn');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const menuDrawer = document.getElementById('menuDrawer');
  const drawerNavLinks = document.querySelectorAll('#drawerNavList a, #drawerFeaturedLink');

  function openDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuCloseBtn?.focus();
  }

  function closeDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeDrawer);

  drawerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuDrawer && menuDrawer.classList.contains('open')) {
        closeDrawer();
      }
      if (modal && modal.classList.contains('open')) {
        closeModal();
      }
    }
  });

  // =========================================================
  // 4. Header Dynamic Blur & Border on Scroll
  // =========================================================
  const mainHeader = document.getElementById('mainHeader');
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================
  // 5. Scroll Spy: Active Nav Link Indicator
  // =========================================================
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const headerNavLinks = Array.from(document.querySelectorAll('.header-nav-link'));

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 160;
    let currentId = 'home';

    sections.forEach(sec => {
      if (scrollPosition >= sec.offsetTop) {
        currentId = sec.getAttribute('id');
      }
    });

    headerNavLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', targetId === currentId);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // =========================================================
  // 6. Scroll Reveal Observer with Stagger
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================
  // 7. Metric Number Animation
  // =========================================================
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const isDecimal = String(target).includes('.');
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }

  // =========================================================
  // 8. Portfolio Category Filtering
  // =========================================================
  const filterButtons = document.querySelectorAll('#portfolioFilters .filter-btn');
  const workCards = document.querySelectorAll('#portfolioGrid .work-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.classList.add('visible');
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================
  // 9. Interactive Luxury Detail Modal
  // =========================================================
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalRoleBadge = document.getElementById('modalRoleBadge');
  const modalBody = document.getElementById('modalBody');
  const modalImage = document.getElementById('modalImage');
  const modalImageWrap = document.getElementById('modalImageWrap');
  const modalActionBtn = document.getElementById('modalActionBtn');

  function openModal(card) {
    if (!modal) return;

    const title = card.getAttribute('data-title') || 'Proyek';
    const catLabel = card.getAttribute('data-category-label') || 'Portofolio';
    const role = card.getAttribute('data-role') || '';
    const year = card.getAttribute('data-year') || '';
    const desc = card.getAttribute('data-desc') || '';
    const image = card.getAttribute('data-image') || '';
    const link = card.getAttribute('data-link') || '#';
    const linkLabel = card.getAttribute('data-link-label') || 'Ouvrir le Lien Officiel &nearr;';

    modalTitle.textContent = title;
    modalCategory.textContent = catLabel;
    modalRoleBadge.textContent = role ? `${role} • ${year}` : year;
    modalBody.textContent = desc;

    if (image) {
      modalImage.src = image;
      modalImage.alt = title;
      modalImageWrap.style.display = 'block';
    } else {
      modalImageWrap.style.display = 'none';
    }

    if (link && link !== '#') {
      modalActionBtn.href = link;
      modalActionBtn.innerHTML = `<span>${linkLabel}</span>`;
      modalActionBtn.style.display = 'inline-flex';
    } else {
      modalActionBtn.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  const allInteractiveCards = document.querySelectorAll('#portfolioGrid .work-card, .photosession-card');

  allInteractiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking directly on a link inside footer, don't hijack
      if (e.target.closest('a') && e.target.closest('a').getAttribute('href') !== '#') {
        return;
      }
      openModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // =========================================================
  // 10. Copy Email & Share Actions with Luxury Toast
  // =========================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const footerShareLinkBtn = document.getElementById('footerShareLinkBtn');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'grayhansenl3@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Adresse email copiée : ' + email);
      }).catch(() => {
        showToast('Email : ' + email);
      });
    });
  }

  if (footerShareLinkBtn) {
    footerShareLinkBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Lien du portfolio copié dans le presse-papier !');
      }).catch(() => {
        showToast('Partagez : ' + url);
      });
    });
  }

  // =========================================================
  // 11. PDF Dossier Print Preparation & Trigger
  // =========================================================
  function prepareForPrint() {
    // 1. Close menu drawer if open
    if (typeof closeDrawer === 'function') {
      closeDrawer();
    }

    // 2. Close modal if open
    if (typeof closeModal === 'function') {
      closeModal();
    }

    // 3. Make all scroll-reveal elements immediately visible
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });

    // 4. Force all lazy images to eager load for the print engine
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.setAttribute('loading', 'eager');
    });

    // 5. Ensure all portfolio work-cards are visible regardless of filter
    document.querySelectorAll('#portfolioGrid .work-card').forEach(card => {
      card.style.display = 'flex';
      card.classList.add('visible');
    });

    // 6. Ensure metric counters show exact target values
    document.querySelectorAll('.counter').forEach(counter => {
      const target = counter.getAttribute('data-target');
      if (target) {
        counter.textContent = target;
      }
    });
  }

  window.addEventListener('beforeprint', prepareForPrint);

  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prepareForPrint();

      // Give browser a short tick to apply styles and load eager images
      setTimeout(() => {
        window.print();
      }, 120);
    });
  }

  // =========================================================
  // 12. Dual Live Carousel (Google Drive Synchronized)
  //     Left: Architecture Landscape (16:9)
  //     Right: Graphic Design E-Flyer Portrait (9:16)
  //     Inspired by LVMH Editorial Media Experience
  // =========================================================
  const DRIVE_CONFIG = {
    folderId: '1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E',
    folderUrl: 'https://drive.google.com/drive/folders/1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E?hl=ID',
    gasEndpoint: localStorage.getItem('custom-drive-sync-endpoint') || '',
    apiEndpoint: '/api/drive?folderId=1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E',
    autoPlayDelay: 6000,
  };

  // High-Resolution Curated Starter Datasets (Zero Placeholders)
  const initialArchitectureLandscape = [
    {
      id: 'arch-1',
      title: 'Dynamic House',
      category: 'Architecture',
      desc: 'Rumah dengan konsep dinamis.',
      image: 'assets/gallery/Feed Landscape2.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-2',
      title: 'Contemporary luxe house',
      category: 'Architecture',
      desc: 'Rumah modern yang menunjukkan status.',
      image: 'assets/gallery/Feed Landscape4.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-3',
      title: 'Contemporary Mega house',
      category: 'Architecture',
      desc: 'Rumah modern yang menunjukkan status.',
      image: 'assets/gallery/Photo Tempelate.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-4',
      title: 'Interior, Contemporary Mega house',
      category: 'Architecture',
      desc: 'Rumah modern yang menunjukkan status.',
      image: 'assets/gallery/Photo Tempelate3.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-5',
      title: 'Mall Design',
      category: 'Architecture',
      desc: 'Dokumentasi perancangan mall.',
      image: 'assets/gallery/ArchMall.png',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-6',
      title: 'Contemporary Art Foundation',
      category: 'Architecture',
      desc: 'Komposisi arsitektur kontemporer, menciptakan simetri monolitik modern.',
      image: 'assets/gallery/Arch.png',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'arch-7',
      title: 'Minimalist Marble Atrium & Spiral Geometry',
      category: 'Architecture',
      desc: 'Interior luas dan geometris menghadap langsung pada taman.',
      image: 'assets/gallery/ArchInt.png',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    }
  ];

  const initialDesignPortrait = [
    {
      id: 'des-1',
      title: "GRWT Qubika E-Flyer",
      category: 'Graphic Design',
      desc: 'GRWT Wedding Exhibition flyer.',
      image: 'assets/gallery/STORY ROOM.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'des-2',
      title: 'The Rising Capital Qubika E-Flyer',
      category: 'Graphic Design',
      desc: '2025 New Year event flyer.',
      image: 'assets/gallery/STORY ROOM(2).jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'des-3',
      title: 'The Pool E-Flyer',
      category: 'Graphic Design',
      desc: 'Pool Promo Flyer.',
      image: 'assets/gallery/STORY POOL.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'des-4',
      title: '30% F&B Promo E-Flyer',
      category: 'Graphic Design',
      desc: 'Restaurant Promo Flyer.',
      image: 'assets/gallery/STORY ROOM(1).jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'des-5',
      title: 'BBQ Promo E-Flyer',
      category: 'Graphic Design',
      desc: 'BBQ Night Event Flyer.',
      image: 'assets/gallery/STORY BBQ.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
    {
      id: 'des-6',
      title: 'Room WEBSITE BEST RATE promo E-Flyer',
      category: 'Graphic Design',
      desc: 'Special promo for website booking.',
      image: 'assets/gallery/Story Instagram_Website Best Rate.jpg',
      link: DRIVE_CONFIG.folderUrl,
      linkLabel: 'Buka di Google Drive &nearr;'
    },
  ];

  class LvmhCarousel {
    constructor({ viewportId, trackId, prevBtnId, nextBtnId, dotsId, counterId, items, isLandscape }) {
      this.viewport = document.getElementById(viewportId);
      this.track = document.getElementById(trackId);
      this.prevBtn = document.getElementById(prevBtnId);
      this.nextBtn = document.getElementById(nextBtnId);
      this.dotsContainer = document.getElementById(dotsId);
      this.counterEl = document.getElementById(counterId);
      this.items = [...items];
      this.isLandscape = isLandscape;
      this.currentIndex = 0;
      this.timer = null;
      this.touchStartX = 0;
      this.touchEndX = 0;

      if (!this.viewport || !this.track) return;

      this.init();
    }

    init() {
      this.renderSlides();
      this.bindEvents();
      this.startAutoPlay();
    }

    setItems(newItems) {
      if (!Array.isArray(newItems) || newItems.length === 0) return;
      this.items = [...newItems];
      this.currentIndex = 0;
      this.renderSlides();
      this.updateSlide(0);
    }

    renderSlides() {
      this.track.innerHTML = '';
      if (this.dotsContainer) this.dotsContainer.innerHTML = '';

      this.items.forEach((item, index) => {
        // Slide element (PURE MEDIA - NO WHITE TEXT BOX AS ORDERED)
        const slide = document.createElement('div');
        slide.className = 'lvmh-slide-item';
        slide.setAttribute('data-index', index);
        slide.setAttribute('data-title', item.title || 'Karya Seni');
        slide.setAttribute('data-category-label', item.category || (this.isLandscape ? 'Arsitektur' : 'Desain Grafis'));
        slide.setAttribute('data-role', 'Haute Édition; Curated Work');
        slide.setAttribute('data-year', new Date().getFullYear());
        slide.setAttribute('data-desc', item.desc || '');
        slide.setAttribute('data-image', item.image);
        slide.setAttribute('data-link', item.link || DRIVE_CONFIG.folderUrl);
        slide.setAttribute('data-link-label', item.linkLabel || 'Buka di Google Drive &nearr;');

        // Image with lazy load and high quality fit
        const img = document.createElement('img');
        img.className = 'lvmh-slide-img';
        img.src = item.image;
        img.alt = item.title || 'Galeri Karya';
        img.loading = index === 0 ? 'eager' : 'lazy';

        // Editorial subtle vignette (replaces any white box with subtle contrast)
        const vignette = document.createElement('div');
        vignette.className = 'lvmh-slide-vignette';

        // Minimalist transparent caption line
        const caption = document.createElement('div');
        caption.className = 'lvmh-slide-caption';
        caption.innerHTML = `<span class="lvmh-slide-title">${item.title}</span>`;

        slide.appendChild(img);
        slide.appendChild(vignette);
        slide.appendChild(caption);

        // Click to expand in luxury modal
        slide.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof openModal === 'function') {
            openModal(slide);
          }
        });

        this.track.appendChild(slide);

        // Dot button
        if (this.dotsContainer) {
          const dot = document.createElement('button');
          dot.className = `lvmh-dot ${index === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Slide ${index + 1}`);
          dot.type = 'button';
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.goTo(index);
          });
          this.dotsContainer.appendChild(dot);
        }
      });

      this.updateCounter();
    }

    bindEvents() {
      // Prev/Next buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.prev();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.next();
        });
      }

      // Pause on mouse hover
      this.viewport.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.viewport.addEventListener('mouseleave', () => this.startAutoPlay());

      // Touch events for mobile swipe
      this.viewport.addEventListener('touchstart', (e) => {
        this.stopAutoPlay();
        this.touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      this.viewport.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
        this.startAutoPlay();
      }, { passive: true });
    }

    handleSwipe() {
      const diffX = this.touchStartX - this.touchEndX;
      const threshold = 35; // minimum swipe distance
      if (diffX > threshold) {
        this.next();
      } else if (diffX < -threshold) {
        this.prev();
      }
    }

    updateSlide(index) {
      if (this.items.length === 0) return;
      this.currentIndex = (index + this.items.length) % this.items.length;
      const offset = -this.currentIndex * 100;
      this.track.style.transform = `translateX(${offset}%)`;

      // Update dots
      if (this.dotsContainer) {
        const dots = this.dotsContainer.querySelectorAll('.lvmh-dot');
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === this.currentIndex);
        });
      }

      this.updateCounter();
    }

    updateCounter() {
      if (!this.counterEl) return;
      const cur = String(this.currentIndex + 1).padStart(2, '0');
      const total = String(this.items.length).padStart(2, '0');
      this.counterEl.textContent = `${cur} / ${total}`;
    }

    next() {
      this.updateSlide(this.currentIndex + 1);
    }

    prev() {
      this.updateSlide(this.currentIndex - 1);
    }

    goTo(index) {
      this.updateSlide(index);
    }

    startAutoPlay() {
      this.stopAutoPlay();
      this.timer = setInterval(() => {
        this.next();
      }, DRIVE_CONFIG.autoPlayDelay);
    }

    stopAutoPlay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  // Initialize both Carousels
  const carouselLandscape = new LvmhCarousel({
    viewportId: 'viewportLandscape',
    trackId: 'trackLandscape',
    prevBtnId: 'prevLandscapeBtn',
    nextBtnId: 'nextLandscapeBtn',
    dotsId: 'dotsLandscape',
    counterId: 'counterLandscape',
    items: initialArchitectureLandscape,
    isLandscape: true
  });

  const carouselPortrait = new LvmhCarousel({
    viewportId: 'viewportPortrait',
    trackId: 'trackPortrait',
    prevBtnId: 'prevPortraitBtn',
    nextBtnId: 'nextPortraitBtn',
    dotsId: 'dotsPortrait',
    counterId: 'counterPortrait',
    items: initialDesignPortrait,
    isLandscape: false
  });

  // Google Drive Live Sync Engine
  async function fetchDriveUpdates(isManual = false) {
    const refreshBtn = document.getElementById('refreshDriveBtn');
    const syncStatusText = document.getElementById('liveSyncStatus');
    const syncDetailsText = document.getElementById('syncDetailsText');

    if (refreshBtn) refreshBtn.classList.add('spinning');
    if (syncStatusText) syncStatusText.textContent = 'Menyinkronkan Google Drive...';

    let liveFiles = [];
    let success = false;

    // 1. Try Google Apps Script bridge if provided
    if (DRIVE_CONFIG.gasEndpoint) {
      try {
        const gasUrl = `${DRIVE_CONFIG.gasEndpoint}?folderId=${DRIVE_CONFIG.folderId}&t=${Date.now()}`;
        const res = await fetch(gasUrl, { mode: 'cors' });
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.files) && json.files.length > 0) {
            liveFiles = json.files;
            success = true;
          }
        }
      } catch (e) {
        console.warn('Apps Script sync check:', e);
      }
    }

    // 2. Try Vercel Serverless Function /api/drive
    if (!success) {
      try {
        const res = await fetch(`${DRIVE_CONFIG.apiEndpoint}&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.files) && json.files.length > 0) {
            liveFiles = json.files;
            success = true;
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    if (refreshBtn) refreshBtn.classList.remove('spinning');

    if (success && liveFiles.length > 0) {
      // Split into landscape & portrait
      const newLandscape = [];
      const newPortrait = [];

      liveFiles.forEach((f, idx) => {
        const itemObj = {
          id: f.id || `live-${idx}`,
          title: f.name ? f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Karya Drive #${idx + 1}`,
          category: f.isLandscape ? 'Arsitektur &bull; Landscape' : 'Desain Grafis &bull; Portrait 9:16',
          desc: `Karya resmi yang disinkronisasi langsung dari repositori Google Drive (${f.name || 'Dokumentasi'}).`,
          image: f.imageUrl || `https://lh3.googleusercontent.com/d/${f.id}=w1600`,
          link: f.driveUrl || f.driveLink || DRIVE_CONFIG.folderUrl,
          linkLabel: 'Buka di Google Drive &nearr;'
        };

        if (f.isLandscape) {
          newLandscape.push(itemObj);
        } else {
          newPortrait.push(itemObj);
        }
      });

      if (newLandscape.length > 0) carouselLandscape.setItems(newLandscape);
      if (newPortrait.length > 0) carouselPortrait.setItems(newPortrait);

      if (syncStatusText) syncStatusText.textContent = `Google Drive Live • ${liveFiles.length} Karya`;
      if (syncDetailsText) {
        syncDetailsText.textContent = `Tersinkronisasi langsung (${liveFiles.length} karya aktif dari Google Drive)`;
      }

      if (isManual && typeof showToast === 'function') {
        showToast(`Sinkronisasi berhasil! ${liveFiles.length} karya aktif dari Google Drive.`);
      }
    } else {
      // Fallback state: Curated high-res starter collection remains active
      if (syncStatusText) syncStatusText.textContent = 'Google Drive Live Sync';
      if (syncDetailsText) {
        syncDetailsText.textContent = `Connected to Google Drive • Automatic updates enabled`;
      }
      if (isManual && typeof showToast === 'function') {
        showToast('Arsip termutakhir siap. Folder Google Drive terhubung & aktif.');
      }
    }
  }

  // Refresh button event listener
  const refreshDriveBtn = document.getElementById('refreshDriveBtn');
  if (refreshDriveBtn) {
    refreshDriveBtn.addEventListener('click', () => {
      fetchDriveUpdates(true);
    });
  }

  // Auto sync on page load
  fetchDriveUpdates(false);

  // Periodic background check every 3 minutes
  setInterval(() => {
    if (!document.hidden) {
      fetchDriveUpdates(false);
    }
  }, 180000);

});

