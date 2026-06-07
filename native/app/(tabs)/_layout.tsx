import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenListeners={{
        tabPress: () => tapSelection(),
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: "shift",
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 6,
          },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
      })}
    >
      <Tabs.Screen name="index"        options={{ title: "Головна" }} />
      <Tabs.Screen name="opportunities" options={{ title: "Можливості" }} />
      <Tabs.Screen name="ai"           options={{ title: "AI-бро" }} />
      <Tabs.Screen name="applications" options={{ title: "Мої послуги" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    paddingTop: 6,
    overflow: "visible",
  },
  tabItem: {
    paddingVertical: 2,
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
