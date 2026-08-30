import { useState, useReducer, useEffect } from 'react'
import { createPortal } from 'react-dom'

function quotesReducer(quotes, action) {
  switch (action.type) {
    case 'add-job':
      return [
        ...quotes,
        action.payload
      ]
    case 'edit-job':
      return quotes.map((quote) =>
        quote.id === action.payload.id
          ? { ...action.payload }
          : quote
      )
    case 'remove-job':
      return quotes.filter(quote => quote.id !== action.payload)
    case 'toggle-details':
      return quotes.map((quote) => 
          quote.id === action.payload
            ? { ...quote, details: !quote.details }
            : quote
      )
    case 'status-update':
      return quotes.map((quote) => 
        quote.id === action.payload.id
          ? { ...quote, status: action.payload.status }
          : quote
      )
    default:
      return quotes
  }
}

function getTotal(type, items) {
  if (type === "Exterior") {
    let sqft = Number(items[0].sqft)
    let colors = Number(items[0].colors)
    let colorChange = items[0].cc
    let ccRate = 1.2

    let total = (sqft * colors) / 1.4
    if (colorChange) total *= ccRate 
    return (Math.round(total / 100) * 100).toFixed(0)
  } else if (type === "Interior") {
    let roomRates = {
      "Bedroom (Walls)": 300,
      "Bedroom (Walls + Trim)": 400,
      "Bedroom (Walls + Trim + Ceiling)": 600,
      "Living Room (Walls)": 400,
      "Living Room (Walls + Trim)": 500,
      "Living Room (Walls + Trim + Ceiling)": 700,
      "Kitchen (Walls)": 300,
      "Kitchen (Walls + Trim)": 500,
      "Kitchen (Walls + Trim + Ceiling)": 600,
    }
    let total = items.reduce((acc, room) => {
      acc += roomRates[room.description]
      if (room.cc) acc *= 1.4
      return acc
    }, 0)
    return (Math.round(total / 100) * 100).toFixed(0)
  }
}

