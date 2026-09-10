import { NavLink, Outlet } from "react-router";

function Sidebar() {
    return (
        <div className="flex flex-col gap-4 bg-gray-600 p-8 text-white">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/quotes">Quotes</NavLink>
            <NavLink to="/clients">Clients</NavLink>
            <NavLink to="/settings">Settings</NavLink>
        </div>
    )
}

export default function DashboardLayout() {
    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 min-h-screen bg-gray-900 p-4 text-white">
                <Outlet/>
            </main>
        </div>
    )
}