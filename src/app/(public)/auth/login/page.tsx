
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// NOTE: Firebase Auth is temporarily bypassed to allow access.
// We simulate the login to grant access to the rest of the app.
// import { useAuth } from "@/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("residente@habitat.com");
  const [password, setPassword] = React.useState("password");
  // const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = (demoUser?: 'residente' | 'admin') => {
    setIsLoading(true);

    // In a real scenario, this would set some user state in a global store
    // or context after successful Firebase authentication.
    // For this simulation, we'll use a simple timeout and redirect.

    let loginEmail = email;
    if (demoUser === 'admin') {
      loginEmail = 'admin@habitat.com';
    } else if (demoUser === 'residente') {
      loginEmail = 'residente@habitat.com';
    }
    
    console.log(`Simulating login for: ${loginEmail}`);

    setTimeout(() => {
      // Here you would typically use a state management library to set the user
      // For this demo, we just redirect.
      router.push("/dashboard");
    }, 500);

    // --- REAL FIREBASE LOGIC IS CURRENTLY DISABLED TO GUARANTEE ACCESS ---
    // if (!auth) {
    //     toast({
    //         variant: "destructive",
    //         title: "Error",
    //         description: "El servicio de autenticación no está disponible. Inténtalo de nuevo más tarde."
    //     });
    //     setIsLoading(false);
    //     return;
    // }
    // signInWithEmailAndPassword(auth, loginEmail, password)
    // .then((userCredential) => {
    //   // Signed in
    //   router.push("/dashboard");
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   toast({
    //     variant: "destructive",
    //     title: "Error de autenticación",
    //     description: "El correo o la contraseña son incorrectos.",
    //   });
    //   console.error(errorCode, errorMessage);
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });
    // --- END OF REAL FIREBASE LOGIC ---
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Accede a tu condominio</CardTitle>
        <CardDescription>
          Ingresa tu correo y contraseña para continuar.
        </CardDescription>
      </CardHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="residente@habitat.com"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" className="mr-2" />}
            {isLoading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
           <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">
              O entra como demo
            </span>
          </div>
           <div className="grid grid-cols-2 gap-4 w-full">
             <Button type="button" variant="secondary" onClick={() => handleLogin('residente')} disabled={isLoading}>
                Residente
            </Button>
             <Button type="button" variant="secondary" onClick={() => handleLogin('admin')} disabled={isLoading}>
                Admin
            </Button>
           </div>
          <Button variant="link" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth">Volver a opciones</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
