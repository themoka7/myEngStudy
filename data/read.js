/* 청킹 리딩 — 긴 기사 문장을 의미 단위로 끊어 읽는 훈련
 * 왼→오른쪽 한 방향으로 읽고, 되돌아가지 않는다.
 * chunks[i] = { en, ko } 의미 덩어리 하나. 전체를 다 본 뒤 whole로 한 번에 다시 읽는다.
 */
window.DATA = window.DATA || {};
window.DATA.read = [
  { id: "r001", topic: "경제",
    whole: "The central bank, which had held rates steady for nearly a year, raised borrowing costs on Thursday in a move that surprised investors and sent the currency to its highest level in months.",
    chunks: [
      { en: "The central bank,", ko: "중앙은행은," },
      { en: "which had held rates steady for nearly a year,", ko: "거의 1년간 금리를 동결해 왔었는데," },
      { en: "raised borrowing costs on Thursday", ko: "목요일에 차입 비용을 인상했다" },
      { en: "in a move that surprised investors", ko: "투자자들을 놀라게 한 조치로" },
      { en: "and sent the currency to its highest level in months.", ko: "그리고 통화 가치를 몇 달 만의 최고치로 밀어 올렸다." }
    ],
    focus: "주어(The central bank)와 동사(raised) 사이에 관계절이 끼어든 형태. 관계절을 괄호로 묶고 건너뛰면 뼈대는 'The bank raised costs'뿐이다." },
  { id: "r002", topic: "기술",
    whole: "Researchers warned that the tool, trained on data collected before the policy took effect, could reinforce the very biases it was designed to detect.",
    chunks: [
      { en: "Researchers warned that the tool,", ko: "연구진은 경고했다, 그 도구가," },
      { en: "trained on data collected before the policy took effect,", ko: "정책 시행 전에 수집된 데이터로 학습되었기에," },
      { en: "could reinforce the very biases", ko: "바로 그 편향을 강화할 수 있다고" },
      { en: "it was designed to detect.", ko: "그것이 탐지하도록 설계된 (편향을)." }
    ],
    focus: "과거분사 두 개(trained / collected)가 각각 뒤에서 명사를 꾸민다. the very biases (that) it was designed to detect — 관계대명사 생략." },
  { id: "r003", topic: "사회",
    whole: "Cities that once relied on a single employer are now scrambling to attract new industries, a shift that has reshaped local politics as much as local economies.",
    chunks: [
      { en: "Cities that once relied on a single employer", ko: "한때 단일 고용주에 의존했던 도시들은" },
      { en: "are now scrambling to attract new industries,", ko: "이제 새 산업을 유치하려 분주하다," },
      { en: "a shift that has reshaped local politics", ko: "지역 정치를 바꿔 놓은 변화인데" },
      { en: "as much as local economies.", ko: "지역 경제만큼이나." }
    ],
    focus: "콤마 뒤 'a shift that...'은 앞 문장 전체를 받는 동격 명사구. 새 문장이 시작된 게 아니다." },
  { id: "r004", topic: "환경",
    whole: "Having missed its own targets three years in a row, the government announced a revised plan that critics say is even less likely to be met.",
    chunks: [
      { en: "Having missed its own targets three years in a row,", ko: "3년 연속으로 자체 목표를 달성하지 못한 채," },
      { en: "the government announced a revised plan", ko: "정부는 수정안을 발표했다" },
      { en: "that critics say", ko: "비판자들이 말하기로는" },
      { en: "is even less likely to be met.", ko: "달성 가능성이 더욱 낮은 (수정안을)." }
    ],
    focus: "완료 분사구문(Having p.p.)이 문두에서 배경을 깔고, 관계절 안에 'critics say'가 삽입됐다. that ... is의 주어는 plan." },
  { id: "r005", topic: "기업",
    whole: "The firm said it would delay the launch until next year, citing supply shortages that have plagued the industry since the pandemic.",
    chunks: [
      { en: "The firm said", ko: "그 회사는 밝혔다" },
      { en: "it would delay the launch until next year,", ko: "출시를 내년으로 미루겠다고," },
      { en: "citing supply shortages", ko: "공급 부족을 이유로 들면서" },
      { en: "that have plagued the industry since the pandemic.", ko: "팬데믹 이후 업계를 괴롭혀 온 (공급 부족을)." }
    ],
    focus: "citing은 분사구문으로 '이유를 대며'. 기사에서 근거를 붙일 때 쓰는 고정 장치다." },
  { id: "r006", topic: "정치",
    whole: "What began as a local dispute over zoning has grown into a national debate about who gets to decide how neighborhoods change.",
    chunks: [
      { en: "What began as a local dispute over zoning", ko: "용도지역을 둘러싼 지역 분쟁으로 시작된 것이" },
      { en: "has grown into a national debate", ko: "전국적 논쟁으로 번졌다" },
      { en: "about who gets to decide", ko: "누가 결정권을 갖는지에 관한" },
      { en: "how neighborhoods change.", ko: "동네가 어떻게 변할지를." }
    ],
    focus: "What으로 시작하는 명사절이 통째로 주어다. 동사는 has grown. 의문사절이 전치사 about의 목적어로 들어갔다." },
  { id: "r007", topic: "보건",
    whole: "Doctors who treated the first patients say the symptoms, though mild at first, often worsened within days, leaving little time for treatment.",
    chunks: [
      { en: "Doctors who treated the first patients say", ko: "초기 환자들을 치료한 의사들은 말한다" },
      { en: "the symptoms, though mild at first,", ko: "증상이, 처음엔 경미해도," },
      { en: "often worsened within days,", ko: "며칠 안에 악화되는 경우가 많았고," },
      { en: "leaving little time for treatment.", ko: "치료할 시간을 거의 남기지 않았다고." }
    ],
    focus: "though mild at first = though it was mild(주어+be 생략). 삽입구를 건너뛰면 the symptoms worsened." },
  { id: "r008", topic: "금융",
    whole: "Investors who had bet on a quick recovery were forced to unwind their positions, a move that accelerated the very decline they had hoped to avoid.",
    chunks: [
      { en: "Investors who had bet on a quick recovery", ko: "빠른 회복에 베팅했던 투자자들은" },
      { en: "were forced to unwind their positions,", ko: "포지션을 청산할 수밖에 없었고," },
      { en: "a move that accelerated the very decline", ko: "그것은 바로 그 하락을 가속한 움직임이었다" },
      { en: "they had hoped to avoid.", ko: "그들이 피하고 싶어 했던 (하락을)." }
    ],
    focus: "r003과 같은 동격 명사구 구조 + 과거완료(had bet, had hoped)로 시간 순서를 표시했다." }
];
