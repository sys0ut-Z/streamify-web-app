import { Route, Routes } from "react-router"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import NotificationsPage from "./pages/NotificationsPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import { Toaster } from "react-hot-toast"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/authRoutes/ProtectedRoute"

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/auth">
          <Route path="signup" element={
            <ProtectedRoute>
              <SignupPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={
            <ProtectedRoute>
              <LoginPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  )
}

export default App
