import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './styling.css';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { AuthenticatedLanding } from './pages/AuthenticatedLanding';
// import { StudentDashboard } from './pages/StudentDashboard';
// import { CompanyDashboard } from './pages/CompanyDashboard';
import { PublicStudentProfile } from './pages/PublicStudentProfile';
import { PublicCompanyProfile } from './pages/PublicCompanyProfile';
import Onboarding from './pages/Onboarding';
import StudentOnboarding from './pages/StudentOnboarding';
import CompanyOnboarding from './pages/CompanyOnboarding';
import StudentDirectory from './pages/StudentDirectory';
import { NotFound } from './pages/NotFound';
import { MainLayout } from './components/shared/MainLayout';
import { Opportunities } from './pages/Opportunities';
import { OpportunityProfile } from './pages/OpportunityProfile';
import { Companies } from './pages/Companies';
import { logout } from './lib/api/auth';

function App() {
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/signin" element={<MainLayout><SignIn /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignUp /></MainLayout>} />
        <Route path="/onboarding" element={<MainLayout><Onboarding /></MainLayout>} />
        <Route path="/onboarding/student" element={<MainLayout><StudentOnboarding /></MainLayout>} />
        <Route path="/onboarding/company" element={<MainLayout><CompanyOnboarding /></MainLayout>} />
        <Route path="/home" element={<AuthenticatedLanding onLogout={handleLogout} userType="student" />} />
        <Route path="/student-home" element={<AuthenticatedLanding onLogout={handleLogout} userType="student" />} />
        {/* <Route path="/student-dashboard" element={<StudentDashboard onLogout={handleLogout} />} />
        <Route path="/company-dashboard" element={<CompanyDashboard onLogout={handleLogout} />} /> */}
        <Route path="/company-home" element={<AuthenticatedLanding onLogout={handleLogout} userType="company" />} />
        <Route path="/student/profile/:id" element={<PublicStudentProfile />} />
        <Route path="/company/profile/:id" element={<PublicCompanyProfile />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityProfile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/profiles" element={<StudentDirectory />} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
