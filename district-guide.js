(() => {
  'use strict';
  const figure = document.querySelector('#district-locations');
  if (!figure) return;
  const ns = 'http://www.w3.org/2000/svg';
  const nav = figure.querySelector('.dm-groups');
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
  window.addEventListener('doan:restore-map', event => {
    const {place, list: useList} = event.detail || {};
    requestAnimationFrame(() => {
      if (useList) list.open = true;
      const scope = useList ? nav : figure.querySelector('.dm-overlay');
      const link = [...scope.querySelectorAll('[data-dm-place]')].find(el => el.dataset.dmPlace === place);
      (link || figure.querySelector('.dm-map')).scrollIntoView({block:'center', behavior:'instant'});
      (link || scope.querySelector('a'))?.focus({preventScroll:true});
    });
  });
})();
