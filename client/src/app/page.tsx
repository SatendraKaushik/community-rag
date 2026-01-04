"use client"

import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  ArrowRight, Zap, MessageSquare, Database, Upload, Brain,
  Sparkles, CheckCircle2, Users, Clock, Shield, TrendingUp,
  FileText, Bot, Search, MessageCircle, Mail, Phone
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-800 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 font-medium text-sm mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-600"></span>
            </span>
            Next-Gen RAG Architecture
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            Turn Content into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Intelligent Conversations
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up [animation-delay:0.1s]">
            Experience VEDA, an intelligent AI assistant that transforms your content into
            smart, context-aware conversations. Test our technology instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.2s]">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-10 text-lg shadow-gray-500/25 shadow-xl bg-gray-800 hover:bg-gray-900 text-white">
                Try the Demo <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full text-lg hover:bg-gray-100 text-gray-700"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Why Choose VEDA?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: "Natural Chat", desc: "Fluid conversations powered by Gemini 1.5 Pro." },
              { icon: Database, title: "Instant RAG", desc: "Upload docs and chat with them in milliseconds." },
              { icon: Zap, title: "High Performance", desc: "Optimized vector search for lightning fast info retrieval." },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared with third parties." },
              { icon: Brain, title: "Context-Aware", desc: "Understands nuance and maintains conversation context." },
              { icon: Sparkles, title: "Always Learning", desc: "Continuously improving with the latest AI advancements." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-700">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Get started with VEDA in three simple steps. No technical knowledge required.
          </p>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload Your Content",
                desc: "Simply upload your documents, PDFs, or paste text. VEDA processes and indexes your content instantly."
              },
              {
                icon: Search,
                step: "02",
                title: "Ask Questions",
                desc: "Start chatting naturally. VEDA uses advanced RAG to find relevant information from your content."
              },
              {
                icon: Bot,
                step: "03",
                title: "Get Smart Answers",
                desc: "Receive accurate, context-aware responses powered by Gemini AI with source citations."
              }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex w-16 h-16 bg-gray-800 rounded-2xl items-center justify-center mb-6 text-white shadow-lg">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 text-sm">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Use Cases</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            VEDA adapts to your needs. Here's how teams are using our technology.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Document Q&A", desc: "Chat with your PDFs, reports, and manuals" },
              { icon: Users, title: "Customer Support", desc: "Automate responses with your knowledge base" },
              { icon: TrendingUp, title: "Research Assistant", desc: "Analyze and summarize large datasets" },
              { icon: Brain, title: "Knowledge Management", desc: "Centralize and query company information" }
            ].map((useCase, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-gray-700">
                  <useCase.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Clock, value: "<100ms", label: "Response Time" },
              { icon: CheckCircle2, value: "95%+", label: "Accuracy Rate" },
              { icon: Users, value: "1000+", label: "Active Users" },
              { icon: MessageSquare, value: "50K+", label: "Conversations" }
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="inline-flex w-12 h-12 bg-white/10 rounded-xl items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Try VEDA free with 20 messages. Experience the future of AI-powered conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full px-10 text-lg shadow-gray-500/25 shadow-xl bg-gray-800 hover:bg-gray-900 text-white">
                  Start Free Demo <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-lg border-2 border-gray-300 hover:bg-gray-50"
                onClick={() => window.location.href = 'mailto:satendrakaushik2002@gmail.com?subject=VEDA Inquiry'}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              No credit card required • 20 free messages • Instant setup
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="max-w-4xl mx-auto">
            {/* Brand Section */}
            <div className="text-center mb-12">
              <h3 className="text-white text-3xl font-bold mb-4">VEDA</h3>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Next-generation AI assistant powered by advanced RAG technology and Gemini AI.
              </p>
            </div>

            {/* Contact Section */}
            <div className="text-center mb-12">
              <h4 className="text-white text-lg font-semibold mb-6">Get in Touch</h4>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:satendrakaushik2002@gmail.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">satendrakaushik2002@gmail.com</span>
                </a>

                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-500">
              © 2026 VEDA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
