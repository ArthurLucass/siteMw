"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Pedido {
  id: string;
  nome: string;
  idade: number;
  telefone: string;
  email: string;
  parroquia: string;
  cidade: string;
  tamanho: string;
  inclui_almoco: boolean;
  valor_total: number;
  status_pagamento: string;
  created_at: string;
}

export default function AdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    // Verificar se é admin
    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!adminData) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  const loadPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPedidos = () => {
    let filtered = [...pedidos];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status_pagamento === statusFilter);
    }

    setFilteredPedidos(filtered);
  };

  useEffect(() => {
    checkAuth();
    loadPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, pedidos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      const { error } = await supabase.from("pedidos").delete().eq("id", id);
      if (error) {
        console.error("Erro ao excluir:", error);
        alert(`Erro ao excluir pedido: ${error.message}`);
        return;
      }
      alert("Pedido excluído com sucesso!");
      loadPedidos();
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      alert(`Erro ao excluir pedido: ${error.message}`);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ status_pagamento: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        alert(`Erro ao atualizar status: ${error.message}`);
        return;
      }
      alert("Status atualizado com sucesso!");
      loadPedidos();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      alert(`Erro ao atualizar status: ${error.message}`);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingPedido) return;

    try {
      // Recalcular valor total baseado no almoço
      const valorBase = 40;
      const valorAlmoco = editingPedido.inclui_almoco ? 15 : 0;
      const valorTotal = valorBase + valorAlmoco;

      const { error } = await supabase
        .from("pedidos")
        .update({
          nome: editingPedido.nome,
          idade: editingPedido.idade,
          telefone: editingPedido.telefone,
          email: editingPedido.email,
          parroquia: editingPedido.parroquia,
          cidade: editingPedido.cidade,
          tamanho: editingPedido.tamanho,
          inclui_almoco: editingPedido.inclui_almoco,
          valor_total: valorTotal,
        })
        .eq("id", editingPedido.id);

      if (error) {
        console.error("Erro ao atualizar pedido:", error);
        alert(`Erro ao atualizar pedido: ${error.message}`);
        return;
      }

      alert("Pedido atualizado com sucesso!");
      setShowEditModal(false);
      setEditingPedido(null);
      loadPedidos();
    } catch (error: any) {
      console.error("Erro ao atualizar pedido:", error);
      alert(`Erro ao atualizar pedido: ${error.message}`);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Pedidos", 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Nome", "Email", "Telefone", "Cidade", "Status", "Valor"]],
      body: filteredPedidos.map((p) => [
        p.nome,
        p.email,
        p.telefone,
        p.cidade,
        p.status_pagamento,
        `R$ ${p.valor_total.toFixed(2)}`,
      ]),
    });

    doc.save("pedidos.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPedidos.map((p) => ({
        Nome: p.nome,
        Idade: p.idade,
        Telefone: p.telefone,
        Email: p.email,
        Paróquia: p.parroquia,
        Cidade: p.cidade,
        Tamanho: p.tamanho,
        "Inclui Almoço": p.inclui_almoco ? "Sim" : "Não",
        "Valor Total": p.valor_total,
        Status: p.status_pagamento,
        "Data de Criação": new Date(p.created_at).toLocaleDateString("pt-BR"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
    XLSX.writeFile(workbook, "pedidos.xlsx");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Painel Administrativo
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Exportação */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Excel
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Total: {filteredPedidos.length} pedido(s)
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paróquia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Almoço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.idade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.parroquia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.cidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.tamanho}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.inclui_almoco ? "Sim" : "Não"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {pedido.valor_total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.status_pagamento}
                        onChange={(e) =>
                          handleUpdateStatus(pedido.id, e.target.value)
                        }
                        className={`text-sm rounded-full px-3 py-1 font-semibold ${
                          pedido.status_pagamento === "Pago"
                            ? "bg-green-100 text-green-800"
                            : pedido.status_pagamento === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingPedido(pedido);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pedido.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Pedido</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editingPedido.nome}
                  onChange={(e) =>
                    setEditingPedido({ ...editingPedido, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  value={editingPedido.idade}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      idade: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={editingPedido.telefone}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      telefone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={editingPedido.email}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paróquia
                </label>
                <input
                  type="text"
                  value={editingPedido.parroquia}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      parroquia: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={editingPedido.cidade}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      cidade: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho da Camisa
                </label>
                <select
                  value={editingPedido.tamanho}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      tamanho: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingPedido.inclui_almoco}
                  onChange={(e) =>
                    setEditingPedido({
                      ...editingPedido,
                      inclui_almoco: e.target.checked,
                    })
                  }
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Incluir Almoço
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPedido(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
