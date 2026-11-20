(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-nav');
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
    menuButton.querySelector('use').setAttribute('href', '#i-menu');
  };
  menuButton.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', '메뉴 닫기');
    menuButton.querySelector('use').setAttribute('href', '#i-close');
  });
  menu.addEventListener('click', closeMenu);
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.masthead') && menu.classList.contains('is-open')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia('(min-width:801px)').addEventListener('change', closeMenu);

  const views = [
    { image: 'river', title: '수변에서 본 단지', alt: '수변 산책로 너머로 이어지는 힐스테이트 도안리버파크 주거동 투시도' },
    { image: 'garden', title: '녹지에서 본 단지', alt: '녹지에서 바라본 힐스테이트 도안리버파크 주거동 외관 투시도' },
    { image: 'district', title: '단지 전체 전경', alt: '단지 앞 다리와 수변 녹지를 함께 담은 도안리버파크 파노라마 투시도' },
  ];
  let viewIndex = 0;
  const heroImage = document.querySelector('#hero-image');
  const heroSource = document.querySelector('#hero-pic source');
  const asset = path => window.doanEmbeddedAssets?.[path] ?? path;
  const setView = step => {
    viewIndex = (viewIndex + step + views.length) % views.length;
    const current = views[viewIndex];
    const path = 'assets/site/' + current.image;
    heroSource.srcset = asset(path + '-small.webp');
    heroImage.src = asset(path + '.webp');
    heroImage.alt = current.alt;
    document.querySelector('#hero-caption').textContent = current.title;
    document.querySelector('#slide-current').textContent = String(viewIndex + 1).padStart(2, '0');
  };
  document.querySelector('#hero-prev').addEventListener('click', () => setView(-1));
  document.querySelector('#hero-next').addEventListener('click', () => setView(1));

  const resources = {
    aerial: { title: '단지 조감도', note: '완공 후 모습을 예상해 그린 그림입니다.', alt: '상공에서 내려다본 도안리버파크 주거동과 단지 주변' },
    community: { title: '5블록 주민공동시설 배치도', note: '입주민이 함께 쓰는 시설의 배치입니다.', alt: '5블록 공동주택에 계획된 입주민 커뮤니티 공간 배치' },
    home: { title: '공동주택 84A 확장형', note: '아파트 안의 방과 거실 배치를 보여 줍니다.', alt: '공동주택 84A 확장형의 실내 공간 배치' },
  };
  const choices = [...document.querySelectorAll('.ref-choice')];
  const referenceImage = document.querySelector('#reference-image');
  const referenceOpen = document.querySelector('#reference-open');
  const referenceCaption = document.querySelector('#reference-caption');
  for (const choice of choices) {
    choice.addEventListener('click', () => {
      const key = choice.dataset.resource;
      const resource = resources[key];
      for (const item of choices) {
        const selected = item === choice;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      }
      const src = asset('assets/site/' + key + '.webp');
      referenceImage.src = src;
      referenceImage.alt = resource.alt;
      referenceOpen.dataset.title = resource.title;
      referenceOpen.dataset.image = src;
      referenceOpen.classList.toggle('is-plan', key !== 'aerial');
      referenceOpen.setAttribute('aria-label', resource.title + ' 확대');
      const note = document.createElement('span');
      note.textContent = resource.note;
      referenceCaption.replaceChildren(resource.title + ' ', note);
    });
  }

  const viewer = document.querySelector('#image-dialog');
  const large = document.querySelector('#image-large');
  for (const trigger of document.querySelectorAll('.open-image')) {
    trigger.addEventListener('click', () => {
      document.querySelector('#image-dialog-title').textContent = trigger.dataset.title;
      large.alt = trigger.querySelector('img').alt;
      large.src = trigger.dataset.image;
      viewer.showModal();
    });
  }
  document.querySelector('#image-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
})();
