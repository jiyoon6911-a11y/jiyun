export interface Experience {
  id: string;
  type: 'experience';
  categoryKo: string;
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface Award {
  id: string;
  type: 'award';
  categoryKo: string;
  title: string;
  description: string;
  organization: string;
  date: string;
}

export interface Skill {
  category: string;
  name: string;
  level: '상' | '중' | '하';
}

export const PROFILE = {
  name: "홍지윤",
  tagline: "사람과 사람을 연결하는 장(場)을 만들고 싶은 예비 문화 기획자 홍지윤입니다.",
  email: "wasabi0724@naver.com",
  phone: "010-7161-6911",
  instagram: "지더맥ꔛ (@jithemax.404)",
  instagramUrl: "https://www.instagram.com/jithemax.404",
  youtube: "지더맥",
  blog: "blog.naver.com",
  education: {
    university: "한림대학교",
    graduationState: "재학중 - 27년 2월 졸업예정",
    majors: [
      { type: "주전공", name: "디지털인문예술전공" },
      { type: "복수전공", name: "디지털미디어콘텐츠전공" }
    ]
  }
};

export const SKILLS: Skill[] = [
  { category: "영상", name: "Premiere Pro", level: "상" },
  { category: "영상", name: "After Effects", level: "중" },
  { category: "디자인", name: "Photoshop", level: "상" },
  { category: "디자인", name: "Illustrator", level: "하" },
  { category: "협업", name: "Figma", level: "하" },
  { category: "협업", name: "Notion", level: "중" },
  { category: "자격증", name: "MOS 2016 Master", level: "상" },
  { category: "AI", name: "바이브 코딩", level: "중" }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    type: "experience",
    categoryKo: "교내활동",
    title: "디지털인문예술전공 문화 콘텐츠 동아리 CON:NECT 회장",
    organization: "한림대학교 디지털인문예술전공",
    period: "2025년 6월 30일 → 2026년 12월 31일",
    description: "외부 활동 컨택, 동아리 프로젝트 기획 및 회의 진행"
  },
  {
    id: "exp-2",
    type: "experience",
    categoryKo: "현장실습",
    title: "25년 동계 현장실습 - 안녕하는사이",
    organization: "안녕하는사이",
    period: "2026년 1월 15일 → 2026년 2월 14일",
    description: "춘천 여행자를 위한 \"효자동 꼼지락 데이\" 기획 및 운영"
  },
  {
    id: "exp-3",
    type: "experience",
    categoryKo: "대외활동",
    title: "방배ART유스센터 기획단 ‘비비힐크루’ 서포터즈",
    organization: "방배art유스센터",
    period: "2025년 3월 7일 → 2025년 12월 31일",
    description: "초등학생부터 24세 청년 대상 연합 체험 프로그램, 정기 행사, 송년회 등을 기획·운영. 150여 명 규모의 동아리 및 기획단 활동을 총괄하며 프로그램 설계·조율·현장 운영까지 전반을 담당. (우수활동가 선정, 성실크루상 수상)"
  },
  {
    id: "exp-4",
    type: "experience",
    categoryKo: "대외활동",
    title: "2026 펜타 드리머 글로벌 팀장",
    organization: "경기일보, 펜타포트 운영 사무국",
    period: "2026년 5월 30일",
    description: ""
  },
  {
    id: "exp-5",
    type: "experience",
    categoryKo: "대외활동",
    title: "제9회 대한민국 청년의 날 콘서트 기획팀 (Me+Youth Festival)",
    organization: "사단법인청년과미래",
    period: "2025년 5월 16일 → 2025년 9월 27일",
    description: "콘서트에 맞는 아티스트 발굴 및 섭외, 행사 당일 예매자 데이터 관리 및 입장필찌 배부, 입장 동선 관리"
  },
  {
    id: "exp-6",
    type: "experience",
    categoryKo: "교내활동",
    title: "2025 한림대학교&달랏대학교 국제협력 AI 워크숍(HIVE Project)",
    organization: "한림대학교 SW중심대학사업단",
    period: "2025년 12월 23일 → 2025년 12월 30일",
    description: "베트남 달랏대학교(Dalat University)와 연계한 SW가치확산 프로그램의 일환인 국제협력 AI 워크숍. (한국어 교육, 달랏지역 AI 프로젝트 참여)"
  },
  {
    id: "exp-7",
    type: "experience",
    categoryKo: "대외활동",
    title: "제13회 자문밖문화축제 서포터즈",
    organization: "사단법인 자문밖문화포럼",
    period: "2025년 9월 4일",
    description: "개막 공연 사전 준비 및 VVIP 입장 발권"
  },
  {
    id: "exp-8",
    type: "experience",
    categoryKo: "교내활동",
    title: "2025 인사이트 해커톤",
    organization: "한림대학교 인문사회 융합인재양성사업단 (HUSS)",
    period: "2025년 8월 18일 → 2025년 8월 20일",
    description: "미래 사회가 직면할 주요 문제에 대한 혁신적이고 실질적인 해결책 프로젝트 팀장"
  },
  {
    id: "exp-9",
    type: "experience",
    categoryKo: "교내활동",
    title: "살고 싶은 정선, 가고 싶은 정선",
    organization: "한림대학교 인문사회 융합인재양성사업단 (HUSS)",
    period: "2025년 11월 6일 → 2025년 11월 8일",
    description: "정선군 관광 활성화 해커톤 참여(정선 아리락제 기획), 중·고등학생 해커톤 멘토"
  },
  {
    id: "exp-10",
    type: "experience",
    categoryKo: "교내활동",
    title: "2025 HUSS 지산학캠프",
    organization: "한림대학교 인문사회 융합인재양성사업단 (HUSS)",
    period: "2026년 1월 7일 → 2026년 1월 7일",
    description: "여수 캠프 아이디어 공모전 참여 (공감상 수상)"
  },
  {
    id: "exp-11",
    type: "experience",
    categoryKo: "교내활동",
    title: "디지털인문예술전공 문화 콘텐츠 동아리 DS4H 회장",
    organization: "한림대학교 디지털인문예술전공",
    period: "2026년 3월 12일 → 2026년 12월 31일",
    description: "자격증 스터디, 동아리 프로젝트 진행"
  },
  {
    id: "exp-12",
    type: "experience",
    categoryKo: "대외활동",
    title: "[제35회 춘천인형극제] 자원봉사단 코코미 2기",
    organization: "재단법인 춘천인형극제",
    period: "2023년 8월 16일 → 2023년 9월 6일",
    description: "축제운영, 공연장 관객 안내 보조, 축제장 관리 보조, 체험 및 워크숍 현장 보조, 퍼레이드 및 개막식 현장 안전보조"
  },
  {
    id: "exp-13",
    type: "experience",
    categoryKo: "대외활동",
    title: "supertone 대학생 ai 콘텐츠 파트너스",
    organization: "Supertone Play",
    period: "2025년 2월 3일 → 2025년 2월 28일",
    description: "Supertone Play의 AI 보이스를 활용해 매주 숏폼 콘텐츠를 기획·제작."
  },
  {
    id: "exp-14",
    type: "experience",
    categoryKo: "교내활동",
    title: "디지털인문예술전공 문화 콘텐츠 동아리 CON:NECT 부회장, 기획팀장",
    organization: "한림대학교 디지털인문예술전공",
    period: "2025년 3월 13일 → 2025년 6월 29일",
    description: "동아리 운영 기획, 정기 회의 주제 구성, ‘문화의 날’ 행사 기획 및 자료 준비."
  },
  {
    id: "exp-15",
    type: "experience",
    categoryKo: "대외활동",
    title: "26 강원도시재생 청년크리에이터",
    organization: "강원도시재생지원센터",
    period: "2026년 6월 5일",
    description: ""
  }
];

