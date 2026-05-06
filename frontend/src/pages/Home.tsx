import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";

export function Home() {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="h-14 sm:h-16 bg-gray-300 flex items-center justify-between px-3 sm:px-4 shadow">
        <button onClick={() => setSidebarAberta(true)}>
          <Menu size={32} className="text-black sm:w-9 sm:h-9" />
        </button>

        <div className="w-11 h-11 sm:w-14 sm:h-14 bg-black rounded-full" />
      </header>

      {/* Fundo escuro */}
      <div
        onClick={() => setSidebarAberta(false)}
        className={`
          fixed inset-0 bg-black/30 z-40 transition-opacity duration-300
          ${sidebarAberta ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white shadow-xl z-50
          transform transition-all duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold">Menu</h2>

          <button onClick={() => setSidebarAberta(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-3 p-4">
          <button
            className="
              text-left px-4 py-3 rounded-xl
              bg-gray-100
              hover:bg-gray-300
              hover:shadow-md
              hover:scale-[1.02]
              transition-all duration-200
              font-medium
            "
          >
            Atividades Ativas
          </button>

          <button
            className="
              text-left px-4 py-3 rounded-xl
              bg-gray-100
              hover:bg-gray-300
              hover:shadow-md
              hover:scale-[1.02]
              transition-all duration-200
              font-medium
            "
          >
            Atividades concluidas
          </button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <section className="p-4 sm:p-6">
        <button
  className="
    w-full sm:w-auto
    flex items-center justify-center sm:justify-start gap-3
    bg-gray-200
    px-4 sm:px-6 py-4
    rounded-xl
    hover:bg-gray-300
    hover:shadow-md
    hover:scale-[1.02]
    transition-all duration-200
    font-medium
  "
>
  <Plus size={32} className="sm:w-9 sm:h-9" />

  <span className="text-lg sm:text-2xl">
    CRIAR ATIVIDADE
  </span>
</button>
      </section>
    </main>
  );
}