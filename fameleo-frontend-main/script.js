const input = document.querySelector('input');
const messages = document.getElementById('messages');
const sendBtn = document.querySelector('.send');

let currentPersona = "familo AI";

/* ===================== TOAST ===================== */
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;
    top:140px;
    left:50%;
    transform:translateX(-50%);
    background:rgba(0,255,255,0.2);
    color:#00ffff;
    padding:12px 30px;
    border-radius:50px;
    border:1px solid #00ffff;
    font-weight:bold;
    z-index:9999;
    backdrop-filter:blur(10px);
    animation:fadeInOut 3s forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ===================== AVATAR SELECTION ===================== */
function activateAvatar(persona) {
  document.querySelectorAll('.avatars img, .right-avatars img').forEach(img => {
    img.style.border = '4px solid #666';
    img.style.boxShadow = 'none';
  });

  const target = document.querySelector(`[data-persona="${persona}"]`);
  if (target) {
    target.style.border = '4px solid #00ffff';
    target.style.boxShadow = '0 0 30px rgba(0,255,255,0.8)';
    currentPersona = persona;
    showToast(`Now talking to ${persona}`);
  }
}

/* Left avatars */
document.querySelectorAll('.avatars img').forEach(img => {
  img.addEventListener('click', () => {
    activateAvatar(img.dataset.persona);
  });
});

/* Right avatars */
document.querySelectorAll('.right-avatars img').forEach(img => {
  img.addEventListener('click', () => {
    activateAvatar(img.dataset.persona);
  });
});

/* ===================== SEND MESSAGE ===================== */

let isWaitingForReply = false; // 🔒 lock flag

async function sendMessage() {
  if (isWaitingForReply) return; // ❌ block new message

  const text = input.value.trim();
  if (!text) return;

  isWaitingForReply = true;      // 🔒 lock input
  input.value = "";             // ✅ clear input immediately
  input.disabled = true;        // ✅ hide typing ability

  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<p>${escapeHtml(text)}</p>`;
  messages.appendChild(userMsg);

  const thinking = document.createElement('div');
  thinking.className = 'message bot';
  thinking.innerHTML = `<p><i>${currentPersona} is thinking...</i></p>`;
  messages.appendChild(thinking);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("https://fameleo-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, persona: currentPersona })
    });

    const data = await res.json();
    thinking.remove();

    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.innerHTML = `<p><strong>${currentPersona}:</strong><br>${data.reply}</p>`;
    messages.appendChild(botMsg);

  } catch {
    thinking.remove();
  }

  // ✅ unlock input AFTER response
  isWaitingForReply = false;
  input.disabled = false;
  input.focus();
  messages.scrollTop = messages.scrollHeight;
}


sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

/* ===================== SUGGESTIONS (NEW, WORKING) ===================== */

const suggestionsData = [
  { text: "💖 Talk to GF", persona: "GF", message: "Talk to me like my loving girlfriend" },
  { text: "🧠 Need advice", persona: "Bro", message: "I need life advice" },
  { text: "😔 Feeling lonely", persona: "Friend", message: "I feel lonely, talk to me" },
  { text: "🔥 Motivate me", persona: "Mom", message: "Motivate me, I feel low" }
];

const suggestionsBox = document.getElementById('suggestions');

function renderSuggestions() {
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = "";
  suggestionsData.forEach(s => {
    const btn = document.createElement('div');
    btn.className = 'suggestion';
    btn.innerText = s.text;

    btn.onclick = () => {
      activateAvatar(s.persona);   // ✅ activates GF avatar
      input.value = s.message;     // ✅ fills message
      sendBtn.click();             // ✅ sends
      suggestionsBox.innerHTML = ""; // hide after click
    };

    suggestionsBox.appendChild(btn);
  });
}

/* Show suggestions on load */
renderSuggestions();

/* ===================== TOAST ANIMATION ===================== */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
  0%{opacity:0;transform:translateX(-50%) translateY(-20px)}
  15%,85%{opacity:1;transform:translateX(-50%) translateY(0)}
  100%{opacity:0;transform:translateX(-50%) translateY(-20px)}
}`;
document.head.appendChild(style);



const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});


const avatarToggleBtn = document.getElementById('toggleAvatarsBtn');
const avatarBar = document.getElementById('avatarBarContainer');

avatarToggleBtn.addEventListener('click', () => {
  avatarBar.classList.toggle('open');
});


const rightAvatarBtn = document.getElementById('toggleRightAvatars');
const rightAvatars = document.getElementById('rightAvatars');

rightAvatarBtn.addEventListener('click', () => {
  rightAvatars.classList.toggle('open');
});



function activateAvatar(persona) {
  document.querySelectorAll('.avatars img, .right-avatars img').forEach(img => {
    img.style.border = '4px solid #666';
    img.style.boxShadow = 'none';
  });

  const target = document.querySelector(`[data-persona="${persona}"]`);
  if (target) {
    target.style.border = '4px solid #00ffff';
    target.style.boxShadow = '0 0 30px rgba(0,255,255,0.8)';
    currentPersona = persona;
    showToast(`Now talking to ${persona}`);
  }

  /* ✅ AUTO CLOSE AVATAR PANELS */
  document.getElementById('avatarBarContainer')?.classList.remove('open');
  document.getElementById('rightAvatars')?.classList.remove('open');
}
