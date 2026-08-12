'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Check, Package, CreditCard, Box, Truck, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { markNotificationAsRead, markAllNotificationsAsRead } from './actions'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  type: string
  title: string
  message: string
  link_url: string | null
  is_read: boolean
  created_at: string
}

export function AdminNotifications({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications(current => 
      current.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    await markNotificationAsRead(id)
    router.refresh()
  }

  const handleMarkAllAsRead = async () => {
    setNotifications(current => current.map(n => ({ ...n, is_read: true })))
    await markAllNotificationsAsRead()
    router.refresh()
  }

  const handleNotificationClick = async (n: Notification) => {
    if (!n.is_read) {
      setNotifications(current => 
        current.map(notif => notif.id === n.id ? { ...notif, is_read: true } : notif)
      )
      await markNotificationAsRead(n.id)
      router.refresh()
    }
    setIsOpen(false)
    if (n.link_url) {
      router.push(n.link_url)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'new_order': return <Package className="h-5 w-5 text-blue-500" />
      case 'payment_verification_required': return <CreditCard className="h-5 w-5 text-orange-500" />
      case 'payment_verified': return <Check className="h-5 w-5 text-green-500" />
      case 'payment_rejected': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'order_packed': return <Box className="h-5 w-5 text-purple-500" />
      case 'order_shipped': 
      case 'out_for_delivery':
      case 'delivered': return <Truck className="h-5 w-5 text-indigo-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications right now.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="px-4 py-4 flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="ml-4 flex-shrink-0 flex">
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                            title="Mark as read"
                          >
                            <span className="sr-only">Mark as read</span>
                            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
