(() => {
  'use strict';

  const launch = document.querySelector('#chat-launch');
  const dialog = document.querySelector('#chat-dialog');
  const form = document.querySelector('#chat-form');
  const field = document.querySelector('#chat-question');
  const send = form.querySelector('button');
  const chatScroll = document.querySelector('#chat-scroll');
  const transcript = document.querySelector('#chat-transcript');
  const intro = document.querySelector('#chat-intro');
  const reset = document.querySelector('#chat-reset');
  let history = [];
  let requestNumber = 0;
  let currentController;
  let returnTo;

  function textElement(tag, text, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function updateInput() {
    send.disabled = !field.value.trim();
    field.style.height = '40px';
    field.style.height = Math.min(88, Math.max(40, field.scrollHeight)) + 'px';
  }

  function scrollToBottom() {
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }

  function openChat(question) {
    if (!dialog.open) {
      returnTo = document.activeElement;
      dialog.showModal();
    }
    if (question) field.value = String(question).slice(0, 1000);
    updateInput();
    field.focus({ preventScroll: true });
    if (question) field.setSelectionRange(field.value.length, field.value.length);
  }
  launch.addEventListener('click', () => openChat());
  const openFromLink = () => { if (location.hash === '#consult') openChat(); };
  window.addEventListener('hashchange', openFromLink);
  openFromLink();
  document.querySelector('#chat-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (returnTo?.isConnected && typeof returnTo.focus === 'function') returnTo.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  window.addEventListener('doan:ask', event => openChat(event.detail?.question));

  function showEvidence(sources) {
    const details = document.createElement('details');
    details.className = 'chat-sources';
    const distinct = [...new Set(sources.map(item => item.document + ' ' + item.page + '쪽'))];
    details.append(textElement('summary', '근거 보기 · ' + distinct.join(', ')));
    for (const source of sources) {
      const evidence = document.createElement('div');
      evidence.className = 'evidence';
      evidence.append(textElement('b', source.title + ' (' + source.page + '쪽)'), textElement('p', source.quote));
      details.append(evidence);
    }
    return details;
  }

  function botTurn(answer) {
    const turn = document.createElement('div');
    turn.className = 'chat-turn assistant';
    turn.append(textElement('b', answer.provider === 'retrieval' ? '상가 자료 상담' : '상가 AI 상담', 'chat-by'), textElement('p', answer.answer, 'answer-text'));
    if (answer.sources?.length) turn.append(showEvidence(answer.sources));
    return turn;
  }

  function clearDetail() {
    requestNumber++;
    currentController?.abort();
    currentController = undefined;
    transcript.querySelectorAll('.chat-detail-button, .detail-status').forEach(element => element.remove());
  }

  async function detail(messages, button) {
    const serial = ++requestNumber;
    const controller = new AbortController();
    currentController = controller;
    button.hidden = true;
    const status = textElement('div', 'AI가 상세 답변을 작성하고 있습니다…', 'chat-turn pending detail-status');
    transcript.append(status);
    scrollToBottom();
    const deadline = setTimeout(() => controller.abort(), 145000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      const answer = await response.json();
      if (!response.ok || !answer.answer) throw new Error(answer.error || '상세 답변을 받지 못했습니다.');
      if (serial !== requestNumber) return;
      status.replaceWith(botTurn(answer));
      button.remove();
      history = [...messages, { role: 'assistant', content: answer.answer }].slice(-8);
    } catch (error) {
      if (serial !== requestNumber) return;
      status.textContent = error.name === 'AbortError' ? '상세 답변 시간이 길어졌습니다. 다시 요청할 수 있습니다.' : '상세 상담에 연결하지 못했습니다. 다시 요청할 수 있습니다.';
      button.hidden = false;
    } finally {
      clearTimeout(deadline);
      if (serial === requestNumber) {
        currentController = undefined;
        scrollToBottom();
      }
    }
  }

  function ask(question) {
    if (!question) return;
    clearDetail();
    intro.hidden = true;
    reset.hidden = false;
    const messages = [...history.slice(-8), { role: 'user', content: question }];
    const answer = window.doanHostedAnswer(messages);
    history = [...messages, { role: 'assistant', content: answer.answer }].slice(-8);
    const turn = botTurn(answer);
    if (document.documentElement.dataset.review !== 'static') {
      const more = textElement('button', 'AI 상세 답변', 'chat-detail-button');
      more.type = 'button';
      more.addEventListener('click', () => {
        transcript.querySelector('.detail-status')?.remove();
        void detail(messages, more);
      });
      turn.append(more);
    }
    transcript.append(textElement('div', question, 'chat-turn user'), turn);
    updateInput();
    scrollToBottom();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = field.value.trim();
    if (!question) return;
    field.value = '';
    void ask(question);
  });
  field.addEventListener('input', updateInput);
  field.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  for (const button of document.querySelectorAll('.suggestions button')) {
    button.addEventListener('click', () => void ask(button.textContent.trim()));
  }
  reset.addEventListener('click', () => {
    clearDetail();
    history = [];
    transcript.replaceChildren();
    intro.hidden = false;
    reset.hidden = true;
    field.value = '';
    updateInput();
    chatScroll.scrollTop = 0;
    field.focus();
  });
})();
