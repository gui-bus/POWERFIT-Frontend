import { getExercises, getMe } from "@/lib/api/fetch-generated";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpsertExerciseDialog } from "@/components/admin/upsertExerciseDialog";
import { ExerciseActions } from "@/components/admin/exerciseActions";
import { 
  BarbellIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  VideoCameraIcon,
  ImageIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface AdminExercisesPageProps {
  searchParams: Promise<{
    muscleGroup?: string;
    query?: string;
  }>;
}

export default async function AdminExercisesPage({ searchParams }: AdminExercisesPageProps) {
  const filters = await searchParams;
  const [exercisesResponse, meResponse] = await Promise.all([
    getExercises(filters),
    getMe(),
  ]);

  if (exercisesResponse.status !== 200 || meResponse.status !== 200) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center p-20 bg-card rounded-[2.5rem] border border-border">
          <p className="text-muted-foreground font-medium italic uppercase tracking-widest text-sm">
            Erro ao carregar catálogo de exercícios.
          </p>
        </div>
      </Container>
    );
  }

  const exercises = exercisesResponse.data.exercises;
  const userData = meResponse.data;

  return (
    <Container className="py-10 space-y-10">
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-[-2rem]">
        <Link href="/admin" className="hover:text-primary transition-colors">Painel</Link>
        <span>/</span>
        <span className="text-foreground">Catálogo de Exercícios</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Biblioteca"
          subtitle="Gestão global de exercícios e técnica"
          user={{
            ...userData,
            role: userData.role as "ADMIN" | "USER",
          }}
        />
        <UpsertExerciseDialog />
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4 border-border bg-card/30 backdrop-blur-sm rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar exercício pelo nome..." 
            className="h-12 pl-11 bg-background/50 border-border/50 rounded-2xl font-bold uppercase italic text-xs"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Badge variant="outline" className="h-12 px-6 rounded-2xl border-border bg-background/50 flex items-center gap-2 cursor-pointer hover:bg-primary/5 transition-colors">
            <FunnelIcon weight="duotone" className="size-4 text-primary" />
            <span className="text-[10px] font-black uppercase italic tracking-widest">Grupo Muscular</span>
          </Badge>
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Exercício</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic text-center">Mídia</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Dificuldade</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {exercises.map((exercise) => (
                <tr key={exercise.id} className="group hover:bg-primary/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <BarbellIcon weight="duotone" className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-anton text-lg text-foreground uppercase italic tracking-wider leading-none">
                          {exercise.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary italic bg-primary/10 px-2 py-0.5 rounded-md">
                            {exercise.muscleGroup}
                          </span>
                          {exercise.equipment && (
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                              • {exercise.equipment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`p-2 rounded-xl border ${exercise.imageUrl ? 'border-primary/30 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground opacity-30'}`}>
                        <ImageIcon weight="duotone" className="size-4" />
                      </div>
                      <div className={`p-2 rounded-xl border ${exercise.videoUrl ? 'border-primary/30 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground opacity-30'}`}>
                        <VideoCameraIcon weight="duotone" className="size-4" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge 
                      className={`
                        rounded-full px-4 py-1.5 text-[10px] font-black uppercase italic tracking-widest border-none
                        ${exercise.difficulty === 'Elite' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 
                          exercise.difficulty === 'Avançado' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                          exercise.difficulty === 'Intermediário' ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                          'bg-muted/50 text-muted-foreground'}
                      `}
                    >
                      {exercise.difficulty || 'Não definido'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ExerciseActions exercise={exercise} />
                  </td>
                </tr>
              ))}
              {exercises.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-muted-foreground font-medium italic uppercase tracking-widest text-sm">
                      Nenhum exercício encontrado no catálogo.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
}
