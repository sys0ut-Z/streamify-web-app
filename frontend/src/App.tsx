import { Route, Routes } from "react-router"
import { Toaster } from "react-hot-toast"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import NotificationsPage from "./pages/NotificationsPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import GuestRoute from "./components/authRoutes/GuestRoute"
import ProtectedRoute from "./components/authRoutes/ProtectedRoute"
import OnboardProtectedRoute from "./components/authRoutes/OnboardProtectedRoute"
import OnboardingPage from "./pages/OnboardingPage"
import AuthLayout from "./layout/AuthLayout"
import { useThemeStore } from "./store/theme.store"
import MainLayout from "./layout/MainLayout"

function App() {
  const {theme} = useThemeStore();

  return (
    <div data-theme={theme}>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route element={<MainLayout showSidebar/>}>
          <Route path="/" element={<ProtectedRoute />} >
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Route>
        <Route path="/onboarding" element={<OnboardProtectedRoute />} >
          <Route index element={<OnboardingPage />} />
        </Route>
        <Route path="/call" element={<CallPage />} />
        <Route path="/auth" element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
