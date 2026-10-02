/* Moss & Metal — a tiny, playable field trip */
(() => {
  'use strict';

  const WORLD_W = 640;
  const WORLD_H = 400;
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scene = document.getElementById('sceneShell');
  const hint = document.getElementById('interactionHint');
  const hintKey = hint.querySelector('.keycap');
  const hintText = document.getElementById('interactionText');
  const toastEl = document.getElementById('toast');
  const routeLimitBase = 3;

  const regionData = {
    mosslight: {
      id: 'mosslight', name: 'Mosslight Wilds', sub: 'The old forest is humming again. Follow the amber glow.', level: 'MEADOW 01', weather: 'WARM & BREEZY', caption: 'Somewhere, a tiny bell is ringing.', thumb: 'thumb-forest', thumbIcon: '✿', micro: 'Soft paths · bright little secrets',
      ground: ['#72974d', '#789c50', '#71974e', '#6d9149'], shade: '#416943', accent: '#b5cc71', path: '#c2a56c', pathEdge: '#917648', water: '#558f83', leaf: '#51844d', flower: '#e4d17c',
      trees: [[34,39,21],[111,35,18],[191,43,21],[281,33,22],[374,41,19],[445,32,20],[598,45,24],[28,137,22],[41,238,22],[77,354,23],[157,377,21],[258,376,23],[366,375,22],[459,380,25],[610,363,26],[608,178,21],[586,130,20],[264,129,19],[347,109,18],[387,318,20],[105,211,18],[218,244,16],[312,333,17],[580,236,19],[517,362,18],[527,179,17],[155,102,15],[467,107,17],[60,295,17]],
      stops: [
        { id: 'dewdrop', name: 'Dewdrop Hollow', icon: '✿', x: 139, y: 147, resource: 'dewglass', resourceName: 'Dewglass', rewardIcon: '◈', amount: [3, 5], rarity: 'rare', short: 'Cool dewglass', description: 'A little pool that remembers the rain.' },
        { id: 'sunshard', name: 'Sunshard Shrine', icon: '✧', x: 443, y: 145, resource: 'sunshards', resourceName: 'Sunshards', rewardIcon: '✦', amount: [1, 3], rarity: 'epic', short: 'Warm sunshards', description: 'Old solar glass, still warm to the touch.' },
        { id: 'mothcap', name: 'Mothcap Meadow', icon: '❋', x: 168, y: 304, resource: 'pollen', resourceName: 'Moon pollen', rewardIcon: '✿', amount: [4, 7], rarity: 'common', short: 'Moon pollen', description: 'A very sleepy flower patch.' },
        { id: 'copper', name: 'Copperroot Burrow', icon: '⚙', x: 456, y: 328, resource: 'cogs', resourceName: 'Brass cogs', rewardIcon: '⚙', amount: [4, 8], rarity: 'common', short: 'Old brass cogs', description: 'Something useful, left behind by the roots.' }
      ],
      enemies: [{ x: 241, y: 193, kind: 'sporeling' }, { x: 380, y: 286, kind: 'sporeling' }],
      guardian: { id: 'mossback', name: 'Mossback', title: 'the Mossbound', x: 538, y: 264, hp: 4, text: 'Guardian of this little patch. Try a bonk when you\'re close.', fieldNote: 'A drowsy old beetle who collects the forest’s forgotten sunshards.' }
    },
    orchard: {
      id: 'orchard', name: 'Sunken Orchard', sub: 'An old orchard, knee-deep in kind water and forgotten songs.', level: 'ORCHARD 02', weather: 'MIST & BIRDSong'.toUpperCase(), caption: 'The pears ring softly when the breeze turns.', thumb: 'thumb-orchard', thumbIcon: '✺', micro: 'Floating roots · sweet water',
      ground: ['#779b69', '#80a274', '#77986d', '#71936a'], shade: '#4b7562', accent: '#e6c58a', path: '#c7aa78', pathEdge: '#99815c', water: '#579f9c', leaf: '#60936c', flower: '#f0bb83',
      trees: [[35,41,22],[113,32,20],[207,39,22],[296,32,20],[382,37,22],[475,37,20],[601,43,25],[30,144,20],[42,255,21],[80,360,24],[160,375,20],[261,380,22],[370,374,22],[460,379,24],[609,363,24],[603,170,22],[583,118,20],[263,118,17],[350,106,18],[390,320,20],[104,222,18],[217,251,17],[312,341,18],[566,235,20],[519,359,19],[516,173,17],[152,100,16],[466,99,18],[60,302,17]],
      stops: [
        { id: 'wildpear', name: 'Wildpear Terrace', icon: '✺', x: 143, y: 144, resource: 'pollen', resourceName: 'Pearblossom pollen', rewardIcon: '✺', amount: [4, 7], rarity: 'common', short: 'Pearblossom pollen', description: 'The oldest pear tree has started to bloom.' },
        { id: 'bluewell', name: 'Blueglass Well', icon: '◈', x: 448, y: 143, resource: 'dewglass', resourceName: 'Dewglass', rewardIcon: '◈', amount: [3, 6], rarity: 'rare', short: 'Blue dewglass', description: 'A well full of cool blue light.' },
        { id: 'thimble', name: 'Thimblelight Bank', icon: '✦', x: 165, y: 306, resource: 'sunshards', resourceName: 'Sunshards', rewardIcon: '✦', amount: [1, 3], rarity: 'epic', short: 'Thimblelight shards', description: 'Tiny lantern flowers by the water.' },
        { id: 'rootcellar', name: 'The Root Cellar', icon: '⚙', x: 456, y: 327, resource: 'cogs', resourceName: 'Pearl-bright cogs', rewardIcon: '⚙', amount: [5, 9], rarity: 'common', short: 'Pearl-bright cogs', description: 'A cellar hidden beneath the old roots.' }
      ],
      enemies: [{ x: 239, y: 189, kind: 'dewling' }, { x: 372, y: 288, kind: 'dewling' }],
      guardian: { id: 'tidekeeper', name: 'Pearlback', title: 'the Tidekeeper', x: 536, y: 264, hp: 5, text: 'A patient guardian, keeping an eye on the orchard pool.', fieldNote: 'Pearlback has watched over the flooded orchard since the first rain.' }
    },
    emberfen: {
      id: 'emberfen', name: 'Emberfen Rise', sub: 'The warm crater is waking. Every ember here remembers the sun.', level: 'CRATER 03', weather: 'EMBERFALL & GLOW', caption: 'Even the ash has made a tiny garden.', thumb: 'thumb-fen', thumbIcon: '❋', micro: 'Warm stones · brave little sprouts',
      ground: ['#957957', '#8f7655', '#9b7d58', '#8b7655'], shade: '#645a44', accent: '#d8a26c', path: '#c29d72', pathEdge: '#846950', water: '#8e6f54', leaf: '#677c4b', flower: '#ecaa71',
      trees: [[34,38,21],[111,36,18],[191,44,20],[282,33,21],[374,39,18],[447,31,20],[598,43,24],[29,138,20],[42,240,21],[77,355,22],[157,377,20],[258,378,22],[366,375,21],[460,380,24],[609,363,25],[608,179,21],[586,130,20],[263,129,18],[347,109,17],[387,319,19],[105,212,17],[218,244,16],[312,336,17],[580,237,19],[517,362,18],[527,179,17],[155,101,15],[467,104,17],[60,297,17]],
      stops: [
        { id: 'ashbloom', name: 'Ashbloom Garden', icon: '✺', x: 140, y: 145, resource: 'pollen', resourceName: 'Ashbloom pollen', rewardIcon: '✺', amount: [5, 8], rarity: 'common', short: 'Ashbloom pollen', description: 'Brave little flowers growing in warm ash.' },
        { id: 'emberglass', name: 'Emberglass Shelf', icon: '✦', x: 444, y: 143, resource: 'sunshards', resourceName: 'Emberglass', rewardIcon: '✦', amount: [2, 4], rarity: 'epic', short: 'Emberglass', description: 'Sunshards that cooled slowly in the crater.' },
        { id: 'foxglow', name: 'Foxglow Hollow', icon: '◈', x: 164, y: 307, resource: 'dewglass', resourceName: 'Foxglow dewglass', rewardIcon: '◈', amount: [4, 7], rarity: 'rare', short: 'Foxglow dewglass', description: 'A spring glowing softly beneath the fern.' },
        { id: 'slagroot', name: 'Slagroot Tunnels', icon: '⚙', x: 455, y: 326, resource: 'cogs', resourceName: 'Crater cogs', rewardIcon: '⚙', amount: [6, 10], rarity: 'common', short: 'Crater cogs', description: 'A few good parts in a very old machine.' }
      ],
      enemies: [{ x: 239, y: 192, kind: 'emberling' }, { x: 377, y: 286, kind: 'emberling' }],
      guardian: { id: 'cinderstag', name: 'Cinderstag', title: 'the Ashen Friend', x: 536, y: 264, hp: 6, text: 'A glowing old friend, right at home in the warm crater.', fieldNote: 'Cinderstag has antlers like a little constellation of warm stones.' }
    }
  };

  const regionOrder = ['mosslight', 'orchard', 'emberfen'];
  const stockNames = { cogs: 'Brass cogs', pollen: 'Moon pollen', dewglass: 'Dewglass', sunshards: 'Sunshards' };
  const stockIcons = { cogs: '⚙', pollen: '✿', dewglass: '◈', sunshards: '✦' };
  const guardianHp = { mossback: 4, tidekeeper: 5, cinderstag: 6 };

  const state = {
    regionId: 'mosslight',
    phase: 'day',
    day: 4,
    dayMinutes: 10 * 60 + 24,
    timeAccumulator: 0,
    player: { x: 302, y: 222, target: null, direction: 'down' },
    bot: { x: 331, y: 237 },
    battery: 96,
    routeByRegion: { mosslight: ['dewdrop', 'sunshard'], orchard: ['wildpear', 'bluewell'], emberfen: ['ashbloom', 'emberglass'] },
    stock: { cogs: 88, pollen: 12, dewglass: 0, sunshards: 1 },
    upgrades: { home: 0, garden: 0, battery: 0, treads: 0 },
    packThings: 6,
    keepsakes: [{ name: 'Amberheart Acorn', icon: '♧', rarity: 'epic', count: 1 }],
    collected: {},
    enemyHp: { mosslight: [2, 2], orchard: [2, 2], emberfen: [2, 2] },
    bosses: {
      mossback: { hp: 4, defeated: false },
      tidekeeper: { hp: 5, defeated: false },
      cinderstag: { hp: 6, defeated: false }
    },
    todayGathered: 0,
    questComplete: false,
    pendingNode: null,
    nightStart: 0,
    nightDuration: 6500,
    nightRewards: [],
    nightClaimed: false,
    toastTimer: null,
    floating: [],
    attackAt: 0,
    soundOn: true,
    lastNightMessage: -1,
    lastUiClockMinute: -1
  };

  const keys = new Set();
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const currentRegion = () => regionData[state.regionId];
  const currentRoute = () => state.routeByRegion[state.regionId] || [];
  const currentGuardian = () => currentRegion().guardian;
  const guardianState = (guardian = currentGuardian()) => state.bosses[guardian.id];
  const routeCapacity = () => routeLimitBase + (state.upgrades.home > 0 ? 1 : 0);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const stockTotal = () => Object.values(state.stock).reduce((total, count) => total + count, 0);

  function speakToast(message, duration = 2500) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  let audioContext = null;
  function ping(frequency = 520, duration = .075, wave = 'sine') {
    if (!state.soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(130, frequency * .72), audioContext.currentTime + duration);
      gain.gain.setValueAtTime(.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_) { /* Sound is a nice extra; the game works without it. */ }
  }

  function isRegionOpen(id) {
    return id !== 'emberfen' || state.bosses.mossback.defeated;
  }

  function setScenePalette() {
    const region = currentRegion();
    document.getElementById('regionHeading').textContent = region.name;
    document.getElementById('regionDescription').textContent = region.sub;
    document.getElementById('sceneRegionName').textContent = region.name;
    document.getElementById('sceneLevel').textContent = region.level;
    document.getElementById('sceneWeather').textContent = region.weather;
    document.getElementById('sceneCaption').textContent = region.caption;
    document.getElementById('weatherGlyph').textContent = state.regionId === 'emberfen' ? '☄' : state.regionId === 'orchard' ? '☁' : '☁';
  }

  function renderRegions() {
    const host = document.getElementById('regionList');
    host.innerHTML = regionOrder.map((id, index) => {
      const region = regionData[id];
      const open = isRegionOpen(id);
      const selected = id === state.regionId;
      const stateLabel = selected ? '⌖' : open ? '↗' : '⌑';
      const subline = !open ? '<em>Find Mossback first</em>' : selected ? 'You are here · look around' : region.micro;
      return `<button class="region-card ${selected ? 'is-selected' : ''} ${open ? '' : 'region-locked'}" data-region="${id}" aria-pressed="${selected}" ${open ? '' : 'aria-label="${region.name}, locked until you befriend Mossback"'}>
        <span class="region-thumb ${region.thumb}">${region.thumbIcon}</span>
        <span class="region-card-copy"><strong>${String(index + 1).padStart(2, '0')} &nbsp;${region.name}</strong><small>${subline}</small></span>
        <span class="region-status" aria-hidden="true">${stateLabel}</span>
      </button>`;
    }).join('');
    host.querySelectorAll('[data-region]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.region;
        if (!isRegionOpen(id)) {
          speakToast('That trail opens after Mossback knows you. ♡');
          return;
        }
        if (id !== state.regionId) changeRegion(id);
      });
    });
  }

  function renderRoutes() {
    const region = currentRegion();
    const selected = currentRoute();
    const limit = routeCapacity();
    document.getElementById('routeCount').textContent = `${selected.length}/${limit}`;
    document.getElementById('dayReminder').innerHTML = `<span>✦</span> Pip will follow the <b>${selected.length} ${selected.length === 1 ? 'stop' : 'stops'}</b> you've programmed on the right.`;
    const host = document.getElementById('routeList');
    host.innerHTML = region.stops.map(stop => {
      const active = selected.includes(stop.id);
      const full = selected.length >= limit && !active;
      return `<button type="button" class="route-stop ${active ? 'is-selected' : ''} ${full ? 'is-disabled' : ''}" data-stop="${stop.id}" aria-pressed="${active}" ${state.phase !== 'day' ? 'disabled' : ''}>
        <span class="route-check">${active ? '✓' : ''}</span><span class="route-stop-icon">${stop.icon}</span>
        <span class="route-stop-copy"><strong>${stop.name}</strong><small>${stop.short}</small></span><span class="route-stop-reward">${active ? '→ Pip' : '+'}</span>
      </button>`;
    }).join('');
    host.querySelectorAll('[data-stop]').forEach(button => button.addEventListener('click', () => {
      if (state.phase !== 'day') return;
      const id = button.dataset.stop;
      const route = currentRoute();
      if (route.includes(id)) {
        state.routeByRegion[state.regionId] = route.filter(stopId => stopId !== id);
        ping(425);
      } else if (route.length < routeCapacity()) {
        state.routeByRegion[state.regionId] = [...route, id];
        ping(650);
      } else {
        speakToast(`Pip can visit ${routeCapacity()} stops at a time. A sunroom gives him one more slot.`);
        return;
      }
      renderRoutes();
    }));
  }

  function renderGuardian() {
    const region = currentRegion();
    const guardian = region.guardian;
    const saved = guardianState(guardian);
    const panel = document.getElementById('guardianPanel');
    const maxHp = guardianHp[guardian.id];
    const currentHp = saved.defeated ? 0 : saved.hp;
    const percent = (currentHp / maxHp) * 100;
    document.getElementById('guardianName').textContent = saved.defeated ? `${guardian.name} · friend` : guardian.name;
    document.getElementById('guardianDescription').textContent = saved.defeated ? 'A new friend, now snoozing peacefully by the path.' : guardian.text;
    document.getElementById('guardianHpText').textContent = saved.defeated ? '✦ TRUSTED' : Array.from({ length: maxHp }, (_, index) => index < currentHp ? '♥' : '♡').join(' ');
    document.querySelector('#guardianHealth span').style.width = `${percent}%`;
    document.getElementById('guardianState').textContent = saved.defeated ? 'A GOOD FRIEND' : state.phase === 'day' ? 'SNOOZING' : 'RESTING';
    document.getElementById('guardianButton').innerHTML = saved.defeated
      ? (guardian.id === 'mossback' ? 'Explore Emberfen <span>↗</span>' : 'Visit your friend <span>♡</span>')
      : `Find ${guardian.name} <span>↗</span>`;
    panel.classList.toggle('is-defeated', saved.defeated);
    document.getElementById('bossGuideName').textContent = guardian.name;
    document.getElementById('bossGuideBody').textContent = guardian.fieldNote;
    document.getElementById('bossModalTitle').textContent = saved.defeated ? `You made a friend` : 'A friend with a big shell';
    document.getElementById('bossGuideAction').innerHTML = saved.defeated ? 'Go say hello <span>♡</span>' : `Take me to ${guardian.name} <span>↗</span>`;
  }

  function updateQuest() {
    const count = Math.min(3, state.todayGathered);
    document.getElementById('questCount').textContent = state.questComplete ? 'Page complete' : `${count} / 3 finds`;
    document.getElementById('questPercent').textContent = state.questComplete ? 'DONE' : `${Math.round(count / 3 * 100)}%`;
    document.getElementById('questProgress').style.width = `${count / 3 * 100}%`;
    if (state.questComplete) {
      document.querySelector('.quest-reward').innerHTML = '<span>✧</span> Field note finished · lovely work, Ari';
    } else {
      document.querySelector('.quest-reward').innerHTML = '<span>✧</span> A small thank-you when the page is full';
    }
  }

  function formatTime(minutes) {
    const hour24 = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, '0')} <small>${suffix}</small>`;
  }

  function updateClock() {
    const isDark = ['night', 'rewards'].includes(state.phase);
    const isDusk = state.phase === 'goingHome';
    const total = clamp((state.dayMinutes - 360) / (20 * 60 - 360), 0, 1) * 100;
    document.getElementById('clockTime').innerHTML = formatTime(state.dayMinutes);
    document.getElementById('clockPhase').textContent = isDark ? 'PIP’S NIGHT SHIFT' : isDusk ? 'LAST LIGHT' : 'A BEAUTIFUL DAY';
    document.getElementById('clockIcon').textContent = isDark ? '☾' : isDusk ? '☽' : '☀';
    document.getElementById('dayGlyph').textContent = isDark ? '☾' : isDusk ? '☽' : '☼';
    document.getElementById('dayLabel').textContent = `DAY ${String(state.day).padStart(2, '0')}`;
    document.getElementById('dayProgress').style.width = `${total}%`;
    document.querySelector('.day-progress-sun').style.left = `${total}%`;
    document.getElementById('clockHint').textContent = isDark ? 'Pip is making the rounds' : state.dayMinutes > 18 * 60 ? 'Time to start thinking of home' : 'Plenty of daylight left';
  }

  function updateHud() {
    setScenePalette();
    renderRegions();
    renderRoutes();
    renderGuardian();
    updateQuest();
    updateClock();
    document.getElementById('cogCount').textContent = state.stock.cogs;
    document.getElementById('pollenCount').textContent = state.stock.pollen;
    document.getElementById('satchelCount').textContent = state.packThings;
    document.getElementById('bondLevel').textContent = String(3 + state.upgrades.battery + state.upgrades.treads).padStart(2, '0');
    const inNight = state.phase === 'night' || state.phase === 'rewards';
    const battery = inNight ? Math.max(12, Math.round(100 - nightProgress() * 66)) : state.battery;
    document.getElementById('batteryText').textContent = `${battery}%`;
    document.getElementById('batteryProgress').style.width = `${battery}%`;
    document.getElementById('botStatus').textContent = inNight ? 'Out among the fireflies. Pip knows the way.' : state.phase === 'goingHome' ? 'Pip is getting his night bag ready.' : 'All charged up and ready to wander.';
    document.getElementById('nightSceneLabel').classList.toggle('hidden', !inNight);
    document.getElementById('sleepButton').disabled = state.phase !== 'day' || currentRoute().length === 0;
    document.getElementById('gatherButton').disabled = state.phase !== 'day';
    document.getElementById('attackButton').disabled = state.phase !== 'day';
    updateWorkshopUI();
  }

  function changeRegion(id) {
    state.regionId = id;
    state.player = { x: 302, y: 222, target: null, direction: 'down' };
    state.bot = { x: 331, y: 237 };
    state.pendingNode = null;
    setScenePalette();
    updateHud();
    ping(580, .11);
    speakToast(`${regionData[id].name} · take a slow look around.`);
  }

  function activeOverlays() {
    return ['nightModal', 'rewardModal', 'workshopModal', 'packModal', 'bossModal'].some(id => !document.getElementById(id).classList.contains('hidden'));
  }

  function showModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  function nearestStop(maxDistance = Infinity, onlyReady = true) {
    let nearest = null;
    let best = maxDistance;
    for (const stop of currentRegion().stops) {
      if (onlyReady && state.collected[`${state.regionId}:${stop.id}`]) continue;
      const d = dist(state.player, stop);
      if (d < best) { nearest = stop; best = d; }
    }
    return nearest ? { stop: nearest, distance: best } : null;
  }

  function gatherStop(stop) {
    if (state.phase !== 'day') return;
    const key = `${state.regionId}:${stop.id}`;
    if (state.collected[key]) {
      speakToast('You already found the best bits here. ♡');
      return;
    }
    state.collected[key] = true;
    const amount = randInt(stop.amount[0], stop.amount[1]);
    state.stock[stop.resource] = (state.stock[stop.resource] || 0) + amount;
    state.packThings += 1;
    state.todayGathered += 1;
    addFloating(`${stop.rewardIcon} +${amount} ${stockNames[stop.resource] || stop.resourceName}`, stop.x, stop.y - 17, '#fff1a4');
    if (!state.questComplete && state.todayGathered >= 3) {
      state.questComplete = true;
      state.stock.cogs += 18;
      state.packThings += 1;
      setTimeout(() => { ping(840, .13); speakToast('Field note complete! +18 brass cogs for Ari. ✧', 3200); updateHud(); }, 260);
    } else {
      speakToast(`${stop.name} · found ${amount} ${stockNames[stop.resource] || stop.resourceName.toLowerCase()}.`, 2100);
    }
    state.pendingNode = null;
    ping(720 + Math.random() * 130, .12, 'triangle');
    updateHud();
  }

  function walkToStop(stop) {
    const offsetX = state.player.x - stop.x;
    const offsetY = state.player.y - stop.y;
    const length = Math.hypot(offsetX, offsetY) || 1;
    state.player.target = { x: clamp(stop.x + offsetX / length * 30, 24, 616), y: clamp(stop.y + offsetY / length * 30, 25, 375) };
    state.pendingNode = stop.id;
    if (Math.abs(offsetX) > Math.abs(offsetY)) state.player.direction = offsetX < 0 ? 'right' : 'left';
    else state.player.direction = offsetY < 0 ? 'down' : 'up';
  }

  function interact() {
    if (state.phase !== 'day' || activeOverlays()) return;
    const nearest = nearestStop(170, true);
    if (!nearest) {
      speakToast('Nothing nearby to gather just yet. Tap a bright spot in the field.');
      return;
    }
    if (nearest.distance <= 45) gatherStop(nearest.stop);
    else {
      walkToStop(nearest.stop);
      speakToast(`Ari is off to ${nearest.stop.name}…`);
    }
  }

  function activeEnemies() {
    return currentRegion().enemies.map((enemy, index) => ({ ...enemy, index, hp: state.enemyHp[state.regionId][index] })).filter(enemy => enemy.hp > 0);
  }

  function attack() {
    if (state.phase !== 'day' || activeOverlays()) return;
    const guardian = currentGuardian();
    const saved = guardianState(guardian);
    const guardianDistance = saved.defeated ? Infinity : dist(state.player, guardian);
    const enemies = activeEnemies().map(enemy => ({ enemy, distance: dist(state.player, enemy) })).filter(item => item.distance < 54).sort((a, b) => a.distance - b.distance);
    const closestEnemy = enemies[0];
    if (guardianDistance < 73 && (!closestEnemy || guardianDistance <= closestEnemy.distance + 10)) {
      saved.hp = Math.max(0, saved.hp - 1);
      state.attackAt = performance.now();
      addFloating('bonk!', guardian.x, guardian.y - 31, '#ffe59a');
      ping(230, .12, 'square');
      if (saved.hp === 0) {
        saved.defeated = true;
        state.stock.cogs += 24;
        state.stock.sunshards += 7;
        state.packThings += 2;
        state.keepsakes.push({ name: `${guardian.name}'s button`, icon: '✦', rarity: 'rare', count: 1 });
        if (guardian.id === 'mossback') state.bosses.mossback.defeated = true;
        speakToast(`${guardian.name} is your friend now! +24 cogs · +7 sunshards · a little keepsake.`, 3800);
      } else {
        speakToast(`${guardian.name} gives a very surprised little wobble. ${saved.hp} gentle bonks to go.`);
      }
      updateHud();
      return;
    }
    if (closestEnemy) {
      const { enemy } = closestEnemy;
      const hpArray = state.enemyHp[state.regionId];
      hpArray[enemy.index] = Math.max(0, hpArray[enemy.index] - 1);
      state.attackAt = performance.now();
      addFloating('pock!', enemy.x, enemy.y - 18, '#ffe2a0');
      ping(310, .09, 'triangle');
      if (hpArray[enemy.index] === 0) {
        const cogs = randInt(3, 6);
        state.stock.cogs += cogs;
        state.stock.pollen += 1;
        state.packThings += 1;
        speakToast(`The little sporeling scuttles off · Pip found ${cogs} cogs.`, 2600);
      } else speakToast('Pock! One more gentle bonk ought to do it.');
      updateHud();
      return;
    }
    state.attackAt = performance.now();
    speakToast('No one close enough for a bonk. Tap near a little creature first.');
    ping(185, .06, 'sine');
  }

  function addFloating(text, x, y, color) {
    state.floating.push({ text, x, y, color, born: performance.now() });
  }

  function approachGuardian() {
    if (state.phase !== 'day') return;
    const guardian = currentGuardian();
    const saved = guardianState(guardian);
    if (saved.defeated) {
      if (guardian.id === 'mossback' && isRegionOpen('emberfen')) changeRegion('emberfen');
      else speakToast(`${guardian.name} gives you a sleepy little wave. ♡`);
      closeModal('bossModal');
      return;
    }
    const closePoint = { x: guardian.x - 55, y: guardian.y + 13 };
    if (dist(state.player, closePoint) < 14) {
      speakToast(`${guardian.name} is right there. Try a gentle bonk with SPACE.`);
    } else {
      state.player.target = closePoint;
      state.pendingNode = null;
      speakToast(`Following the little footprints to ${guardian.name}…`, 2200);
    }
    closeModal('bossModal');
  }

  const upgradeSpecs = [
    { id: 'home', icon: '⌂', names: ['Glassleaf Sunroom', 'Rooftop Orchard'], descriptions: ['A warm glass room for seed trays and rainy afternoons. Pip gains one more route stop.', 'A little rooftop garden feeds the workshop. Night runs find a few extra supplies.'], costs: [{ cogs: 54, pollen: 6 }, { cogs: 108, pollen: 16 }], max: 2, levelKey: 'home' },
    { id: 'battery', icon: 'ϟ', names: ['Moonlight Battery', 'Dawncore Cell'], descriptions: ['A longer-lasting night charge means Pip brings home a little more.', 'A bright new dawncore adds another boost to Pip’s overnight haul.'], costs: [{ cogs: 64, dewglass: 4 }, { cogs: 118, dewglass: 9 }], max: 2, levelKey: 'battery' },
    { id: 'garden', icon: '✿', names: ['Raincatcher Garden', 'Pollinator Roof'], descriptions: ['A tiny rooftop garden that keeps the home humming with pollen.', 'A thriving pollinator roof adds a soft bonus to future field hauls.'], costs: [{ cogs: 78, pollen: 12 }, { cogs: 132, pollen: 22 }], max: 2, levelKey: 'garden', requires: 'home' },
    { id: 'treads', icon: '⌁', names: ['Rootgrip Treads'], descriptions: ['Soft grippy treads help Pip explore farther trails and return with extra finds.'], costs: [{ cogs: 92, sunshards: 3 }], max: 1, levelKey: 'treads' }
  ];

  function canAfford(cost) {
    return Object.entries(cost).every(([resource, amount]) => (state.stock[resource] || 0) >= amount);
  }

  function renderCost(cost) {
    return Object.entries(cost).map(([resource, amount]) => `<span><i>${stockIcons[resource] || '✦'}</i>${amount}</span>`).join('');
  }

  function updateWorkshopUI() {
    const host = document.getElementById('upgradeGrid');
    if (!host) return;
    const available = upgradeSpecs.map(spec => {
      const level = state.upgrades[spec.levelKey];
      const maxed = level >= spec.max;
      const locked = Boolean(spec.requires && state.upgrades[spec.requires] < 1);
      const cost = maxed ? null : spec.costs[level];
      const affordable = !locked && cost && canAfford(cost);
      const title = maxed ? spec.names[spec.names.length - 1] : spec.names[level];
      const description = maxed ? 'Fully tuned up. Pip and Ari are very proud of this one.' : spec.descriptions[level];
      const buttonText = maxed ? 'BUILT' : locked ? 'LOCKED' : 'BUILD';
      return `<article class="upgrade-card">
        <div class="upgrade-top"><span class="upgrade-icon">${spec.icon}</span><span class="upgrade-level">${maxed ? 'COMPLETE' : `LEVEL ${level} → ${level + 1}`}</span></div>
        <h3>${title}</h3><p>${description}</p>
        <div class="upgrade-footer"><div class="upgrade-cost">${maxed ? '<span>✧ &nbsp;Lovely work</span>' : renderCost(cost || {})}</div>
        <button class="upgrade-buy" data-upgrade="${spec.id}" ${maxed || locked || !affordable ? 'disabled' : ''}>${buttonText}</button></div>
      </article>`;
    }).join('');
    host.innerHTML = available;
    host.querySelectorAll('[data-upgrade]').forEach(button => button.addEventListener('click', () => buyUpgrade(button.dataset.upgrade)));
    document.getElementById('homeLevelLabel').textContent = state.upgrades.home === 0 ? 'The little house · level 1' : `Glassleaf home · level ${state.upgrades.home + 1}`;
    document.getElementById('upgradeResourceText').textContent = `Available: ${state.stock.cogs} cogs · ${state.stock.pollen} pollen · ${state.stock.dewglass} dewglass`;
  }

  function buyUpgrade(id) {
    const spec = upgradeSpecs.find(item => item.id === id);
    const level = state.upgrades[spec.levelKey];
    if (level >= spec.max) return;
    if (spec.requires && state.upgrades[spec.requires] < 1) {
      speakToast('Add the glassleaf sunroom first. A garden needs a little room to grow.');
      return;
    }
    const cost = spec.costs[level];
    if (!canAfford(cost)) {
      speakToast('Pip checked the toolbox. We need a few more good bits for that.');
      return;
    }
    for (const [resource, amount] of Object.entries(cost)) state.stock[resource] -= amount;
    state.upgrades[spec.levelKey] += 1;
    ping(720, .18, 'triangle');
    speakToast(`${spec.names[level]} added to your home. It looks just right. ♡`, 2800);
    updateHud();
  }

  function openPack() {
    if (state.phase !== 'day') return;
    renderPack();
    showModal('packModal');
  }

  function renderPack() {
    const items = [
      { name: 'Brass cogs', key: 'cogs', icon: '⚙', description: 'For things that turn.' },
      { name: 'Moon pollen', key: 'pollen', icon: '✿', description: 'For things that bloom.' },
      { name: 'Dewglass', key: 'dewglass', icon: '◈', description: 'For things that glow.' },
      { name: 'Sunshards', key: 'sunshards', icon: '✦', description: 'For a brighter tomorrow.' }
    ];
    const host = document.getElementById('packGrid');
    const stockCards = items.map(item => `<div class="pack-item"><span class="pack-item-icon">${item.icon}</span><strong>${item.name}</strong><small>${state.stock[item.key] || 0} &nbsp;·&nbsp; ${item.description}</small></div>`);
    const keepsakeCards = state.keepsakes.map(item => `<div class="pack-item special"><span class="pack-item-icon">${item.icon}</span><strong>${item.name}</strong><small>${item.count} &nbsp;·&nbsp; ${item.rarity}</small></div>`);
    host.innerHTML = stockCards.concat(keepsakeCards).join('');
    document.getElementById('packCapacityLabel').textContent = `${state.packThings} / 24 things`;
    document.getElementById('packCapacityBar').style.width = `${Math.min(100, state.packThings / 24 * 100)}%`;
  }

  function showBossGuide() {
    const guardian = currentGuardian();
    const saved = guardianState(guardian);
    document.getElementById('bossGuideName').textContent = guardian.name;
    document.getElementById('bossGuideBody').textContent = guardian.fieldNote;
    document.getElementById('bossModalTitle').textContent = saved.defeated ? 'A good new friend' : 'A friend with a big shell';
    document.getElementById('bossGuideAction').innerHTML = saved.defeated ? 'Go say hello <span>♡</span>' : `Take me to ${guardian.name} <span>↗</span>`;
    showModal('bossModal');
  }

  function routeStopObjects() {
    return currentRoute().map(id => currentRegion().stops.find(stop => stop.id === id)).filter(Boolean);
  }

  function beginNight() {
    if (state.phase !== 'day') return;
    if (currentRoute().length === 0) {
      speakToast('Pick at least one place for Pip to visit before you tuck in.');
      return;
    }
    keys.clear();
    state.phase = 'goingHome';
    state.pendingNode = null;
    state.player.target = { x: 524, y: 105 };
    state.player.direction = 'up';
    state.dayMinutes = Math.max(state.dayMinutes, 19 * 60 + 45);
    updateClock();
    updateHud();
    ping(430, .18);
    setTimeout(() => {
      if (state.phase !== 'goingHome') return;
      state.phase = 'night';
      state.nightStart = performance.now();
      state.nightRewards = [];
      state.nightClaimed = false;
      state.lastNightMessage = -1;
      state.player.target = null;
      state.bot.x = 529; state.bot.y = 119;
      buildNightPreview();
      showModal('nightModal');
      updateHud();
    }, 820);
  }

  function buildNightPreview() {
    const stops = routeStopObjects();
    document.getElementById('nightDayNumber').textContent = String(state.day).padStart(2, '0');
    const host = document.getElementById('nightRoutePreview');
    host.innerHTML = stops.length ? stops.map((stop, index) => `${index ? '<i class="night-route-arrow">→</i>' : ''}<span class="night-route-stop"><span>${stop.icon}</span>${stop.name}</span>`).join('') : '<span class="night-route-stop">Pip is having a quiet night close to home.</span>';
    document.getElementById('nightStatus').textContent = 'Pip is warming up the night battery...';
    document.getElementById('nightPercent').textContent = '0%';
    document.getElementById('nightProgress').style.width = '0%';
    document.querySelector('.night-progress-track > i').style.left = '0%';
  }

  function nightProgress(now = performance.now()) {
    if (!state.nightStart) return 0;
    return clamp((now - state.nightStart) / state.nightDuration, 0, 1);
  }

  function rollNightRewards() {
    const stops = routeStopObjects();
    const robotLevel = state.upgrades.battery + state.upgrades.treads;
    const gardenLevel = state.upgrades.garden;
    const cogAmount = 14 + stops.length * 8 + robotLevel * 6 + state.upgrades.home * 3 + randInt(0, 6);
    const haul = [{ key: 'cogs', name: 'Brass cogs', icon: '⚙', qty: cogAmount, rarity: 'common', unit: 'cogs' }];
    for (const stop of stops) {
      const bonus = robotLevel > 0 ? 1 : 0;
      const qty = randInt(stop.amount[0], stop.amount[1]) + bonus + gardenLevel;
      haul.push({ key: stop.resource, name: stop.resourceName, icon: stop.rewardIcon, qty, rarity: stop.rarity, unit: stop.resource === 'cogs' ? 'cogs' : 'finds' });
    }
    const luckyChance = .39 + robotLevel * .10 + state.upgrades.home * .04;
    if (Math.random() < luckyChance) {
      const options = [
        { name: 'Moonbell Charm', icon: '☼', rarity: 'epic', text: 'A little good luck, tied up with a golden thread.' },
        { name: 'Fernlight Brooch', icon: '❋', rarity: 'rare', text: 'A tiny glowing keepsake for your home shelf.' },
        { name: 'Sun-pocket Acorn', icon: '♧', rarity: 'legendary', text: 'Pip found a bit of tomorrow tucked inside it.' }
      ];
      const special = options[randInt(0, options.length - 1)];
      haul.push({ key: 'keepsake', name: special.name, icon: special.icon, qty: 1, rarity: special.rarity, unit: 'keepsake', description: special.text });
    }
    return haul;
  }

  function revealRewards() {
    state.phase = 'rewards';
    state.nightRewards = rollNightRewards();
    state.battery = Math.max(24, 58 - (state.upgrades.battery * 6) - (state.upgrades.treads * 5));
    closeModal('nightModal');
    const route = routeStopObjects();
    document.getElementById('rewardDayNumber').textContent = String(state.day).padStart(2, '0');
    document.getElementById('rewardRouteSummary').textContent = route.length ? `Pip made ${route.length} ${route.length === 1 ? 'lovely stop' : 'lovely stops'} and brought something home` : 'Pip stayed close to the porch and kept the lanterns company';
    document.getElementById('rewardSubtitle').textContent = route.length ? `Out in the dark, your clever little friend found all of this.` : 'A slow night near home, with a few useful bits to show for it.';
    const grid = document.getElementById('rewardGrid');
    grid.innerHTML = state.nightRewards.map((item, index) => {
      const rarityName = item.rarity.toUpperCase();
      const quantity = item.unit === 'keepsake' ? 'ONE <small>very lovely find</small>' : `+${item.qty} <small>${item.unit}</small>`;
      return `<article class="loot-card rarity-${item.rarity}" style="animation-delay:${Math.min(index * .08, .32)}s"><span class="loot-rarity">${rarityName}</span><span class="loot-icon">${item.icon}</span><strong class="loot-name">${item.name}</strong><span class="loot-quantity">${quantity}</span></article>`;
    }).join('');
    const special = state.nightRewards.find(item => item.unit === 'keepsake');
    const bonus = document.getElementById('rewardBonus');
    if (special) {
      bonus.classList.remove('hidden');
      document.getElementById('bonusText').textContent = special.description;
    } else {
      bonus.classList.add('hidden');
    }
    showModal('rewardModal');
    updateHud();
    ping(680, .19, 'triangle');
    setTimeout(() => ping(920, .15, 'sine'), 130);
    setTimeout(() => ping(1120, .18, 'sine'), 260);
  }

  function claimRewards() {
    if (state.phase !== 'rewards') return;
    if (!state.nightClaimed) {
      for (const item of state.nightRewards) {
        if (item.key === 'keepsake') {
          const old = state.keepsakes.find(keepsake => keepsake.name === item.name);
          if (old) old.count += 1;
          else state.keepsakes.push({ name: item.name, icon: item.icon, rarity: item.rarity, count: 1 });
        } else {
          state.stock[item.key] = (state.stock[item.key] || 0) + item.qty;
        }
      }
      state.packThings += state.nightRewards.length;
      state.nightClaimed = true;
    }
    closeModal('rewardModal');
    state.phase = 'day';
    state.day += 1;
    state.dayMinutes = 8 * 60 + 10;
    state.timeAccumulator = 0;
    state.battery = 100;
    state.collected = {};
    state.todayGathered = 0;
    state.questComplete = false;
    state.nightStart = 0;
    state.player = { x: 514, y: 126, target: null, direction: 'down' };
    state.bot = { x: 539, y: 138 };
    state.enemyHp = { mosslight: [2, 2], orchard: [2, 2], emberfen: [2, 2] };
    updateHud();
    ping(760, .13, 'triangle');
    speakToast(`Day ${String(state.day).padStart(2, '0')} · Pip left you a very full satchel.`, 3200);
  }

  function updateNight(now) {
    const progress = nightProgress(now);
    const percent = Math.round(progress * 100);
    const progressBar = document.getElementById('nightProgress');
    const progressDot = document.querySelector('.night-progress-track > i');
    progressBar.style.width = `${percent}%`;
    progressDot.style.left = `${percent}%`;
    document.getElementById('nightPercent').textContent = `${percent}%`;
    const messages = [
      'Pip is warming up the night battery...',
      'Tiptoeing through the dew...',
      'Collecting the good shiny bits...',
      'A little detour to help a sleepy flower...',
      'Heading home before the first bird...'
    ];
    const messageIndex = Math.min(messages.length - 1, Math.floor(progress * messages.length));
    if (messageIndex !== state.lastNightMessage) {
      state.lastNightMessage = messageIndex;
      document.getElementById('nightStatus').textContent = messages[messageIndex];
    }
    if (progress >= 1) revealRewards();
  }

  function updateMovement(dt) {
    if (!['day', 'goingHome'].includes(state.phase)) return;
    const player = state.player;
    const speed = state.phase === 'goingHome' ? 410 : 150;
    let dx = 0; let dy = 0;
    if (state.phase === 'day') {
      if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
      if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
      if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
      if (keys.has('ArrowDown') || keys.has('s')) dy += 1;
    }
    if (dx || dy) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length; dy /= length;
      player.target = null;
      player.x += dx * speed * dt;
      player.y += dy * speed * dt;
      player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    } else if (player.target) {
      const vx = player.target.x - player.x;
      const vy = player.target.y - player.y;
      const length = Math.hypot(vx, vy);
      if (length <= speed * dt + 2) {
        player.x = player.target.x;
        player.y = player.target.y;
        player.target = null;
        if (state.pendingNode) {
          const stop = currentRegion().stops.find(item => item.id === state.pendingNode);
          if (stop && dist(player, stop) <= 47) gatherStop(stop);
        }
      } else {
        player.x += vx / length * speed * dt;
        player.y += vy / length * speed * dt;
        player.direction = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up');
      }
    }
    player.x = clamp(player.x, 22, 618);
    player.y = clamp(player.y, 30, 377);
    if (state.phase === 'day') {
      const follow = { x: player.x - 27, y: player.y + 15 };
      const followAlpha = 1 - Math.exp(-dt * 5.6);
      state.bot.x += (follow.x - state.bot.x) * followAlpha;
      state.bot.y += (follow.y - state.bot.y) * followAlpha;
    } else {
      const followAlpha = 1 - Math.exp(-dt * 6);
      state.bot.x += (player.x - 24 - state.bot.x) * followAlpha;
      state.bot.y += (player.y + 13 - state.bot.y) * followAlpha;
    }
  }

  function updateClockBy(dt) {
    if (state.phase !== 'day') return;
    state.timeAccumulator += dt * 1000;
    if (state.timeAccumulator >= 5000) {
      const minutesToAdd = Math.floor(state.timeAccumulator / 5000);
      state.timeAccumulator %= 5000;
      state.dayMinutes += minutesToAdd;
      if (state.dayMinutes >= 20 * 60) {
        state.dayMinutes = 20 * 60;
        beginNight();
      }
      updateClock();
    }
  }

  function updateBotNight(now) {
    const progress = nightProgress(now);
    const stops = routeStopObjects();
    const points = [{ x: 532, y: 117 }, ...stops.map(stop => ({ x: stop.x, y: stop.y })), { x: 532, y: 117 }];
    if (points.length < 2) return;
    const scaled = progress * (points.length - 1);
    const index = Math.min(points.length - 2, Math.floor(scaled));
    const local = scaled - index;
    const ease = local * local * (3 - 2 * local);
    state.bot.x = points[index].x + (points[index + 1].x - points[index].x) * ease;
    state.bot.y = points[index].y + (points[index + 1].y - points[index].y) * ease;
  }

  function updateGame(dt, now) {
    updateClockBy(dt);
    updateMovement(dt);
    if (state.phase === 'night') {
      updateBotNight(now);
      updateNight(now);
    }
    state.floating = state.floating.filter(effect => now - effect.born < 1200);
  }

  function seeded(i, j, salt = 0) {
    const n = Math.sin(i * 127.1 + j * 311.7 + salt * 74.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawGround(time) {
    const region = currentRegion();
    ctx.fillStyle = region.ground[0];
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    for (let y = 0; y < WORLD_H; y += 28) {
      for (let x = 0; x < WORLD_W; x += 32) {
        const value = seeded(x / 32, y / 28, state.regionId.length);
        ctx.globalAlpha = .1 + value * .07;
        ctx.fillStyle = region.ground[Math.floor(value * region.ground.length)];
        ctx.fillRect(x + (value > .6 ? 1 : 0), y + 1, 31, 27);
        ctx.globalAlpha = 1;
        const grass = seeded(x / 32 + 3, y / 28 + 7, state.regionId.length);
        if (grass > .45) {
          const gx = x + 6 + grass * 20;
          const gy = y + 6 + seeded(x, y, 4) * 15;
          ctx.strokeStyle = region.shade;
          ctx.globalAlpha = .2 + grass * .15;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(gx, gy + 3); ctx.lineTo(gx - 2, gy); ctx.moveTo(gx, gy + 3); ctx.lineTo(gx + 3, gy - 1); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    // A soft, pixel-edged vignette keeps the middle of the map bright and readable.
    const shade = ctx.createRadialGradient(320, 190, 95, 320, 190, 420);
    shade.addColorStop(0, 'rgba(250,245,187,.035)');
    shade.addColorStop(1, 'rgba(19,44,28,.19)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    drawGroundDetails(time);
  }

  function drawGroundDetails(time) {
    const region = currentRegion();
    if (state.regionId === 'mosslight') {
      ctx.save();
      ctx.fillStyle = '#9ab36c'; ctx.globalAlpha = .6;
      ctx.beginPath(); ctx.ellipse(82, 98, 61, 31, -.23, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = region.water; ctx.globalAlpha = .95;
      ctx.beginPath(); ctx.ellipse(81, 95, 53, 24, -.23, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(188,224,188,.65)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(82, 94, 37, 14, -.23, .2, 2.4); ctx.stroke();
      ctx.fillStyle = 'rgba(216,236,179,.4)'; ctx.beginPath(); ctx.ellipse(69, 88, 11, 3, -.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (state.regionId === 'orchard') {
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = '#a4b880'; ctx.lineWidth = 43; ctx.beginPath(); ctx.moveTo(0, 327); ctx.bezierCurveTo(131, 309, 188, 278, 287, 294); ctx.bezierCurveTo(378, 310, 483, 356, 641, 322); ctx.stroke();
      ctx.strokeStyle = '#5b9e98'; ctx.lineWidth = 35; ctx.beginPath(); ctx.moveTo(0, 327); ctx.bezierCurveTo(131, 309, 188, 278, 287, 294); ctx.bezierCurveTo(378, 310, 483, 356, 641, 322); ctx.stroke();
      ctx.globalAlpha = .55; ctx.strokeStyle = '#bcddd0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 319); ctx.bezierCurveTo(130, 301, 190, 270, 287, 286); ctx.bezierCurveTo(378, 302, 483, 348, 641, 314); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#b98d5e'; ctx.fillRect(284, 278, 45, 32); ctx.fillStyle = '#dec18a'; ctx.fillRect(287, 280, 38, 5); ctx.fillRect(287, 302, 38, 5);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#9c684b'; ctx.globalAlpha = .55;
      ctx.beginPath(); ctx.ellipse(88, 93, 61, 31, -.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7d6d50'; ctx.globalAlpha = .9;
      ctx.beginPath(); ctx.ellipse(85, 90, 50, 22, -.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(239,179,114,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(85, 90, 33, 12, -.2, .1, 2.4); ctx.stroke();
      ctx.restore();
    }

    // Winding warm footpaths; they're part of every region's shared little world.
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(43, 48, 28, .2)'; ctx.shadowBlur = 7; ctx.shadowOffsetY = 3;
    ctx.strokeStyle = region.pathEdge; ctx.lineWidth = 54;
    ctx.beginPath(); ctx.moveTo(18, 375); ctx.bezierCurveTo(117, 350, 152, 353, 228, 308); ctx.bezierCurveTo(289, 272, 300, 246, 352, 216); ctx.bezierCurveTo(435, 167, 470, 117, 546, 67); ctx.stroke();
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = region.path; ctx.lineWidth = 46;
    ctx.beginPath(); ctx.moveTo(18, 375); ctx.bezierCurveTo(117, 350, 152, 353, 228, 308); ctx.bezierCurveTo(289, 272, 300, 246, 352, 216); ctx.bezierCurveTo(435, 167, 470, 117, 546, 67); ctx.stroke();
    ctx.strokeStyle = 'rgba(244,221,161,.27)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 10]);
    ctx.beginPath(); ctx.moveTo(18, 375); ctx.bezierCurveTo(117, 350, 152, 353, 228, 308); ctx.bezierCurveTo(289, 272, 300, 246, 352, 216); ctx.bezierCurveTo(435, 167, 470, 117, 546, 67); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();

    if (state.regionId === 'mosslight') {
      ctx.fillStyle = '#90734a';
      for (let i = 0; i < 5; i++) {
        const x = 66 + i * 10; const y = 346 + i * 3;
        roundedRect(ctx, x, y, 7, 5, 2); ctx.fill();
      }
    }

    // Dappled flower dots stay in a stable pattern, so the meadow feels hand-placed.
    for (let i = 0; i < 82; i++) {
      const x = 18 + seeded(i, 4, state.regionId.length + 8) * 604;
      const y = 19 + seeded(i, 9, state.regionId.length + 21) * 352;
      if (Math.abs(x - 320) < 35 && Math.abs(y - 205) < 31) continue;
      if (i % 4 !== 0 && Math.abs(x - 530) < 50 && y < 124) continue;
      const r = 1.1 + seeded(i, 13, 17) * 1.6;
      ctx.globalAlpha = .42 + seeded(i, 6, 15) * .4;
      ctx.fillStyle = i % 5 === 0 ? region.flower : i % 3 === 0 ? '#d1e19a' : '#d5ecad';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (i % 13 === 0) {
        ctx.strokeStyle = region.leaf; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x + 1, y + 7); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    drawPebbles();
    drawHome();
  }

  function drawPebbles() {
    const positions = [[90, 175], [96, 179], [113, 178], [206, 107], [215, 111], [302, 72], [307, 75], [414, 213], [422, 210], [577, 303], [569, 308], [255, 352], [263, 349]];
    positions.forEach(([x, y], index) => {
      ctx.fillStyle = index % 2 ? '#b5a67d' : '#c5b587';
      roundedRect(ctx, x, y, 7 + index % 3, 5, 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,244,201,.34)'; ctx.fillRect(x + 2, y + 1, 3, 1);
    });
  }

  function drawHome() {
    const level = state.upgrades.home;
    ctx.save();
    ctx.fillStyle = 'rgba(33,47,28,.22)';
    ctx.beginPath(); ctx.ellipse(538, 94, 49, 19, -.06, 0, Math.PI * 2); ctx.fill();
    // Raised garden bed and solar kettle beside the cottage.
    ctx.fillStyle = '#496c47'; roundedRect(ctx, 489, 96, 23, 15, 4); ctx.fill();
    ctx.fillStyle = '#8fb769'; ctx.fillRect(492, 98, 17, 4);
    ctx.fillStyle = '#d7c48d'; roundedRect(ctx, 496, 101, 9, 8, 3); ctx.fill();
    ctx.fillStyle = '#8fbe79'; roundedRect(ctx, 508, 55, 61, 43, 5); ctx.fill();
    ctx.fillStyle = '#d4c69a'; roundedRect(ctx, 513, 62, 51, 32, 4); ctx.fill();
    // roof
    ctx.beginPath(); ctx.moveTo(505, 66); ctx.lineTo(537, 43); ctx.lineTo(575, 65); ctx.lineTo(570, 70); ctx.lineTo(510, 70); ctx.closePath();
    ctx.fillStyle = '#466f53'; ctx.fill();
    ctx.strokeStyle = 'rgba(214,235,166,.39)'; ctx.lineWidth = 1.5; ctx.stroke();
    // blue-green photovoltaic tiles
    roundedRect(ctx, 526, 52, 27, 13, 2); ctx.fillStyle = '#385f63'; ctx.fill();
    ctx.strokeStyle = 'rgba(165,216,185,.65)'; ctx.lineWidth = .7; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(535,53); ctx.lineTo(535,64); ctx.moveTo(544,53); ctx.lineTo(544,64); ctx.moveTo(527,58); ctx.lineTo(552,58); ctx.stroke();
    ctx.fillStyle = '#445d42'; roundedRect(ctx, 533, 77, 11, 17, 2); ctx.fill();
    ctx.fillStyle = '#f0d988'; roundedRect(ctx, 515, 73, 9, 9, 2); ctx.fill();
    ctx.fillStyle = 'rgba(246,224,137,.7)'; ctx.fillRect(517, 76, 5, 1);
    // sunroom extension
    if (level > 0) {
      ctx.fillStyle = '#b3d5a2'; ctx.globalAlpha = .93; roundedRect(ctx, 566, 72, 18, 22, 4); ctx.fill();
      ctx.strokeStyle = '#e7dfaf'; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = 'rgba(70,111,83,.82)'; ctx.beginPath(); ctx.moveTo(575,74); ctx.lineTo(575,92); ctx.moveTo(568,83); ctx.lineTo(582,83); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (level > 1 || state.upgrades.garden > 0) {
      ctx.fillStyle = '#648948'; ctx.beginPath(); ctx.ellipse(583, 100, 16, 7, -.3, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#e6d184' : '#f3dd97'; ctx.beginPath(); ctx.arc(574 + i * 5, 97 - (i % 2) * 3, 2, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }

  function drawTree(x, y, r, index, time) {
    const region = currentRegion();
    const colors = state.regionId === 'emberfen'
      ? ['#627746', '#718b4a', '#536e41', '#829457']
      : state.regionId === 'orchard'
        ? ['#56825e', '#739e6d', '#4a775e', '#84a878']
        : ['#487347', '#5d884c', '#3e6b45', '#709b55'];
    ctx.save();
    // canopy shadow and short visible trunk, seen from above
    ctx.fillStyle = 'rgba(28,43,25,.28)'; ctx.beginPath(); ctx.ellipse(x + 3, y + r * .72, r * 1.02, r * .55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#72573b'; roundedRect(ctx, x - 4, y + r * .25, 9, r * .92, 3); ctx.fill();
    const pulse = Math.sin(time * .001 + index) * .7;
    ctx.fillStyle = colors[index % colors.length]; ctx.beginPath(); ctx.arc(x, y + pulse, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = colors[(index + 1) % colors.length]; ctx.beginPath(); ctx.arc(x - r * .30, y - r * .18 + pulse, r * .62, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = colors[(index + 2) % colors.length]; ctx.beginPath(); ctx.arc(x + r * .32, y - r * .18 + pulse, r * .59, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(203,225,143,.16)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x - r * .1, y - r * .15 + pulse, r * .75, 3.5, 5.3); ctx.stroke();
    ctx.fillStyle = state.regionId === 'orchard' ? '#e4bf87' : state.regionId === 'emberfen' ? '#d99a5f' : '#c1d27a';
    for (let i = 0; i < 3; i++) {
      const fx = x + (seeded(index, i, 18) - .5) * r * 1.2;
      const fy = y + (seeded(index, i, 28) - .5) * r * 1.15;
      if (i === 0 && index % 3 !== 0) continue;
      ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawForest(time) {
    currentRegion().trees.forEach((tree, index) => drawTree(tree[0], tree[1], tree[2], index, time));
    // Several fern silhouettes and low flower patches at the woodland edges.
    const ferns = [[69,252],[190,84],[337,353],[481,197],[565,327],[282,165],[580,222],[123,326]];
    ferns.forEach(([x,y], i) => {
      ctx.save(); ctx.strokeStyle = currentRegion().leaf; ctx.lineWidth = 2; ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.quadraticCurveTo(x - 7, y, x - 5, y - 7); ctx.moveTo(x, y + 8); ctx.quadraticCurveTo(x + 2, y, x + 8, y - 6); ctx.moveTo(x, y + 8); ctx.lineTo(x, y - 2); ctx.stroke();
      ctx.fillStyle = i % 2 ? '#c5d778' : currentRegion().flower;
      ctx.beginPath(); ctx.arc(x + (i % 2 ? 8 : -5), y - 6, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  }

  function drawNode(stop, index, time) {
    const collected = Boolean(state.collected[`${state.regionId}:${stop.id}`]);
    const routeIndex = currentRoute().indexOf(stop.id);
    const bob = Math.sin(time * .0022 + index * 1.4) * 2;
    ctx.save();
    ctx.globalAlpha = collected ? .48 : 1;
    ctx.fillStyle = collected ? 'rgba(242,227,162,.13)' : 'rgba(245,224,135,.2)';
    ctx.beginPath(); ctx.ellipse(stop.x, stop.y + 8, 25, 8, 0, 0, Math.PI * 2); ctx.fill();
    if (!collected) {
      const glow = ctx.createRadialGradient(stop.x, stop.y - 2, 1, stop.x, stop.y - 2, 27);
      glow.addColorStop(0, 'rgba(255,235,154,.25)'); glow.addColorStop(1, 'rgba(255,235,154,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(stop.x, stop.y - 2, 27, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(247,235,160,.58)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(stop.x, stop.y + bob, 16 + Math.sin(time * .003 + index) * 2, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = currentRegion().shade;
    ctx.beginPath(); ctx.ellipse(stop.x, stop.y + 5, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = stop.resource === 'sunshards' ? '#f2d277' : stop.resource === 'dewglass' ? '#9be1d0' : stop.resource === 'cogs' ? '#d4b96f' : '#d9df91';
    if (stop.resource === 'dewglass' || stop.resource === 'sunshards') {
      ctx.beginPath(); ctx.moveTo(stop.x, stop.y - 13 + bob); ctx.lineTo(stop.x + 8, stop.y - 3 + bob); ctx.lineTo(stop.x + 5, stop.y + 6 + bob); ctx.lineTo(stop.x - 6, stop.y + 6 + bob); ctx.lineTo(stop.x - 9, stop.y - 3 + bob); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,220,.68)'; ctx.beginPath(); ctx.moveTo(stop.x, stop.y - 10 + bob); ctx.lineTo(stop.x + 2, stop.y - 3 + bob); ctx.lineTo(stop.x - 1, stop.y + 1 + bob); ctx.closePath(); ctx.fill();
    } else if (stop.resource === 'cogs') {
      ctx.beginPath(); ctx.arc(stop.x, stop.y + bob, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#795f3c'; ctx.beginPath(); ctx.arc(stop.x, stop.y + bob, 3, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = '#839451'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(stop.x, stop.y + 7); ctx.lineTo(stop.x, stop.y - 2 + bob); ctx.stroke();
      for (let petal = 0; petal < 5; petal++) {
        const a = petal * Math.PI * 2 / 5;
        ctx.fillStyle = petal % 2 ? '#f4df9a' : '#fae9ae';
        ctx.beginPath(); ctx.ellipse(stop.x + Math.cos(a) * 5, stop.y - 2 + bob + Math.sin(a) * 5, 3.2, 2.1, a, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#d99c53'; ctx.beginPath(); ctx.arc(stop.x, stop.y - 2 + bob, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    // Small sign-like name tags keep the route legible at a glance.
    const label = stop.name;
    ctx.font = '8px "DM Sans", sans-serif';
    const labelWidth = ctx.measureText(label).width + 12;
    roundedRect(ctx, stop.x - labelWidth / 2, stop.y - 30 + bob, labelWidth, 14, 5);
    ctx.fillStyle = 'rgba(23,48,36,.78)'; ctx.fill();
    ctx.strokeStyle = 'rgba(235,232,183,.20)'; ctx.lineWidth = .7; ctx.stroke();
    ctx.fillStyle = collected ? '#cfdbc1' : '#f1edd0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, stop.x, stop.y - 23 + bob);
    if (routeIndex >= 0) {
      ctx.fillStyle = '#badf94'; ctx.beginPath(); ctx.arc(stop.x + 13, stop.y - 14 + bob, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#24422e'; ctx.font = 'bold 8px "DM Mono", monospace'; ctx.fillText(String(routeIndex + 1), stop.x + 13, stop.y - 14 + bob + .5);
    }
    ctx.restore();
  }

  function drawRoute(time) {
    const stops = routeStopObjects();
    if (!stops.length || state.phase !== 'day') return;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(state.bot.x, state.bot.y - 1);
    stops.forEach(stop => ctx.lineTo(stop.x, stop.y));
    ctx.strokeStyle = 'rgba(194,244,185,.46)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 6]); ctx.lineDashOffset = -(time * .004) % 9; ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  }

  function drawEnemy(enemy, index, time) {
    const hp = state.enemyHp[state.regionId][index];
    if (hp <= 0) return;
    const x = enemy.x; const y = enemy.y; const hop = Math.sin(time * .006 + index * 3) * 2;
    const body = state.regionId === 'orchard' ? '#80c9a0' : state.regionId === 'emberfen' ? '#d78d60' : '#91bd6b';
    ctx.save();
    ctx.fillStyle = 'rgba(27,45,28,.28)'; ctx.beginPath(); ctx.ellipse(x, y + 11, 17, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x, y + hop, 14, 12, 0, Math.PI, Math.PI * 2); ctx.lineTo(x + 14, y + hop + 5); ctx.quadraticCurveTo(x + 12, y + hop + 13, x, y + hop + 12); ctx.quadraticCurveTo(x - 13, y + hop + 12, x - 14, y + hop + 5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(38,75,51,.58)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = '#203e38'; ctx.beginPath(); ctx.arc(x - 4, y + hop + 2, 1.4, 0, Math.PI * 2); ctx.arc(x + 4, y + hop + 2, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8edc1'; ctx.beginPath(); ctx.arc(x - 4.5, y + hop + 1.3, .6, 0, Math.PI * 2); ctx.arc(x + 3.5, y + hop + 1.3, .6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = state.regionId === 'emberfen' ? '#f5d17c' : '#e7d98a';
    ctx.beginPath(); ctx.arc(x - 7, y + hop - 8, 3, 0, Math.PI * 2); ctx.arc(x + 6, y + hop - 7, 2.5, 0, Math.PI * 2); ctx.fill();
    // Little segmented health pips
    for (let p = 0; p < 2; p++) { ctx.fillStyle = p < hp ? '#f1cf8b' : 'rgba(34,54,37,.45)'; roundedRect(ctx, x - 9 + p * 11, y - 20, 8, 3, 2); ctx.fill(); }
    ctx.restore();
  }

  function drawGuardian(time) {
    const guardian = currentGuardian();
    const saved = guardianState(guardian);
    if (saved.defeated) {
      ctx.save(); ctx.globalAlpha = .7;
      ctx.fillStyle = '#d9df9a'; ctx.font = '13px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♡', guardian.x, guardian.y - 36 + Math.sin(time * .003) * 2);
      ctx.restore(); return;
    }
    const x = guardian.x; const y = guardian.y + Math.sin(time * .0016) * 1.4;
    ctx.save();
    ctx.fillStyle = 'rgba(28,44,25,.3)'; ctx.beginPath(); ctx.ellipse(x, y + 21, 39, 12, 0, 0, Math.PI * 2); ctx.fill();
    // Shell and scalloped plates
    ctx.fillStyle = state.regionId === 'emberfen' ? '#765f42' : state.regionId === 'orchard' ? '#447b67' : '#3e7047';
    ctx.beginPath(); ctx.ellipse(x, y, 36, 26, 0, Math.PI, 0); ctx.lineTo(x + 37, y + 10); ctx.quadraticCurveTo(x, y + 37, x - 37, y + 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#acb46c'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = state.regionId === 'emberfen' ? '#9c8054' : state.regionId === 'orchard' ? '#609275' : '#59864d';
    ctx.beginPath(); ctx.ellipse(x, y + 1, 28, 20, 0, Math.PI, 0); ctx.lineTo(x + 28, y + 8); ctx.quadraticCurveTo(x, y + 28, x - 28, y + 8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(202,218,139,.49)'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 20); ctx.moveTo(x - 20, y - 11); ctx.quadraticCurveTo(x - 12, y + 3, x - 10, y + 18); ctx.moveTo(x + 20, y - 11); ctx.quadraticCurveTo(x + 12, y + 3, x + 10, y + 18); ctx.stroke();
    // head, sleepy eyes, tiny antennae
    ctx.fillStyle = state.regionId === 'emberfen' ? '#c6875a' : '#c3ac70';
    ctx.beginPath(); ctx.ellipse(x, y + 18, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#846d48'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 9, y + 16); ctx.quadraticCurveTo(x - 18, y + 6, x - 20, y + 12); ctx.moveTo(x + 9, y + 16); ctx.quadraticCurveTo(x + 18, y + 6, x + 20, y + 12); ctx.stroke();
    ctx.strokeStyle = '#445343'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 6, y + 18); ctx.lineTo(x - 1, y + 20); ctx.moveTo(x + 2, y + 20); ctx.lineTo(x + 7, y + 18); ctx.stroke();
    for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#e2cf83' : '#edda91'; ctx.beginPath(); ctx.arc(x - 17 + k * 11, y - 7 + (k % 2) * 9, 2.2, 0, Math.PI * 2); ctx.fill(); }
    // tag
    ctx.font = '8px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const label = `${guardian.name} · snoozing`;
    const width = ctx.measureText(label).width + 12;
    roundedRect(ctx, x - width / 2, y - 45, width, 14, 5); ctx.fillStyle = 'rgba(25,47,36,.83)'; ctx.fill();
    ctx.strokeStyle = 'rgba(233,221,161,.25)'; ctx.lineWidth = .8; ctx.stroke(); ctx.fillStyle = '#f1e8bd'; ctx.fillText(label, x, y - 38);
    ctx.fillStyle = '#d1c57f'; ctx.font = '10px "DM Sans", sans-serif'; ctx.fillText('z z', x + 24, y - 28 - Math.sin(time * .002) * 2);
    ctx.restore();
  }

  function drawPlayer(time) {
    const x = state.player.x; const y = state.player.y;
    ctx.save();
    ctx.fillStyle = 'rgba(23,44,29,.31)'; ctx.beginPath(); ctx.ellipse(x, y + 11, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
    // little boots
    ctx.fillStyle = '#574638'; roundedRect(ctx, x - 9, y + 3, 7, 10, 3); ctx.fill(); roundedRect(ctx, x + 2, y + 3, 7, 10, 3); ctx.fill();
    // jacket with a cozy scarf
    ctx.fillStyle = '#d98753'; roundedRect(ctx, x - 11, y - 7, 22, 19, 7); ctx.fill();
    ctx.fillStyle = '#e9a466'; roundedRect(ctx, x - 8, y - 8, 16, 11, 5); ctx.fill();
    ctx.fillStyle = '#e8c273'; roundedRect(ctx, x - 11, y - 1, 7, 4, 2); ctx.fill();
    // head and dark pine-colored hair
    ctx.fillStyle = '#dba979'; ctx.beginPath(); ctx.arc(x, y - 13, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#28483f'; ctx.beginPath(); ctx.arc(x, y - 16, 9.2, Math.PI, Math.PI * 2); ctx.lineTo(x + 9, y - 12); ctx.quadraticCurveTo(x + 4, y - 15, x + 1, y - 11); ctx.quadraticCurveTo(x - 4, y - 14, x - 9, y - 10); ctx.closePath(); ctx.fill();
    // satchel strap + cheek
    ctx.strokeStyle = '#f2d081'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 8, y - 4); ctx.lineTo(x - 5, y + 7); ctx.stroke();
    ctx.fillStyle = '#8b4f43'; ctx.beginPath(); ctx.arc(x + (state.player.direction === 'left' ? -3 : 4), y - 12, 1.1, 0, Math.PI * 2); ctx.fill();
    if (state.phase === 'day' && Math.sin(time * .006) > .96) { ctx.fillStyle = '#e9f2bd'; ctx.beginPath(); ctx.arc(x + 8, y - 21, 1.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function drawBot(time) {
    const x = state.bot.x; const y = state.bot.y;
    const bob = state.phase === 'day' ? Math.sin(time * .004 + .8) * 1.5 : Math.sin(time * .005) * 2;
    ctx.save();
    ctx.fillStyle = 'rgba(22,44,31,.32)'; ctx.beginPath(); ctx.ellipse(x, y + 9, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
    // soft hovering treads
    ctx.fillStyle = '#536c56'; roundedRect(ctx, x - 13, y - 5 + bob, 5, 16, 2); ctx.fill(); roundedRect(ctx, x + 8, y - 5 + bob, 5, 16, 2); ctx.fill();
    ctx.fillStyle = '#f1e5c5'; roundedRect(ctx, x - 11, y - 12 + bob, 22, 22, 6); ctx.fill();
    ctx.strokeStyle = '#aa9466'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#34574c'; roundedRect(ctx, x - 8, y - 7 + bob, 16, 10, 4); ctx.fill();
    ctx.shadowColor = '#b9f4c5'; ctx.shadowBlur = 7; ctx.fillStyle = '#b5f1bf';
    ctx.beginPath(); ctx.ellipse(x - 4, y - 2 + bob, 1.7, 2.2, 0, 0, Math.PI * 2); ctx.ellipse(x + 4, y - 2 + bob, 1.7, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#cda75f'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y - 12 + bob); ctx.lineTo(x, y - 17 + bob); ctx.stroke();
    ctx.fillStyle = state.upgrades.battery > 0 ? '#f2d477' : '#a9df9e'; ctx.beginPath(); ctx.arc(x, y - 18 + bob, 2.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c9955c'; roundedRect(ctx, x - 4, y + 5 + bob, 8, 2.5, 1); ctx.fill();
    if (state.phase === 'day') {
      ctx.font = '7px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      roundedRect(ctx, x - 10, y + 14, 20, 11, 4); ctx.fillStyle = 'rgba(27,51,39,.75)'; ctx.fill(); ctx.fillStyle = '#d4e8c1'; ctx.fillText('Pip', x, y + 19.5);
    }
    ctx.restore();
  }

  function drawStars(time) {
    ctx.save();
    for (let i = 0; i < 50; i++) {
      const x = seeded(i, 11, 42) * WORLD_W;
      const y = seeded(i, 37, 21) * WORLD_H;
      const twinkle = .28 + (Math.sin(time * .002 + i * 2) + 1) * .23;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = i % 6 === 0 ? '#f8e5a9' : '#d9e2da';
      ctx.fillRect(x, y, i % 6 === 0 ? 2 : 1, i % 6 === 0 ? 2 : 1);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e7dfbd'; ctx.beginPath(); ctx.arc(60, 60, 17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(24,39,50,.88)'; ctx.beginPath(); ctx.arc(68, 55, 16, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawFloating(now) {
    state.floating.forEach(effect => {
      const age = (now - effect.born) / 1200;
      ctx.save(); ctx.globalAlpha = 1 - age; ctx.font = '600 10px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(28,42,23,.45)'; ctx.shadowBlur = 4; ctx.fillStyle = effect.color;
      ctx.fillText(effect.text, effect.x, effect.y - age * 20); ctx.restore();
    });
  }

  function updateInteractionPrompt() {
    if (state.phase !== 'day') { hint.classList.add('hidden'); return; }
    let candidate = null;
    const stop = nearestStop(56, true);
    if (stop) candidate = { x: stop.stop.x, y: stop.stop.y - 37, key: 'E', text: `Gather ${stop.stop.resourceName.toLowerCase()}` };
    const enemy = activeEnemies().map(item => ({ ...item, distance: dist(state.player, item) })).sort((a,b) => a.distance - b.distance)[0];
    if (enemy && enemy.distance < 40 && (!candidate || enemy.distance < 20)) candidate = { x: enemy.x, y: enemy.y - 26, key: 'SPACE', text: 'A gentle bonk' };
    const guardian = currentGuardian();
    const boss = guardianState(guardian);
    if (!boss.defeated && dist(state.player, guardian) < 86 && (!candidate || dist(state.player, guardian) < 38)) candidate = { x: guardian.x, y: guardian.y - 55, key: 'SPACE', text: `Wake ${guardian.name} gently` };
    if (!candidate) { hint.classList.add('hidden'); return; }
    hintKey.textContent = candidate.key;
    hintText.textContent = candidate.text;
    hint.style.left = `${candidate.x / WORLD_W * 100}%`;
    hint.style.top = `${candidate.y / WORLD_H * 100}%`;
    hint.classList.remove('hidden');
  }

  function drawWorld(now) {
    const time = now || performance.now();
    ctx.save();
    ctx.setTransform(canvas.width / WORLD_W, 0, 0, canvas.height / WORLD_H, 0, 0);
    ctx.clearRect(0, 0, WORLD_W, WORLD_H);
    drawGround(time);
    drawRoute(time);
    currentRegion().stops.forEach((stop, index) => drawNode(stop, index, time));
    currentRegion().enemies.forEach((enemy, index) => drawEnemy(enemy, index, time));
    drawGuardian(time);
    // Keep the foreground sorted by foot position for a little depth. Ari is tucked in once night falls.
    const things = [];
    if (state.phase === 'day' || state.phase === 'goingHome') {
      things.push({ y: state.player.y + 14, draw: () => drawPlayer(time) });
    }
    things.push({ y: state.bot.y + 9, draw: () => drawBot(time) });
    things.sort((a, b) => a.y - b.y).forEach(item => item.draw());
    if (state.attackAt && time - state.attackAt < 360) {
      const pulse = (time - state.attackAt) / 360;
      ctx.strokeStyle = `rgba(255,239,163,${.75 - pulse * .65})`; ctx.lineWidth = 2.2 - pulse;
      ctx.beginPath(); ctx.arc(state.player.x, state.player.y - 1, 12 + pulse * 23, 0, Math.PI * 2); ctx.stroke();
    }
    drawFloating(time);
    if (state.phase === 'goingHome') {
      ctx.fillStyle = 'rgba(178,111,91,.20)'; ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      ctx.fillStyle = 'rgba(251,195,131,.15)'; ctx.beginPath(); ctx.arc(537,77,95,0,Math.PI*2); ctx.fill();
    } else if (state.phase === 'night' || state.phase === 'rewards') {
      ctx.fillStyle = 'rgba(18,26,48,.67)'; ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      ctx.fillStyle = 'rgba(19,24,48,.12)'; ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      drawStars(time);
      // Keep the cottage window warm through the whole night shift.
      ctx.fillStyle = 'rgba(255,211,120,.9)'; roundedRect(ctx, 515, 73, 8, 8, 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,204,111,.24)'; ctx.beginPath(); ctx.arc(519,77,23,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
    updateInteractionPrompt();
  }

  function canvasPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width * WORLD_W, y: (event.clientY - rect.top) / rect.height * WORLD_H };
  }

  canvas.addEventListener('pointerdown', event => {
    if (state.phase !== 'day' || activeOverlays()) return;
    const point = canvasPosition(event);
    const stop = currentRegion().stops.find(item => dist(point, item) < 23 && !state.collected[`${state.regionId}:${item.id}`]);
    if (stop) {
      if (dist(state.player, stop) <= 45) gatherStop(stop);
      else {
        walkToStop(stop);
        speakToast(`Following the little path to ${stop.name}…`, 1600);
      }
      canvas.setPointerCapture?.(event.pointerId);
      return;
    }
    const guardian = currentGuardian();
    if (!guardianState(guardian).defeated && dist(point, guardian) < 39) {
      approachGuardian();
      return;
    }
    state.pendingNode = null;
    state.player.target = { x: clamp(point.x, 25, 615), y: clamp(point.y, 35, 374) };
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      for (const id of ['packModal', 'workshopModal', 'bossModal']) if (!document.getElementById(id).classList.contains('hidden')) closeModal(id);
      return;
    }
    if (activeOverlays()) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
    if (state.phase !== 'day') return;
    const key = event.key.toLowerCase();
    if (key === 'e' && !event.repeat) { interact(); return; }
    if (key === ' ' && !event.repeat) { attack(); return; }
    if (key === 'i' && !event.repeat) { openPack(); return; }
    if (key === 'h' && !event.repeat) { renderWorkshop(); showModal('workshopModal'); return; }
    if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)) keys.add(key);
  });
  window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());

  function renderWorkshop() {
    updateWorkshopUI();
  }

  document.getElementById('sleepButton').addEventListener('click', beginNight);
  document.getElementById('gatherButton').addEventListener('click', interact);
  document.getElementById('attackButton').addEventListener('click', attack);
  document.getElementById('guardianButton').addEventListener('click', () => {
    if (guardianState().defeated && currentGuardian().id === 'mossback') changeRegion('emberfen');
    else approachGuardian();
  });
  document.getElementById('openPack').addEventListener('click', openPack);
  document.getElementById('openWorkshop').addEventListener('click', () => { if (state.phase === 'day') { renderWorkshop(); showModal('workshopModal'); } });
  document.getElementById('collectRewards').addEventListener('click', claimRewards);
  document.getElementById('rewardClose').addEventListener('click', claimRewards);
  document.getElementById('bossGuideAction').addEventListener('click', approachGuardian);
  document.getElementById('guardianName').addEventListener('click', showBossGuide);
  document.getElementById('guardianName').style.cursor = 'pointer';
  document.getElementById('guardianName').title = 'Read the field note';
  document.getElementById('soundButton').addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    document.getElementById('soundButton').classList.toggle('is-muted', !state.soundOn);
    document.getElementById('soundButton').setAttribute('aria-label', state.soundOn ? 'Mute sound' : 'Turn sound on');
    if (state.soundOn) ping(630, .1);
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
  document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('pointerdown', event => {
    if (event.target !== overlay) return;
    if (overlay.id === 'packModal' || overlay.id === 'workshopModal' || overlay.id === 'bossModal') closeModal(overlay.id);
  }));

  let lastFrame = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - lastFrame) / 1000);
    lastFrame = now;
    updateGame(dt, now);
    drawWorld(now);
    requestAnimationFrame(frame);
  }

  updateHud();
  requestAnimationFrame(frame);
})();
