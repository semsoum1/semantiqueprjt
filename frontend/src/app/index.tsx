import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/auth-context";
import LoginScreen from "@/src/app/screens/login-screen";
import BookListScreen from "@/src/app/screens/book-list-screen";
import RegisterScreen from "@/src/app/screens/register-screen";
import EditBookScreen from "@/src/app/screens/edit-book-screen";
import AddBookScreen from "@/src/app/screens/add-book-screen";
import BorrowedBooksScreen from "@/src/app/screens/borrowed-books-screen";
import ProfileScreen from "@/src/app/screens/profile-screen";
import {TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    AddBook: undefined;
    EditBook: { bookId: number };
    BookList: undefined;
    BorrowedBooks: undefined;
    Profile: undefined;
    MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();


function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home' ;

                    if (route.name === 'BookList') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'BorrowedBooks') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'AddBook') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#2196F3',
                },
                headerTintColor: '#fff',
            })}
        >
            {/* Tab screens remain the same */}
            <Tab.Screen
                name="BookList"
                component={BookListScreen}
                options={{ title: 'Books' }}
            />
            <Tab.Screen
                name="BorrowedBooks"
                component={BorrowedBooksScreen}
                options={{ title: 'Borrowed' }}
            />
            <Tab.Screen
                name="AddBook"
                component={AddBookScreen}
                options={{ title: 'Add Book' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { userToken } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#2196F3',
                },
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                ),
                headerTintColor: '#fff',
            })}>
            {userToken === null ? (
                // Auth screens
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </>
            ) : (
                // App screens
                <>
                    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                    <Stack.Screen name="EditBook" component={EditBookScreen} options={{ headerShown: true }} />
                </>
            )}
        </Stack.Navigator>
    );
}
