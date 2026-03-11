import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpinnerGapIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadButton } from "@/lib/uploadthing";
import { authClient } from "@/lib/authClient";
import { updateProfile } from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileAvatarSectionProps {
  user: {
    name: string;
    image: string | null;
  };
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
}

export function ProfileAvatarSection({ user, isUploading, setIsUploading }: ProfileAvatarSectionProps) {
  const router = useRouter();

  return (
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
              "bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[9px] h-10 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer",
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
  );
}
