# NEIVUM 0.1 — Production checklist

## Домен и SEO

- [ ] Заменить placeholder canonical во всех трёх HTML-файлах на абсолютные HTTPS URL.
- [ ] Указать абсолютные production URL для `og:image`.
- [ ] Проверить Open Graph `index.html` и `about.html` через social debuggers.
- [ ] Сохранить `noindex,nofollow` для `app.html`, пока работает `INTERFACE DEMO`.
- [ ] Добавить `robots.txt` и `sitemap.xml` после фиксации домена.

## Безопасность

- [ ] Настроить CSP с разрешением `youtube-nocookie.com` только для `frame-src` страницы About.
- [ ] Настроить HSTS, `X-Content-Type-Options`, `Referrer-Policy` и `Permissions-Policy`.
- [ ] Не размещать API-ключи, приватные endpoints и секретные промпты во frontend.
- [ ] До реального сбора email добавить privacy policy, terms и backend consent flow.

## Контент и продукт

- [ ] Проверить, что публично представлен только PULSAR и везде указана версия NEIVUM 0.1.
- [ ] Проверить написание OrivantAI во всех видимых текстах и метаданных.
- [ ] Не убирать `INTERFACE DEMO` до реального подключения модели.
- [ ] Проверить официальный трейлер `https://youtu.be/l2cALhZG3f8` и fallback-ссылку.

## QA устройств

- [ ] Проверить 3840×2160, 2560×1440 и 1920×1080.
- [ ] Проверить ноутбуки, iPadOS/Safari, Android tablets.
- [ ] Проверить iOS Safari и Android Chrome на 390×844 и 360×800.
- [ ] Проверить mobile landscape и интерфейс приложения с открытой клавиатурой.
- [ ] Проверить `FULL`, `MOBILE`, `SAFE`, Data Saver и `prefers-reduced-motion`.
- [ ] Проверить возврат из WebGL context loss в Canvas fallback.

## Доступность

- [ ] Пройти весь продукт только клавиатурой.
- [ ] Проверить VoiceOver и TalkBack, названия кнопок, меню, настройки и статус плеера.
- [ ] Проверить контраст, focus-visible и масштаб браузера 200%.
- [ ] Проверить отсутствие ловушек фокуса в мобильном меню и настройках приложения.

## Производительность

- [ ] Запустить Lighthouse и Web Vitals на production-домене.
- [ ] Проверить GPU/frame time на слабом реальном телефоне.
- [ ] Настроить долгий immutable cache для версионированных PNG/WebP/OGG и короткий cache для HTML/SW.
- [ ] Проверить, что YouTube iframe отсутствует до нажатия PLAY.
- [ ] Проверить, что ambient OGG не загружается до пользовательского действия.
- [ ] При следующем релизе обновить строку `CACHE` в `sw.js`.

## Release

- [ ] Проверить все относительные пути на GitHub Pages project URL.
- [ ] Проверить отсутствие ошибок в консоли и 404 в Network.
- [ ] Проверить SOUND ON/OFF, громкость, переходы, локальную историю и удаление диалогов.
- [ ] Создать release tag и сохранить финальный ZIP отдельно от рабочей директории.
