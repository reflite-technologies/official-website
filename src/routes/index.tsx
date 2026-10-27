import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WebDevelopment } from "@/components/sections/WebDevelopment";
import { GraphicDesign } from "@/components/sections/GraphicDesign";
import { VideoEditing } from "@/components/sections/VideoEditing";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { CallToAction } from "@/components/sections/CallToAction";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { AssistantLauncher } from "@/components/AssistantLauncher";

const title = "Reflite Technologies | Web, Design & Digital Services in Kaimosi";
const description =
  "Reflite Technologies delivers web development, graphic design, video editing, cyber, printing and government service assistance in Kaimosi, Kenya.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WebDevelopment />
        <GraphicDesign />
        <VideoEditing />
        <WhyUs />
        <Process />
        <Projects />
        <Testimonials />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
      <AssistantLauncher />
    </>
  );
}
