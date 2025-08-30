import { useState, useRef, useEffect } from "react";
import { Send, X, BarChart3, FileText, TrendingUp, Ship, Anchor } from "lucide-react";
import { LighthouseIcon } from "./lighthouse-icon";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Ahoy! I'm Captain Beacon, your Maritime AI Navigator. How can I help you navigate your fleet today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes("vessel") || lowerInput.includes("ship")) {
            return "I can see your fleet status. MV Aurora needs attention - her EEXI is trending up. Would you like me to suggest route optimizations?";
        }
        if (lowerInput.includes("emission") || lowerInput.includes("co2")) {
            return "Your fleet has reduced emissions by 12.4% this quarter! MV Vega is performing exceptionally well with an A-rating. Shall I generate a detailed emissions report?";
        }
        if (lowerInput.includes("compliance") || lowerInput.includes("cii")) {
            return "2 vessels are approaching CII thresholds. MV Aurora has 14 days before reaching the limit. I recommend immediate speed optimization. Would you like me to create an action plan?";
        }
        if (lowerInput.includes("route") || lowerInput.includes("optimize")) {
            return "Route optimization is available for 3 vessels. MV Orion can save 30% fuel by reducing speed 1.2 knots. Shall I implement these changes?";
        }
        if (lowerInput.includes("report") || lowerInput.includes("analytics")) {
            return "I can generate comprehensive reports on fleet performance, emissions, and compliance. What specific metrics would you like me to analyze?";
        }

        return "I'm here to help with fleet management, emissions tracking, compliance monitoring, and route optimization. What would you like to explore?";
    };

    const quickActions = [
        { icon: BarChart3, text: "Fleet Analytics", color: "bg-blue-500" },
        { icon: FileText, text: "Compliance Report", color: "bg-green-500" },
        { icon: TrendingUp, text: "Emissions Trends", color: "bg-orange-500" },
        { icon: Ship, text: "Vessel Status", color: "bg-purple-500" },
    ];

    return (
        <>
            {/* Lighthouse Trigger Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative h-16 w-16 bg-marine-gradient rounded-full shadow-lg hover:scale-110 transition-all duration-300 "
                >
                    {/* Lighthouse Structure */}
                    <LighthouseIcon />

                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-xs text-white font-bold">2</span>
                    </span>
                </button>
            </div>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[440px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl z-50 slide-up flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-marine-gradient p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="wave-pattern"></div>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Anchor className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Captain Beacon</h3>
                                        <p className="text-sm opacity-90">Maritime AI Navigator</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" color="#1f4d33" strokeWidth={5} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 overflow-scroll">
                        {messages.map((message, idx) => (
                            <div key={message.id}>
                                <div
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${
                                            message.sender === "user"
                                                ? "bg-marine-gradient text-white"
                                                : "bg-accent text-card-foreground"
                                        }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${
                                                message.sender === "user"
                                                    ? "text-white/70"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Action Cards after first bot message */}
                                {idx === 0 && message.sender === "bot" && (
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {quickActions.map((action, index) => (
                                                <div
                                                    key={index}
                                                    className={`${action.color} text-white bg-opacity-100 rounded-lg py-2 px-5 cursor-pointer hover:opacity-90 transition-all`}
                                                >
                                                    <div className="flex items-center space-x-2 whitespace-nowrap">
                                                        {action.icon && (
                                                            <action.icon className="h-5 w-5 text-white" />
                                                        )}
                                                        <span className="text-sm font-medium text-white">
                                                            {action.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-accent p-3 rounded-2xl">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form - Fixed at bottom */}
                    <div className="p-4 border-t border-border mt-auto">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                                placeholder="Ask about your fleet..."
                                className="flex-1 p-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="p-3 bg-marine-gradient text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
