import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBooks } from '@/src/context/book-context';
import { Book } from '@/src/interfaces/book';
import { COLORS } from '@/src/constants/colors';
import {RootStackParamList} from "@/src/app";
import CustomAlert from "@/src/app/screens/custom-alert";
import { Alert } from "@/src/app/screens/login-screen";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookList'>;

const ListBooksScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { books, isLoading, error, fetchBooks, deleteBook, borrowBook } = useBooks();
    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: []
    });

    useFocusEffect(
        React.useCallback(() => {
            fetchBooks();
            return () => {};
        }, [fetchBooks])
    );


    const handleDeleteBook = (id: number) => {
        setAlert({
            visible: true,
            title: "Confirmation",
            message: "Voulez-vous vraiment supprimer ce livre ?",
            type: "warning",
            buttons: [
                {
                    text: "Supprimer",
                    onPress: async () => {
                        setAlert(prev => ({ ...prev, visible: false }));
                        const success = await deleteBook(id);
                        if (success) {
                            setAlert({
                                visible: true,
                                title: "Succès",
                                message: "Livre supprimé avec succès.",
                                type: "success",
                                buttons: [{
                                    text: "OK",
                                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                                }]
                            });
                        }
                    }
                },
                {
                    text: "Annuler",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }
            ]
        });
    };

    const handleBorrowBook = async (id: number) => {
        try {
            const updatedBook = await borrowBook(id);
            if (updatedBook) {
                setAlert({
                    visible: true,
                    title: "Succès",
                    message: "Livre emprunté avec succès.",
                    type: "success",
                    buttons: [{
                        text: "OK",
                        onPress: () => {
                            setAlert(prev => ({ ...prev, visible: false }));
                            fetchBooks();
                        }
                    }]
                });

            }
        } catch (error) {
            console.error("Erreur lors de l'emprunt du livre :", error);
            setAlert({
                visible: true,
                title: "Erreur",
                message: "Impossible d'emprunter le livre.",
                type: "error",
                buttons: [{
                    text: "OK",
                    onPress: () => setAlert(prev => ({ ...prev, visible: false }))
                }]
            });
        }
    };

    const renderBook = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("EditBook", { bookId: item.id })}
        >
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>Auteur : {item.author}</Text>
            <Text style={styles.bookDescription} numberOfLines={2}>{item.description}</Text>

            <View style={styles.statusContainer}>
                <Text style={[
                    styles.statusText, 
                    { color: item.available ? COLORS.success : COLORS.danger }
                ]}>
                    {item.available ? "Disponible" : "Emprunté"}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("EditBook", { bookId : item.id })}
                >
                    <Text style={styles.actionText}>✏️ Modifier</Text>
                </TouchableOpacity>

                {item.available && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                        onPress={() => handleBorrowBook(item.id)}
                    >
                        <Text style={styles.actionText}>📚 Emprunter</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: COLORS.danger }]}
                    onPress={() => handleDeleteBook(item.id)}
                >
                    <Text style={styles.actionText}>🗑️ Supprimer</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (isLoading && books.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => fetchBooks()}
                >
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
            {books.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun livre disponible</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate("AddBook")}
                    >
                        <Text style={styles.addButtonText}>Ajouter un livre</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderBook}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={fetchBooks}
                            colors={[COLORS.primary]}
                        />
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddBook")}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    statusContainer: {
        marginTop: 8,
        marginBottom: 4,
    },
    statusText: {
        fontWeight: "bold",
        fontSize: 14,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    bookAuthor: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    bookDescription: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    actions: {
        flexDirection: "row",
        marginTop: 12,
        justifyContent: "space-between",
    },
    actionButton: {
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
    },
    actionText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 30,
        color: COLORS.white,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.danger,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    retryText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
});


export default ListBooksScreen;
