(() => {
  'use strict';

  const repo = 'https://gitlab.dataknows.ai/richgo/chatbot-bunyang';
  const sections = [
    { name: '첫 화면', selector: '.hero', hash: 'main' },
    { name: '단지별 상가', selector: '#units', hash: 'units' },
    { name: '단지 개요', selector: '#overview', hash: 'overview' },
    { name: '단지 자료', selector: '#resources', hash: 'resources' },
    { name: '방문 안내', selector: '#visit', hash: 'visit' },
    { name: '상가 위치도', selector: '#district-locations', hash: 'district-locations' },
    { name: 'AI 상가 상담', hash: 'chat-launch' },
    { name: '전체' }
  ];
  const planKeys = {
    '1': '1단지', '2a': '2단지 A동', '2b': '2단지 B동',
    '3a': '3단지 A동', '3b': '3단지 B동', '5': '5단지'
  };
  const meta = name => document.querySelector('meta[name="' + name + '"]')?.content.trim() || '';

  function currentSection() {
    const anchor = Math.min(250, window.innerHeight * .35);
    let best = '전체';
    let distance = Infinity;
    for (const entry of sections) {
      if (!entry.selector) continue;
      const rect = document.querySelector(entry.selector)?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
      const gap = Math.max(0, rect.top - anchor, anchor - rect.bottom);
      if (gap < distance || (gap === 0 && entry.hash === 'district-locations' && location.hash === '#district-locations')) {
        best = entry.name;
        distance = gap;
      }
    }
    return best;
  }

  function currentRoom() {
    const selected = window.doanReviewContext?.();
    const params = new URLSearchParams(location.search);
    const key = String(selected?.plan ?? params.get('plan') ?? '').toLowerCase();
    const room = String(selected?.room ?? params.get('room') ?? '');
    return Object.hasOwn(planKeys, key) && /^1\d{2}$/.test(room)
      ? { key, number: room, label: planKeys[key] + ' ' + room + '호' } : null;
  }

  function pageLink(section, room) {
    const configured = meta('review-pages-base');
    const onPages = location.protocol === 'https:' && /(?:^|\.)(?:pages\.dataknows\.ai|gitlab\.io)$/i.test(location.hostname);
    if (!configured && !onPages) return '';
    let url;
    try { url = new URL(configured || location.href); } catch { return ''; }
    if (url.protocol !== 'https:' || url.username || url.password ||
        !url.hostname.includes('.') || /(^127\.|^\d+\.\d+\.\d+\.\d+$|\.local(host)?$)/i.test(url.hostname)) return '';
    url.search = '';
    url.hash = section.hash || '';
    if (room) {
      url.searchParams.set('plan', room.key);
      url.searchParams.set('room', room.number);
      url.hash = 'units';
    }
    return url.href;
  }

  function mount() {
    if (document.getElementById('feedback-dialog')) return;
    const launch = document.createElement('button');
    launch.type = 'button';
    launch.id = 'feedback-open';
    launch.className = 'fb-launch';
    launch.setAttribute('aria-haspopup', 'dialog');
    launch.setAttribute('aria-controls', 'feedback-dialog');
    launch.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-new"/></svg>수정 의견';

    const dialog = document.createElement('dialog');
    dialog.id = 'feedback-dialog';
    dialog.className = 'fb-dialog';
    dialog.setAttribute('aria-labelledby', 'fb-title');
    dialog.innerHTML = `
      <header class="fb-head">
        <h2 id="fb-title">수정 의견</h2>
        <button type="button" class="fb-close" aria-label="수정 의견 창 닫기"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></button>
      </header>
      <form class="fb-form" method="get" action="${repo}/-/issues/new" target="_blank" rel="noopener noreferrer">
        <p class="fb-instructions">의견을 복사해 카카오톡으로 보내거나, 프로젝트 계정으로 GitLab에 등록할 수 있습니다.</p>
        <div class="fb-field">
          <label for="fb-section">의견을 남길 구역</label>
          <select id="fb-section" aria-describedby="fb-context"></select>
          <p class="fb-context" id="fb-context" hidden></p>
        </div>
        <div class="fb-field">
          <label for="fb-text">수정할 내용</label>
          <textarea id="fb-text" rows="4" required maxlength="1500" aria-describedby="fb-count"></textarea>
          <span class="fb-count" id="fb-count">0 / 1,500자</span>
        </div>
        <div class="fb-field">
          <label for="fb-name">작성자 <span>선택</span></label>
          <input id="fb-name" type="text" maxlength="60" autocomplete="off">
        </div>
        <input type="hidden" name="issue[title]">
        <input type="hidden" name="issue[description]">
        <div class="fb-actions">
          <button class="fb-submit" type="submit">GitLab 작성 화면 열기 <svg class="ico" aria-hidden="true"><use href="#i-open"/></svg></button>
          <button type="button" class="fb-copy">의견 복사</button>
        </div>
        <div class="fb-long">
          <a class="fb-issues" href="${repo}/-/issues?scope=all&amp;state=all&amp;in=title&amp;search=도안리버파크" target="_blank" rel="noopener noreferrer">등록된 의견 보기</a>
          <a class="fb-blank" hidden href="${repo}/-/issues/new" target="_blank" rel="noopener noreferrer">빈 이슈 작성 화면</a>
          <p class="fb-copy-note" role="status"></p>
        </div>
      </form>`;
    document.body.append(launch, dialog);
    const find = selector => dialog.querySelector(selector);
    const form = find('form');
    const sectionField = find('#fb-section');
    const bodyField = find('#fb-text');
    const nameField = find('#fb-name');
    const contextLine = find('#fb-context');
    const count = find('#fb-count');
    const longControls = find('.fb-long');
    const copyNote = find('.fb-copy-note');
    const issueTitle = find('input[name="issue[title]"]');
    const issueBody = find('input[name="issue[description]"]');
    const branch = meta('review-branch') || 'review/doan-riverpark';
    const kakaoReview = document.documentElement.dataset.feedback === 'kakao';
    const copyButton = find('.fb-copy');
    if (kakaoReview) {
      form.removeAttribute('action');
      find('.fb-submit').remove();
      find('.fb-issues').remove();
      copyButton.className = 'fb-submit';
      copyButton.textContent = '카톡 회신용 의견 복사';
      find('.fb-instructions').textContent = '수정할 내용을 적어 복사한 뒤, 이 링크를 받은 카카오톡 대화에 붙여넣어 주세요.';
    }
    for (const { name } of sections) sectionField.add(new Option(name, name));
    let selectedRoom = null;
    let lastOpened = '';

    function prepareDraft() {
      const section = sections.find(item => item.name === sectionField.value) || sections[0];
      const withRoom = section.hash === 'units' || section.hash === 'chat-launch';
      const room = withRoom ? selectedRoom : null;
      const text = bodyField.value.trim();
      const firstLine = (text.split(/\r?\n/, 1)[0] || '').slice(0, 65);
      const subject = room ? section.name + ' · ' + room.label : section.name;
      issueTitle.value = '[도안리버파크] ' + subject + (firstLine ? ' — ' + firstLine : ' 수정 의견');
      const lines = ['## 수정 의견', '', text, '', '## 확인할 화면', '', '- 구역　' + section.name];
      if (room) lines.push('- 선택 호실　' + room.label);
      lines.push('- 검토 브랜치　' + branch);
      const link = pageLink(section, room);
      if (link) lines.push('- [시안 화면 열기](' + link + ')');
      if (nameField.value.trim()) lines.push('- 작성자　' + nameField.value.trim());
      issueBody.value = lines.join('\n');
      contextLine.hidden = !room;
      contextLine.textContent = room ? '선택한 호실　' + room.label : '';
      count.textContent = bodyField.value.length.toLocaleString('ko-KR') + ' / 1,500자';
      const query = new URLSearchParams(new FormData(form));
      // Some GitLab proxies limit URL length. Keep the complete draft on hand.
      const isLong = !kakaoReview && query.toString().length >= 7000;
      find('.fb-blank').hidden = !isLong;
      copyNote.textContent = isLong ? '긴 의견은 복사해 빈 이슈에 붙여넣을 수 있습니다.' : '';
    }

    launch.addEventListener('click', () => {
      if (!bodyField.value.trim() || (lastOpened && lastOpened === issueBody.value)) {
        if (lastOpened && lastOpened === issueBody.value) {
          form.reset();
          lastOpened = '';
        }
        selectedRoom = currentRoom();
        sectionField.value = currentSection();
      }
      prepareDraft();
      dialog.showModal();
      bodyField.focus({ preventScroll: true });
    });
    find('.fb-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => launch.focus({ preventScroll: true }));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    form.addEventListener('input', () => {
      bodyField.setCustomValidity('');
      prepareDraft();
    });
    sectionField.addEventListener('change', prepareDraft);
    copyButton.addEventListener('click', async () => {
      if (!bodyField.value.trim()) {
        bodyField.setCustomValidity('수정할 내용을 입력해 주세요.');
        bodyField.reportValidity();
        return;
      }
      prepareDraft();
      const section = sectionField.value;
      const target = contextLine.hidden ? section : section + ' · ' + selectedRoom.label;
      const author = nameField.value.trim();
      const link = pageLink(sections.find(entry => entry.name === sectionField.value) || {}, contextLine.hidden ? null : selectedRoom);
      const message = ['도안리버파크 수정 의견', target, bodyField.value.trim(), author ? '작성자 ' + author : '', link].filter(Boolean).join('\n');
      try {
        await navigator.clipboard.writeText(message);
        copyNote.textContent = '의견을 복사했습니다. 카카오톡 대화에 붙여넣어 주세요.';
      } catch {
        const copy = document.createElement('textarea');
        copy.value = message;
        copy.readOnly = true;
        copy.setAttribute('aria-label', '복사할 의견 내용');
        longControls.querySelector('textarea')?.remove();
        longControls.append(copy);
        copy.focus();
        copy.select();
        copyNote.textContent = '선택된 본문을 복사해 주세요.';
      }
    });
    form.addEventListener('submit', event => {
      if (kakaoReview) {
        event.preventDefault();
        copyButton.click();
        return;
      }
      if (!bodyField.value.trim()) {
        event.preventDefault();
        bodyField.setCustomValidity('수정할 내용을 입력해 주세요.');
        bodyField.reportValidity();
        return;
      }
      prepareDraft();
      lastOpened = issueBody.value;
      // Native GET opens an editable GitLab draft. The reviewer submits it there.
    });
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
})();
