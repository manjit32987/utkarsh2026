/**
 * UTKARSH 5.0 - TRIPURA INSTITUTE OF TECHNOLOGY
 * Interactive Functionality & Sponsorship Portal Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initGalleryFilters();
  initLocalPhotoUploader();
  initSmoothScroll();
});

// ==========================================
// 1. Live Countdown Timer
// ==========================================
function initCountdown() {
  // Set target date 35 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 35);
  targetDate.setHours(10, 0, 0, 0);

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

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

// ==========================================
// 2. Interactive Gallery Filter
// ==========================================
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// ==========================================
// 3. Lightbox Viewer
// ==========================================
function openLightbox(cardElement) {
  const imgEl = cardElement.querySelector('img');
  const titleEl = cardElement.querySelector('.gallery-info-title');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (imgEl && lightboxModal && lightboxImg) {
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Utkarsh Event';
    if (lightboxCaption && titleEl) {
      lightboxCaption.innerText = titleEl.innerText;
    }
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  if (event.target.id === 'lightboxModal') {
    closeLightboxDirect();
  }
}

function closeLightboxDirect() {
  const lightboxModal = document.getElementById('lightboxModal');
  if (lightboxModal) {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 4. Organizer Photo Uploader (Dropzone)
// ==========================================
function initLocalPhotoUploader() {
  const fileInput = document.getElementById('localPhotoInput');
  const galleryGrid = document.getElementById('galleryGrid');

  if (!fileInput || !galleryGrid) return;

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = (event) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.setAttribute('data-category', 'all');
        card.onclick = () => openLightbox(card);

        card.innerHTML = `
          <div class="gallery-img-wrapper">
            <span class="gallery-tag-pill" style="background: rgba(2, 132, 199, 0.9);">Uploaded Photo</span>
            <img src="${event.target.result}" alt="${file.name}">
          </div>
          <div class="gallery-info">
            <h4 class="gallery-info-title">${file.name.replace(/\.[^/.]+$/, "")}</h4>
            <p class="gallery-info-desc">Added by TIT Organizing Committee member.</p>
          </div>
        `;

        galleryGrid.prepend(card);
      };
      reader.readAsDataURL(file);
    }

    showToast(`${files.length} photo(s) added to the gallery preview!`);
  });
}

// ==========================================
// 5. Sponsorship Slot Modal Handling
// ==========================================
function openSponsorModal(tierName) {
  const modal = document.getElementById('sponsorModal');
  const badgeText = document.getElementById('modalSelectedTierName');
  const hiddenInput = document.getElementById('modalTierHidden');
  const contactSelect = document.getElementById('selectedTier');

  if (badgeText) badgeText.innerText = tierName;
  if (hiddenInput) hiddenInput.value = tierName;

  // Sync with main contact form dropdown if matching
  if (contactSelect) {
    for (let i = 0; i < contactSelect.options.length; i++) {
      if (contactSelect.options[i].value.toLowerCase().includes(tierName.toLowerCase())) {
        contactSelect.selectedIndex = i;
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

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSponsorModal();
    closeLightboxDirect();
  }
});

// ==========================================
// 6. Form Submission Handlers
// ==========================================
function handleModalSubmit(event) {
  event.preventDefault();
  const company = document.getElementById('mCompanyName').value;
  const person = document.getElementById('mContactPerson').value;
  const tier = document.getElementById('modalSelectedTierName').innerText;

  closeSponsorModal();
  document.getElementById('modalForm').reset();

  showToast(`Thank you ${person}! Your request for "${tier}" has been sent to TIT Secretariat.`);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const company = document.getElementById('companyName').value;
  const person = document.getElementById('contactPerson').value;
  const tier = document.getElementById('selectedTier').value;

  document.getElementById('contactForm').reset();
  showToast(`Expression of Interest submitted for ${company} (${tier}). We will contact you shortly.`);
}

// ==========================================
// 7. Toast Notification Utility
// ==========================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  if (!toast) return;

  if (toastText) toastText.innerText = message;

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ==========================================
// 8. Brochure Download Handler
// ==========================================
function downloadBrochure() {
  showToast('Generating official Utkarsh 5.0 Sponsorship Brochure (PDF)...');

  // Create downloadable markdown/printable brochure file
  const brochureContent = `
================================================================================
UTKARSH 5.0 - OFFICIAL SPONSORSHIP DECK & BROCHURE
Tripura Institute of Technology (TIT), Narsingarh, Agartala - 799009
Annual Inter-College Drone & Robotics Competition
================================================================================

1. EVENT OVERVIEW:
   - Expected Footfall: 1,500+ Engineering, Polytechnic & Technical Students
   - Participating Colleges: All Technical Colleges across Tripura (TIT, NIT Agartala, ICFAI, Techno College, Polytechnics)
   - Total Cash Prize Pool: ₹1,50,000+
   - Major Tracks: Drone Obstacle Racing, 30kg RoboWars, Robo-Soccer League, Tech Innovation Expo

2. PREVIOUS EDITION (Utkarsh 4.0):
   - Title Sponsor: TRIUMPH MOTORCYCLES
   - Over 1,200 attendees, 42 competing quadcopters, 28 combat battlebots

3. SPONSORSHIP SLOTS AVAILABLE:
   - Title Sponsor (1 Slot): ₹1,00,000 (Exclusive Fest Naming Rights, 20x20 ft Stall, Keynote Address)
   - Powered-By Partner (2 Slots): ₹60,000 (Secondary Banner, 15x15 ft Stall, Kit Inserts)
   - Gold Arena Track Sponsor (4 Slots): ₹35,000 (Category Naming, 10x10 ft Stall)
   - Silver Partner (6 Slots): ₹20,000 (8x8 ft Stall, Website Logo, Kit Insert)
   - Hardware / Pit-Stop Partner: ₹15,000 or In-Kind Tools / Electronics
   - Refreshment & Media Partner: Custom

4. CONTACT FOR SPONSORSHIP:
   - Email: utkarsh@titagartala.ac.in
   - Phone: +91 98765 43210 / +91 87654 32109
   - Campus: Tripura Institute of Technology, Narsingarh, Agartala, Tripura 799009
================================================================================
  `;

  const blob = new Blob([brochureContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Utkarsh_5.0_TIT_Sponsorship_Brochure.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================
// 9. Mobile Menu Toggle
// ==========================================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  }
}

document.getElementById('mobileMenuBtn')?.addEventListener('click', toggleMobileMenu);

// ==========================================
// 10. Smooth Scrolling For Anchor Links
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
