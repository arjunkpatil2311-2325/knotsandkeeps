export default function AboutPage() {
  return (
    <div className="w-full pb-24">
      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 max-w-4xl mx-auto mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-12 text-center">About ThreeKnots</h1>
        
        <div className="prose prose-lg text-gray-700 mx-auto space-y-8">
          <div className="bg-brand-bg p-8 rounded-3xl border border-brand-rose/10">
            <p className="text-xl font-medium leading-relaxed">
              Welcome to ThreeKnots, where passion meets craftsmanship. We specialize in creating premium, handcrafted bracelets inspired by anime, pop culture, and timeless themes.
            </p>
          </div>
          
          <p className="text-lg leading-relaxed px-4">
            Every piece is meticulously designed to be more than just an accessory. It's a statement, a memory, and a piece of art that you can wear every day. The name "ThreeKnots" reflects our philosophy: crafting intricate knots that turn into keepsakes you'll cherish forever.
          </p>
          
          <div className="flex items-center gap-4 mt-16 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">🎯</div>
            <h2 className="text-2xl md:text-3xl font-black text-black m-0">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed px-4">
            Our mission is simple: to provide fans and fashion enthusiasts with high-quality, durable, and stylish bracelets that resonate with their personal style and passions. We believe that subtle nods to your favorite themes make the best conversational pieces.
          </p>
          
          <div className="flex items-center gap-4 mt-16 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">✨</div>
            <h2 className="text-2xl md:text-3xl font-black text-black m-0">Quality & Craftsmanship</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed px-4">
            We source only the best materials, ensuring that every knot is tight, every bead is perfect, and every bracelet stands the test of time. Handcrafted with love and attention to detail, a ThreeKnots bracelet is truly made to keep.
          </p>
        </div>
      </div>
    </div>
  )
}
