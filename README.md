# 스텔라이브 팬 사이트 (STELLIVE fan site)

## 프로젝트 개요
- **이름**: STELLIVE fan site (비공식 팬 사이트)
- **목표**: 버츄얼 유튜버 그룹 "스텔라이브" 소속 멤버들의 정보·노래·음반·굿즈를 한곳에서 볼 수 있는 팬 사이트
- **성격**: 순수 정적 사이트(HTML/CSS/Vanilla JS). 백엔드 API 없이 Cloudflare Pages Assets로 서빙됨

## 완료된 기능
- **메인(`/`)**: 히어로 섹션, 최신 뉴스, 멤버 미리보기(5명), 최신 음악 미리보기
- **멤버 목록(`/members`)**: 유닛별(전체/Everys/Universe/Cliché) 탭 필터링, 카드 클릭 시 상세 페이지 이동
- **멤버 상세(`/member?id=아이디`)**: 프로필, SNS 링크(YouTube/X/치지직), 대표곡(조회수순) 표시
- **노래(`/songs`)**: 멤버별 탭 + 정렬(조회수순/최신순), 실제 유튜브 데이터 285개 반영(`data/videos.json`)
- **음반(`/discography`)**: 타입별(오리지널/커버/단체곡/EP) 탭 필터 + 페이지네이션(8개/페이지)
- **굿즈(`/goods`)**: 굿즈 카드 목록(공식 판매처 링크 연결: 팬딩 스토어, 카카오 이모티콘 스토어 등) + **실제 상품 이미지 썸네일** 표시
- 공통: 반응형 레이아웃(모바일 햄버거 메뉴), 스크롤 등장 애니메이션(IntersectionObserver), 맨 위로 버튼
- **멤버 프로필 실제화**: 10명 전원 공식 사이트(stellive.me) 기준 실제 소개 문구·생일·치지직 채널로 갱신
- **뉴스 카드 실제화**: `stellive.me/news`의 실제 기사 4건(제목/날짜/썸네일 이미지/링크)으로 교체
- **앨범 썸네일 7개 연동**: STAR TRAIL, 마음악보, 유성우 등 실제 유튜브 영상ID를 매칭하여 썸네일/링크 활성화 (`data/meta.json` 갱신)
- **히어로 배너 리디자인**: 텍스트 영역 + 멤버 6인 원형 포토 콜라주 + 멤버/유닛/음반 통계 + 보조 CTA(음악 감상하기) 버튼을 갖춘 2단 레이아웃으로 개편 (기존 텍스트만 있던 단조로운 배너 개선)
- **YouTube 데이터 자동 갱신**: GitHub Actions 워크플로우(`update-youtube-data.yml`) 작성 완료 (현재 저장소 App 권한 제한으로 GitHub에는 미반영 상태 — 아래 '알려진 제한사항' 참고)
- **반응형 카드 레이아웃 개선 (Flexbox 기반)**: 멤버/노래/음반/굿즈/뉴스 카드 그리드(`.member-grid`, `.vgrid`, `.agrid`, `.ggrid`, `.news-grid`)를 CSS Grid `auto-fill`/`auto-fit`에서 **Flexbox(`flex-wrap` + `flex-basis` + `max-width`)** 로 전환. Grid의 `auto-fit`은 "완전히 빈 열"만 접어주기 때문에 마지막 줄에 카드가 1~2개만 남는 경우(예: 뉴스 4개, 멤버 5개)에는 그 카드가 늘어나지 못해 오른쪽에 큰 빈 공간이 남는 한계가 있었음. Flexbox로 바꾸면 같은 줄에 있는 카드끼리만 남는 공간을 나눠 가지므로 어떤 개수로 줄이 끝나도 자연스럽게 폭을 채움. `justify-content: center`로 마지막 줄이 한쪽으로 쏠리지 않고 중앙 정렬되도록 하고, 브레이크포인트(1024px/600px/380px)마다 `flex-basis`만 줄여 열 개수가 자연스럽게 결정되도록 함. 초소형 화면(320px)까지 가로 스크롤 없음을 Playwright로 검증

## URL 구조 (경로 및 파라미터)
| 경로 | 설명 |
|---|---|
| `/` | 메인 페이지 |
| `/members` | 멤버 전체 목록 |
| `/member?id={memberId}` | 멤버 상세 (예: `/member?id=yuni`) |
| `/songs` | 노래 목록 |
| `/discography` | 음반 목록 |
| `/goods` | 굿즈 목록 |
| `/data/videos.json` | 노래 데이터(정적 JSON, YouTube API로 수집됨) |
| `/data/meta.json` | 멤버 프로필 사진 / 일부 앨범 썸네일 URL(정적 JSON) |

## 데이터 구조 및 저장소
- **데이터 모델**: `public/js/data.js`에 `MEMBERS`(10명, 실제 소개 문구/생일/치지직 채널 반영 완료), `SONGS`(샘플), `ALBUMS`(4개 실제 videoId 연동), `GOODS`(실제 판매처 링크), `NEWS`(공식 뉴스 링크) 하드코딩 배열로 정의
- **동적 로드**: `public/js/main.js`가 페이지 로드 시 `data/videos.json`(실제 노래 285개), `data/meta.json`(프로필 사진 + 앨범 썸네일 4개)을 fetch로 불러와 `SONGS`/멤버 이미지를 자동 대체. 파일이 없으면 샘플 데이터로 자동 폴백
- **저장 방식**: 별도 DB 없이 정적 JSON 파일 기반 (Cloudflare D1/KV 미사용)
- **YouTube 데이터 자동 수집 스크립트** (`scripts/`, Node.js 18+, 로컬 실행 또는 GitHub Actions 자동 실행):
  - `fetch-views.js`: `scripts/songs.source.json`에 적어둔 영상ID 목록의 제목·조회수·썸네일을 채워 `public/data/videos.json` 생성
  - `fetch-songs-auto.js`: 멤버별 채널을 순회하며 "cover/music video" 키워드가 있는 영상을 자동 발견해 `public/data/videos.json` 생성
  - `fetch-meta.js`: 멤버 프로필 사진 + 음반 썸네일을 수집해 `public/data/meta.json` 생성
  - YouTube Data API v3 키가 필요하며, 환경변수로 전달(코드에 하드코딩 금지). 자세한 사용법은 `scripts/README.md` 참고
