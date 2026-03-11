import { CameraIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";

interface PhotoUploaderProps {
  previewUrl: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

export function PhotoUploader({ previewUrl, onFileSelect, onRemovePhoto }: PhotoUploaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground px-1">
        <CameraIcon weight="duotone" className="size-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Foto do Treino (Opcional)
        </span>
      </div>
      
      {!previewUrl ? (
        <label className="relative group flex flex-col items-center justify-center w-full h-32 bg-muted/20 border-2 border-dashed border-border/50 rounded-[1.5rem] hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <PlusIcon weight="bold" className="size-6" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">
              Adicionar Prova de Esforço
            </span>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
        </label>
      ) : (
        <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden border border-border shadow-lg group">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={onRemovePhoto}
              className="size-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <XIcon weight="bold" className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
