import { motion, AnimatePresence } from "framer-motion";
import { SparkleIcon } from "@phosphor-icons/react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { RefObject } from "react";

interface Message {
  id: string;
  role: string;
  parts: any[];
}

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, isStreaming, scrollRef }: ChatMessagesProps) {
  return (
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
      <div ref={scrollRef} className="h-2" />
    </div>
  );
}
