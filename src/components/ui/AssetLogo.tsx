// ============================================================================
// FILE: src/components/ui/AssetLogo.tsx
// DESCRIPTION: Resilient logo component with automatic network retry & monogram fallback.
// ============================================================================

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface AssetLogoProps {
  uri?: string;
  ticker: string;
  size?: number;
}

export function AssetLogo({ uri, ticker, size = 36 }: AssetLogoProps) {
  const [hasError, setHasError] = useState(false);

  // If URL fails or is missing, show a clean monogram badge (e.g., "T" for TSLAx)
  if (hasError || !uri) {
    return (
      <View
        style={[
          styles.fallbackContainer,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={[styles.fallbackText, { fontSize: size * 0.42 }]}>
          {ticker.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: size * 0.7, height: size * 0.7 }}
        contentFit="contain"
        transition={200}
        onError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  fallbackContainer: {
    backgroundColor: "#F3EEFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  fallbackText: {
    fontFamily: "Sora_700Bold",
    color: "#7839CD",
  },
});
