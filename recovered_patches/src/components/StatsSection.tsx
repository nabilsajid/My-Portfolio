import { useState, useEffect } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { supabase } from "@/lib/supabase";

const StatsSection = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        setStats(data || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex flex-col items-center gap-2">
              <div className="h-10 bg-secondary/50 rounded w-16"></div>
              <div className="h-4 bg-secondary rounded w-24"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat) => (
          <AnimatedCounter 
            key={stat.id} 
            end={stat.end_value} 
            suffix={stat.suffix || ""} 
            label={stat.label} 
          />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
