import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startTour = (pathname: string) => {
  const commonSteps = [
    {
      element: '#tour-logo',
      popover: {
        title: 'Bienvenido a Confort & Estilo',
        description: 'Estamos encantados de tenerte aquí. Permítenos mostrarte cómo navegar por nuestra plataforma.',
        side: 'bottom' as const,
        align: 'start' as const,
      },
    },
    {
      element: '#tour-nav-inicio',
      popover: {
        title: 'Panel Principal',
        description: 'Vuelve aquí en cualquier momento para ver las últimas novedades y servicios.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-nav-referencias',
      popover: {
        title: 'Nuestros Productos',
        description: 'Explora nuestra colección de muebles artesanales y piezas únicas.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-nav-servicios',
      popover: {
        title: 'Servicios Especiales',
        description: 'Desde diseño a medida hasta restauración. Mira todo lo que podemos hacer por ti.',
        side: 'bottom' as const,
      },
    },
  ];

  const userMenuSteps = [
    {
      element: '#tour-perfil',
      popover: {
        title: 'Tu Perfil',
        description: 'Gestiona tus datos personales y preferencias.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-cart',
      popover: {
        title: 'Tu Carrito',
        description: 'Revisa los productos que has seleccionado y procede al pago.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-pedidos',
      popover: {
        title: 'Tus Pedidos',
        description: 'Sigue el estado de tus compras y servicios contratados.',
        side: 'bottom' as const,
      },
    },
  ];

  const homeSteps = [
    {
      element: '#tour-hero-cta',
      popover: {
        title: 'Agenda una Cita',
        description: '¿Tienes una idea? Agenda una cita gratuita con nuestros expertos para empezar tu proyecto.',
        side: 'top' as const,
      },
    },
    {
      element: '#tour-services-grid',
      popover: {
        title: 'Nuestras Especialidades',
        description: 'Echa un vistazo rápido a nuestros servicios principales.',
        side: 'top' as const,
      },
    },
  ];

  const productsSteps = [
    {
      element: '#tour-search',
      popover: {
        title: 'Buscador Inteligente',
        description: '¿Tienes algo en mente? Búscalo por nombre o palabras clave aquí.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-categories',
      popover: {
        title: 'Explora Categorías',
        description: 'Filtra por tipo de mueble para encontrar exactamente lo que necesitas para tu hogar.',
        side: 'right' as const,
      },
    },
    {
      element: '#tour-product-card-0',
      popover: {
        title: 'Selecciona una Referencia',
        description: 'Cuando encuentres un diseño que te guste, haz clic en él para ver sus detalles y opciones de personalización.',
        side: 'top' as const,
      },
    },
    {
      element: '#tour-product-custom-request',
      popover: {
        title: '¿Buscas algo único?',
        description: 'Si ninguna referencia te convence, puedes solicitar un diseño totalmente personalizado desde aquí.',
        side: 'top' as const,
      },
    },
  ];

  const productDetailSteps = [
    {
      element: '#tour-product-info',
      popover: {
        title: 'Detalles de la Pieza',
        description: 'Aquí puedes ver la descripción y materiales base de este diseño artesanal.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-product-qty',
      popover: {
        title: 'Cantidad',
        description: 'Selecciona cuántas unidades de esta pieza deseas incluir en tu cotización.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-product-customize-toggle',
      popover: {
        title: 'Personalización Total',
        description: '¿Quieres un color o material diferente? Activa esta opción para decirnos exactamente qué prefieres.',
        side: 'top' as const,
      },
    },
    {
      element: '#tour-product-standard-colors',
      popover: {
        title: 'Acabados Disponibles',
        description: 'Si prefieres el diseño estándar, elige uno de nuestros colores recomendados.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-product-size',
      popover: {
        title: 'Ajuste de Medidas',
        description: 'Opcionalmente, puedes indicarnos dimensiones específicas para que el mueble encaje perfecto en tu espacio.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-product-add-cart',
      popover: {
        title: 'Siguiente Paso',
        description: 'Agrega tu selección al carrito. Podrás seguir navegando o proceder a solicitar el presupuesto.',
        side: 'top' as const,
      },
    },
  ];

  const cartSteps = [
    {
      element: '#tour-cart-list',
      popover: {
        title: 'Tu Selección',
        description: 'Aquí verás todos los productos y especificaciones personalizadas que has elegido.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-cart-clear',
      popover: {
        title: 'Limpiar Carrito',
        description: 'Si deseas reiniciar tu pedido, puedes vaciar todo con este botón.',
        side: 'top' as const,
      },
    },
    {
      element: '#tour-cart-submit',
      popover: {
        title: 'Solicitar Presupuesto',
        description: 'Finaliza el proceso enviándonos tu solicitud. Te contactaremos con el presupuesto detallado en menos de 24h.',
        side: 'top' as const,
      },
    },
  ];

  const bookingSteps = [
    {
      element: '#tour-booking-contact',
      popover: {
        title: 'Datos de Contacto',
        description: 'Si no has iniciado sesión, por favor indícanos tu nombre y correo para contactarte.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-booking-address',
      popover: {
        title: '¿A dónde vamos?',
        description: 'Ingresa la dirección exacta donde nuestro equipo realizará la asesoría.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-booking-description',
      popover: {
        title: 'Tu idea',
        description: 'Cuéntanos brevemente qué necesitas (ej: cambio de telas, diseño de sala, etc.).',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-booking-calendar',
      popover: {
        title: '1. Elige el Día',
        description: 'Selecciona una fecha disponible en nuestro calendario.',
        side: 'right' as const,
      },
    },
    {
      element: '#tour-booking-time',
      popover: {
        title: '2. Elige la Hora',
        description: 'Despues de elegir el día, selecciona una de las franjas horarias disponibles.',
        side: 'top' as const,
      },
    },
    {
      element: '#tour-booking-submit',
      popover: {
        title: '3. Finalizar',
        description: '¡Listo! Haz clic en Agendar Visita para confirmar tu solicitud.',
        side: 'top' as const,
      },
    },
  ];

  const loginSteps = [
    {
      element: '#tour-login-email',
      popover: {
        title: 'Tu Correo',
        description: 'Ingresa el correo asociado a tu cuenta.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-login-password',
      popover: {
        title: 'Tu Contraseña',
        description: 'Tu clave de seguridad personal.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-login-submit',
      popover: {
        title: 'Acceder',
        description: 'Inicia sesión para gestionar tus pedidos y favoritos.',
        side: 'top' as const,
      },
    },
  ];

  const registerSteps = [
    {
      element: '#tour-register-name',
      popover: {
        title: 'Tu Nombre',
        description: 'Para brindarte una atención personalizada.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-register-email',
      popover: {
        title: 'Correo Electrónico',
        description: 'Donde recibirás tus cotizaciones y actualizaciones.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-register-password',
      popover: {
        title: 'Nueva Contraseña',
        description: 'Crea una clave segura para tu cuenta.',
        side: 'bottom' as const,
      },
    },
    {
      element: '#tour-register-submit',
      popover: {
        title: 'Crear Cuenta',
        description: '¡Bienvenido a la familia Confort & Estilo!',
        side: 'top' as const,
      },
    },
  ];

  let steps: any[] = [...commonSteps];

  if (pathname === '/client') {
    steps = [...steps, ...homeSteps];
  } else if (pathname === '/client/productos') {
    steps = [...steps, ...productsSteps];
  } else if (pathname.startsWith('/client/productos/')) {
    steps = [...steps, ...productDetailSteps];
  } else if (pathname === '/client/carrito') {
    steps = [...steps, ...cartSteps];
  } else if (pathname === '/client/agendarcita') {
    steps = [...steps, ...bookingSteps];
  } else if (pathname === '/client/auth/login') {
    steps = [...loginSteps];
  } else if (pathname === '/client/auth/register') {
    steps = [...registerSteps];
  }

  // Add user menu steps if not on auth pages
  if (!pathname.includes('/auth/')) {
    steps = [...steps, ...userMenuSteps];
  }

  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Listo',
    steps: steps,
  });

  driverObj.drive();
};
