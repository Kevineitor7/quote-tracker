import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNameStore = create(
    persist(
        (set) => ({
            name: "Mr.Person",
            setName: (inputValue) => set({ name: inputValue}),
        }),
        { name: "user-name"}
    )
)