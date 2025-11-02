import { useEffect, useState } from "react";
import { Produto } from "../types/Produto";
import axios from "axios";

interface Props {
  onCadastroSucesso: () => void;
  produtoInicial: Produto | null;
  onCancelEdit: () => void;
}

export default function ProdutoForm({
  onCadastroSucesso,
  produtoInicial,
  onCancelEdit,
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
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-md bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        {produtoInicial ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>

      {mensagem && (
        <p
          className={
            mensagem.includes("sucesso")
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {mensagem}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome:
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição:
        </label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço (Ex: 10,50):
        </label>
        <input
          type="text"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria:
        </label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {produtoInicial ? "Salvar Alterações" : "Cadastrar Produto"}
      </button>

      {produtoInicial && (
        <button
          type="button"
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-2"
          onClick={() => onCancelEdit()}
        >
          Cancelar Edição
        </button>
      )}
    </form>
  );
}
