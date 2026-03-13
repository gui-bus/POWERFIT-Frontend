"use client";

import { useState } from "react";
import { 
  patchAdminUsersIdToggleBan, 
  patchAdminUsersIdRole 
} from "@/lib/api/fetch-generated";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { 
  DotsThreeVerticalIcon, 
  UserMinusIcon, 
  UserPlusIcon, 
  ShieldIcon, 
  UserIcon 
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  userId: string;
  userName: string;
  isBanned: boolean;
  role: string;
}

export function UserActions({ userId, userName, isBanned, role }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleBan = async () => {
    setIsLoading(true);
    const response = await patchAdminUsersIdToggleBan(userId);
    setIsLoading(false);
    if (response.status === 200) {
      router.refresh();
    }
  };

  const handleChangeRole = async (newRole: "ADMIN" | "USER") => {
    setIsLoading(true);
    const response = await patchAdminUsersIdRole(userId, { role: newRole });
    setIsLoading(false);
    if (response.status === 204) {
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-10 rounded-xl hover:bg-primary/5 cursor-pointer"
          disabled={isLoading}
        >
          <DotsThreeVerticalIcon weight="bold" className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border bg-card shadow-2xl">
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
          Moderação: {userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleToggleBan}
          className={`rounded-xl p-3 cursor-pointer ${isBanned ? 'text-primary' : 'text-destructive'}`}
        >
          {isBanned ? (
            <>
              <UserPlusIcon weight="duotone" className="mr-3 size-4" />
              <span className="font-bold text-xs uppercase tracking-wider">Reativar Conta</span>
            </>
          ) : (
            <>
              <UserMinusIcon weight="duotone" className="mr-3 size-4" />
              <span className="font-bold text-xs uppercase tracking-wider">Banir Usuário</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
          Alterar Permissões
        </DropdownMenuLabel>

        {role === 'ADMIN' ? (
          <DropdownMenuItem 
            onClick={() => handleChangeRole('USER')}
            className="rounded-xl p-3 cursor-pointer"
          >
            <UserIcon weight="duotone" className="mr-3 size-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Rebaixar para Usuário</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={() => handleChangeRole('ADMIN')}
            className="rounded-xl p-3 cursor-pointer text-primary"
          >
            <ShieldIcon weight="duotone" className="mr-3 size-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Promover a Admin</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
