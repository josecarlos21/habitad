
"use server";

import { initializeFirebase } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { IncidentStatus } from "@/lib/types";

export async function updateIncidentStatus(incidentId: string, status: IncidentStatus) {
    if (!incidentId || !status) {
        throw new Error("El ID del incidente y el nuevo estado son requeridos.");
    }

    const headersList = headers();
    const condoId = headersList.get('x-condo-id'); 
    
    if (!condoId) {
        throw new Error("La información del condominio es requerida.");
    }
    
    const { firestore } = initializeFirebase();
    const incidentRef = doc(firestore, `condos/${condoId}/incidents`, incidentId);

    try {
        await updateDoc(incidentRef, {
            status: status,
            updatedAt: serverTimestamp()
        });
        
        console.log("Incident status updated successfully: ", incidentId);
        
        // Revalidate both the list and the detail page
        revalidatePath('/mantenimiento');
        revalidatePath(`/mantenimiento/${incidentId}`);

        return { success: true };
    } catch (error) {
        console.error("Error updating incident status:", error);
        throw new Error("No se pudo actualizar el estado del incidente en Firestore.");
    }
}
