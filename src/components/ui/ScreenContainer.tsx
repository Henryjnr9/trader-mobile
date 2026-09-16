// ============================================================================
// FILE: src/components/ui/ScreenContainer.tsx
// DESCRIPTION: Universal screen wrapper that automatically applies:
//  - 24px horizontal margin to phone edges
//  - Top Safe Area clearance (Dynamic Island / iPhone notch)
//  - Bottom navigation clearance
//  - Smooth scrolling behavior
// ============================================================================

import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LAYOUT } from "../../constants/layout";

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withBottomNav?: boolean; // Set to true if screen has the fixed bottom nav
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  scrollable = true,
  withBottomNav = true,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const baseContentStyle = [
    styles.scrollContent,
    {
      paddingTop: insets.top + 10,
      paddingHorizontal: LAYOUT.screenPadding, // 📌 24px everywhere
      paddingBottom: withBottomNav
        ? LAYOUT.bottomNavClearance
        : insets.bottom + 24,
    },
    contentContainerStyle,
  ];

  // If a screen doesn't need scrolling (e.g. simple success screen)
  if (!scrollable) {
    return (
      <View style={[styles.container, baseContentStyle, style]}>
        {children}
      </View>
    );
  }

  // Default: Smooth scrollable container with 24px margins
  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={baseContentStyle}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        alwaysBounceVertical={true}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
