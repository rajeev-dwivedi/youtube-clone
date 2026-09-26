import React from 'react';
import { Home, Zap, Flame, Library, History, ThumbsUp, Compass, Radio } from 'lucide-react';
import { NavTab, SubscribedChannel } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  subscribedChannels: SubscribedChannel[];
  onSelectChannel: (channelId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  isOpen,
  onCloseMobile,
  subscribedChannels,
  onSelectChannel,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'shorts' as NavTab, label: 'Shorts', icon: Zap },
    { id: 'subscriptions' as NavTab, label: 'Subscriptions', icon: Radio },
  ];

  const libraryItems = [
    { id: 'library' as NavTab, label: 'Library', icon: Library },
    { id: 'history' as NavTab, label: 'History', icon: History },
    { id: 'liked-videos' as NavTab, label: 'Liked Videos', icon: ThumbsUp },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-60 bg-[#1c1b1b] border-r border-[#353534]/30 z-40 flex flex-col justify-between pt-4 pb-6 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 space-y-4 scrollbar-thin">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2a2a2a] text-[#e5e2e1] font-semibold shadow-xs'
                      : 'text-[#ebbbb4]/70 hover:bg-[#201f1f] hover:text-[#e5e2e1]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#ff5540]' : 'text-[#ebbbb4]/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <hr className="border-[#353534]/40 my-2" />

          {/* Library Section */}
          <nav className="flex flex-col gap-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2a2a2a] text-[#e5e2e1] font-semibold'
                      : 'text-[#ebbbb4]/70 hover:bg-[#201f1f] hover:text-[#e5e2e1]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#ff5540]' : 'text-[#ebbbb4]/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <hr className="border-[#353534]/40 my-2" />

          {/* Subscriptions List */}
          <div className="flex flex-col gap-1">
            <span className="px-4 text-[11px] font-semibold uppercase tracking-wider text-[#ebbbb4]/50">
              Subscriptions
            </span>
            <div className="mt-1 flex flex-col gap-0.5">
              {subscribedChannels.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChannel(c.id);
                    onCloseMobile();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#ebbbb4]/80 hover:bg-[#201f1f] hover:text-[#e5e2e1] transition-colors text-left group"
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    {c.isLive && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#ff5540] ring-1 ring-[#1c1b1b]" />
                    )}
                  </div>
                  <span className="truncate flex-1 font-medium">{c.name}</span>
                  {c.isLive && (
                    <span className="text-[10px] font-bold text-[#ff5540] px-1 py-0.2 bg-[#ff5540]/10 rounded">
                      LIVE
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 pt-3 border-t border-[#353534]/30 text-[11px] text-[#ebbbb4]/40 leading-relaxed">
          <p>© 2026 StreamTube</p>
          <p className="mt-0.5">Terms · Privacy · Policy & Safety</p>
        </div>
      </aside>
    </>
  );
};
