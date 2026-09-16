// ============================================================================
// FILE: src/components/ui/BottomNav.tsx
// ============================================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { Icon, IconName } from "./Icon";

export type TabKey = "home" | "explore" | "portfolio" | "profile";

interface TabItemConfig {
  key: TabKey;
  label: string;
  iconName: IconName;
  route: string;
}

const TABS: TabItemConfig[] = [
  { key: "home", label: "Home", iconName: "home", route: "/" },
  { key: "explore", label: "Explore", iconName: "explore", route: "/explore" },
  {
    key: "portfolio",
    label: "Portfolio",
    iconName: "portfolio",
    route: "/portfolio",
  },
  { key: "profile", label: "Profile", iconName: "profile", route: "/" },
];

export function BottomNav() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = (): TabKey => {
    if (pathname === "/explore") return "explore";
    if (pathname === "/portfolio") return "portfolio";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {TABS.map((tab) => {
        const isSelected = activeTab === tab.key;
        const color = isSelected ? "#1E1E1E" : "#B5B5B5";

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => router.push(tab.route as any)}
          >
            {/* Universal Icon Component */}
            <Icon name={tab.iconName} size={24} color={color} />

            <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#F0F0F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 6,
  },
  tabLabel: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 12,
    lineHeight: 14.4,
    textAlign: "center",
  },
});
