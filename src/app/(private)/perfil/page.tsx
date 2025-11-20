

"use client";

import { UserProfileCard } from "./_components/user-profile-card";
import { NotificationSettings } from "./_components/notification-settings";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function PerfilPage() {
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        if (!auth) return;
        signOut(auth).then(() => {
          router.push('/auth/login');
        });
    }

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">Gestiona tu información personal y tus preferencias de notificación.</p>
            </header>

            <div className="space-y-8 animate-fade-in">
                <UserProfileCard />
                <NotificationSettings />
                
                <div className="pt-4">
                     <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

        </main>
    );
}
