// =====================================================
//  data.js — 모든 데이터. 화면은 main.js가 자동으로 그립니다.
//
//  ▼ 자동 연동을 위해 "ID/핸들"만 넣으면 됩니다.
//    youtube : 채널 핸들 (예 "@AyatsunoYuni") → 링크 + 프로필 사진 자동
//    x       : X 핸들 (@ 없이, 예 "ayatsuno_yuni")
//    chzzk   : 치지직 채널 ID (주소 끝의 영숫자)
//    (비워두면 그 버튼은 링크가 비활성됩니다)
// =====================================================

const MEMBERS = [
  { 
    id:"yuni", nameKr:"아야츠노 유니", nameRoman:"Ayatsuno Yuni", unit:"Everys", gen:1, debut:"2023.01", 
    birthday:"12.21", color:"#e94b6a", 
    intro:"다른 유니콘들이 멸망을 향해갈 때, 홀로 봉인되어 있었던 유니. 시간이 지나 그녀는 어느 날 지구에서 눈을 뜨게 된다. 이후 보호를 위해 스텔라이브에 합류하여 인간 문화에 녹아든다. 타락할지, 순수함을 전해갈지는 유니의 선택에 맡겨졌다.", 
    youtube:"@ayatsunoyuni", x:"AyatsunoYuni", chzzk:"45e71a76e949e16a34764deb962f9d9f" 
  },
  { 
    id:"fuya", nameKr:"사키하네 후야", nameRoman:"Sakihane Fuya", unit:"Everys", gen:1, debut:"2025.09", 
    birthday:"07.07", color:"#5b6fd6", 
    intro:"한때 별이었던 마룡 후야. 세상의 끝에서 조용히 빛나던 후야는 시간이 흐르며 빛을 잃고 이름도 잊고 목소리도 사라진 채 끝없는 시공간을 홀로 떠돌던 존재였다. 그 오랜 침묵 끝에서 하나의 목소리가 들려왔다. 누군가 후야를 기억하고 있었고, 자신의 목소리를 기억해 준다면 다시 별이 될 수 있을 것이라 믿으며 그 목소리를 따라 문을 열고 스텔라이브에 도착하게 된다.", 
    youtube:"@Sakihanechannel", x:"SakihaneHuya", chzzk:"36ddb9bb4f17593b60f1b63cec86611d" 
  },
  { 
    id:"hina", nameKr:"시라유키 히나", nameRoman:"Shirayuki Hina", unit:"Universe", gen:2, debut:"2023.06", 
    birthday:"01.05", color:"#6fa8dc", 
    intro:"어렸을 적 히나의 꿈은 아이돌이었다. 유약한 성격 탓에 일찍이 꿈을 포기했지만, 친구의 제보로 본인의 노래 영상이 세상에 알려지게 되어 한 아이돌 프로덕션에 합류하게 된다. 팬들은 그녀를 '해둥이'라는 애칭으로 부른다.", 
    youtube:"@ShirayukiHina", x:"ShirayukiHina_", chzzk:"b044e3a3b9259246bc92e863e7d3f3b8" 
  },
  { 
    id:"mashiro", nameKr:"네네코 마시로", nameRoman:"Neneko Mashiro", unit:"Universe", gen:2, debut:"2023.06", 
    birthday:"02.22", color:"#b98cd6", 
    intro:"임무를 받고 지구로 내려와 자신의 행성인 고양이 동료들을 찾고 있는 마시로. 하지만 유일한 수단인 탐지기를 잃어버려 헤매던 중 스텔라이브를 발견하게 된다. 팬들은 그녀를 '마로'라는 애칭으로 부른다.", 
    youtube:"@neneko_mashiro", x:"NenekoMashiro", chzzk:"4515b179f86b67b4981e16190817c580" 
  },
  { 
    id:"lize", nameKr:"아카네 리제", nameRoman:"Akane Lize", unit:"Universe", gen:2, debut:"2023.06", 
    birthday:"10.01", color:"#ef5777", 
    intro:"아이돌을 동경해 흡혈 행위를 거의 하지 않는 혼혈 뱀파이어 리제. 흡혈을 하지 않고 음악을 더 좋아하는 모습에 성에서 멸시받으며 쫓겨나 스텔라이브에 합류하게 된다. 팬들은 그녀를 '피엔나'라는 애칭으로 부른다.", 
    youtube:"@AkaneLize", x:"AkaneLize", chzzk:"4325b1d5bbc321fad3042306646e2e50" 
  },
  { 
    id:"tabi", nameKr:"아라하시 타비", nameRoman:"Arahashi Tabi", unit:"Universe", gen:2, debut:"2023.06", 
    birthday:"09.07", color:"#f0a02e", 
    intro:"세상에서 제일 유명한 보물사냥꾼이 꿈인 타비. 여행 중 우연히 알게 된 하늘 도시의 보물을 훔쳐서 도망가는 도중에 길을 잃어버리게 되고, 하늘 도시의 영역에서 떨어져 스텔라이브에 도착하게 된다. 팬들은 그녀를 '뿡댕이'라는 애칭으로 부른다.", 
    youtube:"@ArahashiTabi", x:"ArahashiTabi", chzzk:"a6c4ddb09cdb160478996007bff35296" 
  },
  { 
    id:"shibuki", nameKr:"텐코 시부키", nameRoman:"Tenko Shibuki", unit:"Cliché", gen:3, debut:"2024.05", 
    birthday:"03.21", color:"#ff7a59", 
    intro:"천 년이 넘는 세월 동안 똑같은 일상을 보내던 여우신 시부키는 어느 날 신사에서 주인을 잃은 게임기를 발견하게 된다. 이후 게임에 빠져 게임 중독 히키코모리의 삶을 살지만, 본인을 찾아 신사에 오는 사람들을 외면할 수 없었다. 좋은 방법이 없을까 고민하던 찰나, 스텔라이브를 만나게 된다. 팬들은 그녀를 '이나리'라는 애칭으로 부른다.", 
    youtube:"@TenkoShibuki", x:"TenkoShibuki", chzzk:"64d76089fba26b180d9c9e48a32600d9" 
  },
  { 
    id:"rin", nameKr:"아오쿠모 린", nameRoman:"Aokumo Rin", unit:"Cliché", gen:3, debut:"2024.05", 
    birthday:"05.03", color:"#2fb6a0", 
    intro:"전 메이드 컨셉 지하 아이돌이었던 린은 컨셉을 제대로 소화하지 못해 그룹이 해체된다. 진심으로 사람을 모신다는 것에 대해 배우기 위해, 팬들을 주인님처럼 모시는 아이돌로서의 성공을 꿈꾸며 스텔라이브에 합류한다. 팬들은 그녀를 '쿠리미'라는 애칭으로 부른다.", 
    youtube:"@AokumoRin", x:"AokumoRin", chzzk:"516937b5f85cbf2249ce31b0ad046b0f" 
  },
  { 
    id:"nana", nameKr:"하나코 나나", nameRoman:"Hanako Nana", unit:"Cliché", gen:3, debut:"2024.05", 
    birthday:"08.07", color:"#ff9ec4", 
    intro:"에이전트 컴퍼니에서 근무하던 전 비밀요원 나나. 순간의 실수로 중대한 임무를 망쳐 현재 도망 중이다. 적에게 들키지 않고 살아가기 위해 숨어 살아가던 도중, 신분을 속여 스텔라이브에 합류하게 된다. 팬들은 그녀를 '페토'라는 애칭으로 부른다.", 
    youtube:"@hanako_nana", x:"HanakoNana", chzzk:"4d812b586ff63f8a2946e64fa860bbf5" 
  },
  { 
    id:"riko", nameKr:"유즈하 리코", nameRoman:"Yuzuha Riko", unit:"Cliché", gen:3, debut:"2024.05", 
    birthday:"04.13", color:"#f4c430", 
    intro:"이세계의 마왕을 물리치고 세상을 구한 용사 리코. 마왕을 물리친 대가로 소원을 빌어 이곳으로 오게 된다. 자신을 기억해주는 사람이 없으니 힘이 사라지는 것을 깨달은 리코는 다시 한 번 사람들을 구하는 용사가 되기 위해 스텔라이브에 들어가게 된다. 팬들은 그녀를 '치코'라는 애칭으로 부른다.", 
    youtube:"@YuzuhaRiko", x:"YuzuhaRiko", chzzk:"8fd39bb8de623317de90654718638b10" 
  }
];

