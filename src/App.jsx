import { Routes, Route } from 'react-router'
import ProtectedRoute from './pages/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Overview from './pages/Overview.jsx'
import Quotes from './pages/Quotes.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Clients from './pages/Clients.jsx'
import ClientDetail from './pages/ClientDetail.jsx'
import Settings from './pages/Settings.jsx'
import RequestQuoteForm from './pages/RequestQuoteForm.jsx'

export default function App() {
  return (
    <Routes>
      <Route path='/login' element={ <Login/> }/>
      <Route path='/request-quote-form' element={ <RequestQuoteForm/> }/>
      <Route element={ <ProtectedRoute/> }>
        <Route element={ <DashboardLayout/> }>
          <Route index element={ <Overview/> }/>
          <Route path='/quotes' element={ <Quotes/> }/>
          <Route path='/jobs' element={ <Jobs/> }/>
          <Route path='/jobs/:jobId' element={ <JobDetail/> }/>
          <Route path='/clients' element={ <Clients/> }/>
          <Route path='/clients/:clientId' element={ <ClientDetail/> }/>
          <Route path='/settings' element={ <Settings/> }/>
        </Route>
      </Route>
    </Routes>
  )
}