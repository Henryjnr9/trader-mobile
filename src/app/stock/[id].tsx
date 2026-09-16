// ============================================================================
// FILE: src/app/stock/[id].tsx
// DESCRIPTION: Complete Stock Information Screen with Dynamic Assets,
//              Interactive Borderless Chart with Left Y-Axis Pricing,
//              Filled Star Interaction, 8px Table Spacing, 2D Link Icon & Tabs.
// ============================================================================

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Path,
  Line,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  TSpan,
} from "react-native-svg";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { Icon } from "../../components/ui/Icon";

// Chart Dimensions (Full 340px Width, Borderless Design)
const CHART_WIDTH = 340;
const CHART_HEIGHT = 217;
const PAD_TOP = 24;
const PAD_BOTTOM = 14;
const PLOT_HEIGHT = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
const BASELINE_Y = PAD_TOP + PLOT_HEIGHT;

type TimeframeKey = "H" | "D" | "W" | "M" | "6M" | "1Y" | "5Y";
const TIMEFRAMES: TimeframeKey[] = ["H", "D", "W", "M", "6M", "1Y", "5Y"];
type TabType = "About" | "Information" | "History";

interface TimeframeMetric {
  price: string;
  change: string;
  isPositive: boolean;
  points: number[];
}

interface AssetProfile {
  ticker: string;
  name: string;
  subtitle: string;
  logo: any;
  holding: number;
  isMicroPrice?: boolean;

  riskLevel: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  riskTextColor: string;
  riskBgColor: string;

  timeframes: Record<TimeframeKey, TimeframeMetric>;

  about: {
    description: string;
    assetType: string;
    underlying: string;
    backing: string;
    trading: string;
    ownershipRights: string;
    contractAddress: string;
  };

  information: {
    liquidity: "Low" | "Medium" | "High" | "Very High";
    tradingHours: string;
    tradingFee: string;
    priceSource: string;
    volume24h: string;
    marketCap: string;
  };
}

