import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/context/auth-context';
import { COLORS } from '@/src/constants/colors';
import {Alert} from "@/src/app/screens/login-screen";
import CustomAlert from "@/src/app/screens/custom-alert";

export default function ProfileScreen() {
    const { logout } = useAuth();

    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'success',
        buttons: []
    });

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error : any) {
            setAlert({
                visible: true,
                title: "Échec de déconnexion",
                message: "Une erreur s'est produite lors de la déconnexion.",
                type: "error",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                buttons={alert.buttons}
                onClose={() => setAlert(prev => ({...prev, visible: false}))}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    logoutButton: {
        backgroundColor: COLORS.danger,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
