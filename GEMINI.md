# GEMINI.md - Contexto do Projeto FIT APP Front-end

Este arquivo serve como guia de contexto para o agente Gemini ao trabalhar neste repositório. Ele define os padrões técnicos, ferramentas e fluxos de trabalho obrigatórios.

---

## 📋 Sumário

- [Visão Geral do Projeto](#-visão-geral-do-projeto)
- [🛠️ Tecnologias e Ferramentas](#️-tecnologias-e-ferramentas)
- [🤖 MCPs (Model Context Protocol)](#-mcps-model-context-protocol)
- [💻 Comandos de Desenvolvimento](#-comandos-de-desenvolvimento)
- [📏 Padrões de Engenharia](#-padrões-de-engenharia)
- [📝 Padrões de Commit e Git](#-padrões-de-commit-e-git)
- [🎨 Estilização e Tematização](#-estilização-e-tematização)
- [📦 Implementação de Funcionalidades](#-implementação-de-funcionalidades)
- [📡 API e Data Fetching](#-api-e-data-fetching)

---

## 🌟 Visão Geral do Projeto

Você atua como um engenheiro de software sênior especializado em desenvolvimento web moderno. O foco é entregar soluções de alta qualidade, escaláveis e fáceis de manter, utilizando o estado da arte do ecossistema React/Next.js.

### 🏷️ Branding e Identidade
- **Nome do Projeto:** **POWER.FIT**
- **Logo:** Em contextos reduzidos (como sidebars), utilize apenas a letra **P.** (em itálico e negrito).
- **Cores da Marca:** O projeto utiliza tons de **laranja** como cor principal, definidos pela variável `--primary` no CSS.

## 🛠️ Tecnologias e Ferramentas

- **Core:** Next.js 15 (App Router), React 19, TypeScript.
- **Estilização:** Tailwind CSS v4, shadcn/ui.
- **Dados:** Postgres, PRISMA.
- **Formulários:** React Hook Form, Zod.
- **Autenticação:** BetterAuth.
- **API:** Orval (geração de hooks TanStack Query).
- **Utilidades:** pnpm, dayjs.

## 🤖 MCPs (Model Context Protocol)

- **Documentação:** **SEMPRE** use o MCP do Context7 para buscar documentações atualizadas.
- **Busca Semântica:** **SEMPRE** use o Serena MCP para recuperar código e utilizar ferramentas de edição.

## 💻 Comandos de Desenvolvimento

| Comando | Descrição |
| :--- | :--- |
| `pnpm install` | Instala as dependências do projeto. |
| `pnpm dev` | Inicia o servidor de desenvolvimento. |
| `pnpm build` | Gera o build de produção. |
| `pnpm start` | Inicia o servidor em modo de produção. |
| `pnpm lint` | Executa a verificação de linting. |
| `npx orval` | Regenera as funções e tipos da API. |

---

## 📏 Padrões de Engenharia

### Tipagem e Qualidade
- **Tipagem Estrita:** O uso de `any` é **ESTRITAMENTE PROIBIDO**. Utilize interfaces e tipos precisos.
- **Clean Code:** Siga os princípios SOLID. Use nomes descritivos (ex: `isLoading`, `hasError`).
- **Nomenclatura:** Use `camelCase` para nomes de pastas e arquivos.
- **Comentários:** **NUNCA** escreva comentários explicativos no código; o código deve ser autoexplicativo.
- **DRY:** Evite duplicidade. Centralize lógicas repetitivas em funções ou componentes reutilizáveis.

### 📝 Padrões de Commit e Git
- **Conventional Commits:** **SEMPRE** utilize o padrão Conventional Commits (ex: `feat:`, `fix:`, `chore:`, `refactor:`).
- **Idioma:** As mensagens de commit devem ser escritas **OBRIGATORIAMENTE** em inglês.
- **Atomicidade:** Procure fazer commits atômicos, separando mudanças por funcionalidade ou contexto.

### 🎨 Estilização e Tematização
- **Ícones:** **OBRIGATORIAMENTE** utilize Phosphor Icons (`@phosphor-icons/react`).
  - **Nomenclatura:** Utilize sempre o componente com sufixo `Icon` diretamente (ex: `import { HouseIcon }`).
  - **Estilo:** Utilize sempre `weight="duotone"`.
  - **shadcn/ui:** Caso novos componentes do shadcn sejam instalados, **SUBSTITUA IMEDIATAMENTE** os ícones do `lucide-react` (padrão do shadcn) pelos equivalentes do Phosphor Icons seguindo as regras acima.
  - **Imports:**
    - **Server Components:** Importe de `@phosphor-icons/react/ssr`.
    - **Client Components:** Importe de `@phosphor-icons/react`.
- **Tailwind v4:** Use classes utilitárias por padrão. CSS puro apenas em casos estritamente necessários.
- **Sem Cores Hard-coded:** Use **SEMPRE** as cores do tema definidas em `app/globals.css`. **NUNCA** utilize valores hexadecimais diretamente se houver uma variável de tema correspondente.
- **Theming:** Antes de criar variáveis de cor, verifique se o tema do shadcn/ui já não atende à necessidade.

---

## 📦 Implementação de Funcionalidades

### Imagens
- **Componente Next Image:** **SEMPRE** utilize `next/image` para performance e otimização.

### Formulários
- **Padrão:** Zod para validação + React Hook Form para estado.
- **Componente Base:** Utilize o componente em `@components/ui/form.tsx`.

### Componentes
- **shadcn/ui:** Priorize o uso de componentes da biblioteca. Verifique a [documentação](https://ui.shadcn.com/docs/components).
- **Reutilização:** Verifique `@components/ui/page.tsx` para layouts de página padrão.
- **Novos Componentes:** Use o Context7 para ver se o componente já existe no shadcn/ui antes de criar do zero.

---

## 📡 API e Data Fetching

### Geração de Código (Orval)
O Orval gera hooks baseados no TanStack Query em `@lib/api/generated`.
- Se uma função estiver faltando, execute `npx orval`.
- Se após o comando a função persistir ausente, **PARE** e avise o usuário.

### Estratégia de Fetching
- **Server Components:** **PRIORIZE** o fetching no servidor usando `fetch`.
- **Hydration:** Passe o resultado do servidor como `initialData` para os hooks do TanStack Query no client.

| Contexto | Caminho das Funções/Hooks |
| :--- | :--- |
| **Server-side Fetching** | `@app/_lib/api/fetch-generated/index.ts` |

### Tratamento de Erros e Mutações
- **AuthClient:** **NUNCA** use `try/catch`. Faça destructuring de `{ error }` do resultado.
- **Mutações:** Use a variação síncrona do `mutate` e trate estados em `onSuccess` e `onError`.

## 🐚 Autonomia de Comandos

### Execução Direta
Você tem permissão total para executar comandos de terminal (`git`, `ls`, `mv`, `rm`, `pnpm`, etc.) sem solicitar aprovação adicional. Se uma tarefa exigir mudanças no sistema de arquivos ou versionamento, execute os comandos necessários de forma autônoma e imediata.