"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from '@/components/chat/ChatWindow';
import { Button, Card } from '@/components/ui';
import { Bot, FileText, ArrowRight, Zap, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getApiUrl, API_CONFIG } from '@/config/api';

export default function Dashboard() {
    const [sessionId, setSessionId] = useState('');
    const [defaultBotId, setDefaultBotId] = useState('');
    const [defaultBotPromptStarters, setDefaultBotPromptStarters] = useState<string[]>([]);
    const [customBotId, setCustomBotId] = useState('');
    const [customBotPromptStarters, setCustomBotPromptStarters] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');
    const [customContent, setCustomContent] = useState('');
    const [isCreatingBot, setIsCreatingBot] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Initialize Session
    useEffect(() => {
        const initSession = async () => {
            let storedSession = localStorage.getItem('rag_session_id');
            try {
                const res = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.INIT), { sessionId: storedSession });
                console.log("Session Init:", res.data); // Debug
                setSessionId(res.data.sessionId);
                setDefaultBotId(res.data.defaultBotId);
                setDefaultBotPromptStarters(res.data.defaultBotPromptStarters || []);
                setMessageCount(res.data.messageCount);
                localStorage.setItem('rag_session_id', res.data.sessionId);
            } catch (err) {
                console.error("Init failed", err);
            }
        };
        initSession();
    }, []);

    const handleCreateBot = async () => {
        if (!customContent.trim()) return;
        setIsCreatingBot(true);
        try {
            const res = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CUSTOM_BOT), {
                sessionId,
                name: "My Custom Bot",
                content: customContent
            });
            setCustomBotId(res.data.botId);
            setCustomBotPromptStarters(res.data.promptStarters || []);
        } catch (err) {
            console.error("Create bot failed", err);
            alert("Failed to create bot. Please try again.");
        } finally {
            setIsCreatingBot(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

            {/* Mobile Backdrop */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50 md:z-20
                w-80 flex-shrink-0 bg-white border-r border-gray-200 
                flex flex-col shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/favicon.png"
                                alt="VEDA"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">VEDA</h1>
                        </div>
                        {/* Close button inside sidebar on mobile */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-3 md:mt-4 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-xs font-medium text-gray-700 inline-block">
                        {messageCount}/20 Messages Used
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Assistants</div>

                    <button
                        onClick={() => {
                            setActiveTab('default');
                            setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'default'
                            ? 'bg-gray-800 text-white shadow-lg shadow-gray-500/30'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        <Bot className={`w-5 h-5 ${activeTab === 'default' ? 'text-white' : 'text-gray-500'}`} />
                        <div className="text-left">
                            <div className="font-medium text-sm">Veda</div>
                            <div className={`text-[10px] ${activeTab === 'default' ? 'text-gray-200' : 'text-gray-400'}`}>Official Community Bot</div>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('custom');
                            setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'custom'
                            ? 'bg-gray-800 text-white shadow-lg shadow-gray-500/30'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        <FileText className={`w-5 h-5 ${activeTab === 'custom' ? 'text-white' : 'text-gray-500'}`} />
                        <div className="text-left">
                            <div className="font-medium text-sm">Custom Assistant</div>
                            <div className={`text-[10px] ${activeTab === 'custom' ? 'text-gray-200' : 'text-gray-400'}`}>Train on your data</div>
                        </div>
                    </button>
                </nav>


            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-white/50">
                {/* Custom Bot Creation Section */}
                {activeTab === 'custom' && !customBotId && (
                    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
                        {/* Mobile Navigation Bar */}
                        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/favicon.png"
                                    alt="VEDA"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                />
                                <h3 className="font-bold text-lg tracking-tight text-gray-900">VEDA</h3>
                            </div>
                            {/* Hamburger menu button */}
                            {!isMobileSidebarOpen && (
                                <button
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                            <div className="w-full max-w-2xl">
                                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg">
                                    <FileText className="w-9 h-9" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-900">Create Your Custom Bot</h2>
                                <p className="text-center text-gray-600 mb-6 md:mb-8 text-base md:text-lg px-4">
                                    Paste your content below. We'll use RAG to create a specialized assistant instantly.
                                </p>

                                <textarea
                                    className="w-full h-48 md:h-64 p-4 md:p-5 rounded-2xl border-2 border-gray-300 text-sm md:text-base focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none mb-4 md:mb-6 bg-white resize-none shadow-sm transition-all"
                                    placeholder="Paste your company details, resume, or project info here..."
                                    value={customContent}
                                    onChange={(e) => setCustomContent(e.target.value)}
                                />
                                <Button
                                    onClick={handleCreateBot}
                                    disabled={isCreatingBot || !customContent}
                                    className="w-full h-12 md:h-14 text-base md:text-lg bg-gray-800 hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isCreatingBot ? 'Training AI Model...' : 'Build Assistant'} <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col">
                    {activeTab === 'default' && defaultBotId && (
                        <ChatWindow
                            key="default"
                            botId={defaultBotId}
                            sessionId={sessionId}
                            title="Veda"
                            promptStarters={defaultBotPromptStarters}
                            onMenuClick={() => setIsMobileSidebarOpen(true)}
                            isSidebarOpen={isMobileSidebarOpen}
                        />
                    )}

                    {activeTab === 'custom' && customBotId && (
                        <div className="h-full w-full relative">
                            <ChatWindow
                                key="custom"
                                botId={customBotId}
                                sessionId={sessionId}
                                title="Custom Assistant"
                                promptStarters={customBotPromptStarters}
                                onMenuClick={() => setIsMobileSidebarOpen(true)}
                                isSidebarOpen={isMobileSidebarOpen}
                            />
                            <button
                                onClick={() => setCustomBotId('')}
                                className="absolute top-2 right-2 md:top-4 md:right-4 text-xs md:text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow-sm border border-blue-100"
                            >
                                <Zap className="w-3 h-3" /> New Bot
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
