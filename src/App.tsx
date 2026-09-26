import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeFeed } from './components/HomeFeed';
import { WatchPage } from './components/WatchPage';
import { ChannelPage } from './components/ChannelPage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { ShortsPlayer } from './components/ShortsPlayer';
import { LibraryPage } from './components/LibraryPage';
import { ShareModal } from './components/ShareModal';
import { UploadModal } from './components/UploadModal';
import { ALL_VIDEOS, CHANNELS, SUBSCRIBED_CHANNELS, POPULAR_SHORTS } from './data/mockData';
import { Video, Channel, NavTab, ShortItem } from './types';
import { Check, Bookmark, Bell, Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [videos, setVideos] = useState<Video[]>(ALL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video>(ALL_VIDEOS[1]); // Neo Tokyo Walk
  const [selectedChannelId, setSelectedChannelId] = useState<string>('nexus-cyber');
  const [channels, setChannels] = useState<Record<string, Channel>>(CHANNELS);
  const [subscribedChannels, setSubscribedChannels] = useState(SUBSCRIBED_CHANNELS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shareVideo, setShareVideo] = useState<Video | null>(null);
  const [activeShort, setActiveShort] = useState<ShortItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setActiveTab('watch');
    // Mark as started in history
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, progress: v.progress ? v.progress : 15 } : v
      )
    );
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setActiveTab('channel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSubscribe = (channelId: string) => {
    setChannels((prev) => {
      const current = prev[channelId];
      if (!current) return prev;
      const isSub = !current.isSubscribed;
      showToast(isSub ? `Subscribed to ${current.name}` : `Unsubscribed from ${current.name}`);
      return {
        ...prev,
        [channelId]: {
          ...current,
          isSubscribed: isSub,
          subscriberCount: isSub ? current.subscriberCount + 1 : current.subscriberCount - 1,
        },
      };
    });
  };

  const handleSaveToPlaylist = (video: Video) => {
    showToast(`Saved "${video.title.slice(0, 32)}..." to your Favorites playlist`);
  };

  const handleUploadSuccess = (newVideo: Video) => {
    setVideos([newVideo, ...videos]);
    showToast('Video published successfully to your channel!');
    handleSelectVideo(newVideo);
  };

  const currentChannel = channels[selectedChannelId] || channels['nexus-cyber'];

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-sans selection:bg-[#ff5540]/30 selection:text-[#ffb4a8]">
      {/* Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onSelectChannel={handleSelectChannel}
      />

      {/* Main Body */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => {
            if (tab === 'shorts') {
              setActiveShort(POPULAR_SHORTS[0]);
            } else {
              setActiveTab(tab);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          subscribedChannels={subscribedChannels}
          onSelectChannel={handleSelectChannel}
        />

        {/* Content Container (Offset for lg fixed sidebar) */}
        <main className="flex-1 lg:pl-60 w-full min-w-0">
          {activeTab === 'home' && (
            <HomeFeed
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onSaveToPlaylist={handleSaveToPlaylist}
              onShareVideo={(v) => setShareVideo(v)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'watch' && selectedVideo && (
            <WatchPage
              video={selectedVideo}
              allVideos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onShare={(v) => setShareVideo(v)}
              onSaveToPlaylist={handleSaveToPlaylist}
            />
          )}

          {activeTab === 'channel' && (
            <ChannelPage
              channel={currentChannel}
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectShort={(s) => setActiveShort(s)}
              onToggleSubscribe={handleToggleSubscribe}
            />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsPage
              channels={subscribedChannels}
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onSaveToPlaylist={handleSaveToPlaylist}
              onShareVideo={(v) => setShareVideo(v)}
            />
          )}

          {(activeTab === 'library' || activeTab === 'history' || activeTab === 'liked-videos') && (
            <LibraryPage
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onClearHistory={() => {
                setVideos((prev) => prev.map((v) => ({ ...v, progress: undefined })));
                showToast('Watch history cleared');
              }}
            />
          )}

          {activeTab === 'explore' && (
            <HomeFeed
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onSaveToPlaylist={handleSaveToPlaylist}
              onShareVideo={(v) => setShareVideo(v)}
              searchQuery="Architecture"
            />
          )}
        </main>
      </div>

      {/* Shorts Modal */}
      {activeShort && (
        <ShortsPlayer
          initialShort={activeShort}
          onClose={() => setActiveShort(null)}
          onShare={(s) => {
            showToast(`Short link copied to clipboard!`);
          }}
        />
      )}

      {/* Share Modal */}
      {shareVideo && (
        <ShareModal
          video={shareVideo}
          onClose={() => setShareVideo(null)}
        />
      )}

      {/* Upload Video Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1b1b] text-[#e5e2e1] border border-[#353534] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#ff5540] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
