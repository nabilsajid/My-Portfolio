import SectionHeading from "./SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const FAQSection = () => {
  const faqs = [
    { id: 1, question: "What is your typical turnaround time?", answer: "Usually 2-3 weeks for a standard project, but this can vary based on scope and the package selected." },
    { id: 2, question: "Do you travel for shoots?", answer: "Yes, I am available for travel depending on the project requirements and schedule." },
    { id: 3, question: "How many revisions are included?", answer: "Most packages include up to 2 rounds of revisions to ensure you are completely satisfied with the final result." },
    { id: 4, question: "What do you need from me to get started?", answer: "I usually need a brief outlining your goals, any brand guidelines (logos, fonts, colors), and reference videos or inspiration." },
    { id: 5, question: "Can you provide the raw footage?", answer: "Yes, raw project files and footage can be provided upon request, though an additional storage and transfer fee may apply." },
    { id: 6, question: "Do you help with conceptualizing and scripting?", answer: "Absolutely! I can assist with pre-production planning, creative direction, and scriptwriting if you need help bringing your vision to life." },
  ];

  return (
    <section className="section-padding max-w-3xl mx-auto">
      <SectionHeading title="FAQ" subtitle="Common questions answered" />
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq: any) => (
          <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="bg-card border border-border rounded-lg px-5">
            <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
