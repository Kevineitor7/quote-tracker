import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNameStore = create(
    persist(
        (set) => ({
            setName: (inputValue) => set({ name: inputValue}),
        }),
        { name: "user-name"}
    )
)