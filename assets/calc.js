/* BBB construction cost calculator — rates are PUBLISHED figures with source + date per line.
   Geography honesty: no published per-sq-ft rate exists for the Gujranwala–Rawalpindi corridor or AJK;
   defaults are Lahore/national published rates (nearest researched market) and are labelled as such in the UI.
   Users can edit every rate and quantity; their edits are stored locally and marked as their own. */
window.CALC = {
  quick: {
    grey:  { low: 2800, high: 3600, def: 3200, src: "Zameen Calculator · 16 Oct 2026 (2,867–3,026) · ULand Lahore 3,200–3,600 · GreyStone Jul 2026: 2,800–3,500 · Team Overc's Nov 2026: 3,250" },
    full:  { low: 4700, high: 8200, def: 5900, src: "Zameen Calculator · 16 Oct 2026 (finished 4,499–4,880) · ULand Lahore 4,800–6,200 · Al-Hassan turnkey 4,700–6,300 · Team Overc's 7,000 · Zell Isb/Rawalpindi standard 7,000–8,200 · 17 Oct 2026" }
  },
  heads: [ // Zameen 1000 sq ft Lahore complete-house example, prices updated 16 Oct 2026 (total PKR 87.8 lakh)
    { ur: "بنیاد و ڈھانچہ (گرے)", en: "Foundation & Structure", pct: 51.7 },
    { ur: "لکڑی، لوہا و ٹائل", en: "Wood, Metal & Tile Works", pct: 25.9 },
    { ur: "بجلی کا کام", en: "Electrical Works", pct: 10.0 },
    { ur: "پلمبنگ", en: "Plumbing Works", pct: 7.1 },
    { ur: "فٹنگز و فکسچر", en: "Fittings & Fixtures", pct: 5.4 }
  ],
  materials: [ // qty = coeff × covered area (sq ft); coeff defaults are PUBLISHED defaults, ranges shown
    { key:"bricks", ur:"اینٹ (اول) — فی ہزار", en:"Bricks (Awwal) per 1,000", unit:"per1000", coeff: 30, coeffSrc:"PakHisaab default 30/sq ft (published range 20–50; other sources 8–25)", rate: 24800, rateSrc:"PBS Sep 2026 A-class city avg: Lahore 24,831 · Gujranwala 27,663 · Oct market range 16,000–28,000 by class — local rate likhein" },
    { key:"cement", ur:"سیمنٹ — فی بوری (50 کلو)", en:"Cement per bag", unit:"bag", coeff: 0.40, coeffSrc:"Marot 0.42 · GreyStone 0.40–0.50 · published range 0.28–0.60", rate: 1592, rateSrc:"PBS SPI national average · week ended 29 Oct 2026 (via Mettis)" },
    { key:"steel", ur:"سریا گریڈ 60 — فی کلو", en:"Steel G60 per kg", unit:"kg", coeff: 1.9, coeffSrc:"PakHisaab default 1.9 kg/sq ft (published range 1.9–4)", rate: 277, rateSrc:"Kamran Steel G60 · 14 Oct 2026: 277/kg · GreyStone Jul 2026 range 260–285 · PBS G40 Sep 2026: 230–246" },
    { key:"sand", ur:"ریت — فی مکعب فٹ", en:"Sand per cft", unit:"cft", coeff: 1.4, coeffSrc:"Marot 1.4 · published range 1.3–1.6", rate: 70, rateSrc:"Team Overc's median 70 · PBS Sep 2026: Lahore ~80/cft, twin cities ~136/cft · type-wise range 45–235" },
    { key:"crush", ur:"کرش / بجری — فی مکعب فٹ", en:"Crush per cft", unit:"cft", coeff: 1.0, coeffSrc:"GreyStone 0.9–1.1 · Marot 1.4", rate: 180, rateSrc:"PBS Sep 2026: 158.70–187.73/cft · GreyStone Jul 2026: 172–180 · Team Overc's median 180" }
  ],
  labour: [ // day rates; days are entered by the user (no invented day counts)
    { key:"mason", ur:"مستری (راج)", en:"Mason", rate: 2400, src:"PBS Sep 2026 city wages: Lahore 2,461 · Rawalpindi 2,370" },
    { key:"painter", ur:"رنگ ساز", en:"Painter", rate: 1709, src:"PBS SPI national average · Jan 2026" },
    { key:"plumber", ur:"پلمبر", en:"Plumber", rate: 1754, src:"PBS SPI national average · Jan 2026" },
    { key:"helper", ur:"مزدور / ہیلپر", en:"Helper", rate: 1500, src:"PBS Sep 2026 city wages: Rawalpindi/Islamabad 1,500 · Lahore 1,747" }
  ]
};
(function(){
  const $ = id => document.getElementById(id);
  if(!$("calc-area")) return;
  const UR = document.documentElement.lang !== "en";
  const fmt = n => "PKR " + Math.round(n).toLocaleString("en-PK");
  const saved = JSON.parse(localStorage.getItem("bbb_calc_user") || "{}");
  function rate(id, def){ const v = saved[id]; return (v === undefined || v === "" || isNaN(+v)) ? def : +v; }
  function bindSave(id){ const el = $(id); if(el) el.addEventListener("input", ()=>{ saved[id] = el.value; localStorage.setItem("bbb_calc_user", JSON.stringify(saved)); compute(); }); }

  // ---- build material + labour rows
  const mrows = window.CALC.materials.map(m => `
    <tr><td><b>${UR ? m.ur : m.en}</b><br><small class="src">${m.coeffSrc}</small></td>
    <td><input class="calc-in" id="cq-${m.key}" type="number" step="any" value="${rate("cq-"+m.key, m.coeff)}"><small class="src">/sq ft</small></td>
    <td class="en" id="cqty-${m.key}">—</td>
    <td><input class="calc-in" id="cr-${m.key}" type="number" step="any" value="${rate("cr-"+m.key, m.rate)}"><br><small class="src">${m.rateSrc}</small></td>
    <td class="en" id="camt-${m.key}">—</td></tr>`).join("");
  $("calc-mat-body").innerHTML = mrows;
  const lrows = window.CALC.labour.map(l => `
    <tr><td><b>${UR ? l.ur : l.en}</b><br><small class="src">${l.src}</small></td>
    <td><input class="calc-in" id="ld-${l.key}" type="number" step="any" placeholder="0" value="${saved["ld-"+l.key]||""}"></td>
    <td><input class="calc-in" id="lr-${l.key}" type="number" step="any" value="${rate("lr-"+l.key, l.rate)}"></td>
    <td class="en" id="lamt-${l.key}">—</td></tr>`).join("");
  $("calc-lab-body").innerHTML = lrows;
  ["calc-area","calc-rate","calc-cont"].forEach(bindSave);
  window.CALC.materials.forEach(m => { bindSave("cq-"+m.key); bindSave("cr-"+m.key); });
  window.CALC.labour.forEach(l => { bindSave("ld-"+l.key); bindSave("lr-"+l.key); });
  const qs = $("calc-quick-src"); if(qs) qs.textContent = "Rates: " + window.CALC.quick.grey.src + " | " + window.CALC.quick.full.src;
  const scopeSel = $("calc-scope"), tierSel = $("calc-tier");
  if(tierSel) tierSel.value = "mid";
  if(scopeSel) scopeSel.addEventListener("change", syncRate);
  if(tierSel) tierSel.addEventListener("change", syncRate);
  function syncRate(){
    const base = window.CALC.quick[scopeSel.value];
    let def = base.def;
    if(tierSel.value === "low") def = base.low;
    if(tierSel.value === "high") def = base.high;
    $("calc-rate").value = def; saved["calc-rate"] = def; localStorage.setItem("bbb_calc_user", JSON.stringify(saved)); compute();
  }
  function num(id, def){ const el = $(id); const v = el ? parseFloat(el.value) : NaN; return isNaN(v) ? def : v; }
  function compute(){
    const area = num("calc-area", 0);
    const scope = scopeSel.value, base = window.CALC.quick[scope];
    const r = num("calc-rate", base.def);
    const quick = area * r, qLow = area * base.low, qHigh = area * base.high;
    $("calc-quick-total").textContent = area ? fmt(quick) : "—";
    $("calc-quick-range").textContent = area ? (UR ? "حد: " : "Range: ") + fmt(qLow) + " – " + fmt(qHigh) + " · " + fmt(r) + "/sq ft" : "";
    $("calc-heads").innerHTML = (scope === "full" && area) ? window.CALC.heads.map(h =>
      `<div class="mine-row"><span style="flex:1">${UR ? h.ur : h.en} <small class="src">${h.pct}%</small></span><span class="en">${fmt(quick * h.pct / 100)}</span></div>`).join("") : "";
    // materials
    let mat = 0;
    window.CALC.materials.forEach(m => {
      const coeff = num("cq-"+m.key, m.coeff), rt = num("cr-"+m.key, m.rate);
      let qty = coeff * area; let amt = (m.unit === "per1000") ? (qty / 1000) * rt : qty * rt;
      $("cqty-"+m.key).textContent = area ? Math.round(qty).toLocaleString("en-PK") : "—";
      $("camt-"+m.key).textContent = area ? fmt(amt) : "—";
      mat += amt;
    });
    const wastage = mat * 0.05;
    let lab = 0;
    window.CALC.labour.forEach(l => { const d = num("ld-"+l.key, 0), rt = num("lr-"+l.key, l.rate); const a = d * rt; $("lamt-"+l.key).textContent = d ? fmt(a) : "—"; lab += a; });
    const contPct = num("calc-cont", 10);
    const sub = mat + wastage + lab, cont = sub * contPct / 100, grand = sub + cont;
    $("calc-mat-total").textContent = area ? fmt(mat) : "—";
    $("calc-wastage").textContent = area ? fmt(wastage) : "—";
    $("calc-lab-total").textContent = lab ? fmt(lab) : "—";
    $("calc-cont-amt").textContent = area ? fmt(cont) : "—";
    $("calc-grand").textContent = area ? fmt(grand) : "—";
    $("calc-sticky-total").textContent = area ? fmt(grand) : "—";
    window.__calcSummary = { area, scope, quick, qLow, qHigh, mat, lab, grand };
  }
  window.calcReset = function(){ localStorage.removeItem("bbb_calc_user"); location.reload(); };
  window.calcShare = function(){
    const s = window.__calcSummary; if(!s || !s.area) return;
    const msg = (UR ? "السلام علیکم، میں نے BBB کنسٹرکشن کیلکولیٹر سے تخمینہ نکالا ہے۔\nتعمیراتی رقبہ: " : "Hello, my BBB construction calculator estimate:\nCovered area: ")
      + s.area + " sq ft\n" + (UR ? "فی مربع فٹ تخمینہ: " : "Per-sq-ft estimate: ") + fmt(s.quick) + " (" + fmt(s.qLow) + " – " + fmt(s.qHigh) + ")\n"
      + (UR ? "تفصیلی (میٹریل+مزدوری+اتفاقی): " : "Detailed (materials+labour+contingency): ") + fmt(s.grand)
      + (UR ? "\nیہ منصوبہ بندی کا تخمینہ ہے، کوٹیشن نہیں۔" : "\nPlanning estimate only, not a quotation.");
    window.open("https://wa.me/923179222029?text=" + encodeURIComponent(msg), "_blank");
  };
  compute();
})();
