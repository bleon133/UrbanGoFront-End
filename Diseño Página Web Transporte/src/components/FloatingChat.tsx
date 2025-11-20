import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const mockMessages = [
  {
    id: 1,
    sender: "bot",
    message: "¡Hola! 👋 Soy el asistente virtual de MoviLab. ¿En qué puedo ayudarte hoy?",
    timestamp: new Date()
  }
];

const quickResponses = [
  "Ver precios",
  "Horarios de atención",
  "Cómo reservar",
  "Ubicaciones"
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: "bot" as const,
        message: "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto. ¿Hay algo más en lo que pueda ayudarte?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notification Dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-primary text-white p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5" />
                  Soporte MoviLab
                </CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  Estamos aquí para ayudarte 24/7
                </p>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                          message.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-muted"
                        }`}
                      >
                        {message.message}
                      </div>

                      {message.sender === "user" && (
                        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-secondary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Responses */}
                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickResponses.map((response) => (
                      <Button
                        key={response}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickResponse(response)}
                        className="text-xs"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 pt-0 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}