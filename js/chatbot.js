// ─── SoftMart Chatbot ────────────────────────────────────────────────────────

const chatbotHTML = `
<div id="smChatbot">
  <!-- Toggle Button -->
  <button id="chatToggle" onclick="toggleChat()" title="Chat with us">
    <i class="fas fa-comments" id="chatIcon"></i>
    <span class="chat-badge" id="chatBadge" style="display:none">1</span>
  </button>

  <!-- Chat Window -->
  <div id="chatWindow" style="display:none">
    <!-- Header -->
    <div id="chatHeader">
      <div class="d-flex align-items-center gap-2">
        <div id="chatAvatar"><i class="fas fa-robot"></i></div>
        <div>
          <div style="font-weight:700;font-size:.95rem">SoftMart Support</div>
          <div style="font-size:.72rem;opacity:.85"><span style="color:#86efac">●</span> Online</div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button onclick="clearChat()" title="Clear chat" style="background:rgba(255,255,255,.15);border:none;border-radius:6px;color:#fff;width:28px;height:28px;cursor:pointer"><i class="fas fa-trash-alt" style="font-size:.7rem"></i></button>
        <button onclick="toggleChat()" style="background:rgba(255,255,255,.15);border:none;border-radius:6px;color:#fff;width:28px;height:28px;cursor:pointer"><i class="fas fa-times"></i></button>
      </div>
    </div>

    <!-- Messages -->
    <div id="chatMessages"></div>

    <!-- Quick Replies -->
    <div id="quickReplies"></div>

    <!-- Input -->
    <div id="chatInputArea">
      <input type="text" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMessage()">
      <button onclick="sendMessage()" id="chatSendBtn"><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>
</div>`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const chatbotCSS = `
#smChatbot { position:fixed; bottom:24px; right:24px; z-index:99999; font-family:'Segoe UI',system-ui,sans-serif; }

#chatToggle {
  width:58px; height:58px; border-radius:50%; border:none; cursor:pointer;
  background:linear-gradient(135deg,#1d4ed8,#06b6d4);
  color:#fff; font-size:1.4rem; box-shadow:0 4px 20px rgba(13,110,253,.4);
  transition:all .3s; display:flex; align-items:center; justify-content:center;
  position:relative;
}
#chatToggle:hover { transform:scale(1.1); box-shadow:0 6px 24px rgba(13,110,253,.5); }
.chat-badge {
  position:absolute; top:-4px; right:-4px; background:#ef4444; color:#fff;
  border-radius:50%; width:20px; height:20px; font-size:.7rem; font-weight:700;
  display:flex; align-items:center; justify-content:center; border:2px solid #fff;
}

#chatWindow {
  position:absolute; bottom:70px; right:0;
  width:340px; height:500px; border-radius:20px;
  box-shadow:0 20px 60px rgba(0,0,0,.18);
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  animation:slideUp .3s ease;
}
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

#chatHeader {
  background:linear-gradient(135deg,#1d4ed8,#06b6d4);
  color:#fff; padding:14px 16px; display:flex; align-items:center; justify-content:space-between;
  flex-shrink:0;
}
#chatAvatar {
  width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.2);
  display:flex; align-items:center; justify-content:center; font-size:1.1rem;
}

#chatMessages {
  flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px;
  background:#f8faff;
}
#chatMessages::-webkit-scrollbar { width:4px; }
#chatMessages::-webkit-scrollbar-thumb { background:#bfdbfe; border-radius:2px; }

.msg-wrap { display:flex; align-items:flex-end; gap:8px; }
.msg-wrap.user { flex-direction:row-reverse; }
.msg-avatar {
  width:28px; height:28px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; color:#fff;
}
.bot-av { background:linear-gradient(135deg,#1d4ed8,#06b6d4); }
.user-av { background:linear-gradient(135deg,#7c3aed,#a855f7); }

.msg-bubble {
  max-width:230px; padding:10px 14px; border-radius:16px;
  font-size:.875rem; line-height:1.5; word-break:break-word;
}
.bot-bubble  { background:#fff; color:#1e293b; border-bottom-left-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.user-bubble { background:linear-gradient(135deg,#1d4ed8,#06b6d4); color:#fff; border-bottom-right-radius:4px; }
.msg-time { font-size:.65rem; color:#94a3b8; margin-top:3px; text-align:center; width:100%; }

.typing-dots { display:flex; gap:4px; padding:4px 0; }
.typing-dots span {
  width:7px; height:7px; border-radius:50%; background:#94a3b8;
  animation:bounce .8s infinite;
}
.typing-dots span:nth-child(2){animation-delay:.15s}
.typing-dots span:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

#quickReplies {
  padding:8px 12px; display:flex; flex-wrap:wrap; gap:6px;
  background:#fff; border-top:1px solid #e2e8f0; flex-shrink:0;
  min-height:44px;
}
.qr-btn {
  background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe;
  border-radius:20px; padding:5px 12px; font-size:.78rem; font-weight:600;
  cursor:pointer; transition:all .2s; white-space:nowrap;
}
.qr-btn:hover { background:#1d4ed8; color:#fff; border-color:#1d4ed8; }

#chatInputArea {
  padding:10px 12px; background:#fff; border-top:1px solid #e2e8f0;
  display:flex; gap:8px; align-items:center; flex-shrink:0;
}
#chatInput {
  flex:1; border:1px solid #e2e8f0; border-radius:24px;
  padding:8px 16px; font-size:.875rem; outline:none; transition:.2s;
}
#chatInput:focus { border-color:#1d4ed8; box-shadow:0 0 0 3px rgba(29,78,216,.1); }
#chatSendBtn {
  width:38px; height:38px; border-radius:50%; border:none; cursor:pointer;
  background:linear-gradient(135deg,#1d4ed8,#06b6d4); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:.9rem;
  transition:all .2s; flex-shrink:0;
}
#chatSendBtn:hover { transform:scale(1.1); }

@media(max-width:480px){
  #chatWindow { width:calc(100vw - 32px); right:-12px; height:420px; }
}`;

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const kb = {
  greet:      ["Hello! 👋 Welcome to SoftMart! How can I help you today?", "Hi there! 😊 I'm your SoftMart assistant. What can I do for you?"],
  bye:        ["Goodbye! 👋 Have a great day!", "See you later! 😊 Feel free to chat anytime."],
  thanks:     ["You're welcome! 😊 Anything else I can help with?", "Happy to help! Let me know if you need anything else."],

  // Buyer topics
  buy:        "You can browse all software on our <a href='products.html' style='color:#1d4ed8'>Products page</a>. Click <b>Add to Cart</b> and proceed to checkout. 🛒",
  price:      "All prices are shown in ৳ (Taka). We offer competitive prices with regular discounts!",
  discount:   "We regularly offer deals and discounts! Check our <a href='products.html' style='color:#1d4ed8'>Products page</a> for current offers. 🏷️",
  cart:       "You can view your cart by clicking the 🛒 icon in the navbar. Items are saved automatically.",
  checkout:   "Go to your <a href='cart.html' style='color:#1d4ed8'>Cart</a> and click <b>Proceed to Checkout</b>. Fill in your details and payment info.",
  payment:    "We accept <b>Credit/Debit Cards</b>, <b>PayPal</b>, and <b>Crypto</b>. All payments are SSL encrypted. 🔒",
  refund:     "We offer a <b>30-day money-back guarantee</b>! Contact support if you're not satisfied. ✅",
  download:   "After purchase, go to your <a href='buyer-dashboard.html' style='color:#1d4ed8'>Dashboard</a> → My Software → click <b>Download</b>. ⬇️",
  license:    "Your license key is available in <a href='buyer-dashboard.html' style='color:#1d4ed8'>Dashboard</a> → My License Keys. You can copy it anytime. 🔑",
  account:    "You can manage your account in your <a href='buyer-dashboard.html#profile' style='color:#1d4ed8'>Profile</a>. Update name, email and password there.",
  register:   "Creating an account is free! Click <a href='register.html' style='color:#1d4ed8'>Sign Up</a> and choose Buyer or Vendor account. 🆕",
  login:      "You can login from the <a href='login.html' style='color:#1d4ed8'>Login page</a>. Choose Buyer or Vendor tab and enter your credentials.",
  order:      "Track your orders in <a href='buyer-dashboard.html#orders' style='color:#1d4ed8'>Dashboard → Order History</a>. You can also download invoices there. 📋",
  categories: "We have 6 categories: <b>Antivirus, Design, Developer Tools, Office, AI Tools & Utility</b>. Browse them on the <a href='categories.html' style='color:#1d4ed8'>Categories page</a>.",
  antivirus:  "Our Antivirus software includes real-time protection, firewall & VPN features. Starting from ৳999/yr! 🛡️",
  design:     "Professional design tools for UI/UX, photo editing & illustration. Check our <a href='products.html' style='color:#1d4ed8'>Design category</a>! 🎨",
  ai:         "We have powerful AI tools for writing, coding & automation! Check <a href='products.html' style='color:#1d4ed8'>AI Tools</a> category. 🤖",
  support:    "Our support team is available <b>24/7</b>! You can also email us at <b>support@softmart.com</b> 📧",
  security:   "All payments are <b>256-bit SSL encrypted</b>. All software is verified by our security team before listing. 🔒",

  // Vendor topics
  sell:       "Want to sell software? Register a <b>Vendor Account</b> on our <a href='register.html' style='color:#1d4ed8'>Sign Up page</a>. It's free to join! 🏪",
  upload:     "After logging in as a vendor, go to <a href='vendor-dashboard.html#upload' style='color:#1d4ed8'>Vendor Dashboard → Upload Software</a> to list your product.",
  commission: "SoftMart charges a <b>20% platform fee</b> on each sale. You keep 80% of your revenue! 💰",
  payout:     "Payouts are processed via bank transfer. Go to <a href='vendor-dashboard.html#earnings' style='color:#1d4ed8'>Dashboard → Earnings</a> to request a payout.",
  sales:      "Track your sales performance in <a href='vendor-dashboard.html#sales' style='color:#1d4ed8'>Vendor Dashboard → Sales Report</a>. 📊",
  vendor:     "As a vendor you can upload software, manage listings, track sales & request payouts from your <a href='vendor-dashboard.html' style='color:#1d4ed8'>Vendor Dashboard</a>.",
};

