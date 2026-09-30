// LUMORA – protótipo navegável (sem back-end). Dados ficam no localStorage.
const SERVICES = [
  {id:1,n:'Corte & Estilo',p:120,i:'✂️'},{id:2,n:'Coloração',p:250,i:'🎨'},
  {id:3,n:'Hidratação Profunda',p:180,i:'💧'},{id:4,n:'Tranças',p:300,i:'🌿'},
  {id:5,n:'Aplicação de Peruca',p:150,i:'👑'},{id:6,n:'Penteado',p:90,i:'✨'}];
const WIGS = [
  {id:1,n:'Ondas Naturais',cm:60,p:890,c:'Cacheadas',tag:'Mais vendida',bg:'#e9c9b5'},
  {id:2,n:'Liso Sedoso',cm:50,p:750,c:'Lisas',bg:'#f3d9a8'},
  {id:3,n:'Cachos Afro',cm:30,p:680,c:'Crespas',tag:'Novidade',bg:'#d8d4d8'},
  {id:4,n:'Comprida Premium',cm:80,p:1200,c:'Coloridas',tag:'Premium',bg:'#f6dca0'},
  {id:5,n:'Ruiva Intensa',cm:45,p:980,c:'Coloridas',bg:'#ecc8a0'},
  {id:6,n:'Crespo Volumoso',cm:25,p:620,c:'Crespas',tag:'Promoção',bg:'#dfd2c4'}];
const SLOTS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const R = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const load = (k,d) => { try { return JSON.parse(localStorage.getItem('lumora_'+k)) ?? d } catch { return d } };
const save = (k,v) => { try { localStorage.setItem('lumora_'+k, JSON.stringify(v)) } catch {} };

let users = load('users',[]), user = load('user',null), cart = load('cart',[]),
    appts = load('appts',[]), promo = load('promo',false),
    svc = 1, slot = null, filter = 'Todas';

function toast(t){ const e=$('#toast'); e.textContent=t; e.classList.add('show'); setTimeout(()=>e.classList.remove('show'),2200) }
function go(v){
  $$('.view').forEach(e=>e.classList.toggle('on',e.id==='view-'+v));
  $$('.bottom button').forEach(b=>b.classList.toggle('on',b.dataset.go===v));
  scrollTo(0,0); if(v==='agendar') renderAgenda(); if(v==='carrinho') renderCart();
}
const price = s => s.id===3 && promo ? s.p*.8 : s.p;

function renderHome(){
  $('#services').innerHTML = SERVICES.map(s=>`<button class="svc ${s.id===svc?'sel':''}" data-svc="${s.id}"><i>${s.i}</i>${s.n}<br><small>${R(price(s))}</small></button>`).join('');
  $('#featured').innerHTML = WIGS.slice(0,3).map(wigCard).join('');
}
function wigCard(w){ return `<article class="card">${w.tag?`<span class="tag ${w.tag}">${w.tag}</span>`:''}
  <div class="thumb" style="background:${w.bg}">👩🏾‍🦱</div>
  <div class="info"><b>${w.n}</b><small>${w.cm} cm</small>
  <div class="buy"><span class="price">${R(w.p)}</span><button class="add" data-add="${w.id}" aria-label="Adicionar ${w.n} ao carrinho">+</button></div></div></article>` }
function renderWigs(){
  const cats = ['Todas','Lisas','Cacheadas','Crespas','Coloridas'];
  $('#filters').innerHTML = cats.map(c=>`<button class="chip ${c===filter?'on':''}" data-f="${c}">${c}</button>`).join('');
  $('#wigs').innerHTML = WIGS.filter(w=>filter==='Todas'||w.c===filter).map(wigCard).join('');
}
function renderAgenda(){
  $('#selServ').innerHTML = SERVICES.map(s=>`<option value="${s.id}" ${s.id===svc?'selected':''}>${s.n} – ${R(price(s))}</option>`).join('');
  const d = $('#inpDate').value, taken = appts.filter(a=>a.date===d).map(a=>a.time);
  $('#slots').innerHTML = SLOTS.map(t=>`<button type="button" class="chip ${t===slot?'on':''}" data-slot="${t}" ${taken.includes(t)?'disabled':''}>${t}</button>`).join('');
  const mine = appts.filter(a=>user && a.mail===user.mail);
  $('#myAppts').innerHTML = mine.length ? mine.map(apptRow(true)).join('') : '<p class="empty">Nenhum agendamento ainda.</p>';
  $('#ownerBox').hidden = !(user && user.owner);
  $('#allAppts').innerHTML = appts.length ? appts.map(apptRow(false)).join('') : '<p class="empty">Sem agendamentos.</p>';
}
const apptRow = mine => a => `<div class="item"><div><b>${a.svc}</b><br><small>${a.date.split('-').reverse().join('/')} às ${a.time}${mine?'':' · '+a.name}</small></div><button class="x" data-cancel="${a.id}">Cancelar</button></div>`;

