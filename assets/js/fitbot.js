/* ==============================================
   FITBOT AI CHAT PAGE
   A free-form general fitness assistant — 
   entirely separate from the workout generator.
   Same architecture: maintains conversation
   history, streams through the Anthropic API.
============================================== */
(function() {
 
  const msgArea  = document.getElementById('fitbotMessages');
  const input    = document.getElementById('fitbotInput');
  const sendBtn  = document.getElementById('fitbotSendBtn');
 
  let fbMessages = []; // FitBot's own conversation history
  let fbLoading  = false;
 
  /* ---- FitBot system prompt — general fitness assistant ---- */
  const FB_SYSTEM = `You are FitBot, a knowledgeable and energetic fitness AI assistant built into the FitForge app.
 
You can answer ANY fitness-related question, including:
- Exercise technique and form corrections
- Training splits, programming, and periodisation
- Nutrition, meal timing, and macros
- Supplements (evidence-based advice only)
- Recovery, sleep, and stress management
- Motivation and habit-building
- Equipment recommendations
- Injury prevention and rehabilitation guidance (not medical diagnosis)
 
You are NOT a workout plan generator — that's handled by the Workout tab. Here you answer specific questions and have deeper conversations.
 
Keep replies concise, clear, and practical. Use short paragraphs. Be warm and motivating without being annoying. If the user asks something requiring a doctor (medical conditions, injury diagnosis), say so kindly and suggest professional advice.`;
 
  /* ---- Append a bubble to FitBot chat ---- */
  function fbAppend(role, html) {
    if (role === 'ai') {
      const meta = document.createElement('div');
      meta.className = 'msg-meta';
      meta.innerHTML = '<i class="fas fa-robot"></i> FitBot';
      msgArea.appendChild(meta);
    }
    const bubble = document.createElement('div');
    bubble.className = `msg ${role}`;
    bubble.innerHTML = html;
    msgArea.appendChild(bubble);
    msgArea.scrollTop = msgArea.scrollHeight;
  }
 
  /* ---- Typing indicator ---- */
  function fbShowTyping() {
    const meta = document.createElement('div');
    meta.className = 'msg-meta';
    meta.innerHTML = '<i class="fas fa-robot"></i> FitBot';
    meta.id = 'fbTypingMeta';
    msgArea.appendChild(meta);
    const dots = document.createElement('div');
    dots.className = 'typing-indicator';
    dots.id = 'fbTypingDots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    msgArea.appendChild(dots);
    msgArea.scrollTop = msgArea.scrollHeight;
  }
 
  function fbHideTyping() {
    const dots = document.getElementById('fbTypingDots');
    const meta = document.getElementById('fbTypingMeta');
    if (dots) dots.remove();
    if (meta) meta.remove();
  }
 
  /* ---- Convert markdown to HTML (shared pattern) ---- */
  function mdToHtml(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
 
  /* ---- Call Anthropic API for FitBot ---- */
  async function fbCallClaude(userMsg) {
    fbMessages.push({ role: 'user', content: userMsg });
    fbLoading = true;
    sendBtn.disabled = true;
    fbShowTyping();
 
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: FB_SYSTEM,
          messages: fbMessages
        })
      });
      const data = await res.json();
      fbHideTyping();
 
      const aiText = (data.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');
 
      if (aiText) {
        fbMessages.push({ role: 'assistant', content: aiText });
        fbAppend('ai', mdToHtml(aiText));
      } else {
        fbAppend('ai', 'Hmm, I had trouble responding. Try again in a moment!');
      }
    } catch (e) {
      fbHideTyping();
      fbAppend('ai', 'Network error — check your connection and try again.');
    }
 
    fbLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }
 
  /* ---- Send handler ---- */
  function fbSend() {
    const text = input.value.trim();
    if (!text || fbLoading) return;
    input.value = '';
    input.style.height = 'auto';
    fbAppend('user', text);
    fbCallClaude(text);
  }
 
  sendBtn.addEventListener('click', fbSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fbSend(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
 
  /* ---- FitBot welcome message & quick questions ---- */
  window.addEventListener('load', () => {
    const welcome = `
      Hey! I'm <strong>FitBot</strong> 🤖 — your fitness Q&A companion.<br><br>
      Ask me anything: form tips, nutrition, supplements, recovery, or just talk training. Try one of these:
      <div class="quick-chips">
        <div class="q-chip" onclick="fbChip('What\\'s the best way to increase my bench press?')">Bench press tips</div>
        <div class="q-chip" onclick="fbChip('How much protein do I really need daily?')">Protein intake</div>
        <div class="q-chip" onclick="fbChip('I have sore knees from squatting. What should I do?')">Knee pain help</div>
        <div class="q-chip" onclick="fbChip('What are the best supplements for muscle growth?')">Supplements</div>
      </div>`;
    fbAppend('ai', welcome);
  });
 
  /* ---- Quick chip for FitBot ---- */
  window.fbChip = function(text) {
    input.value = text;
    fbSend();
  };

})();
