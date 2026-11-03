/* BBB shared interactions — glass site */
(function(){
  "use strict";
  /* header state + mobile nav */
  var hd=document.querySelector("header.site");
  addEventListener("scroll",function(){ if(hd) hd.classList.toggle("scrolled",scrollY>24); },{passive:true});
  var bg=document.querySelector(".burger"), nav=document.querySelector("nav.main");
  if(bg&&nav) bg.addEventListener("click",function(){ nav.classList.toggle("open"); });
  /* scroll reveal */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }); },{threshold:.12});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  /* animated counters (real figures only) */
  var cio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; cio.unobserve(e.target);
    var end=+e.target.dataset.count, t0=performance.now(), dur=1500;
    (function tick(t){ var p=Math.min(1,(t-t0)/dur), ease=1-Math.pow(1-p,3);
      e.target.textContent=Math.round(end*ease).toLocaleString("en-US");
      if(p<1) requestAnimationFrame(tick); })(t0);
  }); },{threshold:.4});
  document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });
  /* gold edge-light tracker on glass cards */
  document.querySelectorAll(".gcard").forEach(function(c){
    c.addEventListener("pointermove",function(ev){ var r=c.getBoundingClientRect();
      c.style.setProperty("--ang",((Math.atan2(ev.clientY-r.top-r.height/2, ev.clientX-r.left-r.width/2)*180/Math.PI)+360)%360+"deg"); });
  });
  /* specular highlight on story cards */
  document.querySelectorAll(".story").forEach(function(c){
    c.addEventListener("pointermove",function(ev){ var r=c.getBoundingClientRect();
      c.style.setProperty("--mx",((ev.clientX-r.left)/r.width*100)+"%");
      c.style.setProperty("--my",((ev.clientY-r.top)/r.height*100)+"%"); });
  });
  /* ripple on gold buttons */
  document.addEventListener("click",function(ev){ var b=ev.target.closest(".btn-gold"); if(!b) return;
    var r=b.getBoundingClientRect(), s=document.createElement("span"); s.className="ripple";
    var d=Math.max(r.width,r.height); s.style.width=s.style.height=d+"px";
    s.style.left=(ev.clientX-r.left-d/2)+"px"; s.style.top=(ev.clientY-r.top-d/2)+"px";
    b.appendChild(s); setTimeout(function(){ s.remove(); },750); });
  /* gold dust particles (hero ambience) */
  var cv=document.getElementById("dust"); if(!cv) return;
  var ctx=cv.getContext("2d"), W,H,ps=[],reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size(){ W=cv.width=innerWidth; H=cv.height=innerHeight; }
  size(); addEventListener("resize",size);
  for(var i=0;i<55;i++) ps.push({x:Math.random(),y:Math.random(),r:Math.random()*1.7+.4,s:Math.random()*.00045+.00012,o:Math.random()*.5+.15,ph:Math.random()*6.28});
  (function draw(t){ ctx.clearRect(0,0,W,H);
    ps.forEach(function(p){ p.y-=p.s; if(p.y<-.02){p.y=1.02;p.x=Math.random();}
      var tw=.65+.35*Math.sin(t/900+p.ph);
      ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r,0,6.29);
      ctx.fillStyle="rgba(230,197,103,"+(p.o*tw).toFixed(3)+")"; ctx.fill(); });
    if(!reduced) requestAnimationFrame(draw); })(0);
})();
