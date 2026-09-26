import React, { useState } from 'react';
import {
  CheckCircle,
  Play,
  Bell,
  Search,
  ArrowRight,
  Flame,
  ThumbsUp,
  MessageSquare,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  FolderPlus
} from 'lucide-react';
import { Channel, Video, ShortItem } from '../types';
import { POPULAR_SHORTS } from '../data/mockData';

interface ChannelPageProps {
  channel: Channel;
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectShort: (short: ShortItem) => void;
  onToggleSubscribe: (channelId: string) => void;
}

export const ChannelPage: React.FC<ChannelPageProps> = ({
  channel,
  videos,
  onSelectVideo,
  onSelectShort,
  onToggleSubscribe,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'live' | 'playlists' | 'community' | 'about'>('home');
  const [videoSort, setVideoSort] = useState<'latest' | 'popular'>('latest');
  const [hasLikedCommunity, setHasLikedCommunity] = useState(false);
  const [communityLikes, setCommunityLikes] = useState(4200);

  const channelVideos = videos.filter((v) => v.channel.id === channel.id);
  const featuredVideo = channelVideos[0] || videos[0];

  const sortedVideos = [...channelVideos].sort((a, b) => {
    if (videoSort === 'popular') return b.rawViews - a.rawViews;
    return 0; // default latest
  });

  return (
    <div className="flex flex-col w-full bg-[#131313] text-[#e5e2e1] pb-24">
      {/* 1. Cinematic Panoramic Banner */}
      <div className="relative w-full h-44 sm:h-64 md:h-80 overflow-hidden bg-[#1c1b1b]">
        <img
          src={channel.banner}
          alt={`${channel.name} banner`}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-80" />
      </div>

      {/* 2. Channel Profile Lockup */}
      <div className="px-4 md:px-10 -mt-14 md:-mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6">
          {/* Avatar with verified check */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-[#131313] shadow-2xl bg-[#1c1b1b]">
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-full h-full object-cover"
              />
            </div>
            {channel.verified && (
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#ff5540] flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col pt-2 md:pt-10">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#e5e2e1]">
                {channel.name}
              </h1>
              {channel.verified && (
                <span className="text-[#ff5540] text-lg font-bold" title="Verified Creator">
                  ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-[#ebbbb4]/70 font-medium mt-1">
              <span>{channel.handle}</span>
              <span>•</span>
              <span>{channel.subscribers} subscribers</span>
              <span>•</span>
              <span>{channel.videoCount} videos</span>
            </div>

            <p className="text-xs md:text-sm text-[#ebbbb4]/80 mt-1.5 max-w-2xl line-clamp-2 leading-relaxed">
              {channel.description}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-[#9ccaff] font-semibold mt-2 hover:underline cursor-pointer">
              <span>discord.gg/nexusvibe and 3 more links</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => alert('Customizing layout for your channel...')}
            className="px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#353534] text-xs font-semibold text-[#e5e2e1] transition-colors"
          >
            Customize channel
          </button>

          <button
            onClick={() => alert('Opening video manager dashboard...')}
            className="px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#353534] text-xs font-semibold text-[#e5e2e1] transition-colors"
          >
            Manage videos
          </button>

          <button
            onClick={() => onToggleSubscribe(channel.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              channel.isSubscribed
                ? 'bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#353534]'
                : 'bg-[#ff5540] text-white hover:bg-[#ff5540]/90 shadow-[#ff5540]/20'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{channel.isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
          </button>

          <button
            onClick={() => alert('Membership benefits: Exclusive badges, discord role, and monthly deep dive code repositories!')}
            className="px-5 py-2 rounded-full bg-[#9ccaff] text-[#001d35] text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Join
          </button>
        </div>
      </div>

      {/* 3. Channel Tab Navigation */}
      <div className="sticky top-16 z-30 bg-[#131313]/95 backdrop-blur-md px-4 md:px-10 border-b border-[#353534]/30 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'home', label: 'Home' },
          { id: 'videos', label: 'Videos' },
          { id: 'shorts', label: 'Shorts' },
          { id: 'live', label: 'Live' },
          { id: 'playlists', label: 'Playlists' },
          { id: 'community', label: 'Community' },
          { id: 'about', label: 'About' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-[#ff5540] text-[#e5e2e1]'
                  : 'border-transparent text-[#ebbbb4]/60 hover:text-[#e5e2e1]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Area */}
      <div className="px-4 md:px-10 py-8 flex flex-col gap-10 max-w-[1920px] mx-auto w-full">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* Featured Upload Banner */}
            {featuredVideo && (
              <div className="bg-[#1c1b1b] border border-[#353534]/40 rounded-2xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-xl">
                <div
                  onClick={() => onSelectVideo(featuredVideo)}
                  className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-lg bg-black"
                >
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ff5540] text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-xs font-semibold text-white">
                    {featuredVideo.duration}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[10px] font-bold uppercase tracking-wider">
                      Featured Upload
                    </span>
                    <span className="text-xs text-[#ebbbb4]/60">• {featuredVideo.timestamp}</span>
                  </div>

                  <h2
                    onClick={() => onSelectVideo(featuredVideo)}
                    className="text-lg md:text-xl font-bold text-[#e5e2e1] leading-tight mb-2.5 hover:text-[#ff5540] transition-colors cursor-pointer line-clamp-2"
                  >
                    {featuredVideo.title}
                  </h2>

                  <p className="text-xs md:text-sm text-[#ebbbb4]/70 line-clamp-3 mb-4 leading-relaxed">
                    {featuredVideo.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#ebbbb4]/60 font-medium">
                      {featuredVideo.views} • {featuredVideo.likes} likes
                    </span>
                    <button
                      onClick={() => onSelectVideo(featuredVideo)}
                      className="px-5 py-2 rounded-full bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-[#ff5540]/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Uploads */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#ff5540] rounded-full" />
                  Latest Uploads
                </h3>
                <button
                  onClick={() => setActiveTab('videos')}
                  className="text-xs font-semibold text-[#ff5540] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {channelVideos.slice(0, 4).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => onSelectVideo(v)}
                    className="flex flex-col gap-2.5 group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                        {v.duration}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors">
                        {v.title}
                      </h4>
                      <span className="text-[11px] text-[#ebbbb4]/60 mt-1">
                        {v.views} • {v.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Shorts Row */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#9ccaff] rounded-full" />
                  Popular Shorts
                </h3>
                <button
                  onClick={() => setActiveTab('shorts')}
                  className="text-xs font-semibold text-[#9ccaff] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {POPULAR_SHORTS.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectShort(s)}
                    className="flex flex-col gap-2 group cursor-pointer"
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                      <img
                        src={s.thumbnail}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-xs font-semibold text-white">
                        {s.views}
                      </div>
                    </div>
                    <h4 className="text-xs font-medium text-[#e5e2e1] line-clamp-2 group-hover:text-[#ffb4a8] transition-colors leading-snug">
                      {s.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#e5e2e1]">All Uploads ({channelVideos.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setVideoSort('latest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    videoSort === 'latest' ? 'bg-[#ff5540] text-white' : 'bg-[#201f1f] text-[#ebbbb4]/70'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setVideoSort('popular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    videoSort === 'popular' ? 'bg-[#ff5540] text-white' : 'bg-[#201f1f] text-[#ebbbb4]/70'
                  }`}
                >
                  Popular
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => onSelectVideo(v)}
                  className="flex flex-col gap-2.5 group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                      {v.duration}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs md:text-sm font-semibold text-[#e5e2e1] line-clamp-2 leading-snug group-hover:text-[#ffb4a8] transition-colors">
                      {v.title}
                    </h4>
                    <span className="text-[11px] text-[#ebbbb4]/60 mt-1">
                      {v.views} • {v.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHORTS TAB */}
        {activeTab === 'shorts' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#e5e2e1]">All Shorts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {POPULAR_SHORTS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectShort(s)}
                  className="flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#1c1b1b] shadow-md border border-[#353534]/30">
                    <img
                      src={s.thumbnail}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-xs font-semibold text-white">
                      {s.views}
                    </div>
                  </div>
                  <h4 className="text-xs font-medium text-[#e5e2e1] line-clamp-2 group-hover:text-[#ffb4a8] transition-colors leading-snug">
                    {s.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE TAB */}
        {activeTab === 'live' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#e5e2e1]">Past & Upcoming Streams</h3>
            <div className="bg-[#1c1b1b] border border-[#353534]/40 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center shadow-xl">
              <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden relative shadow-lg bg-black">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJT3Bm_9cdt4euJoy8DN687-lIfFW_tsRdQQsVCveN7yQunZeZxDQcjQAeauSa4qJsbPAAlpquvsL8qHodAH5T8niNfbgUzCzo2JAYweF6sWkNv5p1_YV-3Y_GzCEqqwPQFi_ypPj1BYjtrYXiJEdXmTGpYcg1vbnQY6J8FKH9SFSp-shrO4N3BuM8laPE_s4mhkJ51Bwr_JqtgsDM7D8ko6RTQxlzaPHMKm8XDmVijv-hs5s-LwU-"
                  alt="Live broadcast"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ff5540] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live Stream Replay
                </span>
                <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-mono text-white">
                  3:14:20
                </span>
              </div>
              <div className="flex flex-col gap-3 md:w-1/2">
                <h4 className="text-lg font-bold text-[#e5e2e1]">
                  BUILDING AN OS FROM SCRATCH (Day 14) - Memory Management & Paging
                </h4>
                <p className="text-xs md:text-sm text-[#ebbbb4]/70 leading-relaxed">
                  Deep technical walkthrough designing custom x86_64 kernel paging tables and memory isolation in modern bare-metal programming.
                </p>
                <span className="text-xs text-[#ebbbb4]/50">Streamed 2 days ago • 142K views</span>
                <button
                  onClick={() => onSelectVideo(videos[0])}
                  className="px-6 py-2.5 rounded-full bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 w-max shadow-md shadow-[#ff5540]/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Watch Replay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAYLISTS TAB */}
        {activeTab === 'playlists' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#e5e2e1]">Created Playlists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[
                { title: 'Neural Interfaces & AI Architecture', count: 24, img: featuredVideo.thumbnail },
                { title: 'Advanced C++ & Systems Programming', count: 18, img: channelVideos[1]?.thumbnail || featuredVideo.thumbnail },
                { title: 'Cyberpunk Aesthetic Visuals & Lo-Fi', count: 32, img: channel.banner },
              ].map((pl, i) => (
                <div
                  key={i}
                  onClick={() => onSelectVideo(featuredVideo)}
                  className="flex flex-col gap-2 cursor-pointer group"
                >
                  <div className="aspect-video rounded-xl bg-[#1c1b1b] border border-[#353534]/30 relative overflow-hidden flex items-center justify-center shadow-md">
                    <img src={pl.img} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-white font-bold text-xs">
                        <FolderPlus className="w-4 h-4 text-[#ff5540]" />
                        <span>{pl.count} Videos</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-[#e5e2e1] group-hover:text-[#ff5540] transition-colors">
                    {pl.title}
                  </h4>
                  <span className="text-[11px] text-[#ebbbb4]/60">View full playlist</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <div className="bg-[#1c1b1b] border border-[#353534]/40 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <img src={channel.avatar} alt={channel.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#353534]" />
                <div>
                  <h5 className="text-sm font-bold text-[#e5e2e1]">{channel.name}</h5>
                  <span className="text-[11px] text-[#ebbbb4]/50">3 days ago</span>
                </div>
              </div>

              <p className="text-sm text-[#e5e2e1] leading-relaxed">
                Working on a massive deep-dive into neuromorphic computing architectures for next week's release. What specific topics would you like me to cover in depth? Drop your thoughts below!
              </p>

              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-[#353534]/30">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9NSUMWPaqHrV7vAL2S8rtykwrveQQTp_cOB5LBG9lLyuvZQQqBzSbt0TgkkWwreXOPQR7PjMVS3GwlDDv6Ci4cRmoxCSMC9DBQJapsgrrcYOxXFFZuYyo33D_zAuMCCKnZyPwe7PwgoQ1p9DsnaWzNppFFHN24MsHcdmr-oUG8eZc18V2Ih3pIIVcrkdVByq2cd7eogG9RKN4u0AVMFy0dZfj_A6lhN1lpjLab2ALI_Qf8I1gpTDD"
                  alt="Behind the scenes server lab"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs text-[#ebbbb4]/70">
                <button
                  onClick={() => {
                    setHasLikedCommunity(!hasLikedCommunity);
                    setCommunityLikes(hasLikedCommunity ? communityLikes - 1 : communityLikes + 1);
                  }}
                  className={`flex items-center gap-1.5 transition-colors ${
                    hasLikedCommunity ? 'text-[#ff5540] font-bold' : 'hover:text-[#ff5540]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLikedCommunity ? 'fill-current' : ''}`} />
                  <span>{communityLikes.toLocaleString()}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#ff5540] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>328 comments</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full bg-[#1c1b1b] border border-[#353534]/40 p-6 md:p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-[#e5e2e1]">About {channel.name}</h3>
            <p className="text-sm text-[#ebbbb4]/80 leading-relaxed whitespace-pre-line">
              {channel.description}
            </p>
            <p className="text-sm text-[#ebbbb4]/80 leading-relaxed">
              Our mission is to bridge the gap between academic research papers and actionable, hands-on engineering tutorials for builders shaping the digital frontier.
            </p>

            <hr className="border-[#353534]/40 my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-[#e5e2e1] block mb-1">Stats</span>
                <p className="text-[#ebbbb4]/60">Joined {channel.joinedDate}</p>
                <p className="text-[#ebbbb4]/60">{channel.totalViews} views</p>
              </div>
              <div>
                <span className="font-bold text-[#e5e2e1] block mb-1">Links</span>
                {channel.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#9ccaff] hover:underline flex items-center gap-1 mt-1 truncate"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
