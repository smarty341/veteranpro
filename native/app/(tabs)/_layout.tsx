import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../../lib/theme";
import { mci } from "../../lib/icons";

interface TabIcon {
  inactive: string;   // ri:* name (line variant)
  active:   string;   // ri:* name (fill variant)
}

const TAB_ICONS: Record<string, TabIcon> = {
  catalog:      { inactive: "ri:apps-2-line",        active: "ri:apps-2-fill" },
  index:        { inactive: "ri:home-5-line",        active: "ri:home-5-fill" },
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
        color={focused ? colors.brand : colors.inactive}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
      })}
    >
      <Tabs.Screen name="catalog"      options={{ title: "Каталог" }} />
      <Tabs.Screen name="index"        options={{ title: "Головна" }} />
      <Tabs.Screen name="ai"           options={{ title: "AI" }} />
      <Tabs.Screen name="applications" options={{ title: "Мої послуги" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.beige,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: weight.medium,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeBar: {
    position: "absolute",
    top: -8,
    height: 3,
    width: 32,
    backgroundColor: colors.olive,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
