
import type { Amenity, FaqItem, Incident, Charge, Announcement, UserCondoProfile, AmenityBooking, VisitorPass, Parcel, Assembly, Notification, NotificationPref, Role } from "./types";

export const mockAdmin: UserCondoProfile = {
    id: 'user_admin',
    userId: 'user_admin',
    condoId: 'condo_1',
    name: 'Admin General',
    email: 'admin@habitat.com',
    role: 'ADMIN_INT',
    units: [],
    imageUrl: 'https://i.pravatar.cc/150?u=admin',
    unitIds: [],
    occupantType: 'OWNER',
    isVotingMember: false,
};

export const mockUser: UserCondoProfile = {
    id: 'user_123',
    userId: 'user_123',
    condoId: 'condo_1',
    name: 'Residente Conectado',
    email: 'residente@habitat.com',
    role: 'RESIDENT',
    units: [{ id: 'unit_101', condoId: 'condo_1', code: 'A-101', tower: 'A', number: '101', type: 'APARTMENT', isActive: true }],
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

// No mock data for Incidents, will be read from Firestore

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

export const mockCharges: Charge[] = [
  {
    id: 'chg_1',
    condoId: 'condo_1',
    unitId: 'unit_101',
    type: 'MAINTENANCE',
    description: 'Cuota de Mantenimiento - Mes Actual',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_2',
    condoId: 'condo_1',
    unitId: 'unit_101',
    type: 'MAINTENANCE',
    description: 'Cuota de Mantenimiento - Mes Anterior',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_3',
    condoId: 'condo_1',
    unitId: 'unit_101',
    type: 'AMENITY',
    description: 'Depósito en garantía - Reserva de Asadores',
    amount: 500,
    currency: 'MXN',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chg_4',
    condoId: 'condo_1',
    unitId: 'unit_101',
    type: 'MAINTENANCE',
    description: 'Cuota de Mantenimiento - Hace dos meses',
    amount: 2200,
    currency: 'MXN',
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 10).toISOString(),
    status: 'SETTLED',
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
        createdBy: 'admin_user',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT'],
        pinned: true,
        category: 'Mantenimiento'
    },
    {
        id: 'ann_2',
        condoId: 'condo_1',
        title: 'Recordatorio de Pago de Mantenimiento',
        body: 'Les recordamos que la fecha límite para el pago de la cuota de mantenimiento es el día 10 de cada mes. Evite recargos realizando su pago a tiempo a través de la app.',
        createdBy: 'admin_user',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT'],
        pinned: false,
        category: 'Administrativo'
    },
    {
        id: 'ann_3',
        condoId: 'condo_1',
        title: 'Clase de Yoga en el Jardín',
        body: '¡Este sábado tendremos una clase de yoga gratuita para todos los residentes en el jardín central a las 8:00 am! No olviden traer su tapete.',
        createdBy: 'admin_user',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        visibleToRoles: ['RESIDENT', 'ADMIN_INT', 'ADMIN_EXT'],
        pinned: false,
        category: 'Eventos'
    }
];

export const mockAssemblies: Assembly[] = [
    {
        id: 'asm_1',
        condoId: 'condo_1',
        title: 'Asamblea General Ordinaria',
        description: 'Revisión de presupuesto anual, elección de nuevo comité y asuntos generales.',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        status: 'OPEN',
    },
    {
        id: 'asm_2',
        condoId: 'condo_1',
        title: 'Asamblea Extraordinaria - Reparación Elevador',
        description: 'Análisis y aprobación de cotización para reparación mayor del elevador de la Torre B.',
        scheduledAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
        status: 'ARCHIVED',
    }
];

export const mockBookings: AmenityBooking[] = [
    { 
        id: 'book_1',
        condoId: 'condo_1',
        amenityId: 'sum',
        userId: 'user_123',
        unitId: 'unit_101',
        start: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

// No mock data for VisitorPasses, will be read from Firestore
// No mock data for Parcels, will be read from Firestore


export const mockNotifications: Notification[] = [
    { id: 'n1', condoId: 'condo_1', userId: 'user_123', title: 'Paquete Recibido', body: 'Tu paquete de Amazon ha llegado a conserjería.', channel: 'IN_APP', sentAt: new Date().toISOString(), category: 'parcels' },
    { id: 'n2', condoId: 'condo_1', userId: 'user_123', title: 'Corte de Agua Programado', body: 'El próximo viernes se realizará un corte de 9:00 a 14:00.', channel: 'IN_APP', sentAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), category: 'announcement' },
    { id: 'n3', condoId: 'condo_1', userId: 'user_123', title: 'Ticket #inc_002 actualizado', body: 'Tu ticket "Falla en puerta de acceso vehicular" está ahora "En Progreso".', channel: 'IN_APP', sentAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), readAt: new Date().toISOString(), category: 'maintenance' },
    { id: 'n4', condoId: 'condo_1', userId: 'user_123', title: '¡Gracias por votar!', body: 'Tu voto en la asamblea ha sido registrado.', channel: 'IN_APP', sentAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), readAt: new Date().toISOString(), category: 'community' },
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
