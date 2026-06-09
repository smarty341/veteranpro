import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { adjacentTab } from "../lib/tabOrder";
import { tapSelection } from "../lib/haptics";

/**
 * Wraps a tab's index screen so a horizontal fling moves to the adjacent
 * tab (swipe left → next tab to the right, matching the bar order).
 *
 * Fling, not Pan: a fling only activates on a fast horizontal flick, so it
 * never competes with the vertical ScrollViews inside the tabs, and it
 * doesn't need a pager refactor — navigation reuses the Tabs' existing
 * fade animation.
 */
export function TabSwipe({ tab, children }: { tab: string; children: ReactNode }) {
  const router = useRouter();

  const go = (direction: 1 | -1) => {
    const target = adjacentTab(tab, direction);
    if (!target) return; // edge tab: nowhere further to go
    tapSelection();
    router.navigate(target.href as any);
  };

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => go(1));
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => go(-1));

  return (
    <GestureDetector gesture={Gesture.Race(flingLeft, flingRight)}>
      <Animated.View style={styles.fill} collapsable={false}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
