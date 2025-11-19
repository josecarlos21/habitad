
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-muted text-muted-foreground p-4 rounded-lg text-xs overflow-auto">
        <code>{code.trim()}</code>
    </pre>
);

export default function WhatsappGuidePage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <MessageCircle className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ecosistema WhatsApp Business API 2025</h1>
                    <p className="text-muted-foreground">Guía Definitiva con Diagramas, Precios y Caminos</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>🗺️ Mapa de Caminos de Acceso</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={`
graph TB
    Start[Necesitas WhatsApp Business API] --> Decision{¿Tienes equipo técnico?}
    
    Decision -->|Sí| CloudAPI[Camino 1: Meta Cloud API Directo]
    Decision -->|No| BSPChoice{¿Presupuesto?}
    
    CloudAPI --> CloudSetup[Setup 10-15 min<br/>$0 plataforma<br/>Solo pagas mensajes Meta]
    
    BSPChoice -->|Alto: $60-250/mes| BSPFull[Camino 3: BSP Todo Incluido<br/>Respond.io, AiSensy, Trengo]
    BSPChoice -->|Medio: $0-50/mes| BSPNoMarkup[Camino 2: BSP Sin Markup<br/>WANotifier, 360Dialog, YCloud]
    BSPChoice -->|Bajo: $6-12/mes| BSPCheap[Camino 4: BSP Económico<br/>WABA Connect, BOL7]
    
    CloudSetup --> Reqs[Requisitos]
    BSPFull --> Reqs
    BSPNoMarkup --> Reqs
    BSPCheap --> Reqs
    
    Reqs --> Verify[1. Verificar Empresa<br/>Meta Business Manager]
    Verify --> Number[2. Número Dedicado<br/>No usado en WhatsApp personal]
    Number --> Webhook[3. Webhook/Dashboard<br/>Cloud API: HTTPS webhook<br/>BSP: Dashboard incluido]
    Webhook --> Templates[4. Plantillas HSM<br/>Marketing, Utilidad, Autenticación]
    Templates --> Test[5. Pruebas Sandbox<br/>Validar flujos]
    Test --> Prod[6. Producción<br/>3-7 días total]
`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>💰 Modelo de Precios México (desde julio 2025)</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={`
graph LR
    subgraph "Tipos de Mensaje"
        Marketing[Marketing<br/>$0.0436/msg]
        Utilidad[Utilidad<br/>$0.0085/msg]
        Auth[Autenticación<br/>$0.0085/msg]
        Servicio[Servicio<br/>$0 GRATIS]
    end
    
    subgraph "Ventanas Gratis"
        CSW[CSW 24h<br/>Usuario te escribe]
        Entry[Entry Point 72h<br/>Click en anuncio Meta]
    end
    
    CSW -->|GRATIS| Servicio
    CSW -->|GRATIS| Utilidad
    Entry -->|GRATIS TODOS| Marketing
    Entry -->|GRATIS TODOS| Utilidad
    Entry -->|GRATIS TODOS| Auth
    
    Marketing -->|Siempre| Pago1[$0.0436]
    Utilidad -->|Fuera CSW| Pago2[$0.0085]
    Auth -->|Siempre| Pago3[$0.0085]
`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📊 Comparación de Proveedores BSP</CardTitle>
                </CardHeader>
                <CardContent>
                     <CodeBlock code={`
graph TB
    subgraph "Sin Markup - Más Transparentes"
        WAN[WANotifier<br/>$0/mes + 0% markup<br/>Setup: 5-10 min]
        D360[360Dialog<br/>$53-218/mes + 0% markup<br/>Developer-friendly]
        YC[YCloud<br/>Gratis lifetime + 0% markup<br/>AI templates]
    end
    
    subgraph "Todo Incluido - CRM + Automatización"
        Resp[Respond.io<br/>$79-249/mes<br/>Omnicanal + Multi-agente]
        AiS[AiSensy<br/>$18-38/mes<br/>Chatbots + Campañas]
        Tren[Trengo<br/>$59-199/mes<br/>Customer Support Teams]
    end
    
    subgraph "Económicos - Mejor Precio"
        WABA[WABA Connect<br/>$12/mes India<br/>7 días trial]
        BOL[BOL7<br/>$6/mes India<br/>Mensajería ilimitada]
        WAS[WaSenderAPI<br/>$6-45/mes<br/>Developers multi-sesión]
    end
`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>⏱️ Timeline de Implementación</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={`
gantt
    title Roadmap WhatsApp Business API Setup
    dateFormat YYYY-MM-DD
    section Verificación
    Crear Meta Business Manager           :a1, 2025-11-19, 1d
    Subir documentos (RFC, acta)          :a2, after a1, 1d
    Esperar verificación                   :a3, after a2, 2d
    section Setup Técnico
    Elegir camino (Cloud API o BSP)       :b1, after a3, 1h
    Registrar número dedicado              :b2, after b1, 30m
    Configurar webhook/dashboard           :b3, after b2, 1h
    Generar token permanente               :b4, after b3, 30m
    section Plantillas
    Crear plantillas HSM                   :c1, after b4, 2h
    Enviar a aprobación Meta               :c2, after c1, 5m
    Esperar aprobación                     :c3, after c2, 4h
    section Pruebas
    Sandbox testing                        :d1, after c3, 4h
    Pruebas E2E                           :d2, after d1, 1d
    Ajustes finales                        :d3, after d2, 4h
    section Producción
    Deploy producción                      :e1, after d3, 4h
    Monitoreo inicial                      :e2, after e1, 1d
`} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>🎯 Flujo de Mensajes con CSW (Customer Service Window)</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={`
sequenceDiagram
    participant U as Usuario
    participant W as WhatsApp
    participant B as Bot/Empresa
    participant M as Meta
    
    Note over U,M: Escenario 1: Usuario Inicia Conversación
    U->>W: Envía mensaje "Hola"
    W->>B: Webhook: mensaje entrante
    Note over B: CSW 24h INICIA AHORA
    B->>M: Enviar mensaje servicio (texto libre)
    M-->>B: $0 GRATIS
    B->>M: Enviar plantilla utilidad (status pedido)
    M-->>B: $0 GRATIS
    
    Note over U,M: Escenario 2: Empresa Inicia (fuera CSW)
    B->>M: Enviar plantilla marketing
    M-->>B: Cobra $0.0436
    U->>W: Usuario responde
    W->>B: Webhook: mensaje entrante
    Note over B: CSW 24h INICIA AHORA
    B->>M: Responder con servicio
    M-->>B: $0 GRATIS (dentro CSW)
    
    Note over U,M: Escenario 3: Entry Point (Anuncio Meta)
    U->>W: Click en anuncio Facebook
    Note over B: Entry Point 72h INICIA
    B->>M: Cualquier tipo mensaje
    M-->>B: $0 GRATIS (72h)
`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📋 Checklist Requisitos Obligatorios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">1. Verificación Empresa (2-4 días)</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-inside">
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Cuenta Facebook Business Manager</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Información legal completa (nombre, RFC, dirección)</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Documentos: Acta constitutiva, RFC, Comprobante de domicilio</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Método de pago agregado (tarjeta o PayPal)</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Status "Business Verified"</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">2. Número de WhatsApp (30 minutos)</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-inside">
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Número dedicado (NO usado en WhatsApp personal)</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Opciones: Línea nueva, Número liberado</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Verificación por SMS o llamada telefónica</li>
                            <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" /> Vinculado a WhatsApp Business API</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">4. Plantillas HSM (1-24 horas)</h3>
                        <p className="text-sm text-muted-foreground mb-4">Ejemplos de Plantillas:</p>
                        <div className="space-y-4">
                            <CodeBlock code={`
[Utilidad] Confirmación Pedido:
Hola {{1}}, tu pedido #{{2}} ha sido confirmado. 
Total: ${{3}}. Llegada estimada: {{4}}.
`} />
                            <CodeBlock code={`
[Autenticación] Código Verificación:
Tu código de verificación es {{1}}. 
Válido por 10 minutos. No lo compartas.
`} />
                            <CodeBlock code={`
[Marketing] Promoción:
¡{{1}}! Aprovecha {{2}}% de descuento en {{3}}. 
Válido hasta {{4}}. Usa código: {{5}}
`} />
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>💵 Calculadora de Costos - Caso Delivery México</CardTitle>
                    <CardDescription>Escenario: 2,000 mensajes/mes</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio Unit.</TableHead>
                                <TableHead>Pagados</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Marketing (promociones)</TableCell>
                                <TableCell>500</TableCell>
                                <TableCell>$0.0436</TableCell>
                                <TableCell>500</TableCell>
                                <TableCell className="text-right">$21.80</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Utilidad (status pedido)</TableCell>
                                <TableCell>1,000</TableCell>
                                <TableCell>$0.0085</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell className="text-right">$2.55</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Autenticación (OTP login)</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell>$0.0085</TableCell>
                                <TableCell>300</TableCell>
                                <TableCell className="text-right">$2.55</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Servicio (chat soporte)</TableCell>
                                <TableCell>500</TableCell>
                                <TableCell>$0</TableCell>
                                <TableCell>0</TableCell>
                                <TableCell className="text-right">$0</TableCell>
                            </TableRow>
                             <TableRow className="font-bold border-t-2">
                                <TableCell colSpan={4}>Total mensual solo Meta:</TableCell>
                                <TableCell className="text-right">$26.90 USD</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>🚀 Guía Paso a Paso: Setup Rápido Cloud API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Fase 1: Verificación (Día 1-2)</h3>
                        <p className="text-sm text-muted-foreground">1. Ir a: <a href="https://business.facebook.com" target="_blank" className="text-primary hover:underline">https://business.facebook.com</a></p>
                        <p className="text-sm text-muted-foreground">2. Completar información empresarial y subir documentos.</p>
                        <p className="text-sm text-muted-foreground">3. Agregar método de pago y esperar email de verificación.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Fase 3: Código Webhook Mínimo (Node.js)</h3>
                        <CodeBlock code={`
const express = require('express');
const app = express();

app.use(express.json());

// Verificación webhook (GET)
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === 'token_secreto_random') {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes (POST)
app.post('/webhook/whatsapp', (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    // ... procesar mensaje
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => console.log('Webhook escuchando'));
`} />
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Fase 4: Enviar Mensaje de Prueba</h3>
                         <CodeBlock code={`
const axios = require('axios');

async function enviarMensaje(telefono, mensaje) {
  const url = 'https://graph.facebook.com/v18.0/TU_PHONE_NUMBER_ID/messages';
  const token = 'TU_TOKEN_PERMANENTE';
  
  try {
    await axios.post(url, {
      messaging_product: 'whatsapp',
      to: telefono,
      text: { body: mensaje }
    }, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
`} />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>🔧 Solución de Problemas Comunes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Problema</TableHead>
                                <TableHead>Causa</TableHead>
                                <TableHead>Solución</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Webhook no verifica</TableCell>
                                <TableCell>SSL inválido o verify token incorrecto</TableCell>
                                <TableCell>Verificar certificado SSL, confirmar token coincide</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Plantilla rechazada</TableCell>
                                <TableCell>Texto incorrecto o categoría mal elegida</TableCell>
                                <TableCell>Revisar políticas Meta, simplificar texto</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Número no se puede registrar</TableCell>
                                <TableCell>Ya usado en WhatsApp personal</TableCell>
                                <TableCell>Desinstalar app, esperar 24h, liberar número</TableCell>
                            </TableRow>
                              <TableRow>
                                <TableCell>Token expirado</TableCell>
                                <TableCell>Token temporal no convertido a permanente</TableCell>
                                <TableCell>Generar nuevo token permanente en Business Manager</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
