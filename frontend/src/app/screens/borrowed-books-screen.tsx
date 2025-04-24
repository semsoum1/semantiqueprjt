import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useBooks } from '@/src/context/book-context';
import { COLORS } from '@/src/constants/colors';
import CustomAlert from '@/src/app/screens/custom-alert';
import { Alert } from '@/src/app/screens/login-screen';

export default function BorrowedBooksScreen() {
    const { borrowedBooks, isLoading, error, fetchBorrowedBooks, returnBook } = useBooks();
    const [alert, setAlert] = useState<Alert>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: [],
    });

    useEffect(() => {
        console.log('BorrowedBooksScreen mounted');
        fetchBorrowedBooks();
    }, [fetchBorrowedBooks]);

    useEffect(() => {
        console.log('Borrowed books data changed:', borrowedBooks);
    }, [borrowedBooks]);

    const handleReturnBook = async (id: number) => {
        try {
            const result = await returnBook(id);
            setAlert({
                visible: true,
                title: result ? 'Succès' : 'Erreur',
                message: result
                    ? 'Livre retourné avec succès.'
                    : 'Impossible de retourner le livre.',
                type: result ? 'success' : 'error',
                buttons: [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (result) fetchBorrowedBooks();
                            setAlert(prev => ({ ...prev, visible: false }));
                        },
                    },
                ],
            });
        } catch (error) {
            console.error('Erreur lors du retour du livre :', error);
            setAlert({
                visible: true,
                title: 'Erreur',
                message: 'Impossible de retourner le livre.',
                type: 'error',
                buttons: [
                    {
                        text: 'OK',
                        onPress: () => setAlert(prev => ({ ...prev, visible: false })),
                    },
                ],
            });
        }
    };

    if (isLoading) {
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
                <TouchableOpacity style={styles.retryButton} onPress={fetchBorrowedBooks}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const validBorrowedBooks = Array.isArray(borrowedBooks)
        ? borrowedBooks.filter(book => book && typeof book === 'object' && book.id)
        : [];

    return (
        <View style={styles.container}>
            <CustomAlert {...alert} onClose={() => setAlert(prev => ({ ...prev, visible: false }))} />
            <Text style={styles.title}>Mes Livres Empruntés</Text>

            {validBorrowedBooks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vous n'avez pas de livres empruntés</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchBorrowedBooks}>
                        <Text style={styles.retryText}>Rafraîchir</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={validBorrowedBooks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.bookAuthor}>Auteur : {item.author}</Text>
                            <Text style={styles.bookDescription} numberOfLines={2}>
                                {item.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.returnButton}
                                onPress={() => handleReturnBook(item.id)}
                            >
                                <Text style={styles.returnButtonText}>Retourner</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={fetchBorrowedBooks}
                            colors={[COLORS.primary]}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
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
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
    returnButton: {
        backgroundColor: '#3a416f',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12,
    },
    returnButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.danger,
        textAlign: 'center',
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
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
});