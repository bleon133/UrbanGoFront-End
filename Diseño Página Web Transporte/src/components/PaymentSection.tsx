import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Smartphone, Banknote } from "lucide-react";

const paymentMethods = [
  {
    icon: Smartphone,
    title: "Pagos Digitales",
    description: "PSE, PayU, Nequi, Daviplata",
    features: ["Sin comisiones adicionales", "Proceso rápido", "Comprobante digital"]
  },
  {
    icon: Banknote,
    title: "Efectivo",
    description: "En nuestras sucursales físicas",
    features: ["Sin recargos", "Disponible 24/7", "Recibo inmediato"]
  }
];

const securityFeatures = [
  {
    title: "Encriptación SSL 256-bit",
    description: "Tus datos están protegidos con la máxima seguridad"
  },
  {
    title: "Certificación PCI DSS",
    description: "Cumplimos con los estándares internacionales de seguridad"
  },
  {
    title: "Verificación 3D Secure",
    description: "Autenticación adicional para mayor protección"
  },
  {
    title: "Política de reembolso",
    description: "Garantía de devolución en caso de cancelación"
  }
];

export function PaymentSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-medium mb-4">
            <Shield className="w-4 h-4" />
            Pagos 100% Seguros
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Métodos de Pago
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Múltiples opciones de pago para tu comodidad y seguridad
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <method.icon className="w-8 h-8 text-primary group-hover:text-white" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <p className="text-muted-foreground">{method.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Features */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-primary font-medium mb-4">
                <Shield className="w-5 h-5" />
                Máxima Seguridad
              </div>
              <CardTitle className="text-2xl">Protegemos tu información</CardTitle>
              <p className="text-muted-foreground">
                Utilizamos las tecnologías más avanzadas para garantizar la seguridad de tus transacciones
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Logos */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Aceptamos los siguientes métodos de pago:</p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <span className="font-bold text-blue-500">PSE</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <span className="font-bold text-purple-600">Nequi</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <span className="font-bold text-yellow-600">Daviplata</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <span className="font-bold text-green-600">Efectivo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}