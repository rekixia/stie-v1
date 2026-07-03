// =====================================================
//  main.js — 데이터로 화면을 그리고, API로 가져온 이미지/링크를 적용합니다.
// =====================================================

/* ============ 링크 자동 생성 (핸들 → URL) ============ */
function ytLink(h)    { return h ? "https://www.youtube.com/" + h : "#"; }      // h 예: "@AyatsunoYuni"
function xLink(h)     { return h ? "https://x.com/" + h : "#"; }                // h 예: "ayatsuno"
function chzzkLink(h) { return h ? "https://chzzk.naver.com/" + h : "#"; }      // h 예: "채널ID"

/* ============ 자동 연동 데이터 로더 ============ */
// videos.json: 노래 / meta.json: 멤버 프로필 사진 + 음반 썸네일
// 둘 다 없으면(또는 file://로 직접 열면) 기본값으로 자동 대체됩니다.
let SONG_DATA = SONGS;
let META = { members: {}, albums: {} };

async function loadJSON(path) {
  try { const r = await fetch(path, { cache: "no-store" }); if (r.ok) return await r.json(); }
  catch (e) {}
  return null;
}
async function loadSongs() { const d = await loadJSON("data/videos.json"); if (Array.isArray(d) && d.length) SONG_DATA = d; }
async function loadMeta()  { const d = await loadJSON("data/meta.json");   if (d) META = { members: d.members || {}, albums: d.albums || {} }; }

