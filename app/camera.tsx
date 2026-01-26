import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { supabase } from '../Libreria/supabase';
import {Image} from "expo-image";

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [scannedData, setScannedData] = useState<any>({});

    if (!permission) {
        return <View><Text>Cargando...</Text></View>;
    }
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', color: 'white'}}>No tienes permiso para usar la cámara</Text>
                <Button title="Dar permiso" onPress={requestPermission} />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
        setScanned(true);

        let infoPelicula = data;
        let datosObjeto: any = {};

        try {
            datosObjeto = JSON.parse(data);
            infoPelicula = datosObjeto.titulo || data;
            setScannedData(datosObjeto);
        } catch (e) {
            setScannedData({ titulo: data });
            infoPelicula = data;
        }

        setModalVisible(true);

        try {
            console.log("Guardando en supabase...");
            const { error } = await supabase
                .from('scans')
                .insert({
                    movie_name: infoPelicula,
                    device_id: Platform.OS
                });

            if (error) {
                console.log("Error al guardar en supabase", error);
            } else {
                console.log("Guardado exitoso");
            }
        } catch (err) {
            console.error("Error al guardar en supabase", err);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
            />

            <View style={styles.overlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.instructions}>Escanea el codigo QR</Text>
            </View>

            <Modal
                animationType={"slide"}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>PELÍCULA ENCONTRADA</Text>

                        <View style={{ width: '100%', marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
                                {scannedData?.id || scannedData?.title || scannedData?.overview || scannedData?.rating || scannedData?.poster ||  "Película Escaneada"}
                            </Text>

                            {scannedData?.title && (
                                <Text style={{ fontSize: 16, textAlign: 'center', color: '#000000' }}>
                                     Titulo: {scannedData.title}
                                </Text>
                            )}
                            {scannedData?.poster && (
                                <Image source={{ uri: scannedData.poster }} style={{width: 200, height: 200, alignSelf: 'center'}}/>

                            )}

                            {scannedData?.overview && (
                                <Text style={{ fontSize: 16, textAlign: 'justify', color: '#555' }}>
                                     Overview: {scannedData.overview}
                                </Text>
                            )}

                            {scannedData?.rating && (
                                <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
                                   Calificación: {scannedData.rating}
                                </Text>
                            )}
                        </View>

                        <Text style={styles.successMessage}> Guardado exitoso en Supabase</Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                setScanned(false);
                            }}
                        >
                            <Text style={styles.closeButtonText}>Cerrar y Escanear otro</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#eaefea',
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    instructions: {
        color: 'white',
        marginTop: 20,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    movieText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    }
});