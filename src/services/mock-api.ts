"use client";

import {
  announcements,
  amenities,
  bookings,
  invoices,
  parcels,
  tickets,
  visitorPasses,
} from "@/lib/mocks";
import type {
  Announcement,
  Amenity,
  Booking,
  Invoice,
  Parcel,
  Ticket,
  VisitorPass,
} from "@/lib/types";

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const simulateRequest = async <T>(data: T, delay = 600): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(clone(data));
    }, delay);
  });

export const fetchInvoices = () => simulateRequest<Invoice[]>(invoices);

export const fetchTickets = () => simulateRequest<Ticket[]>(tickets);

export const fetchTicketById = async (id: string) => {
  const ticket = tickets.find((t) => t.id === id) ?? null;
  return simulateRequest<Ticket | null>(ticket);
};

export const fetchAmenities = () => simulateRequest<Amenity[]>(amenities);

export const fetchBookings = () => simulateRequest<Booking[]>(bookings);

export const fetchVisitorPasses = () =>
  simulateRequest<VisitorPass[]>(visitorPasses);

export const fetchParcels = () => simulateRequest<Parcel[]>(parcels);

export const fetchAnnouncements = () =>
  simulateRequest<Announcement[]>(announcements);

export const fetchAssemblies = () =>
  simulateRequest(
    [
      {
        id: "asm_1",
        title: "Asamblea General Ordinaria Noviembre 2025",
        date: "2025-11-28T19:00:00Z",
        status: "active" as const,
        topics: [
          "Presupuesto 2026",
          "Elección de comité de vigilancia",
          "Mantenimiento de áreas comunes",
        ],
        docs: [
          { name: "Convocatoria Oficial", url: "#" },
          { name: "Propuesta Presupuesto 2026", url: "#" },
        ],
        vote: {
          id: "vote_1",
          question:
            "¿Aprueba el presupuesto presentado para el año 2026?",
          options: ["Sí, apruebo", "No, rechazo", "Me abstengo"],
          status: "open" as const,
        },
      },
      {
        id: "asm_2",
        title: "Asamblea Extraordinaria - Proyecto Alberca",
        date: "2025-08-15T18:00:00Z",
        status: "past" as const,
        topics: [
          "Presentación y votación de la propuesta para remodelar la alberca.",
        ],
        docs: [{ name: "Minuta de la Asamblea", url: "#" }],
      },
      {
        id: "asm_3",
        title: "Asamblea General Ordinaria 2024",
        date: "2024-11-30T19:00:00Z",
        status: "past" as const,
        topics: ["Resultados 2024", "Presupuesto 2025"],
        docs: [{ name: "Minuta de la Asamblea", url: "#" }],
      },
    ],
    500
  );
