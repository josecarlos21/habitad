
import { UserProfileCard } from "./_components/user-profile-card";
import { NotificationSettings } from "./_components/notification-settings";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function PerfilPage() {

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">Gestiona tu información personal y tus preferencias de notificación.</p>
            </header>

            <main className="space-y-8 animate-fade-in">
                <UserProfileCard />
                <NotificationSettings />
                
                <div className="pt-4">
                     <Button variant="outline">
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </main>

        </div>
    );
}
