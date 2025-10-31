import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Produto } from "./types/Produto";

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  return <div></div>;
}
