
// ---------- Bhimber areas: Tehsil -> UC -> localities (verified; * = تصدیق طلب, postal list) ----------
const AREAS = {
  bhimber: {name:"بھمبر", ucs:{
    "ایم سی بھمبر (میونسپل کارپوریشن)":["بھمبر شہر","بلدیہ حدود","میرپور چوک","میرپور روڈ"],
    "پنجائری":["پنجائری","چریاں","سیرلہ — لوئر سیرلہ","دادم","گوتریالہ"],
    "دورا":["دورا"],
    "دھندڑ کوٹ":["دھندڑ","دھندڑ کوٹ"],
    "بھمبر رجانی":["بھمبر رجانی"],
    "پنجیری":["پنجیری"],
    "فرنگ":["فرنگ"],
    "دیگر (بھمبر تحصیل)":["گورہ للّیاں","کس چنتر","بانگلہ سعد آباد *","برجہ *","برسالی *","بھارنگ *","بندی *","ڈھیری وٹاں *","کڈھالہ *","موئل *","پتھو رانی *"]
  }},
  barnala: {name:"برنالہ", ucs:{
    "برنالہ":["برنالہ قصبہ","تھب"],
    "پٹنی":["پٹنی"],
    "پنگالی":["پنگالی"],
    "وٹالہ":["وٹالہ","وٹالہ میرا جٹاں"],
    "ملوٹ":["ملوٹ"],
    "شمالی افتخار آباد (چمب)":["چمب / افتخار آباد"],
    "جنوبی افتخار آباد (چمب)":["چمب / افتخار آباد"],
    "امبریالہ جند پیر":["امبریالہ جند پیر"]
  }},
  samahni: {name:"سماہنی", ucs:{
    "سماہنی (ٹاؤن کمیٹی)":["سماہنی قصبہ","باغسر قلعہ","باغسر جھیل"],
    "چاہی گاہی":["چاہی گاہی"],
    "سندھڑ ہوراں":["سندھڑ ہوراں"],
    "درہال جندالہ":["درہال جندالہ"],
    "کھمبہ":["کھمبہ"],
    "چوکی":["چوکی"],
    "تونین کادیالہ":["تونین کادیالہ"],
    "منانہ سرسالہ":["منانہ سرسالہ"],
    "پونہ":["پونہ"],
    "ڈب سندھوہا":["ڈب سندھوہا"],
    "بانڈالہ باغسر":["بانڈالہ","باغسر","مہتکہ","نالی"]
  }}
};
const PATWAR = {"barnala": {"امبریالہ (Amberiala)": ["امبریالہ (Amberiala)", "جنڈ پیر (Jand Pir)", "موہکریالہ * (Mohkariala)"], "برنالہ (Barnala)": ["برنالہ (Barnala)", "دوئیاں * (Doian)", "خربوزہ (Kharbooza)"], "دھورانوالہ (Dhuranwala)": ["بوکان (Bokan)", "چنیر * (Chineer)", "دھورانوالہ (Dhoranwala)", "کدیار (Kadyar)", "نند پور (Nandpur)", "روہیلہ (Roheela)", "تاہو * (Tahu)"], "ہزاری (Hazari)": ["آہی (Ahi)", "ہزاری (Hazari)", "کلیاں (Kalian)"], "کجلور * (Kajloor)": ["کنجلور (Kanjloor)", "ٹبی (Tibbi)"], "کانگرہ (Kangra)": ["کانگرہ (Kangra)", "پوتھی (Pothi)", "رادیالہ (Radiala)"], "کڈھالہ (Khadhala)": ["ابوالہ (Abowala)", "کڈھالہ (Kadhala)"], "کوٹ علی بہادر (Kot Ali Bahadar)": ["ہیر (Heer)", "کوٹ علی بہادر (Kot Ali Bahadar)", "پدھر (Padhar)", "پنڈی عبدال (Pindi Abdal)"], "ملوٹ (Malote)": ["بیوٹ * (Biote)", "کس بانیاں (Kass Banian)", "لکڑ منڈی (Lakkar Mandi)", "ملوٹ خاص (Malote Khas)"], "پٹنی (Patni)": ["کھادہ * (Khadah)", "نالی (Nali)", "پٹنی (Patni)"], "پنگالی (Phangali)": ["برملہ (Barmla)", "کھوکھرا (Khokhara)", "کوئل (Koil)", "پنگالی (Phangali)", "رائے پور (Raipur)"], "قلعہ چھپر * (Qilla Chapper)": ["پوئیاں * (Poian)", "قلعہ چھپر * (Qilla Chapper)", "روہی (Rohi)", "اپر وٹالہ (Upper Watala)"], "تھمب (Thamb)": ["سلیم آمت * (Saleem-A-Mat)", "تھمب (Thamb)"], "وٹالہ (Watala)": ["برالہ چھپر (Brala Chapper)", "دھنگری (Dhangri)", "ڈنگی (Dingi)", "وٹالہ (میرا جٹاں) (Watala (Mera Jattan))"], "بانیاں (Banian)": ["بانیاں (Banian)", "بوکان (Bokan)", "دیواری (Dewari)", "پور (Por)", "رہانہ (Rehana)"], "چک پنڈتھ * (Chak Pandeth)": ["بیلی رام پور (Beli Rampur)", "بھامانی (بھوانی) (Bhamani(Bhowani))", "چک پنڈتھ * (Chak Pandeth)", "مٹیریل * (Meterial)", "نگیل * (Nagail)", "ساری پلائی * (Sari Palai)", "سنگری (Singri)"], "چکلہ (Chakla)": ["بتال * (Batal)", "چکلہ (Chakla)", "دیکر * (Dekar)", "کھدرہ * (Khadra)"], "چمب (Chamb)": ["چمب (بسیوال) (Chamb (Basiwal))", "خیرووال (Khairowal)", "نواں چک نمبر 1 (Nawanchak No.1)", "نواں چک نمبر 2 (Nawanchak No.2)"], "دیوا (Dewa)": ["دہگانوالی (Dehganwali)", "پھگلہ (1) دیوا * (Phagla (1) Dewa)", "پھگلہ (2) دیوا * (Phagla (2) Dewa)", "رائے پور (Rai Pur)"], "جنڈا * (Jandda)": ["بوری جل * (Borijall)", "بوسے * (Bosey)", "دلے * (Dallay)", "جنڈا * (Jandda)", "خضرہ * (Khizra)", "کوڈیار (Kodiar)", "ٹومبہ (Tomba)"], "مناور (Manawar)": ["چک سعید (چک شبلہ) (Chak Saeed (Chak Shibla))", "چمڑیال * (Chamrial)", "گاڑی درجو (گوہوگی) * (Gari Derjo (Gohogi))", "لاکھو چک (Lakho Chak)", "مناور (Manawar)", "رانا (Rana)"], "منقوٹیاں * (Manqotian)": ["چک بدو (Chak Biddu)", "چک مہری (Chak Mehri)", "گولرے (Golray)", "کھاریاں (Kharian)", "ملکے نمبر 1 (Malkey No.1)", "ملکے نمبر 2 (Malkey No.2)", "منقوٹیاں * (Manqotian)", "پنج گرائیں (Panjgrain)"], "موئل برمبلہ (Moil Barmbla)": ["برمبلہ (Barmbla)", "موئل (Moil)", "پیر جمال (Pir Jamal)", "رکھ دابر * (Rakh Dabar)", "سرداری (Sardari)"]}, "bhimber": {"چارج نمبر 03 (شہری حلقے) (Charge No 03)": ["سرکل نمبر 01 (Circle No 01)", "سرکل نمبر 02 (Circle No 02)", "سرکل نمبر 03 (Circle No 03)"], "بارنگ (Baring)": ["بارنگ (Baring)", "لس (Lass)", "موہر روپیری * (Moher Roperi)"], "برسالی (Barsali)": ["برسالی (Barsali)"], "بھمبر خاص (Bhimber Khas)": ["بھمبر رجانی (Bhimber Rajani)", "بھوتو سیال (Bhoto Sial)"], "دورا (Daura)": ["دورا (Daura)"], "دھندڑ (Dhandar)": ["چک خورد (Chak Khurd)", "دھندڑ (Dhandar)", "سلام (Salam)"], "ڈھوک دورا (Dhoke Daura)": ["ڈھیری وٹاں (Dheri Watan)", "ڈھوک اللہ رکھا (Dhoke Allah Rakha)", "گورہ رحمان (Gora Rehman)"], "کس چنتر (Kaschanatar)": ["کس چنتر (Kaschanatar)", "سنگھر (Sanghar)"], "کوٹ چھباں (Kot Chibban)": ["کوٹ چھباں (Kot Chibban)", "کوٹ جٹاں (Kot Jattan)"], "مغلورہ (Maghloora)": ["مچورا * (Machora)", "مغلورہ (Maghloora)", "رکھ مغلورہ (Rakh Maghuora)"], "مورہ سدا * (Morah Sadda)": ["مورہ سدا * (Morah Sadda)"], "پنڈی (Pindi)": ["چنجاہ * (Chunjah)", "لکھ پور (Lakhpur)", "پنڈوری (Pandori)", "پنڈی (Pindi)"], "پتھورانی * (Pithorani)": ["پتھورانی * (Pithorani)"], "پوتھی (Pothi)": ["چٹی ڈھیری (Chiti Dheri)", "دادم (Dodam)", "متھالہ (Mathala)", "پیر کانجی (Peer Kanji)", "پہل چوہان * (Pehal Chohan)", "پوتھی (Pothi)", "رکھ رندیم * (Rakh Randyam)", "رندیم * (Randiam)"], "اکبر آباد (Akbar Abad)": ["اکبر آباد (کلری) (Akbarabad(Kalri))", "جبی (Jabbi)"], "علی بیگ (Ali Beg)": ["علی بیگ (Ali Beg)", "چھانی تھوتھل (Chhanni Thothal)", "گیگن موسیٰ * (Gigan Musa)", "گوراسیاں (Gorasian)"], "چھانی رائیکی (Chhani Raiki)": ["چھانی رائیکی (Chhani Raiki)", "غازی گورہ (Ghazi Gorah)", "گل بھر * (Gulbhar)"], "گورہ کنجل (Gora Kanjal)": ["چھانی کنجل (Chhani Kanjal)", "گورہ کنجل (Gora Kanjal)", "لس (Lass)"], "کانگرہ (Kangra)": ["فکروٹ (Fakrot)", "کانگرہ (Kangra)"], "کس گمہ * (Kasguma)": ["کس گمہ * (Kasguma)"], "کھدوڑہ (Khadora)": ["کمرگی (Kamargi)", "کھدوڑہ (Khadora)"], "پنجیری (Panjeri)": ["کھمبی (Khambi)", "مصریال (Misrial)", "نکر (Nakkar)", "پنجیری (Panjeri)"], "سہلر (Sehlar)": ["سہلر (Sehlar)"], "سوکاسن * (Sokason)": ["چہلہ (Chehla)", "کوہل (Kohal)", "سوکاسن * (Sokasan)"]}, "samahni": {"چاہی (Chahi)": ["برواہ * (Broah)", "چاہی (Chahi)", "نہالہ (Nehala)", "سونا (Sona)"], "چوکی (Chowki)": ["بندی (Bindi)", "چوکی (Chowki)"], "کدیالہ (Kadiala)": ["کدیالہ (Kadiala)", "رامل * (Ramal)"], "پنڈ جٹاں (Pind Jattan)": ["پنڈ جٹاں (Pind Jattan)", "راملوہ * (Ramloh)", "سرسالہ (Sarsala)"], "تونین (Tonin)": ["تونین خاص (Tonin Khas)", "تونین ٹھٹھی (Tonin Thathi)"], "بھملہ گنورہ * (Behmla Ganoorah)": ["بھملہ گنورہ * (Behmla Ganoorah)", "گیناں * (Gainan)", "سرنیلہ (Sarnila)", "تندر * (Tander)"], "درہال گگن * (Darhal Gaggan)": ["برجان (Barjan)", "درہال گگن * (Darhal Gaggan)", "ٹھٹھی جنڈالہ (Thathi Jandala)"], "گڑھوں * (Garhoon)": ["چھدروں * (Chadroon)", "چرالی (Charali)", "گڑھوں * (Garhoon)"], "کھمبہ (Khambha)": ["ہری پور (Haripur)", "کٹھیالہ (Kathyala)", "کھمبہ (Khambha)", "کوٹلی (Kotli)"], "پونہ (Poona)": ["برجہ (Barjah)", "بندلی (Bindli)", "پونہ (Poona)"], "باغسر (Bagsar)": ["باغ چھگا * (Bagh Chagga)", "باغسر (Bagsar)", "گھوالیاں * (Ghawalian)", "مہتقہ (Mehtqa)", "پنڈوری (Pandori)", "سدھاری (Sadhari)"], "اسلام پور / بانڈالہ (Islampur/Bandala)": ["بانڈالہ (اسلام پور بانڈالہ) (Bandala(Islampur Bandala))", "کھوڑی (Khori)", "سعد آباد (Sadahabad)", "سیری (Seri)"], "ملوانہ * (Maloana)": ["کلاچھ * (Kalachh)", "ملوانہ * (Maloana)"], "سماہنی (Samahni)": ["گاہی (Gahi)", "منانہ (Manana)"], "سندوہا (Sandoha)": ["گھوڑا گکھڑاں * (Ghora Ghakharan)", "سندوہا (Sandoha)"], "چارج نمبر 09 (شہری حلقہ) (Charge No 09)": ["سرکل نمبر 01 (Circle No 01)"]}};
function fillPatwar(){
  const teh=document.getElementById("L-tehsil").value;
  const pcEl=document.getElementById("L-patwar"), mzEl=document.getElementById("L-mouza");
  if(!teh||!PATWAR[teh]){ pcEl.innerHTML='<option value="">پہلے تحصیل چنیں</option>'; mzEl.innerHTML='<option value="">پہلے پٹوار سرکل چنیں</option>'; return; }
  pcEl.innerHTML='<option value="">پٹوار سرکل چنیں…</option>'+Object.keys(PATWAR[teh]).map(k=>`<option value="${k}">${k}</option>`).join("");
  mzEl.innerHTML='<option value="">پہلے پٹوار سرکل چنیں</option>';
}
function fillMouza(){
  const teh=document.getElementById("L-tehsil").value;
  const pc=document.getElementById("L-patwar").value;
  const mzEl=document.getElementById("L-mouza");
  if(!teh||!pc||!PATWAR[teh]||!PATWAR[teh][pc]){ mzEl.innerHTML='<option value="">پہلے پٹوار سرکل چنیں</option>'; return; }
  mzEl.innerHTML='<option value="">موضع / گاؤں چنیں…</option>'+PATWAR[teh][pc].map(k=>`<option value="${k}">${k}</option>`).join("");
}
const CAT_NAMES = {plot:"پلاٹ",house:"مکان",shop:"دکان",commercial:"کمرشل",residential:"ریزیڈنشیل",agri:"زرعی"};
const VERIFY = {
  0:{label:"جانچ جاری — درجہ تصدیق طلب",cls:"chip-pending"},
  1:{label:"✓ دستاویزات دیکھے گئے",cls:"chip-verify"},
  2:{label:"✓ موقع دیکھا گیا",cls:"chip-verify"},
  3:{label:"✓✓ دونوں جانچیں مکمل",cls:"chip-verify"}
};
const SEED = [
  {id:"BBB-001",title:"11 مرلہ رہائشی پلاٹ — چریاں",cat:"plot",tehsil:"bhimber",area:"چریاں",uc:"پنجائری",size:"11 مرلہ",price:"قیمت کے لیے رابطہ کریں",verify:0,featured:true,by:"بھمبر بزنس بیورو",date:"2026-10-16",desc:"میرپور روڈ پر واقع، بھمبر شہر کے قریب۔ BBB کی سب سے زیادہ دیکھی جانے والی لسٹنگ (اصل پلاٹ ریل)۔",feats:["میرپور روڈ پر واقع","بھمبر شہر کے قریب","رہائشی پلاٹ"],svg:"road"},
  {id:"BBB-002",title:"رہائشی پلاٹ — لوئر سیرلہ",cat:"plot",tehsil:"bhimber",area:"سیرلہ — لوئر سیرلہ",uc:"پنجائری",size:"سائز رابطے پر",price:"قیمت کے لیے رابطہ کریں",verify:0,featured:false,by:"بھمبر بزنس بیورو",date:"2026-10-16",desc:"بائیکو پمپ کے قریب، پرسکون رہائشی ماحول۔ سائز اور طلب مالک کے کاغذات کے مطابق رابطے پر۔",feats:["بائیکو پمپ کے قریب، بھمبر","پرسکون محلہ","رہائشی پلاٹ"],svg:"hills"},
  {id:"BBB-003",title:"رہائشی پلاٹ — بلدیہ حدود، بھمبر شہر",cat:"plot",tehsil:"bhimber",area:"بلدیہ حدود",uc:"ایم سی بھمبر (میونسپل کارپوریشن)",size:"سائز رابطے پر",price:"قیمت کے لیے رابطہ کریں",verify:0,featured:false,by:"بھمبر بزنس بیورو",date:"2026-10-16",desc:"میونسپل حدود کے اندر — شہر کی روزمرہ سہولتوں کے قریب۔",feats:["میونسپل حدود کے اندر","شہر کی سہولتوں کے قریب","رہائشی پلاٹ"],svg:"city"}
];
const SVGS = {
  road:`<svg viewBox="0 0 600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="200" fill="#DCEBDD"/><path d="M0 120 Q150 80 300 105 T600 90 V200 H0 Z" fill="#8FBF7A"/><path d="M0 150 L600 130 L600 200 L0 200 Z" fill="#6FA85E"/><path d="M120 200 L300 118 L360 118 L520 200 Z" fill="#3E4A5A"/><path d="M318 122 L332 200" stroke="#F5D76E" stroke-width="5" stroke-dasharray="16 12"/><circle cx="520" cy="52" r="24" fill="#F2C94C"/></svg>`,
  hills:`<svg viewBox="0 0 600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="200" fill="#E3F0E8"/><path d="M0 110 L140 45 L260 100 L380 38 L600 105 V200 H0 Z" fill="#7FB069" opacity=".75"/><path d="M0 145 Q200 115 600 140 V200 H0 Z" fill="#588157"/><circle cx="520" cy="46" r="20" fill="#F2C94C"/></svg>`,
  city:`<svg viewBox="0 0 600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="200" fill="#EAF2F8"/><g fill="#B9CFE6"><rect x="30" y="70" width="70" height="90"/><rect x="120" y="45" width="84" height="115"/><rect x="440" y="55" width="76" height="105"/><rect x="530" y="80" width="56" height="80"/></g><rect x="0" y="160" width="600" height="40" fill="#8FA8C8"/></svg>`
};
// ---------- storage ----------

