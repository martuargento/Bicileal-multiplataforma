import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/context/AuthContext'
import { CarritoProvider } from './src/context/CarritoContext'
import { CatalogoProvider } from './src/context/CatalogoContext'
import AppNavigator from './src/navigation/AppNavigator'
import { colores } from './src/theme/colores'

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CarritoProvider>
          <CatalogoProvider>
            <NavigationContainer>
              <StatusBar style="dark" backgroundColor={colores.fondo} />
              <AppNavigator />
            </NavigationContainer>
          </CatalogoProvider>
        </CarritoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
