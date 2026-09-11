const modal = document.querySelector('#modal');
const openModal = document.querySelector('#openModal');
const closeModal = document.querySelector('#closeModal');
const monitorForm = document.querySelector('#monitorForm');
const monitorList = document.querySelector('#monitorList');
const toast = document.querySelector('#toast');
const refreshButton = document.querySelector('#refreshButton');
const tokenInput = document.querySelector('#botToken');
const toggleToken = document.querySelector('#toggleToken');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function setModal(open) {
  modal.hidden = !open;
  if (open) document.querySelector('#botName').focus();
}

openModal.addEventListener('click', () => setModal(true));
closeModal.addEventListener('click', () => setModal(false));
modal.addEventListener('click', (event) => {
  if (event.target === modal) setModal(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setModal(false);
});

toggleToken.addEventListener('click', () => {
  const isHidden = tokenInput.type === 'password';
  tokenInput.type = isHidden ? 'text' : 'password';
  toggleToken.textContent = isHidden ? 'Hide' : 'Show';
});

const openBotAccess = document.querySelector('#openBotAccess');
const audioInput = document.querySelector('#audioInput');
const uploadButton = document.querySelector('#uploadButton');
const uploadShortcut = document.querySelector('#uploadShortcut');
const uploadZone = document.querySelector('#uploadZone');
const mainPlay = document.querySelector('#mainPlay');
const currentTrack = document.querySelector('#currentTrack');
const trackMeta = document.querySelector('#trackMeta');

function openAccessModal() {
  setModal(true);
}

openBotAccess.addEventListener('click', openAccessModal);
document.querySelectorAll('[data-open-access]').forEach((button) => button.addEventListener('click', openAccessModal));

monitorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(monitorForm);
  const name = String(formData.get('botName') || '').trim();
  if (!name) return;
  const card = document.createElement('article');
  card.className = 'bot-card';
  card.dataset.bot = name;
  card.innerHTML = `<div class="bot-card-top"><div class="bot-avatar teal">${name.slice(0, 2).toUpperCase()}</div><span class="status-pill live"><i></i> Online</span></div><strong>${name.replace(/[<>&]/g, '')}</strong><span class="bot-meta">Studio · token••••DEMO</span><div class="bot-card-foot"><span>Ready</span><button class="mini-play" data-action="play">Play</button></div>`;
  const openSlot = document.querySelector('#botGrid .empty-slot');
  if (!openSlot) {
    showToast('All eight bot slots are already in use.');
    return;
  }
  openSlot.replaceWith(card);
  showToast(`${name} connected to a local demo slot.`);
}, true);

document.querySelector('#botGrid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const card = button.closest('.bot-card');
  const isPlaying = button.dataset.action === 'play';
  const state = card.querySelector('.bot-card-foot span');
  state.textContent = isPlaying ? '▶ Playing' : 'Ready';
  button.dataset.action = isPlaying ? 'stop' : 'play';
  button.textContent = isPlaying ? 'Stop' : 'Play';
  button.className = isPlaying ? 'mini-stop' : 'mini-play';
  card.classList.toggle('active-bot', isPlaying);
  showToast(`${card.dataset.bot} ${isPlaying ? 'is now playing' : 'stopped'}.`);
});

document.querySelectorAll('.audio-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.audio-item').forEach((audio) => audio.classList.remove('selected'));
  item.classList.add('selected');
  currentTrack.textContent = item.dataset.track;
  trackMeta.textContent = `${item.dataset.duration} · Audio library`;
  showToast(`${item.dataset.track} selected for playback.`);
}));

document.querySelector('#browseAudio').addEventListener('click', () => document.querySelector('#library').scrollIntoView({ behavior: 'smooth', block: 'center' }));
document.querySelector('#viewAllAudio').addEventListener('click', () => showToast('Showing the 24 saved audio files in the local library.'));
document.querySelector('#stopAll').addEventListener('click', () => {
  document.querySelectorAll('.active-bot').forEach((card) => {
    card.classList.remove('active-bot');
    const state = card.querySelector('.bot-card-foot span');
    const button = card.querySelector('[data-action]');
    if (state) state.textContent = 'Ready';
    if (button) { button.dataset.action = 'play'; button.textContent = 'Play'; button.className = 'mini-play'; }
  });
  showToast('Playback stopped on all active bots.');
});
mainPlay.addEventListener('click', () => {
  const playing = mainPlay.textContent === '❚❚';
  mainPlay.textContent = playing ? '▶' : '❚❚';
  showToast(playing ? 'Playback paused.' : `Playing ${currentTrack.textContent}.`);
});

function browseForAudio() { audioInput.click(); }
uploadButton.addEventListener('click', browseForAudio);
uploadShortcut.addEventListener('click', browseForAudio);
uploadZone.addEventListener('dragover', (event) => { event.preventDefault(); uploadZone.classList.add('dragging'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
uploadZone.addEventListener('drop', (event) => { event.preventDefault(); uploadZone.classList.remove('dragging'); handleAudio(event.dataTransfer.files[0]); });
audioInput.addEventListener('change', () => handleAudio(audioInput.files[0]));
function handleAudio(file) {
  if (!file) return;
  if (!file.type.startsWith('audio/')) { showToast('Please choose an audio file.'); return; }
  showToast(`${file.name} uploaded to the local audio library.`);
}

document.querySelector('#voiceChannelForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const channelId = document.querySelector('#channelId').value.trim();
  if (!/^\d{17,20}$/.test(channelId)) {
    showToast('Enter a valid 17–20 digit voice channel ID.');
    return;
  }
  localStorage.setItem('sentinelVoiceChannelId', channelId);
  localStorage.setItem('sentinelVoiceTarget', document.querySelector('#targetBot').value);
  showToast('Voice channel destination saved locally.');
});

const savedChannelId = localStorage.getItem('sentinelVoiceChannelId');
if (savedChannelId) document.querySelector('#channelId').value = savedChannelId;
