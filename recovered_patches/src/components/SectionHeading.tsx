import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ title, subtitle, align = "center" }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-8 md:mb-12 ${align === "center" ? "text-center flex flex-col items-center" : ""}`}
  >
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
    {subtitle && <p className={`mt-3 text-muted-foreground text-lg max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