function renderCart(){
  const n = cart.reduce((s,i)=>s+i.q,0), b=$('#cartCount'); b.hidden=!n; b.textContent=n;
  if(!cart.length){ $('#cartList').innerHTML='<p class="empty">Seu carrinho está vazio.</p>'; $('#cartFoot').innerHTML='<button class="btn gold full" data-go="perucas">Ver perucas</button>'; return }
  $('#cartList').innerHTML = cart.map(i=>{const w=WIGS.find(x=>x.id===i.id);
    return `<div class="item"><div><b>${w.n}</b><br><small>${w.cm} cm · ${R(w.p)}</small></div>
    <div class="qty"><button data-q="${w.id}" data-d="-1">−</button>${i.q}<button data-q="${w.id}" data-d="1">+</button></div></div>`}).join('');
  const t = cart.reduce((s,i)=>s+i.q*WIGS.find(x=>x.id===i.id).p,0);
  $('#cartFoot').innerHTML = `<div class="total"><span>Total</span><b class="price">${R(t)}</b></div><button class="btn dark full" id="btnCheckout">Finalizar compra</button>`;
}

// Autenticação (simulada)
let mode = 'in';
function setMode(m){ mode=m; $('#tabIn').classList.toggle('on',m==='in'); $('#tabUp').classList.toggle('on',m==='up');
  $('#fName').hidden = $('#fOwner').hidden = m==='in'; $('#authErr').textContent='' }
function openAuth(){ if(user){ user=null; save('user',null); paintUser(); renderAgenda(); toast('Você saiu da conta'); return } setMode('in'); $('#auth').showModal() }
function paintUser(){ $('#btnUser').textContent = user ? `Olá, ${user.name.split(' ')[0]} · Sair` : 'Entrar' }
function needLogin(){ if(user) return false; toast('Entre para continuar'); setMode('in'); $('#auth').showModal(); return true }

$('#formAuth').addEventListener('submit',e=>{
  e.preventDefault(); const mail=$('#aMail').value.trim().toLowerCase(), pass=$('#aPass').value;
  if(mode==='up'){
    if(users.some(u=>u.mail===mail)) return $('#authErr').textContent='E-mail já cadastrado.';
    user = {name:$('#aName').value.trim()||mail.split('@')[0], mail, pass, owner:$('#aOwner').checked}; users.push(user); save('users',users);
  } else {
    const u = users.find(u=>u.mail===mail&&u.pass===pass);
    if(!u) return $('#authErr').textContent='E-mail ou senha incorretos.';
    user = u;
  }
  save('user',user); $('#auth').close(); paintUser(); renderAgenda(); toast('Bem-vinda, '+user.name.split(' ')[0]+'!');
});

// Eventos
document.addEventListener('click',e=>{
  const t = e.target.closest('button,a'); if(!t) return; const d=t.dataset;
  if(t.tagName==='A') e.preventDefault();
  if(d.go) go(d.go);
  if(d.svc){ svc=+d.svc; renderHome(); toast(SERVICES.find(s=>s.id===svc).n+' selecionado') }
  if(d.f){ filter=d.f; renderWigs() }
  if(d.add){ const i=cart.find(x=>x.id==d.add); i?i.q++:cart.push({id:+d.add,q:1}); save('cart',cart); renderCart(); toast('Adicionado ao carrinho') }
  if(d.q){ const i=cart.find(x=>x.id==d.q); i.q+=+d.d; if(i.q<1) cart=cart.filter(x=>x!==i); save('cart',cart); renderCart() }
  if(d.slot){ slot=d.slot; renderAgenda() }
  if(d.cancel){ appts=appts.filter(a=>a.id!=d.cancel); save('appts',appts); renderAgenda(); toast('Agendamento cancelado') }
  if(t.id==='btnUser') openAuth();
  if(t.id==='tabIn') setMode('in'); if(t.id==='tabUp') setMode('up');
  if(t.id==='authCancel') $('#auth').close();
  if(t.id==='btnPromo'){ promo=true; svc=3; save('promo',true); renderHome(); go('agendar'); toast('Desconto de 20% aplicado') }
  if(t.id==='btnCheckout'&&!needLogin()){ cart=[]; save('cart',cart); renderCart(); toast('Pedido realizado! Obrigada pela compra.') }
});
$('#selServ').addEventListener('change',e=>{ svc=+e.target.value });
$('#inpDate').addEventListener('change',()=>{ slot=null; renderAgenda() });
$('#formAgenda').addEventListener('submit',e=>{
  e.preventDefault(); if(needLogin()) return;
  if(!slot) return toast('Escolha um horário');
  const s=SERVICES.find(x=>x.id===svc);
  appts.push({id:Date.now(),svc:s.n,date:$('#inpDate').value,time:slot,mail:user.mail,name:user.name});
  save('appts',appts); slot=null; renderAgenda(); toast('Horário agendado!');
});

// Início
$('#inpDate').min = new Date().toISOString().slice(0,10);
paintUser(); renderHome(); renderWigs(); renderCart(); go('home');
