import { useAuthStore } from "../store/useAuthStore.js";

export default function Settings() {
    const logout = useAuthStore((state) => state.logout)

    return (
        <div>
            <div>
                Settings
            </div>
            <button
                onClick={() => logout()} 
                className="px-4 py-2 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 cursor-pointer">
                Log out
            </button>
        </div>
        
    )
}