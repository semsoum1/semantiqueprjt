import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/src/hooks/use-color-scheme';
import {AuthProvider} from '@/src/context/auth-context';
import {BookProvider} from '@/src/context/book-context';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet} from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('@/src/assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <AuthProvider>
                        <BookProvider>
                            <Stack screenOptions={{ headerShown: false  }}>
                                <Stack.Screen name="index"/>
                                <Stack.Screen name="+not-found"/>
                            </Stack>
                            <StatusBar style="auto" />
                        </BookProvider>
                    </AuthProvider>
                </ThemeProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
