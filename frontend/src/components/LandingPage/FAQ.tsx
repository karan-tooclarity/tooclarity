

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// FAQ Component
const FAQ = () => {
  const faqs = [
    {
      question: "What is the cost to list my institution on Too Clarity?",
      answer:
        "Too Clarity provides a verified marketplace where educational institutions can showcase their programs and connect directly with students who are actively searching for quality education opportunities.",
    },
    {
      question: "How does Too Clarity ensure the quality of student leads?",
      answer:
        "We focus exclusively on quality leads and verified institutions. Our platform is designed to reduce costs while increasing reach, ensuring both students and institutions get the best possible matches.",
    },
    {
      question: "Can I edit my institute or program details after my listing is live?",
      answer:
        "We offer the first two months completely free! After that, our pricing is competitive and designed to provide excellent ROI for educational institutions of all sizes.",
    },
    {
      question: "What information should I have ready before I start the listing process?",
      answer:
        "Absolutely! Our comprehensive dashboard provides detailed analytics including program views, student inquiries, conversion rates, and much more to help you optimize your listings.",
    },
    {
      question: "What kind of analytics and performance data will I be able to see?",
      answer:
        "Once your profile is set up and verified, you can start receiving qualified inquiries within 24-48 hours. Our platform connects you with students who are actively searching.",
    },
    {
      question: "My program listing is about to expire. How do I renew it?",
      answer:
        "Once your profile is set up and verified, you can start receiving qualified inquiries within 24-48 hours. Our platform connects you with students who are actively searching.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Have Questions? We Have <br /> Answers.
        </h2>
        <p className="text-xl text-gray-600">
          We&apos;ve compiled answers to the most common questions
          <br /> we get from institutions.
        </p>
      </div>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <Accordion type="single" collapsible className="w-full flex flex-col font-montserrat">
          {faqs.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx + 1}`}
              className="w-full border-b border-gray-700 last:border-b-0" // darker border // bottom border line separation
            >
              <AccordionTrigger className="flex w-full items-center justify-between px-6 py-4 font-medium transition-colors hover:bg-gray-100 hover:no-underline text-left text-sm sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="w-full px-6 pb-4 pt-2 text-gray-600 text-sm sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>

  );
};

export default FAQ;
