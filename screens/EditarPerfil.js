import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { auth } from '../firebaseConfig';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

export default function EditarPerfil({ navigation }) {
  const user = auth.currentUser;

  const [nome, setNome] = useState(user?.displayName || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const querTrocarSenha = novaSenha.length > 0;

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite um nome.');
      return;
    }

    // Só exige senha atual se quiser trocar a senha
    if (querTrocarSenha && !senhaAtual) {
      Alert.alert('Atenção', 'Para trocar a senha, informe a senha atual.');
      return;
    }

    if (querTrocarSenha && novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);

    // ETAPA 1: Atualiza nome (não precisa de reautenticação)
    try {
      await updateProfile(auth.currentUser, { displayName: nome.trim() });
      await auth.currentUser.reload();
      console.log('Nome atualizado para:', auth.currentUser.displayName);
    } catch (e) {
      console.log('Erro ao atualizar nome:', e.code, e.message);
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
      setCarregando(false);
      return;
    }

    // ETAPA 2: Troca de senha (só se preencheu)
    if (querTrocarSenha) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, senhaAtual);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, novaSenha);
        console.log('Senha atualizada.');
      } catch (e) {
        console.log('Erro ao atualizar senha:', e.code, e.message);
        const msgs = {
          'auth/wrong-password': 'Senha atual incorreta.',
          'auth/invalid-credential': 'Senha atual incorreta.',
        };
        Alert.alert('Erro na senha', msgs[e.code] || e.message);
        setCarregando(false);
        return;
      }
    }

    setCarregando(false);
    Alert.alert('✅ Sucesso!', 'Perfil atualizado!');
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarTexto}>← Editar Perfil</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nome de exibição</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        // no navegador, autoComplete ajuda o campo funcionar corretamente
        autoComplete="name"
      />

      <View style={styles.divisor} />

      <Text style={styles.sectionTitle}>Trocar senha (opcional)</Text>

      <Text style={styles.label}>Senha atual</Text>
      {/* No navegador, usa input HTML nativo para evitar bug do secureTextEntry */}
      {Platform.OS === 'web' ? (
        <input
          type="password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          placeholder="Digite sua senha atual"
          style={webInputStyle}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          placeholder="Digite sua senha atual"
          secureTextEntry
        />
      )}

      <Text style={styles.label}>Nova senha</Text>
      {Platform.OS === 'web' ? (
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Nova senha (mín. 6 caracteres)"
          style={webInputStyle}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Nova senha (mín. 6 caracteres)"
          secureTextEntry
        />
      )}

      {carregando
        ? <ActivityIndicator size="large" color="#2d5bff" style={{ marginTop: 20 }} />
        : (
          <TouchableOpacity style={styles.botao} onPress={salvar}>
            <Text style={styles.botaoTexto}>Salvar Alterações</Text>
          </TouchableOpacity>
        )
      }
    </ScrollView>
  );
}

// Estilo para o input HTML nativo no navegador
const webInputStyle = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 15,
  fontSize: 16,
  width: '100%',
  marginBottom: 10,
  border: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  outline: 'none',
  boxSizing: 'border-box',
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f7ff', padding: 20, paddingTop: 60 },
  voltar: { marginBottom: 30 },
  voltarTexto: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 10 },
  label: { fontSize: 14, color: '#777', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15,
    fontSize: 16, elevation: 2, marginBottom: 10
  },
  divisor: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 20 },
  botao: {
    backgroundColor: '#2d5bff', borderRadius: 14,
    padding: 18, alignItems: 'center', marginTop: 30
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});