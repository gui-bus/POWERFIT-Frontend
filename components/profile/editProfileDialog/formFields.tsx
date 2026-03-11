import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./schema";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function ProfileFormFields({ form }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
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
    </div>
  );
}
