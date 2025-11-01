import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Produto } from "./types/Produto";
import axios from "axios";

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "https://localhost:7271/api/produtos";

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get<Produto[]>(API_URL);

        setProdutos(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Falha ao carregar produtos. Verifique se a API está em execução e CORS configurado "
        );
      }
    };
    fetchProdutos();
  }, []);

  return (
    <div className="App">
      <h1>Gerenciamento de Produtos (React/TS)</h1>

      {loading && <p>Carregando dados da API...</p>}

      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && !error && (
        <div>
          <h2>Lista de Produtos ({produtos.length})</h2>
          {/* Usamos o método map() do JavaScript para renderizar cada item do array */}
          {produtos.map((produto) => (
            <div
              key={produto.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
