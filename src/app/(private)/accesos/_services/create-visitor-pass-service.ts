
"use server";

import { initializeFirebase } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { headers } from "next/headers";
import { z } from "zod";

const visitorPassSchema = z.object({
  visitorName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
});

type VisitorPassFormData = z.infer<typeof visitorPassSchema>;

export async function createVisitorPass(data: VisitorPassFormData) {
    const validatedData = visitorPassSchema.parse(data);
    
    const headersList = headers();
    const condoId = headersList.get('x-condo-id'); 
    const userId = headersList.get('x-user-id');
    
    if (!condoId || !userId) {
        throw new Error("User or condo information is missing.");
    }
    
    const { firestore } = initializeFirebase();

    const passData = {
        ...validatedData,
        condoId,
        userId,
        qrToken: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // placeholder
        validFrom: new Date().toISOString(),
        validTo: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours validity
        createdAt: serverTimestamp(),
    };

    try {
        const passesCollection = collection(firestore, `condos/${condoId}/visitor-passes`);
        const docRef = await addDoc(passesCollection, passData);
        console.log("Visitor pass created with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating visitor pass:", error);
        throw new Error("Failed to create visitor pass in Firestore.");
    }
}