// 노래 샘플 (videos.json 생기면 자동 교체)
const SONGS = [
  { videoId:"sample_yuni1", memberId:"yuni", title:"내꺼하는 법", views:12400000, date:"2023.11", url:"pkypi5nXSYM" },
  { videoId:"sample_hina1", memberId:"hina", title:"(대표곡 제목)", views:9800000, date:"2024.03", url:"#" },
  { videoId:"sample_yuni2", memberId:"yuni", title:"SUPADOPA", views:8700000, date:"2024.07", url:"#" },
  { videoId:"sample_rin1", memberId:"rin", title:"(대표곡 제목)", views:6400000, date:"2025.01", url:"#" },
  { videoId:"sample_yuni3", memberId:"yuni", title:"슈퍼삐질게하는법", views:5400000, date:"2025.11", url:"#" },
  { videoId:"sample_mashiro1", memberId:"mashiro", title:"악마가 아닌걸 (cover)", views:5200000, date:"2024.09", url:"#" },
  { videoId:"sample_lize1", memberId:"lize", title:"(대표곡 제목)", views:4100000, date:"2024.12", url:"#" },
  { videoId:"sample_riko1", memberId:"riko", title:"유성우", views:3600000, date:"2025.05", url:"#" },
  { videoId:"sample_shibuki1", memberId:"shibuki", title:"(대표곡 제목)", views:2800000, date:"2025.02", url:"#" },
  { videoId:"sample_tabi1", memberId:"tabi", title:"(대표곡 제목)", views:2100000, date:"2024.08", url:"#" },
  { videoId:"sample_nana1", memberId:"nana", title:"(대표곡 제목)", views:1900000, date:"2025.03", url:"#" },
  { videoId:"sample_fuya1", memberId:"fuya", title:"(대표곡 제목)", views:1500000, date:"2025.10", url:"#" },
];

