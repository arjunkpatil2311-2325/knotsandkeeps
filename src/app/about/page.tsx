import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="w-full bg-white selection:bg-brand-soft-pink selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b-2 border-black bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-2xl">
              <div className="inline-block mb-6 px-4 py-1.5 border-2 border-black rounded-full bg-neo-yellow text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_0_#000]">
                Handcrafted • Made To Keep
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[1.1] mb-6 uppercase">
                The Story Behind ThreeKnots
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-bold max-w-lg">
                Made with stories. Worn with meaning.
              </p>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="absolute top-4 -left-4 w-full h-full bg-neo-blue rounded-3xl border-2 border-black" />
              <div className="absolute -top-4 -right-4 w-full h-full bg-neo-pink rounded-3xl border-2 border-black" />
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_0_#000] z-10 group">
                <Image 
                  src="/hero-bracelets.png" 
                  alt="ThreeKnots Handcrafted Bracelets" 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND STORY */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase leading-[1.2] mb-8">
            We don't just make bracelets.<br/>
            <span className="text-brand-accent relative inline-block">
              We make something you keep.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Every piece is meticulously designed to be more than just an accessory. It's a statement, a memory, and a piece of art that you can wear every day. We believe that subtle nods to your favorite themes make the best conversational pieces.
          </p>
        </div>
      </section>

      {/* 3. WHY THREEKNOTS */}
      <section className="py-24 md:py-32 bg-brand-bg border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
              Why "ThreeKnots"?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0_0_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all duration-300 group">
              <span className="text-4xl font-black text-brand-soft-pink block mb-4 group-hover:text-neo-pink transition-colors">01</span>
              <h3 className="text-2xl font-black text-black uppercase mb-4">The Knot</h3>
              <p className="text-lg text-gray-600 font-bold">Connection</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0_0_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all duration-300 group mt-0 md:mt-8">
              <span className="text-4xl font-black text-brand-soft-pink block mb-4 group-hover:text-neo-pink transition-colors">02</span>
              <h3 className="text-2xl font-black text-black uppercase mb-4">The Knot</h3>
              <p className="text-lg text-gray-600 font-bold">Memory</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0_0_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all duration-300 group mt-0 md:mt-16">
              <span className="text-4xl font-black text-brand-soft-pink block mb-4 group-hover:text-neo-pink transition-colors">03</span>
              <h3 className="text-2xl font-black text-black uppercase mb-4">The Knot</h3>
              <p className="text-lg text-gray-600 font-bold">The things we keep</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MADE TO KEEP */}
      <section className="py-24 md:py-32 bg-neo-pink relative overflow-hidden border-b-2 border-black">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-black shadow-[8px_8px_0_0_#000] bg-white group">
              <Image 
                src="/hero-spiderman.png" 
                alt="Handcrafted Details" 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight uppercase leading-[1.1] mb-6">
                Made by hand.<br/>Made to last.
              </h2>
              <p className="text-xl text-black font-medium leading-relaxed max-w-lg mb-8">
                We source only the best materials, ensuring that every knot is tight, every bead is perfect, and every bracelet stands the test of time. 
              </p>
              <div className="inline-block px-6 py-3 bg-white border-2 border-black rounded-xl font-bold text-black shadow-[4px_4px_0_0_#000] transform -rotate-2">
                Truly made to keep.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR INSPIRATION */}
      <section className="py-24 md:py-32 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase mb-4">
              Our Inspiration
            </h2>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Driven by the worlds we love, translated into everyday style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="aspect-square bg-neo-blue rounded-3xl border-2 border-black p-6 flex flex-col justify-end shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <h3 className="text-2xl font-black text-black uppercase tracking-wider">Anime</h3>
            </div>
            <div className="aspect-square bg-neo-yellow rounded-3xl border-2 border-black p-6 flex flex-col justify-end shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all lg:-translate-y-4">
              <h3 className="text-2xl font-black text-black uppercase tracking-wider">Stories</h3>
            </div>
            <div className="aspect-square bg-brand-soft-pink rounded-3xl border-2 border-black p-6 flex flex-col justify-end shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all lg:translate-y-4">
              <h3 className="text-2xl font-black text-black uppercase tracking-wider">Characters</h3>
            </div>
            <div className="aspect-square bg-neo-bg rounded-3xl border-2 border-black p-6 flex flex-col justify-end shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <h3 className="text-2xl font-black text-black uppercase tracking-wider">Style</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP */}
      <section className="py-24 md:py-32 bg-black text-white relative overflow-hidden">
        {/* Subtle decorative grid/lines could go here if we had one, using basic CSS for now */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px] opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-8">
            Every knot has a purpose.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-12">
            No shortcuts. No mass production. Just careful, deliberate craftsmanship meant to create something that feels personal the moment you put it on.
          </p>
          <div className="w-24 h-1 bg-neo-yellow mx-auto rounded-full" />
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight uppercase mb-6">
            Find Your Next Knot
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-bold mb-12">
            Discover the bracelets made to become part of your story.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-white border-2 border-black rounded-full font-black text-sm md:text-base uppercase tracking-wider shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
            >
              Shop Bracelets &rarr;
            </Link>
            
            <Link 
              href="/collections" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black border-2 border-black rounded-full font-black text-sm md:text-base uppercase tracking-wider shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none hover:bg-brand-soft-pink"
            >
              Explore Collections &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
