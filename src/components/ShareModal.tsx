import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, Send, MessageSquare } from 'lucide-react';
import { Video } from '../types';

interface ShareModalProps {
  video: Video | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!video) return null;

  const shareUrl = `${window.location.origin}?v=${video.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] border border-[#353534] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#353534]/40">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#ff5540]" />
            <h3 className="font-bold text-base text-[#e5e2e1]">Share Video</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#ebbbb4]/60 hover:text-white hover:bg-[#2a2a2a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video preview mini card */}
        <div className="flex items-center gap-3 my-4 p-2.5 rounded-xl bg-[#201f1f]">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-16 aspect-video rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#e5e2e1] truncate">{video.title}</p>
            <p className="text-[11px] text-[#ebbbb4]/60">{video.channel.name}</p>
          </div>
        </div>

        {/* Social action icons */}
        <div className="grid grid-cols-4 gap-3 py-2 text-center">
          {[
            { name: 'X / Twitter', color: 'hover:bg-sky-500/20 text-sky-400' },
            { name: 'WhatsApp', color: 'hover:bg-emerald-500/20 text-emerald-400' },
            { name: 'Reddit', color: 'hover:bg-orange-500/20 text-orange-400' },
            { name: 'Embed Code', color: 'hover:bg-purple-500/20 text-purple-400' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                alert(`Shared link to ${item.name}!`);
                onClose();
              }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] transition-colors ${item.color}`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-[10px] text-[#e5e2e1] font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="mt-4 flex items-center bg-[#131313] border border-[#353534]/60 rounded-xl px-3 py-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs text-[#ebbbb4]/80 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="ml-2 px-3 py-1.5 rounded-lg bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
