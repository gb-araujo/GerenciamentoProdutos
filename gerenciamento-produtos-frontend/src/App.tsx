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
    <div className="App">
      <h1>Gerenciamento de Produtos</h1>

      {loading && <p>Carregando dados da API...</p>}

      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && !error && (
        <div>
          <h2>Lista de Produtos ({produtos.length})</h2>
          {produtos.map((produto) => (
            <div
              key={produto.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <td>
                <button onClick={() => handleStartEdit(produto)}>Editar</button>

                <button onClick={() => handleDelete(produto.id)}>
                  Excluir
                </button>
              </td>
              <p>
                <strong>ID:</strong> {produto.id}
              </p>
              <p>
                <strong>Nome:</strong> {produto.nome}
              </p>
              <p>
                <strong>Preço:</strong> R$ {produto.preco}
              </p>
              <p>
                <strong>Descrição:</strong> {produto.descricao}
              </p>
              <p>
                <strong>Categoria:</strong> {produto.categoria}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        style={{ margin: "20px", padding: "20px", border: "1px dashed gray" }}
      >
        <h2>Adicionar Novo Produto</h2>
        <ProdutoForm
          onCadastroSucesso={handleProdutoCadastrado}
          produtoInicial={produtoEmEdicao}
        />
      </div>
    </div>
  );
}
