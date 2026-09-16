// components/ui/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  // Determine if button is in disabled state
  const isDisabled = disabled || isLoading;

  // Background color mapping
  const getBackgroundColor = () => {
    if (isDisabled) return "#DCC2FF"; // Figma Disabled
    if (variant === "secondary") return "#F0F0F0"; // Figma Secondary
    return "#7839CD"; // Figma Primary
  };

  // Text color mapping
  const getTextColor = () => {
    if (isDisabled) return "#FFFFFF";
    if (variant === "secondary") return "#7839CD";
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.baseButton,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.baseText,
              { color: getTextColor() },
              variant === "secondary" && styles.secondaryLineHeight,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    // From Figma
    height: 54.3,
    paddingHorizontal: 12,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 11.8,
    alignSelf: "stretch",
  },
  baseText: {
    // From Figma
    fontFamily: "Sora_700Bold", // Fallback to system font if Sora is not loaded
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryLineHeight: {
    lineHeight: 20.3, // 145% from your secondary spec
  },
});