// 음반: videoId 를 넣으면 썸네일·링크가 자동 연동됩니다 (없으면 color 블록 + link 사용)
const ALBUMS = [
  { title:"STAR TRAIL",   artist:"스텔라이브",     type:"EP",     date:"2026.05", color:"#14152b", videoId:"v094-E3Pmtk", link:"#" },
  { title:"마음악보",      artist:"Universe",      type:"단체곡",  date:"2026.06", color:"#6fa8dc", videoId:"yiprl7-dU04", link:"#" },
  { title:"내꺼 하는 법",    artist:"아야츠노 유니",     type:"오리지널",  date:"2023.07", color:"#7987e0", videoId:"pkypi5nXSYM", link:"#" },
  { title:"유성우",        artist:"Cliché",        type:"단체곡",  date:"2025.05", color:"#2fb6a0", videoId:"XR81lQrRceg", link:"#" },
  { title:"내꺼하는 법 (Aiobahn Remix)", artist:"아야츠노 유니", type:"오리지널", date:"2024.01", color:"#e94b6a", videoId:"8z-2uO9Cg2c", link:"https://www.youtube.com/watch?v=8z-2uO9Cg2c" },
  { title:"SUPADOPA",     artist:"아야츠노 유니",   type:"오리지널", date:"2024.06", color:"#ef5777", videoId:"R_RAWjqdgTs", link:"https://www.youtube.com/watch?v=R_RAWjqdgTs" },
  { title:"악마가 아닌걸", artist:"Riko x Mashiro", type:"커버",    date:"2026.05", color:"#b98cd6", videoId:"xKA5wKYMFhM", link:"https://www.youtube.com/watch?v=xKA5wKYMFhM" },
];

