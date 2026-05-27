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
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function cadastrar() {
    if (email === '' || senha === '') {
      Alert.alert('Preencha todos os campos');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });

    } catch (error) {
      console.log('CÓDIGO:', error.code);
      console.log('MENSAGEM:', error.message);
      Alert.alert('Erro ao cadastrar', error.message);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Criar Conta</Text>

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

      <TouchableOpacity style={styles.botao} onPress={cadastrar}>
        <Text style={styles.textoBotao}>Criar Conta</Text>
      </TouchableOpacity>

      <View style={styles.linhaCadastro}>
        <Text>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> Faça login</Text>
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
    backgroundColor: '#00aa44',
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
    color: '#00aa44',
    fontWeight: 'bold'
  }
});