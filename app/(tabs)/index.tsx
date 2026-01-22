import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // <--- Usamos el router moderno

export default function HomeScreen() {
    const router = useRouter(); // Activamos la navegación

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Proyecto II Bimestre</Text>
            <Text style={styles.subtitulo}>Escanea el QR de tu película favorita</Text>

            <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push('/camera')}
            >
                <Text style={styles.textoBoton}>Abrir Cámara</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 50,
        textAlign: 'center',
    },
    boton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 5,
    },
    textoBoton: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});