// 실제 공식 판매처(팬딩/카카오 이모티콘 스토어)로 연결되며, image 에 실제 상품/공지 이미지를 넣으면 카드에 표시됩니다.
const GOODS = [
  { name:"아야츠노 유니 생일 한정 굿즈", period:"2026.06.01 ~ 06.21", link:"https://stellive.me/news/11683", image:"https://stellive.me/files/attach/images/2026/05/21/067296f84a44331c857e20b83ad4dd11.png" },
  { name:"AKANE LIZE : OVT. 콘서트 MD", period:"2026.06.02 ~ 07.02", link:"https://stellive.me/news/12482", image:"https://stellive.me/files/attach/images/2026/07/02/acd03c3a367a3a12fd5e3c9ccaa75075.png" },
  { name:"Everys x 버터와플 콜라보", period:"2026.06.04 ~", link:"https://x.com/StelLive_kr/status/2059190339404247125", image:"https://pbs.twimg.com/media/HJOjWjeboAAs6wr.jpg:large" },
  { name:"STAR TRAIL 디지털 아트북 & 패키지", period:"2026.05.08 ~", link:"https://startrail.stellive.me/", image:"https://startrail.stellive.me/thumbnail.jpg" },
  { name:"스텔라이브 카카오 이모티콘", period:"상시 판매", link:"https://e.kakao.com/creator/0CGK4C", image:"https://item.kakaocdn.net/creator/0CGK4C?item=_91o0Kw4R-HEL4x-fg89El-wM20=&t=495291" },
  { name:"STELLIVE TIME TRAVEL: TERMINAL 5", period:"2026.01 ~ 03 (팝업스토어)", link:"https://fanding.kr/@stellive/post/174126/", image:"https://dcjnmis8jxmbl.cloudfront.net/upload/image/post/content/resize/2026/01/30/Shma8DveiQKNsCJ5.webp" },
];

// 실제 공식 뉴스 페이지(stellive.me/news) 기사로 연결되며, image 에 실제 기사 이미지가 표시됩니다.
const NEWS = [
  { title:"<AKANE LIZE : OVT. FIRST SOLO CONCERT> 현장 판매 MD 리스트 공개 및 운영 안내", date:"2026.07.02", link:"https://stellive.me/news/12482", image:"https://stellive.me/files/attach/images/2026/07/02/acd03c3a367a3a12fd5e3c9ccaa75075.png" },
  { title:"아카네 리제 첫 단독 콘서트 온라인 스트리밍 안내", date:"2026.06.24", link:"https://stellive.me/news/12350", image:"https://stellive.me/files/attach/images/2026/06/24/d2aa53d82ff4537baae496d7bd099aac.png" },
  { title:"아야츠노 유니 생일 한정 굿즈 판매 마감 임박", date:"2026.06.21", link:"https://stellive.me/news/12283", image:"https://stellive.me/files/attach/images/2026/06/21/ebab44701aa6f78b0832b5ff2a4fbfed.png" },
  { title:"아야츠노 유니 1st EP <슈퍼삐질게하는법> D-1", date:"2025.11.11", link:"https://stellive.me/news/8493", image:"https://stellive.me/files/attach/images/2025/11/11/eb6857d9233445c4e0afb199bb92fcac.jpg" },
];

function getMember(id) { return MEMBERS.find((m) => m.id === id); }
function formatViews(n) {
  if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, "") + "억";
  if (n >= 10000) return Math.round(n / 10000).toLocaleString("en-US") + "만";
  return n.toLocaleString("en-US");
}
