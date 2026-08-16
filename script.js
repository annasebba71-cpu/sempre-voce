/* =======================================================
   SEMPRE VOCÊ — script.js
   Versão esqueleto: só marcações de imagem e som.
   Troque os arquivos em assets/images e assets/audio pelos
   nomes indicados — nada aqui precisa mudar quando isso
   acontecer, a marcação vira imagem/som real sozinha.
   ======================================================= */

/* ---------- 1. Conteúdo dos capítulos ---------- */
const TOPICS = [
  {
    id: 'familia',
    title: 'Família',
    cardPhrase: 'Amor e companhia.',
    comfortPhrase: 'Você está cercado de carinho. Você não está sozinho.',
  },
  {
    id: 'cafe',
    title: 'Café',
    cardPhrase: 'Uma pausa com calma.',
    comfortPhrase: 'O aroma do café convida a um momento tranquilo.',
  },
  {
    id: 'flores',
    title: 'Flores',
    cardPhrase: 'Cores que trazem paz.',
    comfortPhrase: 'As flores trazem cor e um convite para respirar devagar.',
  },
  {
    id: 'musica',
    title: 'Música',
    cardPhrase: 'Uma canção suave.',
    comfortPhrase: 'Uma música suave pode trazer companhia e conforto.',
  },
  {
    id: 'natureza',
    title: 'Natureza',
    cardPhrase: 'Luz, árvores e passarinhos.',
    comfortPhrase: 'O vento e a luz trazem um momento de paz.',
  },
  {
    id: 'mar',
    title: 'Mar',
    cardPhrase: 'Ondas calmas, céu aberto.',
    comfortPhrase: 'O mar se move devagar. Cada onda traz calma.',
  },
];

// Convenção de nomes de arquivo — troque os arquivos, não os caminhos.
function imagePath(id){ return `assets/images/${id}.jpg`; }
function audioPath(id){ return `assets/audio/${id}.mp3`; }

const GUIDANCE_ITEMS = [
  'Vocês podem apenas observar juntos.',
  'Não é necessário fazer perguntas.',
  'Deixe a pessoa permanecer nesta cena pelo tempo que desejar.',
  'Uma palavra, um sorriso ou o silêncio já são formas de participação.',
  'Evite corrigir ou testar lembranças.',
  'Fale devagar e use frases curtas.',
];

// Experiência especial do capítulo Natureza: 5 cenas em sequência,
// avançadas manualmente pelo acompanhante — nunca automático.
const SUNRISE_SCENES = [
  { id: 'natureza-nascer-1', phrase: 'Ainda é noite. Está tudo calmo e silencioso.' },
  { id: 'natureza-nascer-2', phrase: 'Uma luz clara começa a aparecer. O dia está chegando.' },
  { id: 'natureza-nascer-3', phrase: 'O céu fica rosa e laranja. É bonito de ver.' },
  { id: 'natureza-nascer-4', phrase: 'O sol aparece. Você pode sentir o calor dele.' },
  { id: 'natureza-nascer-5', phrase: 'Os pássaros cantam. O novo dia começa.' },
];
const SUNRISE_AUDIO_ID = 'natureza-nascer';

/* ---------- 2. Referências de elementos ---------- */
const topicsGrid = document.getElementById('topics-grid');
const detailPanel = document.getElementById('detail-panel');
const detailImage = document.getElementById('detail-image');
const detailPlaceholder = document.getElementById('detail-placeholder');
const detailImagePathEl = document.getElementById('detail-image-path');
const detailTitle = document.getElementById('detail-title');
const detailPhrase = document.getElementById('detail-phrase');
const detailStatus = document.getElementById('detail-status');
const detailAudioPathEl = document.getElementById('detail-audio-path');
const btnPlay = document.getElementById('btn-play');
const btnBack = document.getElementById('btn-back');
const topicAudio = document.getElementById('topic-audio');

const guidanceOpenBtn = document.getElementById('guidance-open');
const guidancePanel = document.getElementById('guidance-panel');
const guidanceList = document.getElementById('guidance-list');
const guidanceCloseBtn = document.getElementById('guidance-close');

