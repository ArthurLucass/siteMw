import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente Supabase com service role key para o webhook
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error("❌ Variáveis do Supabase ausentes para o webhook");
      return NextResponse.json(
        { error: "Configuração do servidor ausente" },
        { status: 500 },
      );
    }

    // Obter dados do webhook
    const body = await request.json();

    console.log("Webhook recebido:", body);

    // Verificar se é uma notificação de pagamento
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;

    // Buscar detalhes do pagamento no Mercado Pago
    const mercadoPagoAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    const paymentResponse = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoAccessToken}`,
        },
      },
    );

    const payment = paymentResponse.data;
    const pedidoId = payment.external_reference;

    // Mapear status do Mercado Pago para nosso sistema
    let statusPagamento = "Pendente";

    switch (payment.status) {
      case "approved":
        statusPagamento = "Pago";
        break;
      case "rejected":
      case "cancelled":
        statusPagamento = "Cancelado";
        break;
      case "pending":
      case "in_process":
      case "in_mediation":
        statusPagamento = "Pendente";
        break;
    }

    if (!pedidoId) {
      console.log("Pedido não encontrado no external_reference");
      return NextResponse.json({ received: true, warning: "Pedido ausente" });
    }

    const updateData = {
      status_pagamento: statusPagamento,
      mercadopago_payment_id: paymentId.toString(),
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

    const { error: updateError } = await supabaseAdmin
      .from("pedidos")
      .update(updateData)
      .eq("id", pedidoId);

    if (updateError) {
      const shouldFallback = updateError.message?.includes(
        "mercadopago_payment_id",
      );

      if (!shouldFallback) {
        console.error("Erro ao atualizar pedido:", updateError);
        return NextResponse.json(
          { error: "Erro ao atualizar pedido" },
          { status: 500 },
        );
      }

      const { error: fallbackError } = await supabaseAdmin
        .from("pedidos")
        .update(fallbackUpdate)
        .eq("id", pedidoId);

      if (fallbackError) {
        console.error("Erro ao atualizar pedido (fallback):", fallbackError);
        return NextResponse.json(
          { error: "Erro ao atualizar pedido" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true, updated: true });
  } catch (error: any) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 },
    );
  }
}

// Permitir GET para verificação do Mercado Pago
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "Webhook ativo" });
}
