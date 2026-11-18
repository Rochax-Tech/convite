(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const screens = { invite: $('#screen-invite'), choose: $('#screen-choose') };
  const btnYes = $('#btn-yes');
  const btnNo = $('#btn-no');
  const actions = $('#actions');
  const noMsg = $('#no-msg');
  const overlay = $('#overlay');
  const ovLink = $('#ov-link');
  const ovWarn = $('#ov-warn');
  const toastEl = $('#toast');

  /* ---------- personalização ---------- */
  $('#greeting').textContent = `Oi, ${CONFIG.nome}… ${CONFIG.apelido.toLowerCase()} 💕`;
  $('#ov-title').textContent = `Boa escolha, ${CONFIG.apelido.toLowerCase()}!`;

  /* ---------- corações flutuando no fundo ---------- */
  (function bgHearts() {
    const wrap = $('#hearts');
    const count = window.innerWidth < 600 ? 14 : 24;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.textContent = '♥';
      s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = 12 + Math.random() * 26 + 'px';
      s.style.animationDuration = 11 + Math.random() * 12 + 's';
      s.style.animationDelay = -Math.random() * 22 + 's';
      s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      s.style.setProperty('--r', (Math.random() * 60 - 30) + 'deg');
      s.style.setProperty('--o', (0.18 + Math.random() * 0.3).toFixed(2));
      s.style.color = Math.random() > .5 ? 'var(--rose)' : 'var(--pink-300)';
      wrap.appendChild(s);
    }
  })();

  /* ---------- explosão de corações ---------- */
  function burst(x, y, n = 26) {
    const wrap = $('#burst');
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = ['❤', '💖', '💕', '♥'][i % 4];
      const ang = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 190;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.fontSize = 16 + Math.random() * 24 + 'px';
      s.style.setProperty('--x', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--y', Math.sin(ang) * dist - 60 + 'px');
      s.style.setProperty('--r', (Math.random() * 80 - 40) + 'deg');
      wrap.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  /* ---------- toast (sem alert) ---------- */
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /* ---------- troca de telas ---------- */
  function show(name) {
    const cur = Object.values(screens).find(s => !s.hidden);
    const next = screens[name];
    if (cur === next) return;
    const reveal = () => {
      if (cur) { cur.hidden = true; cur.classList.remove('leave', 'active'); }
      next.hidden = false;
      next.classList.add('active', 'enter');
      window.scrollTo({ top: 0 });
      setTimeout(() => next.classList.remove('enter'), 700);
    };
    if (cur) { cur.classList.add('leave'); setTimeout(reveal, 330); } else reveal();
  }

  /* ---------- botão NÃO que foge ---------- */
  const PHRASES = [
    'Tem certeza disso? 🥺',
    'Poxa, eu estava preparando tudo com carinho...',
    'Acho que você clicou errado KKKKK',
    'Esse botão não está colaborando com você!',
    'Olha que eu sou uma ótima companhia, viu? 👀',
    'Ele está com medo de você, vai por mim 😂',
    'Quase! Tenta de novo... ou não 😏',
    'O botão ali do lado está bem mais convidativo, né? ❤️',
    'Eu avisei que ele era arisco 🙈',
    'Ai ai... você tem uma mira boa, mas ele corre mais!',
    'Sem chance, princesa, ele não deixa 😆',
    'Vai, aperta o SIM, sei que você quer 💕'
  ];
  let phraseBag = [];
  let attempts = 0;
  let fleeing = false;
  let ghost = null;
  let lastFlee = 0;

  function nextPhrase() {
    if (!phraseBag.length) phraseBag = PHRASES.map((_, i) => i).sort(() => Math.random() - .5);
    return PHRASES[phraseBag.pop()];
  }

  function rectsOverlap(a, b, pad = 14) {
    return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
  }

  function flee(fromX, fromY) {
    const now = performance.now();
    if (now - lastFlee < 180) return; // evita tremedeira
    lastFlee = now;

    // primeira fuga: tira o botão do cartão (evita ancestral com transform) e deixa um espaço no lugar
    if (!fleeing) {
      const r = btnNo.getBoundingClientRect();
      ghost = document.createElement('span');
      ghost.className = 'no-ghost';
      ghost.style.width = r.width + 'px';
      ghost.style.height = r.height + 'px';
      actions.appendChild(ghost);
      btnNo.classList.add('fleeing');
      btnNo.style.left = r.left + 'px';
      btnNo.style.top = r.top + 'px';
      document.body.appendChild(btnNo);
      fleeing = true;
      void btnNo.offsetWidth;
    }

    const w = btnNo.offsetWidth, h = btnNo.offsetHeight;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    const m = 12;
    const maxX = Math.max(m, vw - w - m), maxY = Math.max(m, vh - h - m);
    const yesR = btnYes.getBoundingClientRect();
    const curX = parseFloat(btnNo.style.left) || 0;
    const curY = parseFloat(btnNo.style.top) || 0;

    let best = null, bestScore = -1;
    for (let i = 0; i < 40; i++) {
      const x = m + Math.random() * (maxX - m);
      const y = m + Math.random() * (maxY - m);
      const cand = { left: x, top: y, right: x + w, bottom: y + h };
      if (rectsOverlap(cand, yesR)) continue;
      const cx = x + w / 2, cy = y + h / 2;
      const dPointer = fromX == null ? 999 : Math.hypot(cx - fromX, cy - fromY);
      const dMove = Math.hypot(x - curX, y - curY);
      const score = Math.min(dPointer, 260) + Math.min(dMove, 200);
      if (score > bestScore) { bestScore = score; best = { x, y }; }
    }
    if (!best) best = { x: m + Math.random() * (maxX - m), y: m + Math.random() * (maxY - m) };

    btnNo.style.left = best.x + 'px';
    btnNo.style.top = best.y + 'px';
    // reinicia a animação de balanço
    btnNo.style.animation = 'none'; void btnNo.offsetWidth; btnNo.style.animation = '';

    attempts++;
    noMsg.textContent = nextPhrase();
    noMsg.classList.remove('pop'); void noMsg.offsetWidth; noMsg.classList.add('pop');
    // SIM vai crescendo de leve (até um limite)
    btnYes.style.setProperty('--grow', Math.min(1 + attempts * 0.05, 1.45).toFixed(2));
  }

  function resetNo() {
    if (!fleeing) return;
    btnNo.classList.remove('fleeing');
    btnNo.style.left = btnNo.style.top = '';
    if (ghost) { ghost.replaceWith(btnNo); ghost = null; } else actions.appendChild(btnNo);
    fleeing = false;
  }

  const fleeFromEvent = e => {
    if (e.cancelable) e.preventDefault();
    const p = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    flee(p.clientX, p.clientY);
  };
  btnNo.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') fleeFromEvent(e); });
  btnNo.addEventListener('pointerdown', fleeFromEvent);
  btnNo.addEventListener('touchstart', fleeFromEvent, { passive: false });
  btnNo.addEventListener('mousedown', fleeFromEvent);
  btnNo.addEventListener('click', e => { e.preventDefault(); const r = btnNo.getBoundingClientRect(); flee(r.left + r.width / 2, r.top + r.height / 2); });
  btnNo.addEventListener('focus', () => { const r = btnNo.getBoundingClientRect(); flee(r.left + r.width / 2, r.top + r.height / 2); });

  // o mouse "assusta" o botão ao chegar perto
  document.addEventListener('pointermove', e => {
    if (!fleeing || e.pointerType !== 'mouse' || !screens.invite.classList.contains('active')) return;
    const r = btnNo.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (d < Math.max(r.width, r.height) * 0.95) flee(e.clientX, e.clientY);
  });

  // nunca fica preso fora da tela
  function clampNo() {
    if (!fleeing) return;
    const w = btnNo.offsetWidth, h = btnNo.offsetHeight;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    btnNo.style.left = Math.min(Math.max(12, parseFloat(btnNo.style.left) || 0), Math.max(12, vw - w - 12)) + 'px';
    btnNo.style.top = Math.min(Math.max(12, parseFloat(btnNo.style.top) || 0), Math.max(12, vh - h - 12)) + 'px';
  }
  window.addEventListener('resize', clampNo);
  window.addEventListener('orientationchange', () => setTimeout(clampNo, 250));

  /* ---------- botão SIM ---------- */
  btnYes.addEventListener('click', () => {
    const r = btnYes.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 34);
    btnYes.disabled = true;
    btnNo.style.pointerEvents = 'none';
    btnNo.style.opacity = '0';
    setTimeout(() => {
      show('choose');
      resetNo();
      btnNo.style.pointerEvents = btnNo.style.opacity = '';
      btnYes.disabled = false;
      setTimeout(() => burst(innerWidth / 2, innerHeight * .25, 22), 450);
    }, 850);
  });

  /* ---------- voltar ---------- */
  $('#btn-back').addEventListener('click', () => {
    noMsg.textContent = '';
    attempts = 0;
    btnYes.style.setProperty('--grow', 1);
    show('invite');
  });

  /* ---------- WhatsApp ---------- */
  const NAMES = { cafeteria: 'Cafeteria ☕', shopping: 'Shopping 🛍️', praia: 'Praia à tarde 🌊' };
  let redirectTimer = null;

  function buildLink(choice) {
    const number = String(WHATSAPP_NUMBER || '').replace(/\D/g, '');
    const text = encodeURIComponent(CONFIG.mensagens[choice]);
    return { number, url: `https://wa.me/${number}?text=${text}` };
  }

  // avisa o Netlify Forms qual opção foi escolhida (silencioso; falha sem atrapalhar)
  function logChoice(choice) {
    try {
      const body = new URLSearchParams({
        'form-name': 'escolha',
        escolha: NAMES[choice],
        mensagem: CONFIG.mensagens[choice]
      }).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }

  function choose(card) {
    const choice = card.dataset.choice;
    $$('.option').forEach(c => c.classList.toggle('picked', c === card));
    try { localStorage.setItem('passeioEscolhido', choice); } catch (_) {}
    console.info('[convite] opção escolhida:', NAMES[choice]);

    const { number, url } = buildLink(choice);
    ovLink.href = url;
    logChoice(choice);
    const r = card.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 3, 28);

    overlay.hidden = false;
    clearTimeout(redirectTimer);

    if (!number) {
      ovWarn.hidden = false;
      ovWarn.textContent = '⚠️ Falta configurar o número do WhatsApp no arquivo config.js (WHATSAPP_NUMBER).';
      $('#ov-text').innerHTML = 'Escolha registrada: <strong>' + NAMES[choice] + '</strong>';
      return;
    }
    ovWarn.hidden = true;
    $('#ov-text').innerHTML = 'Abrindo o WhatsApp com a mensagem prontinha… é só apertar <strong>ENVIAR</strong> 💌';
    redirectTimer = setTimeout(() => { window.location.href = url; }, 1700);
  }

  $$('.option').forEach(card => {
    card.addEventListener('click', () => choose(card));
  });

  $('#ov-cancel').addEventListener('click', () => {
    clearTimeout(redirectTimer);
    overlay.hidden = true;
    $$('.option').forEach(c => c.classList.remove('picked'));
  });
  ovLink.addEventListener('click', e => {
    if (!String(WHATSAPP_NUMBER || '').replace(/\D/g, '')) { e.preventDefault(); toast('Configure o número em config.js 😉'); return; }
    clearTimeout(redirectTimer);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) $('#ov-cancel').click(); });

  // exposto só para testes
  window.__convite = { buildLink, flee, getAttempts: () => attempts };
})();
