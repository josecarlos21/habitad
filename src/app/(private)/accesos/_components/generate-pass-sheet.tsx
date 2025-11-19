
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, UserPlus } from "lucide-react";
import type { VisitorPass } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";


interface GeneratePassSheetProps {
  onPassGenerated: (newPass: Omit<VisitorPass, 'id' | 'qrToken' | 'userId' | 'validFrom'>) => Promise<void>;
}

export function GeneratePassSheet({ onPassGenerated }: GeneratePassSheetProps) {
  const [visitorName, setVisitorName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || isLoading) return;

    setIsLoading(true);

    try {
      const validTo = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
      await onPassGenerated({
        visitorName,
        validTo,
      });
      setIsSuccess(true);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el pase. Inténtalo de nuevo.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset state on close after a short delay
        setTimeout(() => {
            setVisitorName("");
            setIsLoading(false);
            setIsSuccess(false);
        }, 300);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Generar Pase
        </Button>
      </SheetTrigger>
      <SheetContent>
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">¡Pase Generado!</h3>
                <p className="text-muted-foreground mt-2">
                    El pase para <span className="font-semibold text-foreground">{visitorName}</span> ha sido creado con éxito.
                </p>
                <Button className="mt-6 w-full" onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <SheetHeader>
                    <SheetTitle>Generar Pase de Visitante</SheetTitle>
                    <SheetDescription>
                    Ingresa los datos de tu visitante para generar un código QR de acceso.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <div className="space-y-2">
                    <Label htmlFor="visitor-name">Nombre del visitante</Label>
                    <Input
                        id="visitor-name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        required
                        disabled={isLoading}
                    />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" disabled={isLoading}>Cancelar</Button>
                    </SheetClose>
                    <Button type="submit" disabled={!visitorName || isLoading}>
                        {isLoading && <Spinner size="sm" className="mr-2"/>}
                        {isLoading ? 'Generando...' : 'Generar y Compartir'}
                    </Button>
                </SheetFooter>
            </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
