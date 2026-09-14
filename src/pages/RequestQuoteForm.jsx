import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '../custom-hooks/useToast.jsx'
import { Toast } from '../portals/Toast.jsx'

const requestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email"),
    serviceType: z.enum(["interior", "exterior"], { message: "Select a service type" }),
    message: z.string().min(10, "Tell us more about the job"),
})

export default function RequestQuoteForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(requestSchema) })

    const toast = useToast()

    function onSubmit(data) {
        console.log(data)
        toast.add('request-quote-form')
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 flex text-white justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                <label>
                    Name
                    <input {...register("name")} className={`p-2 bg-gray-300 border-1 mx-4 text-black focus:outline-2 focus:bg-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-600'}`}/>
                    {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
                </label>
                <label>
                    Email
                    <input {...register("email")} className={`p-2 bg-gray-300 border-1 mx-4 text-black focus:outline-2 focus:bg-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-600'}`}/>
                    {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
                </label>
                <label>
                    Service Type
                    <select {...register("serviceType")} className={`p-2 bg-gray-300 border-1 mx-4 text-black focus:outline-2 focus:bg-gray-400 ${errors.serviceType ? 'border-red-500' : 'border-gray-600'}`}>
                        <option selected value="default">Select service type</option>
                        <option value="interior">Interior</option>
                        <option value="exterior">Exterior</option>
                    </select>
                    {errors.serviceType && <span className='text-red-500 text-sm'>{errors.serviceType.message}</span>}
                </label>
                <label>
                    Message
                    <input {...register("message")} className={`p-2 bg-gray-300 border-1 mx-4 text-black focus:outline-2 focus:bg-gray-400 ${errors.message ? 'border-red-500' : 'border-gray-600'}`}/>
                    {errors.message && <span className='text-red-500 text-sm'>{errors.message.message}</span>}
                </label>
                <button type="submit" className='px-4 py-2 w-1/3 rounded-lg text-sm text-white font-medium border bg-indigo-600 border-indigo-500 cursor-pointer'>Submit</button>
            </form>
            <Toast toasts={toast.toasts} remove={toast.remove}></Toast>
        </div>
    )
}