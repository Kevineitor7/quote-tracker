import { Routes, Route } from 'react-router'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Overview from './pages/Overview.jsx'
import Quotes from './pages/Quotes.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Clients from './pages/Clients.jsx'
import ClientDetail from './pages/ClientDetail.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={ <DashboardLayout/> }>
        <Route index element={ <Overview/> }/>
        <Route path='/quotes' element={ <Quotes/> }/>
        <Route path='/jobs' element={ <Jobs/> }/>
        <Route path='/jobs/:jobId' element={ <JobDetail/> }/>
        <Route path='/clients' element={ <Clients/> }/>
        <Route path='/clients/:clientId' element={ <ClientDetail/> }/>
        <Route path='/settings' element={ <Settings/> }/>
      </Route>
    </Routes>
  )
}