/* ============ 카드 도우미 ============ */
function memberCard(m) {
  const photo = META.members[m.id];
  const head = photo
    ? `<img src="${photo}" alt="${m.nameKr}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
    : `<div class="avatar"></div><div class="cap">멤버 이미지 자리</div>`;
  return `
    <article class="mcard" style="--mc:${m.color}" tabindex="0" data-id="${m.id}">
      <div class="mhead">
        ${head}
        <span class="star">★</span>
        <span class="unit">${m.unit}</span>
      </div>
      <div class="mbody">
        <div class="name">${m.nameKr}</div>
        <div class="roman">${m.nameRoman}</div>
        <div class="mrow"><span class="k">기수</span><span>${m.gen}기</span></div>
        <div class="mrow"><span class="k">데뷔</span><span>${m.debut}</span></div>
        <div class="social">
          <a href="${ytLink(m.youtube)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">YouTube</a>
          <a href="${xLink(m.x)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">X</a>
          <a href="${chzzkLink(m.chzzk)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">치지직</a>
        </div>
      </div>
    </article>`;
}

function videoCard(song, rank) {
  const m = getMember(song.memberId);
  const thumb = song.thumbnail
    ? `<img src="${song.thumbnail}" alt="${song.title} 썸네일" />`
    : `<span class="play">▶</span>`;
  return `
    <a class="vcard" style="--mc:${m.color}" href="${song.url}" target="_blank" rel="noopener">
      <div class="vthumb">${rank ? `<span class="vrank">#${rank}</span>` : ""}${thumb}</div>
      <div class="vbody">
        <div class="vt">${song.title}</div>
        <div class="vmeta">
          <span class="vbadge">${m.nameKr}</span>
          <span class="vviews">조회수 ${formatViews(song.views)}</span>
        </div>
      </div>
    </a>`;
}

function albumCard(a) {
  const thumb = a.videoId ? META.albums[a.videoId] : null;
  const link = a.videoId ? "https://www.youtube.com/watch?v=" + a.videoId : a.link;
  const cover = thumb
    ? `<img src="${thumb}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover">`
    : "♪";
  return `
    <a class="acard" href="${link}" target="_blank" rel="noopener">
      <div class="acover" style="background:${a.color}">${cover}</div>
      <div class="abody">
        <span class="atype">${a.type}</span>
        <div class="atitle">${a.title}</div>
        <div class="aartist">${a.artist}</div>
        <div class="adate">${a.date}</div>
      </div>
    </a>`;
}

function goodsCard(g) {
  return `
    <div class="gcard">
      <div class="gimg"><span class="ph-star">★</span><span class="ph-label">이미지 준비 중</span></div>
      <div class="gbody">
        <div class="gname">${g.name}</div>
        <div class="gperiod">${g.period}</div>
        <a class="gbtn" href="${g.link}" target="_blank" rel="noopener">공식 판매처에서 보기 →</a>
      </div>
    </div>`;
}

function newsCard(n) {
  return `
    <a class="ncard" href="${n.link}" target="_blank" rel="noopener">
      <div class="nimg"><span class="ph-star">★</span></div>
      <div class="nbody"><div class="nt">${n.title}</div><div class="nd">★ ${n.date}</div></div>
    </a>`;
}

/* ============ 등장 애니메이션 ============ */
const _io = ("IntersectionObserver" in window)
  ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); _io.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -40px 0px" })
  : null;
function revealize(c) {
  if (!c) return;
  [...c.children].forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (Math.min(i, 10) * 45) + "ms"; if (_io) _io.observe(el); else el.classList.add("in"); });
}

/* ============ 멤버 카드 클릭 → 상세 ============ */
function wireMemberCardClicks(c) {
  const go = (el) => { const card = el.closest(".mcard"); if (card) location.href = `member.html?id=${card.dataset.id}`; };
  c.addEventListener("click", (e) => go(e.target));
  c.addEventListener("keydown", (e) => { if (e.key === "Enter") go(e.target); });
}

/* ============ 페이지별 렌더 ============ */
function renderHome() {
  const news = document.getElementById("news-grid"); news.innerHTML = NEWS.map(newsCard).join(""); revealize(news);
  const mg = document.getElementById("member-preview"); mg.innerHTML = MEMBERS.slice(0, 5).map(memberCard).join(""); wireMemberCardClicks(mg); revealize(mg);
  const music = document.getElementById("music-preview"); music.innerHTML = ALBUMS.slice(0, 4).map(albumCard).join(""); revealize(music);
}

function renderMembersPage() {
  const grid = document.getElementById("member-grid");
  const tabs = document.getElementById("unit-tabs");
  function draw(unit) { const list = unit === "전체" ? MEMBERS : MEMBERS.filter((m) => m.unit === unit); grid.innerHTML = list.map(memberCard).join(""); revealize(grid); }
  tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (!b) return; tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("on")); b.classList.add("on"); draw(b.dataset.unit); });
  wireMemberCardClicks(grid);
  draw("전체");
}

function renderMemberDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const m = getMember(id);
  const root = document.getElementById("detail");
  if (!m) { root.innerHTML = `<div class="empty">멤버를 찾을 수 없어요. <a class="back" href="members.html">← 멤버 목록으로</a></div>`; return; }
  document.title = `${m.nameKr} — 스텔라이브 팬`;

  const photo = META.members[m.id];
  const port = photo
    ? `<img src="${photo}" alt="${m.nameKr}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><span class="star">★</span>`
    : `<span class="star">★</span><div class="avatar"></div><div class="cap">멤버 이미지 자리</div>`;

  const songs = SONG_DATA.filter((s) => s.memberId === m.id).sort((a, b) => b.views - a.views);
  const songHTML = songs.length
    ? `<div class="section"><div class="section-head"><h2>대표 노래</h2><span class="more">조회수순</span></div><div class="vgrid" id="detail-songs">${songs.map((s, i) => videoCard(s, i + 1)).join("")}</div></div>`
    : "";

  root.innerHTML = `
    <div class="dhero" style="--mc:${m.color}">
      <div class="dport">${port}</div>
      <div class="dinfo">
        <span class="ub">${m.unit} · ${m.gen}기</span>
        <div class="dname">${m.nameKr}</div>
        <div class="droman">${m.nameRoman}</div>
        <div class="dmeta">
          <div><div class="k">데뷔</div><div class="v">${m.debut}</div></div>
          <div><div class="k">유닛</div><div class="v">${m.unit}</div></div>
          <div><div class="k">생일</div><div class="v">${m.birthday || "-"}</div></div>
        </div>
        <p class="dintro">${m.intro}</p>
        <div class="dsoc">
          <a href="${ytLink(m.youtube)}" target="_blank" rel="noopener">YouTube</a>
          <a href="${xLink(m.x)}" target="_blank" rel="noopener">X</a>
          <a href="${chzzkLink(m.chzzk)}" target="_blank" rel="noopener">치지직</a>
        </div>
      </div>
    </div>
    ${songHTML}
    <a class="back" href="members.html">← 멤버 목록으로</a>`;
  revealize(root); revealize(document.getElementById("detail-songs"));
}

