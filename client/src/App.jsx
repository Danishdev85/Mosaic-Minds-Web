import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Therapists from './pages/Therapists.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import LookupAppointment from './pages/LookupAppointment.jsx';
import Contact from './pages/Contact.jsx';
import TherapistLogin from './pages/TherapistLogin.jsx';
import TherapistDashboard from './pages/TherapistDashboard.jsx';
import VideoSession from './pages/VideoSession.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/lookup" element={<LookupAppointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/session/:roomName" element={<VideoSession />} />

          <Route path="/therapist/login" element={<TherapistLogin />} />
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />

          {/* Secret admin route — no nav link, reached only via Ctrl+Shift+X */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;