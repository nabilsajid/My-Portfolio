import ShowcasePage from "./ShowcasePage";
import shortform1 from "@/assets/shortform-1.jpg";
import shortform2 from "@/assets/shortform-2.jpg";
import longform1 from "@/assets/longform-1.jpg";
import longform2 from "@/assets/longform-2.jpg";

const items = [
  { title: "Product Reel", thumbnail: shortform1 },
  { title: "Event Highlights", thumbnail: shortform2 },
  { title: "Behind The Scenes", thumbnail: longform1 },
  { title: "Social Edit", thumbnail: shortform1 },
  { title: "Brand Story", thumbnail: shortform2 },
  { title: "Tutorial Clip", thumbnail: longform2 },
  { title: "Promo Video", thumbnail: shortform1 },
  { title: "Trending Edit", thumbnail: shortform2 },
  { title: "Quick Tips", thumbnail: longform1 },
  { title: "Transformation", thumbnail: shortform1 },
  { title: "Day in the Life", thumbnail: shortform2 },
  { title: "Challenge Video", thumbnail: longform2 },
];

const ShortFormPage = () => (
  <ShowcasePage title="Short Form Content" subtitle="Scroll-stopping reels and social media edits" items={items} type="video" vertical />
);

export default ShortFormPage;