- **자동 갱신 워크플로우**: `.github/workflows/update-youtube-data.yml`이 매일 KST 00:00에 `fetch-songs-auto.js` → `fetch-meta.js`를 실행하고 변경사항을 자동 커밋·푸시. GitHub 저장소 Secrets에 `YOUTUBE_API_KEY` 등록 필요

## 사용 가이드
1. 메인 페이지에서 최신 소식과 멤버를 확인
2. "멤버" 메뉴에서 유닛별로 멤버를 필터링하고, 카드를 클릭하면 상세 프로필과 대표곡을 볼 수 있음
3. "노래" 메뉴에서 멤버별 탭과 정렬(조회수순/최신순)로 커버곡을 탐색
4. "음반" 메뉴에서 타입별로 필터링하며 음반을 넘겨볼 수 있음(페이지네이션)
5. "굿즈" 메뉴에서 진행 중인 굿즈 목록을 확인하고 공식 판매처로 이동

## 아직 구현되지 않은 기능 / 알려진 제한사항
- 굿즈/뉴스 이미지는 원본 사이트(stellive.me 등)의 외부 이미지 URL을 직접 참조 (자체 CDN에 이미지를 복사·호스팅하지는 않음 — 원본이 내려가면 깨질 수 있음)
- `SONGS`(대표곡 샘플 배열)는 일부 `url:"#"` 상태로 남아있음 (실제 노래 목록은 `data/videos.json`의 285개 데이터로 대체되어 노출됨)
- **GitHub Actions 워크플로우 파일(`update-youtube-data.yml`)이 GitHub 저장소에 미반영 상태**: 현재 연결된 GitHub App 토큰에 `workflows` 권한이 없어 push가 거부되어, 해당 파일만 저장소에서 제외한 채로 나머지 코드를 푸시함. 로컬 프로젝트 디렉터리에는 파일이 그대로 존재하므로, 저장소에 반영하려면 사용자가 직접 GitHub 웹에서 파일을 추가하거나 App에 workflows 권한을 부여한 뒤 재푸시 필요
- GitHub Actions 자동 갱신을 실제로 쓰려면 저장소에 `YOUTUBE_API_KEY` 시크릿 등록도 필요(사용자가 GitHub 저장소 설정에서 직접 등록해야 함)
- Cloudflare Pages 프로덕션 배포는 아직 진행하지 않음(요청 시 별도 진행)

## 다음 개발 단계 추천
1. `.github/workflows/update-youtube-data.yml`을 GitHub 저장소에 수동 추가하거나 App workflows 권한 부여 후 재푸시
2. GitHub 저장소에 `YOUTUBE_API_KEY` 시크릿 등록하여 자동 갱신 워크플로우 활성화
3. 굿즈/뉴스 이미지를 R2 등에 미러링하여 원본 링크 만료에 대비
4. 검색 기능, 다크모드 등 UX 개선 검토
5. (요청 시) Cloudflare Pages 프로덕션 배포 진행

## 기술 스택
- **프론트엔드**: Vanilla HTML/CSS/JS (Pretendard 폰트, CSS Grid, IntersectionObserver)
- **배포**: Cloudflare Pages (정적 에셋 서빙, Hono 워커는 `ASSETS` 바인딩으로 모든 요청을 정적 파일에 위임)
- **백엔드**: 없음 (완전 정적 사이트)
- **데이터 수집**: Node.js 스크립트 + YouTube Data API v3 (로컬/CI에서 수동 실행)

## 프로젝트 구조
```
webapp/
├── src/index.tsx        # Hono 워커: 모든 요청을 Pages ASSETS로 위임
├── public/
│   ├── index.html, members.html, member.html,
│   │   songs.html, discography.html, goods.html
│   ├── css/style.css
│   ├── js/data.js        # 정적 데이터(멤버/샘플곡/앨범/굿즈/뉴스)
│   ├── js/main.js        # 렌더링 + 라우팅 + 탭/정렬/페이지네이션 로직
│   └── data/
│       ├── videos.json   # 실제 유튜브 노래 데이터(285개)
│       └── meta.json     # 멤버 프로필 사진 등
├── scripts/               # YouTube 데이터 자동 수집용 Node 스크립트
│   ├── fetch-views.js
│   ├── fetch-songs-auto.js
│   ├── fetch-meta.js
│   ├── songs.source.json
│   └── README.md
├── .github/workflows/
│   └── update-youtube-data.yml   # 매일 자동 데이터 갱신 워크플로우
└── wrangler.jsonc
```

## 배포 상태
- **상태**: 로컬 샌드박스에서 정상 동작 확인 완료 (PM2 + wrangler pages dev), 모든 라우트 200 응답 + 콘솔 에러 0건 확인
- **GitHub**: [rekixia/stie-v1](https://github.com/rekixia/stie-v1) main 브랜치에 푸시 완료 (단, 워크플로 파일 1건 제외 — 위 제한사항 참고)
- **Cloudflare Pages 프로덕션 배포**: 미배포 (요청 시 진행 가능)
- **최종 업데이트**: 2026-07-06 (반응형 카드 레이아웃 개선)
