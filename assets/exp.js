/* BBB expansion layer: multi-district geo cascade (District → Tehsil → Qanungo → Patwar → Village) with free-text option at every level below district. Data: window.GEO (PBS Census 2017 structure; populations Census 2023). */
window.BBB_GEO = {};
(function(){
  const L = (document.documentElement.lang === "en")
    ? {prov:"Province / Region", dist:"District", teh:"Tehsil", qh:"Qanungo Halqa", pc:"Patwar Circle", vil:"Village / Mouza / Town", custom:"Other — type it", ph:"Type the name…", pick:"Select…", note:"If a name is not in the list, choose “Other — type it” and write it yourself."}
    : {prov:"صوبہ / خطہ", dist:"ضلع", teh:"تحصیل", qh:"قانونگو حلقہ", pc:"پٹوار سرکل", vil:"موضع / گاؤں / شہر", custom:"دیگر — خود لکھیں", ph:"نام یہاں لکھیں…", pick:"منتخب کریں…", note:"نام فہرست میں نہ ہو تو «دیگر — خود لکھیں» چن کر خود لکھ دیں۔"};
  function opt(v, txt){ return `<option value="${v}">${txt}</option>`; }
  function disp(en, ur){ return ur ? ur : en; }
  function buildGeo(prefix, mount){
    const el = document.getElementById(mount); if(!el) return;
    el.innerHTML = `<div class="geo-grid">
      ${["prov","dist","teh","qh","pc","vil"].map(k=>`
      <div class="geo-cell"><label>${L[k]}</label>
        <select id="geo-${prefix}-${k}" data-geo="${prefix}:${k}"><option value="">${L.pick}</option></select>
        <input id="geo-${prefix}-${k}-txt" class="geo-txt" type="text" placeholder="${L.ph}" style="display:none">
      </div>`).join("")}
    </div><p class="geo-note">${L.note}</p>`;
    const provSel = el.querySelector(`#geo-${prefix}-prov`);
    provSel.innerHTML = `<option value="">${L.pick}</option>` + Object.keys(window.GEO).map(p=>opt(p, window.GEO[p].label)).join("");
    ["prov","dist","teh","qh","pc","vil"].forEach(k=>{
      el.querySelector(`#geo-${prefix}-${k}`).addEventListener("change", ()=>onChange(prefix));
    });
  }
  function selVal(prefix, k){
    const s = document.getElementById(`geo-${prefix}-${k}`); if(!s) return "";
    if(s.value === "__custom__"){ const t = document.getElementById(`geo-${prefix}-${k}-txt`); return t ? t.value.trim() : ""; }
    return s.value;
  }
  function refreshTxt(prefix){
    ["prov","dist","teh","qh","pc","vil"].forEach(k=>{
      const s = document.getElementById(`geo-${prefix}-${k}`), t = document.getElementById(`geo-${prefix}-${k}-txt`);
      if(s && t){ t.style.display = (s.value === "__custom__") ? "block" : "none"; if(s.value === "__custom__") t.oninput = ()=>onChange(prefix, true); }
    });
  }
  function fill(prefix, k, items){
    const s = document.getElementById(`geo-${prefix}-${k}`); if(!s) return;
    s.innerHTML = `<option value="">${L.pick}</option>` + items.map(i=>opt(i[0], i[1])).join("") + (k!=="prov" ? opt("__custom__", L.custom) : "");
  }
  function onChange(prefix, soft){
    const G = window.GEO;
    const prov = document.getElementById(`geo-${prefix}-prov`).value;
    if(!soft){
      // rebuild downstream selects
      const dist = document.getElementById(`geo-${prefix}-dist`).value;
      const teh = document.getElementById(`geo-${prefix}-teh`).value;
      const qh = document.getElementById(`geo-${prefix}-qh`).value;
      const pc = document.getElementById(`geo-${prefix}-pc`).value;
      if(prov && G[prov]) fill(prefix, "dist", Object.keys(G[prov].d).map(d=>[d, disp(d, G[prov].d[d].ur)]));
      if(prov) document.getElementById(`geo-${prefix}-dist`).value = dist;
      const D = prov && dist && dist!=="__custom__" ? G[prov].d[dist] : null;
      if(D) fill(prefix, "teh", Object.keys(D.t).map(t=>[t, disp(t, D.t[t].ur)]));
      if(D) document.getElementById(`geo-${prefix}-teh`).value = teh;
      const T = D && teh && teh!=="__custom__" ? D.t[teh] : null;
      if(T) fill(prefix, "qh", Object.keys(T.q).map(q=>[q, q]));
      if(T) document.getElementById(`geo-${prefix}-qh`).value = qh;
      const Q = T && qh && qh!=="__custom__" ? T.q[qh] : null;
      if(Q) fill(prefix, "pc", Object.keys(Q).map(p=>[p, p]));
      if(Q) document.getElementById(`geo-${prefix}-pc`).value = pc;
      const P = Q && pc && pc!=="__custom__" ? Q[pc] : null;
      if(P) fill(prefix, "vil", P.map(v=>[v, v]));
    }
    refreshTxt(prefix);
    // compose path
    const path = {province: prov||"", district: selVal(prefix,"dist"), tehsil: selVal(prefix,"teh"),
      qh: selVal(prefix,"qh"), patwar: selVal(prefix,"pc"), village: selVal(prefix,"vil")};
    const names = [];
    if(path.district){ const dObj = prov && window.GEO[prov] && window.GEO[prov].d[path.district]; names.push(dObj ? disp(path.district, dObj.ur) : path.district); }
    if(path.tehsil){ const tObj = prov && path.district && window.GEO[prov].d[path.district] && window.GEO[prov].d[path.district].t[path.tehsil]; names.push(tObj ? disp(path.tehsil, tObj.ur) : path.tehsil); }
    if(path.village) names.push(path.village); else if(path.patwar) names.push(path.patwar);
    path.label = names.join("، ");
    window.BBB_GEO[prefix] = path;
    if(prefix === "filter"){ window.__geoF = {district: path.district||"", tehsil: path.tehsil||""}; if(typeof render === "function") render(); }
  }
  function init(){
    buildGeo("filter", "geo-filter");
    buildGeo("listing", "geo-listing");
    buildGeo("wanted", "geo-wanted");
    buildGeo("cneed", "geo-cneed");
    buildGeo("contractor", "geo-contractor");
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
