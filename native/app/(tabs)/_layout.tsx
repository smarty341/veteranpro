import { Tabs } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, weight } from "../../lib/theme";
import { mci } from "../../lib/icons";
import { tapSelection } from "../../lib/haptics";

interface TabIcon {
  inactive: string;   // ri:* name (line variant)
  active:   string;   // ri:* name (fill variant)
}

const TAB_ICONS: Record<string, TabIcon> = {
  index:        { inactive: "ri:home-5-line",        active: "ri:home-5-fill" },
  opportunities:{ inactive: "ri:price-tag-3-line",   active: "ri:price-tag-3-fill" },
  ai:           { inactive: "ri:sparkling-2-line",   active: "ri:sparkling-2-fill" },
  applications: { inactive: "ri:file-list-3-line",   active: "ri:file-list-3-fill" },
};

function renderTabIcon(routeName: string, focused: boolean) {
  const set = TAB_ICONS[routeName];
  if (!set) return null;
  const name = focused ? set.active : set.inactive;
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.activeBar} />}
      <MaterialCommunityIcons
        name={mci(name)}
        size={25}
        color={focused ? colors.accent : colors.textFaint}
      />
    </View>
  );
}

/**
 * Custom tab bar with a deterministic, fixed height.
 *
 * We render the bar ourselves instead of letting React Navigation own its
 * height: the library animates/measures the default bar's height, which under
 * some tab/keyboard transitions made it balloon to 2-3x its size. A plain
 * View with an explicit height can't do that.
 */
function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.min(insets.bottom, 34); // home indicator ~34pt; never more

  return (
    <View style={[styles.tabBar, { height: 60 + bottom, paddingBottom: bottom + 6 }]}>
      {state.routes.map((route, index) => {
        if (!TAB_ICONS[route.name]) return null;
        const focused = state.index === index;
        const label = (descriptors[route.key].options.title ?? route.name) as string;

        const onPress = () => {
          tapSelection();
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
          >
            {renderTabIcon(route.name, focused)}
            <Text
              style={[styles.tabLabel, { color: focused ? colors.accent : colors.textFaint }]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        // "fade" is opacity-only; "shift" translates screens by a
        // position-dependent amount and glitched the end tabs' layout.
        animation: "fade",
      }}
    >
      <Tabs.Screen name="index"         options={{ title: "Головна" }} />
      <Tabs.Screen name="opportunities" options={{ title: "Можливості" }} />
      <Tabs.Screen name="ai"            options={{ title: "AI-бро" }} />
      <Tabs.Screen name="applications"  options={{ title: "Мої послуги" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingTop: 6,
    overflow: "visible",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "visible",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: weight.medium,
    marginTop: 2,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeBar: {
    position: "absolute",
    top: -16,
    height: 3,
    width: 32,
    backgroundColor: colors.accent,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