// ----------------------------------------------------------------------------
// ASSET DATABASE
// ----------------------------------------------------------------------------
const ASSET_DATABASE: Record<string, AssetProfile> = {
  TSLAx: {
    ticker: "TSLAx",
    name: "Tesla Tokenized Stock",
    subtitle: "Tesla Tokenized...",
    logo: require("../../../assets/logos/tsla.png"),
    holding: 7.25,
    riskLevel: "MEDIUM RISK",
    riskTextColor: "#CA8A04",
    riskBgColor: "#FEF9C3",
    timeframes: {
      H: {
        price: "$342.18",
        change: "+0.45%",
        isPositive: true,
        points: [340, 341.2, 340.8, 341.5, 341.0, 341.9, 342.18],
      },
      D: {
        price: "$342.18",
        change: "+1.28%",
        isPositive: true,
        points: [337, 339, 338.5, 341, 339.5, 340.8, 342.18],
      },
      W: {
        price: "$342.18",
        change: "+2.58%",
        isPositive: true,
        points: [
          333, 345, 330, 335, 342, 328, 344, 342, 348, 338, 340, 336, 342.18,
        ],
      },
      M: {
        price: "$342.18",
        change: "-3.85%",
        isPositive: false,
        points: [358, 355, 351, 348, 349, 342, 344, 338, 339, 342.18],
      },
      "6M": {
        price: "$342.18",
        change: "+18.40%",
        isPositive: true,
        points: [285, 290, 305, 298, 312, 318, 325, 330, 338, 342.18],
      },
      "1Y": {
        price: "$342.18",
        change: "+42.10%",
        isPositive: true,
        points: [238, 250, 265, 255, 280, 295, 310, 325, 335, 342.18],
      },
      "5Y": {
        price: "$342.18",
        change: "+184.50%",
        isPositive: true,
        points: [115, 140, 165, 150, 210, 245, 230, 290, 320, 342.18],
      },
    },
    about: {
      description:
        "Tokenized exposure to Tesla. Each token represents a claim on Tesla common stock held by a custodian.",
      assetType: "Tokenized equity",
      underlying: "Tesla (TSLA)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Limited / No di...",
      contractAddress: "Oxf......dAdef368",
    },
    information: {
      liquidity: "Medium",
      tradingHours: "24/7",
      tradingFee: "0.50%",
      priceSource: "Aggregate market feed",
      volume24h: "$45.00M",
      marketCap: "$1.08T",
    },
  },

  AAPL: {
    ticker: "AAPL",
    name: "Apple Tokenized Stock",
    subtitle: "Apple Tokenized...",
    logo: require("../../../assets/logos/aapl.png"),
    holding: 15.0,
    riskLevel: "LOW RISK",
    riskTextColor: "#16A34A",
    riskBgColor: "#DCFCE7",
    timeframes: {
      H: {
        price: "$224.50",
        change: "-0.15%",
        isPositive: false,
        points: [225, 224.8, 224.6, 224.7, 224.5],
      },
      D: {
        price: "$224.50",
        change: "-1.37%",
        isPositive: false,
        points: [227, 226.5, 225.8, 225.0, 224.5],
      },
      W: {
        price: "$224.50",
        change: "+1.05%",
        isPositive: true,
        points: [221, 223, 222, 224, 223.5, 224.5],
      },
      M: {
        price: "$224.50",
        change: "+4.20%",
        isPositive: true,
        points: [215, 218, 220, 219, 222, 224.5],
      },
      "6M": {
        price: "$224.50",
        change: "+16.80%",
        isPositive: true,
        points: [192, 198, 205, 210, 218, 224.5],
      },
      "1Y": {
        price: "$224.50",
        change: "+28.40%",
        isPositive: true,
        points: [175, 182, 190, 200, 215, 224.5],
      },
      "5Y": {
        price: "$224.50",
        change: "+210.00%",
        isPositive: true,
        points: [72, 95, 130, 160, 195, 224.5],
      },
    },
    about: {
      description:
        "Tokenized real-world shares of Apple Inc. Backed 100% by physical equity held in institutional custody.",
      assetType: "Tokenized equity",
      underlying: "Apple (AAPL)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Economic & dividend claim",
      contractAddress: "0x4A1...99C4",
    },
    information: {
      liquidity: "Very High",
      tradingHours: "24/7",
      tradingFee: "0.25%",
      priceSource: "Chainlink NASDAQ Oracle",
      volume24h: "$128.50M",
      marketCap: "$3.45T",
    },
  },

  NVDAx: {
    ticker: "NVDAx",
    name: "Nvidia Tokenized Stock",
    subtitle: "Nvidia Tokenized...",
    logo: require("../../../assets/logos/nvda.png"),
    holding: 3.4,
    riskLevel: "MEDIUM RISK",
    riskTextColor: "#CA8A04",
    riskBgColor: "#FEF9C3",
    timeframes: {
      H: {
        price: "$128.20",
        change: "+0.80%",
        isPositive: true,
        points: [127, 127.5, 128.0, 127.8, 128.2],
      },
      D: {
        price: "$128.20",
        change: "+4.12%",
        isPositive: true,
        points: [123, 124.5, 126, 125.8, 127.5, 128.2],
      },
      W: {
        price: "$128.20",
        change: "+7.80%",
        isPositive: true,
        points: [118, 120, 123, 125, 126.5, 128.2],
      },
      M: {
        price: "$128.20",
        change: "+14.60%",
        isPositive: true,
        points: [111, 114, 118, 122, 125, 128.2],
      },
      "6M": {
        price: "$128.20",
        change: "+68.50%",
        isPositive: true,
        points: [76, 85, 98, 112, 120, 128.2],
      },
      "1Y": {
        price: "$128.20",
        change: "+164.20%",
        isPositive: true,
        points: [48, 62, 78, 95, 115, 128.2],
      },
      "5Y": {
        price: "$128.20",
        change: "+1240.0%",
        isPositive: true,
        points: [10, 22, 45, 75, 105, 128.2],
      },
    },
    about: {
      description:
        "Digital tokenized representation of Nvidia Corporation. Gives exposure to the premier AI hardware manufacturer.",
      assetType: "Tokenized equity",
      underlying: "Nvidia (NVDA)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Economic exposure",
      contractAddress: "0x89D...E712",
    },
    information: {
      liquidity: "High",
      tradingHours: "24/7",
      tradingFee: "0.35%",
      priceSource: "Aggregate market feed",
      volume24h: "$92.10M",
      marketCap: "$3.15T",
    },
  },

  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Tokenized Stock",
    subtitle: "Microsoft Tokenized...",
    logo: require("../../../assets/logos/msft.png"),
    holding: 0,
    riskLevel: "LOW RISK",
    riskTextColor: "#16A34A",
    riskBgColor: "#DCFCE7",
    timeframes: {
      H: {
        price: "$442.20",
        change: "-0.10%",
        isPositive: false,
        points: [442.6, 442.4, 442.3, 442.2],
      },
      D: {
        price: "$442.20",
        change: "-0.56%",
        isPositive: false,
        points: [444.8, 444.0, 443.2, 442.8, 442.2],
      },
      W: {
        price: "$442.20",
        change: "+0.80%",
        isPositive: true,
        points: [438, 440, 439, 441, 442.2],
      },
      M: {
        price: "$442.20",
        change: "+2.15%",
        isPositive: true,
        points: [432, 435, 438, 440, 442.2],
      },
      "6M": {
        price: "$442.20",
        change: "+11.40%",
        isPositive: true,
        points: [396, 405, 418, 428, 442.2],
      },
      "1Y": {
        price: "$442.20",
        change: "+31.80%",
        isPositive: true,
        points: [335, 355, 380, 410, 442.2],
      },
      "5Y": {
        price: "$442.20",
        change: "+195.00%",
        isPositive: true,
        points: [150, 210, 270, 350, 442.2],
      },
    },
    about: {
      description:
        "Tokenized equity backed by Microsoft Corp common shares. Fully collateralized in real-time by a licensed trust.",
      assetType: "Tokenized equity",
      underlying: "Microsoft (MSFT)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Economic claim",
      contractAddress: "0x11B...CC40",
    },
    information: {
      liquidity: "Very High",
      tradingHours: "24/7",
      tradingFee: "0.25%",
      priceSource: "NASDAQ Oracle",
      volume24h: "$64.30M",
      marketCap: "$3.28T",
    },
  },

  GOOG: {
    ticker: "GOOG",
    name: "Alphabet Tokenized Stock",
    subtitle: "Google Tokenized...",
    logo: require("../../../assets/logos/goog.png"),
    holding: 0,
    riskLevel: "LOW RISK",
    riskTextColor: "#16A34A",
    riskBgColor: "#DCFCE7",
    timeframes: {
      H: {
        price: "$175.40",
        change: "+0.12%",
        isPositive: true,
        points: [175.0, 175.2, 175.3, 175.4],
      },
      D: {
        price: "$175.40",
        change: "+0.89%",
        isPositive: true,
        points: [173.8, 174.2, 174.8, 175.1, 175.4],
      },
      W: {
        price: "$175.40",
        change: "+1.90%",
        isPositive: true,
        points: [171, 172.5, 173, 174.2, 175.4],
      },
      M: {
        price: "$175.40",
        change: "-1.80%",
        isPositive: false,
        points: [179, 178, 176, 174, 175.4],
      },
      "6M": {
        price: "$175.40",
        change: "+24.30%",
        isPositive: true,
        points: [141, 148, 156, 165, 175.4],
      },
      "1Y": {
        price: "$175.40",
        change: "+35.60%",
        isPositive: true,
        points: [129, 138, 150, 162, 175.4],
      },
      "5Y": {
        price: "$175.40",
        change: "+178.00%",
        isPositive: true,
        points: [63, 85, 115, 145, 175.4],
      },
    },
    about: {
      description:
        "Tokenized exposure to Alphabet Inc. Class C shares. Managed with audited custodian collateral.",
      assetType: "Tokenized equity",
      underlying: "Alphabet (GOOG)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Economic exposure",
      contractAddress: "0x66F...EE20",
    },
    information: {
      liquidity: "High",
      tradingHours: "24/7",
      tradingFee: "0.25%",
      priceSource: "NASDAQ Oracle",
      volume24h: "$51.20M",
      marketCap: "$2.18T",
    },
  },

  AMZN: {
    ticker: "AMZN",
    name: "Amazon Tokenized Stock",
    subtitle: "Amazon Tokenized...",
    logo: require("../../../assets/logos/amzn.png"),
    holding: 0,
    riskLevel: "LOW RISK",
    riskTextColor: "#16A34A",
    riskBgColor: "#DCFCE7",
    timeframes: {
      H: {
        price: "$186.50",
        change: "+0.40%",
        isPositive: true,
        points: [185.8, 186.0, 186.2, 186.5],
      },
      D: {
        price: "$186.50",
        change: "+3.12%",
        isPositive: true,
        points: [180.8, 182.5, 184.2, 185.8, 186.5],
      },
      W: {
        price: "$186.50",
        change: "+4.10%",
        isPositive: true,
        points: [179, 181, 183.5, 185, 186.5],
      },
      M: {
        price: "$186.50",
        change: "+6.80%",
        isPositive: true,
        points: [174, 176, 180, 183, 186.5],
      },
      "6M": {
        price: "$186.50",
        change: "+22.50%",
        isPositive: true,
        points: [152, 160, 170, 178, 186.5],
      },
      "1Y": {
        price: "$186.50",
        change: "+41.20%",
        isPositive: true,
        points: [132, 145, 162, 175, 186.5],
      },
      "5Y": {
        price: "$186.50",
        change: "+110.00%",
        isPositive: true,
        points: [88, 110, 135, 160, 186.5],
      },
    },
    about: {
      description:
        "Tokenized equity tracking Amazon.com, Inc. Backed 1:1 by real stock certificates in custodian trust.",
      assetType: "Tokenized equity",
      underlying: "Amazon (AMZN)",
      backing: "100%",
      trading: "24/7",
      ownershipRights: "Economic exposure",
      contractAddress: "0x33C...99AA",
    },
    information: {
      liquidity: "Very High",
      tradingHours: "24/7",
      tradingFee: "0.25%",
      priceSource: "NASDAQ Oracle",
      volume24h: "$72.00M",
      marketCap: "$1.94T",
    },
  },

  $PEPE: {
    ticker: "$PEPE",
    name: "Pepe Meme Token",
    subtitle: "Pepe Meme Token...",
    logo: require("../../../assets/logos/pepe.png"),
    holding: 1500000,
    isMicroPrice: true,
    riskLevel: "HIGH RISK",
    riskTextColor: "#DC2626",
    riskBgColor: "#FEE2E2",
    timeframes: {
      H: {
        price: "$0.00001180",
        change: "+1.85%",
        isPositive: true,
        points: [11.5, 11.6, 11.7, 11.8],
      },
      D: {
        price: "$0.00001180",
        change: "+14.82%",
        isPositive: true,
        points: [10.2, 10.6, 11.1, 11.5, 11.8],
      },
      W: {
        price: "$0.00001180",
        change: "+24.50%",
        isPositive: true,
        points: [9.4, 9.8, 10.5, 11.2, 11.8],
      },
      M: {
        price: "$0.00001180",
        change: "+65.20%",
        isPositive: true,
        points: [7.1, 8.2, 9.5, 10.8, 11.8],
      },
      "6M": {
        price: "$0.00001180",
        change: "+140.00%",
        isPositive: true,
        points: [4.8, 6.2, 8.5, 10.2, 11.8],
      },
      "1Y": {
        price: "$0.00001180",
        change: "+820.00%",
        isPositive: true,
        points: [1.2, 3.5, 6.8, 9.4, 11.8],
      },
      "5Y": {
        price: "$0.00001180",
        change: "+1450.0%",
        isPositive: true,
        points: [0.8, 2.5, 5.5, 8.5, 11.8],
      },
    },
    about: {
      description:
        "Viral cultural meme token on Ethereum. Powered entirely by community sentiment and internet meme culture.",
      assetType: "Community Meme Token",
      underlying: "Decentralized Liquidity",
      backing: "Unbacked / Algorithmic",
      trading: "24/7",
      ownershipRights: "Pure token governance",
      contractAddress: "0x6982...1933",
    },
    information: {
      liquidity: "High",
      tradingHours: "24/7",
      tradingFee: "0.80%",
      priceSource: "Uniswap v3 TWAP",
      volume24h: "$1.45B",
      marketCap: "$4.95B",
    },
  },

  $DOGE: {
    ticker: "$DOGE",
    name: "Dogecoin",
    subtitle: "Dogecoin...",
    logo: require("../../../assets/logos/doge.png"),
    holding: 850,
    riskLevel: "HIGH RISK",
    riskTextColor: "#DC2626",
    riskBgColor: "#FEE2E2",
    timeframes: {
      H: {
        price: "$0.1420",
        change: "+0.35%",
        isPositive: true,
        points: [0.141, 0.1415, 0.1418, 0.142],
      },
      D: {
        price: "$0.1420",
        change: "+6.45%",
        isPositive: true,
        points: [0.133, 0.135, 0.138, 0.14, 0.142],
      },
      W: {
        price: "$0.1420",
        change: "+11.20%",
        isPositive: true,
        points: [0.127, 0.13, 0.134, 0.139, 0.142],
      },
      M: {
        price: "$0.1420",
        change: "-8.40%",
        isPositive: false,
        points: [0.155, 0.15, 0.146, 0.141, 0.142],
      },
      "6M": {
        price: "$0.1420",
        change: "+45.80%",
        isPositive: true,
        points: [0.098, 0.11, 0.125, 0.135, 0.142],
      },
      "1Y": {
        price: "$0.1420",
        change: "+112.50%",
        isPositive: true,
        points: [0.067, 0.085, 0.105, 0.125, 0.142],
      },
      "5Y": {
        price: "$0.1420",
        change: "+3450.0%",
        isPositive: true,
        points: [0.004, 0.045, 0.095, 0.12, 0.142],
      },
    },
    about: {
      description:
        "The original open-source peer-to-peer cryptocurrency favored by Shiba Inus worldwide. Used for tips and digital micropayments.",
      assetType: "Proof-of-Work Meme Currency",
      underlying: "Dogecoin Native Chain",
      backing: "PoW Consensus",
      trading: "24/7",
      ownershipRights: "Bearer asset",
      contractAddress: "Native UTXO Chain",
    },
    information: {
      liquidity: "Very High",
      tradingHours: "24/7",
      tradingFee: "0.40%",
      priceSource: "Global aggregate book",
      volume24h: "$880.00M",
      marketCap: "$20.80B",
    },
  },
};

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

