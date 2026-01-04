"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Card, Modal } from '@/components/ui';
import { Send, Bot, User, MessageSquareDot, Mail, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getApiUrl, API_CONFIG } from '@/config/api';

interface Message {
    role: 'user' | 'model';
    content: string;
}

interface ChatWindowProps {
    botId: string;
    sessionId: string;
    title?: string;
    promptStarters?: string[];
    onMenuClick?: () => void;
    isSidebarOpen?: boolean;
}

export default function ChatWindow({ botId, sessionId, title, promptStarters = [], onMenuClick, isSidebarOpen = false }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendWithText = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg = text;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
                sessionId,
                botId,
                message: userMsg,
                history: [] // Simplified history for prompt starters
            });

            if (res.data.response) {
                setMessages(prev => [...prev, { role: 'model', content: res.data.response }]);
            }
        } catch (error: any) {
            console.error(error);

            // Check if limit is reached
            if (error.response?.data?.isLimitReached) {
                setShowLimitModal(true);
            } else {
                const errMsg = error.response?.data?.error || "Error connecting to bot.";
                setMessages(prev => [...prev, { role: 'model', content: `⚠️ ${errMsg}` }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => handleSendWithText(input);


    const cleanText = (text: string) => {
        return text.replace(/\*\*/g, '').replace(/\*/g, '');
    };

    return (
        <Card className="flex flex-col h-full w-full overflow-hidden border-gray-200 shadow-2xl">
            {/* Navigation Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    {/* Logo instead of text */}
                    <Image
                        src="/favicon.png"
                        alt="VEDA"
                        width={32}
                        height={32}
                        className="w-8 h-8 md:w-9 md:h-9 object-contain"
                    />
                    <h3 className="font-bold text-lg md:text-xl tracking-tight text-gray-900">VEDA</h3>
                </div>
                {/* Hamburger menu button - only on mobile when sidebar is closed */}
                {onMenuClick && !isSidebarOpen && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
            </div>

            {messages.length === 0 ? (
                /* Empty State - Centered Input */
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
                    <div className="w-full max-w-2xl">
                        {/* Input Form */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2 mb-3 md:mb-4"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 border-gray-300 focus:border-gray-600 h-11 md:h-12 text-sm md:text-base"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-11 h-11 md:w-12 md:h-12 p-0 rounded-xl"
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </form>

                        {/* Prompt Starters */}
                        {promptStarters.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {promptStarters.map((starter, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendWithText(starter)}
                                        className="text-xs md:text-sm px-3 md:px-4 py-2 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 hover:border-gray-400 transition-colors text-gray-700 min-h-[44px] flex items-center"
                                    >
                                        {starter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Chat Active - Normal Layout */
                <>
                    {/* Messages */}
                    <div
                        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            touchAction: 'pan-y',
                            overscrollBehavior: 'contain'
                        }}
                    >
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[80%] p-2.5 md:p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-gray-800 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                                        }`}>
                                        <p className="text-xs md:text-sm leading-relaxed">{cleanText(msg.content)}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white p-2.5 md:p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input - Bottom Fixed */}
                    <div className="p-3 md:p-4 bg-white border-t border-gray-200">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 border-gray-300 focus:border-gray-600 text-sm md:text-base h-11"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-11 h-11 p-0 rounded-xl"
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </form>
                    </div>
                </>
            )}

            {/* Limit Reached Modal */}
            <Modal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                title="Testing Limit Reached"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Your testing limit has been reached. Please contact the VEDA team to continue using our services.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => {
                                window.location.href = 'mailto:satendrakaushik2002@gmail.com?subject=VEDA Testing Limit Reached';
                            }}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Contact via Email
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setShowLimitModal(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
}
