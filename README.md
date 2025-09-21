# Banco Inter App - React Native Frontend

Este é o frontend do aplicativo Banco Inter, desenvolvido em React Native com Expo, que se conecta à API Laravel para gestão financeira pessoal.

## 🚀 Funcionalidades

- **Autenticação completa** (login, cadastro, logout)
- **Gestão de transações** (adicionar, visualizar, remover)
- **Upload de foto de perfil** (câmera ou galeria)
- **Interface responsiva** com design do Banco Inter
- **Navegação intuitiva** entre telas
- **Atualização automática de saldo**
- **Pull-to-refresh** nas listas

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo físico com Expo Go ou emulador

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Danilo-RC/banco-inter-app.git
cd banco-inter-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a API
Edite o arquivo `src/api/index.js` e ajuste a `baseURL`:

```javascript
// Para desenvolvimento local (web)
baseURL: 'http://localhost:8000/api'

// Para dispositivo físico (substitua pelo IP da sua máquina)
baseURL: 'http://SEU_IP:8000/api'  // Ex: 'http://192.168.1.100:8000/api'
```

Para descobrir seu IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` ou `ip a`

### 4. Inicie o aplicativo

#### Para Web (navegador)
```bash
npm run web
```

#### Para dispositivo móvel
```bash
npm start
```
Escaneie o QR Code com o app Expo Go no seu celular.

#### Para emuladores
```bash
npm run android  # Android
npm run ios      # iOS (apenas no macOS)
```

## 📱 Estrutura do Projeto

```
src/
├── api/
│   └── index.js              # Configuração do Axios
├── pages/
│   ├── Login/
│   │   ├── index.js          # Tela de Login
│   │   └── style.js          # Estilos da tela
│   ├── Cadastro/
│   │   ├── index.js          # Tela de Cadastro
│   │   └── style.js          # Estilos da tela
│   ├── Home/
│   │   ├── index.js          # Tela principal
│   │   └── style.js          # Estilos da tela
│   └── Perfil/
│       ├── index.js          # Tela de perfil
│       └── style.js          # Estilos da tela
└── components/
    └── TransactionModal.js   # Modal para criar transações
```

## 🎨 Design System

### Cores
- **Primária**: #FF7A00 (Laranja Banco Inter)
- **Secundária**: #000000 (Preto)
- **Background**: #F5F5F5 (Cinza claro)
- **Texto**: #333333 (Cinza escuro)
- **Sucesso**: #28a745 (Verde)
- **Erro**: #dc3545 (Vermelho)

### Componentes
- **FAB (Floating Action Button)**: Botão laranja no canto inferior direito
- **Cards**: Elementos com sombra e bordas arredondadas
- **Modal**: Overlay para criação de transações
- **Headers**: Fundo laranja com texto branco

## 🔧 Funcionalidades Detalhadas

### Tela de Login
- Validação de campos obrigatórios
- Integração com API de autenticação
- Armazenamento seguro do token
- Loading state durante requisição
- Navegação para cadastro

### Tela de Cadastro
- Validação de email e senha
- Confirmação de senha
- Validação de campos obrigatórios
- Integração com API de registro
- Navegação de volta ao login

### Tela Home
- Exibição do saldo atual
- Lista de transações recentes
- FAB para adicionar transações
- Pull-to-refresh para atualizar dados
- Navegação para perfil
- Long press para remover transações

### Tela de Perfil
- Exibição de dados do usuário
- Upload de foto (câmera/galeria)
- Informações de saldo e data de registro
- Botão de logout
- Navegação de volta

### Modal de Transações
- Seleção de tipo (entrada/saída)
- Campo de valor com formatação monetária
- Campo de descrição
- Validação de dados
- Integração com API

## 🔒 Autenticação

O aplicativo utiliza autenticação baseada em tokens:

1. **Login**: Usuário insere credenciais e recebe um token
2. **Armazenamento**: Token é salvo no AsyncStorage
3. **Interceptor**: Axios adiciona automaticamente o token nas requisições
4. **Logout**: Token é removido e usuário redirecionado

## 📝 Dependências Principais

```json
{
  "@react-native-async-storage/async-storage": "^2.1.2",
  "@react-navigation/native": "^7.0.19",
  "@react-navigation/native-stack": "^7.3.3",
  "axios": "^1.9.0",
  "expo": "~52.0.41",
  "expo-image-picker": "latest",
  "react": "18.3.1",
  "react-native": "0.76.7"
}
```

## 🛠️ Desenvolvimento

### Comandos úteis
```bash
# Limpar cache do Expo
npx expo start --clear

# Reinstalar dependências
rm -rf node_modules && npm install

# Verificar logs
# Os logs aparecem no terminal onde você executou npm start
```

### Debugging
- **Console.log**: Use para debug no desenvolvimento
- **Expo DevTools**: Pressione `j` no terminal para abrir
- **React DevTools**: Disponível no navegador quando rodando na web
- **Network**: Verifique requisições na aba Network do navegador

### Estrutura de Estilos
Cada tela tem seu próprio arquivo `style.js` com StyleSheet do React Native:

```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ... outros estilos
});

export default styles;
```

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o backend Laravel está rodando
- Confirme o IP/URL no arquivo `src/api/index.js`
- Teste a API diretamente no navegador ou Postman

### Erro de permissões (câmera/galeria)
- Verifique se as permissões foram concedidas no dispositivo
- Reinstale o app se necessário

### Erro de navegação
- Verifique se todas as telas estão importadas corretamente no `App.js`
- Confirme os nomes das rotas

### App não carrega no dispositivo
- Verifique se o dispositivo está na mesma rede Wi-Fi
- Confirme se o firewall não está bloqueando a conexão
- Tente reiniciar o servidor Expo

## 📱 Testando o Aplicativo

### No navegador (Web)
1. Execute `npm run web`
2. Acesse `http://localhost:8081`
3. Teste todas as funcionalidades

### No dispositivo físico
1. Instale o Expo Go na Play Store/App Store
2. Execute `npm start`
3. Escaneie o QR Code
4. Teste em ambiente real

### Fluxo de teste recomendado
1. Cadastre um novo usuário
2. Faça login
3. Adicione algumas transações (entrada e saída)
4. Verifique se o saldo atualiza
5. Teste o upload de foto
6. Teste o logout

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e demonstrativos.

