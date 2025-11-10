// assets/slider.js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slider').forEach((slider) => {
    const track = slider.querySelector('.slider__track');
    const radios = Array.from(slider.querySelectorAll('input[type="radio"][name]'));
    if (!track || radios.length === 0) return;

    // индекс активного слайда
    let idx = Math.max(0, radios.findIndex(r => r.checked));
    if (idx < 0) idx = 0;

    // дать фокус по Tab для клавиатуры
    if (!slider.hasAttribute('tabindex')) slider.setAttribute('tabindex', '0');

    // установка слайда (и синхронизация с радио)
    const setIndex = (i) => {
      const n = radios.length;
      idx = (i % n + n) % n; // кольцевой переход
      if (!radios[idx].checked) radios[idx].checked = true;
      // управляй трансформацией напрямую — надёжнее, чем через CSS :checked
      track.style.transform = `translateX(${-100 * idx}%)`;
    };

    // инициализация
    setIndex(idx);

    // обработчики стрелок
    slider.querySelectorAll('.slider__arrows .next').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndex(idx + 1);
      });
    });
    slider.querySelectorAll('.slider__arrows .prev').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndex(idx - 1);
      });
    });

    // клик по точкам/лейблам (радио сменилось → двинем трек)
    slider.addEventListener('change', () => {
      const i = radios.findIndex(r => r.checked);
      if (i >= 0) setIndex(i);
    });

    // клавиатура
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { setIndex(idx + 1); }
      else if (e.key === 'ArrowLeft') { setIndex(idx - 1); }
    });

    // свайпы на тач-экранах
    let startX = null;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) setIndex(idx + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  });
});
