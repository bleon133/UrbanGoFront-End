import React from 'react';
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { TransportOptions } from "../components/TransportOptions";
import { DeliverySection } from "../components/DeliverySection";
import { RolesSection } from "../components/RolesSection";
import { ReservationSection } from "../components/ReservationSection";
import { PaymentSection } from "../components/PaymentSection";
import { LocationSection } from "../components/LocationSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const goLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={goLogin} />
      <main>
        <HeroSection onReservationClick={goLogin} />
        <TransportOptions onReservationClick={goLogin} />
        <DeliverySection />
        <RolesSection onLoginClick={goLogin} />
        <ReservationSection onLoginClick={goLogin} />
        <PaymentSection />
        <LocationSection onReservationClick={goLogin} />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

