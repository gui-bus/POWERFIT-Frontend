"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  GetNotifications200Item,
  GetNotifications200ItemType,
} from "@/lib/api/fetch-generated";
import {
  BellIcon,
  CheckIcon,
  ChecksIcon,
  UserPlusIcon,
  LightningIcon,
  UserCircleIcon,
  StarIcon,
  TrophyIcon,
  SwordIcon
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<GetNotifications200Item[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotifications();
      if (response.status === 200) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const getIcon = (type: GetNotifications200ItemType) => {
    switch (type) {
      case "FRIEND_REQUEST":
        return <UserPlusIcon weight="duotone" className="size-4 text-blue-500" />;
      case "FRIEND_ACCEPTED":
        return <UserCircleIcon weight="duotone" className="size-4 text-green-500" />;
      case "POWERUP_RECEIVED":
        return <LightningIcon weight="duotone" className="size-4 text-primary" />;
      case "LEVEL_UP":
        return <StarIcon weight="fill" className="size-4 text-yellow-500" />;
      case "ACHIEVEMENT_UNLOCKED":
        return <TrophyIcon weight="duotone" className="size-4 text-orange-500" />;
      case "CHALLENGE_INVITE":
        return <SwordIcon weight="duotone" className="size-4 text-red-500" />;
      default:
        return <BellIcon weight="duotone" className="size-4 text-muted-foreground" />;
    }
  };

  const handleNotificationClick = (notification: GetNotifications200Item) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    switch (notification.type) {
      case "FRIEND_REQUEST":
        router.push("/friends");
        break;
      case "POWERUP_RECEIVED":
        router.push("/feed");
        break;
      case "LEVEL_UP":
      case "ACHIEVEMENT_UNLOCKED":
        router.push("/achievements");
        break;
      case "CHALLENGE_INVITE":
        router.push("/challenges");
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-12 rounded-2xl hover:bg-primary/5 transition-all group"
        >
          <BellIcon
            weight={unreadCount > 0 ? "fill" : "duotone"}
            className={cn(
              "size-6 transition-all",
              unreadCount > 0 ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-4 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 rounded-[1.5rem] p-2 border-border bg-card shadow-2xl"
      >
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase italic tracking-tight">Notificações</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              {unreadCount} novas mensagens
            </span>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 rounded-xl px-3 text-[10px] font-black uppercase italic tracking-widest text-primary hover:bg-primary/10 transition-all gap-1.5"
            >
              <ChecksIcon weight="bold" className="size-3.5" />
              Lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50 mx-2" />
        <div className="max-h-96 overflow-y-auto custom-scrollbar p-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all mb-1 last:mb-0",
                  notification.isRead ? "opacity-60" : "bg-primary/5 focus:bg-primary/10"
                )}
              >
                <div className="relative shrink-0 mt-1">
                  <Avatar className="size-10 border border-border shadow-sm rounded-xl">
                    <AvatarImage src={notification.sender?.image || ""} className="object-cover" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold rounded-xl">
                      {notification.sender?.name.substring(0, 2).toUpperCase() || "FIT"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium leading-relaxed text-foreground">
                    <span className="font-black uppercase italic text-[11px] tracking-tight mr-1">
                      {notification.sender?.name || "PowerFit"}:
                    </span>
                    {notification.type === "FRIEND_REQUEST" && "enviou um pedido de amizade."}
                    {notification.type === "FRIEND_ACCEPTED" && "aceitou seu pedido de amizade."}
                    {notification.type === "POWERUP_RECEIVED" && "deu um Powerup no seu treino!"}
                    {notification.type === "LEVEL_UP" && "Parabéns! Você subiu de nível!"}
                    {notification.type === "ACHIEVEMENT_UNLOCKED" && "Você desbloqueou uma nova conquista!"}
                    {notification.type === "CHALLENGE_INVITE" && "convidou você para um desafio!"}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {dayjs(notification.createdAt).fromNow()}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                <BellIcon weight="duotone" className="size-6 text-muted-foreground" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Tudo em ordem por aqui!
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
