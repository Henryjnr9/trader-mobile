// ============================================================================
// FILE: src/app/trade/index.tsx
// DESCRIPTION: Complete Buy / Trade Screen with exact active card layout (224px),
//              auto-scrolling wallet balance, and tap-outside dismiss behavior.
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
    price: 342.18,
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

// ----------------------------------------------------------------------------
// VECTOR SVG COMPONENTS (Exact Figma Code)
// ----------------------------------------------------------------------------
function USFlagIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_219_2672)">
        <Path
          d="M23.63 4.66665C23.168 3.87265 22.318 3.33331 21.3333 3.33331H12V4.66665H23.63ZM0 16.6666H24V18H0V16.6666ZM12 11.3333H24V12.6666H12V11.3333ZM12 8.66665H24V9.99998H12V8.66665ZM0 14H24V15.3333H0V14ZM2.66667 20.6666H21.3333C22.318 20.6666 23.168 20.1273 23.63 19.3333H0.37C0.832 20.1273 1.682 20.6666 2.66667 20.6666ZM12 5.99998H24V7.33331H12V5.99998Z"
          fill="#B22334"
        />
        <Path
          d="M0.0453333 18.4527C0.0564444 18.5149 0.0695556 18.5765 0.0846667 18.6374C0.102444 18.704 0.122889 18.7698 0.146 18.8347C0.205333 19.0074 0.277333 19.174 0.368 19.33L0.37 19.3334H23.63L23.6313 19.3307C23.7217 19.174 23.7958 19.0084 23.8527 18.8367C23.8959 18.7114 23.9298 18.583 23.954 18.4527C23.9813 18.306 24 18.1554 24 18H0C0 18.1554 0.0186667 18.3054 0.0453333 18.4527ZM0 15.3334H24V16.6667H0V15.3334ZM0 12.6667V14H24V12.6667H12H0ZM12 10H24V11.3334H12V10ZM12 7.33335H24V8.66669H12V7.33335ZM0.0853333 5.36269C0.102 5.29469 0.125333 5.23002 0.146667 5.16469C0.123664 5.22987 0.103204 5.29592 0.0853333 5.36269ZM12 6.00002H24C24 5.84469 23.9813 5.69402 23.954 5.54669C23.9307 5.41609 23.8966 5.28765 23.852 5.16269C23.7951 4.99023 23.7207 4.82403 23.63 4.66669H12V6.00002Z"
          fill="#EEEEEE"
        />
        <Path
          d="M12 3.33331H2.66667C1.95942 3.33331 1.28115 3.61426 0.781049 4.11436C0.280952 4.61446 0 5.29274 0 5.99998L0 12.6666H12V3.33331Z"
          fill="#3C3B6E"
        />
        <Path
          d="M1.33398 5.15069L1.74598 5.45002L1.58865 5.93335L1.99998 5.63469L2.41198 5.93335L2.25465 5.45002L2.66665 5.15069H2.15732L1.99998 4.66669L1.84332 5.15069H1.33398ZM2.66732 6.48402L3.07932 6.78335L2.92198 7.26669L3.33332 6.96802L3.74532 7.26669L3.58798 6.78335L3.99998 6.48402H3.49065L3.33332 6.00002L3.17665 6.48402H2.66732ZM5.33398 6.48402L5.74598 6.78335L5.58865 7.26669L5.99998 6.96802L6.41198 7.26669L6.25465 6.78335L6.66665 6.48402H6.15732L5.99998 6.00002L5.84332 6.48402H5.33398ZM8.00065 6.48402L8.41265 6.78335L8.25532 7.26669L8.66665 6.96802L9.07865 7.26669L8.92132 6.78335L9.33332 6.48402H8.82398L8.66665 6.00002L8.50998 6.48402H8.00065ZM2.66732 9.15069L3.07932 9.45002L2.92198 9.93335L3.33332 9.63469L3.74532 9.93335L3.58798 9.45002L3.99998 9.15069H3.49065L3.33332 8.66669L3.17665 9.15069H2.66732ZM5.33398 9.15069L5.74598 9.45002L5.58865 9.93335L5.99998 9.63469L6.41198 9.93335L6.25465 9.45002L6.66665 9.15069H6.15732L5.99998 8.66669L5.84332 9.15069H5.33398ZM8.00065 9.15069L8.41265 9.45002L8.25532 9.93335L8.66665 9.63469L9.07865 9.93335L8.92132 9.45002L9.33332 9.15069H8.82398L8.66665 8.66669L8.50998 9.15069H8.00065ZM4.00065 5.15069L4.41265 5.45002L4.25532 5.93335L4.66665 5.63469L5.07865 5.93335L4.92132 5.45002L5.33332 5.15069H4.82398L4.66665 4.66669L4.50998 5.15069H4.00065ZM6.66732 5.15069L7.07932 5.45002L6.92198 5.93335L7.33332 5.63469L7.74532 5.93335L7.58798 5.45002L7.99998 5.15069H7.49065L7.33332 4.66669L7.17665 5.15069H6.66732ZM9.33398 5.15069L9.74598 5.45002L9.58865 5.93335L9.99998 5.63469L10.412 5.93335L10.2547 5.45002L10.6667 5.15069H10.1573L9.99998 4.66669L9.84332 5.15069H9.33398ZM1.33398 7.81735L1.74598 8.11669L1.58865 8.60002L1.99998 8.30135L2.41198 8.60002L2.25465 8.11669L2.66665 7.81735H2.15732L1.99998 7.33335L1.84332 7.81735H1.33398ZM4.25532 8.60002L4.66665 8.30135L5.07865 8.60002L4.92132 8.11669L5.33332 7.81735H4.82398L4.66665 7.33335L4.50998 7.81735H4.00065L4.41265 8.11669L4.25532 8.60002ZM6.66732 7.81735L7.07932 8.11669L6.92198 8.60002L7.33332 8.30135L7.74532 8.60002L7.58798 8.11669L7.99998 7.81735H7.49065L7.33332 7.33335L7.17665 7.81735H6.66732ZM9.33398 7.81735L9.74598 8.11669L9.58865 8.60002L9.99998 8.30135L10.412 8.60002L10.2547 8.11669L10.6667 7.81735H10.1573L9.99998 7.33335L9.84332 7.81735H9.33398ZM1.33398 10.484L1.74598 10.7834L1.58865 11.2667L1.99998 10.968L2.41198 11.2667L2.25465 10.7834L2.66665 10.484H2.15732L1.99998 10L1.84332 10.484H1.33398ZM4.25532 11.2667L4.66665 10.968L5.07865 11.2667L4.92132 10.7834L5.33332 10.484H4.82398L4.66665 10L4.50998 10.484H4.00065L4.41265 10.7834L4.25532 11.2667ZM6.66732 10.484L7.07932 10.7834L6.92198 11.2667L7.33332 10.968L7.74532 11.2667L7.58798 10.7834L7.99998 10.484H7.49065L7.33332 10L7.17665 10.484H6.66732ZM9.33398 10.484L9.74598 10.7834L9.58865 11.2667L9.99998 10.968L10.412 11.2667L10.2547 10.7834L10.6667 10.484H10.1573L9.99998 10L9.84332 10.484H9.33398Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_219_2672">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function ChevronIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.2594 7.00631L8.53237 12.9103C9.15055 13.4921 10.1148 13.4921 10.733 12.9103L17.006 7.00631C17.3288 6.70246 17.3442 6.19444 17.0404 5.87161C16.7365 5.54878 16.2285 5.53338 15.9057 5.83722L9.63269 11.7412L3.35972 5.83722C3.03688 5.53338 2.52886 5.54877 2.22502 5.87161C1.92117 6.19444 1.93657 6.70246 2.2594 7.00631Z"
        fill="#2C2C2C"
      />
    </Svg>
  );
}

