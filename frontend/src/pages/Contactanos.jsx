import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Header from '../components/Header'
import { contactoSchema } from '../utils/validaciones'

const valoresInicialesFormulario = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  mensaje: '',
}

export default function Contactanos() {
  const [enviado, setEnviado] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactoSchema),
    defaultValues: valoresInicialesFormulario,
  })

  const onSubmit = () => {
    setEnviado(true)
    reset(valoresInicialesFormulario)
  }

  return (
    <div className="pagina-tiempo-real">
      <Header paginaActiva="contacto" />

      <div className="page-shell contact-page">
        <div className="page-card">
          <h1>Contáctanos</h1>

          <h2 className="contactanosh2">Mensajeenos por las Redes Sociales</h2>
          <div className="redes-sociales">
            <button className="boton-redes" type="button"><i className="fa-brands fa-instagram icoinstagram" /> Instagram</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-facebook icofacebook" /> Facebook</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-whatsapp icowhatsapp" /> Whatsapp</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-telegram icotelegram" /> Telegram</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-tiktok icotiktok" /> Tiktok</button>
          </div>

          <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="nombreyapellido">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" {...register('nombre')} />
              {errors.nombre && <small role="alert">{errors.nombre.message}</small>}
            </div>

            <div className="apellido">
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" {...register('apellido')} />
              {errors.apellido && <small role="alert">{errors.apellido.message}</small>}
            </div>

            <div className="email">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email')} />
              {errors.email && <small role="alert">{errors.email.message}</small>}
            </div>

            <div className="telefono">
              <label htmlFor="telefono">Número de teléfono</label>
              <input id="telefono" type="tel" {...register('telefono')} />
              {errors.telefono && <small role="alert">{errors.telefono.message}</small>}
            </div>

            <div className="mensaje">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" rows="5" {...register('mensaje')} />
              {errors.mensaje && <small role="alert">{errors.mensaje.message}</small>}
            </div>

            <button type="submit" className="submit-btn">Enviar</button>
            <button type="button" className="submit-btn secondary" onClick={() => { reset(valoresInicialesFormulario); setEnviado(false) }}>Borrar</button>
            {enviado && <p className="success-msg">Tu mensaje fue enviado correctamente.</p>}
          </form>

          <h2 className="contactanosh2 mt-4">Ubicación</h2>
          <p>Suipacha 559, CABA, Buenos aires</p>
          <p>Lunes a Viernes de 10 a 18 hs.</p>
          <div className="mapa">
            <iframe
              title="Mapa de Bicileal"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6568.184639622229!2d-58.37955661515478!3d-34.60182696176064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1683867814842!5m2!1ses!2sar"
              width="600"
              height="450"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
