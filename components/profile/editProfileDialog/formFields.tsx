import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./schema";
import { InstagramLogoIcon, TextIndentIcon, PersonIcon, RulerIcon, BarbellIcon, UserIcon } from "@phosphor-icons/react";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function ProfileFormFields({ form }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <BarbellIcon weight="duotone" className="size-3.5 text-primary" />
                Massa (kg)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="70"
                  type="number"
                  step="0.1"
                  className="rounded-2xl bg-muted/30 border-border/50 h-14 font-anton text-xl italic focus:border-primary/50 transition-all p-6 shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <RulerIcon weight="duotone" className="size-3.5 text-primary" />
                Estatura (cm)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="175"
                  type="number"
                  className="rounded-2xl bg-muted/30 border-border/50 h-14 font-anton text-xl italic focus:border-primary/50 transition-all p-6 shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <UserIcon weight="duotone" className="size-3.5 text-primary" />
                Idade
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="25"
                  type="number"
                  className="rounded-2xl bg-muted/30 border-border/50 h-14 font-anton text-xl italic focus:border-primary/50 transition-all p-6 shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyFatPercentage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <PersonIcon weight="duotone" className="size-3.5 text-primary" />
                BF Est. (%)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="15"
                  type="number"
                  className="rounded-2xl bg-muted/30 border-border/50 h-14 font-anton text-xl italic focus:border-primary/50 transition-all p-6 shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 space-y-8 border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Social & Bio</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <TextIndentIcon weight="duotone" className="size-3.5 text-primary" />
                Sua História / Objetivos
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte sobre sua jornada fitness, objetivos e conquistas..."
                  className="rounded-3xl bg-muted/30 border-border/50 min-h-32 resize-none font-medium text-sm focus:border-primary/50 transition-all p-6 italic leading-relaxed shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <InstagramLogoIcon weight="duotone" className="size-3.5 text-primary" />
                Instagram (Identificador)
              </FormLabel>
              <FormControl>
                <div className="flex items-center rounded-2xl bg-muted/30 border border-border/50 h-14 overflow-hidden focus-within:border-primary/50 transition-all shadow-inner group/insta">
                  <div className="h-full bg-muted/50 border-r border-border/50 flex items-center px-4 select-none">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">instagram.com/</span>
                  </div>
                  <input
                    {...field}
                    placeholder="atleta"
                    className="flex-1 h-full bg-transparent border-none outline-hidden px-4 font-bold text-sm italic placeholder:text-muted-foreground/30"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase italic text-destructive" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
