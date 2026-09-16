// ============================================================================
// FILE: src/app/index.tsx
// DESCRIPTION: Main Home Screen for Investo with clickable asset navigation,
//              updated Daily Movers, filled star SVG, and Dynamic Island trend
//              notifications.
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { useRouter } from "expo-router";

// Universal Icon Adapter & BottomNav
import { Icon } from "../components/ui/Icon";
import { BottomNav } from "../components/ui/BottomNav";

// ----------------------------------------------------------------------------
// TRADING TREND COLORS
// ----------------------------------------------------------------------------
const BULLISH_COLOR = "#16A34A"; // Green for positive gains (+)
const BEARISH_COLOR = "#DC2626"; // Red for downward dips (-)

// ----------------------------------------------------------------------------
// 1. DATA: DAILY MOVERS (Updated with Names & Prices matching Reference)
// ----------------------------------------------------------------------------
const DAILY_MOVERS = [
  {
    id: "1",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: "442.20",
    change: "0.56%",
    isPositive: true,
    logo: require("../../assets/logos/msft.png"),
  },
  {
    id: "2",
    ticker: "GOOG",
    name: "Alphabet Inc.",
    price: "175.40",
    change: "0.89%",
    isPositive: true,
    logo: require("../../assets/logos/goog.png"),
  },
  {
    id: "3",
    ticker: "AAPL",
    name: "Apple Inc.",
    price: "224.50",
    change: "1.37%",
    isPositive: false,
    logo: require("../../assets/logos/aapl.png"),
  },
  {
    id: "4",
    ticker: "TSLAx",
    name: "Tesla Tokenized Stock",
    price: "342.18",
    change: "2.58%",
    isPositive: true,
    logo: require("../../assets/logos/tsla.png"),
  },
  {
    id: "5",
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    price: "186.50",
    change: "3.12%",
    isPositive: true,
    logo: require("../../assets/logos/amzn.png"),
  },
  {
    id: "6",
    ticker: "NVDAx",
    name: "Nvidia Tokenized Stock",
    price: "128.20",
    change: "4.12%",
    isPositive: true,
    logo: require("../../assets/logos/nvda.png"),
  },
];

// ----------------------------------------------------------------------------
// 2. DATA: WORTH WATCHING (Tokenized Stocks & Viral Memes)
// ----------------------------------------------------------------------------
const WATCHLIST_ITEMS = [
  {
    id: "1",
    ticker: "TSLAx",
    name: "Tesla Tokenized Stock",
    change: "+2.58%",
    logo: require("../../assets/logos/tsla.png"),
  },
  {
    id: "2",
    ticker: "$PEPE",
    name: "Pepe Meme Token",
    change: "+14.82%",
    logo: require("../../assets/logos/pepe.png"),
  },
  {
    id: "3",
    ticker: "NVDAx",
    name: "Nvidia Tokenized Stock",
    change: "+4.12%",
    logo: require("../../assets/logos/nvda.png"),
  },
  {
    id: "4",
    ticker: "$DOGE",
    name: "Dogecoin",
    change: "+6.45%",
    logo: require("../../assets/logos/doge.png"),
  },
  {
    id: "5",
    ticker: "AAPL",
    name: "Apple Tokenized Stock",
    change: "-1.37%",
    logo: require("../../assets/logos/aapl.png"),
  },
];

// ----------------------------------------------------------------------------
// EXACT FIGMA FILLED STAR SVG COMPONENT
// ----------------------------------------------------------------------------
function FilledStarIcon() {
  return (
    <Svg width={20} height={19} viewBox="0 0 20 19" fill="none">
      <Path
        d="M11.7311 0.951053C10.9335 -0.317018 9.06651 -0.317018 8.26894 0.951054L6.34006 4.0178C6.05944 4.46396 5.61365 4.78413 5.09769 4.91009L1.55115 5.77584C0.0846865 6.13382 -0.492241 7.88907 0.481293 9.03076L2.83572 11.7919C3.17825 12.1936 3.34853 12.7116 3.31026 13.2356L3.04726 16.8374C2.93851 18.3268 4.44893 19.4116 5.84818 18.8491L9.23217 17.4888C9.72448 17.2909 10.2755 17.2909 10.7678 17.4888L14.1518 18.8491C15.5511 19.4116 17.0615 18.3268 16.9527 16.8374L16.6897 13.2356C16.6515 12.7116 16.8218 12.1936 17.1643 11.7919L19.5187 9.03076C20.4922 7.88907 19.9153 6.13382 18.4489 5.77584L14.9023 4.91009C14.3864 4.78413 13.9406 4.46396 13.6599 4.0178L11.7311 0.951053Z"
        fill="#7839CD"
      />
    </Svg>
  );
}