// Quick reply sets
const quickSets = {
  start: ["🛒 How to Buy","💳 Payment","🔑 License Key","🏪 Sell Software","❓ Help"],
  buyer: ["⬇️ Download","🔄 Refund Policy","📋 My Orders","👤 My Account","⬅️ Back"],
  vendor:["📤 Upload Software","💰 Commission","💸 Payout","📊 Sales Report","⬅️ Back"],
  help:  ["🔒 Security","📦 Categories","🎁 Discounts","📞 Support","⬅️ Back"],
};

// ─── State ────────────────────────────────────────────────────────────────────
let chatOpen = false;
let badgeShown = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  const icon = document.getElementById('chatIcon');
  const badge = document.getElementById('chatBadge');
  win.style.display = chatOpen ? 'flex' : 'none';
  icon.className = chatOpen ? 'fas fa-times' : 'fas fa-comments';
  if (chatOpen) { badge.style.display='none'; scrollToBottom(); }
}

function clearChat() {
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('quickReplies').innerHTML = '';
  setTimeout(() => botGreet(), 300);
}

// ─── Messaging ────────────────────────────────────────────────────────────────
function addMsg(text, sender='bot') {
  const wrap = document.createElement('div');
  wrap.className = `msg-wrap ${sender}`;
  const isBot = sender === 'bot';
  const u = localStorage.getItem('sm_user');
  const initial = u ? JSON.parse(u).name[0].toUpperCase() : 'U';
  wrap.innerHTML = `
    <div class="msg-avatar ${isBot?'bot-av':'user-av'}">${isBot?'<i class="fas fa-robot"></i>':initial}</div>
    <div>
      <div class="msg-bubble ${isBot?'bot-bubble':'user-bubble'}">${text}</div>
      <div class="msg-time">${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;
  document.getElementById('chatMessages').appendChild(wrap);
  scrollToBottom();
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'msg-wrap bot'; el.id = 'typingIndicator';
  el.innerHTML = `<div class="msg-avatar bot-av"><i class="fas fa-robot"></i></div><div class="msg-bubble bot-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  document.getElementById('chatMessages').appendChild(el);
  scrollToBottom();
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function botReply(text, qset) {
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMsg(text, 'bot');
    if (qset) setQuickReplies(qset);
  }, 700 + Math.random()*400);
}

