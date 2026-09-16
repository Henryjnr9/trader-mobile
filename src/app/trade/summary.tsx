// ============================================================================
// FILE: src/app/trade/summary.tsx
// DESCRIPTION: Trade Summary / Review Screen with native slide-down close.
// ============================================================================
import { usePortfolio } from "../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

// ----------------------------------------------------------------------------
// ASSET PRICING DATABASE
// ----------------------------------------------------------------------------
const ASSET_PRICES: Record<
  string,
  { name: string; subtitle: string; price: number; logo: any }
> = {
  TSLAx: {
    name: "Tesla Tokenized Stock",
    subtitle: "Tesla Tokenized...",
    price: 342.52,
    logo: require("../../../assets/logos/tsla.png"),
  },
  AAPL: {
    name: "Apple Tokenized Stock",
    subtitle: "Apple Tokenized...",
    price: 224.5,
    logo: require("../../../assets/logos/aapl.png"),
  },
  NVDAx: {
    name: "Nvidia Tokenized Stock",
    subtitle: "Nvidia Tokenized...",
    price: 128.2,
    logo: require("../../../assets/logos/nvda.png"),
  },
  MSFT: {
    name: "Microsoft Tokenized Stock",
    subtitle: "Microsoft Tokenized...",
    price: 442.2,
    logo: require("../../../assets/logos/msft.png"),
  },
  GOOG: {
    name: "Alphabet Tokenized Stock",
    subtitle: "Google Tokenized...",
    price: 175.4,
    logo: require("../../../assets/logos/goog.png"),
  },
  AMZN: {
    name: "Amazon Tokenized Stock",
    subtitle: "Amazon Tokenized...",
    price: 186.5,
    logo: require("../../../assets/logos/amzn.png"),
  },
  $PEPE: {
    name: "Pepe Meme Token",
    subtitle: "Pepe Meme Token...",
    price: 0.0000118,
    logo: require("../../../assets/logos/pepe.png"),
  },
  $DOGE: {
    name: "Dogecoin",
    subtitle: "Dogecoin...",
    price: 0.142,
    logo: require("../../../assets/logos/doge.png"),
  },
};

