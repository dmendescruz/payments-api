# 🔐 payments-api

API segura para consulta centralizada de boletos a pagar de múltiplos serviços.

## Stack
- Node.js + TypeScript
- PostgreSQL + Redis
- JWT RS256
- Docker + Docker Compose

## Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

## Instalação
```bash
git clone git@github.com:SEU-USUARIO/payments-api.git
cd payments-api
cp .env.example .env
npm install
```

## Rodando localmente
```bash
docker compose up -d   # sobe banco e redis
npm run dev            # inicia a API
```

## Testes
```bash
npm test
```

## Status
🚧 Em desenvolvimento — Fase 1