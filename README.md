# NEIVUM 0.1 / PULSAR

Официальная статическая цифровая экосистема NEIVUM 0.1 от OrivantAI. В публичной сборке представлен только PULSAR — первый устойчивый сигнал развивающейся AI-платформы.

Проект состоит из трёх независимых, но визуально связанных страниц:

- `index.html` — официальный сайт и история первого сигнала;
- `about.html` — происхождение OrivantAI, NEIVUM 0.1 и официальный Launch Film;
- `app.html` — отдельный интерфейс NEIVUM с честно обозначенным локальным demo-режимом.

Сборка работает без npm, сборщика, фреймворков, CDN, удалённых шрифтов и внешних runtime-зависимостей. Единственная сеть, к которой страница обращается по действию пользователя, — privacy-enhanced YouTube-плеер официального трейлера.

## Запуск

Рекомендуемый способ:

```bash
python3 -m http.server 8080
```

Windows PowerShell:

```powershell
py -m http.server 8080
```

Откройте:

- `http://localhost:8080/` — официальный сайт;
- `http://localhost:8080/about.html` — OrivantAI и Launch Film;
- `http://localhost:8080/app.html` — интерфейс NEIVUM.

Для быстрой локальной проверки можно открыть `index.html` напрямую. Service Worker и установка PWA работают только через HTTP(S).

### Телефон в одной Wi-Fi-сети

1. Распакуйте проект на Windows-компьютере.
2. Запустите `START_NEIVUM_MOBILE.bat`.
3. Разрешите Python доступ для частной сети, если Windows Firewall задаст вопрос.
4. Подключите телефон к той же Wi-Fi-сети.
5. Откройте показанный адрес, например `http://192.168.1.24:8080/`.

### GitHub Pages

1. Загрузите в корень ветки `main` именно содержимое папки проекта, а не ZIP.
2. Проверьте, что `index.html`, `about.html`, `app.html`, `sw.js` и папка `neivum-assets` находятся в корне репозитория.
3. В `Settings → Pages` выберите `Deploy from a branch`, `main`, `/ (root)`.
4. После публикации выполните принудительную перезагрузку. Service Worker использует кэш `neivum-0.1-launch-v3` и удаляет предыдущие сборки `neivum-*`.

Все внутренние URL относительные и совместимы с project site GitHub Pages.

## Структура

```text
NEIVUM-0.1-Maximum/
├── index.html
├── about.html
├── app.html
├── manifest.webmanifest
├── sw.js
├── START_NEIVUM_MOBILE.bat
├── neivum-assets/
│   ├── device.js                 # FULL / MOBILE / SAFE capability profile
│   ├── core.js                   # звук, storage, переходы, Service Worker
│   ├── pulsar.js                 # WebGL2 renderer и локальные GLSL-шейдеры
│   ├── site.css / site.js        # официальный сайт и Canvas fallback
│   ├── about.css / about.js      # OrivantAI, Launch Film и click-to-load player
│   ├── app.css / app.js          # отдельный AI-интерфейс и локальные диалоги
│   ├── audio/
│   │   ├── neivum-ambient.ogg
│   │   ├── pulsar-activate.ogg
│   │   ├── interface-open.ogg
│   │   ├── message-send.ogg
│   │   └── message-receive.ogg
│   ├── neivum-launch-film-poster.webp
│   ├── neivum-about-og.png
│   ├── NEIVUM_YouTube_Banner_2560x1440.png
│   ├── NEIVUM_og_cover.png
│   ├── favicon.svg
│   └── PWA icons
├── source/NEIVUM_symbol_on_dark_4096.png
├── PRODUCTION_CHECKLIST.md
├── CHANGELOG.md
└── README.md
```

## Визуальная система PULSAR

`neivum-assets/pulsar.js` рисует процедурную нейтронную звезду полноэкранным WebGL2-шейдером:

- компактное холодное ядро с процедурной поверхностью;
- наклонённая вращающаяся магнитная ось;
- два противоположных направленных луча;
- дипольные линии магнитного поля;
- тонкий экваториальный плазменный слой;
- локальная линза, корона и ограниченные потоки частиц;
- реакция на курсор и прогресс истории без scroll-jacking.

Режим выбирается до запуска визуализации в `device.js`:

