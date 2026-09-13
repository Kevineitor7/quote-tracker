import { useAuthStore } from "../store/useAuthStore.js";
import { useNameStore } from "../store/useNameStore.js";
import { useNavigate } from "react-router";
import { useState } from "react"

export default function Login() {
    const login = useAuthStore((state) => state.login)
    const setName = useNameStore((state) => state.setName)
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        login()
        if (inputValue.trim() === "") {
            setName("Mr.Person")
        } else {
            setName(inputValue)
        }
        navigate("/")
    }


    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex gap-4">
                <label>
                    Name:
                    <input type="text" onChange={(e) => setInputValue(e.target.value)} className="p-2 bg-gray-300 border-2 mx-4 text-black"/>
                </label>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 cursor-pointer">Log</button>
            </form>
        </div>
    )
}