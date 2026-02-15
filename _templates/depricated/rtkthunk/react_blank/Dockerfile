# Берем официальный образ Node.js для сборки приложения
FROM node:18.12.1 as build

WORKDIR /app

# Копируем package.json и yarn.lock (если есть)
COPY package.json yarn.lock ./

# Копируем остальные файлы и папки
COPY . .

# Устанавливаем зависимости
RUN yarn install

# Собираем приложение
RUN yarn build

# Берем образ nginx для раздачи статических файлов
FROM nginx:1.23.4-alpine

# Копируем собранный проект в образ nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
