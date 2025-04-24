import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBooks } from '@/src/context/book-context';
import { COLORS } from '@/src/constants/colors';
import CustomAlert from "@/src/app/screens/custom-alert";
import { Alert } from "@/src/app/screens/login-screen";

const AddBookScreen = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();
    const { createBook } = useBooks();
    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: []
    });

    const handleAddBook = async () => {
        if (!title.trim()) {
            setAlert({
                visible: true,
                title: "Champ requis",
                message: "Veuillez saisir un titre.",
                type: "warning",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
            return;
        }

        if (!author.trim()) {
            setAlert({
                visible: true,
                title: "Champ requis",
                message: "Veuillez saisir un auteur.",
                type: "warning",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
            return;
        }

        if (!description.trim()) {
            setAlert({
                visible: true,
                title: "Champ requis",
                message: "Veuillez saisir une description.",
                type: "warning",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const newBook = await createBook({
                title: title.trim(),
                author: author.trim(),
                description: description.trim()
            });

            if (newBook) {
                setAlert({
                    visible: true,
                    title: "Succès",
                    message: "Livre ajouté avec succès.",
                    type: "success",
                    buttons: [{
                        text: "OK",
                        onPress: () => {
                            setAlert(prev => ({ ...prev, visible: false }));
                            navigation.goBack();
                        }
                    }]
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du livre :", error);
            setAlert({
                visible: true,
                title: "Erreur",
                message: "Impossible d'ajouter le livre. Veuillez réessayer.",
                type: "error",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
            <ScrollView 
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Ajouter un nouveau livre</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Titre</Text>
                    <TextInput
                        placeholder="Saisir le titre du livre"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Auteur</Text>
                    <TextInput
                        placeholder="Saisir le nom de l'auteur"
                        style={styles.input}
                        value={author}
                        onChangeText={setAuthor}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        placeholder="Saisir une description du livre"
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                <TouchableOpacity 
                    style={[
                        styles.button, 
                        isSubmitting && styles.buttonDisabled
                    ]} 
                    onPress={handleAddBook}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Ajouter le livre</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddBookScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        color: COLORS.primary,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    buttonDisabled: {
        backgroundColor: COLORS.disabled,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16,
    },
});
