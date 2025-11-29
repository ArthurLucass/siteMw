import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nome,
      idade,
      telefone,
      email,
      parroquia,
      cidade,
      tamanho,
      inclui_almoco,
      valor_total,
    } = body;

    // Validações básicas
    if (
      !nome ||
      !idade ||
      !telefone ||
      !email ||
      !parroquia ||
      !cidade ||
      !tamanho ||
      valor_total === undefined
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Salvar pedido no Supabase
    const { data: pedidoData, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          nome,
          idade: parseInt(idade),
          telefone,
          email,
          parroquia,
          cidade,
          tamanho,
          inclui_almoco: inclui_almoco || false,
          valor_total: parseFloat(valor_total),
          status_pagamento: "Pendente",
        },
      ])
      .select()
      .single();

    if (pedidoError) {
      console.error("Erro ao salvar pedido:", pedidoError);
      return NextResponse.json(
        {
          error:
            "Erro ao salvar pedido no banco de dados: " + pedidoError.message,
        },
        { status: 500 }
      );
    }

    // Retornar link fixo do checkout
    const checkoutUrl = process.env.NEXT_PUBLIC_MERCADOPAGO_CHECKOUT_URL;

    return NextResponse.json({
      success: true,
      pedido_id: pedidoData.id,
      init_point: checkoutUrl,
      message: "Pedido criado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);

    return NextResponse.json(
      {
        error: error.message || "Erro ao processar pedido",
      },
      { status: 500 }
    );
  }
}
