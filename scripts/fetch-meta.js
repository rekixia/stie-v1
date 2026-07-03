// =====================================================
//  fetch-meta.js — 멤버 프로필 사진 + 음반 썸네일을 가져와
//                  data/meta.json 을 생성합니다.
//
//  자동 수집: 멤버 프로필 사진(채널 핸들 기준) · 음반 썸네일(영상 ID 기준)
//  관리 대상: js/data.js 의 youtube(핸들) / 음반 videoId
//
//  실행: YOUTUBE_API_KEY=키 node scripts/fetch-meta.js   (Node 18+)
//        (Windows는 fetch-views.js 주석의 방법과 동일)
// =====================================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) { console.error("✗ 환경변수 YOUTUBE_API_KEY 가 없습니다."); process.exit(1); }

// data.js 를 그대로 읽어 MEMBERS / ALBUMS 를 꺼내옵니다.
const dataSrc = fs.readFileSync(path.join(__dirname, "..", "public", "js", "data.js"), "utf8");
const ctx = {};
vm.runInNewContext(dataSrc + "\nthis.__M = MEMBERS; this.__A = ALBUMS;", ctx);
const MEMBERS = ctx.__M, ALBUMS = ctx.__A;

const OUT = path.join(__dirname, "..", "public", "data", "meta.json");

async function main() {
  const meta = { members: {}, albums: {} };

  // 1) 멤버 프로필 사진 — channels.list(forHandle) 로 핸들당 1회 (1유닛)
  for (const m of MEMBERS) {
    if (!m.youtube) continue;
    const url = "https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=" +
      encodeURIComponent(m.youtube) + "&key=" + API_KEY;
    const res = await fetch(url);
    if (!res.ok) { console.error("✗ 채널 조회 실패", m.id, res.status); continue; }
    const data = await res.json();
    const ch = data.items && data.items[0];
    if (ch) {
      const t = ch.snippet.thumbnails;
      meta.members[m.id] = (t.high || t.medium || t.default).url;
    } else {
      console.warn("! 채널을 못 찾음:", m.youtube);
    }
  }

  // 2) 음반 썸네일 — videos.list 로 50개씩 (1유닛/호출)
  const vids = ALBUMS.filter((a) => a.videoId).map((a) => a.videoId);
  for (let i = 0; i < vids.length; i += 50) {
    const batch = vids.slice(i, i + 50);
    const url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
      batch.join(",") + "&key=" + API_KEY;
    const res = await fetch(url);
    if (!res.ok) { console.error("✗ 영상 조회 실패", res.status); continue; }
    const data = await res.json();
    for (const it of data.items) {
      const t = it.snippet.thumbnails;
      meta.albums[it.id] = (t.maxres || t.standard || t.high || t.medium || t.default).url;
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(meta, null, 2), "utf8");
  console.log(`✓ 완료: 멤버 ${Object.keys(meta.members).length}명 · 음반 ${Object.keys(meta.albums).length}개 → data/meta.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
