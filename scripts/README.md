# 노래 데이터 자동 연동 (YouTube Data API)

직접 입력하는 건 **영상 ID + 멤버**뿐입니다. 제목·썸네일·조회수·게시일은 스크립트가 자동으로 채웁니다.

## 1. API 키 발급 (무료, 한 번만)
1. Google Cloud Console 접속 → 새 프로젝트 생성
2. "API 및 서비스" → **YouTube Data API v3** 사용 설정
3. "사용자 인증 정보" → **API 키** 만들기 → 키 복사

## 2. 영상 목록 작성
`scripts/songs.source.json` 을 열어 노래를 추가합니다.
영상 ID는 유튜브 주소에서 `watch?v=` 뒤의 값이에요.
예) `https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`** → 영상 ID는 `dQw4w9WgXcQ`

```json
[
  { "videoId": "dQw4w9WgXcQ", "memberId": "yuni" },
  { "videoId": "abcd1234EFG", "memberId": "hina" }
]
```
`memberId` 는 `public/js/data.js` 의 멤버 `id` 와 같아야 합니다 (yuni, hina, rin ...).

## 3. 스크립트 실행 (Node.js 18 이상 필요)
키는 환경변수로 넘깁니다. **코드나 깃에 키를 넣지 마세요.**

- Windows PowerShell: `$env:YOUTUBE_API_KEY="여기에_키"; node scripts/fetch-views.js`
- Windows cmd: `set YOUTUBE_API_KEY=여기에_키 && node scripts/fetch-views.js`
- Mac / Linux: `YOUTUBE_API_KEY=여기에_키 node scripts/fetch-views.js`

성공하면 `public/data/videos.json` 이 생성됩니다. 사이트는 이 파일이 있으면 자동으로 사용해요.

## 4. 로컬에서 확인할 때 주의
브라우저는 `file://` 로 직접 연 페이지에서는 `videos.json` 을 불러오지 못합니다(보안 정책).
간단한 로컬 서버로 열어야 해요:

```
python -m http.server 8000
```
그 뒤 브라우저에서 `http://localhost:8000/songs.html` 로 접속.
(VS Code의 "Live Server" 확장도 동일하게 동작합니다. GitHub Pages 배포 후에는 그냥 됩니다.)

`videos.json` 이 없거나 못 불러오면, 사이트는 `public/js/data.js` 의 샘플 노래로 자동 대체되어 깨지지 않습니다.

## 5. 자동 갱신 (GitHub Actions, 설정 완료)
`.github/workflows/update-youtube-data.yml` 워크플로우가 매일 KST 00:00에
`fetch-songs-auto.js`(신곡 자동 탐색) → `fetch-meta.js`(프로필/음반 썸네일)를
실행하고, 변경된 `public/data/videos.json` · `public/data/meta.json`을
자동으로 커밋·푸시합니다. `Actions` 탭에서 수동 실행(Run workflow)도 가능합니다.

**필수 설정**: GitHub 저장소 → Settings → Secrets and variables → Actions →
`New repository secret` → 이름 `YOUTUBE_API_KEY`, 값에 발급받은 API 키를 저장하세요.
이 시크릿이 없으면 워크플로우가 실패합니다(키를 코드에 직접 넣지 않기 위함).
