# Habit Tracker — App Mobile

Aplicativo mobile de rastreamento de hábitos desenvolvido com React Native e Expo. Permite registrar hábitos do dia a dia, organizá-los por categorias e acompanhar o desempenho ao longo do tempo.

## Funcionalidades

- Registrar hábitos com descrição e categoria
- Criar, editar e excluir categorias personalizadas
- Editar e excluir registros
- Visualizar registros agrupados por dia
- Filtrar registros por mês e ano
- Dashboard com percentual de frequência por categoria

## Tecnologias

- React Native + Expo SDK 54
- React Navigation (navegação entre telas)
- Axios (consumo da API)

## Pré-requisitos

- Node.js 18 ou superior
- Aplicativo **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador na mesma rede Wi-Fi

## Instalação e execução

```bash
# Clone o repositório
git clone https://github.com/andrecsf/meu-app-mobile.git
cd meu-app-mobile

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npx expo start
```

Após rodar o `npx expo start`, um QR code será exibido no terminal. Abra o aplicativo **Expo Go** no celular e escaneie o QR code para visualizar o app.

## Backend

A API está hospedada em produção e já está configurada no app:
https://habit-tracker-backend-idux.onrender.com
Não é necessário rodar o backend localmente.

## Estrutura de pastas
meu-app-mobile/
├── src/
│   ├── components/
│   │   ├── RegistroCard.js     # Card de cada registro na listagem
│   │   └── CategoriaTag.js     # Pílula com ícone e nome da categoria
│   ├── screens/
│   │   ├── HomeScreen.js           # Tela inicial com dashboard e listagem
│   │   ├── NovoRegistroScreen.js   # Tela de criação de registro
│   │   ├── EditarRegistroScreen.js # Tela de edição e exclusão de registro
│   │   └── CategoriasScreen.js     # Gerenciamento de categorias
│   ├── services/
│   │   └── api.js              # Configuração do axios
│   └── theme.js                # Cores, espaçamentos e tipografia
├── App.js                      # Navegação principal
└── package.json