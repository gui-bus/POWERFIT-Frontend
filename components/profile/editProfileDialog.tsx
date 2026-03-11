"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  upsertUserTrainData,
  GetUserTrainData200,
  updateProfile,
} from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { UploadButton } from "@/lib/uploadthing";
import { authClient } from "@/lib/authClient";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  weight: z.coerce
    .number()
    .min(30, "Peso muito baixo")
    .max(300, "Peso muito alto"),
  height: z.coerce
    .number()
    .min(100, "Altura muito baixa")
    .max(250, "Altura muito alta"),
  age: z.coerce
    .number()
    .min(12, "Idade mínima 12 anos")
    .max(100, "Idade máxima 100 anos"),
  bodyFatPercentage: z.coerce
    .number()
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%"),
});

interface ProfileFormValues {
  weight: number;
  height: number;
  age: number;
  bodyFatPercentage: number;
}

interface EditProfileDialogProps {
  initialData: GetUserTrainData200;
  user: {
    name: string;
    image: string | null;
  };
  children: React.ReactNode;
}

export function EditProfileDialog({
  initialData,
  user,
  children,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(

      profileSchema,
    ) as unknown as Resolver<ProfileFormValues>,
    defaultValues: {
      weight: initialData?.weightInGrams ? initialData.weightInGrams / 1000 : 0,
      height: initialData?.heightInCentimeters || 0,
      age: initialData?.age || 0,
      bodyFatPercentage: initialData?.bodyFatPercentage
        ? initialData?.bodyFatPercentage * 100
        : 0,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await upsertUserTrainData({
        weightInGrams: values.weight * 1000,
        heightInCentimeters: values.height,
        age: values.age,
        bodyFatPercentage: values.bodyFatPercentage / 100,
      });

      if (response.status === 200) {
        toast.success("Perfil atualizado com sucesso!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25 rounded-[3rem] p-0 overflow-hidden border-border bg-card shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="font-anton text-3xl uppercase italic tracking-tight leading-none text-foreground">
            Editar Perfil
          </DialogTitle>
          <DialogDescription className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 pt-2">
            Otimize sua performance com dados precisos
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Avatar & Upload Section */}
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-[2.5rem] border border-border/50 relative overflow-hidden group">
            <div className="relative">
              <Avatar className="size-32 rounded-[2rem] border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={user.image || ""} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-4xl italic">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <AnimatePresence>
                {isUploading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 rounded-[2rem] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                  >
                    <SpinnerGapIcon className="size-8 text-primary animate-spin" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest italic animate-pulse">Enviando...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6">
              <UploadButton
                endpoint="profileImage"
                onUploadBegin={() => {
                  setIsUploading(true);
                  toast.loading("Enviando sua nova foto...", { id: "upload-toast" });
                }}

                headers={async () => {
                  const session = await authClient.getSession();
                  const token = session.data?.session?.token;

                  if (!token) {
                    console.warn("Nenhum token de sessão encontrado no authClient!");
                    return {};
                  }

                  return {
                    "Authorization": `Bearer ${token}`,
                    "Cookie": `better-auth.session-token=${token}`,
                    "x-session-token": token 
                  };
                }}
                onClientUploadComplete={async (res) => {
                  const imageUrl = res[0].url;
                  
                  try {
                    const response = await updateProfile({ image: imageUrl });
                    if (response.status === 200) {
                      toast.success("Foto de perfil atualizada!", { id: "upload-toast" });
                      router.refresh();
                    } else {
                      toast.error("Erro ao salvar no servidor.", { id: "upload-toast" });
                    }
                  } catch (e) {
                    console.error(e);
                    toast.error("Erro na conexão.", { id: "upload-toast" });
                  } finally {
                    setIsUploading(false);
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  console.error("Erro Uploadthing:", error);
                  toast.error(`Erro: ${error.message}`, { id: "upload-toast" });
                }}
                appearance={{
                  button:
                    "bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[9px] h-10 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20",
                  allowedContent: "hidden",
                }}
                content={{
                  button({ ready }) {
                    if (ready) return "Alterar Imagem";
                    return "Iniciando...";
                  },
                }}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                        Peso Corporal (kg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="70"
                          type="number"
                          step="0.1"
                          className="rounded-2xl bg-muted/50 border-border/50 h-14 font-anton text-lg italic focus:border-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase italic" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                        Altura (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="175"
                          type="number"
                          className="rounded-2xl bg-muted/50 border-border/50 h-14 font-anton text-lg italic focus:border-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase italic" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                        Idade Atual
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="25"
                          type="number"
                          className="rounded-2xl bg-muted/50 border-border/50 h-14 font-anton text-lg italic focus:border-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase italic" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bodyFatPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                        Gordura Corporal (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="15"
                          type="number"
                          className="rounded-2xl bg-muted/50 border-border/50 h-14 font-anton text-lg italic focus:border-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase italic" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-full h-16 rounded-2xl font-anton text-xl uppercase italic tracking-widest gap-3 cursor-pointer shadow-xl shadow-primary/20"
                >
                  {isLoading ? (
                    <SpinnerGapIcon className="size-6 animate-spin" />
                  ) : (
                    <>
                      Salvar Alterações
                      <CheckIcon weight="bold" className="size-6" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
