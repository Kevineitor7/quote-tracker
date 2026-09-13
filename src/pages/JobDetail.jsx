import { useParams } from "react-router"

export default function JobDetail() {
    const { jobId } = useParams()

    return (
        <div>{jobId} detail</div>
    )
}