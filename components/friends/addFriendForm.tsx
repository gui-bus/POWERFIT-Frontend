"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addFriend, AddFriendBody } from "@/lib/api/fetch-generated";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserPlusIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  codeOrEmail: z.string().min(1, "Obrigatório"),
});

interface AddFriendFormProps {
  myFriendCode: string | null;
}

export function AddFriendForm({ myFriendCode }: AddFriendFormProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<AddFriendBody>({

    resolver: zodResolver(formSchema) as unknown as Resolver<AddFriendBody>,
    defaultValues: {
      codeOrEmail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await addFriend(values);
      if (response.status === 200) {
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMessage(response.data.error || "Erro ao enviar convite.");
      }
    } catch (error) {
      console.error("Failed to add friend", error);
      setStatus("error");
      setErrorMessage("Erro ao conectar com o servidor.");
    }
  }

  const handleCopyCode = () => {
    if (!myFriendCode) return;
    navigator.clipboard.writeText(myFriendCode);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* My Code Section - Compact */}
      <div className="bg-card border border-border rounded-[2rem] p-5 shadow-sm space-y-3">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Seu Código</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted/50 border border-border rounded-xl h-12 flex items-center px-4 font-anton italic text-xl uppercase tracking-wider">
            {myFriendCode || "---"}
          </div>
          <button
            onClick={handleCopyCode}
            className="size-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-primary/20"
            title="Copiar Código"
          >
            {isCopying ? (
              <CheckIcon weight="bold" className="size-5" />
            ) : (
              <CopyIcon weight="duotone" className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Add Friend Form - Compact */}
      <div className="bg-card border border-border rounded-[2.5rem] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <UserPlusIcon weight="duotone" className="size-5 text-primary" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] italic">Novo Amigo</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="codeOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Código ou E-mail"
                      className="bg-muted/30 border-border rounded-xl h-11 px-4 text-xs font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {status === "error" && (
              <p className="text-[9px] font-bold text-destructive uppercase tracking-widest leading-tight">{errorMessage}</p>
            )}
            
            {status === "success" && (
              <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest leading-tight">Pedido enviado!</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "w-full py-3 rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-[0.98]",
                status === "loading" 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              )}
            >
              {status === "loading" ? "..." : "Enviar Pedido"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
