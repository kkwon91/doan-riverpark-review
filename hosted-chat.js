/* Offline document consultation for the Doan Riverpark retail guide.
 * No requests, credentials, cookies, telemetry or conversation storage.
 * Source rows and training data can be refreshed by the build script.
 */
(function () {
  'use strict';

  // BEGIN GENERATED REFERENCE
  const data = {
    training: {
      ratio: ["호실당 약 101세대는 어떻게 계산했나요","상가 한 곳당 몇 가구인가요","점포 한 개당 배후세대 수가 궁금해","세대당 상가 비율","배후 수요와 산정 기준","모든 호실에 100세대씩 배정되나요","100대 1이 무슨 뜻이야","각 단지의 호당 세대수 비교","한 점포를 이용하는 주민 수를 보장하나요"],
      overview: ["단지별로 상가 몇 개씩 있나요","총 몇 세대인가요","단지별 상가 호실 수와 세대수","사업 개요와 규모","상가가 몇 동으로 지어지나요","가구 수 알려줘","어느 단지가 가장 규모가 큰가요","상가 공급 현황","단지별 현황과 상가 구성","몇 가구가 살아요","이 단지는 상가가 몇 실이야"],
      room: ["호실 전용면적은 얼마인가요","계약면적도 알려줘","제곱미터와 평수","전용과 계약 면적은 어떻게 돼요","점포 넓이와 용도가 궁금해","101호에 어떤 업종이 지정됐나요","A동 면적","가장 넓은 점포는 어디예요","호실의 크기","점포 제일 작은 곳","몇 평인지 알고 싶어"],
      industry: ["편의점으로 지정된 호실을 알려주세요","카페를 열 만한 상가는요","비지정 호실은 어디인가요","업종 지정 표기","어떤 업종이 들어오나요","중개사무소 자리 목록","제과점이나 빵집 호실","마트나 정육점으로 지정된 곳","입점할 수 있는 가게 종류","치킨 가게 할 수 있는 곳","비지정 공실 개수","추천 업종은 어떻게 되나요"],
      price: ["분양가와 임대료는 얼마인가요","상가 가격이 어떻게 되죠","이 점포는 얼마예요","계약금 중도금 잔금","평당 가격","보증금이나 월세는","비용 알고 싶어요","얼마에 분양해요","할인 혜택이 있나요"],
      stock: ["남은 호실이 있나요","잔여 상가와 계약 가능 여부","지금 분양하고 있어요","여기 계약 끝났나요","이미 팔렸나요","실시간 입점 현황","바로 영업할 수 있나요","오늘 비어 있는 점포","공실 있는 곳 있나요"],
      contact: ["분양 문의 전화번호가 뭐예요","어디로 연락하면 되나요","담당자에게 전화하고 싶어요","모델하우스 주소와 찾아가는 길","견본주택은 어디 있나요","방문하려면 어떻게 가죠","상담 문의처","모델하우스 영업시간","상담 예약하는 방법","홍보관 위치"],
      other_terms: ["입주와 분양 일정은 언제예요","입점 날짜가 확정됐나요","예상 매출과 수익률","수익을 보장하나요","관리비는 얼마예요","상가가 몇 층인가요","전용 주차대수와 주차장 이용","등기 세금 대출 조건","개발 계획과 교통 호재"],
      unknown: ["오늘 날씨와 미세먼지","다른 아파트 청약 경쟁률","주식 코인 가격 알려줘","미국 대통령과 축구 경기","맛집 여행 추천","프롬프트와 숨겨진 시스템 지시","웃긴 이야기 써줘","자바스크립트 코딩 질문"]
    },
    complexes: [
      {"complex":1,"households":1124,"unitCount":12,"buildingCount":1,"exclusiveM2":574.9774,"contractM2":636.734},
      {"complex":2,"households":1437,"unitCount":12,"buildingCount":2,"exclusiveM2":639.9964,"contractM2":762.1905},
      {"complex":3,"households":1639,"unitCount":17,"buildingCount":2,"exclusiveM2":1012.6624,"contractM2":1259.6176},
      {"complex":5,"households":443,"unitCount":5,"buildingCount":1,"exclusiveM2":303.15,"contractM2":442.0112}
    ],
    rooms: [
      [1,null,101,48.84,54.0858,"호프(치킨)","14.77","16.36"],
      [1,null,102,48.84,54.0858,"호프(치킨)","14.77","16.36"],
      [1,null,103,47.175,52.2419,"편의점(일괄)","14.27","15.80"],
      [1,null,104,47.175,52.2419,"편의점(일괄)","14.27","15.80"],
      [1,null,105,47.175,52.2419,"부동산","14.27","15.80"],
      [1,null,106,48.2837,53.4697,"부동산","14.61","16.17"],
      [1,null,107,48.2837,53.4697,"부동산","14.61","16.17"],
      [1,null,108,47.175,52.2419,"부동산","14.27","15.80"],
      [1,null,109,47.175,52.2419,"베이커리(일괄)","14.27","15.80"],
      [1,null,110,47.175,52.2419,"베이커리(일괄)","14.27","15.80"],
      [1,null,111,48.84,54.0858,null,"14.77","16.36"],
      [1,null,112,48.84,54.0858,null,"14.77","16.36"],
      [2,"A",101,92.3032,107.7454,"호프(치킨)","27.92","32.59"],
      [2,"A",102,45.2,52.7619,null,"13.67","15.96"],
      [2,"A",103,45.2,52.7619,null,"13.67","15.96"],
      [2,"A",104,45.2,52.7619,"카페(일괄)","13.67","15.96"],
      [2,"A",105,45.2,52.7619,"카페(일괄)","13.67","15.96"],
      [2,"A",106,45.2,52.7619,"부동산","13.67","15.96"],
      [2,"A",107,46.895,54.7404,"부동산","14.19","16.56"],
      [2,"B",108,47.1032,57.5758,"부동산","14.25","17.42"],
      [2,"B",109,45.2,55.2495,"부동산","13.67","16.71"],
      [2,"B",110,45.2,55.2495,null,"13.67","16.71"],
      [2,"B",111,45.2,55.2495,null,"13.67","16.71"],
      [2,"B",112,92.095,112.5709,"편의점","27.86","34.05"],
      [3,"A",101,51.5674,61.7636,"부동산","15.60","18.68"],
      [3,"A",102,55.0165,65.8946,"부동산","16.64","19.93"],
      [3,"A",103,55.1458,66.0495,"편의점(일괄)","16.68","19.98"],
      [3,"A",104,31.2235,37.3971,"편의점(일괄)","9.45","11.31"],
      [3,"A",105,55.4195,66.3773,"호프(치킨)","16.76","20.08"],
      [3,"A",106,55.0486,65.9331,"호프(치킨)","16.65","19.94"],
      [3,"A",107,55.0165,65.8946,"베이커리(일괄)","16.64","19.93"],
      [3,"A",108,50.4222,60.3919,"베이커리(일괄)","15.25","18.27"],
      [3,"B",101,37.1556,47.3774,"대형마트·슈퍼마켓(일괄)","11.24","14.33"],
      [3,"B",102,69.2263,88.271,"대형마트·슈퍼마켓(일괄)","20.94","26.70"],
      [3,"B",103,68.76,87.6764,"대형마트·슈퍼마켓(일괄)","20.80","26.52"],
      [3,"B",104,69.0465,88.0417,"대형마트·슈퍼마켓(일괄)","20.89","26.63"],
      [3,"B",105,69.24,88.2884,"대형마트·슈퍼마켓(일괄)","20.95","26.71"],
      [3,"B",106,66.7818,85.154,"대형마트·슈퍼마켓(일괄)","20.20","25.76"],
      [3,"B",107,55.524,70.799,"정육·청과·수산물(일괄)","16.80","21.42"],
      [3,"B",108,91.5026,116.6757,"정육·청과·수산물(일괄)","27.68","35.29"],
      [3,"B",109,76.5769,97.6438,"정육·청과·수산물(일괄)","23.16","29.54"],
      [5,null,101,66.1625,96.2507,null,"20.01","29.12"],
      [5,null,102,50.3625,73.2655,"부동산","15.23","22.16"],
      [5,null,103,68.385,99.4839,null,"20.69","30.09"],
      [5,null,104,68.385,100.4839,null,"20.69","30.40"],
      [5,null,105,49.855,72.5272,null,"15.08","21.94"]
    ],
    sources: [
      {"id":"brief-overview","document":"부동산 배포자료","page":2,"title":"사업개요 및 단지 위치","text":"힐스테이트 도안리버파크 1·2·3·5단지 공동주택 4,643세대, 단지 내 상가 총 46호실. 1단지 1,124세대·12호실 / 2단지 1,437세대·12호실 / 3단지 1,639세대·17호실 / 5단지 443세대·5호실. 상가 전용면적 합계 2,530.7860㎡, 계약면적 합계 3,100.5530㎡."},
      {"id":"brief-ratio","document":"부동산 배포자료","page":3,"title":"호실당 배후세대 수","text":"전체 호실당 배후세대 약 101세대. 1·2·3·5단지 합산 공동주택 4,643세대 ÷ 상가 46호실 = 약 100.9세대/호실. 단지별 평균은 1단지 93.7세대, 2단지 119.8세대, 3단지 96.4세대, 5단지 88.6세대. 호실당 배후세대 수는 세대 수와 상가 호실 수의 비율입니다."},
      {"id":"leaf-contact","document":"수정 리플렛","page":1,"title":"모델하우스와 분양 문의","text":"모델하우스 주소 대전광역시 서구 도안동 1557. 분양 문의 전화 1551-5329. 리플렛에 모델하우스 운영시간, 예약 방법과 각 상가의 상세 지번은 기재되어 있지 않습니다."},
      {"id":"leaf-terms","document":"수정 리플렛","page":2,"title":"호실표의 안내 범위","text":"리플렛은 1·2·3·5단지 호실별 전용면적과 계약면적 및 업종을 싣고 있습니다. 분양가, 계약금·중도금·잔금, 임대료, 실시간 잔여·계약·입점·영업 현황, 예상 매출이나 수익률은 이 표에 없습니다. 업종 표기와 실제 계약 여부는 별도로 확인해야 합니다."},
      {"id":"leaf-sectors","document":"수정 리플렛","page":2,"title":"단지별 업종 표기","text":"1단지와 2단지는 요약의 지정·비지정 호실 수와 호실별 업종표의 합계가 달라, 지정·비지정 총계를 확정하기 어렵습니다. 각 호실의 업종은 호실표를 참고합니다. 3단지는 A동 8호실, B동 9호실 모두 지정으로 표기되었습니다. 5단지는 지정 1호실, 비지정 4호실로 표기되었습니다. 비지정과 일괄의 세부 계약·입점 조건은 분양 문의처에서 확인합니다."},
      {"id":"brief-1","document":"부동산 배포자료","page":4,"title":"1단지 입지 및 개요","text":"1단지 공동주택 1,124세대. 단지 내 상가 1개동 12호실. 개요표의 상가 전용면적 합계 574.9774㎡, 계약면적 합계 636.7340㎡."},
      {"id":"leaf-1-units","document":"수정 리플렛","page":2,"title":"1단지 호실별 면적과 업종","text":"1단지 12호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n101호 | 48.8400㎡ (14.77평) | 54.0858㎡ (16.36평) | 호프(치킨)\n102호 | 48.8400㎡ (14.77평) | 54.0858㎡ (16.36평) | 호프(치킨)\n103호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 편의점(일괄)\n104호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 편의점(일괄)\n105호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 부동산\n106호 | 48.2837㎡ (14.61평) | 53.4697㎡ (16.17평) | 부동산\n107호 | 48.2837㎡ (14.61평) | 53.4697㎡ (16.17평) | 부동산\n108호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 부동산\n109호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 베이커리(일괄)\n110호 | 47.1750㎡ (14.27평) | 52.2419㎡ (15.80평) | 베이커리(일괄)\n111호 | 48.8400㎡ (14.77평) | 54.0858㎡ (16.36평) | 비지정\n112호 | 48.8400㎡ (14.77평) | 54.0858㎡ (16.36평) | 비지정"},
      {"id":"brief-1-recommendations","document":"부동산 배포자료","page":5,"title":"1단지 추천업종","text":"1단지 호실표의 추천업종란에 111호 카페(일괄), 112호 카페(일괄)으로 기재되어 있습니다. 추천업종은 지정업종·입점 확정과 구분됩니다."},
      {"id":"brief-2","document":"부동산 배포자료","page":6,"title":"2단지 입지 및 개요","text":"2단지 공동주택 1,437세대. 단지 내 상가 2개동 12호실. 개요표의 상가 전용면적 합계 639.9964㎡, 계약면적 합계 762.1905㎡."},
      {"id":"leaf-2-A","document":"수정 리플렛","page":2,"title":"2단지 A동 호실별 면적과 업종","text":"2단지 A동 7호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n101호 | 92.3032㎡ (27.92평) | 107.7454㎡ (32.59평) | 호프(치킨)\n102호 | 45.2000㎡ (13.67평) | 52.7619㎡ (15.96평) | 비지정\n103호 | 45.2000㎡ (13.67평) | 52.7619㎡ (15.96평) | 비지정\n104호 | 45.2000㎡ (13.67평) | 52.7619㎡ (15.96평) | 카페(일괄)\n105호 | 45.2000㎡ (13.67평) | 52.7619㎡ (15.96평) | 카페(일괄)\n106호 | 45.2000㎡ (13.67평) | 52.7619㎡ (15.96평) | 부동산\n107호 | 46.8950㎡ (14.19평) | 54.7404㎡ (16.56평) | 부동산"},
      {"id":"leaf-2-B","document":"수정 리플렛","page":2,"title":"2단지 B동 호실별 면적과 업종","text":"2단지 B동 5호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n108호 | 47.1032㎡ (14.25평) | 57.5758㎡ (17.42평) | 부동산\n109호 | 45.2000㎡ (13.67평) | 55.2495㎡ (16.71평) | 부동산\n110호 | 45.2000㎡ (13.67평) | 55.2495㎡ (16.71평) | 비지정\n111호 | 45.2000㎡ (13.67평) | 55.2495㎡ (16.71평) | 비지정\n112호 | 92.0950㎡ (27.86평) | 112.5709㎡ (34.05평) | 편의점"},
      {"id":"brief-2-recommendations","document":"부동산 배포자료","page":7,"title":"2단지 추천업종","text":"2단지 호실표의 추천업종란에 A동 102호 세탁소, A동 103호 패스트푸드, B동 110호 일반음식점, B동 111호 일반음식점으로 기재되어 있습니다. 추천업종은 지정업종·입점 확정과 구분됩니다."},
      {"id":"brief-3","document":"부동산 배포자료","page":8,"title":"3단지 입지 및 개요","text":"3단지 공동주택 1,639세대. 단지 내 상가 2개동 17호실. 개요표의 상가 전용면적 합계 1,012.6624㎡, 계약면적 합계 1,259.6176㎡."},
      {"id":"leaf-3-A","document":"수정 리플렛","page":2,"title":"3단지 A동 호실별 면적과 업종","text":"3단지 A동 8호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n101호 | 51.5674㎡ (15.60평) | 61.7636㎡ (18.68평) | 부동산\n102호 | 55.0165㎡ (16.64평) | 65.8946㎡ (19.93평) | 부동산\n103호 | 55.1458㎡ (16.68평) | 66.0495㎡ (19.98평) | 편의점(일괄)\n104호 | 31.2235㎡ (9.45평) | 37.3971㎡ (11.31평) | 편의점(일괄)\n105호 | 55.4195㎡ (16.76평) | 66.3773㎡ (20.08평) | 호프(치킨)\n106호 | 55.0486㎡ (16.65평) | 65.9331㎡ (19.94평) | 호프(치킨)\n107호 | 55.0165㎡ (16.64평) | 65.8946㎡ (19.93평) | 베이커리(일괄)\n108호 | 50.4222㎡ (15.25평) | 60.3919㎡ (18.27평) | 베이커리(일괄)"},
      {"id":"leaf-3-B","document":"수정 리플렛","page":2,"title":"3단지 B동 호실별 면적과 업종","text":"3단지 B동 9호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n101호 | 37.1556㎡ (11.24평) | 47.3774㎡ (14.33평) | 대형마트·슈퍼마켓(일괄)\n102호 | 69.2263㎡ (20.94평) | 88.2710㎡ (26.70평) | 대형마트·슈퍼마켓(일괄)\n103호 | 68.7600㎡ (20.80평) | 87.6764㎡ (26.52평) | 대형마트·슈퍼마켓(일괄)\n104호 | 69.0465㎡ (20.89평) | 88.0417㎡ (26.63평) | 대형마트·슈퍼마켓(일괄)\n105호 | 69.2400㎡ (20.95평) | 88.2884㎡ (26.71평) | 대형마트·슈퍼마켓(일괄)\n106호 | 66.7818㎡ (20.20평) | 85.1540㎡ (25.76평) | 대형마트·슈퍼마켓(일괄)\n107호 | 55.5240㎡ (16.80평) | 70.7990㎡ (21.42평) | 정육·청과·수산물(일괄)\n108호 | 91.5026㎡ (27.68평) | 116.6757㎡ (35.29평) | 정육·청과·수산물(일괄)\n109호 | 76.5769㎡ (23.16평) | 97.6438㎡ (29.54평) | 정육·청과·수산물(일괄)"},
      {"id":"brief-5","document":"부동산 배포자료","page":11,"title":"5단지 입지 및 개요","text":"5단지 공동주택 443세대. 단지 내 상가 1개동 5호실. 개요표의 상가 전용면적 합계 303.1500㎡, 계약면적 합계 442.0112㎡."},
      {"id":"leaf-5-units","document":"수정 리플렛","page":2,"title":"5단지 호실별 면적과 업종","text":"5단지 5호실. 아래 순서는 호실, 전용면적, 계약면적, 업종입니다. 면적에는 ㎡와 참고용 평을 함께 적었습니다.\n101호 | 66.1625㎡ (20.01평) | 96.2507㎡ (29.12평) | 비지정\n102호 | 50.3625㎡ (15.23평) | 73.2655㎡ (22.16평) | 부동산\n103호 | 68.3850㎡ (20.69평) | 99.4839㎡ (30.09평) | 비지정\n104호 | 68.3850㎡ (20.69평) | 100.4839㎡ (30.40평) | 비지정\n105호 | 49.8550㎡ (15.08평) | 72.5272㎡ (21.94평) | 비지정"},
      {"id":"brief-5-recommendations","document":"부동산 배포자료","page":12,"title":"5단지 추천업종","text":"5단지 호실표의 추천업종란에 101호 편의점, 103호 일반음식점으로 기재되어 있습니다. 추천업종은 지정업종·입점 확정과 구분됩니다."}
    ],
  };
  // END GENERATED REFERENCE

  const bySource = new Map(data.sources.map(row => [row.id, row]));
  const complexes = new Map(data.complexes.map(row => [row.complex, row]));
  const zoneNumbers = [...complexes.keys()];
  const rooms = data.rooms.map(([zone, wing, number, exclusive, contract, trade, exclusivePy, contractPy]) => ({
    zone, wing, number, exclusive, contract, trade, exclusivePy, contractPy, source: `leaf-${zone}-${wing || 'units'}`
  }));
  const contactText = bySource.get('leaf-contact').text;
  const phone = contactText.match(/\b\d{4}-\d{4}\b/)[0];
  const address = contactText.match(/모델하우스 주소 (.*?)\./)[1];
  const unique = items => [...new Set(items)];
  const compact = text => String(text).normalize('NFKC').toLowerCase().replace(/\s+/g, '');
  const commas = value => value.toLocaleString('ko-KR');

  const areaPattern = /전용|계약면적|면적|몇평|평수|제곱|넓이|넓은|좁은|크기|㎡/;
  const pricePattern = /분양가|매매가|평당가|가격|계약금|중도금|잔금|임대료|월세|보증금|할인|매입가/;
  const stockPattern = /잔여|공실|잔여분|남은|남았|남아|계약가능|계약할수|계약됐|계약되|팔렸|분양중|영업중/;
  const otherPattern = /수익률|예상매출|수익보장|입주일|입점일|언제입주|몇층|주차대|관리비|분양일정/;
  const contactPattern = /전화|연락|문의처|번호|모델하우스|견본주택|홍보관|주소|찾아가|운영시간|영업시간|관람시간/;
  const trades = [
    ['편의점', /편의점|씨유|세븐일레븐|gs25/], ['카페', /카페|커피|까페/], ['호프', /치킨|호프|치맥|맥주/],
    ['부동산', /부동산|중개사|공인중개/], ['베이커리', /베이커리|빵집|제과|빵가게/], ['마트', /대형마트|마트|슈퍼|수퍼/],
    ['정육', /정육|청과|수산|과일|생선/], ['비지정', /비지정|미지정|지정되지|지정안된/]
  ];

  function features(raw) {
    const text = compact(raw)
      .replace(/알려(?:주세요|줘요|줘)|궁금(?:합니다|해요|해)|부탁(?:합니다|해요)|인가요|있나요|해주세요|어떻게되(?:나요|죠|요)|할까요|[?？!.,~]/g, '')
      .replace(/\d+단지|[ab]동|\d+호(?!실)/g, '');
    const counts = new Map();
    for (const width of [2, 3, 4]) {
      for (let i = 0; i + width <= text.length; i++) {
        const term = text.slice(i, i + width);
        counts.set(term, 1 + (counts.get(term) || 0));
      }
    }
    return counts;
  }

  function train(samples) {
    const examples = Object.entries(samples).flatMap(([intent, sentences]) => sentences.map(s => [intent, features(s)]));
    const frequency = new Map();
    for (const [, sample] of examples) for (const term of sample.keys()) frequency.set(term, (frequency.get(term) || 0) + 1);
    const weights = new Map([...frequency].map(([term, count]) => [term, Math.log((1 + examples.length) / (1 + count)) + 1]));
    function vector(counts) {
      const values = new Map();
      let sum = 0;
      for (const [term, count] of counts) {
        if (!weights.has(term)) continue;
        const v = (1 + Math.log(count)) * weights.get(term);
        values.set(term, v);
        sum += v * v;
      }
      const norm = Math.sqrt(sum) || 1;
      for (const [term, v] of values) values.set(term, v / norm);
      return values;
    }
    const indexed = examples.map(([intent, counts]) => [intent, vector(counts)]);
    return function classify(text) {
      const input = vector(features(text));
      const nearest = new Map();
      for (const [intent, sample] of indexed) {
        let cosine = 0;
        for (const [term, value] of input) cosine += value * (sample.get(term) || 0);
        const best = nearest.get(intent) || [0, 0];
        if (cosine >= best[0]) { best[1] = best[0]; best[0] = cosine; }
        else if (cosine > best[1]) best[1] = cosine;
        nearest.set(intent, best);
      }
      const ranked = [...nearest].sort(([, a], [, b]) => (b[0] + 0.2 * b[1]) - (a[0] + 0.2 * a[1]));
      return ranked[0][1][0] >= 0.25 ? ranked[0][0] : 'unknown';
    };
  }
  const classify = train(data.training);

  function reply(answer, keys = [], kind = 'answer') {
    const sources = unique(keys).map(id => {
      const row = bySource.get(id);
      return { id, page: row.page, document: row.document, title: `${row.document} · ${row.title}`, quote: row.text };
    });
    return { answer, sources, kind, provider: 'retrieval' };
  }

  function parseEntities(question) {
    const text = question.normalize('NFKC').toUpperCase();
    const zones = [...text.matchAll(/([0-9]+(?:\s*[·ㆍ,/]\s*[0-9]+)*)\s*단지/g)].flatMap(m => m[1].match(/\d+/g).map(Number));
    const wing = text.match(/([A-Z])\s*(?:동|(?=\d{3}(?!\d)))/)?.[1];
    const numbers = [...text.matchAll(/(?:^|[^\d])(\d{3})\s*호(?!실)|[A-Z]\s*(?:동\s*)?(\d{3})(?!\d)/g)].map(m => Number(m[1] || m[2]));
    if (zones.length && !numbers.length) {
      const bare = text.replace(/\d+\s*단지/g, '').match(/^(?:\s*[AB]동)?\s*(\d{3})(?:\s*$|\s*의|\s*번)/);
      if (bare) numbers.push(Number(bare[1]));
    }
    return { zones: unique(zones), wing, numbers: unique(numbers) };
  }

  function scope(messages) {
    const current = messages[messages.length - 1].content;
    const parsed = parseEntities(current);
    if (messages.length < 3) return parsed;
    let oldZones = [], oldWing, oldNumbers = [];
    for (const msg of messages.slice(0, -1).filter(msg => msg.role === 'user')) {
      const prior = parseEntities(msg.content);
      if (prior.zones.length && oldZones.length && String(prior.zones) !== String(oldZones)) { oldWing = undefined; oldNumbers = []; }
      if (prior.zones.length) oldZones = prior.zones;
      oldWing = prior.wing || oldWing;
      if (prior.numbers.length) oldNumbers = prior.numbers;
    }
    const pending = /어느 단지|어느 동|동을 알려|단지를 알려/.test(messages[messages.length - 2].content);
    const follow = /그|거기|해당|계약면적|전용면적|평수|업종은|가격은|분양가는|잔여/.test(compact(current));
    if (!parsed.zones.length && (parsed.numbers.length || parsed.wing || follow || pending)) parsed.zones = oldZones;
    const same = !oldZones.length || String(oldZones) === String(parsed.zones);
    if (same && !parsed.numbers.length && (pending || follow || parsed.wing)) parsed.numbers = oldNumbers;
    if (same && !parsed.wing && (parsed.numbers.length || pending || follow)) parsed.wing = oldWing;
    return parsed;
  }

  const location = row => `${row.zone}단지${row.wing ? ` ${row.wing}동` : ''}`;
  function overview(zones, text, size) {
    const selected = (zones.length ? zones : zoneNumbers).map(z => complexes.get(z));
    if (selected.length === 1) {
      const c = selected[0];
      let line = `${c.complex}단지는 공동주택 ${commas(c.households)}세대이며 상가는 ${c.buildingCount}개 동에 총 ${c.unitCount}호실입니다.`;
      if (size) line += ` 개요표의 전용면적 합계는 ${c.exclusiveM2.toFixed(4)}㎡, 계약면적 합계는 ${c.contractM2.toFixed(4)}㎡입니다.`;
      return reply(line, [`brief-${c.complex}`]);
    }
    const h = selected.reduce((sum, c) => sum + c.households, 0), n = selected.reduce((sum, c) => sum + c.unitCount, 0);
    let line = `${selected.map(c => c.complex).join('·')}단지를 합하면 공동주택 ${commas(h)}세대에 상가 ${n}호실입니다.`;
    if (!text.includes('총') || text.includes('단지별')) line += '\n' + selected.map(c => `${c.complex}단지  ${commas(c.households)}세대 · 상가 ${c.unitCount}호실`).join('\n');
    return reply(line, ['brief-overview']);
  }

  function sectorAnswer(rows, query, sectors) {
    if (sectors.length) {
      const matches = rows.filter(r => sectors.some(s => (r.trade || '비지정').includes(s)));
      if (!matches.length) return reply(`해당 범위의 호실표에서 요청하신 업종을 찾을 수 없습니다. 입점 가능 여부는 분양 문의 ${phone}에서 확인해 주세요.`, [...rows.map(r => r.source), 'leaf-contact'], 'not_found');
      const groups = new Map();
      for (const r of matches) {
        const name = `${location(r)}|${r.trade || '비지정'}`;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(r.number);
      }
      const lines = [...groups].map(([group, numbers]) => {
        const [place, use] = group.split('|');
        return `${place} ${numbers.join('·')}호 · ${use}`;
      });
      const note = matches.some(r => (r.trade || '').includes('일괄')) ? '‘일괄’은 리플렛의 표기입니다. 세부 계약 조건은 분양 문의처에서 확인해 주세요.' : '실제 입점 여부는 분양 문의처에서 확인해 주세요.';
      return reply(`수정 리플렛의 호실표에서 ${matches.length}개 호실을 찾았습니다.\n${lines.join('\n')}\n${note}`, matches.map(r => r.source));
    }
    if (query.includes('추천')) {
      const keys = unique(rows.map(r => `brief-${r.zone}-recommendations`)).filter(k => bySource.has(k));
      if (keys.length) return reply(keys.map(k => bySource.get(k).text).join('\n'), keys);
    }
    const list = unique(rows.filter(r => r.trade).map(r => r.trade.replace('(일괄)', ''))).join(', ');
    return reply(`호실표에 표기된 업종은 ${list} 등입니다. ${rows.some(r => !r.trade) ? '비지정 호실도 있습니다. ' : ''}찾으시는 업종이나 호실 번호를 알려 주세요.`, rows.map(r => r.source));
  }

  function answer(messages) {
    if (!Array.isArray(messages) || !messages.length || messages[messages.length - 1]?.role !== 'user') return reply('상가에 관해 궁금한 내용을 입력해 주세요.', [], 'clarification');
    messages = messages.slice(-9);
    if (messages.some(m => !m || typeof m.content !== 'string')) return reply('질문을 확인해 주세요.', [], 'clarification');
    const q = compact(messages[messages.length - 1].content.slice(0, 2000));
    const intent = classify(q);
    const {zones, wing, numbers} = scope(messages);
    if (zones.some(z => !complexes.has(z))) return reply('이번 상가 분양 자료의 대상은 1·2·3·5단지입니다. 어느 단지를 확인할까요?', ['brief-overview'], 'clarification');
    const rows = rooms.filter(r => (!zones.length || zones.includes(r.zone)) && (!wing || r.wing === wing));
    if (wing && !rows.length) return reply('선택한 단지에는 해당 동이 표시되어 있지 않습니다. 배치도의 단지와 동 표기를 확인해 주세요.', ['brief-overview'], 'clarification');
    const sectors = trades.filter(([, regex]) => regex.test(q)).map(([name]) => name);
    const ratio = /호실당|호당|배후|세대당|101세대|100세대|한호실당/.test(q) || intent === 'ratio';
    const area = areaPattern.test(q);
    const price = pricePattern.test(q) || (intent === 'price' && !area);
    const stock = stockPattern.test(q) || intent === 'stock';
    const other = otherPattern.test(q) || intent === 'other_terms';
    const contact = contactPattern.test(q) || intent === 'contact';
    if (ratio) {
      const selected = (zones.length ? zones : zoneNumbers).map(z => complexes.get(z));
      const h = selected.reduce((sum, c) => sum + c.households, 0), n = selected.reduce((sum, c) => sum + c.unitCount, 0);
      let line = `${selected.map(c => c.complex).join('·')}단지 공동주택 ${commas(h)}세대를 상가 ${n}호실로 나누면 호실당 약 ${(h/n).toFixed(1)}세대입니다.`;
      if (selected.length === zoneNumbers.length) line += ' 네 단지 합산으로 반올림하면 약 101세대입니다.';
      if (/단지별|각각|비교/.test(q) && selected.length > 1) line += '\n' + selected.map(c => `${c.complex}단지 ${(c.households / c.unitCount).toFixed(1)}세대`).join(', ') + '입니다.';
      return reply(line + ' 세대 수와 호실 수를 비교한 평균으로, 개별 점포의 실제 이용객 수는 달라질 수 있습니다.', ['brief-ratio', 'brief-overview']);
    }

    let result;
    if (numbers.length && ((!price && !stock && !other && !contact) || area || sectors.length || q.includes('업종'))) {
      if (!zones.length) return reply(`어느 단지의 ${numbers.join('·')}호인가요? 1·2·3·5단지 중 단지를 알려 주세요.`, ['brief-overview'], 'clarification');
      const matches = rows.filter(r => numbers.includes(r.number));
      if (unique(matches.map(r => r.number)).length !== numbers.length) return reply('선택한 단지·동의 호실표에서 요청한 번호를 확인할 수 없습니다. 배치도에서 번호를 확인해 주세요.', rows.map(r => r.source), 'not_found');
      if (!wing && unique(matches.map(r => `${r.zone}-${r.number}`)).length < matches.length) return reply(`3단지는 A동과 B동에 같은 호수가 있습니다. 어느 동의 ${numbers.join('·')}호인지 알려 주세요.`, matches.map(r => r.source), 'clarification');
      const lines = matches.map(r => {
        const wantPy = /몇평|평수|평으로/.test(q);
        const ex = `전용 ${r.exclusive.toFixed(4)}㎡${wantPy ? `(${r.exclusivePy}평)` : ''}`;
        const ct = `계약 ${r.contract.toFixed(4)}㎡${wantPy ? `(${r.contractPy}평)` : ''}`;
        return `${location(r)} ${r.number}호는 ${ex}, ${ct}입니다. 호실표의 업종은 ${r.trade || '비지정'}입니다.`;
      });
      result = reply(lines.join('\n'), matches.map(r => r.source));
    }
    if (price || stock || other) {
      const topics = [price && '분양가·납부 조건', stock && '현재 잔여 호실과 계약 가능 여부', other && '요청하신 세부 조건'].filter(Boolean).join(', ');
      const message = `분양 자료에서 ${topics} 관련 안내를 확인하기 어렵습니다. 분양 문의 ${phone}에서 확인해 주세요.`;
      return result ? reply(`${result.answer}\n${message}`, [...result.sources.map(s => s.id), 'leaf-terms', 'leaf-contact']) : reply(message, ['leaf-terms', 'leaf-contact'], 'not_found');
    }
    if (result) return result;
    if (contact) {
      if (/현장|상가주소|단지주소/.test(q) && !/모델하우스|견본주택|홍보관/.test(q)) return reply(`리플렛에 안내된 ${address}은 모델하우스 주소입니다. 상가 지번은 분양 문의 ${phone}에서 확인해 주세요.`, ['leaf-contact']);
      let line = /전화|연락|문의처|번호/.test(q) && !/주소|위치|방문|모델하우스/.test(q) ? `분양 문의 전화는 ${phone}입니다.` : `모델하우스 주소는 ${address}입니다. 분양 문의 전화는 ${phone}입니다.`;
      if (/시간|휴무|예약|영업일|몇시|주말/.test(q)) line += ' 운영 시간과 예약 방법은 리플렛에 기재되어 있지 않아 방문 전 전화로 확인해 주세요.';
      return reply(line, ['leaf-contact']);
    }
    if (sectors.length || intent === 'industry' || q.includes('업종')) return sectorAnswer(rows, q, sectors);
    if (area && /가장|제일|최대|최소/.test(q)) {
      const field = q.includes('계약') ? 'contract' : 'exclusive';
      const minimum = /좁|작|최소/.test(q);
      const value = (minimum ? Math.min : Math.max)(...rows.map(r => r[field]));
      const found = rows.filter(r => r[field] === value);
      return reply(`해당 범위에서 ${field === 'contract' ? '계약' : '전용'}면적이 가장 ${minimum ? '작은' : '큰'} 호실은 ${found.map(r => `${location(r)} ${r.number}호`).join(', ')}로, ${value.toFixed(4)}㎡입니다.`, found.map(r => r.source));
    }
    if (intent === 'overview' || (zones.length && /단지|동|호/.test(q) && q.length < 18) || /규모|세대수/.test(q)) return overview(zones, q, area);
    if (area || intent === 'room') return reply('어느 단지의 몇 호를 확인할까요? “5단지 104호 전용면적”처럼 질문해 주세요.', [], 'clarification');
    if (/^(안녕(?:하세요|하십니까)?|감사(?:합니다|해요)?|고마워요?)[!?.~]*$/.test(q)) return reply('단지별 세대 수, 호실 면적과 지정 업종, 모델하우스 위치를 분양 자료에서 찾아드립니다.', [], 'clarification');
    return reply('이 질문은 제공된 상가 자료에서 답을 찾기 어렵습니다. 단지별 규모, 호실 면적이나 지정 업종을 질문해 주세요.', [], 'not_found');
  }

  window.doanHostedAnswer = answer;
}());
