import { Icons } from "@/components/icons";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              Habitat <span className="font-light text-muted-foreground">Conectado</span>
            </h1>
          </div>
      </div>
      <div className="w-full max-w-md animate-fade-in">
        {children}
      </div>
    </div>
  );
}
