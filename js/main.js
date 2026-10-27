/**
 * MEADLEAF - Modern AI Medicinal Plant Identification Platform
 * Interactive Landing Page JavaScript
 */

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? (window.location.port === '4000' ? '' : 'http://localhost:4000')
  : '';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. Sticky Navigation Header ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });

    // Close mobile drawer when clicking link
    mobileDrawer.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  // --- 3. Image Upload & Drag-and-Drop Handler ---
  const fileInput = document.getElementById('plant-file-input');
  const cameraInput = document.getElementById('plant-camera-input');
  const dropzone = document.getElementById('upload-dropzone');
  const chooseBtn = document.getElementById('choose-file-btn');
  const openCameraBtn = document.getElementById('open-camera-btn');
  
  const uploadIdleState = document.getElementById('upload-idle-state');
  const uploadPreviewState = document.getElementById('upload-preview-state');
  const previewImg = document.getElementById('preview-img');
  const fileNameDisplay = document.getElementById('file-name-display');
  const fileSizeDisplay = document.getElementById('file-size-display');
  const changeImgBtn = document.getElementById('change-image-btn');
  const analyzeBtn = document.getElementById('analyze-plant-btn');
  
  const analysisProgressCard = document.getElementById('analysis-progress-card');
  const analysisStepText = document.getElementById('analysis-step-text');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const placeholderResult = document.getElementById('analysis-placeholder-result');
  const reanalyzeBtn = document.getElementById('reanalyze-btn');

  let currentFile = null;

  // Trigger file input
  if (chooseBtn && fileInput) {
    chooseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Drag and Drop Events
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleSelectedFile(files[0]);
      }
    });
  }

  // File Input Change
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleSelectedFile(e.target.files[0]);
      }
    });
  }

  // Camera Input Change (for mobile devices fallback)
  if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleSelectedFile(e.target.files[0]);
      }
    });
  }

  let currentBase64Image = null;

  // Handle selected file validation & render preview
  function handleSelectedFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes((file.type || '').toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp|jfif)$/i)) {
      alert('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      currentBase64Image = e.target.result;
      if (previewImg) {
        previewImg.src = e.target.result;
      }
      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }
      if (fileSizeDisplay) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        fileSizeDisplay.textContent = `${sizeInMb} MB • Ready for Gemini AI Inference`;
      }

      // Switch views
      uploadIdleState.style.display = 'none';
      analysisProgressCard.style.display = 'none';
      if (placeholderResult) placeholderResult.style.display = 'none';
      uploadPreviewState.style.display = 'block';

      if (window.lucide) window.lucide.createIcons();
    };
    reader.readAsDataURL(file);
  }

  // Reset to Upload Idle State
  if (changeImgBtn) {
    changeImgBtn.addEventListener('click', () => {
      resetUploadState();
    });
  }

  if (reanalyzeBtn) {
    reanalyzeBtn.addEventListener('click', () => {
      resetUploadState();
    });
  }

  function resetUploadState() {
    currentFile = null;
    currentBase64Image = null;
    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
    if (uploadIdleState) uploadIdleState.style.display = 'flex';
    if (uploadPreviewState) uploadPreviewState.style.display = 'none';
    if (analysisProgressCard) analysisProgressCard.style.display = 'none';
    if (placeholderResult) placeholderResult.style.display = 'none';
  }

      // --- 4. Real AI Analysis & Botanical Knowledgebase Flow ---
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        executePlantRecognition();
      });
    }

    async function executePlantRecognition() {
      if (!uploadPreviewState || !analysisProgressCard) return;

      uploadPreviewState.style.display = 'none';
      analysisProgressCard.style.display = 'block';
      if (placeholderResult) placeholderResult.style.display = 'none';
      if (progressBarFill) progressBarFill.style.width = '0%';

      const steps = [
        { text: '01/04: Validating leaf image resolution, aspect ratio & color channels...', progress: '25%' },
        { text: '02/04: Preprocessing botanical venation, margins & morphological features...', progress: '55%' },
        { text: '03/04: Matching against 164 species neural dataset weights & MobileNet taxonomy...', progress: '85%' },
        { text: '04/04: Retrieving verified botanical references and safety precautions...', progress: '100%' }
      ];

      let currentStep = 0;
      analysisStepText.textContent = steps[0].text;
      progressBarFill.style.width = steps[0].progress;

      const progressInterval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          analysisStepText.textContent = steps[currentStep].text;
          progressBarFill.style.width = steps[currentStep].progress;
        } else {
          clearInterval(progressInterval);
        }
      }, 700);

      try {
        // Query the live MedLeaf API Server
        const res = await fetch(`${API_BASE}/api/plants/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: currentFile ? currentFile.name : 'captured_leaf.jpg',
            image: currentBase64Image
          })
        });
        const data = await res.json();

        setTimeout(() => {
          clearInterval(progressInterval);
          analysisProgressCard.style.display = 'none';

          if (data && data.success && data.prediction) {
            displayPredictionResults(data.prediction, data.confidenceScore);
          } else {
            alert('Recognition engine could not confidently identify the specimen. Please ensure the leaf is clearly visible and in focus.');
            resetUploadState();
          }
        }, 3000);
      } catch (err) {
        console.error('Inference error:', err);
        setTimeout(() => {
          clearInterval(progressInterval);
          analysisProgressCard.style.display = 'none';
          alert('Could not reach the MedLeaf AI inference service. Please check your network or try again.');
          resetUploadState();
        }, 1500);
      }
    }

    function displayPredictionResults(plant, confScore) {
      if (!placeholderResult) return;

      const nameEl = document.getElementById('result-plant-name');
      const sciEl = document.getElementById('result-plant-sci');
      const localEl = document.getElementById('result-plant-local');
      const confEl = document.getElementById('result-confidence-val');
      const familyEl = document.getElementById('result-plant-family');
      const partsEl = document.getElementById('result-parts-used');
      const propsEl = document.getElementById('result-properties-badges');
      const usesEl = document.getElementById('result-traditional-uses');
      const prepEl = document.getElementById('result-preparation');
      const precEl = document.getElementById('result-precautions');
      const toxEl = document.getElementById('result-toxicity');

      if (nameEl) nameEl.textContent = plant.commonName;
      if (sciEl) sciEl.textContent = plant.scientificName;
      if (localEl) localEl.textContent = `Local Names: ${plant.localNames || 'None verified'}`;
      if (confEl) confEl.textContent = `${(confScore * 100).toFixed(1)}%`;
      if (familyEl) familyEl.textContent = plant.botanicalFamily;
      if (partsEl) partsEl.textContent = Array.isArray(plant.partsUsed) ? plant.partsUsed.join(', ') : plant.partsUsed;
      if (usesEl) usesEl.textContent = plant.traditionalUses;
      if (prepEl) prepEl.textContent = plant.preparationMethods;
      if (precEl) precEl.textContent = plant.precautions;
      if (toxEl) toxEl.textContent = plant.knownToxicity ? `Toxicity Information: ${plant.knownToxicity}` : '';

      // Properties badges
      if (propsEl && plant.medicinalProperties) {
        propsEl.innerHTML = plant.medicinalProperties.map(p => 
          `<span style="background: rgba(201,122,58,0.12); color: #8B4513; padding: 0.35rem 0.75rem; border-radius: 8px; font-size: 0.82rem; font-weight: 600;">${p}</span>`
        ).join('');
      }

      // Hook up Save Favorite action
      const favBtn = document.getElementById('save-favorite-btn');
      const favLabel = document.getElementById('fav-btn-label');
      if (favBtn && favLabel) {
        favBtn.onclick = async () => {
          try {
            await fetch(`${API_BASE}/api/favorites`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plantId: plant.plantId })
            });
            favLabel.textContent = 'Saved to Favorites!';
            favBtn.style.background = '#EBF7F0';
            favBtn.style.color = '#15803D';
          } catch (e) {
            console.error('Error saving favorite:', e);
          }
        };
      }

      // Re-initialize icons
      placeholderResult.style.display = 'block';
      if (window.lucide) window.lucide.createIcons();

      // Scroll to view
      placeholderResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- 5. Camera Modal / Stream Support ---
  const cameraModal = document.getElementById('camera-modal');
  const closeCameraBtn = document.getElementById('close-camera-modal-btn');
  const snapPhotoBtn = document.getElementById('snap-photo-btn');
  const videoStream = document.getElementById('camera-stream');
  let mediaStream = null;

  if (openCameraBtn) {
    openCameraBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      // If browser supports getUserMedia, open live video modal
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
          });
          if (videoStream) {
            videoStream.srcObject = mediaStream;
            cameraModal.classList.add('active');
          }
        } catch (err) {
          console.warn('Camera access denied or unavailable, falling back to file input:', err);
          if (cameraInput) cameraInput.click();
        }
      } else if (cameraInput) {
        cameraInput.click();
      }
    });
  }

  function stopCameraStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (cameraModal) {
      cameraModal.classList.remove('active');
    }
  }

  if (closeCameraBtn) {
    closeCameraBtn.addEventListener('click', stopCameraStream);
  }

  if (cameraModal) {
    cameraModal.addEventListener('click', (e) => {
      if (e.target === cameraModal) {
        stopCameraStream();
      }
    });
  }

  if (snapPhotoBtn && videoStream) {
    snapPhotoBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = videoStream.videoWidth || 640;
      canvas.height = videoStream.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], `camera_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopCameraStream();
        handleSelectedFile(file);
      }, 'image/jpeg');
    });
  }

  // --- 6. Featured Plants "View Plant" Modal ---
  const plantModal = document.getElementById('plant-modal');
  const plantModalClose = document.getElementById('plant-modal-close');
  const plantModalTitle = document.getElementById('plant-modal-title');
  const plantModalSci = document.getElementById('plant-modal-sci');
  const plantModalDesc = document.getElementById('plant-modal-desc');
  const plantModalImg = document.getElementById('plant-modal-img');

  const plantData = {
    tulsi: {
      name: 'Tulsi (Holy Basil)',
      sci: 'Ocimum sanctum',
      img: 'assets/images/tulsi_real.jpg',
      desc: 'Known as the "Queen of Herbs", Tulsi is an adaptogenic herb revered in traditional Ayurvedic medicine for its potent respiratory, antimicrobial, and stress-relieving properties.'
    },
    neem: {
      name: 'Neem',
      sci: 'Azadirachta indica',
      img: 'assets/images/neem_real.jpg',
      desc: 'Celebrated for its broad-spectrum antimicrobial, antifungal, and anti-inflammatory attributes. Its leaves and bark have been utilized for millennia in skin and dental wellness.'
    },
    aloe: {
      name: 'Aloe Vera',
      sci: 'Aloe barbadensis Miller',
      img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
      desc: 'A succulent rich in acemannan, vitamins, and antioxidants. Widely used for thermal soothing, dermal barrier regeneration, and metabolic support.'
    },
    ashwagandha: {
      name: 'Ashwagandha',
      sci: 'Withania somnifera',
      img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      desc: 'A revered restorative Rasayana herb in Ayurveda, known for modulating cortisol, supporting cognitive clarity, and boosting cellular vitality.'
    },
    moringa: {
      name: 'Moringa (Drumstick Tree)',
      sci: 'Moringa oleifera',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      desc: 'A nutrient-dense superfood herb containing 7x more Vitamin C than oranges and dense polyphenol antioxidants that combat oxidative stress.'
    },
    mint: {
      name: 'Mint (Peppermint)',
      sci: 'Mentha piperita',
      img: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80',
      desc: 'A cooling therapeutic aromatic herb high in menthol, widely recognized for digestive easing, respiratory decongestion, and antispasmodic effects.'
    }
  };

  document.querySelectorAll('.view-plant-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plantKey = e.currentTarget.getAttribute('data-plant');
      const plant = plantData[plantKey];
      if (plant && plantModal) {
        if (plantModalTitle) plantModalTitle.textContent = plant.name;
        if (plantModalSci) plantModalSci.textContent = plant.sci;
        if (plantModalDesc) plantModalDesc.textContent = plant.desc;
        if (plantModalImg) plantModalImg.src = plant.img;
        plantModal.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  if (plantModalClose) {
    plantModalClose.addEventListener('click', () => {
      plantModal.classList.remove('active');
    });
  }

  if (plantModal) {
    plantModal.addEventListener('click', (e) => {
      if (e.target === plantModal) {
        plantModal.classList.remove('active');
      }
    });
  }

  // --- 7. Smooth Scroll for Internal Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 8. Authentication (Login & Register) Modal Controller ---
  const authModal = document.getElementById('auth-modal');
  const authModalClose = document.getElementById('auth-modal-close');
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');
  const mobileRegisterBtn = document.getElementById('mobile-register-btn');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authTitle = document.getElementById('auth-modal-title');
  const authSubtitle = document.getElementById('auth-modal-subtitle');
  const authNameGroup = document.getElementById('auth-name-group');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authAlert = document.getElementById('auth-alert');
  const authForm = document.getElementById('auth-form');
  const userProfileBadge = document.getElementById('user-profile-badge');
  const userDisplayName = document.getElementById('user-display-name');
  const logoutBtn = document.getElementById('logout-btn');

  let currentAuthMode = 'login'; // 'login' or 'register'

  function openAuthModal(mode) {
    currentAuthMode = mode;
    authAlert.style.display = 'none';
    if (mode === 'login') {
      tabLogin.style.background = '#FFFFFF';
      tabLogin.style.color = '#2C1A0E';
      tabLogin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      tabRegister.style.background = 'transparent';
      tabRegister.style.color = '#6B3F1F';
      tabRegister.style.boxShadow = 'none';

      authTitle.textContent = 'Welcome Back';
      authSubtitle.textContent = 'Sign in to your botanical research account';
      authNameGroup.style.display = 'none';
      authSubmitBtn.innerHTML = '<span>Sign In</span>';
    } else {
      tabRegister.style.background = '#FFFFFF';
      tabRegister.style.color = '#2C1A0E';
      tabRegister.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#6B3F1F';
      tabLogin.style.boxShadow = 'none';

      authTitle.textContent = 'Create Account';
      authSubtitle.textContent = 'Join the MedLeaf AI botanical platform';
      authNameGroup.style.display = 'block';
      authSubmitBtn.innerHTML = '<span>Create Account</span>';
    }
    authModal.style.display = 'flex';
    authModal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeAuthModal() {
    authModal.style.display = 'none';
    authModal.classList.remove('active');
  }

  if (navLoginBtn) navLoginBtn.addEventListener('click', () => openAuthModal('login'));
  if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openAuthModal('register'));
  if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => openAuthModal('login'));
  if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', () => openAuthModal('register'));
  if (tabLogin) tabLogin.addEventListener('click', () => openAuthModal('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => openAuthModal('register'));
  if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  // Restore authenticated session from localStorage
  const storedUser = localStorage.getItem('medleaf_user');
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      setAuthenticatedUser(u);
    } catch (e) {}
  }

  function setAuthenticatedUser(user) {
    if (navLoginBtn) navLoginBtn.style.display = 'none';
    if (navRegisterBtn) navRegisterBtn.style.display = 'none';
    if (userProfileBadge) {
      userProfileBadge.style.display = 'inline-flex';
      userDisplayName.textContent = user.name || user.email;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('medleaf_user');
      localStorage.removeItem('medleaf_token');
      if (userProfileBadge) userProfileBadge.style.display = 'none';
      if (navLoginBtn) navLoginBtn.style.display = 'inline-flex';
      if (navRegisterBtn) navRegisterBtn.style.display = 'inline-flex';
    });
  }

  // Handle Auth Form Submission
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authAlert.style.display = 'none';
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const name = document.getElementById('auth-name').value;

      authSubmitBtn.disabled = true;
      authSubmitBtn.innerHTML = '<span>Processing...</span>';

      const endpoint = currentAuthMode === 'login' ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const payload = currentAuthMode === 'login' ? { email, password } : { name, email, password };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        authSubmitBtn.disabled = false;
        authSubmitBtn.innerHTML = currentAuthMode === 'login' ? '<span>Sign In</span>' : '<span>Create Account</span>';

        if (!data.success) {
          authAlert.style.display = 'block';
          authAlert.style.background = 'rgba(239, 68, 68, 0.12)';
          authAlert.style.color = '#B91C1C';
          authAlert.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          authAlert.textContent = data.message || 'Authentication error.';
          return;
        }

        authAlert.style.display = 'block';
        authAlert.style.background = 'rgba(46, 179, 105, 0.15)';
        authAlert.style.color = '#15803D';
        authAlert.style.border = '1px solid rgba(46, 179, 105, 0.3)';
        authAlert.textContent = data.message || 'Success!';

                if (currentAuthMode === 'login') {
          localStorage.setItem('medleaf_user', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('medleaf_token', data.token);
          setAuthenticatedUser(data.user);
          
          setTimeout(() => {
            closeAuthModal();
            // Directly navigate to full dedicated User Dashboard
            window.location.href = '/dashboard/';
          }, 400);
        } else {
          // If registered successfully, automatically switch to login tab
          setTimeout(() => { openAuthModal('login'); }, 1000);
        }
      } catch (err) {
        authSubmitBtn.disabled = false;
        authSubmitBtn.innerHTML = currentAuthMode === 'login' ? '<span>Sign In</span>' : '<span>Create Account</span>';
        authAlert.style.display = 'block';
        authAlert.style.background = 'rgba(239, 68, 68, 0.12)';
        authAlert.style.color = '#B91C1C';
        authAlert.textContent = 'Server connection failed. Please verify your connection or try again.';
      }
    });
  }

  // --- 9. Dashboard Dynamic Data & Actions ---
  const dashRefreshBtn = document.getElementById('dash-refresh-btn');
  const dashPlantsCount = document.getElementById('kpi-plants-count');
  const dashNutsCount = document.getElementById('kpi-nuts-count');
  const dashQuickNutBtn = document.getElementById('dash-quick-nut-btn');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const dashHistoryList = document.getElementById('dash-history-list');

  async function fetchDashboardMetrics() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json();
      if (dashPlantsCount && data.plantClassesCount) dashPlantsCount.textContent = data.plantClassesCount;
      if (dashNutsCount && data.nutClassesCount) dashNutsCount.textContent = data.nutClassesCount;
    } catch (e) {
      console.log('Using cached dashboard counters');
    }
  }

  fetchDashboardMetrics();
  if (dashRefreshBtn) dashRefreshBtn.addEventListener('click', fetchDashboardMetrics);

  if (clearHistoryBtn && dashHistoryList) {
    clearHistoryBtn.addEventListener('click', () => {
      dashHistoryList.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #9C7A5A; font-size: 0.9rem;">No scans recorded yet. Perform a scan above!</div>';
    });
  }

  if (dashQuickNutBtn) {
    dashQuickNutBtn.addEventListener('click', () => {
      const uploadSec = document.getElementById('upload-section');
      if (uploadSec) uploadSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
});


