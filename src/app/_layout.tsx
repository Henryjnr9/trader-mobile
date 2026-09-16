// ============================================================================
// FILE: src/app/_layout.tsx
// DESCRIPTION: Clean Expo Router SDK 56+ layout (No @react-navigation dependencies)
// ============================================================================

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PortfolioProvider } from "../context/PortfolioContext";

export default function RootLayout() {
  return (
    <PortfolioProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        {/* 1. Main Screens */}
        <Stack.Screen name="index" options={{ animation: "none" }} />
        <Stack.Screen name="explore" options={{ animation: "none" }} />
        <Stack.Screen name="portfolio" options={{ animation: "none" }} />

        {/* 2. Stock Detail View */}
        <Stack.Screen
          name="stock/[id]"
          options={{ animation: "slide_from_right" }}
        />

        {/* 3. Trading Flow */}
        <Stack.Screen
          name="trade/index"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="trade/summary"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="trade/completed"
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </PortfolioProvider>
  );
}
