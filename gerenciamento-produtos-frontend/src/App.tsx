import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Produto } from "./types/Produto";
import axios from "axios";
import ProdutoForm from "./components/ProdutoForm";

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [produtoEmEdicao, setProdutoEdicao] = useState<Produto | null>(null);

  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/produtos`;

  if (!API_BASE_URL) {
    console.error(
      "Variável de ambiente REACT_APP_API_URL não configurada ou vazia!"
    );
  }

  const handleCancelEdit = () => {
    setProdutoEdicao(null);
  };

  const handleProdutoCadastrado = () => {
    fetchProdutos();
  };

  const fetchProdutos = async () => {
    let response;
    if (API_BASE_URL) {
      response = await axios.get<Produto[]>(API_BASE_URL);
      try {
        setProdutos(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Falha ao carregar produtos. Verifique se a API está em execução e CORS configurado "
        );
      }
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleStartEdit = (produto: Produto) => {
    setProdutoEdicao(produto);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto? ${id}`)) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);

        if (response.status === 204) {
          alert("Produto excluido com sucesso");
          fetchProdutos();
        }
      } catch (error) {
        console.error("Erro ao excluir produto: ", error);
        alert("Falha ao excluir o produto");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gerenciamento de Produtos
      </h1>

      <div className="w-full max-w-lg mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-700 text-center">
          {produtoEmEdicao ? "Editar Produto" : "Adicionar Novo Produto"}
        </h2>
        <ProdutoForm
          onCadastroSucesso={handleProdutoCadastrado}
          produtoInicial={produtoEmEdicao}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <hr className="w-full max-w-4xl border-gray-300 mb-6" />

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Lista de Produtos ({produtos.length})
        </h2>

        {loading && <p className="text-blue-500">Carregando dados da API...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {produtos.length === 0 && (
              <p className="text-gray-500">Nenhum produto cadastrado.</p>
            )}

            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-150"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {produto.nome} (ID: {produto.id})
                  </p>
                  <p className="text-sm text-gray-600">{produto.descricao}</p>
                  <p className="text-base font-bold text-green-600">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                  <span className="text-xs inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full mt-1">
                    {produto.categoria}
                  </span>
                </div>

                <div className="space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleStartEdit(produto)}
                    className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