const scenePanel = document.getElementById('scene-panel');
const sceneClose = document.getElementById('scene-close');
const sceneImage = document.getElementById('scene-image');
const scenePlaceholder = document.getElementById('scene-placeholder');
const sceneImagePathEl = document.getElementById('scene-image-path');
const scenePhrase = document.getElementById('scene-phrase');
const sceneProgress = document.getElementById('scene-progress');
const scenePrev = document.getElementById('scene-prev');
const sceneNext = document.getElementById('scene-next');
const scenePlay = document.getElementById('scene-play');
const sceneStatus = document.getElementById('scene-status');
const sceneAudioPathEl = document.getElementById('scene-audio-path');
const sceneAudio = document.getElementById('scene-audio');

/* ---------- 3. Marcação de imagem reutilizável ---------- */
function buildMediaSlot(path, altText){
  const wrap = document.createElement('span');
  wrap.className = 'media-slot';
  wrap.innerHTML = `
    <img class="media-slot__img" alt="${altText}" hidden loading="lazy">
    <span class="media-slot__placeholder" aria-hidden="true">
      <svg class="media-slot__icon" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="9" width="36" height="30" rx="4" stroke="currentColor" stroke-width="2.3"/>
        <circle cx="17" cy="19" r="3.4" stroke="currentColor" stroke-width="2.1"/>
        <path d="M10 33l9.5-9.5 7.5 7.5 5.5-5.5 7.5 7.5" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
      <code>${path}</code>
    </span>
  `;
  const img = wrap.querySelector('img');
  img.addEventListener('load', ()=>{
    img.hidden = false;
    wrap.querySelector('.media-slot__placeholder').hidden = true;
  });
  img.src = path; // se o arquivo existir, o load troca a marcação pela imagem
  return wrap;
}

/* ---------- 4. Renderizar os 6 cards ---------- */
TOPICS.forEach(topic=>{
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'topic-card';
  card.setAttribute('aria-label', `${topic.title} — ${topic.cardPhrase} Toque para abrir.`);

  const imageWrap = document.createElement('span');
  imageWrap.className = 'topic-card__image-wrap';
  imageWrap.appendChild(buildMediaSlot(imagePath(topic.id), `Imagem do capítulo ${topic.title}`));

  const body = document.createElement('span');
  body.className = 'topic-card__body';
  body.innerHTML = `
    <h2>${topic.title}</h2>
    <p>${topic.cardPhrase}</p>
    <span class="topic-card__cta">Toque para abrir</span>
  `;

  card.appendChild(imageWrap);
  card.appendChild(body);
  card.addEventListener('click', () => {
    if(topic.id === 'natureza'){
      openSunriseSequence(card);
    } else {
      openDetail(topic, card);
    }
  });
  topicsGrid.appendChild(card);
});

/* ---------- 5. Painel de detalhe ---------- */
let currentTopic = null;
let lastFocusedCard = null;

function openDetail(topic, triggerEl){
  currentTopic = topic;
  lastFocusedCard = triggerEl || null;

  const path = imagePath(topic.id);
  detailImage.src = path;
  detailImage.alt = `Imagem do capítulo ${topic.title}`;
  detailImage.hidden = true;
  detailPlaceholder.hidden = false;
  detailImagePathEl.textContent = path;
  detailImage.onload = ()=>{ detailImage.hidden = false; detailPlaceholder.hidden = true; };

  detailTitle.textContent = topic.title;
  detailPhrase.textContent = topic.comfortPhrase;

  topicAudio.pause();
  topicAudio.src = audioPath(topic.id);
  topicAudio.currentTime = 0;
  setPlayState(false);
  setStatus('');
  detailAudioPathEl.textContent = audioPath(topic.id);

  detailPanel.hidden = false;
  document.body.style.overflow = 'hidden';
  btnBack.focus();
}

function closeDetail(){
  topicAudio.pause();
  detailPanel.hidden = true;
  document.body.style.overflow = '';
  currentTopic = null;
  if(lastFocusedCard){ lastFocusedCard.focus(); }
}

btnBack.addEventListener('click', closeDetail);

detailPanel.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ closeDetail(); }
});

function setStatus(text){ detailStatus.textContent = text; }

function setPlayState(isPlaying){
  btnPlay.textContent = isPlaying ? '❚❚ Pausar' : '▶ Reproduzir';
  btnPlay.setAttribute('aria-pressed', String(isPlaying));
}

btnPlay.addEventListener('click', ()=>{
  if(topicAudio.paused){
    topicAudio.play()
      .then(()=>{ setPlayState(true); setStatus(''); })
      .catch(()=>{ setPlayState(false); setStatus('Som ainda não adicionado para este capítulo.'); });
  } else {
    topicAudio.pause();
    setPlayState(false);
  }
});

