import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart } from "lucide-react";

export default function Login() {
  const loginUrl = getLoginUrl();

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

          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Faça login com sua conta para acessar o sistema
            </p>
            <a href={loginUrl}>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
              >
                Entrar com Manus
              </Button>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Sistema seguro com autenticação OAuth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
