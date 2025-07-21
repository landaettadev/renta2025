# Dockerfile para Angular Frontend
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build -- --output-path=dist/renta-facil-frontend

FROM nginx:alpine
COPY --from=build /app/dist/renta-facil-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 