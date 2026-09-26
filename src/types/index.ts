export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribers: string;
  subscriberCount: number;
  videoCount: number;
  verified: boolean;
  description: string;
  joinedDate: string;
  totalViews: string;
  links: { label: string; url: string }[];
  isSubscribed: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdropUrl: string;
  duration: string;
  durationSeconds: number;
  views: string;
  rawViews: number;
  timestamp: string;
  timeGroup: 'today' | 'yesterday' | 'older';
  channel: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
  };
  likes: string;
  rawLikes: number;
  dislikes?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  badge?: '4K 60FPS' | 'LIVE' | 'NEW' | 'FEATURED PREMIERE' | string;
  isLive?: boolean;
  category: string;
  tags: string[];
  progress?: number; // 0 - 100
  commentsCount: number;
  comments: CommentItem[];
}

export interface ShortItem {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
    handle: string;
  };
  likes: string;
  commentsCount: string;
}

export interface SubscribedChannel {
  id: string;
  name: string;
  avatar: string;
  isLive: boolean;
  hasNewVideos: boolean;
  handle: string;
  subscribers: string;
}

export type NavTab = 
  | 'home' 
  | 'shorts' 
  | 'subscriptions' 
  | 'library' 
  | 'history' 
  | 'liked-videos' 
  | 'explore'
  | 'channel'
  | 'watch';
