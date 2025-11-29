import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Notification {
  title: string;
  description: string;
  iconUrl: string;
}

interface NotificationState {
  notifications: Notification[];
  setNotifications: (items: Notification[]) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      setNotifications: (items) => set({ notifications: items }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
    }),
    {
      name: "notifications-storage", // localStorage key
    }
  )
);
