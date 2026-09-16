// ============================================================================
// FILE: src/app/trade/completed.tsx
// DESCRIPTION: Trade Executed Screen with dynamic asset execution pricing.
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

// ----------------------------------------------------------------------------
// ASSET PRICING DATABASE (Fallback lookup if price isn't passed)
// ----------------------------------------------------------------------------
const ASSET_PRICES: Record<string, { price: number }> = {
  TSLAx: { price: 342.52 },
  AAPL: { price: 224.5 },
  NVDAx: { price: 128.2 },
  MSFT: { price: 442.2 },
  GOOG: { price: 175.4 },
  AMZN: { price: 186.5 },
  $PEPE: { price: 0.0000118 },
  $DOGE: { price: 0.142 },
};

// ----------------------------------------------------------------------------
// LOOPING ANIMATED CHECKMARK MICROINTERACTION
// ----------------------------------------------------------------------------
function SuccessCheckmark() {
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 50;
  const CHECK_LENGTH = 60;

  const [ringProgress, setRingProgress] = useState(0);
  const [checkProgress, setCheckProgress] = useState(0);

  const popAnim = useRef(new Animated.Value(0.85)).current;
  const loopFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;
    let animFrameId: number;
    let loopTimeout: NodeJS.Timeout;

    const runCycle = () => {
      if (!isMounted) return;

      setRingProgress(0);
      setCheckProgress(0);
      loopFadeAnim.setValue(1);

      popAnim.setValue(0.85);
      Animated.spring(popAnim, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }).start();

      const ringDuration = 480;
      const checkDuration = 340;
      const startTime = Date.now();

      const tick = () => {
        if (!isMounted) return;
        const now = Date.now();
        const elapsed = now - startTime;

        const ringP = Math.min(elapsed / ringDuration, 1);
        setRingProgress(1 - Math.pow(1 - ringP, 3));

        const checkElapsed = Math.max(0, elapsed - 180);
        const checkP = Math.min(checkElapsed / checkDuration, 1);
        setCheckProgress(1 - Math.pow(1 - checkP, 3));

        if (ringP < 1 || checkP < 1) {
          animFrameId = requestAnimationFrame(tick);
        } else {
          loopTimeout = setTimeout(() => {
            if (!isMounted) return;
            Animated.timing(loopFadeAnim, {
              toValue: 0,
              duration: 260,
              useNativeDriver: true,
            }).start(() => {
              if (isMounted) runCycle();
            });
          }, 1800);
        }
      };

      animFrameId = requestAnimationFrame(tick);
    };

    runCycle();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameId);
      clearTimeout(loopTimeout);
    };
  }, []);

  const ringOffset = CIRCLE_CIRCUMFERENCE * (1 - ringProgress);
  const checkOffset = CHECK_LENGTH * (1 - checkProgress);

  return (
    <Animated.View
      style={{
        opacity: loopFadeAnim,
        transform: [{ scale: popAnim }],
      }}
    >
      <Svg width={116} height={116} viewBox="0 0 116 116" fill="none">
        <Circle
          cx={58}
          cy={58}
          r={50}
          stroke="#00A825"
          strokeWidth={9}
          strokeDasharray={`${CIRCLE_CIRCUMFERENCE}, ${CIRCLE_CIRCUMFERENCE}`}
          strokeDashoffset={ringOffset}
          originX="58"
          originY="58"
          rotation="-90"
          strokeLinecap="round"
        />
        <Path
          d="M38 58L51 71L78 44"
          stroke="#00A825"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${CHECK_LENGTH}, ${CHECK_LENGTH}`}
          strokeDashoffset={checkOffset}
        />
      </Svg>
    </Animated.View>
  );
}

function EthLogo() {
  return (
    <Svg width={14} height={14} viewBox="0 0 784.37 1277.39">
      <Path
        d="M392.07 0L383.5 29.11V874.74L392.07 883.29L784.13 651.54L392.07 0Z"
        fill="#627EEA"
      />
      <Path d="M392.07 0L0 651.54L392.07 883.29V472.33V0Z" fill="#627EEA" />
      <Path
        d="M392.07 956.52L387.24 962.41V1263.29L392.07 1277.38L784.37 724.89L392.07 956.52Z"
        fill="#627EEA"
      />
      <Path
        d="M392.07 1277.38V956.52L0 724.89L392.07 1277.38Z"
        fill="#627EEA"
      />
    </Svg>
  );
}

function LinkChainIcon() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7839CD"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

export default function TradeCompletedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    action = "buy",
    ticker = "TSLAx",
    amount = "2.00",
    tokenAmount = "0.00584488",
    price, // Dynamic execution price from summary
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

  // Resolve dynamic market execution price
  const rawPrice = price
    ? parseFloat(price)
    : (ASSET_PRICES[cleanTicker]?.price ?? 0);

  const formattedExecutionPrice =
    rawPrice < 0.01
      ? rawPrice.toFixed(8)
      : rawPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formattedUsd = parseFloat(amount || "2").toFixed(2);
  const isBuy = action.toLowerCase() === "buy";

  const screenFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenFade, {
      toValue: 1,
      duration: 250,
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

  const handleDone = () => {
    router.replace("/portfolio");
  };

  return (
    <Animated.View
      style={[
        styles.root,
        {
          paddingTop: insets.top > 0 ? insets.top + 24 : 50,
          paddingBottom: Math.max(insets.bottom, 24),
          opacity: screenFade,
        },
      ]}
    >
      <View style={styles.content}>
        {/* 1. Looping Animated Checkmark Microinteraction */}
        <View style={styles.iconContainer}>
          <SuccessCheckmark />
        </View>

        {/* 2. Headline & Subtitle */}
        <Text style={styles.headline}>
          {isBuy ? "Buy executed" : "Sell executed"}
        </Text>
        <Text style={styles.subheadline}>
          {isBuy
            ? `You bought $${formattedUsd} of ${cleanTicker}`
            : `You sold $${formattedUsd} of ${cleanTicker}`}
        </Text>

        {/* 3. Receipt Details Card */}
        <View style={styles.card}>
          {/* ETH Badge */}
          <View style={styles.tokenPill}>
            <View style={styles.ethIconWrapper}>
              <EthLogo />
            </View>
            <Text style={styles.tokenPillText}>ETH</Text>
          </View>

          {/* Breakdown Rows */}
          <View style={styles.rowsContainer}>
            {/* Dynamic Execution price */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Execution price</Text>
              <Text style={styles.rowValue}>${formattedExecutionPrice}</Text>
            </View>

            {/* Quantity */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Quantity</Text>
              <Text style={styles.rowValue}>
                {tokenAmount} {cleanTicker}
              </Text>
            </View>

            {/* Fee */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Fee</Text>
              <Text style={styles.rowValue}>$0.01</Text>
            </View>

            {/* Status */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status</Text>
              <Text style={styles.statusCompleted}>Completed</Text>
            </View>

            {/* Transaction Link */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Transaction</Text>
              <TouchableOpacity style={styles.txHashRow} activeOpacity={0.7}>
                <Text style={styles.txHashText}>Oxf......dAdef368</Text>
                <LinkChainIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Fixed Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.doneButton}
          activeOpacity={0.8}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  content: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  headline: {
    fontFamily: "Sora_800ExtraBold",
    fontSize: 26,
    lineHeight: 32,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  subheadline: {
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 20,
    color: "#747474",
    textAlign: "center",
    marginBottom: 36,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FAF9FC",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  tokenPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginBottom: 28,
  },
  ethIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenPillText: {
    color: "#2C2C2C",
    fontFamily: "Sora_700Bold",
    fontSize: 15,
    lineHeight: 18,
  },
  rowsContainer: {
    width: "100%",
    gap: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rowLabel: {
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 20,
    color: "#747474",
  },
  rowValue: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    textAlign: "right",
  },
  statusCompleted: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#00A825",
    textAlign: "right",
  },
  txHashRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  txHashText: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#7839CD",
  },
  bottomContainer: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  doneButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7839CD",
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
