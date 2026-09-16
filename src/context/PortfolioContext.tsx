// ============================================================================
// FILE: src/context/PortfolioContext.tsx
// DESCRIPTION: Live Portfolio state for real asset holdings and trade history.
// ============================================================================

import React, { createContext, useContext, useState } from "react";

export interface HoldingItem {
  id: string;
  ticker: string;
  name: string;
  price: number;
  holdingQty: number;
  change: string;
  logo: any;
}

export interface HistoryItem {
  id: string;
  ticker: string;
  action: "buy" | "sell";
  amountUsd: number;
  tokenAmount: number;
  date: string;
  price: number;
}

interface PortfolioContextType {
  holdings: HoldingItem[];
  tradeHistory: HistoryItem[];
  totalPortfolioValue: number;
  addTrade: (trade: {
    ticker: string;
    name: string;
    amountUsd: number;
    tokenAmount: number;
    price: number;
    action: "buy" | "sell";
    logo: any;
  }) => void;
}

// Initial position matching your initial portfolio screenshot
const INITIAL_HOLDINGS: HoldingItem[] = [
  {
    id: "1",
    ticker: "TSLAx",
    name: "Tesla Tokenized Stock",
    price: 342.18,
    holdingQty: 7.25,
    change: "+2.58%",
    logo: require("../../assets/logos/tsla.png"),
  },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [holdings, setHoldings] = useState<HoldingItem[]>(INITIAL_HOLDINGS);
  const [tradeHistory, setTradeHistory] = useState<HistoryItem[]>([]);

  // Dynamically calculate total portfolio value from all owned holdings
  const totalPortfolioValue = holdings.reduce(
    (sum, item) => sum + item.holdingQty * item.price,
    0,
  );

  const addTrade = ({
    ticker,
    name,
    amountUsd,
    tokenAmount,
    price,
    action,
    logo,
  }: {
    ticker: string;
    name: string;
    amountUsd: number;
    tokenAmount: number;
    price: number;
    action: "buy" | "sell";
    logo: any;
  }) => {
    // 1. Update or create the holding position
    setHoldings((prevHoldings) => {
      const existing = prevHoldings.find((h) => h.ticker === ticker);
      if (existing) {
        return prevHoldings.map((h) =>
          h.ticker === ticker
            ? {
                ...h,
                holdingQty:
                  action === "buy"
                    ? h.holdingQty + tokenAmount
                    : Math.max(0, h.holdingQty - tokenAmount),
                price,
              }
            : h,
        );
      } else {
        // Add new asset to portfolio list if not previously owned
        return [
          ...prevHoldings,
          {
            id: Date.now().toString(),
            ticker,
            name,
            price,
            holdingQty: tokenAmount,
            change: "+1.25%",
            logo,
          },
        ];
      }
    });

    // 2. Add record to the History tab
    const newRecord: HistoryItem = {
      id: Date.now().toString(),
      ticker,
      action,
      amountUsd,
      tokenAmount,
      price,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTradeHistory((prev) => [newRecord, ...prev]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        tradeHistory,
        totalPortfolioValue,
        addTrade,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
