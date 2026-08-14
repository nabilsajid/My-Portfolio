import { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { supabase } from "@/lib/supabase";

const ClientsSection = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching client logos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && clients.length === 0) return null;
  if (clients.length === 0) return null;

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <SectionHeading title="Clients" subtitle="Brands and creators I've collaborated with" />
      
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 py-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`flex items-center justify-center ${
              client.name === "BYD" ? "h-[141px] md:h-[198px]" :
              client.name === "Globe" ? "h-[60px] md:h-[84px]" : 
              client.name === "EverAfter" ? "h-[108px] md:h-[150px]" : 
              client.name === "Zenetic Esports" ? "h-12 md:h-16" : 
              "h-10 md:h-14"
            }`}
          >
            <img
              src={client.image_url}
              alt={client.name}
              className={`h-full w-auto object-contain ${
                client.name === "Zenetic Esports" ? "max-w-[200px] md:max-w-[260px]" : 
                client.name === "BYD" ? "max-w-[282px] md:max-w-[375px]" :
                "max-w-[120px] md:max-w-[160px]"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;
