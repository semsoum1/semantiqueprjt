import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import {useRoute, useNavigation} from "@react-navigation/native";
import {useBooks} from "@/src/context/book-context";
import CustomAlert from "@/src/app/screens/custom-alert";
import {Alert} from "@/src/app/screens/login-screen";

const EditBookScreen = () => {
    const {params} = useRoute<any>();
    const navigation = useNavigation();
    const { getBookById, updateBook, isLoading , books } = useBooks();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: []
    });

    const fetchBook = async () => {
        try {
            const bookId = params?.bookId;
            console.log(bookId)
            if (!bookId) {
                setAlert({
                    visible: true,
                    title: "Erreur",
                    message: "ID du livre non spécifié.",
                    type: "error",
                    buttons: [{
                        text: "OK",
                        onPress: () => {
                            setAlert(prev => ({ ...prev, visible: false }));
                            navigation.goBack();
                        }
                    }]
                });
                return;
            }

            console.log("Fetching book with ID:", bookId);
            const book = books.find(book => book.id === bookId) || await getBookById(bookId) || null;
            console.log("Book fetched:", book);

            if (book) {
                setTitle(book.title || "");
                setAuthor(book.author || "");
                setDescription(book.description || "");
            } else {
                console.error("Book not found or undefined");
                setAlert({
                    visible: true,
                    title: "Erreur",
                    message: "Impossible de charger le livre. Le livre n'a pas été trouvé.",
                    type: "error",
                    buttons: [{
                        text: "OK",
                        onPress: () => {
                            setAlert(prev => ({ ...prev, visible: false }));
                            navigation.goBack();
                        }
                    }]
                });
            }
        } catch (e) {
            console.error("Error fetching book:", e);
            setAlert({
                visible: true,
                title: "Erreur",
                message: "Impossible de charger le livre.",
                type: "error",
                buttons: [{
                    text: "OK",
                    onPress: () => {
                        setAlert(prev => ({ ...prev, visible: false }));
                        navigation.goBack();
                    }
                }]
            });
        }
    }

    const handleEditBook = async () => {
        try {
            const bookId = params?.bookId;
            if (!bookId) {
                setAlert({
                    visible: true,
                    title: "Erreur",
                    message: "ID du livre non spécifié.",
                    type: "error",
                    buttons: [{
                        text: "OK",
                        onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                    }]
                });
                return;
            }

            console.log("Updating book with ID:", bookId);
            const updatedBook = await updateBook({
                id: bookId,
                title: title.trim(),
                author: author.trim(),
                description: description.trim(),
            });

            if (updatedBook) {
                console.log("Book updated successfully:", updatedBook);
                setAlert({
                    visible: true,
                    title: "Succès",
                    message: "Livre modifié avec succès.",
                    type: "success",
                    buttons: [{
                        text: "OK",
                        onPress: () => {
                            setAlert(prev => ({ ...prev, visible: false }));
                            navigation.goBack();
                        }
                    }]
                });
            } else {
                console.error("Failed to update book");
                setAlert({
                    visible: true,
                    title: "Erreur",
                    message: "Impossible de modifier le livre.",
                    type: "error",
                    buttons: [{
                        text: "OK",
                        onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                    }]
                });
            }
        } catch (error) {
            console.error("Erreur lors de la modification du livre :", error);
            setAlert({
                visible: true,
                title: "Erreur",
                message: "Impossible de modifier le livre.",
                type: "error",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
        }
    };

    useEffect(() => {
        if (params?.bookId) {
            fetchBook();
        }
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3a416f" />
                <Text style={styles.loaderText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
            <Text style={styles.title}>Modifier le livre</Text>

            <TextInput
                placeholder="Titre"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                placeholder="Auteur"
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
            />

            <TextInput
                placeholder="Description"
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleEditBook}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditBookScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: "#3a416f",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },
});
