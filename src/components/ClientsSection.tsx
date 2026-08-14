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

  const getLogoStyle = (name: string) => {
    const n = name.toLowerCase();
    
    // For logos with massive transparent padding, we must increase the height
    // AND override the max-width constraint so they can overflow their grid cell
    // and visually fill the space.
    if (n.includes('daily') || n.includes('tde')) {
      return 'h-[100px] md:h-[150px] lg:h-[200px] max-w-[200%] md:max-w-[250%]';
    }
    
    if (n.includes('naz') || n.includes('criara')) {
      return 'h-[80px] md:h-[120px] lg:h-[160px] max-w-[150%] md:max-w-[200%]';
    }
    
    if (n.includes('byd')) {
      return 'h-[80px] md:h-[120px] lg:h-[150px] max-w-[150%]';
    }
    
    if (n.includes('everafter')) {
      return 'h-[70px] md:h-[90px] lg:h-[110px] max-w-[120%]';
    }
    
    if (n.includes('globe')) {
      return 'h-[50px] md:h-[70px] lg:h-[80px] max-w-[90%]';
    }
    
    // Very dense / chunky logos need smaller height so they aren't overpowering
    if (n.includes('four star') || n.includes('east west') || n.includes('fargo') || n.includes('one') || n.includes('level')) {
      return 'h-[35px] md:h-[45px] lg:h-[55px] max-w-[90%]';
    }

    // Default size for new or well-cropped logos
    return 'max-h-[60px] md:max-h-[80px] lg:max-h-[90px] max-w-[90%] md:max-w-[80%]';
  };

  if (loading && clients.length === 0) return null;
  if (clients.length === 0) return null;

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <SectionHeading title="Clients" subtitle="Brands and creators I've collaborated with" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 py-8 place-items-center">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-center w-full h-[120px] md:h-[150px]"
          >
            <img
              src={client.image_url}
              alt={client.name}
              className={`${getLogoStyle(client.name)} w-auto object-contain opacity-80 hover:opacity-100 transition-all hover:scale-110`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;
