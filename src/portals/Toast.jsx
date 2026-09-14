import { createPortal } from 'react-dom'

export function Toast({ toasts, remove }) {
  const toastStyling = {
    'quote-addition': 'border-green-300 bg-green-900',
    'request-quote-form': 'border-green-300 bg-green-900',
    'quote-removal': 'border-orange-300 bg-orange-900',
    'quote-edit': 'border-blue-300 bg-blue-700',
    'form-validation': 'border-yellow-300 bg-yellow-900',
  }
  return createPortal(
    <div className='fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md text-center z-50 flex flex-col gap-2'>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg px-12 py-4 text-white ${toastStyling[t.type]}`}
        >
          {t.message}
          <button 
            className='relative left-28 bottom-2 cursor-pointer' 
            onClick={() => remove(t.id)}
          >
            &#x2715;
          </button>
        </div>
      ))}
    </div>,
    document.getElementById('toast-root')
  )
}