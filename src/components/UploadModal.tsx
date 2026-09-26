import React, { useState } from 'react';
import { X, Upload, Video as VideoIcon, Check, Image as ImageIcon } from 'lucide-react';
import { Video } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newVideo: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [duration, setDuration] = useState('14:20');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUGWmNiXvH3bFbLnOxi7zZmNqZ1BbEMbRIugBPQWu7r0C-HCqsDMzZL11LN9mcOnTZRf0kFpspnWmu8dk40PDFABQ3Ff-0Hxy5H7wIWAJAo4zuOlkrCoGKEUSsJNNMKuoSG6D5zw0N7cGV-g7wtZ34gh57hjJd5trR-ZWINZJlSkhw5BlrvtR5KI4w_xCNgTyrgQ1MhjcE-9xB5hqukeEfYC9de3PQmYz2w88aCGLR896o5JPo0-0M'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sampleThumbnails = [
    { label: 'Cyberpunk Studio', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUGWmNiXvH3bFbLnOxi7zZmNqZ1BbEMbRIugBPQWu7r0C-HCqsDMzZL11LN9mcOnTZRf0kFpspnWmu8dk40PDFABQ3Ff-0Hxy5H7wIWAJAo4zuOlkrCoGKEUSsJNNMKuoSG6D5zw0N7cGV-g7wtZ34gh57hjJd5trR-ZWINZJlSkhw5BlrvtR5KI4w_xCNgTyrgQ1MhjcE-9xB5hqukeEfYC9de3PQmYz2w88aCGLR896o5JPo0-0M' },
    { label: 'Neo Tokyo Walk', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT9-7cdRQ24dtnRviOKaqiw7gGxqMrG6kW5cWfnnRz2bXMGcoEGeFpoyqzuE51rqylm3kXJw-FYKTS8f3IhJxhUwG6QaPz_F_NV2X6beP9WtGAw8JMxia3GGuhGZB2HJ20ddDehfFQTop3fBjZhNfTXSabPOEXmtvrBbHiatbiLCzsr_zn5soTQIt8rbbFU9mDKYZUFDGYeHUQY-ib05hUbJFNNZsdGNPESadlEMgRLw1iyXUCwbQe' },
    { label: 'Fluid 3D Render', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgHauNn2c4wa3ItmQqUZccrsKcQ3yPv-B0SFSxXo5hoTQpLbfq5mO7z49kuZTmld9eCHT8KNrH238dCmHEL5BErT4omYRP6PM-pIlrdpNTqMyGKzF5rsu9XfzIGDbBN2nMwitJotqxbysXMWr9GiN06W567VYu0ftI5cHMsLp7CycCa8Q7Su9KCEkK37FaK3woGBds_QSPbg6kRGZH44pY3rxs6lxgcd1KrRCoNwofmg07NLuw6Ocb' },
    { label: 'Quantum Server', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeRNdUtBnPfmqNV9xhOnuQkNQjEumc8gac6nq6_h7kBzNJJto_5WPCc5lC-Gvg4-0WHKQx8v2yIcqhvYsUEhlFT2tkh9sKw3je-BY90o2GBlhBUCLMGQ3VLk85a2yR0fM0ZbhTW1VQ5gkvBlrA5Rarm-s3v6rK7n3-D8AXgAnBMUdufH_u9LE0dkLeODgvgBoJuxNnGHpxuDJIPTI5ZdvCp6L2wgYOW10fpWECEIywiyjeAR_Wwoo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newVid: Video = {
        id: `custom_${Date.now()}`,
        title: title.trim(),
        description: description.trim() || 'Custom video upload on StreamTube platform.',
        thumbnail: thumbnailUrl,
        backdropUrl: thumbnailUrl,
        duration: duration || '14:20',
        durationSeconds: 860,
        views: '1 view',
        rawViews: 1,
        timestamp: 'Just now',
        timeGroup: 'today',
        channel: {
          id: 'user-channel',
          name: CURRENT_USER.name,
          handle: CURRENT_USER.handle,
          avatar: CURRENT_USER.avatar,
          subscribers: CURRENT_USER.subscribers,
          verified: true,
        },
        likes: '0',
        rawLikes: 0,
        category,
        tags: [`#${category}`, '#StreamTube', '#Creator'],
        commentsCount: 0,
        comments: [],
        badge: 'NEW',
      };

      onUploadSuccess(newVid);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] border border-[#353534] rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#353534]/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff5540]/10 text-[#ff5540]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#e5e2e1]">Upload Video</h3>
              <p className="text-xs text-[#ebbbb4]/60">Publish to your StreamTube channel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#ebbbb4]/60 hover:text-white hover:bg-[#2a2a2a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-[#e5e2e1] block mb-1">
              Video Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next-Gen Shader Animations with React & WebGL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#131313] border border-[#353534] rounded-xl px-3.5 py-2 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#ff5540]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#e5e2e1] block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Tell viewers what your video is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131313] border border-[#353534] rounded-xl px-3.5 py-2 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#ff5540] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#e5e2e1] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131313] border border-[#353534] rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff5540]"
              >
                <option value="Coding">Coding</option>
                <option value="Gaming">Gaming</option>
                <option value="UX Design">UX Design</option>
                <option value="Music">Music</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Architecture">Architecture</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#e5e2e1] block mb-1">
                Duration (mm:ss)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#131313] border border-[#353534] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff5540]"
              />
            </div>
          </div>

          {/* Select Sample Thumbnail */}
          <div>
            <label className="text-xs font-semibold text-[#e5e2e1] block mb-1.5">
              Choose Thumbnail
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sampleThumbnails.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setThumbnailUrl(s.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    thumbnailUrl === s.url
                      ? 'border-[#ff5540] ring-1 ring-[#ff5540]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-[#353534]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ebbbb4]/80 hover:bg-[#201f1f]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2 rounded-xl bg-[#ff5540] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-md shadow-[#ff5540]/20"
            >
              {isSubmitting ? (
                <>Publishing...</>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Publish Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
