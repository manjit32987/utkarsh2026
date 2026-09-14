/**
 * UTKARSH 5.0 - TRIPURA INSTITUTE OF TECHNOLOGY
 * Clean, Fast, Streamlined JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSmoothScroll();
  initLoopingVideos();
  initMobileNav();
});

// Auto-play all videos on continuous loop without clicking
function initLoopingVideos() {
  const allVideos = document.querySelectorAll('.video-screen video, .reel-screen video');
  allVideos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startPlay = () => video.play();
        document.addEventListener('click', startPlay, { once: true });
        document.addEventListener('scroll', startPlay, { once: true });
        document.addEventListener('touchstart', startPlay, { once: true });
      });
    }
  });
}

// 1. Live Countdown Timer
function initCountdown() {
  // Target: September 22 at 09:00 AM
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(`${targetYear}-09-22T09:00:00`);
  
  // If September 22 of this year has already passed, count to next year's
  if (now.getTime() > targetDate.getTime()) {
    targetDate = new Date(`${targetYear + 1}-09-22T09:00:00`);
  }

  function updateTimer() {
    const diff = targetDate.getTime() - new Date().getTime();
    if (diff <= 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    if (daysEl) daysEl.innerText = pad(days);
    if (hoursEl) hoursEl.innerText = pad(hours);
    if (minsEl) minsEl.innerText = pad(minutes);
    if (secsEl) secsEl.innerText = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 2. Smooth Scroll for Nav Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// 3. Mobile Navigation Drawer Toggle
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const navContainer = document.getElementById('navContainer');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !navContainer) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navContainer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    const icon = toggle.querySelector('i');
    if (icon) {
      if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('open')) {
        navContainer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navContainer.classList.contains('open') && !navContainer.contains(e.target) && !toggle.contains(e.target)) {
      navContainer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });
}

// 4. Sponsorship Slot Modal
function openSponsorModal(tierName) {
  const modal = document.getElementById('sponsorModal');
  const badge = document.getElementById('modalSelectedTierName');
  const select = document.getElementById('selectedTier');

  if (badge) badge.innerText = tierName;

  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.toLowerCase().includes(tierName.toLowerCase())) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeSponsorModal() {
  const modal = document.getElementById('sponsorModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleModalOutsideClick(event) {
  if (event.target.id === 'sponsorModal') {
    closeSponsorModal();
  }
}

function handleModalSubmit(event) {
  event.preventDefault();
  const company = document.getElementById('mCompanyName').value;
  const tier = document.getElementById('modalSelectedTierName').innerText;

  closeSponsorModal();
  showToast(`Thank you! Slot reservation inquiry for "${company}" (${tier}) submitted.`);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const company = document.getElementById('companyName').value;
  const tier = document.getElementById('selectedTier').value;

  showToast(`Thank you! Sponsorship inquiry for ${company} (${tier}) submitted.`);
  event.target.reset();
}

// 4. Video Player Modal
function openVideoPlayer(videoUrl, title, isPortrait = false) {
  const modal = document.getElementById('videoModal');
  const modalBox = document.getElementById('videoModalBox');
  const video = document.getElementById('modalActiveVideo');
  const source = document.getElementById('modalVideoSource');
  const titleEl = document.getElementById('modalVideoTitle');

  if (modal && video && source) {
    source.src = videoUrl;
    video.load();
    if (titleEl) titleEl.innerText = title || 'Utkarsh 5.0 Video';
    
    if (modalBox) {
      if (isPortrait) {
        modalBox.classList.add('portrait-mode');
      } else {
        modalBox.classList.remove('portrait-mode');
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    video.play().catch((err) => console.log('Autoplay handled:', err));
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById('videoModal');
  const modalBox = document.getElementById('videoModalBox');
  const video = document.getElementById('modalActiveVideo');

  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (modalBox) {
    modalBox.classList.remove('portrait-mode');
  }
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function handleVideoModalOutsideClick(event) {
  if (event.target.id === 'videoModal') {
    closeVideoPlayer();
  }
}

// 5. Lightbox Viewer
function openLightbox(imgUrl) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');

  if (modal && img) {
    img.src = imgUrl;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightboxDirect() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 6. Utkarsh 4.0 Gallery Filter
function filterGallery(category, btn) {
  document.querySelectorAll('.gallery-filter-btn').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item) => {
    const itemCat = item.getAttribute('data-category');
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Close on Escape Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSponsorModal();
    closeVideoPlayer();
    closeLightboxDirect();
  }
});

// 6. Toast Notification
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toastText');

  if (!toast) return;
  if (text) text.innerText = msg;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// 7. Brochure Download
function downloadBrochure() {
  showToast('Downloading Utkarsh 5.0 Sponsorship Deck...');

  const brochure = `
================================================================================
UTKARSH 5.0 - TRIPURA INSTITUTE OF TECHNOLOGY (TIT)
Annual Inter-College Drone & Robotics Techfest
================================================================================

• Organizer: Tripura Institute of Technology, Narsingarh, Agartala - 799009
• Event Dates: Starting 22nd September
• Expected Footfall: 2,000+ Engineering & Technical Students from across Tripura
• Participating Institutes: All 11 Technical Colleges in Tripura
• Core Deliverables: Logo on Banners, Dedicated Stall & Influencer Reel Coverage

SPONSORSHIP SLOTS:
- Title Sponsor (1 Exclusive Slot): Quote on Discussion (Fest Co-Naming, 20x20 ft Quad Stall, Keynote, Influencer Reels)
- Powered By Partner (2 Slots): Quote on Discussion (Entrance Arch, 15x15 ft Stall, Kit Inserts, Influencer Coverage)
- Gold Track Sponsor (4 Slots): Quote on Discussion (Arena Naming, 10x10 ft Stall, Influencer Feature)
- Silver Sponsor (6 Slots): Quote on Discussion (8x8 ft Stall, Banners & Social Spotlight)
- Custom / In-Kind: Tailored product/equipment support & brand visibility

CONTACT SECRETARIAT:
Email: utkarsh@titagartala.ac.in | Phone: +91 98765 43210
================================================================================
  `;

  const blob = new Blob([brochure], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Utkarsh_5.0_Sponsorship_Deck.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
