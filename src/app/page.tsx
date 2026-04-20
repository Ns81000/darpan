import Hero from '@/components/sections/home/Hero'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import ServicesSnapshot from '@/components/sections/home/ServicesSnapshot'
import FeaturedWork from '@/components/sections/home/FeaturedWork'
import SocialProof from '@/components/sections/home/SocialProof'
import CtaStrip from '@/components/sections/home/CtaStrip'

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <ServicesSnapshot />
      <FeaturedWork />
      <SocialProof />
      <CtaStrip />
    </main>
  );
}