export default function TradeIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const { action = "buy", ticker = "TSLAx" } = useLocalSearchParams<{
    action?: string;
    ticker?: string;
  }>();

  const cleanTicker = ticker
    ? Array.isArray(ticker)
      ? ticker[0]
      : ticker
    : "TSLAx";
  const assetInfo = ASSET_PRICES[cleanTicker] ?? ASSET_PRICES["TSLAx"];

  const [amountStr, setAmountStr] = useState<string>("");
  const [isKeypadVisible, setIsKeypadVisible] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

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

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const numericAmount = parseFloat(amountStr) || 0;
  const hasAmount = numericAmount > 0;
  const tokenEquivalent =
    numericAmount > 0 ? (numericAmount / assetInfo.price).toFixed(8) : "0";

  // Open keypad, adjust layout, and scroll wallet balance off-screen
  const openKeypad = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsKeypadVisible(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 72, animated: true });
    }, 50);
  };

  // Close keypad, restore layout to origin, and scroll back to top
  const closeKeypad = () => {
    if (!isKeypadVisible) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsKeypadVisible(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setAmountStr((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "*") {
      if (!amountStr.includes(".")) {
        setAmountStr((prev) => (prev === "" ? "0." : prev + "."));
      }
      return;
    }
    if (amountStr.length >= 8) return;
    if (amountStr === "0") {
      setAmountStr(key);
    } else {
      setAmountStr((prev) => prev + key);
    }
  };

  const handleQuickChip = (val: string) => {
    setAmountStr(val);
    openKeypad();
  };

  const isBuy = action.toLowerCase() === "buy";

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
      {/* 1. FIXED HEADER CONTAINER                                          */}
      {/* ================================================================== */}
      <View
        style={[
          styles.fixedHeaderContainer,
          { paddingTop: insets.top > 0 ? insets.top + 8 : 51 },
        ]}
      >
        <View style={styles.headerInnerRow}>
          <Pressable style={styles.headerIdentityGroup} onPress={closeKeypad}>
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
          </Pressable>

          <TouchableOpacity
            style={styles.closeIconContainer}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Text style={styles.closeIconText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================================================================== */}
      {/* 2. BODY CONTAINER                                                  */}
      {/* ================================================================== */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Tap area to dismiss keypad if open */}
        <Pressable
          style={{ width: "100%" }}
          onPress={() => {
            if (isKeypadVisible) closeKeypad();
          }}
        >
          {/* Wallet Balance Container (Scrolls off the screen automatically) */}
          <View style={styles.walletBalanceContainer}>
            <Text style={styles.walletBalanceText}>Wallet Balance</Text>
            <Text style={styles.walletFigureText}>$2,840.50</Text>
          </View>

          {/* ============================================================== */}
          {/* 3. CARD: MONEY INPUT + CHANGE NETWORK                          */}
          {/* ============================================================== */}
          <View style={styles.cardWrapper}>
            {/* Money Input Container (Exact 224px height when active) */}
            <TouchableOpacity
              style={
                isKeypadVisible
                  ? styles.moneyInputContainerActive
                  : styles.moneyInputContainerInitial
              }
              activeOpacity={1}
              onPress={() => {
                if (!isKeypadVisible) openKeypad();
              }}
            >
              {/* Change Currency Container */}
              <View style={styles.changeCurrencyContainer}>
                <USFlagIcon />
                <Text style={styles.currencyText}>USD</Text>
              </View>

              {/* Money Input Display */}
              <View style={styles.amountDisplayGroup}>
                <View style={styles.amountDisplayRow}>
                  <Text
                    style={styles.moneyInputText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {amountStr === "" ? "$0.00" : `$${amountStr}`}
                  </Text>
                  {isKeypadVisible && cursorVisible && (
                    <View style={styles.amountCursor} />
                  )}
                </View>

                {/* Token Amount Counter (Exact Figma Specs: #0D1519, 16px, 800) */}
                {isKeypadVisible && (
                  <Text style={styles.calculatedTokenText}>
                    {tokenEquivalent} {cleanTicker}
                  </Text>
                )}
              </View>

              {/* State A: Quick Add Chips (Initial State) */}
              {!isKeypadVisible ? (
                <View style={styles.quickAddContainer}>
                  {["100", "300", "1000"].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={styles.quickInputBtn}
                      activeOpacity={0.8}
                      onPress={() => handleQuickChip(val)}
                    >
                      <Text style={styles.quickInputText}>${val}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ height: 2 }} />
              )}
            </TouchableOpacity>

            {/* Change Network Section */}
            <View style={styles.changeNetworkSection}>
              <TouchableOpacity
                style={styles.networkContainer}
                activeOpacity={0.7}
              >
                <View style={styles.networkLogo}>
                  <Image
                    source={require("../../../assets/logos/eth.png")}
                    style={styles.networkLogoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.networkText}>ETH</Text>
                <ChevronIcon />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>

        {/* ================================================================ */}
        {/* 4. CUSTOM NUMPAD (338px × 268px, 15px gap below)                 */}
        {/* ================================================================ */}
        {isKeypadVisible && (
          <View style={styles.keypadContainer}>
            {[
              ["1", "2", "3"],
              ["4", "5", "6"],
              ["7", "8", "9"],
              ["*", "0", "backspace"],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.keypadBtn}
                    activeOpacity={0.6}
                    onPress={() => handleKeyPress(key)}
                  >
                    {key === "backspace" ? (
                      <Text style={styles.backspaceIcon}>‹</Text>
                    ) : (
                      <Text style={styles.keypadBtnText}>{key}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ================================================================== */}
      {/* 5. REVIEW TRADE BUTTON CONTAINER (Fixed at Bottom)                 */}
      {/* ================================================================== */}
      <View
        style={[
          styles.reviewTradeContainer,
          {
            paddingBottom: Math.max(insets.bottom, 24),
            height: insets.bottom > 0 ? 92 + insets.bottom - 16 : 92,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            hasAmount ? styles.actionButtonActive : styles.actionButtonDisabled,
          ]}
          activeOpacity={hasAmount ? 0.8 : 1}
          disabled={!hasAmount}
          onPress={() => {
            router.push({
              pathname: "/trade/summary",
              params: {
                action,
                ticker: cleanTicker,
                amount: amountStr,
                tokenAmount: tokenEquivalent,
                price: assetInfo.price.toString(),
              },
            });
          }}
        >
          <Text style={styles.actionButtonText}>Review Trade</Text>
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

  // 1. FIXED HEADER
  fixedHeaderContainer: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
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
    alignSelf: "stretch",
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

  // 2. BODY CONTAINER
  scrollView: {
    flex: 1,
  },
  bodyContainer: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: 8,
  },

  // Wallet Balance Container
  walletBalanceContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  walletBalanceText: {
    color: "#747474",
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  walletFigureText: {
    color: "#7839CD",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16,
    lineHeight: 19.2,
  },

  // 3. CARD CONTAINER
  cardWrapper: {
    alignSelf: "stretch",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 10,
  },

  // Initial State (Origin)
  moneyInputContainerInitial: {
    display: "flex",
    height: 419.249,
    paddingVertical: 19.265,
    paddingHorizontal: 28.898,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    alignSelf: "stretch",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#F7F1FF",
  },

  // Active Keypad State (Exact Figma Specs: 224px)
  moneyInputContainerActive: {
    display: "flex",
    height: 224,
    paddingVertical: 19.265,
    paddingHorizontal: 28.898,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#F7F1FF",
  },

  // Change currency container
  changeCurrencyContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 12.041,
    borderRadius: 28.898,
    backgroundColor: "#ECDFFF",
  },
  currencyText: {
    color: "#000000",
    fontFamily: "Sora_700Bold",
    fontSize: 16.857,
  },

  // Money input text (Exact Specs: 64px, 800, line-height 92.8px, letter-spacing: -2.56px)
  amountDisplayGroup: {
    alignItems: "center",
    justifyContent: "center",
  },
  amountDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  moneyInputText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 64,
    lineHeight: 92.8,
    letterSpacing: -2.56,
  },
  amountCursor: {
    width: 3.5,
    height: 54,
    backgroundColor: "#7839CD",
    borderRadius: 2,
    marginLeft: 3,
  },

  // Token Amount Counter (Exact Specs: #0D1519, 16px, 800, line-height 19.2px)
  calculatedTokenText: {
    color: "#0D1519",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "center",
    marginTop: 2,
  },

  // Quick Add Container
  quickAddContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    justifyContent: "center",
  },
  quickInputBtn: {
    display: "flex",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickInputText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 23.2,
    letterSpacing: -0.16,
  },

  // Change network section
  changeNetworkSection: {
    display: "flex",
    paddingVertical: 18,
    paddingHorizontal: 28.898,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#F9F9F9",
  },
  networkContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10.837,
    paddingHorizontal: 20.469,
    justifyContent: "center",
    alignItems: "center",
    gap: 12.041,
    borderRadius: 28.898,
    backgroundColor: "#EFEFEF",
  },
  networkLogo: {
    width: 23.546,
    height: 23.546,
    borderRadius: 23.546 / 2,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  networkLogoImage: {
    width: "100%",
    height: "100%",
  },
  networkText: {
    color: "#2C2C2C",
    fontFamily: "Sora_700Bold",
    fontSize: 16.857,
  },

  // 4. CUSTOM NUMPAD (Exact Specs: 338px × 268px, 15px gap below)
  keypadContainer: {
    display: "flex",
    width: 338,
    height: 268,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 11,
    alignSelf: "center",
    marginBottom: 15,
  },
  keypadRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    flex: 1,
  },
  keypadBtn: {
    flex: 1,
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#F6F6F7",
    justifyContent: "center",
    alignItems: "center",
  },
  keypadBtnText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 22,
    color: "#000000",
  },
  backspaceIcon: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000000",
  },

  // 5. REVIEW TRADE BUTTON CONTAINER
  reviewTradeContainer: {
    display: "flex",
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    height: 92,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 4.72,
    borderBottomRightRadius: 4.72,
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    width: "100%",
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonActive: {
    backgroundColor: "#7839CD",
  },
  actionButtonDisabled: {
    backgroundColor: "#E2D2FD",
  },
  actionButtonText: {
    fontFamily: "Sora_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
