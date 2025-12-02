
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { MessageCircleQuestion, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { askAboutTheEagles } from '@/ai/flows/ask-about-the-eagles';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuthUser } from '@/firebase';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuthUser();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: "Hello! I'm the TFOE-PE assistant. How can I help you learn about The Fraternal Order of Eagles?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelResponse: ChatMessage = { role: 'model', content: '' };
    setMessages((prev) => [...prev, modelResponse]);
    
    try {
        const { stream, response } = await askAboutTheEagles(input);
        for await (const chunk of stream) {
             setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length-1];
                if(lastMessage.role === 'model') {
                    lastMessage.content += chunk;
                }
                return newMessages;
            });
        }
        await response;

    } catch (error) {
      console.error('Chatbot error:', error);
       setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length-1];
            if(lastMessage.role === 'model') {
                lastMessage.content = "Sorry, I'm having trouble connecting right now. Please try again later.";
            }
            return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  };
  
  const userInitial = profile?.firstName?.charAt(0) || 'U';

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <MessageCircleQuestion />}
          <span className="sr-only">Toggle AI Chatbot</span>
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-full max-w-sm shadow-2xl flex flex-col h-[60vh]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Avatar className="bg-primary text-primary-foreground">
                <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-medium">TFOE-PE Assistant</CardTitle>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                 <div className="space-y-4">
                    {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                        'flex items-start gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.role === 'model' && (
                        <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                            <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'p-3 rounded-lg max-w-xs',
                            message.role === 'user'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted'
                        )}
                        >
                        <p className="text-sm">{message.content}</p>
                        </div>
                         {message.role === 'user' && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start items-center gap-3">
                             <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                            <div className="p-3 bg-muted rounded-lg">
                                <Loader2 className="h-5 w-5 animate-spin"/>
                            </div>
                        </div>
                    )}
                 </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
