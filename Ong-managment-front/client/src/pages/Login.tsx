import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, Loader2 } from "lucide-react";
import { useLocation } from "wouter"; 
import axios from "axios";
import { getApiUrl } from "@/const";

export default function Login() {
  // 1. Estados locais para o formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hook de autenticação
  const { login } = useAuth();

  // 3. Navegação
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };

      const response = await axios.post(`${getApiUrl()}${endpoint}`, payload);

      if (!isRegister) {
        const token = response.data.token;
        // Atualiza o estado interno e salva no localStorage
        await login(token);
        
        // Força o recarregamento total para atualizar o estado global de autenticação
        window.location.href = "/";
      } else {
        setIsRegister(false);
        setError("Cadastro realizado com sucesso! Faça login para continuar.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erro ao processar requisição");
      } else {
        setError("Erro ao processar requisição");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
              Gestão de Crianças
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-400">
              Sistema elegante para gerenciamento de plantão e cuidados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Seu nome"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRegister ? (
                "Cadastrar"
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isRegister
                ? "Já tem conta? Faça login"
                : "Não tem conta? Cadastre-se"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}