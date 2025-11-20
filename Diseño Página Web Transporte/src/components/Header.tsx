import { Button } from "./ui/button";
import { Menu, Car, LogIn } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">MoviLab</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="hover:text-primary transition-colors">Inicio</a>
            <a href="#transporte" className="hover:text-primary transition-colors">Vehículos</a>
            <a href="#domicilios" className="hover:text-primary transition-colors">Domicilios</a>
            <a href="#roles" className="hover:text-primary transition-colors">Plataforma</a>
            <a href="#reservas" className="hover:text-primary transition-colors">Reservas</a>
            <a href="#ubicacion" className="hover:text-primary transition-colors">Sucursales</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={onLoginClick}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar sesión
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <a href="#inicio" className="hover:text-primary transition-colors">Inicio</a>
              <a href="#transporte" className="hover:text-primary transition-colors">Vehículos</a>
              <a href="#domicilios" className="hover:text-primary transition-colors">Domicilios</a>
              <a href="#roles" className="hover:text-primary transition-colors">Plataforma</a>
              <a href="#reservas" className="hover:text-primary transition-colors">Reservas</a>
              <a href="#ubicacion" className="hover:text-primary transition-colors">Sucursales</a>
              <Button 
                className="bg-primary hover:bg-primary/90 w-full"
                onClick={onLoginClick}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar sesión
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
