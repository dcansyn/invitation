/* ══════════════════════════════════════════════════════════════
   Simge & İsmail — davetiye motoru
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var D = window.DAVET || {};
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var clamp = function (v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var LESS = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var TARGET = new Date(D.tarihISO || "2027-05-22T16:30:00+03:00");

  /* ═══ 1. İçeriği config'ten doldur ══════════════════════════ */
  function fillContent() {
    var g = D.gelin || "Simge",
      d = D.damat || "İsmail";

    document.title = g + " & " + d + " · Düğün Davetiyesi";

    // kapak
    var pn = $(".parcel-names");
    if (pn) pn.innerHTML = esc(g) + "<em>&amp;</em>" + esc(d);
    var pd = $(".parcel-date");
    if (pd) pd.textContent = (D.tarihKisa || "").split(".").join(" · ");
    if (D.mekan) setText("#parcelSide", D.mekan.ilce.replace(" / ", " · ").toLocaleUpperCase("tr"));

    // açılış
    $(".name-1 .split").textContent = g;
    $(".name-2 .split").textContent = d;
    $(".rail").textContent = (D.tarihKisa || "") + " — " + (D.mekan ? D.mekan.ilce.toLocaleUpperCase("tr") : "");
    $(".hero-meta").innerHTML = "<span>" + esc(D.gunMetni) + "</span><i></i>" + "<span>" + esc(D.tarihMetni) + "</span><i></i>" + "<span>" + esc(D.program && D.program[0] ? D.program[0].saat : "") + "</span>";

    // hikâye
    var sl = $("#storyList");
    (D.hikaye || []).forEach(function (h, i) {
      var li = document.createElement("li");
      li.className = "story-item rv";
      li.style.setProperty("--i", i);
      li.innerHTML = '<span class="story-year">' + esc(h.yil) + "</span>" + '<h3 class="story-title">' + esc(h.baslik) + "</h3>" + '<p class="story-text">' + esc(h.metin) + "</p>" + '<span class="story-rule"></span>';
      sl.appendChild(li);
    });

    // program
    var pl = $("#progList");
    (D.program || []).forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "prog-row";
      li.style.setProperty("--i", i);
      li.innerHTML = '<span class="prog-time">' + esc(p.saat) + "</span>" + '<span class="prog-mid"></span>' + '<span class="prog-name">' + esc(p.baslik) + (p.not ? '<span class="prog-note">' + esc(p.not) + "</span>" : "") + "</span>";
      pl.appendChild(li);
    });
    setText("#tkDay", D.gunMetni);
    setText("#tkDate", D.tarihMetni);
    setText("#tkVenue", D.mekan && D.mekan.ad);
    setText("#tkCity", D.mekan && D.mekan.ilce);

    // mekân
    if (D.mekan) {
      setText("#venueName", D.mekan.ad);
      setText("#venueCity", D.mekan.ilce);
      setText("#venueAddr", D.mekan.adres);
      var tel = $("#venueTel");
      if (tel && D.mekan.telefon) {
        tel.textContent = D.mekan.telefon;
        tel.href = "tel:" + D.mekan.telefon.replace(/[^\d+]/g, "");
      } else if (tel) {
        tel.parentNode.style.display = "none";
      }
      $("#mapBtn").href = D.mekan.mapsUrl || "#";
    }

    // takvim
    $("#calBtn").href = calendarUrl();

    // kapanış
    setText("#monogram", D.monogram || g.charAt(0) + " & " + d.charAt(0));
    setText("#colDate", (D.tarihKisa || "").split(".").join(" · "));
    setText("#colVenue", D.mekan ? D.mekan.ilce.replace(" / ", ", ") : "");
    setText("#ldsDate", D.ldsTarihi);

    // galeri
    var fr = $("#frames");
    (D.galeri || []).forEach(function (f, i) {
      var fig = document.createElement("figure");
      fig.className = "frame";
      fig.style.setProperty("--i", i);
      fig.setAttribute("data-speed", (0.018 + (i % 3) * 0.014).toFixed(3));

      var media = document.createElement("div");
      media.className = "frame-media";
      var img = new Image();
      img.src = f.src;
      img.alt = f.not || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        img.remove();
        var ph = document.createElement("div");
        ph.className = "frame-ph";
        ph.setAttribute("data-ph", "fotoğraf");
        ph.innerHTML = '<svg class="sprig" viewBox="0 0 120 200" aria-hidden="true">' + SPRIG + "</svg>";
        media.appendChild(ph);
      };
      media.appendChild(img);

      var cap = document.createElement("figcaption");
      cap.className = "frame-cap";
      cap.textContent = f.not || "";

      fig.appendChild(media);
      fig.appendChild(cap);
      fr.appendChild(fig);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function setText(sel, v) {
    var el = $(sel);
    if (el && v != null) el.textContent = v;
  }

  function calendarUrl() {
    var fmt = function (dt) {
      return dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate()) + "T" + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + "00Z";
    };
    var end = new Date(D.bitisISO || TARGET.getTime() + 6 * 3600e3);
    var m = D.mekan || {};
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" + "&text=" + encodeURIComponent((D.gelin || "") + " & " + (D.damat || "") + " Düğünü") + "&dates=" + fmt(TARGET) + "/" + fmt(end) + "&location=" + encodeURIComponent([m.ad, m.adres].filter(Boolean).join(", ")) + "&details=" + encodeURIComponent("Sizi aramızda görmek bizi çok mutlu eder.");
  }
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  /* zeytin dalı — <use> gölge ağacında CSS animasyonları instance'a
     geçmediği için motif her yere satır içi basılıyor */
  var SPRIG = '<path class="stem" fill="none" d="M60 196 C56 150 58 104 68 62 C74 38 84 20 96 6"/>' + '<g class="sprig-leaves" stroke="none">' + '<path d="M64 172 C50 168 40 156 40 144 C54 142 64 152 64 172Z"/>' + '<path d="M65 156 C79 154 90 143 91 131 C77 128 66 137 65 156Z"/>' + '<path d="M67 138 C53 134 43 122 43 110 C57 108 67 118 67 138Z"/>' + '<path d="M70 120 C84 117 95 106 95 94 C81 92 70 101 70 120Z"/>' + '<path d="M74 100 C60 97 51 84 52 72 C66 71 75 81 74 100Z"/>' + '<path d="M79 82 C93 78 103 66 102 54 C88 53 78 63 79 82Z"/>' + '<path d="M86 62 C73 58 65 45 67 33 C81 33 89 44 86 62Z"/>' + "</g>";

  function paintSprigs() {
    $$(".sprig").forEach(function (el) {
      if (!el.firstChild) el.innerHTML = SPRIG;
    });
  }

  /* ═══ 2. Harf harf açılan başlıklar ═════════════════════════ */
  function splitAll() {
    $$(".split").forEach(function (el) {
      var chars = Array.from(el.textContent);
      el.textContent = "";
      chars.forEach(function (c, i) {
        if (c === " ") {
          el.appendChild(document.createTextNode(" "));
          return;
        }
        var w = document.createElement("span");
        w.className = "ch";
        var inner = document.createElement("span");
        inner.className = "ch-i";
        inner.textContent = c;
        inner.style.transitionDelay = (0.05 * i).toFixed(2) + "s";
        w.appendChild(inner);
        el.appendChild(w);
      });
    });
  }

  /* maske ile açılan satırların içini sarmala — böylece elemanın kendi
     kutusu tam yüksekliğini korur ve IntersectionObserver doğru çalışır */
  function wrapMasks() {
    $$('[data-rev="mask"]').forEach(function (el) {
      if (el.firstElementChild && el.firstElementChild.className === "mask-i") return;
      var inner = document.createElement("span");
      inner.className = "mask-i";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    });
  }

  /* ═══ 3. Kendini çizen SVG çizgileri ════════════════════════ */
  function measureDraw() {
    $$(".dw").forEach(function (p) {
      try {
        var L = p.getTotalLength();
        if (L) p.style.setProperty("--len", Math.ceil(L + 2));
      } catch (e) {
        /* yok say */
      }
    });
  }

  /* ═══ 4. Görünüme girince canlanma ══════════════════════════ */
  var io;
  function initReveal() {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    $$(".rv, .ticket, .frame, .map-wrap, .story-item, .crest").forEach(function (el) {
      if (el.closest("#hero")) return; // açılış bölümü kapak sonrası tetiklenir
      io.observe(el);
    });
  }

  function playHero() {
    var seq = $$("#hero .rv, #hero .names, #hero .amp");
    seq.forEach(function (el, i) {
      setTimeout(
        function () {
          el.classList.add("is-in");
        },
        140 + i * 180,
      );
    });
  }

  /* ═══ 5. Kırmızı ip — sayfayı baştan sona bağlayan kurdele ══ */
  var TH = { path: null, len: 0, knots: [], bead: null, H: 0 };

  function catmull(pts) {
    if (pts.length < 2) return "";
    var d = "M " + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6,
        c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6,
        c2y = p2.y - (p3.y - p1.y) / 6;
      d += " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " + c2x.toFixed(1) + " " + c2y.toFixed(1) + ", " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
    }
    return d;
  }

  function buildThread() {
    var svg = $("#thread"),
      path = $("#threadPath"),
      kg = $("#threadKnots"),
      bead = $("#threadBead"),
      page = $("#page");
    if (!svg || !page) return;

    var W = page.clientWidth,
      H = page.offsetHeight;
    if (!W || !H) return;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);

    var amp = Math.min(W * 0.3, 300);
    var pts = [{ x: W / 2, y: -30 }];

    $$("[data-anchor]").forEach(function (el) {
      var sec = el.closest("section") || el.parentElement;
      var r = sec.getBoundingClientRect();
      var at = parseFloat(el.getAttribute("data-at"));
      var y = r.top + window.pageYOffset + r.height * (isNaN(at) ? 0.5 : at);
      var side = el.getAttribute("data-anchor");
      var x = W / 2 + (side === "l" ? -amp : side === "r" ? amp : 0);
      pts.push({ x: clamp(x, 28, W - 28), y: y });
    });
    // ip son olarak kapanıştaki fiyonka gidip orada bağlanıyor
    var crest = $("#crest");
    if (crest) {
      var cr = crest.getBoundingClientRect();
      pts.push({ x: cr.left + cr.width / 2, y: cr.top + window.pageYOffset + cr.height * 0.47 });
    } else {
      pts.push({ x: W / 2, y: H - 24 });
    }

    path.setAttribute("d", catmull(pts));
    var L = path.getTotalLength();
    path.style.strokeDasharray = L;
    path.style.strokeDashoffset = L;

    // düğümler
    kg.innerHTML = "";
    TH.knots = pts.slice(1, -1).map(function (p) {
      var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("class", "thread-knot");
      c.setAttribute("cx", p.x);
      c.setAttribute("cy", p.y);
      c.setAttribute("r", 4);
      kg.appendChild(c);
      return { el: c, y: p.y, on: false };
    });

    TH.path = path;
    TH.len = L;
    TH.bead = bead;
    TH.H = Math.max(320, pts[pts.length - 1].y);
    drawThread();
  }

  function drawThread() {
    if (!TH.path) return;
    var head = window.pageYOffset + window.innerHeight * 0.74;
    var p = clamp(head / TH.H, 0, 1);
    TH.path.style.strokeDashoffset = TH.len * (1 - p);

    if (TH.bead) {
      if (p > 0.004 && p < 0.995) {
        var pt = TH.path.getPointAtLength(TH.len * p);
        TH.bead.setAttribute("cx", pt.x);
        TH.bead.setAttribute("cy", pt.y);
        TH.bead.setAttribute("opacity", ".95");
      } else {
        TH.bead.setAttribute("opacity", "0");
      }
    }
    TH.knots.forEach(function (k) {
      if (!k.on && head >= k.y) {
        k.on = true;
        k.el.classList.add("on");
      }
    });
  }

  /* ═══ 6. Savrulan yapraklar ═════════════════════════════════ */
  var LEAF = ["M12 1 C21 6 24 16 18 24 C11 32 2 28 1 19 C0 11 5 5 12 1Z", "M2 12 C8 2 20 1 23 8 C26 16 16 24 8 22 C2 20 0 16 2 12Z", "M12 0 C16 8 24 10 24 12 C24 14 16 16 12 24 C8 16 0 14 0 12 C0 10 8 8 12 0Z"];
  function makePetals() {
    if (LESS) return;
    var host = $("#petals");
    var n = window.innerWidth < 700 ? 9 : 15;
    for (var i = 0; i < n; i++) {
      var s = 7 + Math.random() * 13;
      var el = document.createElement("span");
      el.className = "petal";
      el.style.width = s + "px";
      el.style.height = s + "px";
      el.style.setProperty("--x0", (Math.random() * 100).toFixed(2) + "vw");
      el.style.setProperty("--x1", (Math.random() * 100).toFixed(2) + "vw");
      el.style.setProperty("--op", (0.16 + Math.random() * 0.3).toFixed(2));
      el.style.setProperty("--r0", Math.random() * 90 - 45 + "deg");
      el.style.setProperty("--r1", Math.random() * 260 + 120 + "deg");
      el.style.setProperty("--sc", (0.7 + Math.random() * 0.5).toFixed(2));
      el.style.animationDuration = (17 + Math.random() * 20).toFixed(1) + "s";
      el.style.animationDelay = (-Math.random() * 30).toFixed(1) + "s";

      var inner = document.createElement("i");
      inner.style.animationDuration = (2.4 + Math.random() * 3).toFixed(1) + "s";
      inner.style.animationDelay = (-Math.random() * 3).toFixed(1) + "s";
      inner.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + LEAF[i % LEAF.length] + '" fill="' + (i % 4 === 0 ? "#BF4436" : i % 3 === 0 ? "#A3AE93" : "#79876A") + '"/></svg>';
      el.appendChild(inner);
      host.appendChild(el);
    }
  }

  /* ═══ 7. Geri sayım — dönen rakamlar ════════════════════════ */
  function buildOdo(el, n) {
    el.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var od = document.createElement("span");
      od.className = "od";
      var st = document.createElement("span");
      st.className = "od-strip";
      for (var j = 0; j < 10; j++) {
        var s = document.createElement("span");
        s.textContent = j;
        st.appendChild(s);
      }
      od.appendChild(st);
      el.appendChild(od);
    }
  }
  function setOdo(el, val, minLen) {
    var s = String(Math.max(0, val));
    while (s.length < minLen) s = "0" + s;
    if (el.childElementCount !== s.length) buildOdo(el, s.length);
    for (var i = 0; i < s.length; i++) {
      el.children[i].firstChild.style.transform = "translateY(-" + +s[i] * 10 + "%)";
    }
  }
  function tick() {
    var diff = TARGET - new Date();
    if (diff < 0) diff = 0;
    var sec = Math.floor(diff / 1000);
    var d = Math.floor(sec / 86400),
      h = Math.floor((sec % 86400) / 3600),
      m = Math.floor((sec % 3600) / 60),
      s = sec % 60;
    setOdo($('[data-odo="d"]'), d, String(d).length > 2 ? 3 : 2);
    setOdo($('[data-odo="h"]'), h, 2);
    setOdo($('[data-odo="m"]'), m, 2);
    setOdo($('[data-odo="s"]'), s, 2);
    if (diff === 0) {
      $(".count-lead").textContent = "bugün";
      $(".count-note").textContent = "o gün geldi ✿";
    }
  }

  /* ═══ 8. Fotoğraflarda yumuşak paralaks ═════════════════════ */
  var frames = [];
  function parallax() {
    if (LESS || window.innerWidth < 761) return;
    var vc = window.innerHeight / 2;
    frames.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      var off = (vc - (r.top + r.height / 2)) * f.sp;
      f.el.style.setProperty("--py", clamp(off, -70, 70).toFixed(1) + "px");
    });
  }

  /* ═══ 9. Kapak — kurdeleyi çek ══════════════════════════════ */
  function initGate() {
    var gate = $("#gate"),
      parcel = $("#parcel"),
      btn = $("#gateBtn");
    if (!gate) return;

    gate.classList.add("is-on");
    document.body.classList.add("is-locked");

    var dragging = false,
      moved = false,
      suppressClick = false,
      startY = 0,
      opened = false;

    function setPull(v) {
      parcel.style.setProperty("--pull", clamp(v, 0, 1).toFixed(3));
    }

    function open() {
      if (opened) return;
      opened = true;
      setPull(1);
      gate.classList.add("is-open");
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-revealed");
      $("#music").classList.add("is-ready");
      setTimeout(playHero, 620);
      setTimeout(function () {
        buildThread();
        drawThread();
      }, 900);
      setTimeout(function () {
        gate.style.display = "none";
      }, 1500);
    }

    function down(e) {
      if (opened) return;
      dragging = true;
      moved = false;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      parcel.style.transition = "none";
    }
    function move(e) {
      if (!dragging || opened) return;
      var y = e.touches ? e.touches[0].clientY : e.clientY;
      var dy = y - startY;
      if (Math.abs(dy) > 4) moved = true;
      if (dy > 0) {
        setPull(dy / 150);
        if (e.cancelable) e.preventDefault();
      }
    }
    function up() {
      if (!dragging || opened) return;
      dragging = false;
      suppressClick = moved;
      var cur = parseFloat(parcel.style.getPropertyValue("--pull")) || 0;
      parcel.style.transition = "";
      if (cur > 0.42) open();
      else setPull(0);
    }

    parcel.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    parcel.addEventListener("click", function () {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      open();
      musicToggle();
    });
    btn.addEventListener("click", open);
    gate.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        open();
      }
    });
    gate.setAttribute("tabindex", "-1");
    setTimeout(function () {
      gate.focus({ preventScroll: true });
    }, 400);
  }

  /* ═══ 10. LDS — doğrudan mesaj bağlantısı ══════════════════ */
  // 905321234567 -> +90 532 123 45 67
  function telBicim(no) {
    var m = /^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(no);
    return m ? "+" + m[1] + " " + m[2] + " " + m[3] + " " + m[4] + " " + m[5] : "+" + no;
  }

  function initReply() {
    var btn = $("#replyBtn"),
      alt = $("#replyAlt");
    if (!btn) return;

    var msg = "Merhaba! " + (D.gelin || "") + " & " + (D.damat || "") + " düğünü için dönüş yapıyorum: ";

    if (D.whatsapp) {
      var no = String(D.whatsapp).replace(/\D/g, "");
      btn.href = "https://wa.me/" + no + "?text=" + encodeURIComponent(msg);
      $("#replyBtnText").textContent = "WhatsApp’tan yaz";
      alt.innerHTML = 'ya da <a href="tel:+' + no + '">' + telBicim(no) + "</a> numarasını arayabilirsin";
    } else if (D.eposta) {
      btn.href = "mailto:" + D.eposta + "?subject=" + encodeURIComponent("Düğün — geri dönüş") + "&body=" + encodeURIComponent(msg);
      btn.removeAttribute("target");
      $("#replyBtnText").textContent = "E-posta gönder";
      alt.textContent = D.eposta;
    } else {
      btn.style.display = "none";
    }
  }

  /* ═══ 11. Müzik kutusu — Web Audio ile canlı üretim ═════════ */
  var MB = { ctx: null, on: false, timer: null, step: 0, next: 0, master: null };
  var SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0, 987.77];
  var SEQ = [0, 2, 4, 3, 5, 4, 2, null, 1, 3, 5, 4, 6, 5, 3, null, 2, 4, 6, 5, 7, 6, 4, null, 3, 5, 7, 8, 9, 7, 5, null];
  var STEP_T = 0.34;

  function audioStart() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!MB.ctx) {
      MB.ctx = new AC();
      MB.master = MB.ctx.createGain();
      MB.master.gain.value = 0;

      var delay = MB.ctx.createDelay(1.0);
      delay.delayTime.value = 0.34;
      var fb = MB.ctx.createGain();
      fb.gain.value = 0.3;
      var wet = MB.ctx.createGain();
      wet.gain.value = 0.26;
      var lp = MB.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2200;

      MB.master.connect(MB.ctx.destination);
      MB.master.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(lp);
      lp.connect(wet);
      wet.connect(MB.ctx.destination);
    }
    if (MB.ctx.state === "suspended") MB.ctx.resume();
    return true;
  }

  function pluck(t, freq, vol, dur) {
    var c = MB.ctx;
    var o1 = c.createOscillator();
    o1.type = "triangle";
    o1.frequency.value = freq;
    var o2 = c.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 2.004;
    var g = c.createGain();
    var g2 = c.createGain();
    g2.gain.value = 0.22;
    var f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(4200, t);
    f.frequency.exponentialRampToValueAtTime(900, t + dur);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    o1.connect(g);
    o2.connect(g2);
    g2.connect(g);
    g.connect(f);
    f.connect(MB.master);
    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.05);
    o2.stop(t + dur + 0.05);
  }

  function schedule() {
    var c = MB.ctx;
    while (MB.next < c.currentTime + 0.2) {
      var i = MB.step % SEQ.length;
      var n = SEQ[i];
      if (n !== null) pluck(MB.next, SCALE[n], 0.14, 2.3);
      if (i % 8 === 0) pluck(MB.next, SCALE[i % 16 === 0 ? 0 : 2] / 2, 0.1, 3.4);
      if (i % 8 === 4) pluck(MB.next + 0.02, SCALE[3] / 2, 0.06, 3.0);
      MB.next += STEP_T;
      MB.step++;
    }
  }

  function musicToggle() {
    var btn = $("#music");
    if (!MB.on) {
      if (!audioStart()) return;
      MB.on = true;
      btn.setAttribute("aria-pressed", "true");
      MB.next = MB.ctx.currentTime + 0.08;
      MB.master.gain.cancelScheduledValues(MB.ctx.currentTime);
      MB.master.gain.setValueAtTime(0.0001, MB.ctx.currentTime);
      MB.master.gain.linearRampToValueAtTime(0.6, MB.ctx.currentTime + 1.6);
      schedule();
      MB.timer = setInterval(schedule, 60);
    } else {
      MB.on = false;
      btn.setAttribute("aria-pressed", "false");
      clearInterval(MB.timer);
      MB.timer = null;
      MB.master.gain.cancelScheduledValues(MB.ctx.currentTime);
      MB.master.gain.setValueAtTime(MB.master.gain.value, MB.ctx.currentTime);
      MB.master.gain.linearRampToValueAtTime(0.0001, MB.ctx.currentTime + 0.7);
    }
  }

  /* ═══ 12. Kurulum ═══════════════════════════════════════════ */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      drawThread();
      parallax();
      ticking = false;
    });
  }

  var rebuildTimer = null;
  function scheduleThread() {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(function () {
      buildThread();
      drawThread();
      parallax();
    }, 140);
  }

  function boot() {
    fillContent();
    paintSprigs();
    wrapMasks();
    splitAll();
    measureDraw();
    makePetals();
    initReveal();
    initReply();
    initGate();

    frames = $$(".frame").map(function (el) {
      return { el: el, sp: parseFloat(el.getAttribute("data-speed")) || 0.02 };
    });

    tick();
    setInterval(tick, 1000);

    $("#music").addEventListener("click", musicToggle);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleThread);
    if (window.ResizeObserver) new ResizeObserver(scheduleThread).observe($("#page"));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleThread);
    window.addEventListener("load", scheduleThread);

    buildThread();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
