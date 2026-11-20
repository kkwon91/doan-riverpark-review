(() => {
  'use strict';
  const SITE = 'doan-riverpark';
  const ENDPOINT = 'https://ops.dbartera.com/';
  const SESSION = 'doan-riverpark.admin.v1';
  const statuses = ['신규', '연락함', '완료', '스팸'];
  const kinds = {invest:'분양 상담', lease:'임차·창업', agent:'중개 협력', consult:'상담'};
  const $ = id => document.getElementById(id);
  const gate = $('gate'), inbox = $('inbox'), sheet = $('detail');
  const notice = $('detail-message'), memo = $('memo');
  const stamp = new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const day = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'});
  let token = '', items = [], selected = null, statusFilter = '', visibleCount = 30;
  let readSeq = 0, loaded = false, busy = false, dirtyMemo = false;
  const errorText = {wrong:'아이디 또는 비밀번호를 확인해 주세요.',locked:'로그인 시도가 많습니다. 15분 뒤 다시 시도해 주세요.',closed:'사이트 운영이 정지되어 관리자 접속이 중단되었습니다.',site:'사이트 등록 정보를 확인해 주세요.',origin:'이 주소에서는 관리자에 접속할 수 없습니다.',none:'다른 관리자가 이미 삭제한 문의입니다.',login:'로그인 시간이 만료되었습니다. 다시 로그인해 주세요.'};

  function node(tag,text,cls) {
    const el = document.createElement(tag);
    el.textContent = String(text ?? '');
    if (cls) el.className = cls;
    return el;
  }
  function remember(value) {
    try { if(value) sessionStorage.setItem(SESSION,value); else sessionStorage.removeItem(SESSION); } catch { /* 현재 탭은 메모리에서 계속 작동합니다. */ }
  }
  function leave(note='') {
    token=''; remember(''); readSeq++; selected=null; items=[]; busy=false; loaded=false; dirtyMemo=false;
    if(sheet.open) sheet.close();
    $('facts').replaceChildren(); $('request-msg').textContent=''; memo.value=''; $('rows').replaceChildren();
    $('filter').reset(); statusFilter=''; $('updated').textContent=''; $('list-message').textContent='';
    $('password').value=''; $('login-message').textContent=note;
    $('logout').hidden=true; inbox.hidden=true; gate.hidden=false; $('account').focus();
  }
  async function request(payload) {
    const session = token;
    const controller = new AbortController(), timeout = setTimeout(()=>controller.abort(),12000);
    let reply;
    try {
      const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({...payload,site:SITE}),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});
      reply=await response.json();
      if(!response.ok || !reply.ok) throw Object.assign(new Error(errorText[reply.err] || '요청을 처리하지 못했습니다. 다시 시도해 주세요.'),{code:reply.err || 'server'});
    } catch(error) {
      if(session && token===session && ['closed','login'].includes(error.code)) leave(error.message);
      if(error.code && error instanceof Error && !(error instanceof DOMException)) throw error;
      throw new Error('서버에 연결하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.');
    } finally { clearTimeout(timeout); }
    return reply;
  }
  const admin = (op,data={})=>request({a:'admin',token,op,...data});

  function unit(r) {
    const raw=String(r.unit || '').trim();
    const room=/^\d+$/.test(raw) ? raw+'호' : raw;
    return [r.area,room].filter(Boolean).filter((v,i,arr)=>!(i===0 && arr[1]?.startsWith(v))).join(' ') || '미선택';
  }
  const type = r=>r.subject || kinds[r.kind] || '상담';
  const phone = r=>String(r.phone || '').replace(/\D/g,'');
  const mask = r=>{const n=phone(r);return n ? n.slice(0,n.startsWith('02')?2:3)+'-****-'+n.slice(-4) : '미입력';};
  const fullPhone = r=>{const n=phone(r);return n.replace(/^(02|\d{3})(\d{3,4})(\d{4})$/,'$1-$2-$3') || '미입력';};
  const at = r=>Number.isFinite(Date.parse(r.at)) ? stamp.format(new Date(r.at)) : '—';
  const folded = s=>String(s || '').toLowerCase().replace(/[\s\-]/g,'');
  function currentRows() {
    const search=folded($('query').value), from=$('from').value, until=$('until').value;
    return items.filter(r=>{
      if(statusFilter && r.status!==statusFilter) return false;
      const date=Number.isFinite(Date.parse(r.at)) ? day.format(new Date(r.at)) : '';
      if((from && date<from) || (until && date>until)) return false;
      return !search || [r.name,phone(r),unit(r),type(r),r.msg].some(v=>folded(v).includes(search));
    });
  }
  function draw() {
    const counts=$('counts'); counts.replaceChildren();
    for(const s of ['',...statuses]) {
      const button=node('button',s || '전체'); button.type='button'; button.dataset.status=s;
      button.setAttribute('aria-pressed',String(s===statusFilter));
      button.append(node('b',loaded ? (s ? items.filter(r=>r.status===s).length : items.length) : '—'));
      counts.append(button);
    }
    const filtered=currentRows(), rows=$('rows'); rows.replaceChildren();
    const datesInvalid=$('from').value && $('until').value && $('from').value>$('until').value;
    $('result-count').textContent=loaded ? '검색 결과 '+filtered.length.toLocaleString('ko-KR')+'건' : '문의 목록';
    $('export').disabled=!filtered.length; $('more').hidden=visibleCount>=filtered.length;
    for(const r of filtered.slice(0,visibleCount)) {
      const tr=document.createElement('tr');
      for(const [label,cls,value] of [['접수일','date',at(r)],['신청자','',r.name],['연락처','phone',mask(r)],['관심 호실','',unit(r)],['상담 유형','',type(r)],['상태','',r.status]]) {
        const td=node('td','',cls); td.dataset.label=label;
        if(label==='신청자'){
          const btn=node('button',value || '이름 미입력','name'); btn.dataset.id=r.id;
          btn.setAttribute('aria-label',(value || '신청자')+' 문의 열기'); td.append(btn);
        }else td.textContent=value;
        tr.append(td);
      }
      rows.append(tr);
    }
    $('empty').hidden=!loaded || !!filtered.length;
    $('empty').textContent=datesInvalid ? '종료일을 시작일 이후로 선택해 주세요.' : items.length ? '조건에 맞는 문의가 없습니다.' : '아직 접수된 상담 문의가 없습니다.';
  }
  async function refresh() {
    const seq=++readSeq; $('refresh').disabled=true;
    try {
      const r=await admin('inqList');
      if(seq!==readSeq || !token) return;
      if(!Array.isArray(r.inquiries)) throw new Error('문의 목록을 읽지 못했습니다.');
      items=r.inquiries; loaded=true; draw();
      $('updated').textContent='조회 '+stamp.format(new Date());
      $('list-message').textContent='';
    }catch(error){if(seq===readSeq && token) $('list-message').textContent=error.message;}
    finally{if(seq===readSeq) $('refresh').disabled=false;}
  }
  function enter(){
    gate.hidden=true; inbox.hidden=false; $('logout').hidden=false; loaded=false; $('refresh').disabled=false;
    draw();refresh();
  }
  $('login-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const button=event.currentTarget.querySelector('button');
    button.disabled=true; $('login-message').textContent='';
    try{
      const r=await request({a:'login',id:$('account').value.trim(),pw:$('password').value});
      if(typeof r.token!=='string' || !r.token) throw new Error('로그인 응답을 확인하지 못했습니다.');
      token=r.token; remember(token); $('password').value=''; enter();
    }catch(error){$('login-message').textContent=error.message;}
    finally{button.disabled=false;}
  });
  $('logout').addEventListener('click',()=>leave());
  $('refresh').addEventListener('click',refresh);
  $('counts').addEventListener('click',e=>{
    const b=e.target.closest('button[data-status]');if(!b)return;
    statusFilter=b.dataset.status; visibleCount=30;draw(); $('counts').querySelector('button[aria-pressed=true]').focus();
  });
  $('filter').addEventListener('submit',e=>e.preventDefault());
  $('filter').addEventListener('input',()=>{visibleCount=30;draw();});
  $('filter').addEventListener('reset',()=>setTimeout(()=>{statusFilter='';visibleCount=30;if(token)draw();},0));
  $('more').addEventListener('click',()=>{visibleCount+=30;draw();});
  for(const s of statuses) $('status').add(new Option(s,s));

  function addFact(label,value) {
    if(!value)return;
    const row=document.createElement('div'),dd=node('dd','');
    dd.append(value instanceof Node ? value : document.createTextNode(value));row.append(node('dt',label),dd);$('facts').append(row);
  }
  function openDetail(r) {
    selected=r; dirtyMemo=false;
    $('received').textContent='접수 '+at(r); $('detail-title').textContent=r.name+'님의 상담 문의';
    $('facts').replaceChildren(); const contact=node('span',mask(r)), reveal=node('button','번호 보기','show-phone');
    reveal.type='button';contact.append(reveal);
    reveal.addEventListener('click',async()=>{
      reveal.disabled=true;
      try{
        await admin('inqPhone',{id:r.id});
        if(selected!==r || !sheet.open || !token) return;
        const phoneLink=node('a',fullPhone(r));phoneLink.href='tel:'+phone(r);contact.replaceChildren(phoneLink);
      }catch(error){if(selected===r)notice.textContent=error.message;}
      finally{reveal.disabled=false;}
    });
    addFact('연락처',contact);addFact('관심 호실',unit(r));addFact('상담 유형',type(r));addFact('연락 시간',r.time);
    addFact('개인정보 동의',r.brief?.includes('동의') ? r.brief : '');
    $('request-msg').textContent=r.msg || '별도 문의 내용 없음';
    $('status').value=r.status;memo.value=r.memo || '';notice.textContent='';
    sheet.showModal();
  }
  $('rows').addEventListener('click',e=>{
    const id=e.target.closest('button[data-id]')?.dataset.id;
    const r=id && items.find(row=>row.id===id);if(r)openDetail(r);
  });
  function mayClose(){return !busy && (!dirtyMemo || confirm('저장하지 않은 메모를 닫을까요?'));}
  $('close-detail').addEventListener('click',()=>{if(mayClose())sheet.close();});
  sheet.addEventListener('cancel',e=>{if(!mayClose())e.preventDefault();});
  sheet.addEventListener('close',()=>{dirtyMemo=false;selected=null;});
  memo.addEventListener('input',()=>{dirtyMemo=memo.value!==(selected?.memo || '');});
  async function change(op,data) {
    if(!selected || busy)return;
    const record=selected, session=token; busy=true;
    const controls=[$('save-status'),$('save-memo'),$('delete'),$('close-detail'),memo,$('status')];
    controls.forEach(el=>el.disabled=true);notice.textContent='';
    try{
      await admin(op,{id:record.id,...data});
      if(!token || token!==session || selected!==record)return;
      if(op==='inqDelete') {
        items=items.filter(r=>r.id!==record.id);dirtyMemo=false;sheet.close();
      }else{
        const local=items.find(r=>r.id===record.id);
        if(op==='inqMemo'){record.memo=data.memo;if(local)local.memo=data.memo;dirtyMemo=false;}
        if(op==='inqStatus'){record.status=data.status;if(local)local.status=data.status;}
        notice.textContent='저장했습니다.';
      }
      draw();
      if(op==='inqDelete')$('list-message').textContent='문의를 삭제했습니다.';
    }catch(error){
      if(selected===record)notice.textContent=error.message;
      if(error.code==='none' && token)void refresh();
    }finally{busy=false;controls.forEach(el=>el.disabled=false);}
  }
  $('save-status').addEventListener('click',()=>change('inqStatus',{status:$('status').value}));
  $('save-memo').addEventListener('click',()=>change('inqMemo',{memo:memo.value}));
  $('delete').addEventListener('click',()=>{if(selected && confirm(selected.name+'님의 상담 문의를 영구 삭제할까요?'))void change('inqDelete',{});});
  function csvField(v){
    let s=String(v ?? '');
    if(/^[\s\uFEFF]*[=+@\-]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  $('export').addEventListener('click',()=>{
    const found=currentRows();if(!found.length)return;
    const lines=[['접수일(한국시간)','이름','연락처(일부 가림)','관심 호실','상담 유형','문의 내용','처리 상태','상담 메모'],...found.map(r=>[at(r),r.name,mask(r),unit(r),type(r),r.msg,r.status,r.memo])];
    const blob=new Blob(['\uFEFF'+lines.map(row=>row.map(csvField).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download='도안리버파크-상담문의-'+day.format(new Date())+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
  });
  setInterval(()=>{if(token && !sheet.open && !busy && !document.hidden && !$('refresh').disabled)void refresh();},60000);
  try{token=sessionStorage.getItem(SESSION) || '';}catch{token='';}
  if(token)enter();
})();
