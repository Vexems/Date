/**
 * ========================================================
 * Special Date Invitation for Sofochka
 * Toro Inoue x Heaven Official's Blessing (TGCF)
 * ========================================================
 */

// ====== ПЕРСОНАЛЬНЫЕ НАСТРОЙКИ ======
const CONFIG = {
  girlfriendName: 'Софа', // Имя любимой
  myTelegramUsername: 'Vexems', // Твой ник в Telegram (@Vexems)
  restaurantName: 'Ресторан «Andy Woo» 🥢'
};

document.addEventListener('DOMContentLoaded', () => {
  // Сохраняем ник в хранилище для надёжности
  localStorage.setItem('date_tg_username', CONFIG.myTelegramUsername);

  // --- State ---
  const state = {
    partnerName: CONFIG.girlfriendName,
    date: '',
    time: '19:00',
    location: CONFIG.restaurantName,
    isCustomLocation: false,
    customLocationText: '',
    wishes: [],
    customWish: '',
    tgUsername: CONFIG.myTelegramUsername,
    isMusicPlaying: false,
    pleadingCount: 0
  };

  // --- Elements ---
  const steps = {
    envelope: document.getElementById('step-envelope'),
    question: document.getElementById('step-question'),
    datetime: document.getElementById('step-datetime'),
    location: document.getElementById('step-location'),
    wishes: document.getElementById('step-wishes'),
    ticket: document.getElementById('step-ticket')
  };

  const interactiveImg = document.getElementById('toro-interactive-img');
  const speechBubble = document.getElementById('toro-speech-bubble');
  const maybeBtn = document.getElementById('btn-maybe');
  const yesBtn = document.getElementById('btn-yes');
  const maybeReaction = document.getElementById('maybe-reaction');

  const dateInput = document.getElementById('date-input');
  const customTimeInput = document.getElementById('custom-time-input');
  const timeChips = document.querySelectorAll('.time-chip');
  const dateChips = document.querySelectorAll('.chip-btn');

  const optionAndyWoo = document.getElementById('option-andy-woo');
  const optionCustomPlace = document.getElementById('option-custom-place');
  const customPlaceInput = document.getElementById('custom-place-input');

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const copyToast = document.getElementById('copy-toast');

  // --- Step Navigation & Transitions Engine ---
  const stepOrder = ['envelope', 'question', 'datetime', 'location', 'wishes', 'ticket'];
  let currentStepName = 'envelope';
  let isNavigating = false;

  function goToStep(targetStepName, forcedDirection = null) {
    if (isNavigating || targetStepName === currentStepName) return;

    const currentIndex = stepOrder.indexOf(currentStepName);
    const targetIndex = stepOrder.indexOf(targetStepName);
    const direction = forcedDirection || (targetIndex > currentIndex ? 'forward' : 'backward');

    // Special scroll unrolling transition from Step 1 to Step 2
    if (currentStepName === 'envelope' && targetStepName === 'question') {
      triggerScrollUnrollTransition();
      return;
    }

    isNavigating = true;
    const currentEl = steps[currentStepName];
    const targetEl = steps[targetStepName];

    if (targetStepName === 'ticket') {
      playCelebrationFanfare();
    } else {
      playTransitionChime(direction);
    }

    function applyDomSwitch() {
      Object.values(steps).forEach(s => {
        if (s) {
          s.classList.remove(
            'active', 
            'slide-in-right', 
            'slide-in-left', 
            'slide-out-left', 
            'slide-out-right', 
            'unrolling-reveal', 
            'scroll-exit-fade'
          );
        }
      });
      if (targetEl) {
        targetEl.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      currentStepName = targetStepName;
    }

    // Modern View Transitions API (Directional Navigation)
    if (document.startViewTransition) {
      try {
        const vt = document.startViewTransition({
          update: applyDomSwitch,
          types: [direction]
        });
        vt.finished.finally(() => {
          isNavigating = false;
        });
        return;
      } catch (_) {
        try {
          const vt = document.startViewTransition(applyDomSwitch);
          vt.finished.finally(() => {
            isNavigating = false;
          });
          return;
        } catch (_) {}
      }
    }

    // High performance CSS class transition fallback
    const outClass = direction === 'forward' ? 'slide-out-left' : 'slide-out-right';
    const inClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

    if (currentEl) currentEl.classList.add(outClass);
    if (targetEl) {
      targetEl.classList.add('active', inClass);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      applyDomSwitch();
      isNavigating = false;
    }, 380);
  }

  // Backward-compatibility alias
  function showStep(stepName, direction = null) {
    goToStep(stepName, direction);
  }

  // --- SPECIAL SCROLL UNROLLING SEQUENCE ---
  function triggerScrollUnrollTransition() {
    isNavigating = true;
    const sealedScroll = document.getElementById('sealed-scroll-preview');
    const openBtn = document.getElementById('open-envelope-btn');
    const envCard = document.querySelector('.envelope-card');

    if (sealedScroll) sealedScroll.classList.add('breaking-seal');
    if (envCard) envCard.classList.add('card-unrolling');
    if (openBtn) {
      openBtn.classList.add('btn-opening');
      const btnText = openBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Распечатываем свиток... ✨';
    }

    playSealBreakSound();

    // Calculate center of the wax seal for particle explosion
    let burstX = window.innerWidth / 2;
    let burstY = window.innerHeight * 0.45;
    const waxSealEl = document.querySelector('.wax-seal');
    if (waxSealEl) {
      const rect = waxSealEl.getBoundingClientRect();
      burstX = rect.left + rect.width / 2;
      burstY = rect.top + rect.height / 2;
    }
    launchButterfliesBurst(burstX, burstY);

    setTimeout(() => {
      const envStep = steps.envelope;
      if (envStep) {
        envStep.classList.remove('active');
      }
      if (envCard) {
        envCard.classList.remove('card-unrolling');
      }

      const questionStep = steps.question;
      if (questionStep) {
        questionStep.classList.add('active', 'unrolling-reveal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      currentStepName = 'question';

      playPaperUnrollSound();
      startAmbientMusic();

      // Extra flurry of butterflies as scroll unfurls
      launchButterfliesBurst(window.innerWidth / 2, window.innerHeight * 0.35);

      setTimeout(() => {
        if (questionStep) {
          questionStep.classList.remove('unrolling-reveal');
        }
        isNavigating = false;
      }, 950);
    }, 420);
  }

  // --- STEP 1: OPEN ENVELOPE / UNSEAL SCROLL ---
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const sealedScrollPreview = document.getElementById('sealed-scroll-preview');

  if (openEnvelopeBtn) {
    openEnvelopeBtn.addEventListener('click', () => {
      goToStep('question', 'forward');
    });
  }

  if (sealedScrollPreview) {
    sealedScrollPreview.addEventListener('click', () => {
      goToStep('question', 'forward');
    });
    sealedScrollPreview.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToStep('question', 'forward');
      }
    });
  }

  // --- STEP 2: QUESTION & TORO INTERACTIONS ---
  yesBtn.addEventListener('click', () => {
    launchButterfliesBurst(window.innerWidth / 2, window.innerHeight / 2);
    goToStep('datetime', 'forward');
  });

  const toroCatPhrases = [
    'Мяу... Софа, ну пожалуйста, не думай слишком долго! 🥺',
    'Пожалуйста-пожалуйста! Без тебя этот вечер будет таким грустным! ',
    'Ура-а-а! Я знал, что ты согласишься! 🐾💖'
  ];

  const narratorPhrases = [
    'Торо прижал ушки и смотрит прямо в сердце... Ты же не сможешь отказать? 🥺👉👈',
    'Его лапки дрожат от надежды... Нажми «Да»! 💕',
    'Торо радостно мурчит и прыгает от счастья! Нажми на кнопку! 🥰'
  ];

  // Progressive button texts
  const maybeButtonSteps = [
    '<span class="btn-emoji">🤔</span><span>Может, ещё подумаю...</span>',
    '<span class="btn-emoji">🫣</span><span>Ну ещё капельку подумаю...</span>'
  ];

  // Preload interactive GIFs for instant switching without lag
  const gifPreloadList = [
    'images/toro_roses_run.gif',
    'images/toro_hero.gif',
    'images/toro_plead_pray.gif',
    'images/toro_sad_cry.gif',
    'images/toro_yippee.gif'
  ];
  gifPreloadList.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let isPleadingThrottled = false;

  function triggerPleading() {
    if (isPleadingThrottled) return;
    isPleadingThrottled = true;
    setTimeout(() => { isPleadingThrottled = false; }, 400);

    state.pleadingCount++;
    const count = state.pleadingCount;

    // Add lovely pulse to YES button
    yesBtn.classList.add('pulsing');

    // Trigger cute wobble on Toro's image container
    const imgWrapper = document.querySelector('.image-wrapper');
    if (imgWrapper) {
      imgWrapper.classList.remove('toro-react-wobble');
      void imgWrapper.offsetWidth; // trigger reflow
      imgWrapper.classList.add('toro-react-wobble');
    }

    if (count === 1) {
      // 1-й клик: Торо умоляет, сложив лапки перед собой (toro_plead_pray.gif)
      interactiveImg.src = 'images/toro_plead_pray.gif';
      maybeBtn.innerHTML = maybeButtonSteps[0];
      
      speechBubble.style.opacity = '0';
      setTimeout(() => {
        speechBubble.textContent = toroCatPhrases[0];
        speechBubble.style.opacity = '1';
      }, 150);

      maybeReaction.classList.remove('hidden');
      const reactionTextEl = maybeReaction.querySelector('.reaction-text');
      reactionTextEl.style.opacity = '0';
      setTimeout(() => {
        reactionTextEl.textContent = narratorPhrases[0];
        reactionTextEl.style.opacity = '1';
      }, 150);

    } else if (count === 2) {
      // 2-й клик: Торо по-настоящему грустный, плачет и держится за голову (toro_sad_cry.gif)
      interactiveImg.src = 'images/toro_sad_cry.gif';
      maybeBtn.innerHTML = maybeButtonSteps[1];

      speechBubble.style.opacity = '0';
      setTimeout(() => {
        speechBubble.textContent = toroCatPhrases[1];
        speechBubble.style.opacity = '1';
      }, 150);

      const reactionTextEl = maybeReaction.querySelector('.reaction-text');
      reactionTextEl.style.opacity = '0';
      setTimeout(() => {
        reactionTextEl.textContent = narratorPhrases[1];
        reactionTextEl.style.opacity = '1';
      }, 150);

    } else {
      // 3-й клик: после этого Торо прыгает от счастья (toro_yippee.gif) и кнопка превращается в согласие
      maybeBtn.style.display = 'none';
      yesBtn.style.width = '100%';
      yesBtn.style.flex = '1';
      yesBtn.innerHTML = '<span class="btn-emoji">💖</span><span>Ура! Конечно, я согласна! ✨🐾</span>';
      
      speechBubble.textContent = toroCatPhrases[2];
      interactiveImg.src = 'images/toro_yippee.gif';
      launchButterfliesBurst(window.innerWidth / 2, window.innerHeight / 2);

      const reactionTextEl = maybeReaction.querySelector('.reaction-text');
      reactionTextEl.textContent = narratorPhrases[2];
    }
  }

  // Only trigger on explicit click to prevent phrases flashing on hover
  maybeBtn.addEventListener('click', triggerPleading);

  // --- STEP 3: DATE & TIME LOGIC ---
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // Default to tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tY = tomorrow.getFullYear();
  const tM = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const tD = String(tomorrow.getDate()).padStart(2, '0');
  dateInput.value = `${tY}-${tM}-${tD}`;
  state.date = dateInput.value;

  dateInput.addEventListener('change', (e) => {
    state.date = e.target.value;
    dateChips.forEach(c => c.classList.remove('active'));
  });

  // Quick Date Chips
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const type = chip.getAttribute('data-days');
      const target = new Date();

      if (type === '0') {
        // today
      } else if (type === '1') {
        target.setDate(target.getDate() + 1);
      } else if (type === 'friday') {
        const day = target.getDay();
        const diff = (5 - day + 7) % 7 || 7;
        target.setDate(target.getDate() + diff);
      } else if (type === 'saturday') {
        const day = target.getDay();
        const diff = (6 - day + 7) % 7 || 7;
        target.setDate(target.getDate() + diff);
      }

      const formated = target.toISOString().split('T')[0];
      dateInput.value = formated;
      state.date = formated;
      playChime(650, 0.08);
    });
  });

  // Time preset chips
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const chosenTime = chip.getAttribute('data-time');
      customTimeInput.value = chosenTime;
      state.time = chosenTime;
      playChime(580, 0.08);
    });
  });

  customTimeInput.addEventListener('change', (e) => {
    state.time = e.target.value;
    timeChips.forEach(c => c.classList.remove('active'));
  });

  document.getElementById('btn-back-to-question').addEventListener('click', () => goToStep('question', 'backward'));
  document.getElementById('btn-next-to-location').addEventListener('click', () => {
    if (!state.date) {
      dateInput.focus();
      return;
    }
    goToStep('location', 'forward');
  });

  // --- STEP 4: LOCATION SELECTION (Andy Woo vs Custom) ---
  function selectAndyWoo() {
    state.isCustomLocation = false;
    state.location = CONFIG.restaurantName;
    optionAndyWoo.classList.add('selected');
    optionCustomPlace.classList.remove('selected');
    playChime(600, 0.08);
  }

  function selectCustomPlace(shouldFocus = true) {
    state.isCustomLocation = true;
    optionCustomPlace.classList.add('selected');
    optionAndyWoo.classList.remove('selected');
    if (shouldFocus && document.activeElement !== customPlaceInput) {
      customPlaceInput.focus();
    }
    playChime(600, 0.08);
  }

  optionAndyWoo.addEventListener('click', selectAndyWoo);
  optionCustomPlace.addEventListener('click', () => selectCustomPlace(true));

  customPlaceInput.addEventListener('focus', () => selectCustomPlace(false));
  customPlaceInput.addEventListener('input', (e) => {
    state.isCustomLocation = true;
    optionCustomPlace.classList.add('selected');
    optionAndyWoo.classList.remove('selected');
    state.customLocationText = e.target.value;
  });

  document.getElementById('btn-back-to-datetime').addEventListener('click', () => goToStep('datetime', 'backward'));
  document.getElementById('btn-next-to-wishes').addEventListener('click', () => {
    if (state.isCustomLocation) {
      const val = customPlaceInput.value.trim();
      state.location = val ? `Особенное место: ${val}` : 'Секретное желание Софы ✨';
    } else {
      state.location = CONFIG.restaurantName;
    }
    goToStep('wishes', 'forward');
  });

  // --- STEP 5: WISHES SELECTION ---
  document.getElementById('btn-back-to-location').addEventListener('click', () => goToStep('location', 'backward'));
  document.getElementById('btn-create-ticket').addEventListener('click', () => {
    // Gather wishes
    const checkedBoxes = document.querySelectorAll('input[name="wish"]:checked');
    state.wishes = Array.from(checkedBoxes).map(cb => cb.value);
    state.customWish = document.getElementById('custom-wish-text').value.trim();

    buildFinalTicket();
    goToStep('ticket', 'forward');
    launchButterfliesBurst(window.innerWidth / 2, window.innerHeight * 0.4);
  });

  // --- STEP 6: BUILD TICKET & TELEGRAM LINK ---
  function formatDateRussian(dateStr) {
    if (!dateStr) return 'В любой день';
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const str = dateObj.toLocaleDateString('ru-RU', options);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function buildFinalTicket() {
    const formattedDate = formatDateRussian(state.date);
    document.getElementById('sum-name').textContent = `Прекрасная ${state.partnerName} 🌸`;
    document.getElementById('sum-date').textContent = formattedDate;
    document.getElementById('sum-time').textContent = state.time;
    document.getElementById('sum-location').textContent = state.location;

    let wishesSummary = state.wishes.join(', ');
    if (state.customWish) {
      wishesSummary += (wishesSummary ? ' + ' : '') + `«${state.customWish}»`;
    }
    if (!wishesSummary) wishesSummary = 'Просто уют и улыбки 🌸';
    document.getElementById('sum-wishes').textContent = wishesSummary;

    // Build Telegram text
    const tgText = 
`💌 Ответ от ${state.partnerName} на приглашение! 🌸

💖 Ответ: «Да, я иду на свидание!»
📅 Дата: ${formattedDate}
⏰ Время: ${state.time}
📍 Место: ${state.location}
✨ Пожелания:
${state.wishes.length > 0 ? state.wishes.map(w => '• ' + w).join('\n') : '• Самый тёплый вечер вдвоём 💖'}${state.customWish ? '\n• Лично от Софы: ' + state.customWish : ''}

🏮 «Для тебя я зажгу три тысячи фонарей...» ✨🐾`;

    const sendTgBtn = document.getElementById('btn-send-tg');
    const targetUser = (state.tgUsername || CONFIG.myTelegramUsername || 'Vexems').replace('@', '').trim();
    sendTgBtn.href = `https://t.me/${targetUser}?text=${encodeURIComponent(tgText)}`;
    sendTgBtn.target = '_blank';

    // Copy Ticket Button
    const copyBtn = document.getElementById('btn-copy-ticket');
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(tgText).then(() => {
        copyToast.classList.remove('hidden');
        setTimeout(() => copyToast.classList.add('hidden'), 3500);
      });
    };

    // Fireworks Button
    document.getElementById('btn-launch-fireworks').onclick = () => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          launchButterfliesBurst(
            Math.random() * window.innerWidth,
            Math.random() * (window.innerHeight * 0.6)
          );
        }, i * 280);
      }
    };
  }

  // ========================================================
  // AMBIENT PARTICLES (Sky Lanterns & Silver Butterflies)
  // ========================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const lanterns = [];
  const butterflies = [];
  const petals = [];
  const bursts = [];

  // Initialize Lanterns
  for (let i = 0; i < 18; i++) {
    lanterns.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 16 + Math.random() * 18,
      speedY: 0.35 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      alpha: 0.35 + Math.random() * 0.5
    });
  }

  // Initialize Silver Butterflies (死蝶)
  for (let i = 0; i < 9; i++) {
    butterflies.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      wingAngle: 0,
      wingSpeed: 0.15 + Math.random() * 0.1,
      scale: 0.6 + Math.random() * 0.6,
      glow: Math.random() * 0.5 + 0.5
    });
  }

  // Soft Sakura Petals
  for (let i = 0; i < 15; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speedY: 0.6 + Math.random() * 0.8,
      speedX: 0.4 + Math.random() * 0.5,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 1.5,
      size: 6 + Math.random() * 6
    });
  }

  function launchButterfliesBurst(originX, originY) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      bursts.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        size: 5 + Math.random() * 6,
        wing: 0
      });
    }
    playChime(880, 0.15);
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Floating Sky Lanterns
    lanterns.forEach(l => {
      l.y -= l.speedY;
      l.sway += l.swaySpeed;
      const drawX = l.x + Math.sin(l.sway) * 14;

      if (l.y < -50) {
        l.y = height + 40;
        l.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = l.alpha;
      // Lantern Glow
      const glowGrad = ctx.createRadialGradient(drawX, l.y, 2, drawX, l.y, l.size * 1.8);
      glowGrad.addColorStop(0, 'rgba(255, 214, 102, 0.8)');
      glowGrad.addColorStop(0.5, 'rgba(235, 94, 40, 0.3)');
      glowGrad.addColorStop(1, 'rgba(235, 94, 40, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(drawX, l.y, l.size * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Lantern Body
      ctx.fillStyle = '#ff9e00';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(drawX - l.size * 0.35, l.y - l.size * 0.5, l.size * 0.7, l.size, 4);
      } else {
        ctx.rect(drawX - l.size * 0.35, l.y - l.size * 0.5, l.size * 0.7, l.size);
      }
      ctx.fill();

      // Core Flame
      ctx.fillStyle = '#fff9db';
      ctx.beginPath();
      ctx.arc(drawX, l.y + l.size * 0.15, l.size * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // 2. Draw Sakura Petals
    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.angle * 0.05) * p.speedX;
      p.angle += p.spin;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = 'rgba(255, 182, 193, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Draw Silver Phantom Butterflies
    butterflies.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.wingAngle += b.wingSpeed;

      // Wrap edges smoothly
      if (b.x < -30) b.x = width + 20;
      if (b.x > width + 30) b.x = -20;
      if (b.y < -30) b.y = height + 20;
      if (b.y > height + 30) b.y = -20;

      const rawSpan = Math.sin(b.wingAngle) * b.scale * 12;
      const absWing = Math.max(0.2, Math.abs(rawSpan));

      ctx.save();
      ctx.translate(b.x, b.y);

      // Silver glow
      ctx.shadowColor = 'rgba(186, 230, 253, 0.9)';
      ctx.shadowBlur = 12;

      ctx.fillStyle = 'rgba(240, 249, 255, 0.85)';
      // Left Wing
      ctx.beginPath();
      ctx.ellipse(-absWing * 0.6, 0, absWing, b.scale * 10, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Right Wing
      ctx.beginPath();
      ctx.ellipse(absWing * 0.6, 0, absWing, b.scale * 10, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -b.scale * 6, 2, b.scale * 12);

      ctx.restore();
    });

    // 4. Draw Butterfly Bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      const burst = bursts[i];
      burst.x += burst.vx;
      burst.y += burst.vy;
      burst.vy += 0.05; // slight gravity
      burst.alpha -= burst.decay;
      burst.wing += 0.3;

      if (burst.alpha <= 0) {
        bursts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = burst.alpha;
      ctx.shadowColor = '#90caf9';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#e0f2fe';

      const w = Math.max(0.5, Math.abs(Math.sin(burst.wing) * burst.size));
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, w, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animateCanvas);
  }
  requestAnimationFrame(animateCanvas);

  // ========================================================
  // SOOTHING WEB AUDIO AMBIENCE (No external mp3 needed)
  // Traditional pentatonic chimes & soothing lullaby
  // ========================================================
  let audioCtx = null;
  let musicInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq, duration = 0.3) {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  // Crystalline seal breaking chime
  function playSealBreakSound() {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      [1174.66, 1567.98, 2093.00, 2349.32].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.38);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.38);
      });
    } catch (_) {}
  }

  // Soft unrolling scroll swoosh chime
  function playPaperUnrollSound() {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      [440.00, 554.37, 659.25, 880.00].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch (_) {}
  }

  // Directional navigation chimes
  function playTransitionChime(direction = 'forward') {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      const notes = direction === 'forward' ? [587.33, 783.99] : [659.25, 493.88];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch (_) {}
  }

  // Royal imperial celebratory fanfare
  function playCelebrationFanfare() {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      [440.0, 523.25, 659.25, 880.0, 1046.5].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.12, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.65);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.65);
      });
    } catch (_) {}
  }

  // Traditional pentatonic scale: D4, F4, G4, A4, C5, D5, F5
  const melodyNotes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46];

  function startAmbientMusic() {
    initAudio();
    if (state.isMusicPlaying) return;
    state.isMusicPlaying = true;
    musicToggleBtn.querySelector('.btn-label').textContent = 'Музыка: Вкл 🎵';

    let stepIdx = 0;
    musicInterval = setInterval(() => {
      if (!state.isMusicPlaying) return;
      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      playChime(note, 1.4);

      if (stepIdx % 3 === 0) {
        setTimeout(() => {
          if (state.isMusicPlaying) playChime(note * 0.5, 2.0);
        }, 300);
      }
      stepIdx++;
    }, 1800);
  }

  function stopAmbientMusic() {
    state.isMusicPlaying = false;
    musicToggleBtn.querySelector('.btn-label').textContent = 'Музыка: Выкл';
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  musicToggleBtn.addEventListener('click', () => {
    if (state.isMusicPlaying) {
      stopAmbientMusic();
    } else {
      startAmbientMusic();
    }
  });

});
