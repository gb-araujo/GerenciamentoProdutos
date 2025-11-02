import { useEffect, useState } from "react";
import { Produto } from "../types/Produto";
import axios from "axios";

interface Props {
  onCadastroSucesso: () => void;
  produtoInicial: Produto | null;
}

export default function ProdutoForm({
  onCadastroSucesso,
  produtoInicial,
}: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/produtos`;

  useEffect(() => {
    if (produtoInicial) {
      setNome(produtoInicial.nome);
      setDescricao(produtoInicial.descricao);
      setPreco(produtoInicial.preco.toFixed(2).replace(".", ","));
      setCategoria(produtoInicial.categoria);
      setMensagem(`Editando Produto ID: ${produtoInicial.id}`);
    }
  }, [produtoInicial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let precoLimpo = preco.replace(",", ".");
    let precoNumerico: number = Number(precoLimpo);

    const dadosFormulario = {
      nome: nome,
      descricao: descricao,
      preco: precoNumerico,
      categoria: categoria,
    };

    try {
      let response;
      let url;

      if (produtoInicial) {
        url = `${API_BASE_URL}/${produtoInicial.id}`;
        const produtoComId = { ...dadosFormulario, id: produtoInicial.id };
        response = await axios.put(url, produtoComId);
      } else {
        url = API_BASE_URL;
        response = await axios.post(url, dadosFormulario);
      }

      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 200
      ) {
        setNome("");
        setDescricao("");
        setPreco("");
        setCategoria("");
        setMensagem("Operação realizada com sucesso!");

        onCadastroSucesso();
      }
    } catch (error) {
      console.error("Erro ao cadastrar o produto", error);
      setMensagem("Erro ao cadastrar o produto. Tente novamente.");
    }
  };

  return (
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
