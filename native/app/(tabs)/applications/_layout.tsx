import { Stack } from "expo-router";
import { Logo } from "../../../components/Logo";
import { GearButton } from "../../../components/GearButton";
import { colors } from "../../../lib/theme";

export default function ApplicationsStack() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: colors.brand },
        headerStyle: { backgroundColor: colors.beigeSoft },
        headerTitleStyle: { color: colors.brand },
        headerShadowVisible: false,
        headerLeft: () => <Logo height={20} />,
        headerRight: () => <GearButton size={22} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Мої послуги" }} />
    </Stack>
  );
}
