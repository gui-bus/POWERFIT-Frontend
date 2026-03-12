"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, XIcon, TargetIcon, ChartLineUpIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
const DIFFICULTIES = [
  { label: "Iniciante", value: "Beginner" },
  { label: "Intermediário", value: "Intermediate" },
  { label: "Avançado", value: "Advanced" }
];

export function TemplateFilters({ initialFilters }: TemplateFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialFilters.query || "");
  const debouncedQuery = useDebounce(query, 500);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debouncedQuery !== (searchParams.get("query") || "")) {
      router.push(`${pathname}?${createQueryString("query", debouncedQuery)}`, { scroll: false });
    }
  }, [debouncedQuery, pathname, router, createQueryString, searchParams]);

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const clearFilters = () => {
    setQuery("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = !!(searchParams.get("category") || searchParams.get("difficulty") || searchParams.get("query"));

  return (
    <div className="flex flex-col xl:flex-row items-center gap-4 bg-card/30 border border-border/50 p-4 rounded-[2.5rem] backdrop-blur-sm">
      <div className="relative flex-1 w-full">
        <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar modelos de treinamento..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 bg-background/50 border-border/50 rounded-3xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all font-medium italic"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        <Select 
          value={searchParams.get("category") || "all"} 
          onValueChange={(v) => handleFilterChange("category", v)}
        >
          <SelectTrigger className="h-14 w-full sm:w-[200px] rounded-3xl border-border/50 bg-background/50 px-6 font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2">
              <TargetIcon weight="duotone" className="size-4 text-primary" />
              <SelectValue placeholder="Objetivo" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-2xl p-2">
            <SelectItem value="all" className="rounded-xl text-[10px] font-black uppercase italic py-3">Todos Objetivos</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="rounded-xl text-[10px] font-black uppercase italic py-3">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={searchParams.get("difficulty") || "all"} 
          onValueChange={(v) => handleFilterChange("difficulty", v)}
        >
          <SelectTrigger className="h-14 w-full sm:w-[180px] rounded-3xl border-border/50 bg-background/50 px-6 font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2">
              <ChartLineUpIcon weight="duotone" className="size-4 text-primary" />
              <SelectValue placeholder="Nível" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-2xl p-2">
            <SelectItem value="all" className="rounded-xl text-[10px] font-black uppercase italic py-3">Todos Níveis</SelectItem>
            {DIFFICULTIES.map((diff) => (
              <SelectItem key={diff.value} value={diff.value} className="rounded-xl text-[10px] font-black uppercase italic py-3">
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            onClick={clearFilters}
            variant="ghost" 
            className="h-14 rounded-3xl px-6 gap-2 text-destructive font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:bg-destructive/10"
          >
            <XIcon weight="bold" className="size-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
