# <img src="https://cdn-icons-png.flaticon.com/512/2065/2065064.png" width="40" height="40" /> Rede Social Tess

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

---

## 📖 Sobre o Projeto

Este projeto é uma **Rede Social completa**, desenvolvida com foco em arquitetura escalável e segurança. O principal objetivo foi o aprendizado na construção de sistemas de **Autenticação** sem um serviço de IAM externo, manipulação avançada de **CRUDs**, integração de **Webhooks** e sincronização de dados em tempo real entre o Backend (Node/Prisma) e o Frontend (React).

> **O Desafio:** Criar uma experiência de usuário fluida, lidando com persistência de sessão, moderação de conteúdo e alimentação dinâmica de dados vindos do banco de dados.

---

## 🚀 Funcionalidades Principais

* 🔐 **Autenticação Avançada:** Login/Registro robusto, gerenciamento de Tokens (JWT) e proteção de rotas privadas.
* 📊 **Dashboard Administrativo:** Gráficos interativos com `Recharts` para análise de métricas e engajamento.
* 🛡️ **Moderação (Painel de Suporte):** Sistema completo para banimento de usuários e gestão de denúncias de posts/perfis.
* 💬 **Interatividade:** Feed dinâmico com suporte a Markdown, emojis, sistema de curtidas e comentários.
* 🌓 **Dark Mode:** Interface adaptável com suporte nativo a temas escuros e claros.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion |
| **UI Components** | Radix UI, Shadcn/ui, Lucide Icons |
| **Formulários** | React Hook Form + Zod |
| **Backend** | Node.js, Express, Socket.io, Prisma ORM |

---

## 🧠 Aprendizados e Desafios Técnicos

1. **Segurança de Sessão:** Implementação de cookies `httpOnly` e `Secure`, configurando políticas de *SameSite* para compatibilidade mobile.
2. **Arquitetura de Estado:** Uso de Context API para gerenciar estados globais e fluxos de permissão (Admin vs Usuário).
3. **Otimização de Performance:** Renderização eficiente de grandes volumes de dados no feed.
4. **Reverse Proxy:** Configuração de `rewrites` na Vercel para contornar problemas de cookies de terceiros.

---

## 💻 Como Acessar o Projeto

O projeto está publicado e pode ser acessado diretamente pelo link abaixo:

### 🔗 [Acessar Rede Social Tess](https://tess-redesocial.vercel.app/)
