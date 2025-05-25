import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

import { db, auth } from './firebaseConnection';
import { doc, collection, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import Card from './components/card';

export default function FormUsers() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [year, setYear] = useState('');
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false)
  const [idUserEdit, setIdUserEdit] = useState('')

  async function handleRegister() {
    if(isEditing === true) {

      const docRef = doc(db, 'users', idUserEdit)
      await updateDoc(docRef, {
        nome: name,
        cargo: position,
        idade: year
      })
      setIsEditing(false)
      setName('');
      setPosition('');
      setYear('');
      alert('Atualizado com sucesso!')
    } else {
      if(!name || !position || year <= 0) {
        alert('Dados invalidos')
        return;
      }
      
      await addDoc(collection(db, "users"), {
        nome: String(name),
        idade: Number(year),
        cargo: String(position)
      })
      setName('');
      setPosition('');
      setYear('');
      alert('Salvo com sucesso!')
    }
  }

  useEffect(() => {

    async function getUsers() {

      const userRef = collection(db, "users");
      
      onSnapshot(userRef, (snapShot) => {
        let lista = [];

        snapShot.forEach((doc) => {
          lista.push({
            id: doc.id,
            name: doc.data().nome,
            year: doc.data().idade,
            position: doc.data().cargo
          })
        })

        setUsers(lista);
      })
    }

    getUsers()
  }, []);

  function editUser(data) {
    setName(data.name)
    setYear(data.year)
    setPosition(data.position)
    setIdUserEdit(data.id)
    setIsEditing(true)
  }

  // remove a sessão do usuario, e o observante "onAuthStateChanged" no app.js vai verificar isso, e renderizar o componente de login, com os formularios e etc...
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <ScrollView style={styles.container}>
      
      <Text style={{ fontSize: 30, fontWeight: 'bold'}}>Cadastre um usuario:</Text>

      <View style={styles.containerInputs}>

        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Nome:</Text>
          <TextInput 
            style={[styles.input]}
            value={name}
            onChangeText={(e) => setName(e)}
            placeholder='Coloque o nome aqui'
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Cargo:</Text>
          <TextInput 
            style={[styles.input]}
            value={position}
            onChangeText={(e) => setPosition(e)}
            placeholder='Coloque o cargo aqui'
          />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Idade:</Text>
          <TextInput 
            style={[styles.input]}
            value={String(year)}
            onChangeText={(e) => setYear(Number(e))}
            placeholder='Coloque a idade aqui'
            keyboardType='numeric'
          />
        </View>

        <Button
          title={isEditing ? 'Editar Usuario' : 'Adicionar'}
          color='#F1D302'
          onPress={handleRegister}
        />
        

      </View>

      <View>
        <TouchableOpacity
          style={{width: '100%', backgroundColor: 'red', marginVertical: 12, padding: 12, alignItems: 'center'}}
          onPress={handleLogout}
        >
          <Text
            style={{ color: '#fff', fontWeight: 'bold' }}
          >Sair da conta</Text>
        </TouchableOpacity>
        <Text 
          style={{ fontWeight: 'bold', fontSize: 18, marginTop: 16}}
        >
          Lista de usuarios:
        </Text>

        <FlatList 
          style={styles.list}
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card 
              data={item}
              handleEdit={ (item) => editUser(item) }
            />
          )}
        />

      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    marginTop: 50,
    gap: 12
  },
  input: {
    backgroundColor: '#FDFFFC',
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  textInput: {
    color: '#FDFFFC',
    fontWeight: 'bold'
  },
  containerInputs: {
    minWidth: 300,
    flexDirection: 'column',
    gap: 12,
    backgroundColor: '#161925',
    padding: 22,
    borderRadius: 12,

  },
  containerInput: {
    
  },
  list: {
    width: '100%',
  }
});