// ----------------------------------------------------------------------------
// SMOOTH BEZIER CURVE GENERATOR (Full 340px Width)
// ----------------------------------------------------------------------------
function generateSmoothCurve(
  points: number[],
  chartWidth: number,
  plotHeight: number,
  padTop: number,
  baselineY: number,
) {
  if (!points || points.length < 2) {
    return {
      path: "",
      areaPath: "",
      coords: [],
      totalLength: 1,
      min: 0,
      max: 0,
      mid: 0,
      start: 0,
    };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const start = points[0];
  const mid = (min + max) / 2;

  const padX = 8;
  const usableWidth = chartWidth - padX * 2;

  const coords = points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * usableWidth,
    y: padTop + plotHeight - ((p - min) / range) * plotHeight,
    val: p,
  }));

  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  let approxLength = 0;

  for (let i = 0; i < coords.length - 1; i++) {
    const current = coords[i];
    const next = coords[i + 1];
    const cpX = (current.x + next.x) / 2;
    path += ` C ${cpX.toFixed(1)} ${current.y.toFixed(1)}, ${cpX.toFixed(1)} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;

    const dx = next.x - current.x;
    const dy = next.y - current.y;
    approxLength += Math.sqrt(dx * dx + dy * dy);
  }

  const first = coords[0];
  const last = coords[coords.length - 1];
  const areaPath = `${path} L ${last.x.toFixed(1)} ${baselineY} L ${first.x.toFixed(1)} ${baselineY} Z`;
  const totalLength = Math.max(approxLength * 1.15, 100);

  return {
    path,
    areaPath,
    coords,
    totalLength,
    min,
    max,
    mid,
    start,
  };
}

// ----------------------------------------------------------------------------
// INTERPOLATE POINT ALONG BEZIER CURVE
// ----------------------------------------------------------------------------
function getPointAtProgress(
  coords: { x: number; y: number; val: number }[],
  t: number,
) {
  if (!coords || coords.length === 0) return { x: 0, y: 0, val: 0 };
  if (coords.length === 1 || t <= 0) return coords[0];
  if (t >= 1) return coords[coords.length - 1];

  const n = coords.length - 1;
  const index = Math.floor(t * n);
  const segT = t * n - index;

  const p0 = coords[Math.min(index, n)];
  const p3 = coords[Math.min(index + 1, n)];
  const cpX = (p0.x + p3.x) / 2;

  const p1 = { x: cpX, y: p0.y };
  const p2 = { x: cpX, y: p3.y };

  const u = 1 - segT;
  const tt = segT * segT;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * segT;

  const x = uuu * p0.x + 3 * uu * segT * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * segT * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y, val: p0.val + (p3.val - p0.val) * segT };
}

// ----------------------------------------------------------------------------
// EXACT FIGMA TABLE GRADIENT DIVIDER COMPONENT
// ----------------------------------------------------------------------------
function TableDivider() {
  return (
    <View style={styles.sec6_dividerWrapper}>
      <Svg width="100%" height={1} viewBox="0 0 309 1" fill="none">
        <Path
          d="M0.5 0.5H308.5"
          stroke="url(#paint0_linear_208_2211)"
          strokeLinecap="round"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_208_2211"
            x1="0.5"
            y1="1"
            x2="308.5"
            y2="1"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#EBEBEB" stopOpacity="0" />
            <Stop offset="0.5" stopColor="#EBEBEB" stopOpacity="1" />
            <Stop offset="1" stopColor="#EBEBEB" stopOpacity="0" />
          </LinearGradient>
        </Defs>
      </Svg>
    </View>
  );
}

export default function StockDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Resolve dynamic asset profile
  const tickerParam = Array.isArray(id) ? id[0] : id;
  const cleanTicker = tickerParam ? decodeURIComponent(tickerParam) : "TSLAx";
  const asset = ASSET_DATABASE[cleanTicker] ?? ASSET_DATABASE["TSLAx"];

  // States
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeKey>("W");
  const [activeTab, setActiveTab] = useState<TabType>("About");
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  // Active Timeframe Metrics
  const activeMetrics =
    asset.timeframes[selectedTimeframe] ?? asset.timeframes["W"];
  const trendColor = activeMetrics.isPositive ? "#26A138" : "#EF4444";

  // Trigger curve draw & trace microinteraction on mount & timeframe changes
  useEffect(() => {
    setAnimProgress(0);
    let startTime: number | null = null;
    const duration = 1200;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setAnimProgress(eased);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cleanTicker, selectedTimeframe]);

  if (!fontsLoaded) return null;

  // Generate Bezier Curve with full 340px Width
  const {
    path: curvePath,
    areaPath,
    coords,
    totalLength,
    min,
    max,
    mid,
    start,
  } = generateSmoothCurve(
    activeMetrics.points,
    CHART_WIDTH,
    PLOT_HEIGHT,
    PAD_TOP,
    BASELINE_Y,
  );

  // Dynamic user holdings formatting
  const formattedHolding =
    asset.holding > 0
      ? asset.holding >= 1000
        ? asset.holding.toLocaleString()
        : asset.holding.toFixed(2)
      : "0";

  // Helper to format prices on Y-Axis
  const formatYPrice = (val: number) => {
    if (asset.isMicroPrice) return `$${(val / 1000000).toFixed(6)}`;
    if (val >= 1000)
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    return `$${val.toFixed(val < 10 ? 2 : 1)}`;
  };

  // Helper to calculate & format growth relative to start price
  const formatGrowth = (val: number, base: number) => {
    if (!base || base === 0) return "0.0%";
    const pct = ((val - base) / base) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  };

  // Position of tracer dot during entrance animation
  const tracerPoint = getPointAtProgress(coords, animProgress);

  // Touch Scrubber calculation
  const isScrubbing = scrubIndex !== null && coords[scrubIndex];
  const activeCoord = isScrubbing ? coords[scrubIndex] : null;
  const displayPrice = isScrubbing
    ? asset.isMicroPrice
      ? `$${(activeCoord!.val / 1000000).toFixed(8)}`
      : `$${activeCoord!.val.toFixed(2)}`
    : activeMetrics.price;

  const handleTouch = (event: any) => {
    const touchX = event.nativeEvent.locationX;
    const closestIndex = coords.reduce((prevIdx, curr, idx) => {
      return Math.abs(curr.x - touchX) < Math.abs(coords[prevIdx].x - touchX)
        ? idx
        : prevIdx;
    }, 0);
    setScrubIndex(closestIndex);
  };

  const strokeOffset = totalLength * (1 - animProgress);

  return (
    <View style={styles.container}>
      {/* ================================================================== */}
      {/* SECTION 1: FIXED TOP NAVIGATION BAR                                */}
      {/* ================================================================== */}
      <View
        style={[
          styles.sec1_fixedHeader,
          { paddingTop: insets.top > 0 ? insets.top + 6 : 45 },
        ]}
      >
        <View style={styles.sec1_innerRow}>
          <View style={styles.sec1_leftGroup}>
            <TouchableOpacity
              style={styles.sec1_backBtn}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Text style={styles.sec1_backIconText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.sec1_identityGroup}>
              <View style={styles.sec1_logoContainer}>
                <Image
                  source={asset.logo}
                  style={styles.sec1_logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.sec1_textColumn}>
                <Text style={styles.sec1_headerText}>{asset.ticker}</Text>
                <Text style={styles.sec1_subHeaderText} numberOfLines={1}>
                  {asset.subtitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Favorite Star Button (With Exact Filled Star Icon) */}
          <TouchableOpacity
            style={styles.sec1_backBtn}
            activeOpacity={0.7}
            onPress={() => setIsFavorite(!isFavorite)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isFavorite ? (
              <FilledStarIcon />
            ) : (
              <Icon name="star" size={20} color="#1E1E1E" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
      >
        {/* ================================================================ */}
        {/* SECTION 2: ASSET HEADER & PRICING                                */}
        {/* ================================================================ */}
        <View style={styles.sec2_container}>
          <View
            style={[
              styles.sec2_riskBadge,
              { backgroundColor: asset.riskBgColor },
            ]}
          >
            <Text
              style={[styles.sec2_riskText, { color: asset.riskTextColor }]}
            >
              {asset.riskLevel}
            </Text>
          </View>

          <Text style={styles.sec2_assetAmount}>
            {formattedHolding} {asset.ticker}
          </Text>

          {asset.holding === 0 && (
            <Text style={styles.sec2_zeroHoldingsPrompt}>
              You don't own any {asset.ticker} yet
            </Text>
          )}

          <View style={styles.sec2_priceContainer}>
            <Text style={styles.sec2_priceText}>{displayPrice}</Text>
            <Text style={[styles.sec2_priceChangeText, { color: trendColor }]}>
              {activeMetrics.change}
            </Text>
          </View>
        </View>

        {/* ================================================================ */}
        {/* 36PX GAP CONTAINER                                               */}
        {/* ================================================================ */}
        <View style={styles.mainSectionsWrapper}>
          {/* 1. GRAPH & TIMELINE GROUP */}
          <View style={styles.graphTimelineGroup}>
            {/* SECTION 3: GRAPH (Borderless with Soft Dashed Reference Lines) */}
            <View
              style={styles.sec3_graphContainer}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleTouch}
              onResponderMove={handleTouch}
              onResponderRelease={() => setScrubIndex(null)}
            >
              <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
                <Defs>
                  <LinearGradient
                    id="stockCurveGradient"
                    x1="51%"
                    y1="0%"
                    x2="49%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor="#26A138" stopOpacity={0.35} />
                    <Stop offset="70.12%" stopColor="#26A138" stopOpacity={0} />
                    <Stop offset="100%" stopColor="#26A138" stopOpacity={0} />
                  </LinearGradient>
                </Defs>

                {/* ======================================================= */}
                {/* HORIZONTAL REFERENCE LINES (Subtle Dashed Guides)        */}
                {/* ======================================================= */}

                {/* Top Reference Line */}
                <Line
                  x1={0}
                  y1={PAD_TOP}
                  x2={CHART_WIDTH}
                  y2={PAD_TOP}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="3, 3"
                />

                {/* Mid Reference Line */}
                <Line
                  x1={0}
                  y1={PAD_TOP + PLOT_HEIGHT / 2}
                  x2={CHART_WIDTH}
                  y2={PAD_TOP + PLOT_HEIGHT / 2}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="3, 3"
                />

                {/* Bottom Reference Line (Dashed, Borderless Baseline) */}
                <Line
                  x1={0}
                  y1={BASELINE_Y}
                  x2={CHART_WIDTH}
                  y2={BASELINE_Y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="3, 3"
                />

                {/* ======================================================= */}
                {/* Y-AXIS LABELS: Left Aligned Above Reference Lines       */}
                {/* ======================================================= */}

                {/* Top Label (Max Price & Growth) */}
                <SvgText
                  x={6}
                  y={PAD_TOP - 5}
                  fontSize="10"
                  fontFamily="Sora_600SemiBold"
                  fill="#0D1519"
                  textAnchor="start"
                >
                  {formatYPrice(max)}
                  <TSpan
                    fill={trendColor}
                    fontSize="9"
                    fontFamily="Sora_600SemiBold"
                  >
                    {"  "}
                    {formatGrowth(max, start)}
                  </TSpan>
                </SvgText>

                {/* Mid Label (Mid Price) */}
                <SvgText
                  x={6}
                  y={PAD_TOP + PLOT_HEIGHT / 2 - 5}
                  fontSize="10"
                  fontFamily="Sora_400Regular"
                  fill="#94A3B8"
                  textAnchor="start"
                >
                  {formatYPrice(mid)}
                </SvgText>

                {/* Bottom Label (Min Price & Growth) */}
                <SvgText
                  x={6}
                  y={BASELINE_Y - 5}
                  fontSize="10"
                  fontFamily="Sora_600SemiBold"
                  fill="#0D1519"
                  textAnchor="start"
                >
                  {formatYPrice(min)}
                  <TSpan
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="Sora_400Regular"
                  >
                    {"  "}
                    {formatGrowth(min, start)}
                  </TSpan>
                </SvgText>

                {/* ======================================================= */}
                {/* CURVE & GRADIENT AREA                                   */}
                {/* ======================================================= */}
                {areaPath !== "" && (
                  <Path
                    d={areaPath}
                    fill="url(#stockCurveGradient)"
                    opacity={animProgress}
                  />
                )}

                <Path
                  d={curvePath}
                  fill="none"
                  stroke={trendColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${totalLength}, ${totalLength}`}
                  strokeDashoffset={strokeOffset}
                />

                {/* Animated Entrance Tracer Dot */}
                {animProgress > 0 && animProgress < 1 && (
                  <>
                    <Circle
                      cx={tracerPoint.x}
                      cy={tracerPoint.y}
                      r={9}
                      fill={trendColor}
                      opacity={0.25}
                    />
                    <Circle
                      cx={tracerPoint.x}
                      cy={tracerPoint.y}
                      r={4.5}
                      fill={trendColor}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  </>
                )}

                {/* Touch Scrubber */}
                {isScrubbing && activeCoord && (
                  <>
                    <Line
                      x1={activeCoord.x}
                      y1={PAD_TOP}
                      x2={activeCoord.x}
                      y2={BASELINE_Y}
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="4, 4"
                    />
                    <Circle
                      cx={activeCoord.x}
                      cy={activeCoord.y}
                      r={6}
                      fill={trendColor}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Svg>
            </View>

            {/* SECTION 4: TIMEFRAME SELECTOR */}
            <View style={styles.sec4_timeframeRow}>
              {TIMEFRAMES.map((tf) => {
                const isSelected = selectedTimeframe === tf;
                return (
                  <TouchableOpacity
                    key={tf}
                    onPress={() => setSelectedTimeframe(tf)}
                    style={[
                      styles.sec4_timeBtn,
                      isSelected && styles.sec4_timeBtnActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sec4_timeText,
                        isSelected && styles.sec4_timeTextActive,
                      ]}
                    >
                      {tf}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2. SECTION 5: SEGMENTED TAB SWITCHER */}
          <View style={styles.sec5_segmentedControl}>
            {(["About", "Information", "History"] as TabType[]).map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.sec5_segmentBtn,
                    isSelected && styles.sec5_segmentBtnActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sec5_segmentText,
                      isSelected && styles.sec5_segmentTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 3. SECTION 6: TABLES & WRITE-UP */}
          {activeTab === "About" && (
            <View style={styles.sec6_tabContentContainer}>
              <Text style={styles.sec6A_descriptionText}>
                {asset.about.description}
              </Text>

              {/* CARD CONTAINER WITH 8PX BREATHING ROOM SPACING */}
              <View style={styles.sec6_specsCard}>
                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Asset type
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.about.assetType}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Underlying
                  </Text>
                  <View style={styles.sec6A_underlyingRow}>
                    <View style={styles.sec6A_smallLogoWrapper}>
                      <Image
                        source={asset.logo}
                        style={styles.sec6A_smallLogo}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={styles.sec6_specValue}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {asset.about.underlying}
                    </Text>
                  </View>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Backing
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.about.backing}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Trading
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.about.trading}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Ownership rights
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.about.ownershipRights}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Address
                  </Text>
                  <TouchableOpacity
                    style={styles.sec6A_addressRow}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={styles.sec6A_addressText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {asset.about.contractAddress}
                    </Text>
                    {/* 2D Flat Vector Link Icon */}
                    <View style={styles.sec6A_linkIconContainer}>
                      <Svg
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7839CD"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <Path d="M15 3h6v6" />
                        <Path d="M10 14L21 3" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === "Information" && (
            <View style={styles.sec6_tabContentContainer}>
              {/* CARD CONTAINER WITH 8PX BREATHING ROOM SPACING */}
              <View style={styles.sec6_specsCard}>
                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Liquidity
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.liquidity}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Trading hours
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.tradingHours}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Trading fee
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.tradingFee}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Price source
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.priceSource}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Risk level
                  </Text>
                  <Text
                    style={[
                      styles.sec6_specValue,
                      { color: asset.riskTextColor },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.riskLevel.replace(" RISK", "")}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    24h volume
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.volume24h}
                  </Text>
                </View>

                <TableDivider />

                <View style={styles.sec6_specRow}>
                  <Text style={styles.sec6_specLabel} numberOfLines={1}>
                    Market cap
                  </Text>
                  <Text
                    style={styles.sec6_specValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {asset.information.marketCap}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "History" && (
            <View
              style={[
                styles.sec6_specsCard,
                { paddingVertical: 24, alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontFamily: "Sora_600SemiBold", color: "#949494" }}
              >
                No trade history yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ================================================================== */}
      {/* SECTION 7: FIXED BOTTOM ACTION BAR                                 */}
      {/* ================================================================== */}
      <View
        style={[
          styles.sec7_bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.sec7_sellBtn}
          activeOpacity={0.8}
          onPress={() =>
            router.push(`/trade?action=sell&ticker=${asset.ticker}` as any)
          }
        >
          <Text style={styles.sec7_sellBtnText}>Sell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sec7_buyBtn}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/trade",
              params: { action: "buy", ticker: asset.ticker },
            })
          }
        >
          <Text style={styles.buyBtnText}>Buy</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  // SECTION 1: TOP BAR
  sec1_fixedHeader: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  sec1_innerRow: {
    width: "100%",
    maxWidth: 342,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sec1_leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  sec1_backBtn: {
    padding: 7.2,
    borderRadius: 30.6,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
  sec1_backIconText: {
    fontSize: 21.6,
    lineHeight: 21.6,
    color: "#1E1E1E",
    fontWeight: "300",
    textAlign: "center",
  },
  sec1_identityGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sec1_logoContainer: {
    width: 39,
    height: 39,
    aspectRatio: 1,
    borderRadius: 19.5,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sec1_logoImage: {
    width: 26,
    height: 26,
  },
  sec1_textColumn: {
    justifyContent: "center",
  },
  sec1_headerText: {
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  sec1_subHeaderText: {
    color: "#4A4A4A",
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },

  // SECTION 2: ASSET HEADER & PRICING
  sec2_container: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  sec2_riskBadge: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  sec2_riskText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },
  sec2_assetAmount: {
    color: "#0D1519",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 40,
    lineHeight: 48,
    marginBottom: 4,
  },
  sec2_zeroHoldingsPrompt: {
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    color: "#949494",
    marginBottom: 8,
  },
  sec2_priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sec2_priceText: {
    color: "#0D1519",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  sec2_priceChangeText: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
  },

  // 36PX GAP CONTAINER
  mainSectionsWrapper: {
    width: 340,
    maxWidth: "100%",
    alignSelf: "center",
    flexDirection: "column",
    gap: 36,
  },
  graphTimelineGroup: {
    alignSelf: "stretch",
  },

  // SECTION 3: GRAPH CONTAINER (Full 340px Width, Borderless)
  sec3_graphContainer: {
    width: 340,
    height: 217,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    overflow: "hidden",
  },

  // SECTION 4: TIMEFRAME SELECTOR
  sec4_timeframeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sec4_timeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 11,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
    backgroundColor: "#EEEEEE",
    minWidth: 42,
  },
  sec4_timeBtnActive: {
    backgroundColor: "#7839CD",
  },
  sec4_timeText: {
    color: "#0D1519",
    textAlign: "center",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
  },
  sec4_timeTextActive: {
    color: "#FFFFFF",
  },

  // SECTION 5: SEGMENTED TABS
  sec5_segmentedControl: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    padding: 8,
    gap: 8,
    borderRadius: 24,
    backgroundColor: "#F9F9F9",
  },
  sec5_segmentBtn: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 6,
  },
  sec5_segmentBtnActive: {
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
  },
  sec5_segmentText: {
    color: "#000000",
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
    textAlign: "center",
  },
  sec5_segmentTextActive: {
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    lineHeight: 16.8,
    textAlign: "center",
  },

  // SECTION 6: TAB CONTENT
  sec6_tabContentContainer: {
    alignSelf: "stretch",
    gap: 19,
  },
  sec6A_descriptionText: {
    alignSelf: "stretch",
    color: "#313131",
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 23.2,
  },

  // TABLE CONTAINER: 8px Spacing Between Items
  sec6_specsCard: {
    padding: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
    borderRadius: 24,
    backgroundColor: "#F9F9F9",
    gap: 8,
  },

  // TABLE INFO ROW
  sec6_specRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  sec6_specLabel: {
    color: "#747474",
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    flexShrink: 0,
  },
  sec6_specValue: {
    color: "#000000",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "right",
    flexShrink: 1,
  },
  sec6_dividerWrapper: {
    height: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    overflow: "hidden",
  },
  sec6A_underlyingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    flexShrink: 1,
  },
  sec6A_smallLogoWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    flexShrink: 0,
  },
  sec6A_smallLogo: {
    width: "100%",
    height: "100%",
  },
  sec6A_addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    flexShrink: 1,
  },
  sec6A_addressText: {
    color: "#7839CD",
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
    flexShrink: 1,
  },
  sec6A_linkIconContainer: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  // SECTION 7: FIXED BOTTOM ACTION BAR
  sec7_bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingTop: 12,
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
    zIndex: 100,
    elevation: 10,
  },
  sec7_sellBtn: {
    flex: 1,
    height: 49,
    backgroundColor: "#F5F5F7",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sec7_sellBtnText: {
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    color: "#7839CD",
  },
  buyBtnText: {
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  sec7_buyBtn: {
    flex: 1,
    height: 49,
    backgroundColor: "#7839CD",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
