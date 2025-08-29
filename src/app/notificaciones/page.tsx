"use client"

import NotificationCard from "@/components/notificaciones/NotificationCard"
import EmptyState from "@/components/notificaciones/EmptyState"

const notifications = [
  { id: 1, title: "Pedido confirmado", message: "Tu pedido #123 ha sido confirmado.", date: "Hoy" },
  { id: 2, title: "En camino", message: "Tu pedido #123 está en camino 🚚", date: "Ayer" }
]

export default function NotificationsPage() {
  return (
    <section className="bg-[#f9f9f9] min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-6">Notificaciones</h1>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(n => (
              <NotificationCard key={n.id} {...n} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}