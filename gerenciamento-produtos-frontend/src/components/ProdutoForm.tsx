import { useState } from "react";
import { Produto } from "../types/Produto";
import axios from "axios";

interface Props {
  onCadastroSucesso: () => void;
}

export default function ProdutoForm({ onCadastroSucesso }: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/produtos`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let precoLimpo = preco.replace(",", ".");
    let precoNumerico: number = Number(precoLimpo);

    const novoProduto = {
      nome: nome,
      descricao: descricao,
      preco: precoNumerico,
      categoria: categoria,
    };

    try {
      const response = await axios.post(API_BASE_URL, novoProduto);

      if (response.status == 201) {
        setNome("");
        setDescricao("");
        setPreco("");
        setCategoria("");
        setMensagem("Produto cadastrado com sucesso!");
        onCadastroSucesso();
      }
    } catch (error) {
      console.error("Erro ao cadastrar o produto", error);
      setMensagem("Erro ao cadastrar o produto. Tente novamente.");
    }
  };

  return (
    // O formulário HTML
    <form onSubmit={handleSubmit}>
      <h2>{mensagem && <p>{mensagem}</p>}</h2>
      <label>Nome:</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <label>Descrição:</label>
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <label>Preço:</label>
      <input
        type="text"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <label>Categoria:</label>
      <input
        type="text"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <button type="submit">Cadastrar Produto</button>
    </form>
  );
}
