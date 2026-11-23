// Shop settings, edited in /admin/settings (saved to lib/settings.json via GitHub).
import raw from "./settings.json";

export type Settings = {
  shopName: string;
  legalName: string; // person's name (sole trader) or registered company name
  email: string;
  phone: string;
  address: string; // multi-line
  companyNumber: string;
  vatNumber: string;
  deliveryFee: number; // pence
  freeDeliveryOver: number; // pence; 0 = never free
  deliveryTime: string;
  dispatchTime: string;
  returnsDays: number; // at least 14 by law
  returnPostagePaidBy: "customer" | "us";
};

export const settings = raw as unknown as Settings;

// Shows "[ADD IN ADMIN]" anywhere a required detail is still blank.
export const orTodo = (v: string) => (v && v.trim() ? v : "[add in Admin → Settings]");

export const sellerName = () => orTodo(settings.legalName);
export const tradingAs = () =>
  settings.legalName && settings.legalName.toLowerCase() !== settings.shopName.toLowerCase()
    ? `${settings.legalName}, trading as ${settings.shopName}`
    : settings.shopName;
