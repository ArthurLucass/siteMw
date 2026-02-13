import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: accessToken || "",
});

// Mapeamento de status do Mercado Pago para nosso sistema
const STATUS_MAP: Record<string, string> = {
  approved: "Pago",
  pending: "Pendente",
  in_process: "Pendente",
  rejected: "Cancelado",
  cancelled: "Cancelado",
  refunded: "Cancelado",
  charged_back: "Cancelado",
};

export async function POST(request: NextRequest) {
  try {
    if (!accessToken || !supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Variáveis de ambiente ausentes para o webhook");
      return NextResponse.json(
        { error: "Configuração do servidor ausente" },
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const body = await request.json();

    console.log("📥 Webhook recebido:", body);

    // Mercado Pago envia notificações de diferentes tipos
    // Só processamos notificações de pagamento
    if (body.type !== "payment") {
      console.log("ℹ️ Notificação ignorada (não é pagamento):", body.type);
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      console.log("⚠️ Payment ID não encontrado no webhook");
      return NextResponse.json({ received: true });
    }

    // Buscar informações do pagamento no Mercado Pago
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    const pedidoId = paymentInfo.external_reference;
    const status = paymentInfo.status || "pending";

    if (!pedidoId) {
      console.log("⚠️ External reference (pedido_id) não encontrado");
      return NextResponse.json({ received: true });
    }

    // Mapear status do Mercado Pago para nosso sistema
    const statusPagamento = STATUS_MAP[status] || "Pendente";

    const updateBase = {
      status_pagamento: statusPagamento,
      mercadopago_payment_id: paymentId.toString(),
      mercadopago_status: status,
      ...(statusPagamento === "Pago"
        ? { data_compra: new Date().toISOString() }
        : {}),
    };

    const fallbackUpdate = {
      status_pagamento: statusPagamento,
      mercado_pago_payment_id: paymentId.toString(),
      ...(statusPagamento === "Pago"
        ? { data_compra: new Date().toISOString() }
        : {}),
    };

    console.log("🔄 Atualizando pedido:", {
      pedido_id: pedidoId,
      payment_id: paymentId,
      status_mp: status,
      status_sistema: statusPagamento,
    });

    // Atualizar status no banco
    const { error } = await supabaseAdmin
      .from("pedidos")
      .update(updateBase)
      .eq("id", pedidoId);

    if (error) {
      const shouldFallback =
        error.message?.includes("mercadopago_payment_id") ||
        error.message?.includes("mercadopago_status");

      if (!shouldFallback) {
        console.error("❌ Erro ao atualizar pedido:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { error: fallbackError } = await supabaseAdmin
        .from("pedidos")
        .update(fallbackUpdate)
        .eq("id", pedidoId);

      if (fallbackError) {
        console.error("❌ Erro ao atualizar pedido (fallback):", fallbackError);
        return NextResponse.json(
          { error: fallbackError.message },
          { status: 500 },
        );
      }
    }

    console.log("✅ Pedido atualizado com sucesso:", pedidoId);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook", details: error.message },
      { status: 500 },
    );
  }
}
