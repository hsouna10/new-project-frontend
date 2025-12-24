import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { useState } from "react";

export default function PatientChatbot() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Bonjour ! Je suis votre assistant médical virtuel. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages([...messages, { role: 'user', content: input }]);
        const userQuestion = input;
        setInput('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: `Je comprends que vous posez une question sur "${userQuestion}". En tant qu'IA, je ne peux pas donner d'avis médical, mais je peux vous aider à trouver le bon spécialiste. Souhaitez-vous voir la liste des médecins disponibles ?`
            }]);
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-6 w-6 text-medical-teal" />
                            Assistant Santé IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                                                <Bot className="h-5 w-5 text-medical-teal" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted rounded-tl-none'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                <User className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex w-full gap-2">
                            <Input
                                placeholder="Posez votre question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button onClick={handleSend} size="icon" className="bg-medical-teal hover:bg-medical-teal/90">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
}
