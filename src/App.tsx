import { lazy, Suspense } from "react";
import styles from "./App.module.css";
import ParticleBackground from "./components/ParticleBackground";
import Navigation from "./components/Navigation";
import About from "./components/About";

const Portfolio = lazy(() => import("./components/Portfolio"));
const Experience = lazy(() => import("./components/Experience"));
const Certifications = lazy(() => import("./components/Certifications"));
const Education = lazy(() => import("./components/Education"));
const Contact = lazy(() => import("./components/Contact"));

export default function App() {
    return (
        <>
            <ParticleBackground />

            <Navigation />

            <main className={styles.main}>
                <About />
                <Suspense fallback={null}>
                    <Portfolio />
                </Suspense>
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
                <Suspense fallback={null}>
                    <Certifications />
                </Suspense>
                <Suspense fallback={null}>
                    <Education />
                </Suspense>
                <Suspense fallback={null}>
                    <Contact />
                </Suspense>
            </main>
        </>
    );
}
