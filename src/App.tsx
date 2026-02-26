import ParticleBackground from "./components/ParticleBackground";
import Navigation from "./components/Navigation";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";

export default function App() {
    return (
        <>
            {/* Interactive particle network background */}
            <ParticleBackground />

            {/* Fixed navigation with theme toggle */}
            <Navigation />

            {/* Page sections */}
            <main className="relative z-10 w-full flex flex-col items-center overflow-x-hidden">
                <About />
                <Experience />
                <Skills />
                <Education />
                <Portfolio />
                <Contact />
            </main>
        </>
    );
}
