import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SolutionsPage from './pages/SolutionsPage'
import TeamPage from './pages/TeamPage'
import MethodPage from './pages/MethodPage'
import CasesPage from './pages/CasesPage'

export default function App() {
  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="/cases" element={<CasesPage />} />
      </Routes>
    </div>
  )
}
