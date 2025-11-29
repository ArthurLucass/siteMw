"use client";

import { useState, FormEvent } from "react";
import InputMask from "react-input-mask";
import axios from "axios";

export default function InscricaoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    email: "",
    parroquia: "",
    cidade: "",
    tamanho: "",
    incluiAlmoco: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valorBase = 40;
  const valorAlmoco = 15;
  const valorTotal = valorBase + (formData.incluiAlmoco ? valorAlmoco : 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      nome: "",
      idade: "",
      telefone: "",
      email: "",
      parroquia: "",
      cidade: "",
      tamanho: "",
      incluiAlmoco: false,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return "Nome completo é obrigatório";
    if (!formData.idade || parseInt(formData.idade) <= 0)
      return "Idade válida é obrigatória";
    if (!formData.telefone.replace(/\D/g, "").match(/^\d{11}$/))
      return "Telefone inválido";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "E-mail inválido";
    if (!formData.parroquia.trim()) return "Paróquia é obrigatória";
    if (!formData.cidade.trim()) return "Cidade é obrigatória";
    if (!formData.tamanho) return "Tamanho da camisa é obrigatório";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/pedidos/create", {
        nome: formData.nome,
        idade: parseInt(formData.idade),
        telefone: formData.telefone,
        email: formData.email,
        parroquia: formData.parroquia,
        cidade: formData.cidade,
        tamanho: formData.tamanho,
        inclui_almoco: formData.incluiAlmoco,
        valor_total: valorTotal,
      });

      // Redirecionar para o checkout do Mercado Pago
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        throw new Error("Link de pagamento não foi gerado");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Erro ao processar pedido. Tente novamente."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Formulário de Inscrição
          </h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Idade */}
            <div>
              <label
                htmlFor="idade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Idade *
              </label>
              <input
                type="number"
                id="idade"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                min="1"
                max="120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Telefone *
              </label>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    type="tel"
                    id="telefone"
                    name="telefone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                )}
              </InputMask>
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Paróquia */}
            <div>
              <label
                htmlFor="parroquia"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Paróquia que frequenta *
              </label>
              <input
                type="text"
                id="parroquia"
                name="parroquia"
                value={formData.parroquia}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Cidade */}
            <div>
              <label
                htmlFor="cidade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cidade *
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Tamanho da Camisa */}
            <div>
              <label
                htmlFor="tamanho"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tamanho da Camisa *
              </label>
              <select
                id="tamanho"
                name="tamanho"
                value={formData.tamanho}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Selecione um tamanho</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
            </div>

            {/* Checkbox Almoço */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="incluiAlmoco"
                name="incluiAlmoco"
                checked={formData.incluiAlmoco}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="incluiAlmoco"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Incluir Almoço (+R$ 15,00)
              </label>
            </div>

            {/* Valor Total */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Valor Total:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  R$ {valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processando..." : "Salvar Pedido e Pagar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
