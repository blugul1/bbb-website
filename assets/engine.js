function load(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
let favs=load("bbb_favs",[]), submitted=load("bbb_submitted",[]), wanteds=load("bbb_wanted",[]), dealers=load("bbb_dealers",[]), leads=load("bbb_leads",0), myDealer=load("bbb_mydealer",null);
let apprL=load("bbb_appr_listings",[]), apprW=load("bbb_appr_wanted",[]), apprD=load("bbb_appr_dealers",[]), cneeds=load("bbb_cneeds",[]), apprC=load("bbb_appr_cneeds",[]), contractors=load("bbb_contractors",[]), apprK=load("bbb_appr_contractors",[]);
function genSubId(pre){ return "BBB-"+pre+"-"+Date.now().toString(36).toUpperCase().slice(-6); }
SEED.forEach(l=>{ if(!l.district){ l.province="ajk"; l.district="Bhimber"; l.tehsilG="Bhimber Tehsil"; } });
function tehName(l){ if(l.tehsil&&AREAS[l.tehsil]) return AREAS[l.tehsil].name; return l.tehsilG||""; }
let mode="buy", curCat="";
// ---------- cascading area selects ----------
function fillSelect(el, items, placeholder){ el.innerHTML = `<option value="">${placeholder}</option>` + items.map(i=>`<option value="${i}">${i}</option>`).join(""); }
function cascade(prefix){
  const t=document.getElementById(prefix+"-tehsil").value;
  const ucEl=document.getElementById(prefix+"-uc"), areaEl=document.getElementById(prefix+"-area");
  if(!t||!AREAS[t]){ fillSelect(ucEl,[],"پہلے تحصیل چنیں"); fillSelect(areaEl,[],"پہلے یونین کونسل چنیں"); return; }
  fillSelect(ucEl,Object.keys(AREAS[t].ucs),"یونین کونسل چنیں…");
  fillSelect(areaEl,[],"پہلے یونین کونسل چنیں");
  if(prefix==="Q"){} // search uses q-area below
}
function cascadeUC(prefix){
  const t=document.getElementById(prefix+"-tehsil").value;
  const uc=document.getElementById(prefix+"-uc").value;
  const areaEl=document.getElementById(prefix+"-area");
  if(!t||!uc||!AREAS[t]||!AREAS[t].ucs[uc]){ fillSelect(areaEl,[],"پہلے یونین کونسل چنیں"); return; }
  fillSelect(areaEl,AREAS[t].ucs[uc],"علاقہ / گاؤں چنیں…");
}
// search area dropdown: flat list per tehsil
const _qt=document.getElementById("q-tehsil"); if(_qt) _qt.addEventListener("change",()=>{
  const t=document.getElementById("q-tehsil").value, el=document.getElementById("q-area");
  if(!t){ fillSelect(el,[],"تمام علاقے"); return; }
  const all=[]; Object.values(AREAS[t].ucs).forEach(a=>all.push(...a));
  fillSelect(el,all,"تمام علاقے");
});
// ---------- type-specific blocks ----------
function typeChanged(){
  const t=document.getElementById("L-type").value;
  const map={plot:"tb-plot",house:"tb-house",shop:"tb-shop",commercial:"tb-shop",residential:"tb-house",agri:"tb-agri"};
  document.querySelectorAll(".type-block").forEach(b=>b.classList.remove("open"));
  const el=document.getElementById(map[t]); if(el) el.classList.add("open");
}
// ---------- listings ----------
function allListings(){ return [...SEED, ...apprL]; }
function freshness(dateStr){
  const d=new Date(dateStr+"T00:00:00"); const now=new Date(); const days=Math.floor((now-d)/86400000);
  const left=7-days; return left;
}
function qualityScore(l){
  let s=40; if(l.desc&&l.desc.length>40)s+=20; if(l.photos&&l.photos>0)s+=20; if(l.docs&&l.docs!=="تصدیق طلب — کاغذات جانچے جائیں گے")s+=20; return Math.min(100,s);
}
function waLink(l){ const tpl=(window.BBB_MSG&&window.BBB_MSG.wa)||"السلام علیکم، مجھے BBB لسٹنگ {id} ({title}) میں دلچسپی ہے۔ براہ کرم تفصیل اور قیمت سے آگاہ کریں۔"; const msg=tpl.replace("{id}",l.id).replace("{title}",l.title); return "https://wa.me/923179222029?text="+encodeURIComponent(msg); }
function cardHTML(l){
  const v=VERIFY[l.verify||0];
  const isSub=l.pending===true;
  const left=isSub?freshness(l.date):null;
  const expired=isSub&&left<0;
  if(expired) return "";
  return `<article class="card">
    <div class="card-media">${SVGS[l.svg||"hills"]}
      <div class="badges"><span class="chip ${v.cls}">${v.label}</span>${l.verifiedOn?`<span class="chip chip-mut">منظوری: <span class="en">${l.verifiedOn}</span></span>`:""}${l.featured?'<span class="chip" style="background:var(--gold);color:var(--navy)">★ نمایاں</span>':''}<span class="chip chip-cat">${CAT_NAMES[l.cat]||l.cat}</span></div>
      <button class="fav-btn ${favs.includes(l.id)?'active':''}" title="پسندیدہ" onclick="toggleFav('${l.id}',event)">${favs.includes(l.id)?'♥':'♡'}</button>
    </div>
    <div class="card-body">
      <h3>${l.title}</h3>
      <div class="meta"><span>📍 ${l.locLabel||l.area}${tehName(l)?" — "+tehName(l):""}</span><span>📐 ${l.size}</span><span class="en">${l.id}</span></div>
      <div class="price">${l.price}</div>
      <ul class="feats">${(l.feats||[]).map(f=>`<li>${f}</li>`).join("")}</ul>
      ${isSub?`<p class="fresh">⏳ تازگی: ${left} دن باقی (7 دن کی گھڑی) · کوالٹی اسکور: ${qualityScore(l)}٪</p>`:""}
      <p style="font-size:13px;color:var(--muted)">پیش کنندہ: ${l.by||"—"}</p>
      <div class="card-cta">
        <a class="btn btn-wa" target="_blank" href="${waLink(l)}" onclick="countLead()">WhatsApp</a>
        <button class="btn btn-detail" onclick="openModal('${l.id}')">تفصیل دیکھیں</button>
      </div>
    </div></article>`;
}
function render(){
  if(!document.getElementById("listing-grid")) return;
  let list=allListings();
  const type=document.getElementById("q-type").value||curCat;
  const teh=document.getElementById("q-tehsil").value;
  const area=document.getElementById("q-area").value;
  if(type) list=list.filter(l=>l.cat===type);
  if(teh) list=list.filter(l=>l.tehsil===teh);
  const GF=window.__geoF||{}; if(GF.district) list=list.filter(l=>l.district===GF.district); if(GF.tehsil) list=list.filter(l=>l.tehsilG===GF.tehsil);
  if(area) list=list.filter(l=>l.area===area);
  const html=list.map(cardHTML).join("");
  document.getElementById("listing-grid").innerHTML=html;
  document.getElementById("empty-state").style.display=list.filter(l=>!(l.pending&&freshness(l.date)<0)).length?"none":"block";
  document.getElementById("list-count").textContent=`کل ${list.length} لسٹنگز`;
  document.getElementById("result-count").textContent=`${list.length} لسٹنگز ملیں — ${mode==="buy"?"خریداری":"فروخت"} کا موڈ منتخب ہے۔ پسندیدہ کے لیے ♡ دبائیں۔`;
}
function applyFilters(){ render(); }
function pickCat(cat,el){
  curCat=cat;
  document.querySelectorAll(".cat").forEach(c=>c.classList.remove("active")); el.classList.add("active");
  document.getElementById("q-type").value=cat; render();
  document.getElementById("listings").scrollIntoView({behavior:"smooth"});
}
function setMode(m){
  mode=m;
  document.getElementById("mode-buy").classList.toggle("active",m==="buy");
  document.getElementById("mode-sell").classList.toggle("active",m==="sell");
  if(m==="sell"){ const al=document.getElementById("add-listing"); if(al) al.scrollIntoView({behavior:"smooth"}); else if(document.body.dataset.sellUrl) location.href=document.body.dataset.sellUrl; }
  render();
}
function toggleFav(id,ev){ ev.stopPropagation(); const i=favs.indexOf(id); if(i>=0)favs.splice(i,1); else favs.push(id); save("bbb_favs",favs); render(); }
function countLead(){ leads++; save("bbb_leads",leads); updateDash(); }
function openModal(id){
  const l=allListings().find(x=>x.id===id); if(!l) return;
  const v=VERIFY[l.verify||0];
  document.getElementById("modal").innerHTML=`
    <button class="close" onclick="closeModal()">✕</button>
    <h3>${l.title}</h3>
    <span class="chip ${v.cls}">${v.label}</span> <span class="chip chip-cat">${CAT_NAMES[l.cat]||l.cat}</span> <span class="chip chip-soon en">${l.id}</span>
    <table>
      <tr><td>علاقہ</td><td>${l.locLabel||l.area}${tehName(l)?" — "+tehName(l):""}</td></tr>
      ${l.uc?`<tr><td>یونین کونسل</td><td>${l.uc}</td></tr>`:""}
      ${l.patwar?`<tr><td>پٹوار سرکل</td><td>${l.patwar}</td></tr>`:""}
      ${l.mouza?`<tr><td>موضع / گاؤں</td><td>${l.mouza}</td></tr>`:""}
      <tr><td>قسم</td><td>${CAT_NAMES[l.cat]||l.cat}</td></tr>
      <tr><td>رقبہ</td><td>${l.size}</td></tr>
      <tr><td>قیمت</td><td><b>${l.price}</b></td></tr>
      <tr><td>کاغذات</td><td>${l.docs||"تصدیق طلب"}</td></tr>
      <tr><td>پیش کنندہ</td><td>${l.by||"—"}</td></tr>
    </table>
    <p style="font-size:14.5px">${l.desc||""}</p>
    ${l.feats?`<ul class="feats" style="margin:10px 0">${l.feats.map(f=>`<li>${f}</li>`).join("")}</ul>`:""}
    <div class="note">جو جانچ نہ ہو سکی ہو، وہ یہاں بھی لکھی جاتی ہے۔ حتمی فیصلے سے پہلے موقع دیکھیں اور کاغذات کی تصدیق محکمۂ مال / وکیل سے کریں۔</div>
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      <a class="btn btn-wa" target="_blank" href="${waLink(l)}" onclick="countLead()">WhatsApp پر پوچھیں</a>
      <a class="btn btn-navy en" href="tel:+923179222029">📞 0317-9222029</a>
    </div>`;
  document.getElementById("modal-bg").classList.add("open");
}
function closeModal(){ document.getElementById("modal-bg").classList.remove("open"); }
// ---------- submit listing ----------
function submitListing(e){
  e.preventDefault();
  const title=document.getElementById("L-title").value.trim();
  const desc=document.getElementById("L-desc").value.trim();
  const name=document.getElementById("L-name").value.trim();
  const mobile=document.getElementById("L-mobile").value.trim();
  const tehsil=document.getElementById("L-tehsil").value;
  const uc=document.getElementById("L-uc").value;
  const area=document.getElementById("L-area").value||document.getElementById("L-area-other").value.trim();
  const size=document.getElementById("L-size").value.trim();
  const G=(window.BBB_GEO&&window.BBB_GEO.listing)||null;
  if(!title||!desc||!name||!mobile||!size||(!area&&!(G&&G.label))||(!tehsil&&!(G&&G.district))){
    document.getElementById("listing-msg").textContent="براہ کرم ضروری خانے مکمل کریں: عنوان، تفصیل، رقبہ، نام، موبائل — اور مقام (اوپر والے مقام منتخب خانے سے ضلع/تحصیل چنیں یا پرانے خانوں سے تحصیل و علاقہ لکھیں)۔";
    return;
  }
  const type=document.getElementById("L-type").value;
  const photos=document.getElementById("L-photos").files.length;
  const feats=[];
  if(type==="plot"){ const d=document.getElementById("P-dim").value.trim(); if(d)feats.push("سائز: "+d); const f=document.getElementById("P-front").value.trim(); if(f)feats.push("فرنٹ: "+f+" فٹ"); feats.push("رخ: "+document.getElementById("P-facing").value); }
  if(type==="house"){ const b=document.getElementById("H-beds").value; if(b)feats.push(b+" بیڈ روم"); const ba=document.getElementById("H-baths").value; if(ba)feats.push(ba+" باتھ روم"); feats.push("فرنشننگ: "+document.getElementById("H-furn").value); }
  if(type==="shop"||type==="commercial"){ const b=document.getElementById("S-biz").value.trim(); if(b)feats.push("مناسب: "+b); feats.push("منزل: "+document.getElementById("S-floor").value); }
  if(type==="agri"){ feats.push("موضع: "+(document.getElementById("A-mouza").value.trim()||"—")); feats.push("پانی: "+document.getElementById("A-water").value); }
  const priceContact=document.getElementById("L-price-contact").checked;
  const priceVal=document.getElementById("L-price").value.trim();
  const id=genSubId("P");
  const today=new Date().toISOString().slice(0,10);
  const patwar=document.getElementById("L-patwar").value, mouza=document.getElementById("L-mouza").value;
  const l={id,title,cat:type,tehsil,uc,area:(G&&G.village)||area,size,price:priceContact?"قیمت کے لیے رابطہ کریں":(priceVal||"قیمت کے لیے رابطہ کریں"),verify:0,status:"pending",by:name+" ("+document.getElementById("L-role").value+")",date:today,desc,docs:document.getElementById("L-docs").value,photos,feats,patwar,mouza,svg:type==="agri"?"hills":(type==="house"||type==="residential"?"city":"road")};
  if(G){ l.province=G.province; l.district=G.district; l.tehsilG=G.tehsil; l.locLabel=G.label; if(G.patwar)l.patwar=G.patwar; if(G.village)l.mouza=G.village; }
  submitted.push(l); save("bbb_submitted",submitted);
  const msg=`🟠 نئی لسٹنگ — منظوری درکار\nشناختی نمبر: ${id}\nعنوان: ${title}\nقسم: ${CAT_NAMES[type]}\nمقام: ${l.locLabel||((area||"")+"، "+(uc||"")+"، "+(tehsil&&AREAS[tehsil]?AREAS[tehsil].name:""))}\nرقبہ: ${size}\nقیمت: ${l.price}\nکاغذات: ${l.docs}\nنام: ${name}\nموبائل: ${mobile}\nبراہ کرم فون پر تصدیق کے بعد منظوری دیں۔`;
  window.open("https://wa.me/923179222029?text="+encodeURIComponent(msg),"_blank");
  document.getElementById("listing-msg").textContent="✓ لسٹنگ موصول ہو گئی — شناختی نمبر: "+id+"۔ یہ ابھی شائع نہیں ہوئی؛ BBB ٹیم فون پر تصدیق کرے گی اور منظوری کے بعد لسٹنگ ظاہر ہوگی۔ تفصیل WhatsApp پر ٹیم کو بھیج دی گئی ہے۔";
  renderMine(); updateDash();
  const _ms=document.getElementById("my-subs"); if(_ms) _ms.scrollIntoView({behavior:"smooth"});
}
// ---------- wanted ----------
function submitWanted(e){
  e.preventDefault();
  const name=document.getElementById("W-name").value.trim();
  const mobile=document.getElementById("W-mobile").value.trim();
  const tehsil=document.getElementById("W-tehsil").value;
  if(!name||!mobile||!tehsil){ document.getElementById("wanted-msg").textContent="براہ کرم نام، موبائل اور تحصیل ضرور لکھیں۔"; return; }
  const GW=(window.BBB_GEO&&window.BBB_GEO.wanted)||null;
  const w={id:genSubId("W"),status:"pending",type:document.getElementById("W-type").value,purpose:document.getElementById("W-purpose").value,tehsil,uc:document.getElementById("W-uc").value,area:document.getElementById("W-area").value||"کوئی بھی مناسب علاقہ",size:document.getElementById("W-size").value,budget:document.getElementById("W-budget").value.trim()||"—",name,mobile,date:new Date().toISOString().slice(0,10)};
  if(GW){ w.district=GW.district; w.tehsilG=GW.tehsil; w.locLabel=GW.label; if(GW.village)w.area=GW.village; }
  wanteds.push(w); save("bbb_wanted",wanteds);
  const msg=`🟠 نئی مانگ — منظوری درکار\nشناختی نمبر: ${w.id}\nچاہیے: ${CAT_NAMES[w.type]} — ${w.purpose}\nمقام: ${w.locLabel||(w.area+"، "+(AREAS[tehsil]?AREAS[tehsil].name:""))}\nسائز: ${w.size}\nبجٹ: ${w.budget}\nنام: ${name}\nموبائل: ${mobile}`;
  window.open("https://wa.me/923179222029?text="+encodeURIComponent(msg),"_blank");
  document.getElementById("wanted-msg").textContent="✓ مانگ موصول ہو گئی — شناختی نمبر: "+w.id+"۔ BBB ٹیم فون پر تصدیق کے بعد اسے شائع کرے گی۔";
  renderMine(); updateDash();
}
function renderWanted(){
  if(!document.getElementById("wanted-grid")) return;
  document.getElementById("wanted-grid").innerHTML=apprW.map(w=>`
    <div class="card"><div class="card-body" style="padding:20px">
      <span class="chip chip-cat">${CAT_NAMES[w.type]} چاہیے — ${w.purpose}</span>
      <h3>${w.locLabel||(w.area+"، "+(w.tehsil&&AREAS[w.tehsil]?AREAS[w.tehsil].name:""))}</h3>
      <div class="meta"><span>📐 ${w.size}</span><span>💰 بجٹ: ${w.budget}</span><span>${w.date}</span></div>
      <p style="font-size:13.5px;color:var(--muted)">مانگنے والا: ${w.name} — رابطہ WhatsApp پر BBB سے</p>
      <div class="card-cta"><a class="btn btn-wa" target="_blank" href="https://wa.me/923179222029?text=${encodeURIComponent("السلام علیکم، مجھے اس مانگ کے بارے میں بتائیں: "+CAT_NAMES[w.type]+" — "+(w.locLabel||w.area)+" — "+w.name)}">اس مانگ پر رابطہ کریں</a></div>
    </div></div>`).join("");
}
// ---------- dealers ----------
function renderDealers(){
  if(!document.getElementById("dealer-grid")) return;
  const base=[{name:"بھمبر بزنس بیورو",agency:"BBB — سرکاری ڈیلر",areas:"بھمبر، برنالہ، سماہنی — تمام تحصیلیں",exp:"—",mobile:"0317-9222029",official:true}];
  const all=[...base,...apprD];
  document.getElementById("dealer-grid").innerHTML=all.map(d=>`
    <div class="dealer">
      <div style="display:flex;gap:12px;align-items:center"><div class="avatar">${d.name.trim()[0]||"B"}</div><div><h3>${d.name}</h3><p>${d.agency||"آزاد ڈیلر"}</p></div></div>
      <p style="margin-top:10px">📍 علاقے: ${d.areas}<br>🕐 تجربہ: ${d.exp||"—"} سال<br>📞 <span class="en">${d.mobile}</span> ${d.official?'<span class="chip chip-verify">✓ تصدیق شدہ</span>':'<span class="chip chip-pending">تصدیق جاری</span>'}</p>
      <div class="card-cta"><a class="btn btn-wa" target="_blank" href="https://wa.me/923179222029?text=${encodeURIComponent("السلام علیکم، مجھے ڈیلر "+d.name+" کی لسٹنگز دیکھنی ہیں۔")}" onclick="countLead()">رابطہ کریں</a></div>
    </div>`).join("");
}
function registerDealer(e){
  e.preventDefault();
  const name=document.getElementById("D-name").value.trim();
  const mobile=document.getElementById("D-mobile").value.trim();
  const areas=document.getElementById("D-areas").value.trim();
  if(!name||!mobile||!areas){ document.getElementById("dealer-msg").textContent="براہ کرم نام، موبائل اور علاقے ضرور لکھیں۔"; return; }
  const d={id:genSubId("D"),status:"pending",name,mobile,agency:document.getElementById("D-agency").value.trim(),tehsil:document.getElementById("D-tehsil").value,areas,exp:document.getElementById("D-exp").value||"—"};
  dealers.push(d); save("bbb_dealers",dealers); myDealer=d; save("bbb_mydealer",myDealer);
  const msg=`🟠 نئی ڈیلر رجسٹریشن — منظوری درکار\nشناختی نمبر: ${d.id}\nنام: ${name}\nموبائل: ${mobile}\nایجنسی: ${d.agency||"—"}\nعلاقے: ${areas}\nتجربہ: ${d.exp} سال`;
  window.open("https://wa.me/923179222029?text="+encodeURIComponent(msg),"_blank");
  document.getElementById("dealer-msg").textContent="✓ رجسٹریشن موصول ہو گئی — شناختی نمبر: "+d.id+"۔ BBB ٹیم فون پر تصدیق کے بعد آپ کا کارڈ ڈائریکٹری میں شائع کرے گی۔";
  renderMine(); updateDash();
}
function updateDash(){
  if(!myDealer||!document.getElementById("dealer-dash")) return;
  document.getElementById("dealer-dash").classList.add("open");
  document.getElementById("dash-name").textContent=myDealer.name;
  document.getElementById("dash-listings").textContent=submitted.filter(l=>(l.by||"").startsWith(myDealer.name)).length;
  document.getElementById("dash-leads").textContent=leads;
  document.getElementById("dash-wanted").textContent=wanteds.filter(w=>w.name===myDealer.name).length;
  const mine=submitted.filter(l=>(l.by||"").startsWith(myDealer.name));
  document.getElementById("dash-fresh").textContent=mine.length?Math.max(0,freshness(mine[mine.length-1].date))+" دن":"—";
}
/* ---- guarded init (BBB website port) ---- */
(function(){
  const has = id => !!document.getElementById(id);
  if (has("listing-grid")) { ["q-type","q-tehsil","q-area","q-budget"].forEach(id=>{const el=document.getElementById(id); if(el) el.addEventListener("change",render);}); render(); }
  if (has("wanted-grid")) renderWanted();
  if (has("dealer-grid")) { renderDealers(); updateDash(); }
  if (has("cneed-grid")) renderCNeeds();
  if (has("contractor-grid")) renderContractors();
  if (has("my-subs-list")) renderMine();
  if (has("L-type")) typeChanged();
  const qp = new URLSearchParams(location.search);
  if (has("q-kw") && qp.get("q")) { document.getElementById("q-kw").value = qp.get("q"); render(); }
  if (has("q-type") && qp.get("cat")) { curCat=qp.get("cat"); document.getElementById("q-type").value=qp.get("cat"); render(); }
  if (has("q-tehsil") && qp.get("teh")) { const qt=document.getElementById("q-tehsil"); qt.value=qp.get("teh"); qt.dispatchEvent(new Event("change")); render(); }
})();
// ---------- construction needs + contractors (approval-gated) ----------
function submitCNeed(e){
  e.preventDefault();
  const name=document.getElementById("C-name").value.trim(), mobile=document.getElementById("C-mobile").value.trim();
  if(!name||!mobile){ document.getElementById("cneed-msg").textContent="براہ کرم نام اور موبائل ضرور لکھیں۔"; return; }
  const G=(window.BBB_GEO&&window.BBB_GEO.cneed)||null;
  const c={id:genSubId("C"),status:"pending",kind:document.getElementById("C-kind").value,size:document.getElementById("C-size").value.trim(),budget:document.getElementById("C-budget").value.trim()||"—",timeline:document.getElementById("C-timeline").value.trim()||"—",desc:document.getElementById("C-desc").value.trim(),name,mobile,date:new Date().toISOString().slice(0,10)};
  if(G){ c.district=G.district; c.tehsilG=G.tehsil; c.locLabel=G.label; }
  cneeds.push(c); save("bbb_cneeds",cneeds);
  const msg=`🟠 نئی کنسٹرکشن ضرورت — منظوری درکار\nشناختی نمبر: ${c.id}\nکام: ${c.kind}\nمقام: ${c.locLabel||"—"}\nسائز/رقبہ: ${c.size||"—"}\nبجٹ: ${c.budget}\nمدت: ${c.timeline}\nنام: ${name}\nموبائل: ${mobile}`;
  window.open("https://wa.me/923179222029?text="+encodeURIComponent(msg),"_blank");
  document.getElementById("cneed-msg").textContent="✓ ضرورت موصول ہو گئی — شناختی نمبر: "+c.id+"۔ BBB ٹیم فون پر تصدیق کے بعد اسے شائع کرے گی۔";
  renderMine();
}
function renderCNeeds(){
  const el=document.getElementById("cneed-grid"); if(!el) return;
  el.innerHTML=apprC.length?apprC.map(c=>`
    <div class="card"><div class="card-body" style="padding:20px">
      <span class="chip chip-cat">🏗 ${c.kind}</span>
      <h3>${c.locLabel||"—"}</h3>
      <div class="meta"><span>📐 ${c.size||"—"}</span><span>💰 بجٹ: ${c.budget}</span><span>🗓 ${c.timeline}</span></div>
      <p style="font-size:14px">${c.desc||""}</p>
      <div class="card-cta"><a class="btn btn-wa" target="_blank" href="https://wa.me/923179222029?text=${encodeURIComponent("السلام علیکم، مجھے اس کنسٹرکشن ضرورت ("+c.id+") کے لیے رابطہ کرنا ہے۔")}">اس کام کے لیے رابطہ کریں</a></div>
    </div></div>`).join(""):'<p style="color:var(--muted)">ابھی کوئی منظور شدہ کنسٹرکشن ضرورت شائع نہیں۔</p>';
}
function submitContractor(e){
  e.preventDefault();
  const name=document.getElementById("K-name").value.trim(), mobile=document.getElementById("K-mobile").value.trim();
  if(!name||!mobile){ document.getElementById("contractor-msg").textContent="براہ کرم نام اور موبائل ضرور لکھیں۔"; return; }
  const G=(window.BBB_GEO&&window.BBB_GEO.contractor)||null;
  const skills=[...document.querySelectorAll(".K-skill:checked")].map(x=>x.value).join("، ");
  const k={id:genSubId("K"),status:"pending",name,mobile,firm:document.getElementById("K-firm").value.trim(),skills,areas:document.getElementById("K-areas").value.trim(),exp:document.getElementById("K-exp").value||"—",date:new Date().toISOString().slice(0,10)};
  if(G){ k.district=G.district; k.locLabel=G.label; if(!k.areas) k.areas=G.label; }
  contractors.push(k); save("bbb_contractors",contractors);
  const msg=`🟠 نئی ٹھیکیدار رجسٹریشن — منظوری درکار\nشناختی نمبر: ${k.id}\nنام: ${name}\nموبائل: ${mobile}\nفرم: ${k.firm||"—"}\nمہارت: ${skills||"—"}\nعلاقے: ${k.areas||"—"}\nتجربہ: ${k.exp} سال`;
  window.open("https://wa.me/923179222029?text="+encodeURIComponent(msg),"_blank");
  document.getElementById("contractor-msg").textContent="✓ رجسٹریشن موصول ہو گئی — شناختی نمبر: "+k.id+"۔ BBB ٹیم فون پر تصدیق کے بعد آپ کا پروفائل شائع کرے گی۔";
  renderMine();
}
function renderContractors(){
  const el=document.getElementById("contractor-grid"); if(!el) return;
  el.innerHTML=apprK.length?apprK.map(k=>`
    <div class="dealer">
      <div style="display:flex;gap:12px;align-items:center"><div class="avatar">${(k.name||"ٹ").trim()[0]}</div><div><h3>${k.name}</h3><p>${k.firm||"آزاد ٹھیکیدار"}</p></div></div>
      <p style="margin-top:10px">🏗 مہارت: ${k.skills||"—"}<br>📍 علاقے: ${k.areas||k.locLabel||"—"}<br>🕐 تجربہ: ${k.exp} سال <span class="chip chip-verify">✓ فون تصدیق شدہ</span></p>
      <div class="card-cta"><a class="btn btn-wa" target="_blank" href="https://wa.me/923179222029?text=${encodeURIComponent("السلام علیکم، مجھے ٹھیکیدار "+k.name+" سے کام کے بارے میں بات کرنی ہے۔")}" onclick="countLead()">BBB کے ذریعے رابطہ کریں</a></div>
    </div>`).join(""):'<p style="color:var(--muted)">ابھی کوئی منظور شدہ ٹھیکیدار شائع نہیں — پہلے رجسٹر ہونے والوں میں شامل ہوں۔</p>';
}
// ---------- my submissions ----------
function renderMine(){
  const el=document.getElementById("my-subs-list"); if(!el) return;
  const rows=[];
  submitted.forEach(l=>rows.push(["لسٹنگ", l.id, l.title, l.status||"pending"]));
  wanteds.forEach(w=>rows.push(["مانگ", w.id, CAT_NAMES[w.type]+" — "+(w.locLabel||w.area), w.status||"pending"]));
  cneeds.forEach(c=>rows.push(["کنسٹرکشن ضرورت", c.id, c.kind+" — "+(c.locLabel||""), c.status||"pending"]));
  dealers.forEach(d=>rows.push(["ڈیلر رجسٹریشن", d.id, d.name, d.status||"pending"]));
  contractors.forEach(k=>rows.push(["ٹھیکیدار رجسٹریشن", k.id, k.name, k.status||"pending"]));
  apprL.forEach(l=>rows.push(["لسٹنگ", l.id, l.title, "approved"]));
  apprW.forEach(w=>rows.push(["مانگ", w.id, CAT_NAMES[w.type]+" — "+(w.locLabel||w.area), "approved"]));
  apprC.forEach(c=>rows.push(["کنسٹرکشن ضرورت", c.id, c.kind, "approved"]));
  apprD.forEach(d=>rows.push(["ڈیلر رجسٹریشن", d.id, d.name, "approved"]));
  apprK.forEach(k=>rows.push(["ٹھیکیدار رجسٹریشن", k.id, k.name, "approved"]));
  el.innerHTML=rows.length?rows.map(r=>`<div class="mine-row"><span class="chip chip-cat">${r[0]}</span><span class="en">${r[1]}</span><span style="flex:1">${r[2]||""}</span>${r[3]==="approved"?'<span class="chip chip-verify">✓ منظور — شائع شدہ</span>':'<span class="chip chip-pending">⏳ زیرِ جائزہ — فون تصدیق باقی</span>'}</div>`).join(""):'<p style="color:var(--muted)">ابھی آپ نے اس آلے سے کچھ جمع نہیں کرایا۔</p>';
}
// ---------- admin (team) ----------
const ADMIN_KINDS={listings:["bbb_submitted","bbb_appr_listings","submitted","apprL"],wanted:["bbb_wanted","bbb_appr_wanted","wanteds","apprW"],cneeds:["bbb_cneeds","bbb_appr_cneeds","cneeds","apprC"],dealers:["bbb_dealers","bbb_appr_dealers","dealers","apprD"],contractors:["bbb_contractors","bbb_appr_contractors","contractors","apprK"]};
function adminRender(){
  const el=document.getElementById("admin-lists"); if(!el) return;
  const stores={submitted, wanteds, cneeds, dealers, contractors};
  const names={submitted:"لسٹنگز", wanteds:"مانگیں", cneeds:"کنسٹرکشن ضرورتیں", dealers:"ڈیلر رجسٹریشنز", contractors:"ٹھیکیدار رجسٹریشنز"};
  el.innerHTML=Object.keys(stores).map(k=>{
    const arr=stores[k];
    return `<h3 style="margin:18px 0 8px">${names[k]} — زیرِ جائزہ (${arr.length})</h3>`+(arr.length?arr.map((it,i)=>`
      <div class="mine-row"><span class="en">${it.id||""}</span><span style="flex:1">${(it.title||it.name||it.kind||"")+" — "+(it.locLabel||it.area||it.areas||"")}</span>
      <span class="en">${it.mobile||""}</span>
      <button class="btn btn-wa" onclick="adminApprove('${k}',${i})">✓ منظور کریں</button>
      <button class="btn btn-detail" onclick="adminReject('${k}',${i})">✕ مسترد</button></div>`).join(""):'<p style="color:var(--muted)">کوئی زیرِ جائزہ اندراج نہیں۔</p>');
  }).join("");
}
function adminApprove(kind, i){
  const pend={submitted, wanteds, cneeds, dealers, contractors}[kind];
  const it=pend[i]; if(!it) return;
  it.status="approved";
  if(kind==="submitted"){ it.pending=false; const sel=document.getElementById("appr-verify"); it.verify=sel?parseInt(sel.value):0; it.verifiedOn=new Date().toISOString().slice(0,10); apprL.push(it); save("bbb_appr_listings",apprL); }
  if(kind==="wanteds"){ apprW.push(it); save("bbb_appr_wanted",apprW); }
  if(kind==="cneeds"){ apprC.push(it); save("bbb_appr_cneeds",apprC); }
  if(kind==="dealers"){ apprD.push(it); save("bbb_appr_dealers",apprD); }
  if(kind==="contractors"){ apprK.push(it); save("bbb_appr_contractors",apprK); }
  pend.splice(i,1);
  save({submitted:"bbb_submitted",wanteds:"bbb_wanted",cneeds:"bbb_cneeds",dealers:"bbb_dealers",contractors:"bbb_contractors"}[kind], pend);
  adminRender();
  const m=document.getElementById("admin-msg"); if(m) m.textContent="✓ منظور ہو گیا: "+(it.id||"");
}
function adminReject(kind, i){
  const pend={submitted, wanteds, cneeds, dealers, contractors}[kind];
  const it=pend[i]; if(!it) return;
  pend.splice(i,1);
  save({submitted:"bbb_submitted",wanteds:"bbb_wanted",cneeds:"bbb_cneeds",dealers:"bbb_dealers",contractors:"bbb_contractors"}[kind], pend);
  adminRender();
  const m=document.getElementById("admin-msg"); if(m) m.textContent="✕ مسترد کر دیا گیا: "+(it.id||"")+" — صارف کو واٹس ایپ پر وجہ بتا دیں۔";
}
function adminExport(){
  const data={listings:apprL, wanted:apprW, cneeds:apprC, dealers:apprD, contractors:apprK, exported:new Date().toISOString()};
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:"application/json"})); a.download="bbb-approved-export.json"; a.click();
}
function adminImport(ev){
  const f=ev.target.files[0]; if(!f) return;
  f.text().then(tx=>{ try{ const d=JSON.parse(tx);
    const merge=(arr,key)=>{ (d[key]||[]).forEach(x=>{ if(!arr.some(y=>y.id===x.id)) arr.push(x); }); };
    merge(apprL,"listings"); merge(apprW,"wanted"); merge(apprC,"cneeds"); merge(apprD,"dealers"); merge(apprK,"contractors");
    save("bbb_appr_listings",apprL); save("bbb_appr_wanted",apprW); save("bbb_appr_cneeds",apprC); save("bbb_appr_dealers",apprD); save("bbb_appr_contractors",apprK);
    adminRender(); const m=document.getElementById("admin-msg"); if(m) m.textContent="✓ ڈیٹا درآمد ہو گیا۔";
  }catch(e){ const m=document.getElementById("admin-msg"); if(m) m.textContent="فائل پڑھنے میں مسئلہ آیا۔"; } });
}
