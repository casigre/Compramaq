import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import NewMachineForm from "./form";

export default async function NewMachinePage() {
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Nueva máquina</h1>
      <NewMachineForm categories={(categories ?? []) as Category[]} />
    </div>
  );
}
