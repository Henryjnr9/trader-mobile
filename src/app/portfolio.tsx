// ============================================================================
// FILE: src/app/portfolio.tsx
// DESCRIPTION: Complete Portfolio Screen matching Figma specs with balance toggle,
//              segmented tabs (All / History), and interactive asset holdings.
// ============================================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Rect } from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

// Universal Components
import { Icon } from "../components/ui/Icon";
import { BottomNav } from "../components/ui/BottomNav";

// ----------------------------------------------------------------------------
// PORTFOLIO HOLDINGS DATA
// ----------------------------------------------------------------------------
const HOLDINGS_DATA = [
  {
    id: "1",
    ticker: "TSLAx",
    price: "$342.18",
    name: "Tesla Tokenized Stock",
    holding: "7.25 TSLAx",
    change: "+2.58%",
    isPositive: true,
    logo: require("../../assets/logos/tsla.png"),
  },
];

// ----------------------------------------------------------------------------
// VECTOR ICONS (PnL Badge & Wallets)
// ----------------------------------------------------------------------------
function PnlChartIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20" fill="none">
      <Rect width={20} height={20} rx={4} fill="#0D9900" />
      <Path
        d="M4 14L8 9.5L11.5 12.5L16 6.5"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 6.5H16V9.5"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DepositWalletIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 14h.01"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M9 11v6M6 14h6"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function WithdrawWalletIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 14h.01"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M6 14h6M9 11l-3 3 3 3"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function PortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "History">("All");

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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top + 10 : 40,
            paddingBottom: 140,
          },
        ]}
      >
        {/* ================================================================== */}
        {/* 1. TOP HEADER ROW                                                  */}
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
        {/* 2. PORTFOLIO HERO CARD                                             */}
        {/* ================================================================== */}
        <View style={styles.heroCard}>
          {/* Wallet Address Pill */}
          <View style={styles.walletPill}>
            <Text style={styles.walletText}>Wallet Address:</Text>
            <Text style={styles.walletBold}>0x......</Text>
          </View>

          {/* Portfolio Balance Block */}
          <View style={styles.portfolioBlock}>
            <Text style={styles.portfolioLabel}>Portfolio Value:</Text>

            <View style={styles.balanceRow}>
              <Text
                style={[
                  styles.balanceValue,
                  { color: isBalanceVisible ? "#000000" : "#949494" },
                ]}
              >
                {isBalanceVisible ? "$2,840.50" : "*** ***"}
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

            {/* PnL Indicator */}
            <View style={styles.pnlRow}>
              <PnlChartIcon />
              <Text style={styles.pnlText}>
                PnL:{" "}
                <Text style={styles.pnlValue}>
                  {isBalanceVisible ? "+2.58%" : "***"}
                </Text>
              </Text>
            </View>
          </View>

          {/* Action Buttons: Deposit & Withdraw */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
              <DepositWalletIcon />
              <Text style={styles.actionBtnText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
              <WithdrawWalletIcon />
              <Text style={styles.actionBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================== */}
        {/* 3. PORTFOLIO SECTION HEADER                                        */}
        {/* ================================================================== */}
        <Text style={styles.sectionTitle}>Portfolio</Text>

        {/* ================================================================== */}
        {/* 4. SEGMENTED TABS (All / History)                                  */}
        {/* ================================================================== */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === "All" && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab("All")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "All" && styles.segmentTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === "History" && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab("History")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "History" && styles.segmentTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================== */}
        {/* 5. HOLDINGS LIST / HISTORY TAB CONTENT                             */}
        {/* ================================================================== */}
        {activeTab === "All" ? (
          <View style={styles.holdingsContainer}>
            {HOLDINGS_DATA.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.holdingCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/stock/[id]",
                    params: { id: item.ticker },
                  })
                }
              >
                {/* Left Side: Avatar & Identity */}
                <View style={styles.holdingLeft}>
                  <View style={styles.logoWrapper}>
                    <Image
                      source={item.logo}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.holdingInfoCol}>
                    <Text style={styles.holdingTitleText}>
                      {item.ticker}({item.price})
                    </Text>
                    <Text style={styles.holdingSubtitleText} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </View>

                {/* Right Side: Holdings Amount & Change */}
                <View style={styles.holdingRight}>
                  <Text style={styles.holdingAmountText}>{item.holding}</Text>
                  <Text style={styles.holdingChangeText}>{item.change}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* Trade History Empty State */
          <View style={styles.emptyHistoryCard}>
            <Text style={styles.emptyHistoryText}>No past trade history</Text>
          </View>
        )}
      </ScrollView>

      {/* 6. FIXED BOTTOM NAVIGATION */}
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

  // 1. Header Row
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

  // 2. Hero Card
  heroCard: {
    backgroundColor: "#F7F1FF",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    alignSelf: "stretch",
    marginBottom: 32,
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
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 2,
  },
  pnlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  pnlText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    color: "#000000",
    lineHeight: 16.8,
  },
  pnlValue: {
    color: "#0D9900",
    fontFamily: "Sora_700Bold",
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
  },
  actionBtn: {
    flex: 1,
    height: 49,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 24,
    backgroundColor: "#7839CD",
  },
  actionBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 14,
  },

  // 3. Section Title
  sectionTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
    marginBottom: 16,
  },

  // 4. Segmented Tabs
  segmentedControl: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    padding: 6,
    borderRadius: 24,
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 15,
    lineHeight: 18,
    color: "#747474",
  },
  segmentTextActive: {
    color: "#000000",
    fontFamily: "Sora_700Bold",
  },

  // 5. Holdings Card
  holdingsContainer: {
    width: "100%",
    gap: 12,
  },
  holdingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FAF9FC",
  },
  holdingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  holdingInfoCol: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  holdingTitleText: {
    color: "#000000",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  holdingSubtitleText: {
    color: "#747474",
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 16,
  },
  holdingRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  holdingAmountText: {
    color: "#000000",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "right",
  },
  holdingChangeText: {
    color: "#0D9900",
    fontFamily: "Sora_700Bold",
    fontSize: 15,
    lineHeight: 18,
    textAlign: "right",
  },

  // Empty State
  emptyHistoryCard: {
    padding: 32,
    borderRadius: 20,
    backgroundColor: "#FAF9FC",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHistoryText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    color: "#949494",
  },
});