function App() {

  const [quoteForm, setQuoteForm] = useState(false)
  const [formJobType, setformJobType] = useState("Interior")
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    date: "",
    name: "", 
    address: "",
    type: formJobType,
    items: [],
    status: "Draft",
    details: false,
    editing: false
  })

  const [rooms, setRooms] = useState([
    {type: "Bedroom", name: "Bedroom"},
    {type: "Kitchen", name: "Kitchen"},
    {type: "Living Room", name:"Living Room"},
  ])

  function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)

  function open(payload = null) {
    setData(payload)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return { isOpen, data, open, close }
}

  const modal = useModal()

  const originalQuotes = [
    { 
      id: crypto.randomUUID(),
      date: "2026-05-30", 
      name: "Lester Lucas",
      address: "Kingorito",
      type: "Interior",
      items: [
        {name: "Bedroom", description: "Bedroom (Walls + Trim)", cc: true},
        {name: "Bedroom 2", description: "Bedroom (Walls + Trim)", cc: true},
        {name: "Living Room", description: "Living Room (Walls + Trim)", cc: true}
      ], 
      status: "Draft",
      details: false,
      editing: false
    },
    { 
      id: crypto.randomUUID(), 
      date: "2026-06-30", 
      name: "Chester Cheetos",
      address: "Congito, Congo",
      type: "Exterior",
      items: [
        {sqft: "2500", colors: "2", cc: true}
      ], 
      status: "Accepted",
      details: false,
      editing: false
    }
  ]

  function loadQuotes(quotes) {
    const stored = localStorage.getItem("quotes")
    return stored ? JSON.parse(stored) : quotes
  }

  const [quotes, dispatch] = useReducer(quotesReducer, originalQuotes, loadQuotes)

  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(quotes))
  }, [quotes])

  function addBedroom(e) {
    e.preventDefault()
    const amountOfBedrooms = rooms.filter((room) => room.type === "Bedroom").length
    setRooms(prev => [...prev, {type: "Bedroom", name: `Bedroom ${amountOfBedrooms + 1}`}])
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.editing === true) {
      dispatch({ type: 'edit-job', payload: form })
    } else {
      dispatch({ type: 'add-job', payload: form })
    }
    const emptyForm = {
      id: crypto.randomUUID(),
      date: "",
      name: "", 
      address: "",
      type: formJobType,
      items: [],
      status: "Draft",
      details: false,
      editing: false
    }
    setForm(emptyForm)
    setQuoteForm(false)
    setRooms([
      {type: "Bedroom", name: "Bedroom"},
      {type: "Kitchen", name: "Kitchen"},
      {type: "Living Room", name: "Living Room"},
    ])
  }

  function updateForm(e) {
    switch (e.target.name) {
      case 'date':
        setForm(prev => ({ ...prev, date: e.target.value }))
        break
      case 'name':
        setForm(prev => ({ ...prev, name: e.target.value }))
        break
      case 'address':
        setForm(prev => ({ ...prev, address: e.target.value }))
        break
      case 'job-type':
        setForm(prev => ({ ...prev, type: e.target.value, items: [...form.items] }))
        setformJobType(e.target.value)
        break
      case 'Kitchen':
      case 'Bedroom':
      case 'Living Room':
      case 'Bedroom 2':
      case 'Bedroom 3': {
        const index = form.items.findIndex(item => item.name === e.target.name)
        if (index !== -1) {
          setForm(prev => {
            const updatedItems = prev.items.map((item, i) => 
              i === index ? { ...item, description: e.target.value } : item
            )
            return { ...prev, items: updatedItems }
          })
        } else {
            setForm(prev => ({
              ...prev,
              items: [...prev.items, { name: e.target.name, description: e.target.value }]
            }))
        }
        break
      }
      case 'Kitchen-cc':
      case 'Bedroom-cc':
      case 'Living Room-cc':
      case 'Bedroom 2-cc':
      case 'Bedroom 3-cc': {
        const room = e.target.name.slice(0, -3)
        const index = form.items.findIndex(item => item.name === room)
        if (index !== -1) {
          setForm(prev => {
            const updatedItems = prev.items.map((item, i) => 
              i === index ? { ...item, cc: e.target.checked } : item
            )
            return { ...prev, items: updatedItems }
          })
        } else {
            setForm(prev => ({
              ...prev,
              items: [...prev.items, { name: room, cc: e.target.checked }]
            }))
        }
        break
      }
      case 'sqft': {
        if (form.items.length !== 0) {
            setForm(prev => ({ 
            ...prev,
            items: [{ ...prev.items[0], sqft: e.target.value }]
          }))
        } else {
            setForm(prev => ({ 
            ...prev,
            items: [{ sqft: e.target.value }]
          }))
        }
        break
      }
      case 'colors': {
        if (form.items.length !== 0) {
            setForm(prev => ({ 
            ...prev,
            items: [{ ...prev.items[0], colors: e.target.value }]
          }))
        } else {
            setForm(prev => ({ 
            ...prev,
            items: [{ colors: e.target.value }]
          }))
        }
        break
      }
      case 'exterior-color-change': {
        if (form.items.length !== 0) {
            setForm(prev => ({ 
            ...prev,
            items: [{ ...prev.items[0], cc: e.target.checked }]
          }))
        } else {
            setForm(prev => ({ 
            ...prev,
            items: [{ cc: e.target.checked }]
          }))
        }
        break
      }
      default:
        return 
    }
  }

  function jobEdit(id) {
    let editingQuote = quotes.find(quote => quote.id === id)
    setForm({ ...editingQuote, editing: true })
    setformJobType(editingQuote.type)
    setQuoteForm(true)
  }

  function checkRoomSelection(type, name) {
    let checked
    form.items.map((item) => {
      if (item.description === type && item.name === name) {
        checked = true
        return
      }
    })
    return checked
  }

  function checkCC(room) {
    let checked
    if (room === "Exterior") {
      form.items.map((item) => {
        if (item.cc === true) {
          checked = true
        }
      })
    } else {
      form.items.map((item) => {
        if (item.name === room) {
          if (item.cc === true) {
            checked = true
          }
        }
      })
    }
    return checked
  }

  const nextStatus = {
    Draft: "Sent",
    Sent: "Rejected",
    Rejected: "Accepted",
    Accepted: "Draft",
  }

  function updateStatus(id, currentStatus) {
    dispatch({ type: 'status-update', payload: { id, status: nextStatus[currentStatus] } })
  }

  return (
    <div className='min-h-screen bg-gray-900 p-4 text-white'>
      <div className='max-w-2x1 my-12 p-6'>
        <h2 className='text-lg'>Quotes</h2>
        <div className='mt-4 flex flex-col gap-4'>
          <span className='grid grid-cols-7 text-sm p-4'>
            <span>Date</span>
            <span>Name</span>
            <span>Address</span>
            <span>Job Type</span>
            <span>Quote Status</span>
            <span>Total</span>
          </span>
          {quotes.map((quote) => (
              <div className='grid grid-cols-7 border-2 items-center border-gray-600 bg-gray-700 rounded-2xl p-2 text-sm' key={quote.id}>
                    <span>{quote.date}</span>
                    <span>{quote.name}</span>
                    <span>{quote.address}</span>
                    <span>{quote.type}</span>
                    <span 
                      className={`border-2 rounded-xl w-24 text-center p-1 font-bold cursor-pointer
                      ${quote.status === "Draft" && 'before:content-["📜"] border-yellow-700 bg-yellow-900'}
                      ${quote.status === "Sent" && 'before:content-["📩"] border-blue-700 bg-blue-900'} 
                      ${quote.status === "Rejected" && 'before:content-["❌"] border-red-700 bg-red-900'}
                      ${quote.status === "Accepted" && 'before:content-["✅"] border-green-700 bg-green-900'}`}
                      onClick={() => updateStatus(quote.id, quote.status)}> {quote.status}
                    </span>
                    <span>{getTotal(quote.type, quote.items)}</span>
                    <div className='flex flex-wrap gap-2'>
                      <button onClick={() => dispatch({ type: 'toggle-details', payload: quote.id })} className={`px-2 py-2 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 cursor-pointer`}>
                        {quote.details ? "Hide Details" : "See Details"}
                      </button>
                      <button onClick={() => jobEdit(quote.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 cursor-pointer`}>
                        Edit
                      </button>
                      <button onClick={() => {
                        modal.open(quote)
                      }} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 cursor-pointer`}>
                        Remove
                      </button>
                    </div>
                    { quote.details && 
                      <ul className='flex flex-col gap-4 m-4'>
                        {quote.items.map((entry, index) => {
                          if (quote.type === "Interior") {
                            return <li className='' key={index}>{ entry.description } { entry.description && entry.cc && "(Color Change)" }</li>
                          } else if (quote.type === "Exterior") {
                            return <li className='flex' key={index}>Sqft: { entry.sqft } Colors: { entry.colors } { entry.cc && "(Color Change)" }</li>
                          }
                        })}
                      </ul>
                    }
              </div>
          ))}
        </div>
        { quoteForm ? (
          <>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-gray-200 text-gray-900 p-6 mt-12 w-2/5 rounded-md'>
              <h3 className='self-center mb-4'>Quote Form</h3>
              <div className='flex items-center gap-4'>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" value={form.date} onChange={(e) => updateForm(e)} required className='bg-gray-400 p-2 rounded-lg'/>
              </div>
              <div className='flex items-center gap-4'>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" value={form.name} onChange={(e) => updateForm(e)} required className='bg-gray-400 p-2 rounded-lg'/>
              </div>
              <div className='flex items-center gap-4'>
                <label for="address">Address:</label>
                <input type="text" id="address" name="address" value={form.address} onChange={(e) => updateForm(e)} required className='bg-gray-400 p-2 rounded-lg'/>
              </div>
              <div className='flex items-center gap-4'>
                <label for="job-type">Job type:</label>
                <select 
                  id="job-type"
                  name='job-type'
                  value={formJobType}
                  onChange={(e) => updateForm(e)}
                >
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                </select>
              </div>
              <div className='flex flex-col'>
                { formJobType === 'Interior' && (
                  <>
                    { rooms.map((room) => (
                      <div className='flex gap-2 mt-4'>
                        <span>{room.name}:</span>
                        <input type="radio" id={`${room.name}-walls`} name={room.name} onChange={(e) => updateForm(e)} value={`${room.type} (Walls)`} checked={!!checkRoomSelection(`${room.type} (Walls)`, room.name)}/>
                        <label for={`${room.name}-walls`}>Walls</label>
                        <input type="radio" id={`${room.name}-walls-trim`} name={room.name} onChange={(e) => updateForm(e)} value={`${room.type} (Walls + Trim)`} checked={!!checkRoomSelection(`${room.type} (Walls + Trim)`, room.name)}/>
                        <label for={`${room.name}-walls-trim`}>Walls + Trim</label>
                        <input type="radio" id={`${room.name}-walls-trim-ceiling`} name={room.name} onChange={(e) => updateForm(e)} value={`${room.type} (Walls + Trim + Ceiling)`} checked={!!checkRoomSelection(`${room.type} (Walls + Trim + Ceiling)`, room.name)}/>
                        <label for={`${room.name}-walls-trim-ceiling`}>Walls + Trim + Ceiling</label>
                        <input type="checkbox" id={`${room.name}-color-change`} name={`${room.name}-cc`} onChange={(e) => updateForm(e)} value={`${room.type} Color Change`} checked={!!checkCC(`${room.name}`)}/>
                        <label for={`${room.name}-color-change`}>Color Change</label> 
                      </div>
                    ))}
                    { rooms.length < 5 && (
                      <button
                        className={`px-4 py-2 mt-8 rounded-lg text-sm text-gray-200 font-medium border bg-indigo-600 border-indigo-500 flex-1 w-1/3 cursor-pointer`}
                        onClick={addBedroom}
                      >
                        Add Bedroom
                      </button>
                    )}
                  </>
                )}
                { formJobType === 'Exterior' && (
                  <>
                    <div className='flex flex-col mt-4 gap-4'>
                      <div className='flex items-center gap-2'>
                        <label for="sqft">Sqft:</label>
                        <input type="number" name="sqft" id="sqft" value={form.items[0]?.sqft} min="0" onChange={(e) => updateForm(e)} required className="bg-gray-400 p-2 rounded-lg"/>
                      </div>
                      <div className='flex gap-2'>
                        <span>Colors:</span>
                        <input type="radio" id="1-color" name="colors" onChange={(e) => updateForm(e)} value="1" checked={form.items[0]?.colors === "1"} required/>
                        <label for="1-color">1</label>
                        <input type="radio" id="2-color" name="colors" onChange={(e) => updateForm(e)} value="2" checked={form.items[0]?.colors === "2"} required/>
                        <label for="2-color">2</label>
                        <input type="radio" id="3-color" name="colors" onChange={(e) => updateForm(e)} value="3" checked={form.items[0]?.colors === "3"} required/>
                        <label for="3-color">3</label>
                      </div>
                      <div className='flex gap-2'>
                        <label for="exterior-color-change">Color Change</label> 
                        <input type="checkbox" id="exterior-color-change" name="exterior-color-change" onChange={(e) => updateForm(e)} value="Exterior Color Change" checked={!!checkCC("Exterior")}/>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className='flex gap-2 text-gray-200'>
                <button
                  className={`px-4 py-2 mt-4 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 flex-1 w-1/3 cursor-pointer`}
                  type='submit'
                >
                  Save
                </button>
                <button
                  className={`px-4 py-2 mt-4 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 flex-1 w-1/3 cursor-pointer`}
                  onClick={() => {
                    setQuoteForm((prev) => !prev)
                    setForm({
                      id: crypto.randomUUID(),
                      date: "",
                      name: "", 
                      address: "",
                      type: formJobType,
                      items: [],
                      status: "Draft",
                      details: false,
                      editing: false
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <button
            className={`px-4 py-2 mt-8 rounded-lg text-sm font-medium border bg-indigo-600 border-indigo-500 flex-1 cursor-pointer`}
            onClick={() => setQuoteForm((prev) => !prev)}
          >
            + Add Quote
          </button>
        )}
      </div>
      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <p>Delete quote for {modal.data?.name}?</p>
        <button 
          onClick={modal.close} 
          className='rounded-xl border-1 m-2 px-2 py-1 cursor-pointer'>
            Cancel
        </button>
        <button 
          onClick={() => {
            dispatch({ type: 'remove-job', payload: modal.data.id })
            modal.close()
        }}
          className='rounded-xl border-1 m-2 px-2 py-1 cursor-pointer bg-red-800 text-white'>
            Delete
        </button>
      </Modal>
    </div>
  )
}

function Modal({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional two-step mount:
      // shouldRender must flip before isVisible so the browser paints a "hidden" frame first
      setShouldRender(true)
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the fade-out
      // immediately; the actual unmount is deliberately delayed via the timeout below
      setIsVisible(false)
      const timeout = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 
      ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={onClose}>
      <div 
        className={`bg-white rounded-lg p-6 text-center transition-all duration- 200
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default App

