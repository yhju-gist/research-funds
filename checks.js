// =====================================================================
//  접수 자동검사 규칙 (홈페이지와 런처가 같이 씁니다)
//  출처: 인수인계서(2026.8.3.) 비목별 구비서류·주의사항 = procedures.js의 tips·commonRules
//  숫자 기준을 바꾸려면 아래 LIMIT만 고치세요. (홈페이지 폴더에 있으니 고친 뒤 GitHub에도 다시 올립니다)
// =====================================================================
function GDCHECK_FACTORY(){
  const LIMIT = {
    directBuyMax: 5000000,      // 직접구매 500만원 '미만'만 가능
    sameVendorDays: 14,         // 같은 업체 2주 이내 구매 합산
    mealPerPerson: 18000,       // 야근식대 1인당 18,000원 이내
    mealAfter: "18:00",         // 평일 18:00 이후 원칙
    domesticSubmitDays: 3,      // 국내출장: 출장 후 3일 이내 증빙 제출
    overseasSubmitDays: 10,     // 국외출장: 식비·숙박비 개인카드 사용 시 출장 후 10일 이내 제출
    expertLeadDays: 14,         // 전문가활용신청서는 활용일 14일 이전 날짜
    expertFeeCap: { A:350000, B:300000, C:250000 }, // 자문료(1일, 제세포함) 상한
    meetingExternalMin: 1       // 회의비: 외부기관 참여자 1명 이상
  };

  // 비목별로 더 받는 칸 (홈페이지 '3. 내용' 아래에 자동으로 나타남)
  const PURCHASE = [
    {k:"vendor", label:"업체명", type:"text", ph:"예) ㈜○○사이언스"},
    {k:"quoteDate", label:"견적서 날짜", type:"date"},
    {k:"orderDate", label:"주문서 날짜", type:"date"},
    {k:"invoiceDate", label:"거래명세서 날짜", type:"date"},
    {k:"payDate", label:"카드 결제 날짜", type:"date"},
    {k:"orderer", label:"주문한 사람", type:"text"},
    {k:"inspector", label:"2차 검수자(거래명세서 서명)", type:"text"}
  ];
  const FIELDS = {
    "material": PURCHASE,
    "print": PURCHASE,
    "analysis": [ {k:"vendor", label:"분석기관(업체)명", type:"text"}, {k:"payDate", label:"결제 날짜", type:"date"} ],
    "domestic-trip": [ {k:"tripStart", label:"출장 첫날", type:"date"}, {k:"tripEnd", label:"출장 마지막 날", type:"date"} ],
    "overseas-trip": [ {k:"stage", label:"신청 단계", type:"select", options:["출장 가기 전(신청)","귀국 후(정산)"]},
                      {k:"tripEnd", label:"귀국일(출장 마지막 날)", type:"date"},
                      {k:"personalCard", label:"식비·숙박비를 개인카드로 냈나요?", type:"select", options:["아니요","예"]} ],
    "expert": [ {k:"useDate", label:"자문(활용) 날짜", type:"date"}, {k:"applyDate", label:"전문가활용신청서 날짜", type:"date"},
                {k:"grade", label:"전문가 등급", type:"select", options:["A","B","C","모름"]}, {k:"days", label:"활용 일수", type:"number", ph:"1"} ],
    "meeting": [ {k:"meetDate", label:"회의 날짜", type:"date"}, {k:"attendees", label:"전체 참석자 수", type:"number"}, {k:"external", label:"그중 외부기관 참석자 수", type:"number"} ],
    "overtime-meal": [ {k:"mealDate", label:"식사 날짜", type:"date"}, {k:"mealTime", label:"결제 시각", type:"time"}, {k:"people", label:"인원(명)", type:"number"} ]
  };

  const DAY=86400000;
  const d=s=>{ if(!s) return null; const m=String(s).match(/(\d{4})-(\d{1,2})-(\d{1,2})/); return m?new Date(+m[1],+m[2]-1,+m[3]):null; };
  const diff=(a,b)=>Math.round((d(b)-d(a))/DAY);               // b - a (일)
  const won=n=>Number(n).toLocaleString("ko-KR")+"원";
  const kd=s=>{ const x=d(s); return x?`${x.getMonth()+1}.${x.getDate()}.`:s; };
  const normV=v=>String(v||"").replace(/\s|\(주\)|㈜|주식회사|\(유\)|유한회사/g,"").toLowerCase();
  const num=v=>{ const n=Number(String(v==null?"":v).replace(/[^\d.]/g,"")); return isNaN(n)?0:n; };

  /**
   * typeId: procedures.js expenseTypes의 id
   * f: 추가 칸 값 {quoteDate:..}, ctx: {amount, payment, submitDate:"YYYY-MM-DD", history:[{id,vendor,date,amount}], selfId}
   * 반환: [{lv:"err"|"warn"|"ok"|"info", msg}]
   */
  function run(typeId, f, ctx){
    f=f||{}; ctx=ctx||{}; const out=[]; const amt=num(ctx.amount); const sub=ctx.submitDate;
    const E=m=>out.push({lv:"err",msg:m}), W=m=>out.push({lv:"warn",msg:m}), O=m=>out.push({lv:"ok",msg:m}), I=m=>out.push({lv:"info",msg:m});
    const isCard=/카드/.test(ctx.payment||"");

    if(typeId==="material"||typeId==="print"){
      if(f.quoteDate&&f.orderDate){ f.quoteDate===f.orderDate?O(`주문서 날짜 = 견적서 날짜 (${kd(f.orderDate)})`):E(`주문서 날짜(${kd(f.orderDate)})와 견적서 날짜(${kd(f.quoteDate)})가 다릅니다 — 같은 날짜여야 합니다`); }
      else I("견적서·주문서 날짜를 넣으면 같은 날인지 확인합니다");
      if(isCard){ if(f.invoiceDate&&f.payDate){ f.invoiceDate===f.payDate?O(`거래명세서 날짜 = 카드 결제 날짜 (${kd(f.payDate)})`):E(`거래명세서 날짜(${kd(f.invoiceDate)})와 카드 결제 날짜(${kd(f.payDate)})가 다릅니다 — 같은 날짜여야 합니다`); }
                  else I("거래명세서·카드 결제 날짜를 넣으면 같은 날인지 확인합니다"); }
      if(f.orderer&&f.inspector){ normV(f.orderer)===normV(f.inspector)?E("주문한 사람과 2차 검수자가 같습니다 — 다른 사람이어야 합니다"):O("주문자 ≠ 검수자"); }
    }
    if(["material","print","analysis"].includes(typeId)){
      if(amt>=LIMIT.directBuyMax) E(`금액 ${won(amt)} — 직접구매는 ${won(LIMIT.directBuyMax)} 미만만 가능합니다${typeId==="analysis"?" (500만원 미만으로 나눠 2주 간격 결제)":""}`);
      if(f.vendor && ctx.history){
        const base=f.payDate||sub; const same=ctx.history.filter(h=>h.id!==ctx.selfId && normV(h.vendor)===normV(f.vendor) && h.date && base && Math.abs(diff(h.date,base))<LIMIT.sameVendorDays+1);
        const sum=same.reduce((s,h)=>s+num(h.amount),0)+amt;
        if(same.length){ sum>LIMIT.directBuyMax?E(`같은 업체(${f.vendor}) 2주 이내 합계 ${won(sum)} — 500만원 초과로 지급처리 불가 (${same.map(h=>h.id+" "+won(num(h.amount))).join(", ")})`)
                                              :O(`같은 업체 2주 이내 다른 건 ${same.length}건 포함 합계 ${won(sum)} (500만원 이하)`); }
      } else if(f.vendor) I("같은 업체 2주 합산은 담당자 런처에서 확인합니다");
    }
    if(typeId==="domestic-trip"){
      if(f.tripStart&&f.tripEnd&&diff(f.tripStart,f.tripEnd)<0) E("출장 첫날이 마지막 날보다 늦습니다");
      if(f.tripEnd&&sub){ const n=diff(f.tripEnd,sub); n<0?I("출장 전 접수입니다 — 다녀온 뒤 증빙을 3일 안에 내 주세요"):n<=LIMIT.domesticSubmitDays?O(`출장 후 ${n}일째 제출 (3일 이내)`):W(`출장 후 ${n}일째 제출 — 국내출장은 3일 이내 제출이 원칙입니다. 늦은 이유를 사유서(붙임8)로 내야 할 수 있습니다`); }
      else I("출장 마지막 날을 넣으면 제출 기한(3일)을 확인합니다");
    }
    if(typeId==="overseas-trip"){
      if(f.stage==="귀국 후(정산)" && f.personalCard==="예"){
        if(f.tripEnd&&sub){ const n=diff(f.tripEnd,sub); n<=LIMIT.overseasSubmitDays?O(`귀국 후 ${n}일째 제출 (10일 이내)`):W(`귀국 후 ${n}일째 제출 — 개인카드 사용분은 10일 이내 제출이 원칙입니다`); }
        else I("귀국일을 넣으면 개인카드 사용분 10일 기한을 확인합니다");
      }
      if(f.stage==="출장 가기 전(신청)") I("항공료·여행자보험은 반드시 연구비카드로 결제(개인카드 불인정)");
    }
    if(typeId==="expert"){
      if(f.useDate&&f.applyDate){ const n=diff(f.applyDate,f.useDate); n>=LIMIT.expertLeadDays?O(`신청서가 활용일 ${n}일 전 날짜 (14일 이전)`):E(`신청서 날짜가 활용일 ${n}일 전입니다 — 활용일 14일 이전 날짜로 신청해야 합니다`); }
      else I("자문 날짜와 신청서 날짜를 넣으면 14일 기준을 확인합니다");
      const cap=LIMIT.expertFeeCap[f.grade], days=num(f.days)||1;
      if(cap&&amt){ const per=Math.round(amt/days); per<=cap?O(`1일 ${won(per)} — ${f.grade}급 상한 ${won(cap)} 이내`):E(`1일 ${won(per)} — ${f.grade}급 상한 ${won(cap)}(제세포함)을 넘습니다`); }
      I("동일기관·참여기관 소속 전문가의 자문은 불가합니다");
    }
    if(typeId==="meeting"){
      if(f.external!==undefined&&f.external!==""){ num(f.external)>=LIMIT.meetingExternalMin?O(`외부기관 참석자 ${num(f.external)}명`):E("외부기관 참석자가 없습니다 — 회의비는 외부기관 참여자 1명 이상이 필수입니다"); }
      else I("외부기관 참석자 수를 넣으면 확인합니다");
      if(f.attendees&&f.external&&num(f.external)>num(f.attendees)) E("외부 참석자 수가 전체 참석자 수보다 많습니다");
    }
    if(typeId==="overtime-meal"){
      const p=num(f.people);
      if(p&&amt){ const per=Math.round(amt/p); per<=LIMIT.mealPerPerson?O(`1인당 ${won(per)} (18,000원 이내)`):E(`1인당 ${won(per)} — 1인당 18,000원을 넘습니다`); }
      else I("인원을 넣으면 1인당 금액을 확인합니다");
      if(f.mealTime){ f.mealTime>=LIMIT.mealAfter?O(`결제 ${f.mealTime} (18:00 이후)`):W(`결제 ${f.mealTime} — 야근식대는 평일 18:00 이후 사용이 원칙입니다`); }
      if(f.mealDate){ const w=d(f.mealDate).getDay(); if(w===0||w===6) W(`${kd(f.mealDate)}은 주말입니다 — 야근식대는 평일 사용이 원칙입니다`); }
    }
    return out;
  }
  function summary(res){ const e=res.filter(x=>x.lv==="err").length, w=res.filter(x=>x.lv==="warn").length; return e?`❌${e}${w?" ⚠️"+w:""}`:w?`⚠️${w}`:res.some(x=>x.lv==="ok")?"✅":""; }
  return { LIMIT, FIELDS, run, summary };
}
window.GDCHECK = GDCHECK_FACTORY();
