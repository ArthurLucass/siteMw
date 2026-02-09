"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function PagamentoSucessoContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedido_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        {/* Ícone de Sucesso */}
        <div className="mb-6">
          <div className="mx-auto w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 sm:w-12 h-10 sm:h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Pagamento Aprovado!
        </h1>

        {/* Mensagem */}
        <p className="text-sm sm:text-base text-gray-600 mb-2">
          Sua inscrição foi confirmada com sucesso.
        </p>

        {/* Pedido ID */}
        {pedidoId && (
          <p className="text-xs sm:text-sm text-gray-500 mb-8">
            Pedido:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {pedidoId}
            </span>
          </p>
        )}

        {/* Informações Adicionais */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-6">
          <p className="text-xs sm:text-sm text-green-800">
            📧 Você receberá um e-mail de confirmação em breve com todos os
            detalhes da sua inscrição.
          </p>
        </div>

        {/* Botão de Retorno */}
        <Link
          href="/"
          className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <PagamentoSucessoContent />
    </Suspense>
  );
}
