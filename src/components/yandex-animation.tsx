import { JSX, useEffect, useRef } from 'react';

/**
 * Конфигурация отдельного блоба (цветного пятна) в анимации
 */
interface BlobConfig {
  r: number;          // Радиус блоба
  color: string;      // Цвет блоба в HEX формате
  dir: number;        // Направление вращения (1 или -1)
  omega: number;      // Угловая скорость вращения
  drift: number;      // Скорость дрейфа (изменения орбиты)
  orbitBase: number;  // Базовый радиус орбиты
  orbitAmp: number;   // Амплитуда колебания орбиты
  phase: number;      // Начальная фаза анимации
}

/**
 * Общая конфигурация анимации
 */
interface AnimationConfig {
  blobs: number;                    // Количество блобов
  radiusPct: [number, number];      // Диапазон размеров блобов в процентах
  blur: number;                     // Степень размытия
  colors: string[];                 // Палитра цветов для блобов
  omega: [number, number];          // Диапазон угловых скоростей
  drift: [number, number];          // Диапазон скоростей дрейфа
  speedMul: number;                 // Общий множитель скорости анимации
  orbitBase: [number, number];      // Диапазон базовых радиусов орбит
  orbitAmp: [number, number];       // Диапазон амплитуд колебания орбит
  pulse: number;                    // Амплитуда пульсации блобов
}

/**
 * RGB цвет
 */
interface RgbColor {
  r: number;  // Красный компонент (0-255)
  g: number;  // Зеленый компонент (0-255)
  b: number;  // Синий компонент (0-255)
}

/**
 * Тип функции генератора случайных чисел
 */
type RandomFunction = () => number;

/**
 * Компонент анимированного градиента в стиле Yandex Music
 * Создает плавную анимацию цветных блобов на темном фоне
 */
