import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Settings,
  Share2,
  Download,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  MoreVertical,
  SlidersHorizontal,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Video, CommentItem } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface WatchPageProps {
  video: Video;
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onShare: (video: Video) => void;
  onSaveToPlaylist: (video: Video) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  video,
  allVideos,
  onSelectVideo,
  onSelectChannel,
  onShare,
  onSaveToPlaylist,
}) => {
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(252); // ~4:12 in seconds
  const [duration, setDuration] = useState(video.durationSeconds || 1125);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p60');
  const [showSettings, setShowSettings] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  // Interaction states
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.rawLikes || 124000);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [recommendedFilter, setRecommendedFilter] = useState('All');

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(video.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [commentSort, setCommentSort] = useState<'top' | 'newest'>('top');

  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if video changes
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(Math.floor((video.durationSeconds || 1000) * 0.22));
    setDuration(video.durationSeconds || 1125);
    setLikeCount(video.rawLikes || 124000);
    setHasLiked(false);
    setHasDisliked(false);
    setComments(video.comments || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [video.id]);

  // Video playback simulation ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(pos * duration));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      if (hasDisliked) setHasDisliked(false);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setHasLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: CURRENT_USER.name,
      handle: CURRENT_USER.handle,
      avatar: CURRENT_USER.avatar,
      timestamp: 'Just now',
      content: newCommentText.trim(),
      likes: 0,
      isLiked: false,
    };
    setComments([newComment, ...comments]);
    setNewCommentText('');
    setIsCommentFocused(false);
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  const filteredRecommended = recommendedVideos.filter((v) => {
    if (recommendedFilter === 'All') return true;
    if (recommendedFilter === 'From Channel') return v.channel.id === video.channel.id;
    if (recommendedFilter === 'Ambient') return v.category === 'Lo-Fi' || v.tags.includes('#AmbientWalk');
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-6 max-w-[1920px] mx-auto pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Left Video Column (8 cols) */}
        <div className={`flex flex-col gap-5 ${theaterMode ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
          {/* Video Player Container */}
          <div
            ref={playerRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="relative w-full aspect-video bg-[#0e0e0e] rounded-2xl overflow-hidden shadow-2xl group flex flex-col justify-end select-none border border-[#353534]/40"
          >
            {/* Visual Stream Frame (Backdrop + Video simulation) */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                isPlaying ? 'scale-100' : 'scale-102 brightness-90'
              }`}
              style={{ backgroundImage: `url('${video.backdropUrl || video.thumbnail}')` }}
            >
              {/* Cinematic Scanlines / Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />
              {isPlaying && (
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />
              )}
            </div>

            {/* Top Bar Video Info overlay (Hover) */}
            <div
              className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5540] animate-pulse" />
                <span className="text-sm font-semibold text-white drop-shadow-md truncate max-w-md">
                  {video.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-bold text-[#ff5540] border border-[#ff5540]/30">
                  4K 60FPS HDR
                </span>
              </div>
            </div>

            {/* Center Play/Pause button trigger */}
            <div
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            >
              {!isPlaying && (
                <div className="w-20 h-20 rounded-full bg-[#ff5540]/90 text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-10 h-10 fill-white ml-1.5" />
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div
              className={`relative z-20 px-4 pb-3 flex flex-col gap-2 transition-opacity duration-200 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Scrubbable Progress Bar */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 hover:h-2 bg-[#353534]/80 rounded-full overflow-hidden cursor-pointer relative transition-all group/progress"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 bg-[#ff5540] rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs">
                {/* Left controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-[#ff5540] transition-colors p-1"
                    title={isPlaying ? 'Pause (space)' : 'Play (space)'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 group/vol">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-[#ff5540] transition-colors p-1"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-[#ff5540]" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 accent-[#ff5540] h-1 bg-[#353534] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Time Counter */}
                  <span className="font-mono text-[#ebbbb4]/90 text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  {/* Quality selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="px-2 py-1 rounded hover:bg-white/10 font-semibold text-[11px] text-[#ebbbb4] flex items-center gap-1 transition-colors"
                    >
                      <span>Auto ({quality})</span>
                      <Settings className="w-3.5 h-3.5 ml-0.5" />
                    </button>

                    {showSettings && (
                      <div className="absolute right-0 bottom-8 w-40 bg-[#1c1b1b] border border-[#353534] rounded-xl shadow-2xl p-2 z-30">
                        <span className="text-[10px] uppercase font-bold text-[#ebbbb4]/50 px-2 py-1 block">
                          Playback Quality
                        </span>
                        {['4K 2160p', '1440p60', '1080p60', '720p', 'Auto'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowSettings(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-[#2a2a2a] transition-colors ${
                              quality === q ? 'text-[#ff5540] font-bold' : 'text-[#e5e2e1]'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className="p-1 hover:text-[#ff5540] transition-colors"
                    title={theaterMode ? 'Default view' : 'Theater mode'}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-[#ff5540] transition-colors"
                    title="Fullscreen (f)"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title */}
          <h1 className="text-xl md:text-2xl font-bold text-[#e5e2e1] leading-tight">
            {video.title}
          </h1>

          {/* Channel Lockup & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#353534]/30">
            {/* Channel Profile */}
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => onSelectChannel(video.channel.id)}
                className="w-12 h-12 rounded-full overflow-hidden cursor-pointer ring-2 ring-[#353534] hover:ring-[#ff5540] transition-all shrink-0"
              >
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div
                  onClick={() => onSelectChannel(video.channel.id)}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="font-semibold text-base text-[#e5e2e1] group-hover:text-[#ff5540] transition-colors">
                    {video.channel.name}
                  </span>
                  {video.channel.verified && (
                    <CheckCircle className="w-4 h-4 text-[#ff5540] fill-current" />
                  )}
                </div>
                <span className="text-xs text-[#ebbbb4]/60">
                  {video.channel.subscribers} subscribers
                </span>
              </div>

              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`ml-3 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                  isSubscribed
                    ? 'bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#353534]'
                    : 'bg-[#ff5540] text-white hover:bg-[#ff5540]/90 shadow-[#ff5540]/20'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Like / Dislike segmented pill */}
              <div className="flex items-center bg-[#201f1f] border border-[#353534]/40 rounded-full overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition-colors border-r border-[#353534]/40 ${
                    hasLiked ? 'text-[#ff5540]' : 'text-[#e5e2e1]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-[#ff5540]' : ''}`} />
                  <span className="text-xs font-semibold">
                    {hasLiked ? 'Liked' : (likeCount / 1000).toFixed(0) + 'K'}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 hover:bg-[#2a2a2a] transition-colors ${
                    hasDisliked ? 'text-[#ff5540]' : 'text-[#e5e2e1]'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-[#ff5540]' : ''}`} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={() => onShare(video)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#353534]/40 text-xs font-semibold text-[#e5e2e1] transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#9ccaff]" />
                <span>Share</span>
              </button>

              {/* Download button */}
              <button
                onClick={() => alert(`Starting offline high-res download for "${video.title}"`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#353534]/40 text-xs font-semibold text-[#e5e2e1] transition-colors hidden sm:flex"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              {/* Save to Playlist button */}
              <button
                onClick={() => onSaveToPlaylist(video)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#353534]/40 text-xs font-semibold text-[#e5e2e1] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[#ff5540]" />
                <span className="hidden md:inline">Save</span>
              </button>
            </div>
          </div>

          {/* Expandable Description Box */}
          <div
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="bg-[#1c1b1b] border border-[#353534]/30 rounded-2xl p-4 flex flex-col gap-2.5 cursor-pointer hover:bg-[#201f1f] transition-all group"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#ebbbb4]/80">
              <span className="text-[#e5e2e1]">{video.views}</span>
              <span>•</span>
              <span className="text-[#e5e2e1]">{video.timestamp}</span>
              <span>•</span>
              <div className="flex gap-2 text-[#ff5540]">
                {video.tags?.map((t) => (
                  <span key={t} className="hover:underline">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p
              className={`text-sm text-[#e5e2e1] leading-relaxed transition-all ${
                isDescExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {video.description}
            </p>

            <button className="text-xs font-semibold text-[#ff5540] self-start hover:underline mt-1">
              {isDescExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex flex-col gap-5 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h3 className="text-lg font-bold text-[#e5e2e1]">
                  {comments.length} Comments
                </h3>
                <button
                  onClick={() =>
                    setCommentSort(commentSort === 'top' ? 'newest' : 'top')
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-[#ebbbb4]/70 hover:text-[#e5e2e1] transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Sort by: {commentSort === 'top' ? 'Top comments' : 'Newest first'}</span>
                </button>
              </div>
            </div>

            {/* Comment Input */}
            <div className="flex gap-3.5 items-start">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 mt-1 ring-1 ring-[#353534]"
              />
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Add a constructive comment..."
                  value={newCommentText}
                  onFocus={() => setIsCommentFocused(true)}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                  className="w-full bg-transparent border-b border-[#353534] pb-2 text-sm text-[#e5e2e1] placeholder-[#ebbbb4]/50 focus:outline-none focus:border-[#ff5540] transition-colors"
                />

                {isCommentFocused && (
                  <div className="flex justify-end gap-2 mt-1 animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        setNewCommentText('');
                        setIsCommentFocused(false);
                      }}
                      className="px-4 py-1.5 rounded-full text-xs font-medium text-[#ebbbb4]/80 hover:bg-[#201f1f] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newCommentText.trim()}
                      className="px-5 py-1.5 rounded-full bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-md shadow-[#ff5540]/20"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-5 pt-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3.5 items-start group/comment">
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#353534]"
                  />
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#e5e2e1]">
                        {c.handle}
                      </span>
                      <span className="text-[11px] text-[#ebbbb4]/50">
                        {c.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-[#e5e2e1] leading-relaxed break-words">
                      {c.content}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-xs text-[#ebbbb4]/70">
                      <button
                        onClick={() => handleToggleCommentLike(c.id)}
                        className={`flex items-center gap-1.5 hover:text-[#ff5540] transition-colors ${
                          c.isLiked ? 'text-[#ff5540]' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`} />
                        <span>{c.likes > 0 ? c.likes : ''}</span>
                      </button>
                      <button className="hover:text-[#ff5540] transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setNewCommentText(`@${c.author} `);
                          setIsCommentFocused(true);
                        }}
                        className="font-medium text-[#ff5540] hover:underline"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Recommended Column (4 cols) */}
        {!theaterMode && (
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Filter Chips for Recommended */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'From Channel', 'Ambient'].map((filter) => {
                const isActive = recommendedFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setRecommendedFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#e5e2e1] text-[#131313]'
                        : 'bg-[#201f1f] text-[#ebbbb4]/70 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]'
                    }`}
                  >
                    {filter === 'From Channel' ? `From ${video.channel.name.split(' ')[0]}` : filter}
                  </button>
                );
              })}
            </div>

            {/* List of Recommended Cards */}
            <div className="flex flex-col gap-3">
              {filteredRecommended.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectVideo(rec)}
                  className="flex gap-3 group cursor-pointer p-2 rounded-xl hover:bg-[#1c1b1b] transition-colors border border-transparent hover:border-[#353534]/40"
                >
                  {/* Thumbnail */}
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-[#201f1f] shrink-0">
                    <img
                      src={rec.thumbnail}
                      alt={rec.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 font-mono text-[10px] font-semibold text-white">
                      {rec.duration}
                    </div>
                    {rec.isLive && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-[#ff5540] text-white text-[9px] font-bold">
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-[#ebbbb4]/60 truncate">
                      {rec.channel.name}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#ebbbb4]/50">
                      <span>{rec.views}</span>
                      <span>•</span>
                      <span>{rec.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