interface IslandData {
  ticker: string;
  name: string;
  change: string;
  isPositive: boolean;
  logo: any;
  action: "added" | "removed";
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": true,
  });

  // Dynamic Island notification state & animation
  const [islandData, setIslandData] = useState<IslandData | null>(null);
  const islandAnim = useRef(new Animated.Value(0)).current;
  const islandTimer = useRef<NodeJS.Timeout | null>(null);

  // Portfolio PnL configuration
  const [portfolioPnl] = useState({
    amount: "+$3,420.50",
    isPositive: true,
  });

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7839CD" />
      </View>
    );
  }

  // Trigger Dynamic Island Notification
  const triggerDynamicIsland = (
    item: (typeof WATCHLIST_ITEMS)[0],
    willBeFav: boolean,
  ) => {
    if (islandTimer.current) clearTimeout(islandTimer.current);

    const isPositive = !item.change.startsWith("-");
    setIslandData({
      ticker: item.ticker,
      name: item.name,
      change: item.change,
      isPositive,
      logo: item.logo,
      action: willBeFav ? "added" : "removed",
    });

    // Spring entrance from Island
    Animated.spring(islandAnim, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Auto-retract back into island after 3.6s
    islandTimer.current = setTimeout(() => {
      dismissIsland();
    }, 3600);
  };

  const dismissIsland = () => {
    Animated.timing(islandAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIslandData(null);
    });
  };

  const handleToggleFavorite = (item: (typeof WATCHLIST_ITEMS)[0]) => {
    const willBeFav = !favorites[item.id];
    setFavorites((prev) => ({ ...prev, [item.id]: willBeFav }));
    triggerDynamicIsland(item, willBeFav);
  };

  const pnlColor = portfolioPnl.isPositive ? BULLISH_COLOR : BEARISH_COLOR;

  // Dynamic Island transform animations
  const islandTranslateY = islandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });
  const islandScale = islandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1],
  });
  const islandOpacity = islandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <View style={styles.container}>
      {/* ================================================================== */}
      {/* DYNAMIC ISLAND NOTIFICATION CAPSULE                                */}
      {/* ================================================================== */}
      {islandData && (
        <Animated.View
          style={[
            styles.dynamicIslandWrapper,
            {
              top: insets.top > 0 ? insets.top + 4 : 12,
              opacity: islandOpacity,
              transform: [
                { translateY: islandTranslateY },
                { scale: islandScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.dynamicIslandCapsule}
            activeOpacity={0.9}
            onPress={dismissIsland}
          >
            {/* Left Column: Logo + Ticker + Status */}
            <View style={styles.islandLeft}>
              <View style={styles.islandLogoWrapper}>
                <Image
                  source={islandData.logo}
                  style={styles.islandLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.islandTextGroup}>
                <Text style={styles.islandTickerText}>{islandData.ticker}</Text>
                <Text style={styles.islandSubtext}>
                  {islandData.action === "added"
                    ? "Tracking in Watchlist"
                    : "Removed from Watchlist"}
                </Text>
              </View>
            </View>

            {/* Right Column: Trend Badge */}
            <View
              style={[
                styles.islandTrendPill,
                {
                  backgroundColor: islandData.isPositive
                    ? "rgba(13, 153, 0, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                },
              ]}
            >
              <Text
                style={[
                  styles.islandTrendChange,
                  {
                    color: islandData.isPositive ? "#4ADE80" : "#F87171",
                  },
                ]}
              >
                {islandData.isPositive ? "▲" : "▼"} {islandData.change}
              </Text>
              <Text style={styles.islandTrendLabel}>
                {islandData.isPositive ? "Trending Up" : "Trending Down"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        alwaysBounceVertical={true}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 10,
            paddingBottom: 160,
          },
        ]}
      >
        {/* ================================================================== */}
        {/* 3. HEADER ROW                                                     */}
        {/* ================================================================== */}
        <View style={styles.headerRow}>
          <Text style={styles.appTitle}>Investo</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.7}
            >
              <Icon name="bell" size={16} color="#000000" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.networkBtn} activeOpacity={0.7}>
              <Image
                source={require("../../assets/logos/eth.png")}
                style={styles.networkLogo}
                resizeMode="contain"
              />
              <Text style={styles.networkText}>Ethereum</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================== */}
        {/* MAIN SECTIONS WRAPPER                                              */}
        {/* ================================================================== */}
        <View style={styles.mainSectionsWrapper}>
          {/* ================================================================ */}
          {/* 4. PORTFOLIO OVERVIEW (HERO CARD)                                */}
          {/* ================================================================ */}
          <View style={styles.heroCard}>
            <View style={styles.walletPill}>
              <Text style={styles.walletText}>Wallet Address:</Text>
              <Text style={styles.walletBold}>0x......</Text>
            </View>

            <View style={styles.portfolioBlock}>
              <Text style={styles.portfolioLabel}>Portfolio Value</Text>

              <View style={styles.balanceRow}>
                <Text
                  style={[
                    styles.balanceValue,
                    { color: isBalanceVisible ? "#000000" : "#949494" },
                  ]}
                >
                  {isBalanceVisible ? "$42,690.00" : "*** ***"}
                </Text>

                <TouchableOpacity
                  onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                  style={styles.eyeBtn}
                  activeOpacity={0.6}
                >
                  <Icon
                    name={isBalanceVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>

              {/* Dynamic PnL Row */}
              <View style={styles.pnlRow}>
                <Icon
                  name="trending-up"
                  size={20}
                  color={pnlColor}
                  style={
                    !portfolioPnl.isPositive
                      ? { transform: [{ rotate: "90deg" }] }
                      : undefined
                  }
                />
                <Text style={[styles.pnlText, { color: pnlColor }]}>
                  PnL: {isBalanceVisible ? portfolioPnl.amount : "***.**"}
                </Text>
              </View>
            </View>

            <View style={styles.cardActionsRow}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                <Icon name="wallet" size={24} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Deposit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                <Icon name="withdraw" size={24} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================================================ */}
          {/* 5. DAILY MOVERS SECTION (Updated to Match Reference Stock Cards) */}
          {/* ================================================================ */}
          <View style={styles.dailyMoversSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionSubtitle}>Stay on top</Text>
                <Text style={styles.sectionTitle}>Daily Movers</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {/* List of Stock Cards (Middle Screen Reference Design) */}
            <View style={styles.dailyMoversList}>
              {DAILY_MOVERS.map((item) => {
                const trendColor = item.isPositive
                  ? BULLISH_COLOR
                  : BEARISH_COLOR;
                const arrow = item.isPositive ? "▲" : "▼";

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.stockItemRow}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: "/stock/[id]",
                        params: { id: item.ticker },
                      })
                    }
                  >
                    {/* 1. Left Circular Logo */}
                    <View style={styles.stockItemLogoWrapper}>
                      <Image
                        source={item.logo}
                        style={styles.stockItemLogo}
                        resizeMode="contain"
                      />
                    </View>

                    {/* 2. Middle Column: Ticker & Company Name */}
                    <View style={styles.stockItemInfo}>
                      <Text style={styles.stockItemTicker} numberOfLines={1}>
                        {item.ticker}
                      </Text>
                      <Text style={styles.stockItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    {/* 3. Right Column: Price & Change Indicator */}
                    <View style={styles.stockItemPriceCol}>
                      <Text style={styles.stockItemPrice}>${item.price}</Text>
                      <View style={styles.stockItemChangeRow}>
                        <Text
                          style={[styles.stockItemArrow, { color: trendColor }]}
                        >
                          {arrow}
                        </Text>
                        <Text
                          style={[
                            styles.stockItemChange,
                            { color: trendColor },
                          ]}
                        >
                          {item.change}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================================================================ */}
          {/* 6. WORTH WATCHING SECTION (Clickable Cards with Filled Star)     */}
          {/* ================================================================ */}
          <View style={styles.worthWatchingSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionSubtitle}>Discover what's</Text>
                <Text style={styles.sectionTitle}>Worth watching</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardsScroll}
            >
              {WATCHLIST_ITEMS.map((item) => {
                const isFav = favorites[item.id];
                const isPositive = !item.change.startsWith("-");
                const trendColor = isPositive ? BULLISH_COLOR : BEARISH_COLOR;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.stockCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: "/stock/[id]",
                        params: { id: item.ticker },
                      })
                    }
                  >
                    <View style={styles.stockCardTopRow}>
                      <View style={styles.stockCardLogoWrapper}>
                        <Image
                          source={item.logo}
                          style={styles.stockCardLogo}
                          resizeMode="contain"
                        />
                      </View>

                      {/* Favorite Toggle Button */}
                      <TouchableOpacity
                        onPress={() => handleToggleFavorite(item)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        {isFav ? (
                          <FilledStarIcon />
                        ) : (
                          <Icon name="star" size={20} color="#A1A1AA" />
                        )}
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.cardHeaderText}>{item.ticker}</Text>

                    <Text style={styles.cardTokenName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Text
                      style={[styles.cardChangeText, { color: trendColor }]}
                      numberOfLines={1}
                    >
                      {item.change}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* 7. FIXED BOTTOM NAVIGATION */}
      <BottomNav />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },

  // Dynamic Island Notification Capsule
  dynamicIslandWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: "center",
  },
  dynamicIslandCapsule: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#000000",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  islandLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  islandLogoWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  islandLogo: {
    width: 20,
    height: 20,
  },
  islandTextGroup: {
    flexDirection: "column",
  },
  islandTickerText: {
    color: "#FFFFFF",
    fontFamily: "Sora_700Bold",
    fontSize: 13,
    lineHeight: 16,
  },
  islandSubtext: {
    color: "#94A3B8",
    fontFamily: "Sora_400Regular",
    fontSize: 11,
    lineHeight: 14,
  },
  islandTrendPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignItems: "flex-end",
    gap: 1,
  },
  islandTrendChange: {
    fontFamily: "Sora_700Bold",
    fontSize: 12,
    lineHeight: 15,
  },
  islandTrendLabel: {
    color: "#CBD5E1",
    fontFamily: "Sora_400Regular",
    fontSize: 9,
    lineHeight: 11,
  },

  // Header Styles
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontFamily: "Sora_600SemiBold",
    color: "#000000",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notificationBtn: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  networkBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
  },
  networkLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  networkText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    lineHeight: 16.8,
  },

  // Main Sections Wrapper
  mainSectionsWrapper: {
    width: "100%",
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 36,
  },

  // Portfolio Hero Card
  heroCard: {
    backgroundColor: "#F7F1FF",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    alignSelf: "stretch",
  },
  walletPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 19,
    borderRadius: 16,
    backgroundColor: "#ECDFFF",
  },
  walletText: {
    color: "#4A4A4A",
    textAlign: "center",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },
  walletBold: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    lineHeight: 16.8,
  },
  portfolioBlock: {
    alignItems: "center",
    gap: 4,
    alignSelf: "stretch",
  },
  portfolioLabel: {
    color: "#4A4A4A",
    textAlign: "center",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
  },
  balanceValue: {
    fontFamily: "Sora_800ExtraBold",
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 1,
  },
  eyeBtn: {
    padding: 2,
  },
  pnlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pnlText: {
    textAlign: "center",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
  },
  actionBtn: {
    flex: 1,
    height: 49,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 24,
    backgroundColor: "#7839CD",
  },
  actionBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 14,
    includeFontPadding: false,
  },

  // --------------------------------------------------------------------------
  // DAILY MOVERS: STOCK CARDS (Matching Reference Design)
  // --------------------------------------------------------------------------
  dailyMoversSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    alignSelf: "stretch",
  },
  dailyMoversList: {
    alignSelf: "stretch",
  },
  stockItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    alignSelf: "stretch",
  },
  stockItemLogoWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  stockItemLogo: {
    width: 24,
    height: 24,
  },
  stockItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  stockItemTicker: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 2,
  },
  stockItemName: {
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    color: "#71717A",
  },
  stockItemPriceCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  stockItemPrice: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 2,
  },
  stockItemChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  stockItemArrow: {
    fontSize: 9,
  },
  stockItemChange: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 13,
  },

  // Worth Watching Section
  worthWatchingSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    alignSelf: "stretch",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  sectionSubtitle: {
    alignSelf: "stretch",
    color: "#4A4A4A",
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },
  sectionTitle: {
    alignSelf: "stretch",
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  seeAllText: {
    color: "#7839CD",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },

  // Worth Watching Stock Cards
  horizontalCardsScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 10,
  },
  stockCard: {
    width: 197,
    padding: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F9F5FF",
    backgroundColor: "#FDFBFF",
  },
  stockCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  stockCardLogoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  stockCardLogo: {
    width: 26,
    height: 26,
  },
  cardHeaderText: {
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  cardTokenName: {
    alignSelf: "stretch",
    color: "#4A4A4A",
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },
  cardChangeText: {
    alignSelf: "stretch",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },
});
