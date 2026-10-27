export const COMPANY = {
  name: "REFLITE TECHNOLOGIES",
  short: "Reflite",
  location: "Kaimosi, Kenya",
  phone: "0115295927",
  phoneHref: "tel:+254115295927",
  email: "reflitetecnologies@gmail.com",
  founded: "2024",
};

export const SOCIALS = [
  { label: "YouTube", handle: "Reflite Technologies", href: "https://youtube.com/@reflitetechnologies" },
  { label: "TikTok", handle: "REFLITE TECHNOLOGIES", href: "https://tiktok.com/@reflite_technologies" },
  { label: "Instagram", handle: "reflite_technologies", href: "https://instagram.com/reflite_technologies" },
  { label: "X", handle: "Reflite Technologies", href: "https://x.com/reflitetech" },
];

export type ServiceGroup = {
  category: string;
  blurb: string;
  items: { name: string; description: string }[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "Technology",
    blurb: "Systems, websites and secure digital access.",
    items: [
      { name: "Web Development", description: "Responsive websites, web apps and digital systems built to perform." },
      { name: "Cyber Services", description: "Full cyber café support: browsing, downloads, account setup and more." },
      { name: "Online Applications", description: "We handle any online form or portal application end to end." },
    ],
  },
  {
    category: "Creative",
    blurb: "Design and media that make you look professional.",
    items: [
      { name: "Graphic Design", description: "Logos, posters, flyers, branding kits and social media graphics." },
      { name: "Video Editing", description: "Cinematic edits, motion graphics, reels and event highlight films." },
      { name: "CV Creation", description: "Modern, recruiter-ready CVs and cover letters tailored to your field." },
    ],
  },
  {
    category: "Document Services",
    blurb: "Fast, clean everyday document work.",
    items: [
      { name: "Printing", description: "Sharp colour and black-and-white printing in all common sizes." },
      { name: "Photocopying", description: "Bulk and single copies with reliable quality." },
      { name: "Scanning", description: "High-resolution scans delivered as PDF or image files." },
      { name: "Typing & Document Preparation", description: "Reports, letters, proposals and academic work typed neatly." },
      { name: "Lamination", description: "Protect certificates, IDs and important documents for good." },
    ],
  },
  {
    category: "Government & Business",
    blurb: "Official services handled correctly, first time.",
    items: [
      { name: "eCitizen Services", description: "Assistance with any eCitizen or Government portal request." },
      { name: "KRA Services", description: "PIN registration, returns filing, compliance certificates." },
      { name: "NSSF / SHA", description: "Registration and online assistance for NSSF and SHA." },
      { name: "HELB Services", description: "Applications, loan statements and compliance certificates." },
      { name: "Passport & Visa", description: "Guided application support with correct documentation." },
      { name: "Certificate Applications", description: "Birth, good conduct and other certificate applications." },
      { name: "Business Registration", description: "Name search and registration for your new business." },
    ],
  },
];

export const ALL_SERVICE_NAMES = SERVICE_GROUPS.flatMap((g) => g.items.map((i) => i.name));

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];
