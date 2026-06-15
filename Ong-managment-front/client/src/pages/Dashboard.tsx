import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ChildrenTab from "./tabs/ChildrenTab";
import MedicinesTab from "./tabs/MedicinesTab";
import IncidentsTab from "./tabs/IncidentsTab";
import ShiftsTab from "./tabs/ShiftsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("children");

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full">
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Gestão de Crianças
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Sistema de gerenciamento de plantão e cuidados
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full flex flex-col"
          >
            <div className="px-8 pt-6 border-b border-slate-200 dark:border-slate-700">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
                <TabsTrigger value="children" className="text-base">
                  Crianças
                </TabsTrigger>
                <TabsTrigger value="medicines" className="text-base">
                  Remédios
                </TabsTrigger>
                <TabsTrigger value="incidents" className="text-base">
                  Ocorridos
                </TabsTrigger>
                <TabsTrigger value="shifts" className="text-base">
                  Plantão
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="children" className="h-full p-8">
                <ChildrenTab />
              </TabsContent>
              <TabsContent value="medicines" className="h-full p-8">
                <MedicinesTab />
              </TabsContent>
              <TabsContent value="incidents" className="h-full p-8">
                <IncidentsTab />
              </TabsContent>
              <TabsContent value="shifts" className="h-full p-8">
                <ShiftsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
