import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './styling.css';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { PublicStudentProfile } from './pages/PublicStudentProfile';
import { PublicCompanyProfile } from './pages/PublicCompanyProfile';
import Onboarding from './pages/Onboarding';
import { NotFound } from './pages/NotFound';
import { MainLayout } from './components/shared/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/signin" element={<MainLayout><SignIn /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignUp /></MainLayout>} />
        <Route path="/onboarding" element={<MainLayout><Onboarding /></MainLayout>} />
        <Route path="/student-dashboard" element={<StudentDashboard onLogout={() => window.location.href = '/'} />} />
        <Route path="/company-dashboard" element={<CompanyDashboard onLogout={() => window.location.href = '/'} />} />
        <Route path="/student/profile/:id" element={<MainLayout><PublicStudentProfile /></MainLayout>} />
        <Route path="/company/profile/:id" element={<MainLayout><PublicCompanyProfile /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
