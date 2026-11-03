/* ==========================================================================
   TOP1WEBS · CONFIGURACIÓN
   --------------------------------------------------------------------------
   Todo lo que suele cambiar está aquí: contacto, precios, planes, extras de
   la calculadora, preguntas del test y conexión del formulario.
   Edite los valores entre comillas o los números y guarde el archivo.
   ========================================================================== */

window.TOP1 = {

  /* ---- Contacto ---------------------------------------------------------
     Datos tomados de su folleto y su tarjeta (el número de WhatsApp es el
     que lleva el código QR del folleto). Cámbielos aquí y se actualizan en
     toda la web: cabecera, botones, pie y botón flotante de WhatsApp.      */
  contacto: {
    telefono: "691 29 36 67",          // Cómo se ve escrito en la web
    telefonoEnlace: "+34691293667",    // Para el enlace "Llamar" (con prefijo, sin espacios)
    whatsapp: "34691293667",           // Solo números, con prefijo de país, sin "+" ni espacios
    mensajeWhatsapp: "Hola, me interesa la web de prueba para mi negocio",
    email: "top1webs@gmail.com"
  },

  /* ---- Avisos de "editable" ---------------------------------------------
     true  → muestra etiquetas amarillas junto a los datos de ejemplo o
             propuestos (precios Pro/Premium, extras, etc.) para revisarlos.
     false → las oculta. Póngalo en false antes de publicar la web.          */
  mostrarAvisosEditables: false,

  /* ---- Planes -------------------------------------------------------------
     El precio Básico (300 €) es el precio base real del servicio.
     Los precios de Pro y Premium son PROPUESTAS: revíselos.
     "paginas", "extras" e "idiomas" sirven para que la calculadora y el test
     sepan qué incluye cada plan.                                            */
  planes: [
    {
      id: "basico",
      nombre: "Básico",
      precio: 300,
      propuesta: false,
      resumen: "Una web de una página, clara y bonita, para que le encuentren y le contacten.",
      paginas: 1, extras: [], idiomas: 0,
      incluye: [
        "Web de una página con sus secciones principales",
        "Diseño adaptado a móvil, tableta y ordenador",
        "Botones de llamada, WhatsApp y email",
        "Mapa y cómo llegar",
        "Lista en un máximo de 3 días"
      ]
    },
    {
      id: "pro",
      nombre: "Pro",
      precio: 450,
      propuesta: true,
      destacado: true,
      etiqueta: "Recomendado",
      resumen: "Más espacio para contar lo que hace: varias páginas, galería y formulario.",
      paginas: 4, extras: ["formulario", "galeria"], idiomas: 0,
      incluye: [
        "Todo lo del plan Básico",
        "Hasta 4 páginas",
        "Galería de fotos",
        "Formulario de contacto",
        "Lista en un máximo de 3 días"
      ]
    },
    {
      id: "premium",
      nombre: "Premium",
      precio: 650,
      propuesta: true,
      resumen: "Para negocios que quieren recibir reservas o citas y atender en otro idioma.",
      paginas: 6, extras: ["formulario", "galeria", "reservas", "qr"], idiomas: 1,
      incluye: [
        "Todo lo del plan Pro",
        "Hasta 6 páginas",
        "Formulario de reservas o citas",
        "Web en un segundo idioma",
        "Carta o catálogo digital con código QR",
        "Lista en un máximo de 3 días"
      ]
    }
  ],

  /* ---- Tabla comparativa ----------------------------------------------------
     true = incluido · false = no incluido · texto = se muestra tal cual.    */
  comparativa: [
    { texto: "Páginas", basico: "1", pro: "Hasta 4", premium: "Hasta 6" },
    { texto: "Diseño adaptado a móvil", basico: true, pro: true, premium: true },
    { texto: "Botones de llamada, WhatsApp y email", basico: true, pro: true, premium: true },
    { texto: "Mapa y cómo llegar", basico: true, pro: true, premium: true },
    { texto: "Enlaces a sus redes sociales", basico: true, pro: true, premium: true },
    { texto: "Galería de fotos", basico: false, pro: true, premium: true },
    { texto: "Formulario de contacto", basico: false, pro: true, premium: true },
    { texto: "Formulario de reservas o citas", basico: false, pro: false, premium: true },
    { texto: "Segundo idioma", basico: false, pro: false, premium: true },
    { texto: "Carta o catálogo digital con QR", basico: "Extra", pro: "Extra", premium: true },
    { texto: "Web de prueba sin compromiso", basico: true, pro: true, premium: true },
    { texto: "Plazo de entrega", basico: "Hasta 3 días", pro: "Hasta 3 días", premium: "Hasta 3 días" },
    { texto: "Forma de pago", basico: "Pago único", pro: "Pago único", premium: "Pago único" }
  ],

  /* ---- Calculadora de presupuesto -------------------------------------------
     Precios ORIENTATIVOS (propuesta). Cambie los números libremente.
     Para añadir un extra, copie una línea de "extras" y cambie id, nombre,
     descripción y precio.                                                    */
  calculadora: {
    precioBase: 300,          // Incluye la primera página
    precioPaginaExtra: 40,    // Cada página adicional
    maxPaginas: 10,
    precioIdioma: 60,         // Cada idioma adicional
    maxIdiomas: 3,
    extras: [
      { id: "formulario", nombre: "Formulario de contacto", descripcion: "Para que le escriban desde la web.", precio: 30 },
      { id: "galeria", nombre: "Galería de fotos", descripcion: "Su local, sus productos o sus trabajos.", precio: 30 },
      { id: "reservas", nombre: "Reservas o citas", descripcion: "Formulario para pedir mesa, cita o turno.", precio: 80 },
      { id: "qr", nombre: "Carta o catálogo con código QR", descripcion: "Su carta, catálogo o lista de precios en el móvil, con un QR para imprimir.", precio: 40 }
    ]
  },

  /* ---- Test "¿Qué web necesita?" ---------------------------------------------
     Cada respuesta suma puntos. Con el total se recomienda un plan según
     "recomendacion" (hasta X puntos → plan). "nota" aparece en el resultado.
     "requiere" (formulario, galeria, reservas o idioma): si el plan
     recomendado no lo incluye, se sugiere como extra.                       */
  test: {
    preguntas: [
      {
        pregunta: "¿Qué quiere contar en su web?",
        opciones: [
          { texto: "Lo esencial: quiénes somos, qué ofrecemos y cómo contactar", puntos: 0 },
          { texto: "Algo más: varias secciones, fotos y algo de historia", puntos: 1, nota: "Varias secciones y fotos" },
          { texto: "Bastante: varias páginas con mucho contenido", puntos: 2, nota: "Mucho contenido repartido en varias páginas" }
        ]
      },
      {
        pregunta: "¿Cómo quiere que le contacten sus clientes?",
        opciones: [
          { texto: "Me basta con que me llamen o me escriban por WhatsApp", puntos: 0 },
          { texto: "Quiero un formulario de contacto", puntos: 1, nota: "Formulario de contacto", requiere: "formulario" },
          { texto: "Quiero que puedan reservar o pedir cita desde la web", puntos: 2, nota: "Reservas o citas desde la web", requiere: "reservas" }
        ]
      },
      {
        pregunta: "¿Atiende a clientes que hablan otros idiomas?",
        opciones: [
          { texto: "No, casi todos hablan español", puntos: 0 },
          { texto: "A veces", puntos: 1 },
          { texto: "Sí, a menudo", puntos: 2, nota: "Web en un segundo idioma", requiere: "idioma" }
        ]
      },
      {
        pregunta: "¿Qué es lo más importante para usted ahora?",
        opciones: [
          { texto: "Estar en internet cuanto antes, con lo justo", puntos: 0 },
          { texto: "Un buen equilibrio entre precio y funciones", puntos: 1 },
          { texto: "Tener la web más completa desde el principio", puntos: 2 }
        ]
      }
    ],
    recomendacion: [
      { hasta: 2, plan: "basico", texto: "Con una web de una página bien hecha tendrá todo lo que necesita para que le encuentren y le contacten." },
      { hasta: 5, plan: "pro", texto: "Necesita algo más de espacio: varias páginas, fotos y un formulario para que le escriban." },
      { hasta: 8, plan: "premium", texto: "Su negocio sacará partido a las reservas o citas online y a tener la web en otro idioma." }
    ]
  },

  /* ---- Formulario de encargo -------------------------------------------------
     Vacío ("") = modo demostración: valida los datos, pero no los envía, y
     ofrece mandarlos por WhatsApp o email.
     Para recibirlos en su correo, cree un formulario gratuito en un servicio
     como Formspree (formspree.io) y pegue aquí su dirección, por ejemplo:
       endpoint: "https://formspree.io/f/abcdwxyz"
     Si el servicio pide una clave (p. ej. Web3Forms), añádala en camposExtra:
       camposExtra: { access_key: "SU-CLAVE" }                                 */
  formulario: {
    endpoint: "",
    camposExtra: {}
  }
};
