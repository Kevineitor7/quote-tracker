import { useNameStore } from "../store/useNameStore.js";

export default function Overview() {
    const name = useNameStore((state) => state.name)
    return (
        <div>Greetings {name}</div>
    )
}