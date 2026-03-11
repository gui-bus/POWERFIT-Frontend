"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  GetNotifications200NotificationsItem,
} from "@/lib/api/fetch-generated";
import {
  BellIcon,
  ChecksIcon,
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
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils/date";
import { getNotificationIcon, getNotificationMessage, getNotificationRoute } from "./notificationHelpers";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<GetNotifications200NotificationsItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();


  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.isRead).length, 
  [notifications]);

  const fetchNotifications = async (cursor?: string) => {
    try {
      const response = await getNotifications({ 
        limit: 10,
        cursor 
      });
      
      if (response.status === 200) {
        if (cursor) {
          setNotifications((prev) => [...prev, ...response.data.notifications]);
        } else {
          setNotifications(response.data.notifications);
        }
        setNextCursor(response.data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    };
    init();

    const interval = setInterval(async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLoadMore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingMore || !nextCursor) return;

    setIsLoadingMore(true);
    await fetchNotifications(nextCursor);
    setIsLoadingMore(false);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const handleNotificationClick = (notification: GetNotifications200NotificationsItem) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    router.push(getNotificationRoute(notification.type));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-12 rounded-2xl hover:bg-primary/5 transition-all group cursor-pointer"
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
                  <div className="absolute -bottom-1 -right-1 rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium leading-relaxed text-foreground">
                    <span className="font-black uppercase italic text-[11px] tracking-tight mr-1">
                      {notification.sender?.name || "PowerFit"}:
                    </span>
                    {getNotificationMessage(notification)}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {formatRelativeTime(notification.createdAt)}
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

          {nextCursor && (
            <div className="p-2 pt-0">
              <Button
                variant="ghost"
                size="sm"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
                className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="size-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Carregando...
                  </div>
                ) : (
                  "Ver notificações anteriores"
                )}
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
