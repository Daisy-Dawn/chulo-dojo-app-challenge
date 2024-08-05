import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import Signup from './components/authentication/Signup'
import Login from './components/authentication/Login'
import Layout from './components/helper/Layout'
import DashboardLayout from './components/dashboard/Layout/DashboardLayout'
import Dashboard from './components/dashboard/Dashboard'
import NewProject from './components/dashboard/NewProject'
import PrivateRoutes from './components/other/PrivateRoutes'
import { AuthProvider } from './components/other/AuthProvider'
import ProjectDetails from './components/helper/ProjectDetails'
// Uncomment the ErrorPage import if you have an ErrorPage component
// import ErrorPage from './components/ErrorPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route element={<Layout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route element={<PrivateRoutes />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/dashboard/:projectId"
                                element={<ProjectDetails />}
                            />
                            <Route
                                path="/newproject"
                                element={<NewProject />}
                            />
                        </Route>
                    </Route>

                    {/* <Route path="*" element={<ErrorPage />} /> */}
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
