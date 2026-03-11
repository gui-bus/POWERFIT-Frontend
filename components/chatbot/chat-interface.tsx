"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { SparkleIcon, XIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getWorkoutPlans } from "@/lib/api/fetch-generated";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

const chatFormSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

interface ChatProps {
  embedded?: boolean;
  initialMessage?: string;
}

export function Chat({ embedded = false, initialMessage }: ChatProps) {
  const router = useRouter();
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const handleClose = () => {
    setChatParams({ chat_open: false, chat_initial_message: null });
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
    onFinish: async (message) => {
      // Verifica se a resposta do bot menciona que o plano foi criado/gerado
      const lowerContent = message.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { text: string }).text)
        .join(" ")
        .toLowerCase();

      const indicatesSuccess = 
        lowerContent.includes("plano de treino") && 
        (lowerContent.includes("criado") || 
         lowerContent.includes("gerado") || 
         lowerContent.includes("pronto") ||
         lowerContent.includes("finalizado"));

      if (indicatesSuccess) {
        // Busca o plano ativo mais recente
        const plansRes = await getWorkoutPlans({ active: "true" });
        if (plansRes.status === 200 && plansRes.data.length > 0) {
          const activePlan = plansRes.data[0];
          router.push(`/workout-plans/${activePlan.id}`);
          if (!embedded) {
            handleClose();
          }
        }
      }
    },
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  const messageValue = useWatch({
    control: form.control,
    name: "message",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    if (embedded && initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [embedded, initialMessage, sendMessage]);

  useEffect(() => {
    if (
      !embedded &&
      chatParams.chat_open &&
      chatParams.chat_initial_message &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatParams.chat_initial_message });
      setChatParams({ chat_initial_message: null });
    }
  }, [
    embedded,
    chatParams.chat_open,
    chatParams.chat_initial_message,
    sendMessage,
    setChatParams,
  ]);

  useEffect(() => {
    if (!embedded && !chatParams.chat_open) {
      initialMessageSentRef.current = false;
    }
  }, [embedded, chatParams.chat_open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = (values: ChatFormValues) => {
    sendMessage({ text: values.message });
    form.reset();
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  const chatContent = (
    <div
      className={
        embedded
          ? "flex h-svh flex-col bg-background"
          : "flex flex-1 flex-col overflow-hidden rounded-[3rem] bg-card/80 backdrop-blur-2xl border border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]"
      }
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 p-6 bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-heading text-base font-black uppercase italic tracking-tight text-foreground leading-none">
              Power AI
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Personal Trainer Virtual
            </span>
          </div>
        </div>
        {embedded ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-xl font-black italic uppercase text-[10px] tracking-widest"
          >
            <Link href="/">Acessar FIT.AI</Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group"
          >
            <XIcon
              weight="duotone"
              className="size-5 text-muted-foreground group-hover:rotate-90 transition-transform"
            />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-background/30">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full opacity-20 grayscale"
          >
            <SparkleIcon weight="duotone" className="size-12 text-primary" />
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                message.role === "assistant" ? "justify-start" : "justify-end",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] p-4 text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "rounded-2xl rounded-tl-none bg-card border border-border/50 text-foreground shadow-sm"
                    : "rounded-2xl rounded-tr-none bg-primary text-primary-foreground shadow-md font-medium",
                )}
              >
                {message.role === "assistant" ? (
                  message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <Streamdown
                        key={index}
                        isAnimating={
                          isStreaming &&
                          messages[messages.length - 1]?.id === message.id
                        }
                        className="font-heading"
                      >
                        {part.text}
                      </Streamdown>
                    ) : null,
                  )
                ) : (
                  <p className="font-heading">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map(
                        (part) => (part as { type: "text"; text: string }).text,
                      )
                      .join("")}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Footer / Input */}
      <div className="flex shrink-0 flex-col gap-4 p-6 bg-card/50 backdrop-blur-md border-t border-border/50">
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
            {SUGGESTED_MESSAGES.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="whitespace-nowrap rounded-2xl bg-background hover:bg-primary border border-border hover:border-primary text-foreground hover:text-primary-foreground px-5 py-3 text-[10px] font-black uppercase italic tracking-widest transition-all shadow-sm cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-3 relative"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      placeholder="Tire suas dúvidas agora..."
                      className="rounded-[1.5rem] border-border/50 bg-background/50 h-14 px-6 font-heading text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 focus-visible:bg-background transition-all pr-14"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!messageValue?.trim() || isLoading}
              size="icon"
              className="absolute right-1.5 top-1.5 size-11 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowUpIcon weight="duotone" className="size-5 stroke-3" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );

  if (embedded) return chatContent;

  return (
    <>
      <AnimatePresence>
        {!chatParams.chat_open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="hidden lg:flex absolute bottom-12 right-12 z-50"
          >
            <button
              onClick={() => setChatParams({ chat_open: true })}
              className="group relative flex items-center gap-3 bg-card border border-border pl-4 pr-6 py-3 rounded-full shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-500 active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500">
                <SparkleIcon weight="duotone" className="size-5 fill-current" />
                <div className="absolute -top-0.5 -right-0.5 size-3 bg-lime-500 rounded-full border-2 border-card shadow-[0_0_8px_rgba(132,204,22,0.5)]" />
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black text-primary uppercase italic tracking-[0.2em] mb-0.5">
                  Power AI
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Assistente Online
                </span>
              </div>

              <div className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <div className="size-1.5 border-t-2 border-r-2 border-primary rotate-45" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatParams.chat_open && (
          <div className="absolute inset-0 z-100 flex items-end justify-end p-4 sm:p-8 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto sm:hidden"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95,
                transformOrigin: "bottom right",
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-110 h-150 max-h-[80vh] flex flex-col pointer-events-auto shadow-2xl"
            >
              {chatContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
