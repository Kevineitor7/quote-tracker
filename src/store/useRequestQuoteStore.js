import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRequestQuoteStore = create(
    persist(
        (set) => ({
            requests: [],
            addRequest: (data) => set({requests: data})
        }),
        { name: 'quote-requests' }
    )
)