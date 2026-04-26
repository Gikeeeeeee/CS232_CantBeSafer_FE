// src/components/admin/AdminProfile.tsx
"use client";

import React from 'react';
import { User } from '@/types/auth'; 

interface AdminProfileProps {
  user: User | null;
}

export default function AdminProfile({ user }: AdminProfileProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-slate-200/50 bg-white/80 p-2 pr-5 shadow-lg backdrop-blur-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-500 shadow-inner">
          ?
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">Guest User</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Not Logged In
            </span>
          </div>
        </div>
      </div>
    );
  }

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200/50 bg-white/80 p-2 pr-5 shadow-lg backdrop-blur-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg font-bold text-white shadow-inner">
        {getInitial(user.name)}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800">{user.name}</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}