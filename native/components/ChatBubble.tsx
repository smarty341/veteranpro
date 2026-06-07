import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";

interface ChatBubbleProps {
  role: "bot" | "me";
  children: React.ReactNode;
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isBot = role === "bot";
  return (
    <View style={[styles.wrapper, isBot ? styles.wrapperBot : styles.wrapperMe]}>
      <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleMe]}>
        {typeof children === "string" ? (
          <Text style={isBot ? styles.textBot : styles.textMe}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const RADIUS = 13;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  wrapperBot: {
    alignItems: "flex-start",
  },
  wrapperMe: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleBot: {
    backgroundColor: colors.surfaceCard,
    borderRadius: RADIUS,
    borderTopLeftRadius: 4, // top-left less rounded for bot
  },
  bubbleMe: {
    backgroundColor: colors.accent,
    borderRadius: RADIUS,
  },
  textBot: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  textMe: {
    color: colors.onAccent,
    fontSize: 15,
    lineHeight: 21,
  },
});
