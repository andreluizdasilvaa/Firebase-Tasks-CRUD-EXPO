import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  } from 'react-native';
import { db } from '../firebaseConnection'
import { deleteDoc, doc } from 'firebase/firestore';

const Card = ({ data, handleEdit }) => {

    async function handleDeleteItem() {
        const docRef = doc(db, "users", data.id)
        await deleteDoc(docRef)
    }

    async function handleUpdateUser(params) {
        handleEdit(data)
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.nameInput, styles.input]}>
                    Nome: {data.name}
                </Text>

                <Text style={[styles.yearInput, styles.input]}>
                    Idade: {data.year}
                </Text>

                <Text style={[styles.positionInput, styles.input]}>
                    Cargo: {data.position}
                </Text>
            </View>

            <View style={styles.containerBtns}>
                <TouchableOpacity style={styles.btn} onPress={handleDeleteItem}>
                    <Text style={styles.textBtn}>Deletar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, { backgroundColor: '#F1D302' }]} onPress={handleUpdateUser}>
                    <Text style={styles.textBtn}>Atualizar</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        backgroundColor: '#235789',
        marginBottom: 12,
        padding: 16
    },
    containerBtns: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    input: {
        color: '#FDFFFC',
        fontWeight: 'medium',
        fontSize: 16
    },
    btn: {
        width: '100%',
        backgroundColor: '#C1292E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center'
    },
    textBtn: {
        color: '#FDFFFC',
        fontWeight: 'bold',
    },
});

export default Card;