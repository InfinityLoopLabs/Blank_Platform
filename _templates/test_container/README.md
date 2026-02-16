# Test Container (Go 1.25 + Node.js 26)

Контейнер для проверки двух репозиториев:

- `Platform` (корень этого монорепозитория)
- `_templates/react_template`

Что делает контейнер:

1. Показывает версии Go/Node/NPM.
2. Проверяет наличие `infinityloop.config.js` в обоих репозиториях.
3. Собирает CLI-библиотеку (`npm run build --workspace cli`).
4. Запускает CLI для каждого репозитория.

## Запуск

```bash
cd _templates/test_container
docker compose up --build
```

## Опционально: тянуть репозитории по URL

Можно передать URL двух репозиториев через переменные окружения:

```bash
cd _templates/test_container
REPO1_URL=https://github.com/example/platform.git \
REPO2_URL=https://github.com/example/react-template.git \
docker compose up --build
```

Если `REPO1_URL`/`REPO2_URL` не заданы, используются локальные volume-монты.
