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
  - [Imagens](#imagens)
  - [Formulários](#formulários)
  - [Componentes](#componentes)
- [📡 API e Data Fetching](#-api-e-data-fetching)
  - [Geração de Código (Orval)](#geração-de-código-orval)
  - [Estratégia de Fetching](#estratégia-de-fetching)
  - [Tratamento de Erros e Mutações](#tratamento-de-erros-e-mutações)

---

## 🌟 Visão Geral do Projeto

Você atua como um engenheiro de software sênior especializado em desenvolvimento web moderno. O foco é entregar soluções de alta qualidade, escaláveis e fáceis de manter, utilizando o estado da arte do ecossistema React/Next.js.

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
- **Tailwind v4:** Use classes utilitárias por padrão. CSS puro apenas em casos estritamente necessários.
- **Sem Cores Hard-coded:** Use **SEMPRE** as cores do tema definidas em `app/globals.css`.
- **Theming:** Antes de criar variáveis de cor, verifique se o tema do shadcn/ui já não atende à necessidade.

---

## 📦 Implementação de Funcionalidades

### Imagens
- **Componente Next Image:** **SEMPRE** utilize `next/image` para performance e otimização.

### Formulários
- **Padrão:** Zod para validação + React Hook Form para estado.
- **Componente Base:** Utilize o componente em `@components/ui/form.tsx`.

#### Exemplo de Estrutura:
```tsx
const formSchema = z.object({
  username: z.string().min(2, "Mínimo de 2 caracteres."),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
```

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
| **Client-side (Hooks)** | `@lib/api/rc-generated/index.ts` |

### Tratamento de Erros e Mutações
- **AuthClient:** **NUNCA** use `try/catch`. Faça destructuring de `{ error }` do resultado.
- **Mutações:** Use a variação síncrona do `mutate` e trate estados em `onSuccess` e `onError`.

#### Exemplo de Mutação:
```tsx
const { mutate: createStore } = useCreateStore();

const onSubmit = (data) => {
  createStore({ data }, {
    onSuccess: () => {
      toast.success("Criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: getStoreQueryKey() });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Erro ao criar.";
      toast.error(msg);
    },
  });
};
```
