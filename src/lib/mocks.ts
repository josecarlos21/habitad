
import type { Amenity, FaqItem, Incident, Charge, Announcement, UserCondoProfile, AmenityBooking, VisitorPass, Parcel, Assembly, Notification, NotificationPref, Role } from "./types";

export const mockUser: UserCondoProfile = {
    id: 'user_123',
    userId: 'user_123',
    condoId: 'condo_1',
    name: 'Residente Conectado',
    email: 'residente@habitat.com',
    role: 'RESIDENT',
    units: [{ id: 'unit_101', condoId: 'condo_1', tower: 'A', number: '101', type: 'APARTMENT', isActive: true }],
    imageUrl: 'https://i.pravatar.cc/150?u=residente',
    unitIds: ['unit_101'],
    occupantType: 'OWNER',
    isVotingMember: true
};

export const mockAmenities: Amenity[] = [
    {
        id: 'sum',
        condoId: 'condo_1',
        name: 'Salón de Usos Múltiples',
        description: 'Ideal para eventos y reuniones. Equipado con mesas, sillas y proyector. Capacidad para 50 personas.',
        image: 'https://picsum.photos/seed/sum/600/400',
        requiresApproval: true,
        requiresDeposit: true,
        depositAmount: 1500,
    },
    {
        id: 'asadores',
        condoId: 'condo_1',
        name: 'Asadores',
        description: 'Zona al aire libre con parrillas y mesas. Perfecto para una tarde de parrillada con familia y amigos.',
        image: 'https://picsum.photos/seed/bbq/600/400',
        requiresApproval: true,
        requiresDeposit: true,
        depositAmount: 500,
    },
    {
        id: 'gym',
        condoId: 'condo_1',
        name: 'Gimnasio',
        description: 'Área climatizada con equipo de cardio y pesas para tu rutina de ejercicio diaria. Acceso 24/7.',
        image: 'https://picsum.photos/seed/gym/600/400',
        requiresApproval: false,
        requiresDeposit: false,
    },
    {
        id: 'alberca',
        condoId: 'condo_1',
        name: 'Alberca',
        description: 'Alberca semi-olímpica con camastros y sombrillas. Disponible de 8:00 a 22:00 hrs.',
        image: 'https://picsum.photos/seed/pool/600/400',
        requiresApproval: false,
        requiresDeposit: false,
    }
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc_001',
    condoId: 'condo_1',
    title: 'Foco quemado en pasillo Torre A, Piso 5',
    status: 'CANCELLED',
    category: 'common_area',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    unitId: 'u_101',
    createdBy: 'user_123',
    description: 'Uno de los focos del pasillo principal del piso 5, cerca del elevador, está quemado y no enciende. Solicito su reemplazo.',
    priority: 'LOW'
  },
  {
    id: 'inc_002',
    condoId: 'condo_1',
    title: 'Falla en puerta de acceso vehicular',
    status: 'IN_PROGRESS',
    category: 'common_area',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    unitId: 'u_101',
    createdBy: 'user_123',
    description: 'La pluma de la puerta de acceso vehicular no está levantando completamente y los coches tienen que pasar con mucho cuidado. Representa un riesgo.',
    priority: 'HIGH'
  },
    {
    id: 'inc_003',
    condoId: 'condo_1',
    title: 'Limpieza requerida en zona de asadores',
    status: 'OPEN',
    category: 'amenity',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    unitId: 'u_101',
    createdBy: 'user_123',
    description: 'La zona de asadores quedó muy sucia después de un evento ayer. Los botes de basura están llenos y hay restos de comida en las mesas.',
    priority: 'MEDIUM'
  },
];

