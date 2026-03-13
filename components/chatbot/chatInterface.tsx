"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getWorkoutPlans } from "@/lib/api/fetch-generated";
import { ChatHeader } from "./chat/chatHeader";
import { ChatMessages } from "./chat/chatMessages";
import { ChatFooter } from "./chat/chatFooter";
import { ChatToggle } from "./chat/chatToggle";

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
    onFinish: async ({ message }) => {
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
          : "flex flex-1 flex-col overflow-hidden sm:rounded-[3rem] bg-card/80 backdrop-blur-2xl border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] sm:border"
      }
    >
      <ChatHeader embedded={embedded} onClose={handleClose} />

      <ChatMessages
        messages={messages}
        isStreaming={isStreaming}
        scrollRef={messagesEndRef}
      />

      <ChatFooter
        form={form}
        isLoading={isLoading}
        messageValue={messageValue}
        hasMessages={messages.length > 0}
        suggestedMessages={SUGGESTED_MESSAGES}
        onSubmit={onSubmit}
        onSuggestion={handleSuggestion}
      />
    </div>
  );

  if (embedded) return chatContent;

  return (
    <>
      <AnimatePresence>
        {!chatParams.chat_open && (
          <ChatToggle onOpen={() => setChatParams({ chat_open: true })} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatParams.chat_open && (
          <div className="fixed inset-0 z-100 flex items-end justify-end sm:p-8 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto hidden sm:block"
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
              className="relative w-full h-full sm:w-full sm:max-w-110 sm:h-150 sm:max-h-[80vh] flex flex-col pointer-events-auto shadow-2xl bg-background sm:bg-transparent"
            >
              {chatContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