function scrollToBottom() {
  const el = document.getElementById('chatMessages');
  if (el) el.scrollTop = el.scrollHeight;
}

function setQuickReplies(set) {
  const container = document.getElementById('quickReplies');
  container.innerHTML = '';
  (quickSets[set]||[]).forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'qr-btn';
    btn.textContent = label;
    btn.onclick = () => handleInput(label);
    container.appendChild(btn);
  });
}

// ─── Input Handling ───────────────────────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  handleInput(text);
}

function handleInput(text) {
  addMsg(text, 'user');
  document.getElementById('quickReplies').innerHTML = '';
  const t = text.toLowerCase();

  // Back button
  if (t.includes('back') || t === '⬅️ back') { botReply("Sure! What else can I help you with?", 'start'); return; }

  // Greetings
  if (/^(hi|hello|hey|salaam|assalam|hola|yo|sup)/.test(t)) {
    const u = localStorage.getItem('sm_user');
    const name = u ? JSON.parse(u).name.split(' ')[0] : '';
    const greet = kb.greet[Math.floor(Math.random()*kb.greet.length)];
    botReply(name ? greet.replace('Welcome to','Welcome back,') + ` How are you, <b>${name}</b>?` : greet, 'start');
    return;
  }
  if (/bye|goodbye|see you|cya/.test(t)) { botReply(kb.bye[Math.floor(Math.random()*kb.bye.length)]); return; }
  if (/thank|thanks|thnx|thx/.test(t)) { botReply(kb.thanks[Math.floor(Math.random()*kb.thanks.length)], 'start'); return; }

  // Topics
  if (/buy|purchase|kena|kini/.test(t))          { botReply(kb.buy, 'buyer'); return; }
  if (/price|cost|daam|taka|৳/.test(t))          { botReply(kb.price, 'start'); return; }
  if (/discount|offer|deal|sale/.test(t))         { botReply(kb.discount, 'start'); return; }
  if (/cart|basket/.test(t))                       { botReply(kb.cart, 'buyer'); return; }
  if (/checkout|pay now/.test(t))                  { botReply(kb.checkout, 'buyer'); return; }
  if (/payment|pay|card|paypal|crypto/.test(t))   { botReply(kb.payment, 'buyer'); return; }
  if (/refund|return|money back/.test(t))          { botReply(kb.refund, 'start'); return; }
  if (/download|install/.test(t))                  { botReply(kb.download, 'buyer'); return; }
  if (/license|key|activation/.test(t))            { botReply(kb.license, 'buyer'); return; }
  if (/account|profile|setting/.test(t))           { botReply(kb.account, 'buyer'); return; }
  if (/register|signup|sign up|create account/.test(t)) { botReply(kb.register, 'start'); return; }
  if (/login|sign in|signin/.test(t))              { botReply(kb.login, 'start'); return; }
  if (/order|history|invoice/.test(t))             { botReply(kb.order, 'buyer'); return; }
  if (/categor/.test(t))                           { botReply(kb.categories, 'help'); return; }
  if (/antivirus|virus|malware|security software/.test(t)) { botReply(kb.antivirus, 'help'); return; }
  if (/design|photoshop|illustrat/.test(t))        { botReply(kb.design, 'help'); return; }
  if (/ai|artificial intel|chatgpt|writing tool/.test(t)) { botReply(kb.ai, 'help'); return; }
  if (/support|help|contact|problem/.test(t))      { botReply(kb.support, 'help'); return; }
  if (/secure|safe|ssl|encrypt/.test(t))           { botReply(kb.security, 'start'); return; }

  // Vendor topics
  if (/sell|vendor|seller|becha/.test(t))          { botReply(kb.sell, 'vendor'); return; }
  if (/upload|list|submit/.test(t))                { botReply(kb.upload, 'vendor'); return; }
  if (/commission|fee|percent|charge/.test(t))     { botReply(kb.commission, 'vendor'); return; }
  if (/payout|withdraw|earning/.test(t))           { botReply(kb.payout, 'vendor'); return; }
  if (/sales|revenue|report/.test(t))              { botReply(kb.sales, 'vendor'); return; }
  if (/vendor dashboard|vendor panel/.test(t))     { botReply(kb.vendor, 'vendor'); return; }

  // Quick reply labels
  if (t.includes('how to buy'))    { botReply(kb.buy, 'buyer'); return; }
  if (t.includes('payment'))       { botReply(kb.payment, 'buyer'); return; }
  if (t.includes('license key'))   { botReply(kb.license, 'buyer'); return; }
  if (t.includes('sell software') || t.includes('sell')) { botReply(kb.sell, 'vendor'); return; }
  if (t.includes('upload software'))  { botReply(kb.upload, 'vendor'); return; }
  if (t.includes('commission'))       { botReply(kb.commission, 'vendor'); return; }
  if (t.includes('payout'))           { botReply(kb.payout, 'vendor'); return; }
  if (t.includes('sales report'))     { botReply(kb.sales, 'vendor'); return; }
  if (t.includes('refund policy'))    { botReply(kb.refund, 'start'); return; }
  if (t.includes('my orders'))        { botReply(kb.order, 'buyer'); return; }
  if (t.includes('my account'))       { botReply(kb.account, 'buyer'); return; }
  if (t.includes('discounts'))        { botReply(kb.discount, 'start'); return; }
  if (t.includes('categories'))       { botReply(kb.categories, 'help'); return; }

  // Fallback
  botReply("I'm not sure about that 🤔 Please choose a topic below or email us at <b>support@softmart.com</b>", 'start');
}

