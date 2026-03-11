import { ChatTeardropTextIcon } from "@phosphor-icons/react";

interface StatusMessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusMessageInput({ value, onChange }: StatusMessageInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground px-1">
        <ChatTeardropTextIcon weight="duotone" className="size-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Como foi o treino?</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Treino insano de pernas! Foco total."
        className="w-full bg-muted/30 border border-border/50 rounded-[1.5rem] p-4 text-xs font-medium focus:outline-hidden focus:border-primary/50 transition-colors min-h-24 resize-none"
      />
    </div>
  );
}
