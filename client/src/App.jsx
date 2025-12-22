/* client/src/App.jsx */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import LoginPage from './modules/auth/pages/LoginPage';
import MainLayout from './components/MainLayout'; 
import UnderConstruction from './pages/common/UnderConstruction';
import UserManagement from './modules/users/pages/UserManagement';

// GUARDS
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          
          {/* === PUBLIC ZONE (Login) === */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* === SECURE ZONE (Sidebar + Content) === */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              
              {/* --- MODULE 8: USERS (Live) --- */}
              {/* Role: SCM Admin */}
              <Route path="/users" element={<UserManagement />} />
              <Route path="/users/create" element={<Navigate to="/users" replace />} />

              {/* --- MODULE 2: ROBOT BOOKING --- */}
              {/* Role: Sales Engineer, SCM Admin */}
              <Route 
                path="/booking-request" 
                element={<UnderConstruction title="Module 2: Robot Booking Request" />} 
              />

              {/* --- MODULE 3: APPROVALS --- */}
              {/* Role: Sales Manager */}
              <Route 
                path="/approvals" 
                element={<UnderConstruction title="Module 3: Booking Approvals" />} 
              />

              {/* --- MODULE 4: ALLOCATION --- */}
              {/* Role: SCM Admin */}
              <Route 
                path="/allocation" 
                element={<UnderConstruction title="Module 4: Stock Allocation" />} 
              />

              {/* --- MODULE 5: RBR INFO --- */}
              {/* Role: All Roles */}
              <Route 
                path="/rbr-info" 
                element={<UnderConstruction title="Module 5: RBR Information" />} 
              />

              {/* --- MODULE 6: REPORTS --- */}
              {/* Role: SCM Admin, Management */}
              <Route 
                path="/reports" 
                element={<UnderConstruction title="Module 6: Reports & Analytics" />} 
              />

              {/* --- MODULE 7: SETTINGS (Placeholder) --- */}
              <Route 
                path="/settings" 
                element={<UnderConstruction title="System Settings" />} 
              />
              
              {/* --- MODULE 10: INVENTORY (Coming Soon) --- */}
              <Route 
                path="/inventory" 
                element={<UnderConstruction title="Module 10: Robot Inventory" />} 
              />

            </Route>
          </Route>

          {/* === CATCH ALL (Redirect to Root -> PublicRoute handles the rest) === */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;