- `FULL` — WebGL2, расширенная магнитосфера, ограниченный DPR, до 60 FPS;
- `MOBILE` — упрощённый WebGL2, сниженный DPR, 30 FPS;
- `SAFE` — Canvas 2D, минимум blur и частиц, DPR 1;
- `prefers-reduced-motion` — почти статичный завершённый Canvas-образ.

При потере WebGL-контекста рендер автоматически заменяется Canvas-fallback. WebGL-ресурсы освобождаются при уходе со страницы, а анимация останавливается в неактивной вкладке.

Чтобы изменить объект, редактируйте `FRAGMENT_SHADER` в `pulsar.js`. Canvas-геометрия главной находится в `PulsarField` (`site.js`), About — в `AboutFallbackPulsar` (`about.js`), приложения — в `CompactSignal` (`app.js`).

## Launch Film

Официальный трейлер: `https://youtu.be/l2cALhZG3f8`.

Он размещён только в `about.html#launch-film`. До нажатия PLAY iframe отсутствует: браузер загружает локальный WebP-постер. После прямого действия пользователя `about.js` создаёт iframe:

```text
https://www.youtube-nocookie.com/embed/l2cALhZG3f8
```

Плеер сохраняет 16:9, имеет доступные loading/status-состояния, кнопку закрытия и прямую fallback-ссылку на YouTube. Если атмосфера NEIVUM звучала, она плавно затухает перед запуском фильма. Возврат музыки выполняется только отдельной кнопкой пользователя.

Исходный баннер: `neivum-assets/NEIVUM_YouTube_Banner_2560x1440.png`. Оптимизированный постер: `neivum-assets/neivum-launch-film-poster.webp`.

## Музыка и звук

`neivum-assets/audio/neivum-ambient.ogg` — оригинальная 96-секундная композиция, созданная для NEIVUM. Чужая музыка и сторонние сэмплы не используются.

- при первом посещении звук выключен;
- запуск только через `SOUND OFF`;
- доступно плавное включение/выключение и регулирование громкости;
- состояние, громкость и позиция сохраняются между страницами;
- аудио использует `preload="none"` и не загружается заранее;
- интерфейсные сигналы также локальные.

Общая логика находится в `SoundSystem` файла `core.js`. Методы `duckForMedia()` и `restoreAfterMedia()` координируют музыку и трейлер.

## AI-приложение

`app.html` не является секцией лендинга. Реализованы:

- создание, выбор и удаление локальных диалогов;
- история в `localStorage`;
- многострочный composer и отправка по `Enter`;
- стартовые направления и подготовленные локальные ответы;
- RU/EN, мобильная панель, настройки, звук и громкость;
- адаптация Visual Viewport, safe-area и экранной клавиатуры;
- маркировка `INTERFACE DEMO` и `noindex`.

Сообщения не отправляются OrivantAI или сторонним сервисам. Текущие ключи хранения: `neivum.threads.v1` и `neivum.activeThread`.

## Подключение настоящего NEIVUM API

Точка интеграции в начале `app.js`:

```js
const API_CONFIG = Object.freeze({ endpoint: null, mode: "demo" });
```

1. Создайте защищённый backend/proxy с HTTPS, авторизацией, rate limiting и валидацией.
2. На backend подключите модель и секреты.
3. Укажите публичный endpoint в `API_CONFIG.endpoint` и переключите режим только после готовности backend.
4. Адаптируйте контракт `NeivumApiProvider.send()`; для streaming добавьте серверный протокол и `AbortController`.
5. Уберите `INTERFACE DEMO` только после фактического подключения и QA.

Никогда не размещайте API-ключ во frontend-коде.

## Тексты, язык и версия

- главная: разметка `index.html`, переводы `site.js`;
- About: разметка `about.html`, переводы `about.js`;
- приложение: разметка `app.html`, переводы `app.js`;
- палитра и базовая типографика: переменные в начале `site.css` и `app.css`;
- метаданные: `<head>` каждой страницы;
- версия: поиск по `NEIVUM 0.1`, `BUILD 0.1` и `version: "0.1"`.

После изменения версии синхронно обновите HTML, переводы, API payload, Open Graph, manifest, Service Worker и документацию.

## Production

Перед публичным релизом выполните [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md). Главные обязательные действия: заменить placeholder canonical на абсолютный домен, настроить HTTP security headers, проверить реальные телефоны/скринридеры и подключать сбор email/API только после появления backend и юридических документов.
