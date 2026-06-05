import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { colors } from './src/theme'

import HomeScreen from './src/screens/HomeScreen'
import NovoRegistroScreen from './src/screens/NovoRegistroScreen'
import CategoriasScreen from './src/screens/CategoriasScreen'
import EditarRegistroScreen from './src/screens/EditarRegistroScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '500', color: colors.textMedium },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovoRegistro"
          component={NovoRegistroScreen}
          options={{ title: 'novo registro' }}
        />
        <Stack.Screen
          name="Categorias"
          component={CategoriasScreen}
          options={{ title: 'categorias' }}
        />
        <Stack.Screen
          name="EditarRegistro"
          component={EditarRegistroScreen}
          options={{ title: 'editar registro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}