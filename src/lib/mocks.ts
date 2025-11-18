import type { User, Unit, Invoice, Ticket, Amenity, Booking, Parcel, Announcement, VisitorPass, Assembly } from './types';

export const units: Unit[] = [
    { id: 'u_101', tower: 'A', number: '101' },
    { id: 'u_102', tower: 'A', number: '102' },
];

export const user: User = {
    id: 'user_1_live',
    name: 'Residente Conectado',
    email: 'residente@habitat.com',
    phone: '555 555 5555',
    units: [{ tower: 'A', number: '101' }],
    imageUrl: 'https://i.pravatar.cc/150?u=user_1_live',
    role: 'resident',
};


export const invoices: Invoice[] = [
    { id: 'inv_1', unitId: 'u_101', concept: 'Mantenimiento Noviembre 2025', amount: 2450.00, currency: 'MXN', dueDate: '2025-11-30T23:59:59Z', status: 'pending' },
    { id: 'inv_2', unitId: 'u_101', concept: 'Cuota Extra Gimnasio', amount: 300.00, currency: 'MXN', dueDate: '2025-11-20T23:59:59Z', status: 'overdue' },
    { id: 'inv_3', unitId: 'u_101', concept: 'Mantenimiento Octubre 2025', amount: 2450.00, currency: 'MXN', dueDate: '2025-10-31T23:59:59Z', status: 'paid' },
    { id: 'inv_4', unitId: 'u_101', concept: 'Mantenimiento Septiembre 2025', amount: 2450.00, currency: 'MXN', dueDate: '2025-09-30T23:59:59Z', status: 'paid' },
];

export const tickets: Ticket[] = [
    { id: 't_1', unitId: 'u_101', category: 'plumbing', title: 'Fuga de agua en lavabo de baño', description: 'La llave de agua fría del lavabo principal tiene un goteo constante.', status: 'open', createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
    { id: 't_2', unitId: 'u_101', category: 'common_area', title: 'Luz parpadeante en pasillo piso 1', description: 'Una de las lámparas del corredor del primer piso no funciona correctamente.', status: 'in_progress', createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { id: 't_3', unitId: 'u_101', category: 'electrical', title: 'Contacto no funciona', description: 'El enchufe de la pared de la sala no tiene corriente.', status: 'resolved', createdAt: '2025-10-15T10:00:00Z' },
];

export const amenities: Amenity[] = [
    { id: 'a_1', name: 'Salón de Usos Múltiples', description: 'Ideal para tus eventos y reuniones. Capacidad para 50 personas.', image: 'https://picsum.photos/seed/amenity1/600/400', requiresDeposit: true, depositAmount: 1000 },
    { id: 'a_2', name: 'Gimnasio', description: 'Equipado con todo lo necesario para tu rutina de ejercicio.', image: 'https://picsum.photos/seed/amenity2/600/400', requiresDeposit: false },
    { id: 'a_3', name: 'Alberca', description: 'Relájate y disfruta del sol en nuestra alberca con carril de nado.', image: 'https://picsum.photos/seed/amenity3/600/400', requiresDeposit: false },
    { id: 'a_4', name: 'Asadores', description: 'Zona de asadores al aire libre para convivencias.', image: 'https://picsum.photos/seed/amenity4/600/400', requiresDeposit: true, depositAmount: 250 },
];

export const bookings: Booking[] = [
    { id: 'b_1', amenityId: 'a_3', userId: 'user_1', slot: { start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), end: new Date(new Date().setHours(15, 0, 0, 0)).toISOString() }, status: 'confirmed' },
    { id: 'b_2', amenityId: 'a_1', userId: 'user_1', slot: { start: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), end: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString() }, status: 'confirmed' },
];

export const parcels: Parcel[] = [
    { id: 'p_1', unitId: 'u_101', carrier: 'Amazon', trackingNumber: 'AMZ123456789', arrivedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'at_guard' },
    { id: 'p_2', unitId: 'u_101', carrier: 'Mercado Libre', trackingNumber: 'ML987654321', arrivedAt: '2025-11-08T11:00:00Z', status: 'picked_up' },
];

export const announcements: Announcement[] = [
    { id: 'ann_1', title: 'Corte de Agua Programado', body: 'Se realizará un corte en el suministro de agua el próximo viernes de 10:00 a 14:00 por mantenimiento en la cisterna principal. Agradecemos su comprensión.', category: 'maintenance', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), pinned: true },
    { id: 'ann_2', title: 'Clase de Yoga Semanal', body: 'No te pierdas la clase de yoga todos los miércoles a las 7:00 am en el jardín central. ¡Es gratuita!', category: 'event', createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), pinned: false },
    { id: 'ann_3', title: 'Recordatorio de Seguridad', body: 'Se les recuerda a todos los residentes verificar que la puerta principal quede bien cerrada al entrar y salir del edificio.', category: 'security', createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), pinned: false },
];

export const visitorPasses: VisitorPass[] = [
    { id: 'vp_1', userId: 'user_1', visitorName: 'Ana García', validFrom: new Date().toISOString(), validTo: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), qrToken: 'qr_token_ana_garcia_123' },
    { id: 'vp_2', userId: 'user_1', visitorName: 'Servicio de Internet', validFrom: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), validTo: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(18, 0, 0, 0)).toISOString(), qrToken: 'qr_token_internet_456' },
];

export const mockAssemblies: Assembly[] = [
    { 
        id: 'as_1', 
        title: 'Asamblea General Ordinaria Noviembre 2025', 
        date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        status: 'active',
        topics: ['Revisión de presupuesto anual', 'Elección de nuevo comité de vigilancia', 'Propuesta de mejora de amenidades'],
        docs: [{ name: 'Convocatoria Noviembre 2025.pdf', url: '#' }, { name: 'Presupuesto Propuesto.xlsx', url: '#' }],
        vote: {
            id: 'v_1',
            assemblyId: 'as_1',
            question: '¿Aprueba el presupuesto de mejoras para el gimnasio?',
            options: ['Sí, apruebo', 'No, rechazo', 'Me abstengo'],
            status: 'open'
        }
    },
    { 
        id: 'as_2', 
        title: 'Asamblea General Extraordinaria Octubre 2025', 
        date: '2025-10-15T19:00:00Z',
        status: 'past',
        topics: ['Votación sobre el nuevo sistema de seguridad'],
        docs: [{ name: 'Minuta Asamblea Octubre 2025.pdf', url: '#' }],
    },
     { 
        id: 'as_3', 
        title: 'Asamblea General Ordinaria Septiembre 2025', 
        date: '2025-09-20T19:00:00Z',
        status: 'past',
        topics: ['Reporte financiero del trimestre', 'Asuntos generales'],
        docs: [{ name: 'Minuta Asamblea Septiembre 2025.pdf', url: '#' }],
    }
];
