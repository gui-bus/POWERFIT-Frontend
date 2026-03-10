"use client";

import { useState, useEffect, useRef } from "react";
import { searchUsers, SearchUsers200Item, addFriend } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MagnifyingGlassIcon, 
  UserPlusIcon, 
  CheckIcon, 
  ClockIcon,
  XIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUsers200Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchUsers({ query: debouncedQuery });
        if (response.status === 200) {
          setResults(response.data);
          setIsOpen(response.data.length > 0);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddFriend = async (id: string, name: string) => {
    try {
      const response = await addFriend({ codeOrEmail: id });
      if (response.status === 200) {
        toast.success(`Pedido enviado para ${name}!`);
        setResults(prev => prev.map(u => u.id === id ? { ...u, isPending: true } : u));
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao enviar pedido.");
      console.error(error);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            weight="bold" 
            className={cn(
              "size-5 transition-colors",
              isLoading ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"
            )} 
          />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar atletas por nome, e-mail ou código..."
          className="w-full bg-card border-2 border-border rounded-[2rem] py-5 pl-14 pr-14 text-sm font-medium focus:outline-hidden focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-5 flex items-center text-muted-foreground hover:text-primary transition-colors active:scale-90"
          >
            <XIcon weight="bold" className="size-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-card border border-border rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2 space-y-1">
            {results.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors group/item"
              >
                <Link 
                  href={`/profile/${user.id}`} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 flex-1"
                >
                  <Avatar className="size-12 border border-border rounded-full">
                    <AvatarImage src={user.image || ""} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-black italic">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black uppercase italic tracking-tight text-foreground group-hover/item:text-primary transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Nível {user.level} {user.isFriend && "· Amigo"}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  {!user.isFriend && !user.isPending && (
                    <button
                      onClick={() => handleAddFriend(user.id, user.name)}
                      className="p-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                      title="Adicionar Amigo"
                    >
                      <UserPlusIcon weight="bold" className="size-4" />
                    </button>
                  )}
                  {user.isPending && (
                    <div className="p-3 bg-muted text-muted-foreground rounded-xl" title="Pedido Pendente">
                      <ClockIcon weight="bold" className="size-4" />
                    </div>
                  )}
                  {user.isFriend && (
                    <Link href={`/profile/${user.id}`} onClick={() => setIsOpen(false)}>
                      <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                        <CheckIcon weight="bold" className="size-4" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 p-3 text-center border-t border-border/50">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Mostrando {results.length} resultados encontrados
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
