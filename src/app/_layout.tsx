// ============================================================================
// FILE: src/app/_layout.tsx
// DESCRIPTION: Clean Expo Router SDK 56+ layout (No @react-navigation dependencies)
// ============================================================================

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        {/* 1. Main Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="portfolio" />

        {/* 2. Stock Detail View */}
        <Stack.Screen
          name="stock/[id]"
          options={{
            animation: "slide_from_right",
          }}
        />

        {/* 3. Trading Flow */}
        <Stack.Screen
          name="trade/index"
          options={{
            presentation: "modal", // Native iOS rubber-band spring sheet
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="trade/summary"
          options={{
            animation: "slide_from_bottom", // Opens as a bottom-to-top drawer
          }}
        />
        <Stack.Screen
          name="trade/completed"
          options={{
            presentation: "fullScreenModal",
            animation: "fade_from_bottom",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
