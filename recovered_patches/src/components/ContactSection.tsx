import { motion } from "framer-motion";
import { Send, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";

const RECIPIENT = "nabilsajid55@gmail.com";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const handlePrefill = (e: any) => {
      setForm((prev) => ({ ...prev, message: e.detail }));
    };
    
    // Add event listener
    window.addEventListener('prefill-contact', handlePrefill);
    
    // Cleanup
    return () => window.removeEventListener('prefill-contact', handlePrefill);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5415be8e-c85c-4ab6-8afa-5f8f2eadfb22", 
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New Portfolio Message from ${form.name}`,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleBookCall = () => {
    const subject = encodeURIComponent("Book a Call – Portfolio Inquiry");
    const body = encodeURIComponent(
      "Hi Nabil,\n\nI'd like to book a call with you to discuss a project.\n\nPlease let me know your availability.\n\nThanks!"
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="section-padding max-w-4xl mx-auto">
      <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Let's talk." />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-effect rounded-2xl p-8 md:p-12"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={10}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-y overflow-y-auto"
              placeholder="Tell me about your project..."
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg glass-effect text-sm font-medium text-foreground hover:border-primary/40 transition-all disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              {status === "loading" ? "Sending..." : 
               status === "success" ? "Message Sent!" : 
               status === "error" ? "Error! Try Again" : "Send Message"}
            </button>
            <button
              type="button"
              onClick={handleBookCall}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg glow-button text-sm font-bold text-primary-foreground"
            >
              <Phone className="w-4 h-4" />
              Book a Call
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactSection;
