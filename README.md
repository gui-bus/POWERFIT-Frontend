# <p align="center"><img src="./public/images/powerfit-logo.svg" alt="POWER.FIT Logo" width="400" /></p>

<p align="center">
  <strong>A Próxima Geração de Gestão Fitness: Inteligência Artificial, Gamificação e Performance.</strong>
</p>

<p align="center">
  <a href="https://powerfit.guibus.dev/"><img src="https://img.shields.io/badge/Live_Demo-POWER.FIT-orange?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://powerfit-api.guibus.dev/"><img src="https://img.shields.io/badge/API_Docs-Scalar-blue?style=for-the-badge&logo=scalar" alt="API Docs" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/BetterAuth-1.4-red?style=flat-square" alt="BetterAuth" />
  <img src="https://img.shields.io/badge/AI_SDK-Vercel-black?style=flat-square&logo=vercel" alt="AI SDK" />
  <img src="https://img.shields.io/badge/Orval-Type--Safe-green?style=flat-square" alt="Orval" />
  <img src="https://img.shields.io/badge/Vitest-4.x-yellow?style=flat-square&logo=vitest" alt="Vitest" />
</p>

---

## 📖 Panorama Geral

O **POWER.FIT** é uma plataforma de engenharia de software aplicada ao fitness de alta performance. Desenvolvido para resolver a fragmentação entre o registro de treinos, o acompanhamento nutricional e a motivação social, o projeto utiliza o estado da arte do ecossistema JavaScript/TypeScript para entregar uma SPA (Single Page Application) com performance de SSR (Server Side Rendering).

### 🎯 Diferenciais Estratégicos
- **IA Generativa Nativa:** Não apenas um chatbot, mas um orquestrador que automatiza a criação de planos de treino e navegação.
- **Arquitetura Orientada a Contratos:** Frontend e Backend sincronizados via Swagger/Orval, garantindo erro zero em integração.
- **Design System de Alta Fidelidade:** Construído sobre Tailwind v4 e OKLCH, garantindo consistência visual e acessibilidade em qualquer tema.

---

## ✨ Ecossistema de Funcionalidades

### 🧠 Core de Inteligência Artificial
Integrado com o **Vercel AI SDK**, o assistente virtual do POWER.FIT possui consciência do contexto do usuário:
- **Auto-Workout Generation:** Gera treinos completos baseados em linguagem natural.
- **UI-Driven Feedback:** O chat monitora o progresso da IA e executa ações de navegação (redirecionamento automático) após a criação bem-sucedida de planos.
- **Stream de Respostas:** Experiência de conversação em tempo real via Edge Runtime.

### 🏋️ Engine de Treino & UX
- **Dynamic Workout Session:** Timer de descanso inteligente, tracking de volume e progressão de carga.
- **Interactive D&D:** Reordenação de exercícios e dias de treino via `@dnd-kit` com sensores de toque otimizados.
- **Consistency Visualization:** Grid de atividades inspirado no GitHub, permitindo análise visual de retenção e constância.

### 🏆 Gamificação & Networking
- **Global & Social Rankings:** Competição baseada em volume de treino e frequência.
- **Dual Systems:** Sistema de duelos entre usuários para metas de curto prazo.
- **Achievements Pipeline:** Sistema de conquistas assíncrono que celebra marcos de performance.

---

## 🛠️ Deep Dive Tecnológico

### Arquitetura de Frontend
O projeto utiliza **Next.js 16 (App Router)** explorando:
- **Server Components (RSC):** Para fetching de dados em rede privada (API backend).
- **Client Components:** Estrategicamente utilizados para interatividade rica e gerenciamento de estado local.
- **Hydration Strategy:** Dados buscados no servidor são passados para o cliente para evitar "flickering" e melhorar o SEO/LCP.

### Tipagem e Segurança de Dados
- **Orval Integration:** O projeto gera automaticamente hooks e tipos TypeScript a partir do Swagger da API. Isso elimina a necessidade de definir interfaces manualmente e previne bugs de runtime.
- **Strict Typing:** Configuração de TypeScript `strict: true`, garantindo que toda a aplicação seja resiliente a erros de nulo e indefinido.

### Estilização Next-Gen
- **Tailwind CSS v4:** O POWER.FIT é um dos meus primeiros projetos a adotar a v4, utilizando a engine baseada em CSS moderno e variáveis nativas.
- **OKLCH Color Space:** Todas as cores são definidas em OKLCH para garantir gradientes perfeitos e legibilidade superior em telas HDR.

---

## 🏗️ Estrutura Arquitetural

```text
├── app/                  # Next.js 16 App Router
│   ├── (dashboard)/      # Rotas autenticadas e dashboards complexos
│   ├── auth/             # Integração com BetterAuth Client
│   └── globals.css       # Design Tokens e Tailwind v4 Config
├── components/           # Componentes
├── hooks/                # Hooks de infraestrutura (nuqs, debounce, scroll)
├── lib/                  # Camada de Serviço e Infraestrutura
│   ├── api/              # Fetch-generated via Orval (Type-Safe API)
│   ├── authClient.ts     # Configuração BetterAuth
│   └── utils/            # Motores de cálculo (Volume, Streak, Animations)
├── tests/                # Qualidade: Vitest + Testing Library
└── package.json          # Modern Stack (React 19, Next 16, Tailwind 4)
```

---

## 🧪 Engenharia de Qualidade

A robustez do código é validada por uma suíte de testes rigorosa:
- **Business Logic Tests:** Validação de cálculos de volume de treino e algoritmos de streak.
- **Component Integrity:** Testes de interface para garantir que fluxos críticos não falhem.
- **Contract Validation:** Garantia de que as respostas da API correspondem aos tipos gerados pelo Orval.

Para rodar os testes:
```bash
pnpm test
```