"use client"

import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gray-800 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-900 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
        </button>
    );
}
