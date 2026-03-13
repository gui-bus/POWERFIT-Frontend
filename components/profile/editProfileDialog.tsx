"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  upsertUserTrainData,
  updateProfile,
  GetUserTrainData200,
  GetMe200,
} from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckIcon, SpinnerGapIcon, UserCircleIcon } from "@phosphor-icons/react";
import { profileSchema, ProfileFormValues } from "./editProfileDialog/schema";
import { ProfileAvatarSection } from "./editProfileDialog/avatarSection";
import { ProfileFormFields } from "./editProfileDialog/formFields";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditProfileDialogProps {
  initialData: GetUserTrainData200;
  user: GetMe200;
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
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileFormValues>,
    defaultValues: {
      weight: initialData?.weightInGrams ? initialData.weightInGrams / 1000 : 0,
      height: initialData?.heightInCentimeters || 0,
      age: initialData?.age || 0,
      bodyFatPercentage: initialData?.bodyFatPercentage
        ? initialData?.bodyFatPercentage * 100
        : 0,
      bio: user.bio || "",
      instagram: user.socialLinks?.instagram || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      const [trainRes, profileRes] = await Promise.all([
        upsertUserTrainData({
          weightInGrams: values.weight * 1000,
          heightInCentimeters: values.height,
          age: values.age,
          bodyFatPercentage: values.bodyFatPercentage / 100,
        }),
        updateProfile({
          bio: values.bio,
          socialLinks: {
            instagram: values.instagram || ""
          }
        })
      ]);

      if (trainRes.status === 200 && profileRes.status === 200) {
        toast.success("Perfil atualizado com sucesso!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao sincronizar dados do perfil.");
      }
    } catch {
      toast.error("Erro na conexão ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl bg-card border-l border-border p-0 overflow-y-auto custom-scrollbar">
        <div className="p-8 pb-4">
          <SheetHeader>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UserCircleIcon weight="duotone" className="size-7 text-primary" />
              </div>
              <div className="space-y-1 text-left">
                <SheetTitle className="text-4xl font-anton italic uppercase text-foreground leading-none tracking-tight">
                  Perfil do Atleta
                </SheetTitle>
                <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                  Configurações de Performance
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-10"
          >
            <div className="px-8 space-y-10 py-6 pb-32">
              <ProfileAvatarSection 
                user={{ name: user.name, image: user.image }} 
                isUploading={isUploading} 
                setIsUploading={setIsUploading} 
              />

              <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Dados Biométricos</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                
                <ProfileFormFields form={form} />
              </div>
            </div>

            <div className="p-8 pt-4 border-t border-border bg-card/80 backdrop-blur-md sticky bottom-0 z-30">
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full h-16 rounded-2xl font-anton text-xl uppercase italic tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <SpinnerGapIcon className="size-6 animate-spin" />
                ) : (
                  <>
                    Confirmar Alterações
                    <CheckIcon weight="bold" className="size-6" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
