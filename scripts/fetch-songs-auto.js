// =====================================================
//  fetch-songs-auto.js — 채널 업로드 목록을 읽어 노래를
//      자동 발견하고 data/videos.json 을 생성합니다.
//      (songs.source.json 을 손대지 않아도 신곡이 자동 추가됨)
//
//  관리 대상: 아래 CHANNELS (멤버별 채널 핸들) + SONG_KEYWORDS (노래 판별 규칙)
//  자동: 제목·썸네일·조회수·게시일·URL, 그리고 신곡 발견
//
//  실행: YOUTUBE_API_KEY=키 node scripts/fetch-songs-auto.js   (Node 18+)
// =====================================================

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) { console.error("✗ 환경변수 YOUTUBE_API_KEY 가 없습니다."); process.exit(1); }

// ── 설정 ─────────────────────────────────────────────
// 멤버별 채널 핸들 (data.js 의 youtube 와 같은 값)
const CHANNELS = {
  yuni: "@AyatsunoYuni",
  fuya:  "@Sakihanechannel",
  hina:    "@shirayukihina",
  mashiro: "@neneko_mashiro",
  lize:    "@akanelize",
  tabi:    "@arahashitabi",
  shibuki: "@tenkoshibuki",
  rin:     "@aokumorin",
  nana:    "@hanako_nana",
  riko:    "@yuzuhariko",
  // hina: "@...",  ← 멤버마다 핸들을 채우세요
};
// 제목에 이 단어들 중 하나라도 있으면 "노래"로 간주 (대소문자 무시)
// 이 단어가 제목에 있으면 "노래"로 인정 (대소문자 무시)
const SONG_KEYWORDS = ["cover", "music video"];
// 이 단어가 하나라도 있으면 무조건 제외 (쇼츠·챌린지·생일·클립 등)
const EXCLUDE_KEYWORDS = [
  "#shorts", "shorts", "챌린지", "challenge", "생일", "핫클립", "하이라이트",
  "playlist", "플레이리스트", "#meme", "#밈", "d-day", "방송", "top8", "모음",
  "이벤트", "live clip", "live2d",]
const MAX_PER_CHANNEL = 10000;
// ─────────────────────────────────────────────────────

const OUT = path.join(__dirname, "..", "public", "data", "videos.json");
const api = (p) => "https://www.googleapis.com/youtube/v3/" + p + "&key=" + API_KEY;
const isSong = (title) => {
  const t = title.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((k) => t.includes(k.toLowerCase()))) return false; // 제외 먼저
  return SONG_KEYWORDS.some((k) => t.includes(k.toLowerCase()));               // 그다음 포함
};
const toYM = (iso) => iso.slice(0, 7).replace("-", ".");

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) { console.error("✗ API 오류", r.status, await r.text()); process.exit(1); }
  return r.json();
}

async function main() {
  const found = []; // { videoId, memberId }

  for (const [memberId, handle] of Object.entries(CHANNELS)) {
    if (!handle || handle.includes("...")) continue;

    // 1) 핸들 → 업로드 재생목록 ID (channels.list, 1유닛)
    const ch = await get(api(`channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}`));
    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) { console.warn("! 채널 못 찾음:", handle); continue; }

    // 2) 업로드 목록에서 영상 ID 수집 (playlistItems.list, 1유닛/페이지)
    let ids = [], pageToken = "";
    while (ids.length < MAX_PER_CHANNEL) {
      const pl = await get(api(`playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}` + (pageToken ? `&pageToken=${pageToken}` : "")));
      ids.push(...pl.items.map((i) => i.contentDetails.videoId));
      if (!pl.nextPageToken) break;
      pageToken = pl.nextPageToken;
    }
    ids.slice(0, MAX_PER_CHANNEL).forEach((id) => found.push({ videoId: id, memberId }));
  }

  // 3) 영상 상세 (제목/썸네일/조회수/게시일) 가져와 노래만 추리기 (videos.list, 50개당 1유닛)
  const idToMember = {};
  found.forEach((f) => (idToMember[f.videoId] = f.memberId));
  const allIds = Object.keys(idToMember);
  const results = [];

  for (let i = 0; i < allIds.length; i += 50) {
    const batch = allIds.slice(i, i + 50);
    const data = await get(api(`videos?part=snippet,statistics&id=${batch.join(",")}`));
    for (const it of data.items) {
      if (!isSong(it.snippet.title)) continue; // 노래 키워드 없는 영상 제외
      const t = it.snippet.thumbnails;
      results.push({
        videoId: it.id,
        memberId: idToMember[it.id] || "",
        title: it.snippet.title,
        thumbnail: (t.maxres || t.standard || t.high || t.medium || t.default).url,
        views: Number(it.statistics.viewCount || 0),
        date: toYM(it.snippet.publishedAt),
        url: "https://www.youtube.com/watch?v=" + it.id,
      });
    }
  }

  results.sort((a, b) => b.views - a.views);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2), "utf8");
  console.log(`✓ 완료: 노래 ${results.length}개 자동 발견 → data/videos.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
