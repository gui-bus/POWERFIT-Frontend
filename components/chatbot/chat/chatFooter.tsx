import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { UseFormReturn } from "react-hook-form";

interface ChatFooterProps {
  form: UseFormReturn<{ message: string }>;
  isLoading: boolean;
  messageValue: string;
  hasMessages: boolean;
  suggestedMessages: string[];
  onSubmit: (values: { message: string }) => void;
  onSuggestion: (text: string) => void;
}

export function ChatFooter({
  form,
  isLoading,
  messageValue,
  hasMessages,
  suggestedMessages,
  onSubmit,
  onSuggestion,
}: ChatFooterProps) {
  return (
    <div className="flex shrink-0 flex-col gap-4 p-6 bg-card/50 backdrop-blur-md border-t border-border/50">
      {!hasMessages && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          {suggestedMessages.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestion(suggestion)}
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
  );
}
