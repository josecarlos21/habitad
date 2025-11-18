
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
import { UserPlus } from "lucide-react";
import type { VisitorPass } from "@/lib/types";

interface GeneratePassSheetProps {
  onPassGenerated: (newPass: Omit<VisitorPass, 'id' | 'qrToken' | 'userId' | 'validFrom'>) => void;
}

export function GeneratePassSheet({ onPassGenerated }: GeneratePassSheetProps) {
  const [visitorName, setVisitorName] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName) return;

    // For simplicity, we'll set the pass to be valid for 8 hours from now.
    const validTo = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();

    onPassGenerated({
      visitorName,
      validTo,
    });
    
    setVisitorName("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Generar Pase
        </Button>
      </SheetTrigger>
      <SheetContent>
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
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button type="submit">Generar y Compartir</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

    