export const AWARDS: Award[] = [
  {
    id: "award-1",
    type: "award",
    categoryKo: "교내",
    title: "DAH 2024 - 2 기말프로젝트 전시회 우수상",
    description: "설화를 재해석해 ‘펫로스’를 주제로 븕은 실 이야기와 이시동도법을 활용한 시각 콘텐츠를 구성하여 깊은 공감과 메시지를 담은 프로젝트",
    organization: "한림대학교 SW중심대학사업단",
    date: "2024년 12월 5일"
  },
  {
    id: "award-2",
    type: "award",
    categoryKo: "교내",
    title: "2023학년도 덕후양성소 [덕업일치 프로젝트] 창직 경진 대회 3위",
    description: "\"온라인에 경사로를 설치하다’ 유니버설 다지인을 온라인 환경에 접목한 직업 ‘유니버셜 디자인 컨설턴트’ 창직",
    organization: "대학일자리플러스 / 대학혁신지원센터",
    date: "2025년 1월 23일"
  },
  {
    id: "award-3",
    type: "award",
    categoryKo: "교내",
    title: "DAH 2025 - 1 기말프로젝트 우수상",
    description: "버츄얼=AI라는 오해에서, 생성형 AI와 손잡고 협력해 버츄얼 아이돌 제작 프로젝트",
    organization: "한림대학교",
    date: "2025년 6월 5일"
  },
  {
    id: "award-4",
    type: "award",
    categoryKo: "교외",
    title: "2025 AI 에듀테크 소프트랩 해커톤 대상",
    description: "AI 저수율 알리미 : 실시간 저수율 데이터로 하는 강릉 가뭄 대비 서비스",
    organization: "교육부",
    date: "2025년 10월 29일"
  },
  {
    id: "award-5",
    type: "award",
    categoryKo: "교내",
    title: "제3회 디지털인문예술전공 전시회 포스터 공모전 우수상",
    description: "무한한 착시 계단 구조에 'DAH'를 결합하여 학문 간의 융합과 재구성되는 전공의 실험적 정체성을 표현",
    organization: "한림대학교 인문사회 융합인재양성사업단 (L-HUSS)",
    date: "2025년 12월 4일"
  },
  {
    id: "award-6",
    type: "award",
    categoryKo: "교내",
    title: "DAH 2025 - 2 기말프로젝트 우수상",
    description: "Ｃ to Z: Cㅓ넥트에서 Zㅣ역축제까지! - 축제 부스를 기획, 준비, 운영한 과정의 기록. 성공적인 부스 운영 경험과 성과 기록",
    organization: "한림대학교",
    date: "2025년 12월 4일"
  },
  {
    id: "award-7",
    type: "award",
    categoryKo: "교내",
    title: "DAH 2025 - 2 기말프로젝트 우수상",
    description: "API와 저수지방범대의 현장 기록으로 저수지 현황 데이터를 실시간으로 수집해 알림을 제공, 물 절약 인식을 확산해 가뭄 예방 프로젝트",
    organization: "한림대학교",
    date: "2025년 12월 4일"
  },
  {
    id: "award-8",
    type: "award",
    categoryKo: "교외",
    title: "비비힐크루서포터즈 우수활동자, 성실크루상",
    description: "비비힐크루서프토즈 활동가로서 비비힐크루의 동아리 기획단 자치기구가 하나의 공동체로 연합 할 수 있도록 기획과 운영을 맡아 청소년 간 소통과 유대감 형성에 크게 기여함",
    organization: "방배 ART 유스센터",
    date: "2025년 12월 27일"
  },
  {
    id: "award-9",
    type: "award",
    categoryKo: "교내",
    title: "H-SARA 베스트 수상자",
    description: "2025-2 [인간과AI공존시대 사고와표현] ",
    organization: "한림대학",
    date: "2025년 12월 27일"
  },
  {
    id: "award-10",
    type: "award",
    categoryKo: "교내",
    title: "2025 한림대학교&달랏대학교 국제협력 AI 워크숍- 지역문제 해결 프로젝트 2위",
    description: "달랏 야시장 AI 가이드, '달나마(Dal Na Ma)' 생성형 AI 기술을 활용하여, 여행자가 달랏 야시장에서 겪는 '가격 정보의 비대칭'과 '소통의 어려움'을 실시간으로 해결해 주는 스마트 트래블 컴패니언",
    organization: "한림대학교",
    date: "2025년 12월 30일"
  },
  {
    id: "award-11",
    type: "award",
    categoryKo: "교외",
    title: "HUSS 지산학 아카데미(여수) 비교과 아이디어 공모전 공감상",
    description: "블록체인 기반 모바일-웨어러블 연동형 해양 상생 플랫폼 YE:ON",
    organization: "HUSS",
    date: "2026년 1월 7일"
  },
  {
    id: "award-12",
    type: "award",
    categoryKo: "교내",
    title: "대학일자리플러스센터 커리어 인비다 아이디어 공모전 대상",
    description: "UXUI, 사용자 경험, 서부스 흐름 개선",
    organization: "한림대학교 대학생일자리 플러스센터",
    date: "2026년 4월 24일"
  },
  {
    id: "award-13",
    type: "award",
    categoryKo: "교내",
    title: "DAH 2026 - 1 기말프로젝트 최우수상",
    description: "403: Bypass",
    organization: "한림대학교",
    date: "2026년 6월 4일"
  }
];
