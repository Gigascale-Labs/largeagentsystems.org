import { Nav } from "./components/nav";
import { Hero } from "./components/hero";
import { ComplexSystem } from "./components/complex-system";
import { GrowthChart } from "./components/growth-chart";
import { QuantityQuality } from "./components/quantity-quality";
import { ThreatModels } from "./components/threat-models";
import { Disciplines } from "./components/disciplines";
import { FocusAreas } from "./components/focus-areas";
import { OpenQuestions } from "./components/open-questions";
import { Barriers } from "./components/barriers";
import { Join } from "./components/join";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ComplexSystem />
        <GrowthChart />
        <QuantityQuality />
        <ThreatModels />
        <Disciplines />
        <FocusAreas />
        <OpenQuestions />
        <Barriers />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
