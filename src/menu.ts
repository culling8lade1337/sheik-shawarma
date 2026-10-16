// Menu data for Sheik Shawarma Nørrebro.
// Source: public menu listing (semeny.no) — in-store prices in DKK.
// NOTE: delivery apps (Wolt, Just Eat) can show different prices.
// Item descriptions are kept factual: only what the listings actually say.
// TODO: replace `image` fields with real photos from the restaurant (public/photos/...).

export type Tag = "vegetarian" | "spicy";

export type IconName =
  | "durum"
  | "pita"
  | "plate"
  | "bowl"
  | "cup"
  | "fries"
  | "dip"
  | "nuggets";

export interface Category {
  id: string;
  label: string;
  icon: IconName;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number; // DKK
  category: string;
  tags: Tag[];
  image?: string;
  popular?: boolean;
}

export const categories: Category[] = [
  { id: "durum", label: "Durum", icon: "durum" },
  { id: "pita", label: "Pita", icon: "pita" },
  { id: "berlin", label: "Berlin pita", icon: "pita" },
  { id: "carte", label: "À la carte", icon: "plate" },
  { id: "bowl", label: "Bowl", icon: "bowl" },
  { id: "sides", label: "Sides & dips", icon: "fries" },
  { id: "drinks", label: "Drinks", icon: "cup" },
  { id: "kids", label: "Kids", icon: "nuggets" },
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const make = (
  category: string,
  name: string,
  price: number,
  description: string,
  tags: Tag[] = [],
): Item => ({
  id: `${category}-${slug(name)}`,
  name,
  description,
  price,
  category,
  tags: [
    ...tags,
    ...(/spicy/i.test(name) && !tags.includes("spicy") ? (["spicy"] as Tag[]) : []),
  ],
});

const DURUM_INFO = "Durum menu — comes with soda and dip.";
const PITA_INFO = "Pita menu. Ask at the counter what's included.";
const BERLIN_INFO = "Berliner-style pita menu. Ask at the counter what's included.";

export const items: Item[] = [
  // DURUM — signature menus
  make("durum", "Liban Way Durum Menu", 149, DURUM_INFO),
  make("durum", "Sheiks Special Durum Menu", 145, DURUM_INFO),
  make("durum", "Great Dane Durum Menu", 149, DURUM_INFO),
  make("durum", "Klassiker Durum Menu", 149, DURUM_INFO),
  make("durum", "Homestyle Durum Menu", 142, DURUM_INFO),
  make("durum", "Feta Durum Menu", 139, DURUM_INFO),
  make("durum", "Spicy Durum Menu", 139, DURUM_INFO),
  // DURUM — by filling
  make("durum", "Kylling Durum Menu", 149, "Chicken durum menu — comes with soda and dip."),
  make("durum", "Shawarma Durum Menu", 149, "Shawarma durum menu — comes with soda and dip."),
  make("durum", "Mix Durum Menu", 149, "Mix durum menu — comes with soda and dip."),
  make("durum", "Döner Durum Menu", 149, "Döner durum menu — comes with soda and dip."),
  make("durum", "Falafel Durum Menu", 149, "Falafel durum menu — comes with soda and dip.", ["vegetarian"]),
  make("durum", "Halloumi Durum Menu", 149, "Halloumi durum menu — comes with soda and dip.", ["vegetarian"]),

  // PITA
  make("pita", "Feta Pita Menu", 129, PITA_INFO),
  make("pita", "Liban Way Pita Menu", 129, PITA_INFO),
  make("pita", "Spicy Pita Menu", 129, PITA_INFO),
  make("pita", "Great Dane Pita Menu", 129, PITA_INFO),
  make("pita", "Homestyle Pita Menu", 135, PITA_INFO),
  make("pita", "Sheiks Special Pita Menu", 135, PITA_INFO),

  // BERLIN PITA
  make("berlin", "Feta Berliner Pita Menu", 129, BERLIN_INFO),
  make("berlin", "Spicy Berliner Pita Menu", 129, BERLIN_INFO),
  make("berlin", "Liban Way Berliner Pita Menu", 129, BERLIN_INFO),
  make("berlin", "Great Dane Berliner Pita Menu", 129, BERLIN_INFO),
  make("berlin", "Homestyle Berliner Pita Menu", 135, BERLIN_INFO),

  // À LA CARTE
  make("carte", "Shawarma Plate", 160, "Sheiks à la carte — shawarma plate."),
  make("carte", "Sheiks Mix Plate", 165, "Sheiks à la carte — the Sheiks mix plate."),
  make("carte", "Arthurs Mix Plate", 165, "Sheiks à la carte — Arthurs mix plate."),

  // BOWL
  make("bowl", "Sheiks Bowl", 115, "From the Sheiks Box range."),

  // SIDES & DIPS
  make("sides", "Pommes Frites", 35, "French fries.", ["vegetarian"]),
  make("sides", "Ketchup", 8, "Dip cup."),
  make("sides", "Mayo", 8, "Dip cup."),
  make("sides", "Chili Dip", 8, "Chili in a cup.", ["spicy"]),

  // DRINKS
  make("drinks", "Coca-Cola", 25, "0.33 l"),
  make("drinks", "Coca-Cola Zero", 25, "0.33 l"),
  make("drinks", "Pepsi Max", 25, "0.33 l"),
  make("drinks", "Fanta", 25, "0.33 l"),
  make("drinks", "Faxe Kondi", 25, "0.33 l"),
  make("drinks", "Gazoz", 25, "0.33 l"),
  make("drinks", "Ayran", 25, "Yoghurt drink, 0.25 l"),
  make("drinks", "Spring Water", 17, "Kildevand, 0.5 l"),

  // KIDS
  make("kids", "Nuggets (6 pcs)", 79, "Served with fries and a dip of your choice."),
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  string,
  Category
>;

export const info = {
  name: "Sheik Shawarma Nørrebro",
  street: "Nørrebrogade 98",
  city: "2200 København N",
  // TODO: confirm — Wolt lists +45 52 78 28 15 as a second number.
  phone: "+45 42 37 71 77",
  phoneHref: "tel:+4542377177",
  links: {
    wolt: "https://wolt.com/en/dnk/copenhagen/restaurant/sheik-shawarma-nrrebro",
    facebook: "https://www.facebook.com/sheik.shawarma.cph/",
    maps: "https://www.google.com/maps/search/?api=1&query=Sheik+Shawarma+N%C3%B8rrebrogade+98+K%C3%B8benhavn",
  },
};

// Opening hours, Monday → Sunday. Close times past midnight are given as 24h + hour.
// Source: Tripadvisor / Dagens Menu listings. Hours may change.
export const hours: { day: string; open: number; close: number }[] = [
  { day: "Monday", open: 10.5, close: 26.5 },
  { day: "Tuesday", open: 10.5, close: 26.5 },
  { day: "Wednesday", open: 10.5, close: 26.5 },
  { day: "Thursday", open: 10.5, close: 27.5 },
  { day: "Friday", open: 10.5, close: 28.5 },
  { day: "Saturday", open: 10.5, close: 28.5 },
  { day: "Sunday", open: 10.5, close: 26 },
];
