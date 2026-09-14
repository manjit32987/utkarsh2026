/**
 * UTKARSH 5.0 - TRIPURA INSTITUTE OF TECHNOLOGY
 * Clean, Fast, Streamlined JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSmoothScroll();
});

// 1. Live Countdown Timer
function initCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 35);
  targetDate.setHours(10, 0, 0, 0);

  function updateTimer() {
    const diff = targetDate.getTime() - new Date().getTime();
    if (diff <= 0) return;

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

// 3. Sponsorship Slot Modal
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
function openVideoPlayer(videoUrl, title) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalActiveVideo');
  const source = document.getElementById('modalVideoSource');
  const titleEl = document.getElementById('modalVideoTitle');

  if (modal && video && source) {
    source.src = videoUrl;
    video.load();
    if (titleEl) titleEl.innerText = title || 'Utkarsh 5.0 Video';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    video.play().catch((err) => console.log('Autoplay handled:', err));
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalActiveVideo');

  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
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
• Expected Footfall: 1,500+ Engineering & Technical Students from across Tripura
• Participating Institutes: All 9 Technical Colleges in Tripura (TIT, NITA, ICFAI, Techno, Polytechnics)
• Utkarsh 4.0 Title Sponsor: Triumph Motorcycles

SPONSORSHIP SLOTS:
- Title Sponsor (1 Slot): ₹1,00,000 (Fest Co-Naming, 20x20 ft Quad Stall, Keynote Address)
- Powered By Partner (2 Slots): ₹60,000 (Entrance Arch, 15x15 ft Stall, Kit Inserts)
- Gold Track Sponsor (4 Slots): ₹35,000 (Arena Naming, 10x10 ft Stall)
- Silver Sponsor (6 Slots): ₹20,000 (8x8 ft Stall, Website Recognition)
- Custom / In-Kind: Flexible

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