export const mockFaqs: FaqItem[] = [
    {
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Puedes pagar tu mantenimiento y otras cuotas a través de tarjeta de crédito/débito, transferencia SPEI o en tiendas de conveniencia. Todos los pagos se realizan a través de la sección "Pagos" de la app.'
    },
    {
        question: '¿Cómo puedo reservar un área común?',
        answer: 'Ve a la sección "Servicios", selecciona "Reservar Amenidades" y elige el área común que deseas. Podrás ver la disponibilidad y seleccionar la fecha y hora para tu evento. Algunas áreas pueden requerir un depósito de seguridad.'
    },
    {
        question: '¿Qué hago si tengo una emergencia de mantenimiento?',
        answer: 'Para emergencias como fugas de agua mayores o fallas eléctricas generales, contacta directamente al personal de seguridad en la caseta. Para problemas no urgentes, puedes levantar un ticket en la sección "Servicios" > "Tickets de Mantenimiento".'
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

export const mockCharges: Charge[] = [
  {
    id: 'chg_1',
    condoId: 'condo_1',
    unitId: 'u_101',
    description: 'Cuota de Mantenimiento - Mes Actual',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString(),
    status: 'OPEN',
    type: 'MAINTENANCE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_2',
    condoId: 'condo_1',
    unitId: 'u_101',
    description: 'Cuota de Mantenimiento - Mes Anterior',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
    status: 'OPEN', // Should be overdue, but OPEN is a valid ChargeStatus
    type: 'MAINTENANCE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_3',
    condoId: 'condo_1',
    unitId: 'u_101',
    description: 'Depósito en garantía - Reserva de Asadores',
    amount: 500,
    currency: 'MXN',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    status: 'OPEN',
    type: 'AMENITY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_4',
    condoId: 'condo_1',
    unitId: 'u_101',
    description: 'Cuota de Mantenimiento - Hace dos meses',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 10).toISOString(),
    status: 'SETTLED',
    type: 'MAINTENANCE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockAnnouncements: Announcement[] = [
    {
        id: 'ann_1',
        condoId: 'condo_1',
        title: 'Corte de Agua Programado',
        body: 'Se informa a todos los residentes que el próximo viernes se realizará un corte en el suministro de agua de 9:00 a 14:00 hrs por mantenimiento en la cisterna principal. Agradecemos su comprensión.',
        category: 'maintenance',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        pinned: true,
        createdBy: 'admin_user',
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT']
    },
    {
        id: 'ann_2',
        condoId: 'condo_1',
        title: 'Recordatorio de Pago de Mantenimiento',
        body: 'Les recordamos que la fecha límite para el pago de la cuota de mantenimiento es el día 10 de cada mes. Evite recargos realizando su pago a tiempo a través de la app.',
        category: 'admin',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        pinned: false,
        createdBy: 'admin_user',
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT']
    },
    {
        id: 'ann_3',
        condoId: 'condo_1',
        title: 'Clase de Yoga en el Jardín',
        body: '¡Este sábado tendremos una clase de yoga gratuita para todos los residentes en el jardín central a las 8:00 am! No olviden traer su tapete.',
        category: 'event',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        pinned: false,
        createdBy: 'admin_user',
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT']
    }
];

export const mockAssemblies: Assembly[] = [
    {
        id: 'asm_1',
        condoId: 'condo_1',
        title: 'Asamblea General Ordinaria',
        date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        status: 'OPEN',
        topics: ['Revisión de presupuesto anual', 'Elección de nuevo comité', 'Asuntos generales'],
        docs: [{ name: 'Convocatoria Oficial.pdf', url: '#' }],
        vote: {
            id: 'vote_1',
            assemblyId: 'asm_1',
            question: '¿Aprueba el presupuesto presentado para el próximo año?',
            options: ['Sí, apruebo', 'No apruebo', 'Me abstengo'],
            status: 'open'
        }
    },
    {
        id: 'asm_2',
        condoId: 'condo_1',
        title: 'Asamblea Extraordinaria - Reparación Elevador',
        date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
        scheduledAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
        status: 'ARCHIVED',
        topics: ['Análisis y aprobación de cotización para reparación mayor del elevador de la Torre B.'],
        docs: [{ name: 'Minuta de la Asamblea.pdf', url: '#' }],
    }
];

export const mockBookings: AmenityBooking[] = [
    { 
        id: 'book_1',
        condoId: 'condo_1',
        amenityId: 'sum',
        userId: 'user_123',
        unitId: 'u_101',
        slot: {
            start: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
            end: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString()
        },
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const mockVisitorPasses: VisitorPass[] = [
    {
        id: 'vp_1',
        userId: 'user_123',
        visitorName: 'Juan Pérez',
        validFrom: new Date().toISOString(),
        validTo: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
        qrToken: 'qr_token_123'
    },
     {
        id: 'vp_2',
        userId: 'user_123',
        visitorName: 'Maria García',
        validFrom: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        validTo: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Expired
        qrToken: 'qr_token_456'
    }
];

export const mockParcels: Parcel[] = [
    { id: 'p_1', unitId: 'u_101', carrier: 'Mercado Libre', trackingNumber: 'ML12345', arrivedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'at_guard' },
    { id: 'p_2', unitId: 'u_101', carrier: 'Amazon', trackingNumber: 'AMZ67890', arrivedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), status: 'picked_up' },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', condoId: 'condo_1', userId: 'user_123', category: 'parcels', title: 'Paquete Recibido', description: 'Tu paquete de Amazon ha llegado a conserjería.', createdAt: new Date().toISOString(), sentAt: new Date().toISOString(), read: false, channel: 'IN_APP', body: 'Tu paquete de Amazon ha llegado a conserjería.' },
    { id: 'n2', condoId: 'condo_1', userId: 'user_123', category: 'announcement', title: 'Corte de Agua Programado', description: 'El próximo viernes se realizará un corte de 9:00 a 14:00.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), sentAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), read: false, channel: 'IN_APP', body: 'El próximo viernes se realizará un corte de 9:00 a 14:00.' },
    { id: 'n3', condoId: 'condo_1', userId: 'user_123', category: 'maintenance', title: 'Ticket #inc_002 actualizado', description: 'Tu ticket "Falla en puerta de acceso vehicular" está ahora "En Progreso".', createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), sentAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), read: true, channel: 'IN_APP', body: 'Tu ticket "Falla en puerta de acceso vehicular" está ahora "En Progreso".' },
    { id: 'n4', condoId: 'condo_1', userId: 'user_123', category: 'community', title: '¡Gracias por votar!', description: 'Tu voto en la asamblea ha sido registrado.', createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), sentAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), read: true, channel: 'IN_APP', body: 'Tu voto en la asamblea ha sido registrado.' },
];

export const mockNotificationPrefs: NotificationPref = {
    userId: 'user_123',
    channels: {
        push: true,
        email: true,
    },
    categories: {
        finance: true,
        security: true,
        bookings: false,
        maintenance: true,
        community: true,
    }
};
