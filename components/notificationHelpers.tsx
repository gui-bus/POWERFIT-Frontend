import { GetNotifications200NotificationsItem, GetNotifications200NotificationsItemType } from "@/lib/api/fetch-generated";
import {
  BellIcon,
  UserPlusIcon,
  LightningIcon,
  UserCircleIcon,
  StarIcon,
  TrophyIcon,
  SwordIcon,
  ChatTeardropTextIcon,
  TagIcon,
  FireIcon
} from "@phosphor-icons/react";
import { ReactNode } from "react";

export function getNotificationIcon(type: GetNotifications200NotificationsItemType): ReactNode {
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
    case "COMMENT_RECEIVED":
      return <ChatTeardropTextIcon weight="duotone" className="size-4 text-blue-400" />;
    case "TAGGED_IN_ACTIVITY":
      return <TagIcon weight="duotone" className="size-4 text-purple-500" />;
    case "PERSONAL_RECORD_BROKEN":
      return <FireIcon weight="fill" className="size-4 text-orange-600" />;
    default:
      return <BellIcon weight="duotone" className="size-4 text-muted-foreground" />;
  }
}

export function getNotificationMessage(notification: GetNotifications200NotificationsItem): string {
  switch (notification.type) {
    case "FRIEND_REQUEST": return "enviou um pedido de amizade.";
    case "FRIEND_ACCEPTED": return "aceitou seu pedido de amizade.";
    case "POWERUP_RECEIVED": return "deu um Powerup no seu treino!";
    case "LEVEL_UP": return "Parabéns! Você subiu de nível!";
    case "ACHIEVEMENT_UNLOCKED": return "Você desbloqueou uma nova conquista!";
    case "CHALLENGE_INVITE": return "convidou você para um desafio!";
    case "COMMENT_RECEIVED": return "comentou na sua atividade!";
    case "TAGGED_IN_ACTIVITY": return "marcou você em um treino!";
    case "PERSONAL_RECORD_BROKEN": return "quebrou um recorde pessoal! 🔥";
    default: return "enviou uma notificação.";
  }
}

export function getNotificationRoute(type: GetNotifications200NotificationsItemType): string {
  switch (type) {
    case "FRIEND_REQUEST":
      return "/friends";
    case "COMMENT_RECEIVED":
    case "TAGGED_IN_ACTIVITY":
    case "POWERUP_RECEIVED":
      return "/feed";
    case "LEVEL_UP":
    case "ACHIEVEMENT_UNLOCKED":
    case "PERSONAL_RECORD_BROKEN":
      return "/achievements";
    case "CHALLENGE_INVITE":
      return "/challenges";
    default:
      return "/";
  }
}
