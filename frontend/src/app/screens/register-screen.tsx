import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from "@/src/context/auth-context";
import CustomAlert from "@/src/app/screens/custom-alert";
import { RootStackParamList } from "@/src/app";

interface AlertBtn {
    text: string;
    onPress: () => void;
}

interface Alert {
    visible: boolean;
    title: string;
    message: string;
    type: string;
    buttons: AlertBtn[];
}

type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;


const RegisterScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { register } = useAuth();

    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'success',
        buttons: []
    });

    const navigation = useNavigation<RegisterNavigationProp>();

    const validateForm = () => {
        let isValid = true;

        if (!username.trim()) {
            setUsernameError("Le nom d'utilisateur est requis");
            isValid = false;
        } else {
            setUsernameError("");
        }


        if (!password) {
            setPasswordError("Le mot de passe est requis");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await register(username, password);
            navigation.navigate("Login")
            setAlert({
                visible: true,
                title: "Inscription réussie",
                message: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
                type: "success",
                buttons: []
            });
        } catch (error : any) {
            console.error("Erreur d'inscription:", error);
            setAlert({
                visible: true,
                title: "Erreur d'inscription",
                message: error.response?.data?.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
                type: "error",
                buttons: [{text: "OK", onPress: () => setAlert(prev => ({ ...prev, visible: false }))}]
            });
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#f6f7fb" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <LinearGradient
                            colors={['#3a416f', '#141727']}
                            style={styles.logoContainer}
                        >
                            <FontAwesome5 name="book-reader" size={32} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={styles.title}>Bibliothèque des livres</Text>
                        <Text style={styles.subtitle}>emprunter des livres</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Inscription</Text>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                            <View style={[styles.inputContainer, usernameError ? styles.inputError : null]}>
                                <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Entrez votre nom d'utilisateur"
                                    placeholderTextColor="#999"
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                        if (text.trim()) setUsernameError("");
                                    }}
                                    autoCapitalize="none"
                                />
                            </View>
                            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                        </View>


                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Mot de passe</Text>
                            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
                                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Entrez votre mot de passe"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (text.length >= 6) setPasswordError("");
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={styles.passwordToggle}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={handleRegister}
                            style={styles.buttonContainer}
                        >
                            <LinearGradient
                                colors={['#2B6CB0', '#1A365D']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.registerButton}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <View style={styles.buttonContent}>
                                        <FontAwesome5 name="user-plus" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                                        <Text style={styles.buttonText}>CRÉER UN COMPTE</Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OU</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4F6CE1' }]}>
                                <FontAwesome5 name="facebook-f" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#E53E3E' }]}>
                                <FontAwesome5 name="google" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#141727' }]}>
                                <FontAwesome5 name="apple" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.loginText}>
                            Déjà membre ? <Text style={styles.loginTextBold}>Se connecter</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                buttons={alert.buttons}
                onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f7fb",
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginVertical: 32,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#141727",
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 16,
        color: "#4A5568",
        marginTop: 8,
    },
    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2D3748",
        marginBottom: 24,
        textAlign: "center",
    },
    inputWrapper: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A5568",
        marginBottom: 8,
        paddingLeft: 2,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        backgroundColor: "#F7FAFC",
        height: 50,
    },
    inputError: {
        borderColor: "#E53E3E",
    },
    inputIcon: {
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: "#2D3748",
        fontSize: 15,
    },
    passwordToggle: {
        paddingHorizontal: 16,
    },
    errorText: {
        color: "#E53E3E",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    registerButton: {
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#4A5568',
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    loginLink: {
        alignItems: "center",
        padding: 16,
    },
    loginText: {
        fontSize: 16,
        color: "#4A5568",
    },
    loginTextBold: {
        fontWeight: "bold",
        color: "#3a416f",
    },
});

export default RegisterScreen;
