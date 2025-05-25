import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import FormUsers from './src/formUsers';
import { auth } from './src/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    
    const unsub = onAuthStateChanged(auth, (user) => {
      if(user) {
        console.log('Usuario logado');
        console.log(user.email)
        setAuthUser({
          email: user.email,
          uid: user.uid,
        })

        setLoading(false);
        return;
      }

      setAuthUser(null);
      setLoading(false);
    });

  }, []);

  async function handleLogout() {
    await signOut(auth);

    setAuthUser(null)
  }

  async function handleCreateUser() {
    try {
      // minimo 6 caracteres da senha que o firebase pede.
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.log('ERRO: ', error);
    }

  }

  async function handleLogin() {
      
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('----------------------------------Usuario Logado----------------------------------');
      console.log(userCredential);
      setAuthUser({
        email: userCredential.user.email,
        uid: userCredential.user.uid
      });
      setEmail('');
      setPassword('');
      
    })
    .catch((error) => {
      if(error.code === "auth/missing-password") {
        alert('A senha é obrigatória!');
      } else if(error.code === "auth/invalid-email") {
        alert('Email é obrigatório!');
      } else if(error.code === "auth/invalid-credential") {
        alert('Credenciais invalidas!');
      }
      // as mensagens de erro tratadas acima é exibida aqui no console.
      console.log('ERRO: ', error);
    })
  }

  if(authUser) {
    return (
      <View style={styles.container}>
        <FormUsers />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      
      {loading && (
        <ActivityIndicator size={30} color='#000'/>
      )}

      <Text style={{ fontSize: 16, marginLeft: 8, width: '95%' }}>Email: </Text>
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={(e) => setEmail(e)}
        placeholder='Digite seu email...'
      />
      <Text style={{ fontSize: 16, marginLeft: 8, width: '95%' }}>senha: </Text>
      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={(e) => setPassword(e)}
        placeholder='Digite sua senha...'
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          Fazer Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>
          Criar uma conta
        </Text>
      </TouchableOpacity>

      {authUser && (
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>
          Sair da conta
        </Text>
      </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '95%',
    marginLeft: 8,
    marginRight: 8,
    borderWidth: 1,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#000',
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 12,
    width: '95%',
    marginBottom: 12
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
