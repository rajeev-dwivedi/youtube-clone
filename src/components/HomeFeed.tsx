import React, { useState } from 'react';
import { Play, Bookmark, MoreVertical, Flame, Clock, Share2, Check, Radio } from 'lucide-react';
import { Video } from '../types';
import { CATEGORIES } from '../data/mockData';

interface HomeFeedProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onSaveToPlaylist?: (video: Video) => void;
  onShareVideo?: (video: Video) => void;
  searchQuery: string;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  videos,
  onSelectVideo,
  onSelectChannel,
  onSaveToPlaylist,
  onShareVideo,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter videos based on category and search query
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Live') return video.isLive === true;
    if (selectedCategory === 'Recently Watched') return (video.progress || 0) > 0;
    return video.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const featuredVideo = videos[0];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Category Filter Chips Bar */}
      <div className="sticky top-16 z-30 bg-[#131313]/95 backdrop-blur-md px-4 md:px-8 py-3 flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-[#353534]/20">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-[#e5e2e1] text-[#131313] font-semibold shadow-xs scale-102'
                  : 'bg-[#201f1f] text-[#e5e2e1] hover:bg-[#2a2a2a]'
              }`}
            >
              {cat === 'Live' && (
                <span className="inline-block w-2 h-2 rounded-full bg-[#ff5540] mr-1.5 animate-pulse" />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      <div className="px-4 md:px-8 py-6 max-w-[1920px] mx-auto w-full">
        {/* Featured Hero Premiere Spotlight (Shown when no search query or in All category) */}
        {!searchQuery && selectedCategory === 'All' && featuredVideo && (
          <div className="mb-10 relative rounded-2xl overflow-hidden bg-[#1c1b1b] border border-[#353534]/40 p-5 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff5540]/10 via-transparent to-[#9ccaff]/10 pointer-events-none" />

            {/* Video preview container with play button */}
            <div
              onClick={() => onSelectVideo(featuredVideo)}
              className="w-full md:w-7/12 aspect-video rounded-xl overflow-hidden relative cursor-pointer shadow-xl bg-black"
            >
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#ff5540] text-white flex items-center justify-center shadow-2xl transform scale-95 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-white">
                {featuredVideo.duration}
              </div>
              <div className="absolute top-3 left-3 bg-[#ff5540] text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                FEATURED PREMIERE
              </div>
            </div>

            {/* Video details */}
            <div className="w-full md:w-5/12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-xs text-[#ebbbb4]/80">
                <span className="text-[#ff5540] font-semibold uppercase tracking-wider">
                  Featured Premiere
                </span>
                <span>•</span>
                <span>{featuredVideo.timestamp}</span>
              </div>

              <h1
                onClick={() => onSelectVideo(featuredVideo)}
                className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e5e2e1] leading-tight mb-3 hover:text-[#ff5540] transition-colors cursor-pointer line-clamp-2"
              >
                {featuredVideo.title}
              </h1>

              <p className="text-sm text-[#ebbbb4]/70 mb-5 line-clamp-3 leading-relaxed">
                {featuredVideo.description}
              </p>

              <div
                onClick={() => onSelectChannel(featuredVideo.channel.id)}
                className="flex items-center gap-3 mb-6 cursor-pointer group/channel"
              >
                <img
                  src={featuredVideo.channel.avatar}
                  alt={featuredVideo.channel.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#353534]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#e5e2e1] group-hover/channel:text-[#ff5540] transition-colors">
                    {featuredVideo.channel.name}
                  </h4>
                  <span className="text-xs text-[#ebbbb4]/60">
                    {featuredVideo.views} • {featuredVideo.likes} likes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectVideo(featuredVideo)}
                  className="px-6 py-2.5 rounded-full bg-[#ff5540] text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[#ff5540]/20"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Now
                </button>
                <button
                  onClick={() => onSaveToPlaylist && onSaveToPlaylist(featuredVideo)}
                  className="px-5 py-2.5 rounded-full bg-[#2a2a2a] text-[#e5e2e1] font-medium text-sm hover:bg-[#353534] transition-colors flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" /> Save to Playlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#ff5540] rounded-full" />
            {searchQuery
              ? `Results for "${searchQuery}" (${filteredVideos.length})`
              : selectedCategory === 'All'
              ? 'Recommended Videos'
              : `${selectedCategory} Videos`}
          </h2>
          <span className="text-xs text-[#ebbbb4]/60 font-medium">
            {filteredVideos.length} videos available
          </span>
        </div>

        {/* Responsive Grid */}
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-[#e5e2e1] mb-2">No videos found</p>
            <p className="text-sm text-[#ebbbb4]/60 max-w-md">
              Try searching for different keywords or select a different category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-5 gap-y-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col group cursor-pointer relative"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => onSelectVideo(video)}
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] mb-3 shadow-md border border-[#353534]/30"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-xs font-semibold text-white">
                    {video.duration}
                  </div>

                  {/* Badges: 4K 60FPS or LIVE */}
                  {video.badge && (
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-bold tracking-tight shadow-sm flex items-center gap-1 ${
                        video.isLive
                          ? 'bg-[#ff5540] text-white animate-pulse'
                          : 'bg-black/80 text-[#ff5540] border border-[#ff5540]/30'
                      }`}
                    >
                      {video.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      {video.badge}
                    </div>
                  )}

                  {/* Progress Bar (if partially watched) */}
                  {video.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#353534]">
                      <div
                        className="h-full bg-[#ff5540]"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Metadata Row */}
                <div className="flex gap-3">
                  {/* Channel Avatar */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChannel(video.channel.id);
                    }}
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 ring-1 ring-[#353534] hover:ring-[#ff5540] transition-all"
                  >
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3
                      onClick={() => onSelectVideo(video)}
                      className="text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors"
                      title={video.title}
                    >
                      {video.title}
                    </h3>

                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChannel(video.channel.id);
                      }}
                      className="text-xs text-[#ebbbb4]/70 hover:text-[#e5e2e1] mt-1 truncate"
                    >
                      {video.channel.name}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#ebbbb4]/60">
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>

                  {/* 3-dots Menu Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === video.id ? null : video.id);
                      }}
                      aria-label="More options"
                      className="p-1 text-[#ebbbb4]/60 hover:text-[#e5e2e1] rounded-full hover:bg-[#201f1f] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === video.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-8 w-48 bg-[#1c1b1b] border border-[#353534] rounded-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={() => {
                            if (onSaveToPlaylist) onSaveToPlaylist(video);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-lg transition-colors text-left"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#ff5540]" />
                          <span>Save to Playlist</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onShareVideo) onShareVideo(video);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-lg transition-colors text-left"
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#9ccaff]" />
                          <span>Share Video</span>
                        </button>
                        <button
                          onClick={() => {
                            alert(`"${video.title}" added to Watch Later queue`);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-lg transition-colors text-left"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#e5e2e1]" />
                          <span>Save to Watch Later</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
