(() => {
  'use strict';

  const endpoint = 'https://ops.dbartera.com/';
  const site = 'doan-riverpark';
  const form = document.getElementById('inquiry-form');
  const online = document.getElementById('inquiry-online');
  const result = document.getElementById('inquiry-result');
  const retry = document.getElementById('inquiry-retry');
  const again = document.getElementById('inquiry-again');
  const localPreview = location.port === '8914' && ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!form || location.protocol === 'file:' || localPreview) return;
  online.hidden = true;

  const fields = form.elements;
  const area = fields.namedItem('area');
  const unit = fields.namedItem('unit');
  const submit = form.querySelector('[type="submit"]');
  let plans = [];
  let lastMapChoice = '';
  let pendingChoice = null;
  let ready = false;
  let submitting = false;

  async function request(url, options, milliseconds) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), milliseconds);
    try {
      const response = await fetch(url, { ...options, signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer' });
      if (!response.ok) throw new Error('unavailable');
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function blockForm(message) {
    ready = false;
    form.hidden = true;
    result.textContent = message;
    retry.hidden = false;
  }

  async function connect() {
    ready = false;
    form.hidden = true;
    retry.hidden = true;
    result.textContent = '온라인 접수를 확인하고 있습니다.';
    try {
      const status = await request(endpoint + '?a=status&site=' + site, {cache:'no-store'}, 6000);
      if (status.ok !== true || status.status !== 'active') throw new Error('unavailable');
      ready = true;
      result.textContent = '';
      form.hidden = false;
      syncMapChoice();
    } catch {
      blockForm('현재 온라인 상담을 접수할 수 없습니다. 전화 1551-5329로 문의해 주세요.');
    }
  }

  function roomOptions() {
    const plan = plans.find(item => item.key === area.value);
    unit.replaceChildren(new Option(plan ? '호실 미정' : '단지·동을 먼저 선택해 주세요', ''));
    unit.disabled = !plan;
    if (plan) for (const room of plan.rooms) unit.add(new Option(room.number + '호', String(room.number)));
  }

  function syncMapChoice() {
    const choice = window.doanReviewContext?.() || pendingChoice;
    if (!choice || !plans.length) return;
    const signature = choice.plan + '/' + choice.room;
    if (signature === lastMapChoice) return;
    const plan = plans.find(item => item.key === choice.plan);
    if (!plan || !plan.rooms.some(room => String(room.number) === String(choice.room))) return;
    area.value = plan.key;
    roomOptions();
    unit.value = String(choice.room);
    lastMapChoice = signature;
    pendingChoice = null;
  }

  async function loadPlans() {
    try {
      const response = await fetch(new URL('assets/plans/units.json', document.baseURI));
      if (!response.ok) throw new Error('catalogue');
      const estates = await response.json();
      plans = estates.flatMap(estate => estate.plans.map(plan => ({...plan, label:estate.complex + '단지' + (plan.building ? ' ' + plan.building + '동' : '')})));
      for (const plan of plans) area.add(new Option(plan.label, plan.key));
      syncMapChoice();
    } catch {
      area.disabled = true;
      area.replaceChildren(new Option('문의 내용에 관심 호실을 적어 주세요.', ''));
    }
  }

  document.addEventListener('click', event => {
    if (!event.target.closest('a[href="#inquiry"]')) return;
    pendingChoice = window.doanReviewContext?.() || pendingChoice;
    syncMapChoice();
  }, true);
  form.addEventListener('focusin', syncMapChoice);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('inquiry-in-view', entry.isIntersecting);
      if (entry.isIntersecting) syncMapChoice();
    }).observe(form);
  }
  area.addEventListener('change', roomOptions);
  const phone = fields.namedItem('phone');
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  const name = fields.namedItem('name');
  name.addEventListener('input', () => name.setCustomValidity(''));
  retry.addEventListener('click', connect);
  again.addEventListener('click', () => {
    again.hidden = true;
    connect().then(() => { if (ready) name.focus(); });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !ready) return;
    if (!name.value.trim()) name.setCustomValidity('이름을 입력해 주세요.');
    const digits = phone.value.replace(/[\s()-]/g, '');
    if (!/^0\d{8,11}$/.test(digits)) phone.setCustomValidity('연락 가능한 전화번호를 지역번호 또는 010부터 입력해 주세요.');
    if (!form.reportValidity()) return;
    const plan = plans.find(item => item.key === area.value);
    const data = {
      kind:fields.namedItem('kind').value, name:name.value.trim(), phone:digits,
      area:plan?.label || '', unit:unit.value, msg:fields.namedItem('msg').value.trim(),
      agree:fields.namedItem('agree').checked, brief:'상담 개인정보 수집·이용 동의(2026-11-20)',
      mkt:false, page:'상담 신청'
    };
    submitting = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    result.textContent = '문의 내용을 보내고 있습니다.';
    try {
      const saved = await request(endpoint, {
        method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'},
        body:JSON.stringify({a:'inq', site, data})
      }, 12000);
      if (saved.ok !== true || typeof saved.id !== 'string' || !saved.id) {
        if (saved.err === 'busy') result.textContent = '접수 요청이 많습니다. 잠시 뒤 다시 신청하거나 1551-5329로 문의해 주세요.';
        else if (saved.err === 'invalid') result.textContent = '이름과 연락처를 확인한 뒤 다시 신청해 주세요.';
        else blockForm('접수가 완료되지 않았습니다. 다시 연결하거나 1551-5329로 문의해 주세요.');
        return;
      }
      form.reset();
      roomOptions();
      lastMapChoice = '';
      form.hidden = true;
      ready = false;
      result.textContent = '상담 신청이 접수되었습니다. 접수번호 ' + saved.id + '입니다.';
      result.focus({preventScroll:true});
      again.hidden = false;
      window.dispatchEvent(new Event('doan:inquiry-saved'));
    } catch {
      blockForm('접수 결과를 확인하지 못했습니다. 1551-5329에서 접수 여부를 확인해 주세요.');
    } finally {
      submitting = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
  loadPlans();
  connect();
})();
