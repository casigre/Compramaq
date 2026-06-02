import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import DashboardClient from "./dashboard-client";

export default async function Home() {
  const { data: machines } = await supabase.from("machines").select("*").order("created_at", { ascending: false });
  const { data: images } = await supabase.from("machine_images").select("*");
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return (
    <DashboardClient
      machines={(machines ?? []) as Machine[]}
      images={(images ?? []) as MachineImage[]}
      categories={(categories ?? []) as Category[]}
    />
  );
}