export default function YandexMusicGradient(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /**
     * Генератор псевдослучайных чисел Mulberry32
     * Обеспечивает воспроизводимую последовательность случайных чисел
     * @param seed - начальное значение для генератора
     * @returns функция, возвращающая случайное число от 0 до 1
     */
    function mulberry32(seed: number): RandomFunction {
      return function (): number {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // Инициализация генератора случайных чисел с фиксированным seed
    const seed: number = 123456789;
    const rnd: RandomFunction = mulberry32(seed);
    
    /**
     * Генерирует случайное число в заданном диапазоне
     * @param a - минимальное значение
     * @param b - максимальное значение
     * @returns случайное число между a и b
     */
    const rand = (a: number, b: number): number => a + rnd() * (b - a);

    /**
     * Конфигурация анимации с параметрами блобов
     */
    const cfg: AnimationConfig = {
      blobs: 8,                                                     // Количество анимированных блобов
      radiusPct: [18, 46],                                         // Размер блобов от 18% до 46% от минимального размера экрана
      blur: 110,                                                   // Коэффициент размытия
      colors: ['#FFB36D', '#FA8F33', '#EA620C', '#C7520A', '#A04609'], // Оранжевая палитра цветов
      omega: [0.35, 0.9],                                          // Диапазон угловых скоростей вращения
      drift: [0.18, 0.5],                                          // Диапазон скоростей дрейфа орбит
      speedMul: 1.6,                                               // Общий множитель скорости анимации
      orbitBase: [0.18, 0.42],                                     // Диапазон базовых радиусов орбит (в долях от размера экрана)
      orbitAmp: [0.06, 0.18],                                      // Диапазон амплитуд колебания орбит
      pulse: 0.16,                                                 // Амплитуда пульсации размера блобов
    };

    // Получение canvas элемента и контекста рисования
    const cvs = canvasRef.current;
    if (!cvs) return;
    
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    
    // Переменные для размеров canvas
    let W: number, H: number, M: number; // Ширина, высота, минимальный размер
    const TAU: number = Math.PI * 2;     // Полный оборот в радианах

    /**
     * Функция изменения размера canvas при изменении размера окна
     * Учитывает devicePixelRatio для четкого отображения на Retina дисплеях
     */
    function resize(): void {
      if (!cvs) return;
      // Ограничиваем соотношение пикселей для производительности
      const ratio: number = Math.min(window.devicePixelRatio || 1.5, 2.5);
      
      // Устанавливаем реальные размеры canvas с учетом pixel ratio
      W = cvs.width = Math.floor(window.innerWidth * ratio);
      H = cvs.height = Math.floor(window.innerHeight * ratio);
      M = Math.min(W, H); // Минимальный размер для масштабирования элементов
      
      // Устанавливаем CSS размеры для корректного отображения
      cvs.style.width = window.innerWidth + 'px';
      cvs.style.height = window.innerHeight + 'px';
    }

    // Обработчик изменения размера окна
    const resizeHandler = (): void => resize();
    window.addEventListener('resize', resizeHandler, { passive: true });
    resize(); // Инициальная установка размеров

    /**
     * Создание массива блобов с случайными параметрами
     * Каждый блоб получает уникальные характеристики движения и внешнего вида
     */
    const blobs: BlobConfig[] = Array.from({ length: cfg.blobs }, (_, i) => {
      const phase: number = rand(0, TAU); // Случайная начальная фаза
      return {
        r: (rand(cfg.radiusPct[0], cfg.radiusPct[1]) / 100) * M,    // Радиус блоба
        color: cfg.colors[i % cfg.colors.length],                   // Цвет из палитры (циклично)
        dir: i % 2 ? 1 : -1,                                       // Чередующееся направление вращения
        omega: rand(cfg.omega[0], cfg.omega[1]),                   // Случайная угловая скорость
        drift: rand(cfg.drift[0], cfg.drift[1]),                   // Случайная скорость дрейфа
        orbitBase: rand(cfg.orbitBase[0], cfg.orbitBase[1]) * M,   // Базовый радиус орбиты
        orbitAmp: rand(cfg.orbitAmp[0], cfg.orbitAmp[1]) * M,      // Амплитуда колебания орбиты
        phase,
      };
    });

    // Установка режима смешивания для эффекта свечения
    ctx.globalCompositeOperation = 'lighter';

    // Счетчик времени анимации
    let t: number = 0;

    /**
     * Конвертирует HEX цвет в RGB компоненты
     * @param hex - цвет в формате HEX (например, "#FF0000")
     * @returns объект с компонентами r, g, b (0-255)
     */
    function hexToRgb(hex: string): RgbColor {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m
        ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
        : { r: 255, g: 255, b: 255 }; // Белый цвет по умолчанию
    }

    /**
     * Основная функция рендеринга кадра анимации
     * Вызывается для каждого кадра через requestAnimationFrame
     */
    function frame(): void {
      if (!ctx) return
      
      // Очистка canvas с прозрачным фоном
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);

      // Создание радиального градиента для виньетирования
      const vg: CanvasGradient = ctx.createRadialGradient(
        W * 0.5, H * 0.2, M * 0.15,  // Внутренний круг (светлый центр в верхней части)
        W * 0.5, H * 0.4, M * 0.9    // Внешний круг (темные края)
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');      // Прозрачный центр
      vg.addColorStop(1, 'rgba(0,0,0,0.62)');   // Полупрозрачные края
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Переключение в режим аддитивного смешивания для эффекта свечения
      ctx.globalCompositeOperation = 'lighter';

      // Отрисовка каждого блоба
      for (const b of blobs) {
        // Вычисление текущего угла поворота блоба
        const a: number = b.phase + b.dir * b.omega * cfg.speedMul * t;
        
        // Вычисление динамического радиуса орбиты с колебанием
        const R: number = b.orbitBase + Math.sin(t * b.drift * cfg.speedMul) * b.orbitAmp;
        
        // Вычисление позиции блоба на орбите
        const x: number = W * 0.5 + Math.cos(a) * R;           // X координата (центр экрана + смещение)
        const y: number = H * 0.35 + Math.sin(a) * R * 0.88;   // Y координата (верхняя часть экрана с дрейфом к центру)

        // Вычисление пульсации размера блоба
        const pul: number = 1 + Math.sin(t * b.drift * 1.3) * cfg.pulse;
        const rr: number = b.r * pul; // Текущий радиус с учетом пульсации

        // Конвертация цвета в RGB компоненты
        const { r, g, b: bb }: RgbColor = hexToRgb(b.color);
        
        // Создаем более мягкий градиент для имитации размытия
        const blurRadius = cfg.blur * 2.5; // Коэффициент для имитации размытия
        const grad: CanvasGradient = ctx.createRadialGradient(
          x, y, rr * 0.02,        // Внутренний круг (яркий центр)
          x, y, rr + blurRadius   // Внешний круг (размытые края)
        );
        
        // Добавляем больше цветовых остановок для более плавного перехода
        grad.addColorStop(0, `rgba(${r},${g},${bb},0.95)`);    // Почти непрозрачный центр
        grad.addColorStop(0.1, `rgba(${r},${g},${bb},0.8)`);   // Яркая область
        grad.addColorStop(0.3, `rgba(${r},${g},${bb},0.5)`);   // Средняя яркость
        grad.addColorStop(0.6, `rgba(${r},${g},${bb},0.2)`);   // Слабое свечение
        grad.addColorStop(0.8, `rgba(${r},${g},${bb},0.05)`);  // Едва заметное свечение
        grad.addColorStop(1, `rgba(${r},${g},${bb},0)`);       // Полная прозрачность

        // Применение градиента и отрисовка блоба
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, rr + blurRadius, 0, TAU); // Круг с размытыми краями
        ctx.fill();
      }

      // Обновление времени анимации (примерно 60 FPS)
      t += 1 / 60;
      
      // Запрос следующего кадра анимации
      requestAnimationFrame(frame);
    }

    // Запуск анимации
    frame();

    // Очистка обработчика событий при размонтировании компонента
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
