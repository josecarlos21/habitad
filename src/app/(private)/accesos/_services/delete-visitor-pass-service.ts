
"use server";

import { initializeFirebase } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteVisitorPass(passId: string) {
    if (!passId) {
        throw new Error("El ID del pase es requerido.");
    }

    const headersList = headers();
    const condoId = headersList.get('x-condo-id') || 'condo_1'; 
    
    if (!condoId) {
        throw new Error("La información del condominio es requerida.");
    }
    
    const { firestore } = initializeFirebase();
    const passRef = doc(firestore, `condos/${condoId}/visitor-passes`, passId);

    try {
        await deleteDoc(passRef);
        console.log("Visitor pass deleted successfully: ", passId);
        revalidatePath('/accesos'); // Revalidate the page to reflect the change
        return { success: true };
    } catch (error) {
        console.error("Error deleting visitor pass:", error);
        throw new Error("No se pudo eliminar el pase de visitante de Firestore.");
    }
}
