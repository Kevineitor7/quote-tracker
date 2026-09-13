import { useParams } from "react-router"

export default function ClientDetail() {
    const { clientId } = useParams()

    return (
        <div>{clientId} detail</div>
    )
}