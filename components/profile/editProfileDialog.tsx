"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  upsertUserTrainData,
  GetUserTrainData200,
} from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { profileSchema, ProfileFormValues } from "./editProfileDialog/schema";
import { ProfileAvatarSection } from "./editProfileDialog/avatarSection";
import { ProfileFormFields } from "./editProfileDialog/formFields";

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
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileFormValues>,
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
          <ProfileAvatarSection 
            user={user} 
            isUploading={isUploading} 
            setIsUploading={setIsUploading} 
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <ProfileFormFields form={form} />

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
