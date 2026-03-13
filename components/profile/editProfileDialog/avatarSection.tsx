import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpinnerGapIcon, CameraIcon } from "@phosphor-icons/react";
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
    <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-[3rem] border border-border/50 relative overflow-hidden group shadow-inner">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <Avatar className="size-40 rounded-full shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 relative z-10">
          <AvatarImage src={user.image || ""} className="object-cover" />
          <AvatarFallback className="bg-linear-to-br from-primary to-orange-600 text-white font-black text-5xl italic">
            {user.name.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 rounded-[2.5rem] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-2"
            >
              <SpinnerGapIcon className="size-10 text-primary animate-spin" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest italic animate-pulse">Sincronizando...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 relative z-10">
        <UploadButton
          endpoint="profileImage"
          onUploadBegin={() => {
            setIsUploading(true);
            toast.loading("Enviando sua nova foto...", { id: "upload-toast" });
          }}
          headers={async () => {
            const session = await authClient.getSession();
            const token = session.data?.session?.token;
            const headers: Record<string, string> = {};
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
              headers["Cookie"] = `better-auth.session-token=${token}`;
              headers["x-session-token"] = token;
            }
            return headers;
          }}
          onClientUploadComplete={async (res) => {
            const imageUrl = res[0].url;
            try {
              const response = await updateProfile({ image: imageUrl });
              if (response.status === 200) {
                toast.success("Foto de perfil atualizada!", { id: "upload-toast" });
                router.refresh();
              }
            } catch {
              toast.error("Erro na conexão.", { id: "upload-toast" });
            } finally {
              setIsUploading(false);
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error(`Erro: ${error.message}`, { id: "upload-toast" });
          }}
          appearance={{
            button:
              "bg-background border border-border hover:border-primary/50 text-foreground font-black uppercase italic tracking-widest text-[10px] h-12 px-8 rounded-2xl transition-all shadow-xl group/btn cursor-pointer",
            allowedContent: "hidden",
          }}
          content={{
            button({ ready }) {
              return (
                <div className="flex items-center gap-2">
                  <CameraIcon weight="bold" className="size-4 text-primary group-hover/btn:scale-110 transition-transform" />
                  {ready ? "Alterar Avatar" : "Iniciando..."}
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
