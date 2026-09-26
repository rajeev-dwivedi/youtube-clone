import React from 'react';
import { History, ThumbsUp, Clock, Bookmark, Play, Trash2, FolderPlus } from 'lucide-react';
import { Video } from '../types';

interface LibraryPageProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onClearHistory: () => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  videos,
  onSelectVideo,
  onClearHistory,
}) => {
  const historyVideos = videos.filter((v) => (v.progress || 0) > 0);
  const likedVideos = videos.filter((v) => v.isLiked || v.rawLikes > 10000);

  return (
    <div className="flex flex-col w-full p-4 md:p-8 max-w-[1920px] mx-auto pb-24 gap-10">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-[#353534]/30 pb-4">
        <h1 className="text-2xl font-bold text-[#e5e2e1] flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-[#ff5540]" />
          <span>Your Library</span>
        </h1>
      </div>

      {/* History Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
            <History className="w-5 h-5 text-[#ff5540]" />
            <span>History</span>
          </h2>
          {historyVideos.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-[#ebbbb4]/70 hover:text-[#ff5540] flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear watch history</span>
            </button>
          )}
        </div>

        {historyVideos.length === 0 ? (
          <p className="text-xs text-[#ebbbb4]/60 py-4">No recent watch history found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {historyVideos.slice(0, 4).map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectVideo(v)}
                className="flex flex-col gap-2 group cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                    {v.duration}
                  </div>
                  {v.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#353534]">
                      <div className="h-full bg-[#ff5540]" style={{ width: `${v.progress}%` }} />
                    </div>
                  )}
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors">
                  {v.title}
                </h4>
                <span className="text-[11px] text-[#ebbbb4]/60">
                  {v.channel.name} • {v.views}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Liked Videos Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-[#9ccaff]" />
            <span>Liked Videos</span>
          </h2>
          <span className="text-xs text-[#ebbbb4]/60">{likedVideos.length} videos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {likedVideos.slice(0, 4).map((v) => (
            <div
              key={v.id}
              onClick={() => onSelectVideo(v)}
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                  {v.duration}
                </div>
              </div>
              <h4 className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors">
                {v.title}
              </h4>
              <span className="text-[11px] text-[#ebbbb4]/60">
                {v.channel.name} • {v.likes} likes
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
