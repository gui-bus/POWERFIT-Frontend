"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface TemplateFiltersProps {
  initialFilters: {
    category?: string;
    difficulty?: string;
    query?: string;
  };
}

const CATEGORIES = ["Ganho de Massa", "Emagrecimento", "Condicionamento", "Força"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export function TemplateFilters({ initialFilters }: TemplateFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialFilters.query || "");
  const debouncedQuery = useDebounce(query, 500);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.push(`${pathname}?${createQueryString("query", debouncedQuery)}`);
  }, [debouncedQuery, pathname, router, createQueryString]);

  const handleFilterChange = (name: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    setQuery("");
    router.push(pathname);
  };

  const hasActiveFilters = !!(searchParams.get("category") || searchParams.get("difficulty") || searchParams.get("query"));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/30 border border-border/50 p-4 rounded-[2rem] backdrop-blur-sm">
      <div className="relative flex-1 w-full">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar modelos..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all font-medium italic"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 rounded-2xl border-border/50 bg-background/50 px-6 gap-2 font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:border-primary/30 transition-all">
              <FunnelIcon weight="duotone" className="size-4 text-primary" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-2xl p-2">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest italic px-2 py-1.5">Objetivo</DropdownMenuLabel>
            {CATEGORIES.map((cat) => (
              <DropdownMenuCheckboxItem
                key={cat}
                checked={searchParams.get("category") === cat}
                onCheckedChange={() => handleFilterChange("category", searchParams.get("category") === cat ? null : cat)}
                className="rounded-xl text-xs font-bold uppercase italic tracking-tight py-2"
              >
                {cat}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator className="bg-border/50 my-2" />
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest italic px-2 py-1.5">Dificuldade</DropdownMenuLabel>
            {DIFFICULTIES.map((diff) => (
              <DropdownMenuCheckboxItem
                key={diff}
                checked={searchParams.get("difficulty") === diff}
                onCheckedChange={() => handleFilterChange("difficulty", searchParams.get("difficulty") === diff ? null : diff)}
                className="rounded-xl text-xs font-bold uppercase italic tracking-tight py-2"
              >
                {diff}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button 
            onClick={clearFilters}
            variant="ghost" 
            className="h-12 rounded-2xl px-4 gap-2 text-destructive font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:bg-destructive/10"
          >
            <XIcon weight="bold" className="size-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