topicAudio.addEventListener('ended', ()=> setPlayState(false));
topicAudio.addEventListener('error', ()=>{
  setPlayState(false);
  setStatus('Som ainda não adicionado para este capítulo.');
});

/* ---------- 5b. Sequência Natureza → Nascer do Sol (5 cenas) ---------- */
SUNRISE_SCENES.forEach((_, i)=>{
  const dot = document.createElement('span');
  dot.className = 'scene-dot';
  sceneProgress.appendChild(dot);
});
const sceneDots = Array.from(sceneProgress.querySelectorAll('.scene-dot'));

let sceneIndex = 0;
let sceneLastFocusedCard = null;

function renderScene(){
  const scene = SUNRISE_SCENES[sceneIndex];

  const path = imagePath(scene.id);
  sceneImage.src = path;
  sceneImage.alt = `Imagem da cena ${sceneIndex + 1} do nascer do sol`;
  sceneImage.hidden = true;
  scenePlaceholder.hidden = false;
  sceneImagePathEl.textContent = path;
  sceneImage.onload = ()=>{ sceneImage.hidden = false; scenePlaceholder.hidden = true; };

  scenePhrase.textContent = scene.phrase;
  sceneDots.forEach((dot, i)=> dot.classList.toggle('is-active', i === sceneIndex));

  scenePrev.hidden = sceneIndex === 0;
  const isLast = sceneIndex === SUNRISE_SCENES.length - 1;
  sceneNext.textContent = isLast ? 'Concluir' : 'Continuar →';
}

function openSunriseSequence(triggerEl){
  sceneLastFocusedCard = triggerEl || null;
  sceneIndex = 0;
  renderScene();

  sceneAudio.pause();
  sceneAudio.src = audioPath(SUNRISE_AUDIO_ID);
  sceneAudio.currentTime = 0;
  setScenePlayState(false);
  sceneStatus.textContent = '';
  sceneAudioPathEl.textContent = audioPath(SUNRISE_AUDIO_ID);

  scenePanel.hidden = false;
  document.body.style.overflow = 'hidden';
  sceneClose.focus();
}

function closeSunriseSequence(){
  sceneAudio.pause();
  scenePanel.hidden = true;
  document.body.style.overflow = '';
  if(sceneLastFocusedCard){ sceneLastFocusedCard.focus(); }
}

sceneClose.addEventListener('click', closeSunriseSequence);
scenePanel.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ closeSunriseSequence(); }
});

// Navegação é sempre uma ação explícita do acompanhante — nunca automática.
scenePrev.addEventListener('click', ()=>{
  if(sceneIndex > 0){ sceneIndex--; renderScene(); }
});
sceneNext.addEventListener('click', ()=>{
  const isLast = sceneIndex === SUNRISE_SCENES.length - 1;
  if(isLast){
    closeSunriseSequence();
  } else {
    sceneIndex++;
    renderScene();
  }
});

function setScenePlayState(isPlaying){
  scenePlay.textContent = isPlaying ? '❚❚ Pausar som' : '▶ Som ambiente';
  scenePlay.setAttribute('aria-pressed', String(isPlaying));
}

scenePlay.addEventListener('click', ()=>{
  if(sceneAudio.paused){
    sceneAudio.play()
      .then(()=>{ setScenePlayState(true); sceneStatus.textContent = ''; })
      .catch(()=>{ setScenePlayState(false); sceneStatus.textContent = 'Som ainda não adicionado para esta experiência.'; });
  } else {
    sceneAudio.pause();
    setScenePlayState(false);
  }
});

sceneAudio.addEventListener('ended', ()=> setScenePlayState(false));
sceneAudio.addEventListener('error', ()=>{
  setScenePlayState(false);
  sceneStatus.textContent = 'Som ainda não adicionado para esta experiência.';
});

/* ---------- 6. Painel de orientação ao acompanhante ---------- */
GUIDANCE_ITEMS.forEach(text=>{
  const li = document.createElement('li');
  li.textContent = text;
  guidanceList.appendChild(li);
});

function openGuidance(){
  guidancePanel.hidden = false;
  guidanceCloseBtn.focus();
}
function closeGuidance(){
  guidancePanel.hidden = true;
  guidanceOpenBtn.focus();
}
guidanceOpenBtn.addEventListener('click', openGuidance);
guidanceCloseBtn.addEventListener('click', closeGuidance);
guidancePanel.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ closeGuidance(); }
});
