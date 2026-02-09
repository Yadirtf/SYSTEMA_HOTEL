'use client';

import { User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { SessionUser } from '@/presentation/types/SessionUser';

interface UserProfileProps {
  user: SessionUser | null;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden md:block">
        <p className="text-sm font-bold text-slate-900 leading-none mb-1">
          {user.email?.split('@')[0]}
        </p>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-extrabold">
          {user.role}
        </p>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 rounded-xl flex items-center justify-center shadow-inner cursor-pointer"
      >
        <UserIcon className="h-5 w-5 text-slate-600" />
      </motion.div>
    </div>
  );
};

