// =====================================================================
//  💬 연구비 도우미 (오른쪽 아래) — 인터넷·AI 서버 없이 이 페이지 안에서만 동작
//  지식: kb.js(규정 판정요지) + procedures.js(비목별 준비물·주의) + checks.js(숫자 기준)
//  답을 못 찾으면 담당자 연락처로 안내합니다. 입력한 질문은 어디에도 보내지 않습니다.
// =====================================================================
(function(){
  const GD=window.GD||{}, KB=(window.RFKB&&window.RFKB.rows)||[], S=window.SITE||{};
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const norm=s=>String(s||"").toLowerCase().replace(/[\s?!.,~'"“”‘’()·\-]/g,"");
  const bigr=s=>{ const t=norm(s), o=new Set(); for(let i=0;i<t.length-1;i++) o.add(t.slice(i,i+2)); return o; };
  const STOP=new Set(["되나","되나요","가능","가능한가요","해도","하나요","어떻게","뭐","무엇","있나요","인가요","어디","언제","까지","했는데","했어요","해요","요"].map(norm));

  // 비목 카드 → 질문 항목
  const TYPE_KW={material:["재료비","시약","소모품","재료","실험용품","구매"],print:["유인물","인쇄","사무용품","복사","포스터","명함","제본"],postage:["우편","택배","배송","발송"],analysis:["시험분석","분석료","분석 의뢰","외부 분석"],
    "domestic-trip":["국내출장","국내 출장","ktx","기차","숙박","출장비"],"overseas-trip":["국외출장","해외출장","해외 출장","항공권","학회 출장","여행자보험"],expert:["전문가","자문료","강사료","자문","강연료"],
    eqi:["공동장비","중앙기기","분석료 대체","청구서"],refund:["반납","입금","차액"],meeting:["회의비","회의","식사","다과","회의록"],conference:["학회등록","등록비","연회비","학회비","학회"],
    publication:["논문게재","게재료","교정료","영문교정","논문"],"overtime-meal":["야근","야근식대","특근","저녁"],labnote:["연구노트"],etc:["사유서","기타"]};
  const types=(GD.expenseTypes||[]).map(e=>({id:e.id,name:e.name,kw:(TYPE_KW[e.id]||[]).concat([e.name.split(" (")[0]]),e}));

  function scoreText(q,kws,text,one){
    const nq=norm(q); let s=0, mx=0;
    for(const k of kws){ const nk=norm(k); if(!nk||STOP.has(nk)) continue; if(nq.includes(nk)){ const v=2+Math.min(nk.length,6)/2; s+=v; mx=Math.max(mx,v); } }
    if(one) s=mx; // 비목 카드는 가장 잘 맞는 낱말 하나만 (재료·재료비 이중 계산 방지)
    const A=bigr(q), B=bigr(kws.join(" ")+" "+(text||"")); let inter=0; A.forEach(x=>{ if(B.has(x)) inter++; });
    s+=A.size?2*inter/A.size:0; return s;
  }
  function answer(q){
    const cand=[];
    KB.forEach((r,i)=>cand.push({k:"kb",i,s:scoreText(q,r.kw,"")}));
    types.forEach(t=>cand.push({k:"type",t,s:scoreText(q,t.kw,"",true)*0.9}));
    cand.sort((a,b)=>b.s-a.s);
    const best=cand[0];
    if(!best||best.s<2.2) return {miss:true, more:cand.slice(0,3).filter(c=>c.s>0.8)};
    return {best, more:cand.slice(1,4).filter(c=>c.s>=Math.max(2,best.s*0.6))};
  }
  const vTag=v=>/불가/.test(v)?'<span class="rfv no">❌ 안 돼요</span>':/조건/.test(v)?'<span class="rfv mid">⚠️ 조건부</span>':/가능/.test(v)?'<span class="rfv ok">✅ 돼요</span>':"";
  function typeHtml(t){
    const e=t.e, need=(GD.docNeed&&GD.docNeed[e.id])||[];
    const docs=e.docs.map((d,i)=>{ const n=String(need[i]||"필수"); const tag=/^(필수|신청|귀국|필수또는입력)/.test(n)?"필수":/해당시/.test(n)?"해당 시":/입력/.test(n)?"칸에 적기":"선택"; return `<li><b>[${tag}]</b> ${esc(d)}</li>`; }).join("");
    const tips=e.tips.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join("");
    return `<div><b>${e.icon} ${esc(e.name)} — 준비물</b><ul>${docs}</ul>${tips?`<b>주의</b><ul>${tips}</ul>`:""}<button type="button" class="rfgo" data-go="${e.id}">이 비목으로 요청하기 ▸</button></div>`;
  }
  function kbHtml(r){
    const t=r.t&&types.find(x=>x.id===r.t);
    return `<div>${vTag(r.v)} ${esc(vTag(r.v)?String(r.a).replace(/^\s*[❌⚠️✅]+\s*/u,""):r.a)}${r.c?`<div class="rfsrc">근거: ${esc(r.c)}</div>`:""}${t?`<button type="button" class="rfgo" data-go="${t.id}">${esc(t.e.icon+" "+t.name.split(" (")[0])}로 요청하기 ▸</button>`:""}</div>`;
  }
  const titleOf=c=>c.k==="type"?c.t.e.icon+" "+c.t.name:KB[c.i].kw[0];
  function render(q){
    const r=answer(q); let h="";
    if(r.miss){
      h=`<div>음… 이 질문은 제가 가진 자료로 확실히 답하기 어려워요. 🙏<br>다른 말로 다시 물어보시거나, 담당자에게 직접 물어봐 주세요.${S.officeEmail&&!/^\[/.test(S.officeEmail)?`<br>📧 <a href="mailto:${esc(S.officeEmail)}">${esc(S.officeEmail)}</a>`:""}${S.officeTel&&!/^\[/.test(S.officeTel)?` · ☎ ${esc(S.officeTel)}`:""}</div>`;
    } else h=r.best.k==="type"?typeHtml(r.best.t):kbHtml(KB[r.best.i]);
    if(r.more&&r.more.length) h+=`<div class="rfmore">혹시 이런 질문인가요? ${r.more.map(c=>`<button type="button" class="rfchip" data-ask="${esc(titleOf(c))}">${esc(titleOf(c))}</button>`).join("")}</div>`;
    return h;
  }

  // ---------- 화면 ----------
  const css=`.rfbtn{position:fixed;right:16px;bottom:88px;z-index:60;border:0;border-radius:999px;background:#1e3a8a;color:#fff;font-weight:800;font-size:18px;padding:14px 20px;box-shadow:0 6px 18px rgba(0,0,0,.22);cursor:pointer}
  .rfbtn:focus-visible{outline:3px solid #93c5fd}
  .rfpan{position:fixed;right:16px;bottom:88px;z-index:61;width:min(460px,calc(100vw - 32px));height:min(700px,calc(100vh - 40px));bottom:20px;background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;border:1px solid #e5e7eb}
  .rfpan[hidden]{display:none}.rfhd{background:#1e3a8a;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:8px}.rfhd b{flex:1;font-size:19px}.rfhd button{background:transparent;border:0;color:#fff;font-size:24px;cursor:pointer}
  .rflog{flex:1;overflow:auto;padding:12px;background:#f8fafc;font-size:17px;line-height:1.6}.rfm{margin:0 0 10px;max-width:92%;padding:9px 12px;border-radius:14px;background:#fff;border:1px solid #e5e7eb}.rfm.me{margin-left:auto;background:#dbeafe;border-color:#bfdbfe}
  .rfm ul{margin:4px 0 6px;padding-left:18px}.rfsrc{margin-top:6px;font-size:14px;color:#6b7280}.rfmore{margin-top:8px;font-size:15px;color:#4b5563}
  .rfchip{display:inline-block;margin:3px 4px 0 0;border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:6px 12px;font-size:15.5px;cursor:pointer}
  .rfgo{display:block;margin-top:8px;border:0;background:#16a34a;color:#fff;border-radius:10px;padding:10px 14px;font-size:16px;font-weight:700;cursor:pointer}
  .rfv{font-weight:800}.rfv.no{color:#b91c1c}.rfv.mid{color:#b45309}.rfv.ok{color:#15803d}
  .rfin{display:flex;gap:6px;padding:10px;border-top:1px solid #e5e7eb;background:#fff}.rfin input{flex:1;border:1px solid #cbd5e1;border-radius:10px;padding:12px;font-size:17px}.rfin button{border:0;background:#1e3a8a;color:#fff;border-radius:10px;padding:0 18px;font-size:17px;font-weight:700;cursor:pointer}
  .rfnote{font-size:13px;color:#6b7280;padding:0 12px 8px;background:#fff}
  @media (max-width:560px){.rfpan{right:8px;left:8px;width:auto;bottom:80px;height:min(62vh,560px);bottom:10px}.rfbtn{right:10px;bottom:84px;padding:11px 14px}}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
  const btn=document.createElement("button"); btn.type="button"; btn.className="rfbtn"; btn.id="rfBtn"; btn.setAttribute("aria-label","연구비 도우미 열기"); btn.textContent="💬 연구비 도우미";
  const pan=document.createElement("section"); pan.className="rfpan"; pan.id="rfPan"; pan.hidden=false; pan.setAttribute("aria-label","연구비 도우미");
  pan.innerHTML=`<div class="rfhd"><b>💬 연구비 도우미</b><button type="button" id="rfX" aria-label="닫기">✕</button></div>
    <div class="rflog" id="rfLog" aria-live="polite"></div>
    <div class="rfnote">규정 요약 안내예요. 최종 판단은 담당자·연구관리팀이 해요. 질문은 어디에도 저장·전송되지 않아요.</div>
    <form class="rfin" id="rfForm"><input id="rfQ" placeholder="예) 회의비 서류 뭐 내요?" autocomplete="off" aria-label="질문"><button>묻기</button></form>`;
  document.body.appendChild(btn); document.body.appendChild(pan);
  const log=pan.querySelector("#rfLog"), qi=pan.querySelector("#rfQ");
  const say=(h,me)=>{ const d=document.createElement("div"); d.className="rfm"+(me?" me":""); d.innerHTML=h; log.appendChild(d); log.scrollTop=log.scrollHeight; };
  const STARTERS=["회의비 서류 뭐 내요?","글러브도 재료비로 되나요?","개인카드로 결제했어요","해외결제 금액이 달라요","500만원 넘는 물건은요?","국내출장 증빙은 언제까지?","학회 종신회비 되나요?","서류만 올려도 되나요?"];
  function hello(){ say(`안녕하세요! 연구비 쓰기 전·후에 궁금한 걸 물어보세요 🙂<br>되는지·안 되는지, 어떤 서류가 필요한지 알려 드리고 바로 요청 화면으로 안내해요.<div class="rfmore">${STARTERS.map(x=>`<button type="button" class="rfchip" data-ask="${esc(x)}">${esc(x)}</button>`).join("")}</div>`); }
  function ask(q){ q=String(q||"").trim(); if(!q) return; say(esc(q),true); setTimeout(()=>say(render(q)),120); }
  btn.onclick=()=>{ pan.hidden=false; btn.hidden=true; if(!log.children.length) hello(); setTimeout(()=>qi.focus(),50); };
  pan.querySelector("#rfX").onclick=()=>{ pan.hidden=true; btn.hidden=false; btn.focus(); };
  pan.querySelector("#rfForm").onsubmit=e=>{ e.preventDefault(); ask(qi.value); qi.value=""; };
  pan.addEventListener("click",e=>{ const c=e.target.closest("[data-ask]"); if(c){ ask(c.dataset.ask); return; }
    const g=e.target.closest("[data-go]"); if(g&&typeof window.pickType==="function"){ window.pickType(g.dataset.go); pan.hidden=true; btn.hidden=false; } });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!pan.hidden){ pan.hidden=true; btn.hidden=false; } });
  btn.hidden=true; hello(); log.scrollTop=0; /* 처음부터 열린 상태 */
  window.RFCHAT={answer,render,ask};
})();
