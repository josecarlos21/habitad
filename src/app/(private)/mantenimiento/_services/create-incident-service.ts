"use server";

import { initializeFirebase } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { headers } from "next/headers";
import { z } from "zod";

const incidentSchema = z.object({
  title: z.string().min(10),
  category: z.string(),
  description: z.string().min(20),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

export async function createIncident(data: IncidentFormData) {
    const validatedData = incidentSchema.parse(data);
    
    // In a real app, you'd get user and condo info from the session
    const headersList = headers();
    const condoId = headersList.get('x-condo-id') || 'condo_1'; 
    const userId = headersList.get('x-user-id') || 'user_123';
    const unitId = headersList.get('x-unit-id') || 'unit_101';
    
    const { firestore } = initializeFirebase();

    const incidentData = {
        ...validatedData,
        condoId,
        createdBy: userId,
        unitId,
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    try {
        const incidentsCollection = collection(firestore, `condos/${condoId}/incidents`);
        const docRef = await addDoc(incidentsCollection, incidentData);
        console.log("Incident created with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating incident:", error);
        throw new Error("Failed to create incident in Firestore.");
    }
}
