import { SmoothScroll } from "../components/site/SmoothScroll";
import { SiteNav } from "../components/site/SiteNav";
import { SiteFooter } from "../components/site/SiteFooter";
import { Hero } from "../components/site/Hero";
import { GradcamStory } from "../components/site/GradcamStory";
import { FeatureGrid } from "../components/site/FeatureGrid";
import { TrustSection } from "../components/site/TrustSection";
import { CtaBand } from "../components/site/CtaBand";

export default function HomePage() {
  return (
    <SmoothScroll>
      <SiteNav />
      <main>
        <Hero />
        <GradcamStory />
        <FeatureGrid />
        <TrustSection />
        <CtaBand />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
