import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRequestQuoteStore = create(
    persist(
        (set) => ({
            requests: [],
            addRequest: (data) => set((state) => {
                const alreadyExists = state.requests.some(
                    (r) => JSON.stringify(r) === JSON.stringify(data)
                )
                return alreadyExists ? state : { requests: [...state.requests, data] }
            })
        }),
        { name: 'quote-requests' }
    )
)