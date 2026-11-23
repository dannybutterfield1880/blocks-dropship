// DUMMY DATA for step 1. In step 2 this gets replaced by products pulled
// from the supplier API into Supabase. Prices are in pence.

export type Collection = {
  slug: string;
  name: string;
  blurb: string;
  colour: string;
};

export type Product = {
  slug: string;
  name: string;
  collection: string; // collection slug
  price: number; // pence
  pieces: number;
  age: number;
  description: string;
  image?: string; // filled from supplier in step 2
};

export const collections: Collection[] = [
  { slug: "metro", name: "Metro", blurb: "City life, fire crews and rescue", colour: "#2E5E8C" },
  { slug: "orbit", name: "Orbit", blurb: "Rockets, rovers and lunar bases", colour: "#2B2A4A" },
  { slug: "keep", name: "Keep", blurb: "Castles, knights and dragons", colour: "#5E7350" },
  { slug: "tidewater", name: "Tidewater", blurb: "Ships, harbours and treasure", colour: "#1F6F80" },
  { slug: "main-street", name: "Main Street", blurb: "Modular shops and townhouses", colour: "#A65E3A" },
  { slug: "bloom", name: "Bloom", blurb: "Flowers and plants that never wilt", colour: "#8A4E68" },
];

export const products: Product[] = [
  { slug: "fire-station-hq", name: "Fire Station HQ", collection: "metro", price: 3999, pieces: 820, age: 8, description: "A three-bay fire station with a working garage door, ladder truck and rooftop helipad." },
  { slug: "city-ambulance", name: "City Ambulance", collection: "metro", price: 1499, pieces: 240, age: 6, description: "Quick build rescue van with opening rear doors and stretcher." },
  { slug: "lunar-research-base", name: "Lunar Research Base", collection: "orbit", price: 4999, pieces: 1100, age: 9, description: "Modular moon base with a lab, docking bay and six-wheel rover." },
  { slug: "star-courier", name: "Star Courier", collection: "orbit", price: 2499, pieces: 480, age: 8, description: "Swooshable cargo ship with a detachable shuttle." },
  { slug: "gatehouse-fortress", name: "Gatehouse Fortress", collection: "keep", price: 5499, pieces: 1350, age: 10, description: "Castle gatehouse with a raising portcullis and battlements." },
  { slug: "dragon-watchtower", name: "Dragon Watchtower", collection: "keep", price: 2999, pieces: 620, age: 8, description: "A stone tower under attack from a poseable dragon." },
  { slug: "harbour-galleon", name: "Harbour Galleon", collection: "tidewater", price: 6999, pieces: 1800, age: 12, description: "Three-mast galleon with rigging, cannons and a captain's cabin." },
  { slug: "corner-bakery", name: "Corner Bakery", collection: "main-street", price: 7999, pieces: 2100, age: 14, description: "Detailed modular bakery with a full interior across three floors." },
  { slug: "bonsai-tree", name: "Bonsai Tree", collection: "bloom", price: 2499, pieces: 880, age: 14, description: "Display bonsai with swappable green or blossom leaves." },
  { slug: "wildflower-bouquet", name: "Wildflower Bouquet", collection: "bloom", price: 3499, pieces: 940, age: 14, description: "Twelve stems of build-it-yourself wildflowers." },
];

export const bestsellers = ["fire-station-hq", "lunar-research-base", "gatehouse-fortress", "bonsai-tree"];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsIn = (slug: string) => products.filter((p) => p.collection === slug);

export const formatPrice = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
