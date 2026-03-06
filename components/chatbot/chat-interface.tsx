"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
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

  const handleClose = () => {
    setChatParams({ chat_open: false, chat_initial_message: null });
  };

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
          : "flex flex-1 flex-col overflow-hidden rounded-[2.5rem] bg-background border border-border shadow-2xl"
      }
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border p-6 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 p-3 shadow-inner">
            <Sparkles className="size-[20px] text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-black uppercase italic tracking-tight text-foreground">
              Power AI
            </span>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-online animate-pulse shadow-[0_0_8px_rgba(43,84,255,0.5)]" />
              <span className="font-heading text-[10px] font-black uppercase tracking-widest text-primary/80">
                Online
              </span>
            </div>
          </div>
        </div>
        {embedded ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Acessar FIT.AI</Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-secondary transition-colors">
            <X className="size-6 text-muted-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar bg-background/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 opacity-50">
             <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center">
                <Sparkles className="size-8 text-primary/30" />
             </div>
             <p className="text-sm font-medium text-muted-foreground italic">Olá! Como posso acelerar seus resultados hoje?</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "assistant"
                ? "flex flex-col items-start pl-6 pr-12 pt-6"
                : "flex flex-col items-end pl-12 pr-6 pt-6"
            }
          >
            <div
              className={
                message.role === "assistant"
                  ? "rounded-2xl rounded-tl-none bg-secondary p-4 shadow-sm border border-border/50"
                  : "rounded-2xl rounded-tr-none bg-primary p-4 shadow-lg shadow-primary/20 text-primary-foreground"
              }
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
                      className="font-heading text-sm leading-relaxed text-foreground"
                    >
                      {part.text}
                    </Streamdown>
                  ) : null
                )
              ) : (
                <p className="font-heading text-sm leading-relaxed font-medium">
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map(
                      (part) =>
                        (part as { type: "text"; text: string }).text
                    )
                    .join("")}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 flex-col gap-4 p-6 bg-card/50 border-t border-border">
        {messages.length === 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {SUGGESTED_MESSAGES.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="whitespace-nowrap rounded-full bg-primary/10 hover:bg-primary text-foreground hover:text-primary-foreground px-5 py-2.5 font-heading text-[10px] font-black uppercase italic tracking-widest transition-all border border-primary/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-3"
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
                      placeholder="Fale com a IA..."
                      className="rounded-2xl border-border bg-background px-5 py-6 font-heading text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.watch("message").trim() || isLoading}
              size="icon"
              className="size-12 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <ArrowUp className="size-6" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );

  if (embedded) return chatContent;

  return (
    <AnimatePresence>
      {chatParams.chat_open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
          {/* Backdrop for mobile to prevent interaction behind? Or just keep it as a widget. 
              The user said "não pode abrir em tela cheia", so maybe no backdrop or a very light one.
          */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/5 backdrop-blur-[2px] pointer-events-auto sm:hidden"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] h-[600px] max-h-[80vh] flex flex-col pointer-events-auto"
          >
            {chatContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
