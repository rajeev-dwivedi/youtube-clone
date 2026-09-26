import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Video, Bell, Menu, X, Check, Share2, Settings, User, LogOut, Moon } from 'lucide-react';
import { CURRENT_USER, NOTIFICATIONS } from '../data/mockData';
import { NavTab } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenUpload: () => void;
  onSelectChannel: (channelId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  activeTab,
  onNavigate,
  onOpenUpload,
  onSelectChannel,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    // Simulate quick voice query
    setTimeout(() => {
      onSearchChange('Spatial Computing & WebGL');
      setIsVoiceListening(false);
    }, 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#131313]/90 backdrop-blur-xl border-b border-[#353534]/30 z-40 flex items-center justify-between px-4 md:px-6">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="p-2 text-[#e5e2e1] hover:bg-[#201f1f] rounded-full transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Custom StreamTube / Play Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff5540] to-[#c00100] flex items-center justify-center shadow-lg shadow-[#ff5540]/20 group-hover:scale-105 transition-transform">
            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-0.5" />
          </div>
          <div className="flex items-center gap-1 font-bold text-lg md:text-xl tracking-tight text-[#e5e2e1]">
            <span>Stream</span>
            <span className="text-[#ff5540]">Tube</span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar & Mic */}
      <div className="flex-1 max-w-2xl mx-4 hidden sm:flex items-center gap-3">
        <div className="flex-1 flex items-center bg-[#1c1b1b] rounded-full border border-[#353534]/60 overflow-hidden px-4 py-1.5 focus-within:border-[#ff5540] focus-within:ring-1 focus-within:ring-[#ff5540] transition-all">
          <input
            type="text"
            placeholder="Search videos, creators, topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-[#e5e2e1] text-sm placeholder-[#ebbbb4]/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#ebbbb4]/60 hover:text-[#e5e2e1] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button className="pl-3 pr-1 text-[#ebbbb4]/70 hover:text-[#e5e2e1]">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleVoiceSearch}
          title="Search with voice"
          className={`p-2.5 rounded-full border border-[#353534]/40 transition-all ${
            isVoiceListening
              ? 'bg-[#ff5540] text-white animate-pulse'
              : 'bg-[#1c1b1b] text-[#e5e2e1] hover:bg-[#2a2a2a]'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={() => {
            const query = prompt('Enter search keywords:');
            if (query !== null) onSearchChange(query);
          }}
          className="sm:hidden p-2 text-[#e5e2e1] hover:bg-[#201f1f] rounded-full"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Create / Upload Video Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] text-xs font-semibold border border-[#353534]/50 transition-colors shadow-sm"
        >
          <Video className="w-4 h-4 text-[#ff5540]" />
          <span className="hidden md:inline">Create</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="p-2 hover:bg-[#201f1f] rounded-full text-[#e5e2e1] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5540] animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5540]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1c1b1b] border border-[#353534] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#353534]/40">
                <h3 className="font-semibold text-sm text-[#e5e2e1]">Notifications</h3>
                <span className="text-xs text-[#ff5540] font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-3 max-h-80 overflow-y-auto pr-1">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('watch');
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-[#2a2a2a] transition-colors ${
                      n.unread ? 'bg-[#201f1f]' : ''
                    }`}
                  >
                    <img
                      src={n.avatar}
                      alt={n.channel}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#e5e2e1] line-clamp-2 leading-snug">
                        {n.title}
                      </p>
                      <span className="text-[11px] text-[#ebbbb4]/60 mt-1 block">
                        {n.timestamp}
                      </span>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-[#ff5540] mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[#ff5540] transition-all ml-1"
          >
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-full h-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1c1b1b] border border-[#353534] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 p-2 border-b border-[#353534]/40 pb-3">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#e5e2e1] truncate">{CURRENT_USER.name}</p>
                  <p className="text-xs text-[#ebbbb4]/60 truncate">{CURRENT_USER.handle}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSelectChannel('nexus-cyber');
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#ff5540]" />
                  <span>Your Channel (Nexus Cybernetics)</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('library');
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-xl transition-colors text-left"
                >
                  <Share2 className="w-4 h-4 text-[#9ccaff]" />
                  <span>Your Library & Downloads</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('liked-videos');
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-xl transition-colors text-left"
                >
                  <Check className="w-4 h-4 text-[#2295ed]" />
                  <span>Liked Videos</span>
                </button>

                <hr className="border-[#353534]/40 my-1" />

                <div className="px-3 py-1.5 flex items-center justify-between text-xs text-[#ebbbb4]/70">
                  <span>Theme</span>
                  <span className="flex items-center gap-1 text-[#ff5540] font-medium">
                    <Moon className="w-3.5 h-3.5" /> Dark Tonal
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
