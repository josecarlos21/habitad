"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ShieldCheck, Smartphone, Sun } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Ajustes"
        description="Configura tu experiencia visual, métodos de acceso y dispositivos."
        actions={
          <Button variant="ghost" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Revisar seguridad
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Modo actual" description="Tema" value="Oscuro" icon={Sun} isLoading={false} />
        <StatCard title="Sesiones activas" description="Dispositivos" value="2" icon={Smartphone} isLoading={false} />
        <StatCard title="MFA" description="Verificación en dos pasos" value="Activa" icon={ShieldCheck} isLoading={false} />
        <StatCard title="Último cambio" description="Preferencias" value="Hace 2 días" icon={Settings} isLoading={false} />
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Idioma y formatos</CardTitle>
              <CardDescription>Personaliza la localización de fechas y monedas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select defaultValue="es-MX">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es-MX">Español (México)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Formato de moneda</Label>
                <Select defaultValue="mxn">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mxn">MXN</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar cambios</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alertas personalizadas</CardTitle>
              <CardDescription>Controla qué notificaciones deseas recibir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "alert-finance", label: "Finanzas", desc: "Cuotas, adeudos y comprobantes." },
                { id: "alert-security", label: "Seguridad", desc: "Movimientos sospechosos y accesos." },
                { id: "alert-community", label: "Comunidad", desc: "Avisos de eventos y amenidades." },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="apariencia" className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Modo de color</CardTitle>
              <CardDescription>Sincroniza con tu sistema o selecciona manualmente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Auto", "Claro", "Oscuro"].map((mode) => (
                <Button key={mode} variant={mode === "Oscuro" ? "default" : "outline"} className="w-full justify-start">
                  {mode}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Densidad</CardTitle>
              <CardDescription>Elige el espaciado que prefieras.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Cómodo", "Intermedio", "Compacto"].map((option) => (
                <Button key={option} variant={option === "intermedio" ? "default" : "outline"} className="w-full justify-start capitalize">
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seguridad" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar dispositivos</CardTitle>
              <CardDescription>Revisa y revoca sesiones activas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "iPhone 15", location: "CDMX · iOS", lastActive: "Hace 3 horas" },
                { name: "Laptop personal", location: "CDMX · macOS", lastActive: "Ayer" },
              ].map((device) => (
                <div key={device.name} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.location} · {device.lastActive}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cerrar sesión
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm font-medium">PIN temporal</p>
                <p className="text-xs text-muted-foreground">Genera un PIN para personal de confianza.</p>
              </div>
              <Button variant="outline">Generar PIN</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
