// أدوات مختصرة
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* 1) تبديل قائمة الموبايل */
(() => {
  const toggle = $('.toggle');
  const menu = $('.menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  // إغلاق عند النقر خارج/على رابط
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) menu.classList.remove('open');
    if (e.target.closest('.menu a')) menu.classList.remove('open');
  });
})();

/* 2) تفعيل الرابط حسب القسم + تمرير سلس */
(() => {
  const links = $$('.menu a[href^="#"]');
  // تمرير سلس يدوي لضمان دعم واسع
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 80; // تعويض الهيدر
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', id);
    });
  });

  // مراقبة الأقسام
  const sections = links
    .map(a => a.getAttribute('href'))
    .filter(Boolean)
    .map(id => $(id))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => observer.observe(sec));
})();

/* 3) الهيدر المتحوّل عند التمرير */
(() => {
  const header = $('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* 4) أكورديون الأسئلة الشائعة */
(() => {
  const items = $$('.faq-item');
  items.forEach(item => {
    const btn = $('.faq-q', item);
    const panel = $('.faq-a', item);
    if (!btn || !panel) return;

    const setHeight = (open) => {
      if (open) {
        panel.style.height = 'auto';
        const h = panel.clientHeight + 'px';
        panel.style.height = '0px';
        requestAnimationFrame(() => panel.style.height = h);
      } else {
        panel.style.height = panel.clientHeight + 'px';
        requestAnimationFrame(() => panel.style.height = '0px');
      }
    };

    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      // أغلق البقية (سلوك اختياري)
      items.forEach(i => { if (i !== item) { i.classList.remove('open'); const p = $('.faq-a', i); if (p) p.style.height = '0px'; } });
      setHeight(isOpen);
    });

    // إعداد مبدئي للتي فيها مفتوحة بالـ HTML (لو وجدت)
    if (item.classList.contains('open')) setHeight(true);
  });
})();

/* 5) إظهار العناصر عند الظهور */
(() => {
  const items = $$('[data-animate]');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    })
  }, { threshold: 0.08 });
  items.forEach(el => io.observe(el));
})();

/* 6) زر واتساب (اختياري: حدث تتبّع/تأكيد) */
(() => {
  const w = $('.whatsapp-fab');
  if (!w) return;
  w.addEventListener('click', () => {
    // مثال تتبع أو رسالة
    // console.log('WhatsApp clicked');
  });
})();

