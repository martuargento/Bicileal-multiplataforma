import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Feather } from '@expo/vector-icons'
import TiendaScreen from '../screens/TiendaScreen'
import CarritoScreen from '../screens/CarritoScreen'
import CuentaScreen from '../screens/CuentaScreen'
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import EditarProductoScreen from '../screens/EditarProductoScreen'
import HistoriaScreen from '../screens/HistoriaScreen'
import ContactoScreen from '../screens/ContactoScreen'
import { colores } from '../theme/colores'
import { useCarrito } from '../context/CarritoContext'

const Tabs = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function NavegacionPrincipal() {
  const { cantidadTotal } = useCarrito()

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colores.primarioOscuro,
        tabBarInactiveTintColor: colores.secundaria,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 3 },
        tabBarBadge: route.name === 'Carrito' && cantidadTotal > 0
          ? (cantidadTotal > 99 ? '99+' : cantidadTotal)
          : undefined,
        tabBarBadgeStyle: {
          color: colores.tinta,
          backgroundColor: colores.primario,
          fontSize: 10,
          fontWeight: '800',
        },
        tabBarStyle: {
          borderTopColor: colores.linea,
          backgroundColor: colores.superficie,
        },
        tabBarIcon: ({ color, size }) => {
          const iconos = { Tienda: 'grid', Carrito: 'shopping-cart', Cuenta: 'user' }
          return <Feather name={iconos[route.name]} size={size} color={color} />
        },
      })}
    >
      <Tabs.Screen name="Tienda" component={TiendaScreen} options={{ title: 'Tienda' }} />
      <Tabs.Screen name="Carrito" component={CarritoScreen} options={{ title: 'Carrito' }} />
      <Tabs.Screen name="Cuenta" component={CuentaScreen} options={{ title: 'Cuenta' }} />
    </Tabs.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Principal" component={NavegacionPrincipal} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="EditarProducto" component={EditarProductoScreen} />
      <Stack.Screen name="NuestraHistoria" component={HistoriaScreen} />
      <Stack.Screen name="Contactanos" component={ContactoScreen} />
    </Stack.Navigator>
  )
}
