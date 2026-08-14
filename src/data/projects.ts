import longform1 from "@/assets/longform-1.jpg";
import longform2 from "@/assets/longform-2.jpg";
import longform3 from "@/assets/longform-3.jpg";
import shortform1 from "@/assets/shortform-1.jpg";
import shortform2 from "@/assets/shortform-2.jpg";
import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";

export const imageMap: Record<string, string> = {
  '/src/assets/longform-1.jpg': longform1,
  '/src/assets/longform-2.jpg': longform2,
  '/src/assets/longform-3.jpg': longform3,
  '/src/assets/shortform-1.jpg': shortform1,
  '/src/assets/shortform-2.jpg': shortform2,
  '/src/assets/poster-1.jpg': poster1,
  '/src/assets/poster-2.jpg': poster2,
  '/src/assets/photo-1.jpg': photo1,
  '/src/assets/photo-2.jpg': photo2,
  '/src/assets/photo-3.jpg': photo3,
};

export const projects = [
  { id: 1, title: 'Cinematic Brand Film', category: 'long-form', image_url: '/src/assets/longform-1.jpg', video_url: 'https://youtube.com' },
  { id: 2, title: 'Documentary Highlight', category: 'long-form', image_url: '/src/assets/longform-2.jpg', video_url: 'https://youtube.com' },
  { id: 3, title: 'Corporate Event Coverage', category: 'long-form', image_url: '/src/assets/longform-3.jpg', video_url: 'https://youtube.com' },
  { id: 11, title: 'Music Video Production', category: 'long-form', image_url: '/src/assets/longform-1.jpg', video_url: 'https://youtube.com' },
  { id: 12, title: 'Travel Vlog Cinematic', category: 'long-form', image_url: '/src/assets/longform-2.jpg', video_url: 'https://youtube.com' },
  { id: 13, title: 'Real Estate Tour', category: 'long-form', image_url: '/src/assets/longform-3.jpg', video_url: 'https://youtube.com' },
  { id: 4, title: 'TikTok Viral Edit', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
  { id: 5, title: 'Instagram Reel Promo', category: 'short-form', image_url: '/src/assets/shortform-2.jpg', video_url: 'https://youtube.com' },
  { id: 14, title: 'YouTube Shorts Highlight', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
  { id: 15, title: 'Fitness Promo Reel', category: 'short-form', image_url: '/src/assets/shortform-2.jpg', video_url: 'https://youtube.com' },
  { id: 16, title: 'Travel Montage', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
  { id: 6, title: 'E-Sports Tournament', category: 'poster', image_url: '/src/assets/poster-1.jpg', label: 'Graphic Design' },
  { id: 7, title: 'University Event', category: 'poster', image_url: '/src/assets/poster-2.jpg', label: 'Key Visual' },
  { id: 8, title: 'Concert Photography', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Live Event', gallery_images: ['/src/assets/photo-2.jpg', '/src/assets/photo-3.jpg'] },
  { id: 9, title: 'Product Shoot', category: 'photography', image_url: '/src/assets/photo-2.jpg', label: 'Commercial' },
  { id: 10, title: 'Portrait Series', category: 'photography', image_url: '/src/assets/photo-3.jpg', label: 'Studio' },
  { id: 17, title: 'Wedding Stills', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Event' },
  { id: 18, title: 'Fashion Editorial', category: 'photography', image_url: '/src/assets/photo-2.jpg', label: 'Fashion' },
  { id: 19, title: 'Architectural Shots', category: 'photography', image_url: '/src/assets/photo-3.jpg', label: 'Architecture' }
];
