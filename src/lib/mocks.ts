
import type { FaqItem, UserCondoProfile, NotificationPref, Role } from "./types";

export const mockAdmin: UserCondoProfile = {
    id: 'user_admin',
    userId: 'user_admin',
    condoId: 'condo_1',
    name: 'Admin General',
    email: 'admin@habitat.com',
    role: 'ADMIN_INT',
    units: [], // Admins might not be associated with a specific unit
    imageUrl: 'https://i.pravatar.cc/150?u=admin',
    unitIds: [],
    occupantType: 'OWNER', // Or another appropriate type
    isVotingMember: false,
};

export const mockUser: UserCondoProfile = {
    id: 'user_123',
    userId: 'user_123',
    condoId: 'condo_1',
    name: 'Residente Conectado',
    email: 'residente@habitat.com',
    role: 'RESIDENT',
    units: [{ id: 'unit_101', condoId: 'condo_1', code: 'A-101', type: 'APARTMENT', isActive: true, areaM2: 90, tower: 'A', number: '101' }],
    imageUrl: 'https://i.pravatar.cc/150?u=residente',
    unitIds: ['unit_101'],
    occupantType: 'OWNER',
    isVotingMember: true
};

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
        answer: 'Para emergencias como fugas de agua mayores o fallas eléctricas generales, contacta directamente al personal de seguridad en la caseta. Para problemas no urgentes, puedes levantar un ticket en la sección "Mantenimiento".'
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