export default function TradeSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addTrade } = usePortfolio();
  const {
    action = "buy",
    ticker = "TSLAx",
    amount = "2",
    tokenAmount = "0.00584488",
    price = "342.52",
  } = useLocalSearchParams<{
    action?: string;
    ticker?: string;
    amount?: string;
    tokenAmount?: string;
    price?: string;
  }>();

  const cleanTicker = ticker
    ? Array.isArray(ticker)
      ? ticker[0]
      : ticker
    : "TSLAx";
  const assetInfo = ASSET_PRICES[cleanTicker] ?? ASSET_PRICES["TSLAx"];

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bouncy entrance spring animation
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, []);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  // Format amount (e.g., $2.00)
  const formattedUsd = parseFloat(amount || "2").toFixed(2);

  // Format execution price (e.g., $342.52)
  const executionPrice = parseFloat(
    price || assetInfo.price.toString(),
  ).toFixed(2);

  // Format truncated quantity: "0.0058...TSLAx"
  const formatQuantity = (qty: string, tkr: string) => {
    const parts = qty.split(".");
    if (parts.length > 1 && parts[1].length > 4) {
      return `${parts[0]}.${parts[1].slice(0, 4)}...${tkr}`;
    }
    return `${qty} ${tkr}`;
  };

  const isBuy = action.toLowerCase() === "buy";

  // ==========================================================================
  // FLOW 1: CLOSE (✕) -> Slides DOWN back to the trade input screen
  // ==========================================================================
  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: "/trade",
        params: {
          action,
          ticker: cleanTicker,
          amount: formattedUsd,
        },
      });
    }
  };

  // ==========================================================================
  // FLOW 2: CONFIRM TRADE -> Directs to completed screen
  // ==========================================================================
  const handleConfirmTrade = () => {
    setIsSubmitting(true);

    // 1. Record the purchase into your live portfolio state
    addTrade({
      ticker: cleanTicker,
      name: assetInfo.name,
      amountUsd: parseFloat(formattedUsd),
      tokenAmount: parseFloat(tokenAmount),
      price: parseFloat(executionPrice),
      action: isBuy ? "buy" : "sell",
      logo: assetInfo.logo,
    });

    // 2. Direct to the completed screen
    setTimeout(() => {
      setIsSubmitting(false);
      router.push({
        pathname: "/trade/completed",
        params: {
          action,
          ticker: cleanTicker,
          amount: formattedUsd,
          tokenAmount,
          price: executionPrice,
        },
      });
    }, 800);
  };

  return (
    <Animated.View
      style={[
        styles.root,
        {
          opacity: bounceAnim,
          transform: [
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [22, 0],
              }),
            },
            {
              scale: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
          ],
        },
      ]}
    >
      {/* ================================================================== */}
      {/* 1. FIXED TOP HEADER                                                */}
      {/* ================================================================== */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top > 0 ? insets.top + 8 : 51 },
        ]}
      >
        <View style={styles.headerInnerRow}>
          {/* Identity Group */}
          <View style={styles.headerIdentityGroup}>
            <View style={styles.headerLogoWrapper}>
              <Image
                source={assetInfo.logo}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>
                {isBuy ? "Buy" : "Sell"} {cleanTicker}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {assetInfo.subtitle}
              </Text>
            </View>
          </View>

          {/* Close Icon Button (Triggers slide-down pop) */}
          <TouchableOpacity
            style={styles.closeIconContainer}
            activeOpacity={0.7}
            onPress={handleClose}
          >
            <Text style={styles.closeIconText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================================================================== */}
      {/* 2. BODY CONTENT (40px spacing from header)                         */}
      {/* ================================================================== */}
      <View style={styles.body}>
        {/* Main Summary Card */}
        <View style={styles.summaryCard}>
          {/* Top Token Pill (ETH) */}
          <View style={styles.tokenPill}>
            <View style={styles.ethIconWrapper}>
              <Svg width={14} height={14} viewBox="0 0 784.37 1277.39">
                <Path
                  d="M392.07 0L383.5 29.11V874.74L392.07 883.29L784.13 651.54L392.07 0Z"
                  fill="#627EEA"
                />
                <Path
                  d="M392.07 0L0 651.54L392.07 883.29V472.33V0Z"
                  fill="#627EEA"
                />
                <Path
                  d="M392.07 956.52L387.24 962.41V1263.29L392.07 1277.38L784.37 724.89L392.07 956.52Z"
                  fill="#627EEA"
                />
                <Path
                  d="M392.07 1277.38V956.52L0 724.89L392.07 1277.38Z"
                  fill="#627EEA"
                />
              </Svg>
            </View>
            <Text style={styles.tokenPillText}>ETH</Text>
          </View>

          {/* Breakdown Rows */}
          <View style={styles.rowsContainer}>
            {/* Row 1: You're buying */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>You're buying</Text>
              <Text style={styles.rowValue}>
                ${formattedUsd} {cleanTicker}
              </Text>
            </View>

            {/* Row 2: Estimated price */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Estimated price</Text>
              <Text style={styles.rowValue}>${executionPrice}</Text>
            </View>

            {/* Row 3: Estimated quantity */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Estimated quantity</Text>
              <Text style={styles.rowValue}>
                {formatQuantity(tokenAmount, cleanTicker)}
              </Text>
            </View>

            {/* Row 4: Estimated fee */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Estimated fee</Text>
              <Text style={styles.rowValue}>$0.01</Text>
            </View>

            {/* Row 5: Price impact */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Price impact</Text>
              <Text style={styles.rowValue}>0.00%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ================================================================== */}
      {/* 3. FIXED BOTTOM CONFIRM BUTTON                                     */}
      {/* ================================================================== */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: Math.max(insets.bottom, 24),
            height: insets.bottom > 0 ? 92 + insets.bottom - 16 : 92,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          disabled={isSubmitting}
          onPress={handleConfirmTrade}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Trade</Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // 1. Header
  headerContainer: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingBottom: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  headerInnerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIdentityGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerLogo: {
    width: 26,
    height: 26,
  },
  headerTextCol: {
    justifyContent: "center",
  },
  headerTitle: {
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  headerSubtitle: {
    color: "#4A4A4A",
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },
  closeIconContainer: {
    padding: 7.2,
    borderRadius: 30.6,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
  closeIconText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },

  // 2. Body (40px spacing between header and card)
  body: {
    flex: 1,
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  summaryCard: {
    borderRadius: 24,
    backgroundColor: "#F9F8FA",
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  tokenPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#EFEFEF",
    marginBottom: 36,
  },
  ethIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenPillText: {
    color: "#2C2C2C",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 20,
  },
  rowsContainer: {
    width: "100%",
    gap: 22,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rowLabel: {
    color: "#747474",
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 20,
  },
  rowValue: {
    color: "#000000",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "right",
  },

  // 3. Fixed Bottom Confirm Button
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  confirmButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7839CD",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
  },
});
