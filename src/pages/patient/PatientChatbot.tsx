import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PatientChatbot() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Bonjour ! Je suis votre assistant médical virtuel. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // Using full URL assuming backend is on 5000. 
            // In production this should be an env var.
            const response = await fetch('https://new-project-backend-3v94.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur serveur');
            }

            setMessages(prev => [...prev, {
                role: 'bot',
                content: data.reply
            }]);

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "Désolé, je rencontre des difficultés pour répondre pour le moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
                <Card className="flex-1 flex flex-col shadow-2xl border-white/10 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/10 bg-white/5">
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Bot className="h-6 w-6" />
                            Assistant Santé IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden bg-dot-pattern">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                                <Bot className="h-5 w-5 text-primary" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-muted/50 border border-white/10 rounded-tl-none text-foreground'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                <User className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <Bot className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="bg-muted/50 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-xs text-muted-foreground">En train d'écrire...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t border-white/10 bg-white/5">
                        <div className="flex w-full gap-2">
                            <Input
                                placeholder="Posez votre question médicale..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                                className="bg-background/50 border-white/10 focus-visible:ring-primary"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="bg-primary hover:bg-primary/90 transition-colors text-primary-foreground"
                                disabled={isLoading}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
}
