// ============================================================================
// FILE: src/components/ui/Icon.tsx
// DESCRIPTION: Universal Icon Adapter using Hugeicons.
// ============================================================================

import React from "react";
import { ViewStyle, StyleProp } from "react-native";

// Hugeicons stroke rounded icons
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Home01Icon,
  Search01Icon,
  Briefcase01Icon,
  UserIcon,
  Notification01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  StarIcon,
  Wallet01Icon,
  ArrowUpRight01Icon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons";

// 1. Semantic icon names used across the app
export type IconName =
  | "home"
  | "explore"
  | "portfolio"
  | "profile"
  | "bell"
  | "eye"
  | "eye-off"
  | "wallet"
  | "withdraw"
  | "trending-up"
  | "star";

// 2. Mapping semantic names to Hugeicons
const ICON_MAP: Record<IconName, any> = {
  home: Home01Icon,
  explore: Search01Icon,
  portfolio: Briefcase01Icon,
  profile: UserIcon,
  bell: Notification01Icon,
  eye: ViewIcon,
  "eye-off": ViewOffSlashIcon,
  wallet: Wallet01Icon,
  withdraw: ArrowUpRight01Icon,
  "trending-up": Analytics01Icon,
  star: StarIcon,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 24,
  color = "#1E1E1E",
  strokeWidth = 1.8,
  style,
}: IconProps) {
  const TargetIcon = ICON_MAP[name];

  if (!TargetIcon) {
    return null;
  }

  return (
    <HugeiconsIcon
      icon={TargetIcon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}
