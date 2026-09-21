/* 문장 확장 드릴 — 긴 문장 공포를 없애는 핵심 훈련
 * 짧은 뼈대에서 시작해 한 겹씩 수식어를 붙인다.
 * 긴 문장은 '외울 덩어리'가 아니라 '짧은 결정 네 번'이라는 감각을 만든다.
 * steps[i].add = 이번 단계에서 새로 붙는 장치의 정체
 */
window.DATA = window.DATA || {};
window.DATA.expand = [
  { id: "e001", topic: "실적 발표",
    steps: [
      { ko: "매출이 늘었다.", en: "Revenue rose.", add: "뼈대: 주어 + 동사" },
      { ko: "매출이 12퍼센트 늘었다.", en: "Revenue rose 12 percent.", add: "증감 폭 (부사적 목적어)" },
      { ko: "매출이 3분기에 12퍼센트 늘었다.", en: "Revenue rose 12 percent in the third quarter.", add: "시간 전치사구" },
      { ko: "해외 수요에 힘입어, 매출이 3분기에 12퍼센트 늘었다.", en: "Driven by overseas demand, revenue rose 12 percent in the third quarter.", add: "분사구문(원인) — 문장 앞에 얹기" }
    ] },
  { id: "e002", topic: "규제 발표",
    steps: [
      { ko: "당국이 규정을 발표했다.", en: "Regulators announced new rules.", add: "뼈대" },
      { ko: "당국이 데이터 공유에 관한 새 규정을 발표했다.", en: "Regulators announced new rules on data sharing.", add: "명사 뒤 전치사구 (무엇에 관한 규정인지)" },
      { ko: "당국이 지난 화요일, 데이터 공유에 관한 새 규정을 발표했다.", en: "Regulators announced new rules on data sharing last Tuesday.", add: "시점" },
      { ko: "당국이 지난 화요일 데이터 공유에 관한 새 규정을 발표했는데, 이는 업계의 강한 반발을 불러왔다.", en: "Regulators announced new rules on data sharing last Tuesday, which drew strong pushback from the industry.", add: "계속적 용법 which — 문장 전체를 받는다" }
    ] },
  { id: "e003", topic: "사고 보도",
    steps: [
      { ko: "공장이 문을 닫았다.", en: "The plant shut down.", add: "뼈대" },
      { ko: "화재 이후 공장이 문을 닫았다.", en: "The plant shut down after a fire.", add: "시간 접속 전치사" },
      { ko: "지난달 두 번째로 점검을 통과하지 못한 그 공장이, 화재 이후 문을 닫았다.", en: "The plant, which failed inspection twice last month, shut down after a fire.", add: "주어 뒤 삽입 관계절 — 주어와 동사 사이를 벌린다" },
      { ko: "지난달 두 번째로 점검을 통과하지 못한 그 공장이 화재 이후 문을 닫으면서, 수백 명이 일자리를 잃었다.", en: "The plant, which failed inspection twice last month, shut down after a fire, leaving hundreds out of work.", add: "결과를 나타내는 분사구문 leaving" }
    ] },
  { id: "e004", topic: "연구 결과",
    steps: [
      { ko: "연구진이 연관성을 발견했다.", en: "Researchers found a link.", add: "뼈대" },
      { ko: "연구진이 수면과 기억력 사이의 연관성을 발견했다.", en: "Researchers found a link between sleep and memory.", add: "between A and B" },
      { ko: "2만 명 이상을 추적한 연구진이 수면과 기억력 사이의 연관성을 발견했다.", en: "Researchers who tracked more than 20,000 people found a link between sleep and memory.", add: "주어를 꾸미는 관계절 (who)" },
      { ko: "10년 동안 2만 명 이상을 추적한 연구진이, 그동안 과소평가되어 온 수면과 기억력 사이의 연관성을 발견했다.", en: "Researchers who tracked more than 20,000 people over a decade found a link between sleep and memory that had long been underestimated.", add: "목적어를 꾸미는 관계절 + 과거완료 수동" }
    ] },
  { id: "e005", topic: "기업 인수",
    steps: [
      { ko: "그 회사가 경쟁사를 인수했다.", en: "The company acquired a rival.", add: "뼈대" },
      { ko: "그 회사가 20억 달러에 경쟁사를 인수했다.", en: "The company acquired a rival for $2 billion.", add: "금액 for" },
      { ko: "그 회사가 현금 20억 달러에 소규모 경쟁사를 인수했다고 월요일에 밝혔다.", en: "The company said Monday that it had acquired a smaller rival for $2 billion in cash.", add: "said that 간접화법 — 시제를 한 칸 뒤로" },
      { ko: "그 회사는 아시아 사업을 확대하려는 움직임의 일환으로 현금 20억 달러에 소규모 경쟁사를 인수했다고 월요일에 밝혔다.", en: "The company said Monday that it had acquired a smaller rival for $2 billion in cash as part of a push to expand its Asian business.", add: "as part of + 목적을 담은 명사구" }
    ] },
  { id: "e006", topic: "정책 비판",
    steps: [
      { ko: "비판하는 사람들은 그 계획이 실패할 것이라고 말한다.", en: "Critics say the plan will fail.", add: "뼈대: say + that절" },
      { ko: "비판하는 사람들은 재원 없이는 그 계획이 실패할 것이라고 말한다.", en: "Critics say the plan will fail without funding.", add: "조건을 담은 전치사구 without" },
      { ko: "비판하는 사람들은 안정적인 재원이 없다면 그 계획이 실패할 것이라고 말한다.", en: "Critics say the plan will fail unless stable funding is secured.", add: "unless 절 — 전치사구를 절로 승급" },
      { ko: "이미 비슷한 시도가 무너지는 것을 지켜본 비판자들은, 안정적인 재원이 확보되지 않는 한 그 계획이 실패할 것이라고 말한다.", en: "Critics who have already watched similar efforts collapse say the plan will fail unless stable funding is secured.", add: "주어 관계절 + 지각동사 watch A 동사원형" }
    ] },
  { id: "e007", topic: "시장 반응",
    steps: [
      { ko: "주가가 하락했다.", en: "Shares fell.", add: "뼈대" },
      { ko: "발표 후 주가가 급락했다.", en: "Shares fell sharply after the announcement.", add: "정도 부사 + 시점" },
      { ko: "발표 후 주가가 급락해, 올해 상승분을 지워버렸다.", en: "Shares fell sharply after the announcement, wiping out this year's gains.", add: "결과 분사구문 wiping out" },
      { ko: "투자자들이 실적 전망을 소화하면서 발표 후 주가가 급락해, 올해 상승분을 대부분 지워버렸다.", en: "Shares fell sharply after the announcement as investors digested the earnings outlook, wiping out most of this year's gains.", add: "as 절(동시 진행) — 가운데에 끼워 넣기" }
    ] },
  { id: "e008", topic: "기술 도입",
    steps: [
      { ko: "병원들이 그 도구를 도입하고 있다.", en: "Hospitals are adopting the tool.", add: "뼈대: 현재진행" },
      { ko: "병원들이 진단 속도를 높이기 위해 그 도구를 도입하고 있다.", en: "Hospitals are adopting the tool to speed up diagnosis.", add: "to부정사 목적" },
      { ko: "인력 부족에 시달리는 병원들이 진단 속도를 높이기 위해 그 도구를 도입하고 있다.", en: "Hospitals struggling with staff shortages are adopting the tool to speed up diagnosis.", add: "현재분사 후치수식 — 주어를 뒤에서 꾸민다" },
      { ko: "인력 부족에 시달리는 병원들이 진단 속도를 높이기 위해 그 도구를 도입하고 있지만, 안전성 검증은 여전히 뒤처져 있다.", en: "Hospitals struggling with staff shortages are adopting the tool to speed up diagnosis, though safety testing still lags behind.", add: "though 양보절 — 뒤에 붙여 대조" }
    ] },
  { id: "e009", topic: "기후 보도",
    steps: [
      { ko: "기온이 올랐다.", en: "Temperatures rose.", add: "뼈대" },
      { ko: "기온이 평년보다 2도 높았다.", en: "Temperatures rose two degrees above average.", add: "비교 기준 above" },
      { ko: "지난 10년 동안 기온이 평년보다 2도 높았다.", en: "Temperatures have risen two degrees above average over the past decade.", add: "현재완료 — '지난 10년 동안'이 나오면 자동" },
      { ko: "40년 넘게 수집된 자료에 따르면, 지난 10년 동안 기온이 평년보다 2도 높아졌다.", en: "According to data collected over more than 40 years, temperatures have risen two degrees above average over the past decade.", add: "according to + 과거분사 후치수식(collected)" }
    ] },
  { id: "e010", topic: "인터뷰 인용",
    steps: [
      { ko: "그는 회사가 배웠다고 말했다.", en: "He said the company had learned.", add: "뼈대 + 시제 한 칸 뒤로" },
      { ko: "그는 회사가 실수에서 배웠다고 말했다.", en: "He said the company had learned from its mistakes.", add: "learn from" },
      { ko: "그는 한 인터뷰에서, 회사가 실수에서 배웠다고 말했다.", en: "In an interview, he said the company had learned from its mistakes.", add: "발화 상황을 문두로" },
      { ko: "그는 화요일 한 인터뷰에서, 회사가 실수에서 배웠지만 신뢰를 되찾는 데는 시간이 걸릴 것이라고 말했다.", en: "In an interview on Tuesday, he said the company had learned from its mistakes but that rebuilding trust would take time.", add: "but that — 두 번째 that절을 병렬로 이어 붙이기" }
    ] },
  { id: "e011", topic: "통계 해석",
    steps: [
      { ko: "실업률이 떨어졌다.", en: "Unemployment fell.", add: "뼈대" },
      { ko: "실업률이 3.2퍼센트로 떨어졌다.", en: "Unemployment fell to 3.2 percent.", add: "도달점 to" },
      { ko: "실업률이 3.2퍼센트로 떨어져, 4년 만의 최저치를 기록했다.", en: "Unemployment fell to 3.2 percent, the lowest level in four years.", add: "동격 명사구 — 콤마로 이어 붙이는 설명" },
      { ko: "실업률이 3.2퍼센트로 떨어져 4년 만의 최저치를 기록했지만, 임금 상승은 여전히 정체 상태다.", en: "Unemployment fell to 3.2 percent, the lowest level in four years, though wage growth remains flat.", add: "동격 + though 대조를 한 문장에" }
    ] },
  { id: "e012", topic: "보안 사고",
    steps: [
      { ko: "데이터가 유출되었다.", en: "Data was exposed.", add: "뼈대: 수동태" },
      { ko: "설정 오류로 데이터가 유출되었다.", en: "Data was exposed by a misconfiguration.", add: "행위자 by" },
      { ko: "수개월 동안 방치된 설정 오류로 데이터가 유출되었다.", en: "Data was exposed by a misconfiguration that went unnoticed for months.", add: "관계절 + go unnoticed 표현" },
      { ko: "수개월 동안 방치된 설정 오류로 수백만 건의 이용자 기록이 유출되었다고 회사는 금요일에 인정했다.", en: "The company acknowledged Friday that millions of user records had been exposed by a misconfiguration that went unnoticed for months.", add: "acknowledge that + 과거완료 수동 (had been p.p.)" }
    ] }
];
