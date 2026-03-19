import { lazy, Suspense } from "react";
import styles from "./App.module.css";
import ParticleBackground from "./components/ParticleBackground";
import Navigation from "./components/Navigation";
import About from "./components/About";

// Lazy load below-fold components — only fetched when needed
const Portfolio = lazy(() => import("./components/Portfolio"));
const Experience = lazy(() => import("./components/Experience"));
const Certifications = lazy(() => import("./components/Certifications"));
const Education = lazy(() => import("./components/Education"));
const Contact = lazy(() => import("./components/Contact"));

export default function App() {
    return (
        <>
            {/* Interactive particle network background */}
            <ParticleBackground />

            {/* Fixed navigation with theme toggle */}
            <Navigation />

            {/* Page sections */}
            <main className={styles.main}>
                <About />
                <Suspense>
                    <Portfolio />
                    <Experience />
                    <Certifications />
                    <Education />
                    <Contact />
                </Suspense>
            </main>
        </>
    );
}