// ─── Bot Greeting ─────────────────────────────────────────────────────────────
function botGreet() {
  const u = localStorage.getItem('sm_user');
  const role = u ? JSON.parse(u).role : null;
  const name = u ? JSON.parse(u).name.split(' ')[0] : null;

  let msg = `👋 Hi${name ? ', <b>'+name+'</b>' : ''}! I'm the <b>SoftMart Assistant</b>.<br><br>`;
  if (role === 'vendor') {
    msg += `I see you're a <b>Vendor</b>! I can help you with uploading software, sales, payouts and more.`;
  } else if (role === 'buyer') {
    msg += `I can help you with purchases, downloads, license keys, and more!`;
  } else {
    msg += `I can help you with buying software, account issues, and general questions!`;
  }
  addMsg(msg, 'bot');
  setQuickReplies('start');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initChatbot() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = chatbotCSS;
  document.head.appendChild(style);

  // Inject HTML
  const div = document.createElement('div');
  div.innerHTML = chatbotHTML;
  document.body.appendChild(div.firstElementChild);

  // Show badge after 3s if chat is closed
  setTimeout(() => {
    if (!chatOpen) {
      document.getElementById('chatBadge').style.display = 'flex';
      badgeShown = true;
    }
  }, 3000);

  // Auto greet
  botGreet();
}

document.addEventListener('DOMContentLoaded', initChatbot);
