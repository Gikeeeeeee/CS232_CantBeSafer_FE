"use client";

import React, { useEffect, useState } from 'react';
import BottomNav from '@/components/NavBar';
import { Settings, ChevronRight, LogOut, ShieldCheck, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

const ProfilePage = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 pb-24"></div>;
    }

    const handleSignOut = () => {
        logout();
        router.push('/auth/login');
    };

    const displayUser = user || {
        name: 'Guest User',
        dome_mail: 'No email',
        role: 'Visitor',
        created_at: new Date().toISOString()
    };

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${displayUser.name}&backgroundColor=10b981`;
    const joinedDate = displayUser.created_at 
        ? new Date(displayUser.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
        : 'Unknown Date';

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-gray-100">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 p-1">
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-gray-100 object-cover"
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-emerald-50 p-1.5 rounded-full border-2 border-white shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-gray-800">{displayUser.name}</h1>
                    <p className="text-gray-500 text-sm">{displayUser.dome_mail}</p>

                    <div className="mt-4 px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {displayUser.role === 'admin' ? 'Administrator' : 'Verified Reporter'}
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8 space-y-4 max-w-md mx-auto">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Settings</h2>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <Link href="/user/edit-profile" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="font-medium text-gray-700">Edit Profile</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link href="/user/notifications" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Mail className="w-5 h-5 text-purple-500" />
                            </div>
                            <span className="font-medium text-gray-700">Email Notifications</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link href="/user/security" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Settings className="w-5 h-5 text-orange-500" />
                            </div>
                            <span className="font-medium text-gray-700">Security & Privacy</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-6">
                    <button
                        className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 transition-colors"
                        onClick={handleSignOut}
                    >
                        <div className="p-2 bg-red-50 rounded-lg">
                            <LogOut className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="font-bold">Sign Out</span>
                    </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-8 italic">
                    Joined since {joinedDate}
                </p>
            </div>

            <BottomNav />
        </div>
    );
};

export default ProfilePage;