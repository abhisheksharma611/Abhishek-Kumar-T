import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";

import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="relative z-10">
        <Sidebar />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Education />
          <Experience />
          <Certifications />
          <Projects />
          <Contact />
        </main>
      </div>
    </>
  );
}
