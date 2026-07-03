// =====================================================
//  fetch-views.js — YouTube Data API로 노래 정보를 가져와
//                   data/videos.json 을 자동 생성합니다.
//
//  내가 관리하는 것: scripts/songs.source.json (영상ID + memberId)
//  자동으로 채워지는 것: 제목 · 썸네일 · 조회수 · 게시일
//
//  실행 방법 (API 키는 환경변수로 전달 — 코드/깃에 절대 넣지 않기):
//    Windows(PowerShell): $env:YOUTUBE_API_KEY="키"; node scripts/fetch-views.js
//    Windows(cmd)       : set YOUTUBE_API_KEY=키 && node scripts/fetch-views.js
//    Mac/Linux          : YOUTUBE_API_KEY=키 node scripts/fetch-views.js
//
//  필요: Node.js 18 이상 (내장 fetch 사용 — 설치할 패키지 없음)
// =====================================================

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error("✗ 환경변수 YOUTUBE_API_KEY 가 없습니다. 위 주석의 실행 방법을 참고하세요.");
  process.exit(1);
}

const SRC = path.join(__dirname, "songs.source.json");
const OUT = path.join(__dirname, "..", "public", "data", "videos.json");

// "2024-07-15T..." → "2024.07"
function toYearMonth(iso) {
  return iso.slice(0, 7).replace("-", ".");
}

async function main() {
  // 1) 내가 적어둔 목록 읽기
  const source = JSON.parse(fs.readFileSync(SRC, "utf8"));

  // 영상ID → memberId 매핑 (중복 ID는 자동 제거)
  const idToMember = {};
  for (const row of source) {
    if (row.videoId && !row.videoId.startsWith("여기에")) idToMember[row.videoId] = row.memberId;
  }
  const ids = Object.keys(idToMember);
  if (ids.length === 0) {
    console.error("✗ songs.source.json 에 실제 영상 ID가 없습니다. '여기에_영상ID' 를 실제 ID로 바꿔주세요.");
    process.exit(1);
  }

  // 2) 50개씩 끊어서 API 호출 (videos.list = 호출당 1유닛)
  const results = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const url =
      "https://www.googleapis.com/youtube/v3/videos" +
      "?part=snippet,statistics&id=" + batch.join(",") +
      "&key=" + API_KEY;

    const res = await fetch(url);
    if (!res.ok) {
      console.error("✗ API 오류:", res.status, await res.text());
      process.exit(1);
    }
    const data = await res.json();

    // 3) 필요한 값만 뽑아 우리 형식으로 변환
    for (const it of data.items) {
      const t = it.snippet.thumbnails;
      results.push({
        videoId: it.id,
        memberId: idToMember[it.id] || "",
        title: it.snippet.title,
        thumbnail: (t.maxres || t.standard || t.high || t.medium || t.default).url,
        views: Number(it.statistics.viewCount || 0),
        date: toYearMonth(it.snippet.publishedAt),
        url: "https://www.youtube.com/watch?v=" + it.id,
      });
    }
  }

  // 4) 조회수순 정렬 후 저장
  results.sort((a, b) => b.views - a.views);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2), "utf8");

  console.log(`✓ 완료: ${results.length}개 영상 정보를 data/videos.json 에 저장했습니다.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
