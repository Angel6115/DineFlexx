import { useState } from "react"

export default function ChatGastronomico() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    setResponse("")

    // Simulación de respuesta GPT (puede integrarse a API real)
    setTimeout(() => {
      setResponse(
        `🍲 Recomendación basada en tu búsqueda: "${query}"\nPrueba el restaurante "Sabor del Chef" que tiene excelente risotto de mariscos.`
      )
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="mt-10 bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold mb-3">🤖 Recomendador Gastronómico</h2>
      <p className="text-sm text-gray-500 mb-4">Explora experiencias por tipo de comida o zona.</p>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: sushi en Condado, comida vegana, risotto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleAsk}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {response && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-xl text-left text-sm text-gray-700 whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  )
}
