import {
  Home,
  Car,
  TrendingUp,
  Gem,
  Wallet,
  PiggyBank,
  Briefcase,
  Laptop,
  Watch,
  Package,
  CreditCard,
  GraduationCap,
  Landmark,
  Banknote,
} from "lucide-react";

const ASSET_ICONS = {
  Property: Home,
  Vehicle: Car,
  Investment: TrendingUp,
  Gold: Gem,
  Cash: Wallet,
  Savings: PiggyBank,
  Business: Briefcase,
  Electronics: Laptop,
  Collectibles: Watch,
  Other: Package,
};

const LIABILITY_ICONS = {
  "Home loan": Home,
  "Vehicle loan": Car,
  "Education loan": GraduationCap,
  "Personal loan": Banknote,
  "Credit card": CreditCard,
  "Business loan": Briefcase,
  Mortgage: Landmark,
  "Other debt": Package,
};

export function assetIcon(category) {
  return ASSET_ICONS[category] ?? Package;
}

export function liabilityIcon(category) {
  return LIABILITY_ICONS[category] ?? Package;
}

export const GOLD_CATEGORIES = ["Gold", "Collectibles", "Business"];
