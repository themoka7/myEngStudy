/* 과거분사 슬롯 드릴
 * p.p.는 사실상 세 자리에만 등장한다: 수동태 / 완료 / 명사수식.
 * 3단 변화표를 외우는 대신, 같은 동사를 세 슬롯에 밀어 넣어 자동화한다.
 * 뉴스 문장은 수동태와 현재완료 천지라 이 세 자리만 잡으면 독해가 확 풀린다.
 */
window.DATA = window.DATA || {};
window.DATA.pp = [
  { id: "p001", verb: ["write", "wrote", "written"], meaning: "쓰다",
    slots: [
      { type: "수동", ko: "그 보고서는 두 명의 연구자가 작성했다.", en: "The report was written by two researchers." },
      { type: "완료", ko: "그들은 이미 후속 보고서를 작성했다.", en: "They have already written a follow-up report." },
      { type: "수식", ko: "급하게 쓴 그 성명은 곧 철회되었다.", en: "The hastily written statement was soon withdrawn." }
    ] },
  { id: "p002", verb: ["take", "took", "taken"], meaning: "취하다, 데려가다",
    slots: [
      { type: "수동", ko: "즉시 조치가 취해졌다.", en: "Action was taken immediately." },
      { type: "완료", ko: "당국은 아직 아무 조치도 취하지 않았다.", en: "Authorities have not taken any action yet." },
      { type: "수식", ko: "지난주에 찍힌 사진들이 온라인에 올라왔다.", en: "Photos taken last week appeared online." }
    ] },
  { id: "p003", verb: ["give", "gave", "given"], meaning: "주다",
    slots: [
      { type: "수동", ko: "주민들에게는 30일의 기한이 주어졌다.", en: "Residents were given 30 days." },
      { type: "완료", ko: "위원회는 이미 승인을 내주었다.", en: "The committee has already given its approval." },
      { type: "수식", ko: "현재 주어진 자료로는 그 결론이 성립하지 않는다.", en: "The conclusion does not hold given the current data." }
    ] },
  { id: "p004", verb: ["break", "broke", "broken"], meaning: "깨다, 어기다",
    slots: [
      { type: "수동", ko: "그 기록은 세 번이나 깨졌다.", en: "The record was broken three times." },
      { type: "완료", ko: "협상은 두 차례 결렬된 바 있다.", en: "The talks have broken down twice." },
      { type: "수식", ko: "깨진 신뢰를 회복하는 데는 수년이 걸린다.", en: "Rebuilding broken trust takes years." }
    ] },
  { id: "p005", verb: ["hold", "held", "held"], meaning: "열다, 붙잡다",
    slots: [
      { type: "수동", ko: "그 회의는 비공개로 열렸다.", en: "The meeting was held behind closed doors." },
      { type: "완료", ko: "그 도시는 세 번이나 그 행사를 개최한 적이 있다.", en: "The city has held the event three times." },
      { type: "수식", ko: "오랫동안 유지되어 온 그 관행이 도마에 올랐다.", en: "The long-held practice came under scrutiny." }
    ] },
  { id: "p006", verb: ["lead", "led", "led"], meaning: "이끌다",
    slots: [
      { type: "수동", ko: "그 조사는 독립 위원회가 이끌었다.", en: "The inquiry was led by an independent panel." },
      { type: "완료", ko: "그 실패는 광범위한 개혁으로 이어졌다.", en: "The failure has led to sweeping reforms." },
      { type: "수식", ko: "정부 주도의 그 사업은 예산을 초과했다.", en: "The government-led project went over budget." }
    ] },
  { id: "p007", verb: ["drive", "drove", "driven"], meaning: "몰다, 이끌다",
    slots: [
      { type: "수동", ko: "그 성장은 해외 수요가 견인했다.", en: "The growth was driven by overseas demand." },
      { type: "완료", ko: "높은 비용이 소규모 업체들을 시장에서 밀어냈다.", en: "High costs have driven smaller firms out of the market." },
      { type: "수식", ko: "데이터 기반 접근이 표준이 되었다.", en: "A data-driven approach has become the standard." }
    ] },
  { id: "p008", verb: ["cut", "cut", "cut"], meaning: "줄이다, 자르다",
    slots: [
      { type: "수동", ko: "예산이 15퍼센트 삭감되었다.", en: "The budget was cut by 15 percent." },
      { type: "완료", ko: "중앙은행은 금리를 두 차례 인하했다.", en: "The central bank has cut rates twice." },
      { type: "수식", ko: "삭감된 예산으로는 그 계획을 감당할 수 없다.", en: "The cut budget cannot cover the plan." }
    ] },
  { id: "p009", verb: ["set", "set", "set"], meaning: "정하다, 세우다",
    slots: [
      { type: "수동", ko: "마감 기한은 6월로 정해졌다.", en: "The deadline was set for June." },
      { type: "완료", ko: "그 회사는 새로운 업계 기준을 세웠다.", en: "The company has set a new industry standard." },
      { type: "수식", ko: "정해진 절차가 지켜지지 않았다.", en: "The set procedures were not followed." }
    ] },
  { id: "p010", verb: ["bear", "bore", "borne"], meaning: "감당하다, 지다",
    slots: [
      { type: "수동", ko: "비용은 납세자가 부담했다.", en: "The cost was borne by taxpayers." },
      { type: "완료", ko: "소규모 기업들이 그 부담을 떠안아 왔다.", en: "Small businesses have borne the brunt of it." },
      { type: "수식", ko: "소비자가 떠안은 비용은 좀처럼 드러나지 않는다.", en: "Costs borne by consumers rarely show up." }
    ] },
  { id: "p011", verb: ["seek", "sought", "sought"], meaning: "구하다, 추구하다",
    slots: [
      { type: "수동", ko: "여러 차례 논평을 요청했으나 답을 받지 못했다.", en: "Comment was sought but not received." },
      { type: "완료", ko: "그 단체는 오랫동안 법 개정을 추진해 왔다.", en: "The group has long sought a change in the law." },
      { type: "수식", ko: "오랫동안 원하던 그 합의가 마침내 이루어졌다.", en: "The long-sought agreement was finally reached." }
    ] },
  { id: "p012", verb: ["spread", "spread", "spread"], meaning: "퍼지다, 퍼뜨리다",
    slots: [
      { type: "수동", ko: "그 허위 정보는 메신저 앱을 통해 퍼졌다.", en: "The false information was spread through messaging apps." },
      { type: "완료", ko: "그 여파가 다른 산업으로까지 번졌다.", en: "The fallout has spread to other industries." },
      { type: "수식", ko: "널리 퍼진 그 오해가 논쟁을 키웠다.", en: "The widely spread misunderstanding fueled the debate." }
    ] },
  { id: "p013", verb: ["prove", "proved", "proven"], meaning: "입증하다",
    slots: [
      { type: "수동", ko: "그 주장은 아직 입증되지 않았다.", en: "The claim has not been proven." },
      { type: "완료", ko: "그 접근법은 다른 도시에서 효과가 있는 것으로 드러났다.", en: "The approach has proven effective in other cities." },
      { type: "수식", ko: "검증된 방법이 더 안전한 선택이다.", en: "A proven method is the safer choice." }
    ] },
  { id: "p014", verb: ["shut", "shut", "shut"], meaning: "닫다",
    slots: [
      { type: "수동", ko: "그 시설은 무기한 폐쇄되었다.", en: "The facility was shut down indefinitely." },
      { type: "완료", ko: "그 회사는 공장 세 곳을 폐쇄했다.", en: "The company has shut three plants." },
      { type: "수식", ko: "폐쇄된 공장들은 방치된 채 남아 있다.", en: "The shut plants remain abandoned." }
    ] },
  { id: "p015", verb: ["hit", "hit", "hit"], meaning: "타격을 주다",
    slots: [
      { type: "수동", ko: "관광업이 가장 큰 타격을 입었다.", en: "Tourism was hit hardest." },
      { type: "완료", ko: "물가가 사상 최고치를 찍었다.", en: "Prices have hit a record high." },
      { type: "수식", ko: "큰 타격을 입은 지역들에 지원이 집중되었다.", en: "Aid was focused on the hardest-hit regions." }
    ] }
];
