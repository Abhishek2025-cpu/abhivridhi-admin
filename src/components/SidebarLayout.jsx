import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute'; // Import ProtectedRoute

// Sabhi components import karein (Aapke existing imports)
import AddStore from './AddStore';
import Header from './Header';
import SideMenu from './SideMenu';
import TruckCategories from './TruckCategories';
import BasePrice from './BasePrice';
import VehicleDescriptions from './VehicleDescriptions';
import VehicleRegistration from './VehicleRegistration';
import Dashboard from './Dashboard';
import Categories from './Categories';
import ContactedUsers from './ContactedUsers';
import Clients from './Clients';
import States from './states';
import Areas from './Areas';
import Addresses from './Addresses';
import EnterpriseFeatures from './EnterpriseFeatures';
import News from './News';
import Blog from './Blog';
import FAQs from './FAQs';
import InsuranceFAQ from './InsuranceFAQ';
import Support from './Support';
import Policy from './Policy';
import ZeroTolerancePolicy from './ZeroTolerancePolicy';
import DeliveryPartners from './DeliveryPartners';
import EditFAQ from './EditFAQ';
import Login from './login';
import AllUsers from './AllUsers';
import AllDrivers from './AllDrivers';
import ShippingList from './ShippingList';
import Complaints from './Complaints';
import OpsDashboard from './OpsDashboard/OpsDashboard';
import MarketingCoupons from './MarketingCoupons/MarketingCoupons';
import DeliveryFailures from './DeliveryFailures/DeliveryFailures';
import RiderDisputes from './RiderDisputes/RiderDisputes';
import Profile from './Profile/Profile';
import AddBanner from './AddBanner';

const SidebarLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes Wrapper */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-200">
                <Header toggleMenu={toggleMenu} />
                <div className="flex flex-1">
                  <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                  <div className={`flex-1 p-6 ${isMenuOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
                    <Routes>
                      <Route path="/Dashboard" element={<Dashboard />} />
                      <Route path="/Near-by-store" element={<AddStore />} />
                      <Route path="/DeliveryPartners" element={<DeliveryPartners />} />
                      <Route path="/All-Users" element={<AllUsers />} />
                      <Route path="/All-driver" element={<AllDrivers />} />
                      <Route path="/Shipping" element={<ShippingList />} />
                      <Route path="/truck-categories" element={<TruckCategories />} />
                      <Route path="/base-price" element={<BasePrice />} />
                      <Route path="/vechile-disc" element={<VehicleDescriptions />} />
                      <Route path="/Vehicle-Registration" element={<VehicleRegistration />} />
                      <Route path="/Categories" element={<Categories />} />
                      <Route path="/Contacted-Users" element={<ContactedUsers />} />
                      <Route path="/Clients" element={<Clients />} />
                      <Route path="/complaints" element={<Complaints />} />
                      <Route path="/states" element={<States />} />
                      <Route path="/Areas" element={<Areas />} />
                      <Route path="/Addresses" element={<Addresses />} />
                      <Route path="/Enterprise-Features" element={<EnterpriseFeatures />} />
                      <Route path="/News" element={<News />} />
                      <Route path="/Blog" element={<Blog />} />
                      <Route path="/FAQs" element={<FAQs />} />
                      <Route path="/edit-faq/:id" element={<EditFAQ />} />
                      <Route path="/Insurance-FAQ" element={<InsuranceFAQ />} />
                      <Route path="/Support" element={<Support />} />
                      <Route path="/Policy" element={<Policy />} />
                      <Route path="/ZeroTolerancePolicy" element={<ZeroTolerancePolicy />} />
                      <Route path="/add-banner" element={<AddBanner/>} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/ops-dashboard" element={<OpsDashboard />} />
                      <Route path="/marketing-coupons" element={<MarketingCoupons />} />
                      <Route path="/delivery-failures" element={<DeliveryFailures />} />
                      <Route path="/rider-disputes" element={<RiderDisputes />} />
                      
                      {/* Redirect if route not found */}
                      <Route path="*" element={<Navigate to="/Dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default SidebarLayout;