function renderSongsPage() {
  const grid = document.getElementById("song-grid");
  const tabs = document.getElementById("member-tabs");
  const sortSel = document.getElementById("sort");
  tabs.innerHTML = `<button class="tab on" data-member="전체">전체</button>` + MEMBERS.map((m) => `<button class="tab" data-member="${m.id}">${m.nameKr.split(" ").pop()}</button>`).join("");
  function draw() {
    const sel = tabs.querySelector(".tab.on").dataset.member;
    let list = sel === "전체" ? [...SONG_DATA] : SONG_DATA.filter((s) => s.memberId === sel);
    if (sortSel.value === "latest") list.sort((a, b) => b.date.localeCompare(a.date)); else list.sort((a, b) => b.views - a.views);
    grid.innerHTML = list.map((s, i) => videoCard(s, i + 1)).join(""); revealize(grid);
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (!b) return; tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("on")); b.classList.add("on"); draw(); });
  sortSel.addEventListener("change", draw);
  draw();
}

function renderAlbumsPage() {
  const grid = document.getElementById("album-grid");
  const tabs = document.getElementById("type-tabs");
  const pager = document.getElementById("album-pager"); // HTML에 추가됨
  const PER = 8;            // 한 페이지당 음반 수
  let type = "전체", page = 1;

  function draw() {
    const list = type === "전체" ? ALBUMS : ALBUMS.filter((a) => a.type === type);
    const pages = Math.max(1, Math.ceil(list.length / PER));
    if (page > pages) page = pages;
    const slice = list.slice((page - 1) * PER, page * PER);
    grid.innerHTML = slice.map(albumCard).join("");
    revealize(grid);

    // 페이지가 1개뿐이면 페이저 숨김
    if (pages <= 1) { pager.innerHTML = ""; return; }
    pager.innerHTML =
      `<button class="pg-btn" data-act="prev" ${page === 1 ? "disabled" : ""}>← 이전</button>` +
      `<span class="pg-info">${page} / ${pages}</span>` +
      `<button class="pg-btn" data-act="next" ${page === pages ? "disabled" : ""}>다음 →</button>`;
  }

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tab"); if (!b) return;
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("on"));
    b.classList.add("on"); type = b.dataset.type; page = 1; draw();
  });
  pager.addEventListener("click", (e) => {
    const b = e.target.closest(".pg-btn"); if (!b) return;
    page += b.dataset.act === "next" ? 1 : -1; draw();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  draw();
}

function renderGoodsPage() { const g = document.getElementById("goods-grid"); g.innerHTML = GOODS.map(goodsCard).join(""); revealize(g); }

/* ============ 공통 UI ============ */
function setupNav() {
  const wrap = document.querySelector(".nav .wrap");
  const menu = document.querySelector(".menu");
  if (!wrap || !menu) return;
  const btn = document.createElement("button");
  btn.className = "nav-toggle"; btn.setAttribute("aria-label", "메뉴 열기/닫기"); btn.innerHTML = "<span></span><span></span><span></span>";
  wrap.appendChild(btn);
  btn.addEventListener("click", () => { menu.classList.toggle("open"); btn.classList.toggle("open"); });
  menu.addEventListener("click", (e) => { if (e.target.tagName === "A") { menu.classList.remove("open"); btn.classList.remove("open"); } });
}
function setupToTop() {
  const fab = document.createElement("button");
  fab.className = "to-top"; fab.setAttribute("aria-label", "맨 위로"); fab.textContent = "↑";
  document.body.appendChild(fab);
  fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => fab.classList.toggle("show", window.scrollY > 400), { passive: true });
}

/* ============ 실행 ============ */
const PAGE = document.body.dataset.page;
const run = { home: renderHome, members: renderMembersPage, member: renderMemberDetail, songs: renderSongsPage, albums: renderAlbumsPage, goods: renderGoodsPage };
async function start() {
  if (PAGE === "songs" || PAGE === "member") await loadSongs();
  if (["home", "members", "member", "albums"].includes(PAGE)) await loadMeta();
  if (run[PAGE]) run[PAGE]();
  setupNav(); setupToTop();
}
start();
