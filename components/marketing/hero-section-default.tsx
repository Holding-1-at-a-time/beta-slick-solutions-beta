import { HeroSection } from "./hero-section"

export default function DefaultHeroSection() {
  return (
    <HeroSection
      title="Streamline Your Vehicle Service Business"
      subtitle="Our all-in-one platform helps you manage appointments, track vehicles, and grow your business with AI-powered insights."
      ctaText="Get Started"
      ctaLink="/sign-up"
      secondaryCtaText="View Pricing"
      secondaryCtaLink="/pricing"
      imageUrl="/modern-vehicle-service.png"
    />
  )
}
