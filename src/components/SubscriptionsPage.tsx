import React, { useState } from 'react';
import { ChevronRight, SlidersHorizontal, MoreVertical, Radio, Clock, Bookmark, Share2 } from 'lucide-react';
import { SubscribedChannel, Video } from '../types';

interface SubscriptionsPageProps {
  channels: SubscribedChannel[];
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onSaveToPlaylist?: (video: Video) => void;
  onShareVideo?: (video: Video) => void;
}

export const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({
  channels,
  videos,
  onSelectVideo,
  onSelectChannel,
  onSaveToPlaylist,
  onShareVideo,
}) => {
  const [filter, setFilter] = useState<'All' | 'Today' | 'Continue watching' | 'Unwatched' | 'Live'>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Group videos into Today and Yesterday
  const todayVideos = videos.filter((v) => {
    if (filter === 'Live') return v.isLive;
    if (filter === 'Continue watching') return (v.progress || 0) > 0;
    if (filter === 'Unwatched') return !v.progress;
    return v.timeGroup === 'today';
  });

  const yesterdayVideos = videos.filter((v) => {
    if (filter === 'Today' || filter === 'Live') return false;
    if (filter === 'Continue watching') return (v.progress || 0) > 0 && v.timeGroup !== 'today';
    if (filter === 'Unwatched') return !v.progress && v.timeGroup !== 'today';
    return v.timeGroup === 'yesterday' || v.timeGroup === 'older';
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-8 max-w-[1920px] mx-auto pb-24 gap-8">
      {/* 1. Subscribed Channels Row */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#e5e2e1]">Subscribed Channels</h2>
          <button
            onClick={() => alert('Manage all 18 subscribed channels')}
            className="text-xs font-semibold text-[#ff5540] hover:underline flex items-center gap-1"
          >
            <span>Manage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto pb-2 no-scrollbar">
          {channels.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectChannel(c.id)}
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
            >
              <div
                className={`relative w-16 h-16 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                  c.isLive
                    ? 'bg-gradient-to-tr from-[#ff5540] to-[#2295ed]'
                    : 'bg-[#353534]'
                }`}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-full h-full object-cover rounded-full"
                />
                {c.isLive && (
                  <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-[#ff5540] text-white text-[9px] font-bold rounded-full ring-2 ring-[#131313]">
                    LIVE
                  </span>
                )}
                {c.hasNewVideos && !c.isLive && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#ff5540] ring-2 ring-[#131313]" />
                )}
              </div>
              <span className="text-xs font-medium text-[#e5e2e1] truncate w-20 text-center group-hover:text-[#ff5540] transition-colors">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Quick Filters & Action */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[#353534]/30 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {(['All', 'Today', 'Continue watching', 'Unwatched', 'Live'] as const).map((opt) => {
            const isActive = filter === opt;
            return (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#e5e2e1] text-[#131313] shadow-xs'
                    : 'bg-[#201f1f] text-[#ebbbb4]/80 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]'
                }`}
              >
                {opt === 'Live' && (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#ff5540] mr-1.5 animate-pulse" />
                )}
                {opt}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => alert('Sorting by latest published date')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-xs font-semibold text-[#e5e2e1] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5540]" />
          <span>Latest first</span>
        </button>
      </section>

      {/* 3. Feed Section: Today */}
      {todayVideos.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5540]" />
              <h3 className="text-base font-bold text-[#e5e2e1]">Today</h3>
            </div>
            <span className="text-xs text-[#ebbbb4]/60">{todayVideos.length} new uploads</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {todayVideos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col gap-2.5 group cursor-pointer relative"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectVideo(video)}
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-xs font-semibold text-white">
                    {video.duration}
                  </div>

                  {video.badge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#ff5540] text-white text-[11px] font-bold shadow-md">
                      {video.badge}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {video.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#353534]">
                      <div
                        className="h-full bg-[#ff5540]"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex gap-3">
                  <div
                    onClick={() => onSelectChannel(video.channel.id)}
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 ring-1 ring-[#353534] hover:ring-[#ff5540] transition-all"
                  >
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <h4
                      onClick={() => onSelectVideo(video)}
                      className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors"
                    >
                      {video.title}
                    </h4>

                    <p
                      onClick={() => onSelectChannel(video.channel.id)}
                      className="text-xs text-[#ebbbb4]/70 hover:text-[#e5e2e1] mt-0.5 truncate"
                    >
                      {video.channel.name}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#ebbbb4]/60">
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === video.id ? null : video.id)}
                      className="p-1 text-[#ebbbb4]/60 hover:text-[#e5e2e1] rounded-full"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === video.id && (
                      <div className="absolute right-0 top-6 w-44 bg-[#1c1b1b] border border-[#353534] rounded-xl shadow-xl p-1 z-30">
                        <button
                          onClick={() => {
                            if (onSaveToPlaylist) onSaveToPlaylist(video);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-lg"
                        >
                          Save to Playlist
                        </button>
                        <button
                          onClick={() => {
                            if (onShareVideo) onShareVideo(video);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-lg"
                        >
                          Share Video
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Feed Section: Yesterday / Previous */}
      {yesterdayVideos.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ebbbb4]/60" />
              <h3 className="text-base font-bold text-[#e5e2e1]">Yesterday</h3>
            </div>
            <span className="text-xs text-[#ebbbb4]/60">{yesterdayVideos.length} videos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {yesterdayVideos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col gap-2.5 group cursor-pointer relative"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectVideo(video)}
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-xs font-semibold text-white">
                    {video.duration}
                  </div>

                  {/* Progress Bar */}
                  {video.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#353534]">
                      <div
                        className="h-full bg-[#ff5540]"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex gap-3">
                  <div
                    onClick={() => onSelectChannel(video.channel.id)}
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 ring-1 ring-[#353534] hover:ring-[#ff5540] transition-all"
                  >
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <h4
                      onClick={() => onSelectVideo(video)}
                      className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors"
                    >
                      {video.title}
                    </h4>

                    <p
                      onClick={() => onSelectChannel(video.channel.id)}
                      className="text-xs text-[#ebbbb4]/70 hover:text-[#e5e2e1] mt-0.5 truncate"
                    >
                      {video.channel.name}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#ebbbb4]/60">
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
