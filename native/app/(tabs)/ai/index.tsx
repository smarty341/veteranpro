import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChatBubble } from "../../../components/ChatBubble";
import { TypingDots } from "../../../components/TypingDots";
import { useTypewriter } from "../../../lib/useTypewriter";
import { mci } from "../../../lib/icons";
import { aiFallback, aiOpening, aiPrompts, aiReplies } from "../../../content/aiCanned";
import { colors, fontSize, radius, space, weight } from "../../../lib/theme";

type Message = { role: "bot" | "me"; text: string };

const OPENING_DELAY = 900;

export default function AiScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  // The opening bot message: first a typing indicator, then a streamed bubble.
  const [openingStarted, setOpeningStarted] = useState(false);
  const opening = useTypewriter(openingStarted ? aiOpening : "");
  const openingDone = openingStarted && opening.done;

  // Conversation that follows the opening.
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // The currently-streaming bot reply (after a prompt/send).
  const [streamingReply, setStreamingReply] = useState<string | null>(null);
  const reply = useTypewriter(streamingReply ?? "");

  // chips reappear once the opening is done and no reply is streaming.
  const showChips = openingDone && streamingReply === null;

  useEffect(() => {
    const t = setTimeout(() => setOpeningStarted(true), OPENING_DELAY);
    return () => clearTimeout(t);
  }, []);

  // When a reply finishes streaming, commit it to the message log so a new
  // streaming bubble can take its place next time.
  useEffect(() => {
    if (streamingReply !== null && reply.done) {
      const text = streamingReply;
      setStreamingReply(null);
      setMessages((prev) => [...prev, { role: "bot", text }]);
    }
  }, [reply.done, streamingReply]);

  const scrollToEnd = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  useEffect(scrollToEnd, [messages, opening.shown, reply.shown, showChips]);

  function ask(prompt: string) {
    if (!openingDone || streamingReply !== null) return;
    setMessages((prev) => [...prev, { role: "me", text: prompt }]);
    setStreamingReply(aiReplies[prompt] ?? aiFallback);
  }

  function onSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    ask(trimmed);
  }

  const canSend = openingDone && streamingReply === null && input.trim().length > 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* header */}
      <View style={styles.header}>
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons
            name={mci("ri:sparkling-2-fill")}
            size={20}
            color={colors.onAccent}
          />
        </View>
        <View>
          <Text style={styles.headerName}>AI-бро</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>онлайн</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* opening: typing dots, then streamed bubble with a cursor */}
          {!openingStarted || opening.shown.length === 0 ? (
            <BotRow>
              <ChatBubble role="bot">
                <TypingDots />
              </ChatBubble>
            </BotRow>
          ) : (
            <BotRow>
              <ChatBubble role="bot">
                <Text style={styles.bubbleText}>
                  {opening.shown}
                  {!opening.done && <Text style={styles.cursor}>▍</Text>}
                </Text>
              </ChatBubble>
            </BotRow>
          )}

          {/* prompt chips */}
          {showChips && (
            <View style={styles.chips}>
              {aiPrompts.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => ask(p)}
                  style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                >
                  <Text style={styles.chipText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* conversation */}
          {messages.map((m, idx) =>
            m.role === "bot" ? (
              <BotRow key={idx}>
                <ChatBubble role="bot">{m.text}</ChatBubble>
              </BotRow>
            ) : (
              <ChatBubble key={idx} role="me">
                {m.text}
              </ChatBubble>
            )
          )}

          {/* in-flight streaming reply */}
          {streamingReply !== null && (
            <BotRow>
              <ChatBubble role="bot">
                {reply.shown.length === 0 ? (
                  <TypingDots />
                ) : (
                  <Text style={styles.bubbleText}>
                    {reply.shown}
                    {!reply.done && <Text style={styles.cursor}>▍</Text>}
                  </Text>
                )}
              </ChatBubble>
            </BotRow>
          )}
        </ScrollView>

        {/* input bar */}
        <View style={[styles.inbar, { paddingBottom: space(2) }]}>
          <TextInput
            style={styles.infield}
            value={input}
            onChangeText={setInput}
            placeholder="Напишіть питання…"
            placeholderTextColor={colors.textFaint}
            returnKeyType="send"
            onSubmitEditing={onSend}
            editable={openingDone}
          />
          <Pressable
            onPress={onSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.send,
              !canSend && styles.sendDisabled,
              pressed && canSend && styles.sendPressed,
            ]}
          >
            <MaterialCommunityIcons
              name={mci("ri:arrow-up-line")}
              size={20}
              color={colors.onAccent}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Bot message row: a mini sparkling avatar beside the bubble. */
function BotRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.botRow}>
      <View style={styles.miniAvatar}>
        <MaterialCommunityIcons
          name={mci("ri:sparkling-2-fill")}
          size={14}
          color={colors.onAccent}
        />
      </View>
      <View style={styles.botBubbleWrap}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(2.5),
    paddingHorizontal: space(4),
    paddingTop: space(2),
    paddingBottom: space(3),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: { color: colors.text, fontSize: fontSize.sm, fontWeight: weight.semibold },
  statusRow: { flexDirection: "row", alignItems: "center", gap: space(1.25), marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.tintEdu },
  statusText: { color: colors.textMuted, fontSize: fontSize.xs },

  messages: {
    paddingVertical: space(4),
    gap: space(0.5),
  },

  botRow: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: space(3) },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    marginRight: -4,
  },
  botBubbleWrap: { flexShrink: 1 },

  bubbleText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  cursor: { color: colors.accent, fontWeight: weight.bold },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space(2),
    paddingHorizontal: space(3),
    paddingLeft: space(3) + 34,
    marginTop: space(1),
    marginBottom: space(1),
  },
  chip: {
    backgroundColor: colors.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: space(2),
    paddingHorizontal: space(3.25),
  },
  chipPressed: { backgroundColor: colors.surfaceCard2 },
  chipText: { color: colors.text, fontSize: fontSize.xs },

  inbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(2.25),
    paddingHorizontal: space(3),
    paddingTop: space(2.25),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  infield: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.pill,
    color: colors.text,
    fontSize: fontSize.sm,
    paddingVertical: space(2.75),
    paddingHorizontal: space(3.75),
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendPressed: { backgroundColor: colors.accentPress },
  sendDisabled: { opacity: 0.45 },
});
