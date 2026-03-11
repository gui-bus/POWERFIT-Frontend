import { describe, it, expect } from 'vitest'
import { getNotificationMessage, getNotificationRoute } from '@/components/notificationHelpers'
import { GetNotifications200NotificationsItem } from '@/lib/api/fetch-generated'

describe('Notification Helpers', () => {
  describe('getNotificationMessage', () => {
    it('should return correct message for FRIEND_REQUEST', () => {
      const mockNotification = { type: 'FRIEND_REQUEST' } as GetNotifications200NotificationsItem
      expect(getNotificationMessage(mockNotification)).toBe('enviou um pedido de amizade.')
    })

    it('should return correct message for LEVEL_UP', () => {
      const mockNotification = { type: 'LEVEL_UP' } as GetNotifications200NotificationsItem
      expect(getNotificationMessage(mockNotification)).toBe('Parabéns! Você subiu de nível!')
    })

    it('should return default message for unknown type', () => {
      const mockNotification = { type: 'UNKNOWN' as any } as GetNotifications200NotificationsItem
      expect(getNotificationMessage(mockNotification)).toBe('enviou uma notificação.')
    })
  })

  describe('getNotificationRoute', () => {
    it('should return /friends for FRIEND_REQUEST', () => {
      expect(getNotificationRoute('FRIEND_REQUEST')).toBe('/friends')
    })

    it('should return /feed for COMMENT_RECEIVED', () => {
      expect(getNotificationRoute('COMMENT_RECEIVED')).toBe('/feed')
    })

    it('should return /achievements for LEVEL_UP', () => {
      expect(getNotificationRoute('LEVEL_UP')).toBe('/achievements')
    })

    it('should return / for unknown type', () => {
      expect(getNotificationRoute('UNKNOWN' as any)).toBe('/')
    })
  })
})
