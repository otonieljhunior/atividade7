import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function login() {
    if (email === '' || senha === '') {
      Alert.alert('Preencha todos os campos');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });

    } catch (error) {
      console.log('CÓDIGO:', error.code);
      console.log('MENSAGEM:', error.message);
      Alert.alert('Erro ao fazer login', error.message);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Login</Text>

      <TextInput
        placeholder="Digite seu email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Digite sua senha"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={login}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.linhaCadastro}>
        <Text>Ainda não tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  botao: {
    backgroundColor: '#0066ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linhaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  link: {
    color: '#0066ff',
    fontWeight: 'bold'
  }
});