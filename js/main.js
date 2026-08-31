/**
 * MEADLEAF - Modern AI Medicinal Plant Identification Platform
 * Interactive Landing Page JavaScript
 */

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

  // Handle selected file validation & render preview
  function handleSelectedFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) {
        previewImg.src = e.target.result;
      }
      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }
      if (fileSizeDisplay) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        fileSizeDisplay.textContent = `${sizeInMb} MB • Ready for AI Inference`;
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
    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
    if (uploadIdleState) uploadIdleState.style.display = 'flex';
    if (uploadPreviewState) uploadPreviewState.style.display = 'none';
    if (analysisProgressCard) analysisProgressCard.style.display = 'none';
    if (placeholderResult) placeholderResult.style.display = 'none';
  }

  // --- 4. Simulated AI Analysis Flow ---
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      runSimulatedAnalysis();
    });
  }

  function runSimulatedAnalysis() {
    uploadPreviewState.style.display = 'none';
    analysisProgressCard.style.display = 'block';
    if (placeholderResult) placeholderResult.style.display = 'none';
    if (progressBarFill) progressBarFill.style.width = '0%';

    const steps = [
      { text: '01/04: Validating leaf image resolution & contrast...', progress: '25%' },
      { text: '02/04: Preprocessing & extracting botanical venation features...', progress: '55%' },
      { text: '03/04: Running deep neural convolutional taxonomy classifier...', progress: '85%' },
      { text: '04/04: Analysis complete. Prediction model interface ready.', progress: '100%' }
    ];

    let currentStep = 0;
    analysisStepText.textContent = steps[0].text;
    progressBarFill.style.width = steps[0].progress;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        analysisStepText.textContent = steps[currentStep].text;
        progressBarFill.style.width = steps[currentStep].progress;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (placeholderResult) {
            placeholderResult.style.display = 'block';
            if (window.lucide) window.lucide.createIcons();
          }
        }, 500);
      }
    }, 900);
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
});
