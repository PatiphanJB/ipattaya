'use client';

import { useState } from 'react';
import { Bookmark, MapPin, Star, Clock, LogIn, Mail, Lock, User, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const mockSaved = [
  { id: '1', name: 'Mum Aroi', category: 'Restaurant', rating: 4.6, location: 'Naklua', savedDate: '2 days ago' },
  { id: '2', name: 'Hilton Pattaya', category: 'Hotel', rating: 4.6, location: 'Central', savedDate: '5 days ago' },
  { id: '3', name: 'Sanctuary of Truth', category: 'Attraction', rating: 4.7, location: 'Naklua', savedDate: '1 week ago' },
  { id: '4', name: 'Koh Larn', category: 'Beach', rating: 4.5, location: 'Offshore', savedDate: '1 week ago' },
  { id: '5', name: 'Terminal 21', category: 'Shopping', rating: 4.6, location: 'North Pattaya', savedDate: '2 weeks ago' },
];

export function SavedPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bookmark size={32} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-text">Saved Places</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to save and sync your favorites across devices</p>
        </div>

        {showLogin ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
              Sign In
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-bg px-3 text-xs text-text-muted">or</span></div>
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-3 rounded-xl bg-bg-card border border-border text-sm font-medium text-text hover:bg-bg-elevated transition-colors flex items-center justify-center gap-2">
              <Globe size={16} className="text-primary" />
              Continue with Google
            </button>
            <p className="text-center text-xs text-text-muted">
              Don&apos;t have an account? <button className="text-primary font-medium">Sign up</button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={() => setShowLogin(true)} className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <LogIn size={16} />
              Sign In
            </button>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-3 rounded-xl bg-bg-card border border-border text-sm font-medium text-text hover:bg-bg-elevated transition-colors flex items-center justify-center gap-2">
              <Globe size={16} className="text-primary" />
              Continue with Google
            </button>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-3 rounded-xl bg-bg-card border border-border text-sm font-medium text-text-muted text-center text-xs hover:bg-bg-elevated transition-colors">
              Browse as Guest
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-text">Saved Places</h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {mockSaved.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bookmark size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-text">{item.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-primary font-medium">{item.category}</span>
                <div className="flex items-center gap-0.5">
                  <Star size={9} className="text-accent fill-accent" />
                  <span className="text-[10px] text-accent">{item.rating}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MapPin size={9} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted">{item.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={9} className="text-text-muted" />
                <span className="text-[10px] text-text-muted">Saved {item.savedDate}</span>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-danger/10 transition-colors">
              <Bookmark size={16} className="text-primary fill-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
