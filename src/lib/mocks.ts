
import type { Amenity, FaqItem, Ticket, Invoice } from "./types";

export const amenities: Amenity[] = [
    {
        id: 'sum',
        name: 'Salón de Usos Múltiples',
        description: 'Ideal para eventos y reuniones. Equipado con mesas, sillas y proyector. Capacidad para 50 personas.',
        image: '/images/amenities/sum.jpg',
        requiresDeposit: true,
        depositAmount: 1500,
    },
    {
        id: 'asadores',
        name: 'Asadores',
        description: 'Zona al aire libre con parrillas y mesas. Perfecto para una tarde de parrillada con familia y amigos.',
        image: '/images/amenities/bbq.jpg',
        requiresDeposit: true,
        depositAmount: 500,
    },
    {
        id: 'gym',
        name: 'Gimnasio',
        description: 'Área climatizada con equipo de cardio y pesas para tu rutina de ejercicio diaria. Acceso 24/7.',
        image: '/images/amenities/gym.jpg',
        requiresDeposit: false,
    },
    {
        id: 'alberca',
        name: 'Alberca',
        description: 'Alberca semi-olímpica con camastros y sombrillas. Disponible de 8:00 a 22:00 hrs.',
        image: '/images/amenities/pool.jpg',
        requiresDeposit: false,
    }
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Foco quemado en pasillo Torre A, Piso 5',
    status: 'Resuelto',
    priority: 'Baja',
    createdAt: '2023-10-28T10:00:00Z',
    updatedAt: '2023-10-29T11:00:00Z',
    area: 'Áreas Comunes',
    description: 'Uno de los focos del pasillo principal del piso 5, cerca del elevador, está quemado y no enciende. Solicito su reemplazo.',
    history: [
      { status: 'Resuelto', date: '2023-10-29T11:00:00Z', comments: 'El equipo de mantenimiento cambió el foco. Ticket cerrado.' },
      { status: 'En Progreso', date: '2023-10-28T14:00:00Z', comments: 'Ticket asignado a personal de mantenimiento.' },
      { status: 'Abierto', date: '2023-10-28T10:00:00Z', comments: 'Ticket creado por el residente.' },
    ]
  },
  {
    id: 'TKT-002',
    title: 'Falla en puerta de acceso vehicular',
    status: 'En Progreso',
    priority: 'Alta',
    createdAt: '2023-10-30T09:30:00Z',
    updatedAt: '2023-10-30T10:00:00Z',
    area: 'Accesos',
    description: 'La pluma de la puerta de acceso vehicular no está levantando completamente y los coches tienen que pasar con mucho cuidado. Representa un riesgo.',
    history: [
      { status: 'En Progreso', date: '2023-10-30T10:00:00Z', comments: 'Se ha contactado al proveedor externo para la reparación. Se espera su llegada en las próximas 3 horas.' },
      { status: 'Abierto', date: '2023-10-30T09:30:00Z', comments: 'Ticket creado por el residente.' },
    ]
  },
    {
    id: 'TKT-003',
    title: 'Limpieza requerida en zona de asadores',
    status: 'Abierto',
    priority: 'Media',
    createdAt: '2023-10-31T12:00:00Z',
    updatedAt: '2023-10-31T12:00:00Z',
    area: 'Amenidades',
    description: 'La zona de asadores quedó muy sucia después de un evento ayer. Los botes de basura están llenos y hay restos de comida en las mesas.',
    history: [
        { status: 'Abierto', date: '2023-10-31T12:00:00Z', comments: 'Ticket creado por el residente.' }
    ]
  },
];

export const mockFaqs: FaqItem[] = [
    {
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Puedes pagar tu mantenimiento y otras cuotas a través de tarjeta de crédito/débito, transferencia SPEI o en tiendas de conveniencia. Todos los pagos se realizan a través de la sección "Pagos" de la app.'
    },
    {
        question: '¿Cómo puedo reservar un área común?',
        answer: 'Ve a la sección "Servicios", selecciona "Reservas" y elige el área común que deseas. Podrás ver la disponibilidad y seleccionar la fecha y hora para tu evento. Algunas áreas pueden requerir un depósito de seguridad.'
    },
    {
        question: '¿Qué hago si tengo una emergencia de mantenimiento?',
        answer: 'Para emergencias como fugas de agua mayores o fallas eléctricas generales, contacta directamente al personal de seguridad en la caseta. Para problemas no urgentes, puedes levantar un ticket en la sección "Servicios" > "Mantenimiento".'
    },
    {
        question: '¿Cómo funciona el acceso para visitantes?',
        answer: 'En la sección "Accesos", puedes generar un pase de visitante con código QR. Simplemente ingresa el nombre de tu visita y la validez del pase. Tu visitante deberá mostrar el código QR en la entrada para poder acceder.'
    },
    {
        question: '¿Dónde puedo consultar los avisos importantes?',
        answer: 'Todos los comunicados de la administración se publican en la sección "Comunidad" > "Avisos". También recibirás notificaciones push para los anuncios más importantes.'
    }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2023-11',
    unitId: 'A-101',
    concept: 'Cuota de Mantenimiento - Noviembre 2023',
    amount: 2200,
    currency: 'MXN',
    dueDate: '2023-11-10',
    status: 'paid',
  },
  {
    id: 'INV-2023-12',
    unitId: 'A-101',
    concept: 'Cuota de Mantenimiento - Diciembre 2023',
    amount: 2200,
    currency: 'MXN',
    dueDate: '2023-12-10',
    status: 'pending',
  },
  {
    id: 'DEP-ASAD-01',
    unitId: 'A-101',
    concept: 'Depósito en garantía - Reserva de Asadores',
    amount: 500,
    currency: 'MXN',
    dueDate: '2023-12-05',
    status: 'pending',
  },
  {
    id: 'INV-2023-10',
    unitId: 'A-101',
    concept: 'Cuota de Mantenimiento - Octubre 2023',
    amount: 2200,
    currency: 'MXN',
    dueDate: '2023-10-10',
    status: 'overdue',
  }
];
