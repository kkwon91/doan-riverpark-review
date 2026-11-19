(() => {
  'use strict';
  const figure = document.querySelector('#district-locations');
  if (!figure) return;
  const ns = 'http://www.w3.org/2000/svg';
  const nav = figure.querySelector('.dm-groups');
  const expand = figure.querySelector('.dm-expand');
  const terrain = figure.querySelector('.dm-terrain');
  const list = figure.querySelector('.dm-location-list');
  const mobile = matchMedia('(max-width: 700px)');
  list.open = mobile.matches;

  // Shop outlines use the leaflet's original PDF coordinates. Callout lines
  // provide separate touch targets on both sides of the shared access road.
  const areas = [
    {id:'one-first', label:'101~106호', line:'421.1,268 425,267.5 430,267.5', x:430.8, y:268.9,
      path:'M419.09,266.13L421.6,270.64L423.11,269.85L420.74,265.33L419.09,266.13Z'},
    {id:'one-last', label:'107~112호', line:'424.1,273.2 428.1,278.2 432,278.2', x:432.8, y:279.6,
      path:'M421.99,271.54L423.55,270.76L426.15,274.43L424.61,275.48L421.99,271.54Z'},
    {id:'two-a', label:'A동', line:'412.8,266.5 409,268.6 405,268.6', x:404.2, y:270, end:true,
      path:'M411.18,263.74L412.51,268.88L413.13,268.88L413.33,269.5L414.51,269.24L413.19,263.33L411.18,263.74Z'},
    {id:'two-b', label:'B동', line:'417.5,274.8 412.2,278.1 406,278.1', x:405.2, y:279.5, end:true,
      path:'M415.29,273.34L417.08,272.28L419.59,276.02L417.93,277.3L415.29,273.34Z'},
    {id:'three-a', label:'A동', line:'417,202.5 421.4,202.5 424.5,201', x:425.3, y:202.4,
      path:'M419.15,197.92L416.12,201.33L413.34,206.21L415.18,207.19L417.16,202.79L420.49,199.07L419.15,197.92Z'},
    {id:'three-b', label:'B동', line:'410.1,215.2 414.3,215.2 417.3,216.5', x:418.1, y:217.9,
      path:'M412.16,211.65L410.03,213.81L410.07,214.4L407.46,217.19L405.94,215.85L404.86,216.32L404.86,217.58L408.08,218.2L413.17,212.53L412.16,211.65Z'},
    {id:'five', label:'상가', line:'466.9,181.4 471.1,177.9 473.3,177.9', x:474.1, y:179.3,
      path:'M465.38,182.1L465.38,179.7L468.22,179.7L468.22,182.81L467,182.81L467,183.04L466.69,183.04L466.69,182.1L465.38,182.1Z'}
  ];

  function svg(name, attributes) {
    const element = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function overlay() {
    const layer = svg('svg', {class:'dm-overlay', viewBox:'345.5 164.4 159 159', role:'group', 'aria-label':'상가 위치별 호실 배치도'});
    for (const area of areas) {
      const item = nav.querySelector('[data-dm-place="' + area.id + '"]');
      const title = item.getAttribute('aria-label');
      const link = svg('a', {class:'dm-spot', href:item.getAttribute('href'), 'data-dm-place':area.id, 'aria-label':title, tabindex:'0'});
      const description = svg('title', {});
      description.textContent = title;
      const hit = svg('path', {class:'dm-hit', d:area.path});
      const rule = svg('polyline', {class:'dm-leader', points:area.line});
      const label = svg('text', {class:'dm-callout', x:area.x, y:area.y, 'text-anchor':area.end ? 'end' : 'start'});
      label.textContent = area.label;
      link.append(description, rule, hit, label);
      layer.append(link);
    }
    return layer;
  }

  figure.querySelector('.dm-map').append(overlay());
  const dialog = document.createElement('dialog');
  dialog.className = 'dm-dialog';
  dialog.setAttribute('aria-labelledby', 'dm-dialog-title');
  dialog.innerHTML = `<header class="dm-dialog-head"><h2 id="dm-dialog-title">전체 상가 위치도</h2><button type="button" class="dm-close" aria-label="전체 위치도 닫기" autofocus>닫기</button></header>
    <div class="dm-dialog-body"><div class="dm-map-column">
      <div class="dm-scroller" tabindex="0" aria-label="상가 위치도 확대 및 이동"><div class="dm-large-board"><div class="dm-map"></div></div></div>
      <div class="dm-zoom"><button type="button" data-dm-zoom="-1" aria-label="위치도 축소">−</button><output>100%</output><button type="button" data-dm-zoom="1" aria-label="위치도 확대">＋</button></div>
    </div><div class="dm-side"><h3>상가 위치 목록</h3></div></div>`;
  const largeMap = dialog.querySelector('.dm-map');
  const largeImage = terrain.cloneNode(false);
  largeImage.loading = 'eager';
  largeMap.append(largeImage, overlay());
  dialog.querySelector('.dm-side').append(nav.cloneNode(true));
  figure.append(dialog);
  expand.hidden = false;
  const frame = dialog.querySelector('.dm-scroller');
  const board = dialog.querySelector('.dm-large-board');
  let zoom = 1;
  function sizeMap(center = true) {
    if (!dialog.open) return;
    const w = frame.clientWidth, h = frame.clientHeight;
    const x = center ? (frame.scrollLeft + w / 2) / Math.max(w, board.offsetWidth) : .5;
    const y = center ? (frame.scrollTop + h / 2) / Math.max(h, board.offsetHeight) : .5;
    const size = Math.max(1, Math.floor(Math.min(w, h) * zoom));
    largeMap.style.width = size + 'px';
    board.style.width = Math.max(w, size) + 'px';
    board.style.height = Math.max(h, size) + 'px';
    frame.scrollLeft = x * board.offsetWidth - w / 2;
    frame.scrollTop = y * board.offsetHeight - h / 2;
    dialog.querySelector('.dm-zoom output').textContent = Math.round(zoom * 100) + '%';
    dialog.querySelector('[data-dm-zoom="-1"]').disabled = zoom === 1;
    dialog.querySelector('[data-dm-zoom="1"]').disabled = zoom === 3;
  }
  function openMap() {
    if (dialog.open) return;
    zoom = 1;
    dialog.showModal();
    document.body.classList.add('dm-locked');
    sizeMap(false);
  }
  expand.addEventListener('click', openMap);
  dialog.querySelector('.dm-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dm-locked'));
  dialog.addEventListener('click', event => {
    const control = event.target.closest('[data-dm-zoom]');
    if (control) {
      zoom = Math.max(1, Math.min(3, zoom + .5 * Number(control.dataset.dmZoom)));
      sizeMap();
    }
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    }
  });
  window.addEventListener('resize', () => sizeMap());
  window.addEventListener('doan:leave-map', () => { if (dialog.open) dialog.close(); });
  window.addEventListener('doan:restore-map', event => {
    const origin = event.detail || {};
    requestAnimationFrame(() => {
      if (origin.expanded) openMap();
      if (origin.list && !origin.expanded) list.open = true;
      const scope = origin.expanded ? dialog : figure;
      const where = origin.list ? '.dm-groups ' : '.dm-overlay ';
      const valid = areas.some(entry => entry.id === origin.place);
      const anchor = valid ? scope.querySelector(where + '[data-dm-place="' + origin.place + '"]') : expand;
      if (!origin.expanded) {
        const target = origin.list && anchor ? anchor : figure.querySelector('.dm-map');
        target.scrollIntoView({block:'center', behavior:'instant'});
      }
      (anchor || expand).focus({preventScroll:true});
    });
  });
})();
