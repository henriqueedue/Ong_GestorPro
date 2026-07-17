import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Streamdown } from 'streamdown';

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // 1. Lógica de proteção: redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // 2. Estado de carregamento: enquanto o hook verifica o token, mostra um loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // 3. Se não estiver autenticado, retorna null (o useEffect redirecionará em breve)
  if (!isAuthenticated) {
    return null;
  }

  // 4. Se chegou aqui, o usuário está autenticado. Renderiza o conteúdo principal.
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Bem-vindo, {user?.name || "Usuário"}
        </h1>
        <Button variant="ghost" onClick={logout}>
          Sair
        </Button>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Sistema carregado com sucesso.
            </p>
            
            {/* Exemplo de uso de componentes */}
            <Streamdown>Conteúdo **seguro** renderizado apenas após autenticação.</Streamdown>
            
            <div className="mt-6">
              <Button variant="default">Cadastrar Criança</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}