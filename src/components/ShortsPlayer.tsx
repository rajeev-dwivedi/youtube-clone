import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { ShortItem } from '../types';
import { POPULAR_SHORTS } from '../data/mockData';

interface ShortsPlayerProps {
  initialShort?: ShortItem;
  onClose: () => void;
  onShare: (short: ShortItem) => void;
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({
  initialShort,
  onClose,
  onShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialShort) return 0;
    const idx = POPULAR_SHORTS.findIndex((s) => s.id === initialShort.id);
    return idx >= 0 ? idx : 0;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState(false);

  const currentShort = POPULAR_SHORTS[currentIndex];

  const handleNext = () => {
    if (currentIndex < POPULAR_SHORTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = () => {
    setLikedMap((prev) => ({
      ...prev,
      [currentShort.id]: !prev[currentShort.id],
    }));
  };

  const isLiked = !!likedMap[currentShort.id];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-[#1c1b1b]/80 hover:bg-[#2a2a2a] text-[#e5e2e1] z-50 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="relative flex items-center justify-center gap-4 h-[85vh] max-h-[820px]">
        {/* Video Card */}
        <div className="relative h-full aspect-[9/16] bg-[#0e0e0e] rounded-2xl overflow-hidden shadow-2xl border border-[#353534]/50 flex flex-col justify-between">
          {/* Background image / video representation */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${currentShort.thumbnail}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          </div>

          {/* Top Controls: Sound & Play State */}
          <div className="relative z-10 p-4 flex items-center justify-between text-white">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 p-5 flex flex-col gap-2 text-white">
            <div className="flex items-center gap-3">
              <img
                src={currentShort.channel.avatar}
                alt={currentShort.channel.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff5540]"
              />
              <div>
                <span className="font-bold text-sm text-[#e5e2e1] block">
                  {currentShort.channel.name}
                </span>
                <span className="text-[11px] text-[#ebbbb4]/70">
                  {currentShort.channel.handle}
                </span>
              </div>
              <button
                onClick={() => alert('Subscribed to creator!')}
                className="ml-auto px-4 py-1.5 rounded-full bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 shadow-md"
              >
                Subscribe
              </button>
            </div>

            <p className="text-sm font-semibold leading-snug line-clamp-2 mt-1">
              {currentShort.title}
            </p>

            <span className="text-xs text-[#ebbbb4]/60 font-medium">
              {currentShort.views}
            </span>
          </div>
        </div>

        {/* Action Sidebar on Right */}
        <div className="flex flex-col gap-4 items-center z-10">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={toggleLike}
              className={`p-3 rounded-full bg-[#1c1b1b] border border-[#353534]/50 hover:bg-[#2a2a2a] transition-all transform active:scale-90 ${
                isLiked ? 'text-[#ff5540]' : 'text-white'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs font-semibold text-[#e5e2e1]">
              {isLiked ? 'Liked' : currentShort.likes}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-3 rounded-full bg-[#1c1b1b] border border-[#353534]/50 hover:bg-[#2a2a2a] text-white transition-all">
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-[#ebbbb4]/70">Dislike</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-3 rounded-full bg-[#1c1b1b] border border-[#353534]/50 hover:bg-[#2a2a2a] text-white transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-[#e5e2e1]">
              {currentShort.commentsCount}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onShare(currentShort as any)}
              className="p-3 rounded-full bg-[#1c1b1b] border border-[#353534]/50 hover:bg-[#2a2a2a] text-white transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-[#ebbbb4]/70">Share</span>
          </div>

          {/* Prev / Next navigation buttons */}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#353534]/40">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full bg-[#1c1b1b] text-white hover:bg-[#2a2a2a] disabled:opacity-30 transition-all"
              title="Previous Short"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === POPULAR_SHORTS.length - 1}
              className="p-2.5 rounded-full bg-[#1c1b1b] text-white hover:bg-[#2a2a2a] disabled:opacity-30 transition-all"
              title="Next Short"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
