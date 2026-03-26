# <p align="center"><img src="./public/images/powerfit-logo.svg" alt="POWER.FIT Logo" width="400" /></p>

<img src="https://github.com/gui-bus/portfolio/blob/master/public/projects/powerfit.png?raw=true" width="100%" alt="Thumbnail Powerfit">

<p align="center">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="NextJS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/NextJS.svg">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="Tailwind" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
  <img alt="HeroUI" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/HeroUI.svg">
  <img alt="ShadCN" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/ShadCNUI.svg">
  <img alt="Framer Motion" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Framer%20Motion.svg">
  <img alt="Radix UI" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Radix.svg">
  <img alt="Lucide" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Lucide.svg">
  <img alt="Phosphor Icons" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Phosphor%20Icons.svg">
  <img alt="React Hook Form" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React%20Hook%20Form.svg">
  <img alt="React Query" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React%20Query.svg">
  <img alt="Tanstack Query" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Tanstack.svg">
  <img alt="Axios" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Axios.svg">
  <img alt="Zod" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Zod.svg">
  <img alt="Vercel" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Vercel.svg">
  <img alt="Vitest" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Vitest.svg">
  <img alt="Husky" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Husky.svg">
  <img alt="Conventional Commits" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Conventional%20Commits.svg">
  <img alt="Cursor" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Cursor.svg">
  <img alt="Gemini" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Gemini.svg">
  <img alt="Windsurf" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Windsurf.svg">
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

## 🧪 Engenharia de Qualidade

A robustez do código é validada por uma suíte de testes rigorosa:
- **Business Logic Tests:** Validação de cálculos de volume de treino e algoritmos de streak.
- **Component Integrity:** Testes de interface para garantir que fluxos críticos não falhem.
- **Contract Validation:** Garantia de que as respostas da API correspondem aos tipos gerados pelo Orval.
