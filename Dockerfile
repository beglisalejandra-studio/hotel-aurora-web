# Perfil de alojamiento "standalone" (VPS, Docker, Kubernetes…). Ver docs/architecture/HOSTING.md.
# Construir:  docker build -t web .      Ejecutar:  docker run -p 3000:3000 --env-file .env web
# Las imágenes base se fijan por versión; fija además el digest (@sha256:…) al desplegar en producción.
FROM node:22.20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV BUILD_TARGET=standalone NEXT_TELEMETRY_DISABLED=1
# Las variables NEXT_PUBLIC_* se incrustan en el build: pásalas con --build-arg.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_ENV
RUN npm run build

FROM node:22.20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
