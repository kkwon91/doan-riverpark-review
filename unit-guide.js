(() => {
  'use strict';

  const root = document.getElementById('unit-guide');
  if (!root) return;

  const assets = new URL('assets/plans/', document.currentScript?.src || document.baseURI);
  const planAsset = file => window.doanEmbeddedAssets?.['assets/plans/' + file] ?? new URL(file, assets).href;
  const formatArea = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });
  const area = value => formatArea.format(value) + '㎡';
  const count = value => value.toLocaleString('ko-KR');
  const first = selector => root.querySelector(selector);
  const all = selector => root.querySelectorAll(selector);

  const icons = {
    expand: '<path d="M8 3H3v5m9-5h5v5M3 12v5h5m9-5v5h-5"/>',
    chat: '<path d="M3 3.5h14v10H9l-4.7 3v-3H3z"/>',
    plus: '<path d="M10 4v12M4 10h12"/>',
    minus: '<path d="M4 10h12"/>',
    chevron: '<path d="m5 8 5 5 5-5"/>',
    close: '<path d="m4 4 12 12m0-12L4 16"/>'
  };
  function icon(name) {
    return '<svg class="ug-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + icons[name] + '</svg>';
  }

  let complexes;
  let complexIndex = 0;
  let planIndex = 0;
  let roomIndex = 0;
  let explicitSelection = false;
  let modalDrawing = 'guide';
  let zoom = 1;
  const compactScreen = window.matchMedia('(max-width: 690px)');
  const complex = () => complexes[complexIndex];
  const plan = () => complex().plans[planIndex];
  const room = () => plan().rooms[roomIndex];
  const buildingName = building => building ? building + '동 ' : '';
  const roomName = () => buildingName(plan().building) + room().number + '호';
  const planName = () => complex().complex + '단지 ' + buildingName(plan().building) + '상가';
  window.doanReviewContext = () => explicitSelection && complexes ? {plan:plan().key, room:room().number} : null;

  const categories = {
    dining: '식음료', retail: '판매', office: '부동산', open: '비지정'
  };
  function category(entry) {
    if (!entry.designatedUse) return 'open';
    if (entry.designatedUse === '부동산') return 'office';
    if (/호프|베이커리|카페/.test(entry.designatedUse)) return 'dining';
    return 'retail';
  }
  function legend() {
    return [...new Set(plan().rooms.map(category))].map(key =>
      `<span><i class="ug-swatch ug-tone-${key}"></i>${categories[key]}</span>`
    ).join('') + '<span><i class="ug-swatch ug-swatch-picked"></i>선택 호실</span>';
  }
  const smallAreas = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  // The leaflet depicts these wings separately. Stack their original extents
  // on phones so each bay remains legible without rearranging adjoining shops.
  const splitViews = {
    '1': [[0, 0, 404, 237, 0, 6], [416, 68, 404, 175, 6, 12]],
    '3a': [[0, 0, 413, 169, 0, 4], [415, 0, 405, 169, 4, 8]]
  };
  function vectorPlan(part, insideDialog = false) {
    const current = plan();
    const media = current.drawings.guide;
    const [width,height] = media.size;
    const [x,y,w,h,start,end] = part || [0,0,width,height,0,current.rooms.length];
    const rooms = current.rooms.slice(start,end);
    const indexTag = entry => `${entry.number}호 · 전용 ${area(entry.exclusiveM2)} · ${entry.designatedUse || '비지정'}`;
    const floors = rooms.map((entry,i) => {
      const index = start+i;
      return `<path class="ug-floor ug-tone-${category(entry)}" d="${entry.vector.path}" data-ug-room="${index}" tabindex="${index === roomIndex ? 0 : -1}" role="button" aria-pressed="${index === roomIndex}" aria-label="${buildingName(current.building)}${entry.number}호 선택"><title>${indexTag(entry)}</title></path>`;
    }).join('');
    const tags = rooms.map((entry,i) => {
      const [lx,ly] = entry.vector.label;
      const gap = ['2a','2b','3b'].includes(current.key) ? 22 : 17;
      return `<g class="ug-room-label" data-label-room="${start+i}" data-selected="${start+i===roomIndex}" transform="translate(${lx} ${ly})"><text y="-1" class="ug-number">${entry.number}</text><text y="${gap}" class="ug-label-area">${smallAreas.format(entry.exclusiveM2)}</text></g>`;
    }).join('');
    return `<svg class="ug-drawing ug-key-${current.key}${insideDialog ? ' ug-large-map' : ''}" viewBox="${x} ${y} ${w} ${h}" role="group" aria-label="${planName()} ${rooms[0].number}호부터 ${rooms.at(-1).number}호까지의 안내 배치도">${floors}<image class="ug-wallwork" href="${planAsset(media.file)}" width="${width}" height="${height}" aria-hidden="true"/><g class="ug-lettering" aria-hidden="true">${tags}</g></svg>`;
  }
  function guideStage() {
    const key = plan().key;
    const split = compactScreen.matches && splitViews[key];
    const art = split ? split.map(part=>vectorPlan(part)).join('') : vectorPlan();
    const openingSide = complex().complex === 2 ? 'above' : 'below';
    return `<div class="ug-board ${split ? 'ug-stacked' : ''} ug-road-${openingSide}" data-plan="${key}">
      <div class="ug-board-key"><span>호실 번호</span><span>전용면적 (㎡)</span>${split ? '<span class="ug-split-note">좌·우 구간을 위아래로 표시</span>' : ''}</div>
      <div class="ug-board-scroll"><div class="ug-board-art">${art}</div></div>
      <div class="ug-street"><span>${openingSide === 'above' ? '↑' : '↓'} 대로변 방향</span></div>
    </div>`;
  }

  function mapMarkup(drawing, insideDialog) {
    if (drawing === 'guide') return vectorPlan(null, insideDialog);
    const current = plan();
    const media = current.drawings[drawing];
    const [width, height] = media.size;
    const shape = current.rooms.map((entry, index) => {
      const chosen = index === roomIndex;
      return `<polygon class="ug-room-shape" data-ug-room="${index}" role="button" aria-label="${buildingName(current.building)}${entry.number}호 선택" aria-pressed="${chosen}" tabindex="${chosen ? '0' : '-1'}" vector-effect="non-scaling-stroke" points="${entry.areas[drawing]}"><title>${entry.number}호 · 전용 ${area(entry.exclusiveM2)}</title></polygon>`;
    }).join('');
    return `<svg class="ug-map${insideDialog ? ' ug-large-map' : ''}" role="group" aria-label="${planName()} 호실 배치도" viewBox="0 0 ${width} ${height}">
      <image href="${planAsset(media.file)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none"/>
      ${shape}
    </svg>`;
  }

  function tableRows() {
    return complex().plans.map((block, blockIndex) => block.rooms.map((entry, entryIndex) =>
      `<tr><th scope="row"><button type="button" class="ug-table-room" data-ug-table-plan="${blockIndex}" data-ug-table-room="${entryIndex}">${buildingName(block.building)}${entry.number}호</button></th>
        <td>${formatArea.format(entry.exclusiveM2)}</td><td>${formatArea.format(entry.contractM2)}</td><td>${entry.designatedUse || '비지정'}</td></tr>`
    ).join('')).join('');
  }

  function renderPanel() {
    const item = complex();
    const blocks = item.plans.map((block, index) =>
      `<button type="button" class="ug-building" data-ug-building="${index}" aria-pressed="${index === planIndex}">${block.building}동</button>`
    ).join('');
    const options = plan().rooms.map((entry, index) =>
      `<option value="${index}">${buildingName(plan().building)}${entry.number}호</option>`
    ).join('');
    const panel = first('#ug-panel');
    panel.setAttribute('aria-labelledby', 'ug-tab-' + item.complex);
    panel.innerHTML = `
      <dl class="ug-complex-facts" aria-label="${item.complex}단지 규모">
        <div><dt>공동주택</dt><dd>${count(item.households)}세대</dd></div>
        <div><dt>상가</dt><dd>${item.buildingCount}개동 · ${item.unitCount}호실</dd></div>
        <div><dt>전용 합계</dt><dd>${area(item.exclusiveM2)}</dd></div>
        <div><dt>계약 합계</dt><dd>${area(item.contractM2)}</dd></div>
      </dl>
      <div class="ug-workspace">
        <figure class="ug-figure">
          <div class="ug-route-bar"${explicitSelection ? '' : ' hidden'}><a class="ug-return" data-ug-return href="#district-locations">전체 상가 위치도로</a></div>
          <div class="ug-figure-head">
            <div class="ug-figure-title"><h3 tabindex="-1">${planName()} 배치도</h3>
              ${item.plans.length > 1 ? `<div class="ug-buildings" role="group" aria-label="상가 동 선택">${blocks}</div>` : ''}
            </div>
            <button type="button" class="ug-expand" data-ug-action="open" aria-haspopup="dialog">${icon('expand')}크게 보기</button>
          </div>
          <div class="ug-stage">${guideStage()}</div>
          <figcaption class="ug-caption"><div class="ug-legend" aria-label="업종 범례">${legend()}</div><span>표시 면적은 ㎡ 단위로 소수 둘째 자리까지 반올림했습니다.</span></figcaption>
        </figure>
        <div class="ug-unit" aria-label="선택한 호실 정보">
          <div class="ug-unit-head"><label class="ug-field-label" for="ug-select">호실 선택</label>
          <div class="ug-select-wrap"><select id="ug-select" class="ug-select">${options}</select>${icon('chevron')}</div></div>
          <dl class="ug-unit-facts">
            <div><dt>전용면적</dt><dd data-ug-value="exclusive"></dd></div>
            <div><dt>계약면적</dt><dd data-ug-value="contract"></dd></div>
            <div><dt>리플렛 표기 업종</dt><dd data-ug-value="use"></dd></div>
          </dl>
          <button type="button" class="ug-ask" data-ug-action="ask">${icon('chat')}이 호실 AI 상담</button>
        </div>
      </div>
      <details class="ug-table-wrap">
        <summary><span>${item.complex}단지 호실별 면적표</span>${icon('plus')}</summary>
        <div class="ug-table-scroll"><table class="ug-table"><caption class="ug-sr">${item.complex}단지 전체 ${item.unitCount}개 호실의 면적과 리플렛 표기 업종</caption>
          <thead><tr><th scope="col">호실</th><th scope="col">전용면적 <small>(㎡)</small></th><th scope="col">계약면적 <small>(㎡)</small></th><th scope="col">표기 업종</th></tr></thead>
          <tbody>${tableRows()}</tbody>
        </table></div>
      </details>
      <p class="ug-source">호실별 면적과 업종은 수정 리플렛 2쪽, 단지별 면적 합계와 상세 도면은 2026년 11월 17일 배포자료 기준입니다.</p>`;
    selectRoom(roomIndex);
  }

  function selectRoom(index) {
    roomIndex = index;
    const picked = room();
    const select = first('#ug-select');
    select.value = String(index);
    first('[data-ug-value="exclusive"]').textContent = area(picked.exclusiveM2);
    first('[data-ug-value="contract"]').textContent = area(picked.contractM2);
    first('[data-ug-value="use"]').textContent = picked.designatedUse || '비지정';
    all('[data-ug-room]').forEach(shape => {
      const active = Number(shape.dataset.ugRoom) === index;
      shape.setAttribute('aria-pressed', String(active));
      shape.setAttribute('tabindex', active ? '0' : '-1');
    });
    all('[data-label-room]').forEach(label => {
      label.dataset.selected = String(Number(label.dataset.labelRoom) === index);
    });
    const scroller = first('.ug-board-scroll');
    const selected = first('.ug-stage [aria-pressed="true"]');
    if (selected && scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
      const bounds = selected.getBoundingClientRect();
      const frame = scroller.getBoundingClientRect();
      if (bounds.left < frame.left || bounds.right > frame.right) {
        scroller.scrollLeft += (bounds.left + bounds.right - frame.left - frame.right) / 2;
      }
    }
    const description = roomName() + ' · 전용 ' + area(picked.exclusiveM2);
    const modalSelection = first('.ug-modal-selection');
    if (modalSelection) modalSelection.textContent = description;
    first('.ug-announcement').textContent = complex().complex + '단지 ' + description + ', 계약 ' + area(picked.contractM2);
  }

  function activateComplex(index, block = 0, unit = 0) {
    complexIndex = index;
    planIndex = block;
    roomIndex = unit;
    all('[data-ug-complex]').forEach(tab => {
      const active = Number(tab.dataset.ugComplex) === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    renderPanel();
  }

  function findAddress(url) {
    const [section, hashQuery] = url.hash.slice(1).split('?');
    if (section && section !== 'units') return null;
    const params = hashQuery ? new URLSearchParams(hashQuery) : url.searchParams;
    const key = (params.get('plan') || '').toLowerCase();
    for (const [estateIndex, estate] of complexes.entries()) {
      const block = estate.plans.findIndex(entry => entry.key === key);
      if (block < 0) continue;
      const number = Number(params.get('room'));
      const unit = estate.plans[block].rooms.findIndex(entry => entry.number === number);
      return [estateIndex, block, Math.max(0, unit)];
    }
    return null;
  }

  function writeHistory(method, state, url) {
    try {
      history[method](state, '', url);
    } catch (error) {
      if (error.name !== 'SecurityError') throw error;
      // A local HTML file may change its fragment even when its browser
      // forbids rewriting the query. Keep the same choice in that fragment.
      const local = new URL(location.href);
      local.hash = url.hash === '#units'
        ? 'units?plan=' + url.searchParams.get('plan') + '&room=' + url.searchParams.get('room')
        : url.hash;
      try {
        history[method](state, '', local);
      } catch {
        if (method === 'replaceState') location.replace(local.hash);
        else location.hash = local.hash;
      }
    }
  }

  function pickedUrl() {
    const url = new URL(location.href);
    url.searchParams.set('plan', plan().key);
    url.searchParams.set('room', String(room().number));
    url.hash = 'units';
    return url;
  }

  function alignRoom() {
    const frame = first('.ug-board-scroll');
    if (!frame || frame.scrollWidth <= frame.clientWidth) return;
    const polygon = frame.querySelector('[data-ug-room="' + roomIndex + '"]');
    if (!polygon) return;
    const roomBounds = polygon.getBoundingClientRect(), box = frame.getBoundingClientRect();
    if (roomBounds.right > box.right - 6) frame.scrollLeft += roomBounds.right - box.right + 8;
    if (roomBounds.left < box.left + 6) frame.scrollLeft += roomBounds.left - box.left - 8;
  }

  function focusPlan() {
    requestAnimationFrame(() => {
      const target = first('.ug-figure');
      target.scrollIntoView({block:'start', behavior:'instant'});
      first('.ug-figure-title h3').focus({preventScroll:true});
      alignRoom();
    });
  }

  function rememberChoice() {
    const previous = new URL(location.href);
    explicitSelection = true;
    first('.ug-route-bar').hidden = false;
    const url = pickedUrl();
    if (url.href !== previous.href) {
      const currentRoute = !!findAddress(previous);
      writeHistory(currentRoute ? 'replaceState' : 'pushState', currentRoute ? history.state : null, url);
    }
    alignRoom();
  }

  function applyAddress() {
    const target = findAddress(new URL(location.href));
    if (!target) return false;
    explicitSelection = true;
    activateComplex(...target);
    const canonical = pickedUrl();
    if (canonical.href !== location.href) writeHistory('replaceState', history.state, canonical);
    focusPlan();
    return true;
  }

  function mapUrl() {
    const url = new URL(location.href);
    url.searchParams.delete('plan');
    url.searchParams.delete('room');
    url.hash = 'district-locations';
    return url;
  }

  function restoreMap(origin) {
    explicitSelection = false;
    first('.ug-route-bar').hidden = true;
    window.dispatchEvent(new CustomEvent('doan:restore-map', {detail:origin}));
  }

  function onLocationLink(event) {
    const link = event.target.closest('a[data-dm-place]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = findAddress(new URL(link.getAttribute('href'), location.href));
    if (!target) return;
    event.preventDefault();
    const origin = {place:link.dataset.dmPlace, expanded:!!link.closest('.dm-dialog'), list:!!link.closest('.dm-groups')};
    writeHistory('replaceState', {...history.state, doanMapOrigin:origin}, mapUrl());
    window.dispatchEvent(new CustomEvent('doan:leave-map'));
    explicitSelection = true;
    activateComplex(...target);
    writeHistory('pushState', {doanPlanFromMap:true}, pickedUrl());
    focusPlan();
  }

  function goBackToMap() {
    if (history.state?.doanPlanFromMap) {
      history.back();
      return;
    }
    writeHistory('pushState', {doanMapOrigin:{}}, mapUrl());
    restoreMap({});
  }

  function resizeModal(keepCenter) {
    const dialog = first('.ug-dialog');
    if (!dialog.open) return;
    const frame = first('.ug-modal-scroll');
    const box = first('.ug-modal-canvas');
    const graphic = first('.ug-large-map');
    const [width, height] = plan().drawings[modalDrawing].size;
    const vw = frame.clientWidth;
    const vh = frame.clientHeight;
    const centerX = keepCenter ? (frame.scrollLeft + vw / 2) / Math.max(vw, box.offsetWidth) : 0.5;
    const centerY = keepCenter ? (frame.scrollTop + vh / 2) / Math.max(vh, box.offsetHeight) : 0.5;
    const factor = Math.min((vw - 32) / width, (vh - 32) / height) * zoom;
    const newWidth = Math.max(1, Math.round(width * factor));
    const newHeight = Math.max(1, Math.round(height * factor));
    box.style.width = Math.max(vw, newWidth + 32) + 'px';
    box.style.height = Math.max(vh, newHeight + 32) + 'px';
    graphic.style.width = newWidth + 'px';
    graphic.style.height = newHeight + 'px';
    frame.scrollLeft = Math.round(centerX * box.offsetWidth - vw / 2);
    frame.scrollTop = Math.round(centerY * box.offsetHeight - vh / 2);
    first('[data-ug-action="zoom-out"]').disabled = zoom <= 1;
    first('[data-ug-action="zoom-in"]').disabled = zoom >= 4;
    first('.ug-zoom-readout').textContent = Math.round(zoom * 100) + '%';
  }

  function drawModal() {
    all('[data-ug-drawing]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.ugDrawing === modalDrawing));
    });
    first('.ug-modal-canvas').innerHTML = mapMarkup(modalDrawing, true);
    zoom = 1;
    resizeModal(false);
  }

  function openModal() {
    modalDrawing = 'guide';
    first('#ug-modal-title').textContent = planName() + ' 배치도';
    first('.ug-modal-selection').textContent = roomName() + ' · 전용 ' + area(room().exclusiveM2);
    first('.ug-dialog').showModal();
    document.body.classList.add('ug-dialog-open');
    drawModal();
  }

  const actions = {
    open: openModal,
    close: () => first('.ug-dialog').close(),
    'zoom-in': () => { zoom = Math.min(4, zoom + 0.5); resizeModal(true); },
    'zoom-out': () => { zoom = Math.max(1, zoom - 0.5); resizeModal(true); },
    ask: () => window.dispatchEvent(new CustomEvent('doan:ask', {
      detail: { question: complex().complex + '단지 ' + roomName() + '의 전용면적과 계약면적, 업종을 알려주세요.' }
    }))
  };

  function wireControls() {
    document.addEventListener('click', onLocationLink);
    window.addEventListener('popstate', () => {
      if (first('.ug-dialog').open) first('.ug-dialog').close();
      if (applyAddress()) {
        window.dispatchEvent(new CustomEvent('doan:leave-map'));
        return;
      }
      explicitSelection = false;
      first('.ug-route-bar').hidden = true;
      if (location.hash === '#district-locations') restoreMap(history.state?.doanMapOrigin || {});
    });
    compactScreen.addEventListener('change', () => {
      first('.ug-stage').innerHTML = guideStage();
      selectRoom(roomIndex);
    });
    root.addEventListener('click', event => {
      const control = event.target.closest('button, [data-ug-room], [data-ug-return]');
      if (!control || !root.contains(control)) return;
      const data = control.dataset;
      if (data.ugReturn !== undefined) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        goBackToMap();
        return;
      }
      if (data.ugAction) actions[data.ugAction]();
      if (data.ugComplex !== undefined) activateComplex(Number(data.ugComplex));
      if (data.ugRoom !== undefined) selectRoom(Number(data.ugRoom));
      if (data.ugBuilding !== undefined) {
        planIndex = Number(data.ugBuilding);
        roomIndex = 0;
        renderPanel();
        first('[data-ug-building="' + planIndex + '"]').focus({ preventScroll: true });
      }
      if (data.ugDrawing) {
        modalDrawing = data.ugDrawing;
        drawModal();
      }
      if (data.ugTableRoom !== undefined) {
        planIndex = Number(data.ugTablePlan);
        roomIndex = Number(data.ugTableRoom);
        renderPanel();
        first('#ug-select').focus();
      }
      if (data.ugRoom !== undefined || data.ugBuilding !== undefined || data.ugComplex !== undefined ||
          data.ugTableRoom !== undefined || data.ugAction === 'ask') rememberChoice();
    });
    root.addEventListener('change', event => {
      if (event.target.id === 'ug-select') {
        selectRoom(Number(event.target.value));
        rememberChoice();
      }
    });
    root.addEventListener('keydown', event => {
      const target = event.target;
      const isTab = target.matches('[data-ug-complex]');
      const isRoom = target.matches('[data-ug-room]');
      if (!isTab && !isRoom) return;
      if (isRoom && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        selectRoom(Number(target.dataset.ugRoom));
        rememberChoice();
        return;
      }
      const index = isTab ? Number(target.dataset.ugComplex) : Number(target.dataset.ugRoom);
      const length = isTab ? complexes.length : plan().rooms.length;
      const navigation = { ArrowRight: (index + 1) % length, ArrowLeft: (index + length - 1) % length, Home: 0, End: length - 1 };
      if (!(event.key in navigation)) return;
      event.preventDefault();
      const next = navigation[event.key];
      if (isTab) {
        activateComplex(next);
        first('[data-ug-complex="' + next + '"]').focus({ preventScroll: true });
      } else {
        selectRoom(next);
        const container = target.closest('.ug-stage, .ug-modal-canvas');
        container.querySelector('[data-ug-room="' + next + '"]').focus({ preventScroll: true });
      }
      rememberChoice();
    });
    const dialog = first('.ug-dialog');
    dialog.addEventListener('close', () => {
      document.body.classList.remove('ug-dialog-open');
      first('.ug-modal-canvas').replaceChildren();
      first('[data-ug-action="open"]').focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    window.addEventListener('resize', () => { if (dialog.open) resizeModal(true); });
  }

  async function load() {
    try {
      if (window.doanEmbeddedUnits) {
        complexes = window.doanEmbeddedUnits;
      } else {
        const response = await fetch(new URL('units.json', assets));
        if (!response.ok) throw new Error('units');
        complexes = await response.json();
      }
    } catch {
      root.innerHTML = '<p class="ug-load-error">호실 자료를 불러오지 못했습니다. <button type="button">다시 불러오기</button></p>';
      first('button').addEventListener('click', load, { once: true });
      return;
    }
    const tabs = complexes.map((item, index) =>
      `<button type="button" class="ug-tab" id="ug-tab-${item.complex}" data-ug-complex="${index}" role="tab" aria-controls="ug-panel"><strong>${item.complex}단지</strong><span>${item.unitCount}호실</span></button>`
    ).join('');
    root.innerHTML = `
      <div class="ug-tabs" role="tablist" aria-label="단지 선택">${tabs}</div>
      <div id="ug-panel" role="tabpanel"></div>
      <span class="ug-sr ug-announcement" role="status" aria-live="polite"></span>
      <dialog class="ug-dialog" aria-labelledby="ug-modal-title">
        <div class="ug-dialog-head"><h3 id="ug-modal-title"></h3>
          <button type="button" data-ug-action="close" class="ug-modal-close" aria-label="배치도 닫기" autofocus>${icon('close')}</button></div>
        <div class="ug-modal-tools">
          <div class="ug-drawings" role="group" aria-label="도면 종류">
            <button type="button" data-ug-drawing="guide">안내도</button>
            <button type="button" data-ug-drawing="simple">리플렛 배치도</button>
            <button type="button" data-ug-drawing="detailed">상세 도면</button>
          </div>
          <div class="ug-zoom-tools"><button type="button" data-ug-action="zoom-out" aria-label="도면 축소">${icon('minus')}</button><output class="ug-zoom-readout">100%</output><button type="button" data-ug-action="zoom-in" aria-label="도면 확대">${icon('plus')}</button></div>
        </div>
        <div class="ug-modal-scroll" tabindex="0" aria-label="확대 도면 탐색"><div class="ug-modal-canvas"></div></div>
        <p class="ug-modal-selection" aria-live="polite"></p>
      </dialog>`;
    if (!applyAddress()) activateComplex(0);
    wireControls();
  }

  load();
})();
