import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import Encabezado from '../components/Encabezado'
import { Boton } from '../components/Controles'
import { colores } from '../theme/colores'

const imagenHistoria = require('../../assets/nuestrahistoria.jpg')

export default function HistoriaScreen({ navigation }) {
  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Nuestra historia" subtitulo="Más de dos décadas pedaleando juntos." />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <Image source={imagenHistoria} resizeMode="cover" style={estilos.imagen} />
        <View style={estilos.tarjeta}>
          <Text style={estilos.parrafo}>
            Nuestra historia comenzó hace más de 20 años, cuando un grupo de amigos apasionados por las bicicletas se unieron para fundar nuestra empresa. En aquellos tiempos, el ciclismo estaba empezando a tomar fuerza en nuestro país, y nos dimos cuenta de que había una oportunidad para ofrecer productos de calidad a precios accesibles.
          </Text>
          <Text style={estilos.parrafo}>
            Nosotros mismos éramos ciclistas apasionados y conocíamos bien las necesidades del mercado. Así que empezamos a diseñar y fabricar nuestras propias bicicletas, con el objetivo de ofrecer una alternativa de calidad a las marcas más conocidas; con el tiempo, nuestra empresa fue creciendo y expandiendo su presencia en el mercado.
          </Text>
          <Text style={estilos.parrafo}>
            Hoy en día, somos una de las mayores distribuidoras de bicicletas del país, ofreciendo una amplia variedad de modelos para todo tipo de ciclistas. Pero lo que no ha cambiado a lo largo de todos estos años es nuestro compromiso con la calidad y el servicio al cliente.
          </Text>
        </View>
        <Boton titulo="Ver bicicletas" onPress={() => navigation.navigate('Principal', { screen: 'Tienda' })} />
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 28, gap: 14 },
  imagen: { width: '100%', height: 220, borderRadius: 22, backgroundColor: colores.primarioClaro },
  tarjeta: { padding: 18, borderRadius: 20, backgroundColor: colores.superficie, gap: 15 },
  parrafo: { color: colores.secundaria, fontSize: 14, lineHeight: 23 },
})
