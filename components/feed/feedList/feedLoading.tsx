import { SpinnerIcon } from "@phosphor-icons/react";

interface FeedLoadingProps {
  isLoading: boolean;
  hasError: boolean;
  hasMore: boolean;
  onRetry: () => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function FeedLoading({
  isLoading,
  hasError,
  hasMore,
  onRetry,
  targetRef,
}: FeedLoadingProps) {
  return (
    <div 
      ref={targetRef} 
      className="w-full py-12 flex flex-col items-center justify-center gap-4"
    >
      {isLoading && (
        <>
          <SpinnerIcon className="size-8 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic animate-pulse">
            Carregando mais atividades...
          </p>
        </>
      )}
      
      {hasError && (
        <button 
          onClick={onRetry}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/5 transition-all cursor-pointer"
        >
          Erro ao carregar. Tentar novamente?
        </button>
      )}

      {!hasMore && !isLoading && (
        <div className="flex items-center gap-4 w-full">
          <div className="h-px flex-1 bg-border/50" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 italic whitespace-nowrap">
            Você chegou ao fim do feed
          </p>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      )}
    </div>
  );
}
