import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TicketsState {
  tickets: any[];
  setTickets: (tickets: any[]) => void;
  addTicket: (ticket: any) => void;
}

export const useTicketsStore = create<TicketsState>()(
  persist(
    (set) => ({
      tickets: [],
      setTickets: (tickets) => set({ tickets }),
      addTicket: (ticket) =>
        set((state) => ({ tickets: [...state.tickets, ticket] })),
    }),
    {
      name: "tickets-storage", // localStorage key
    }
  )
);
