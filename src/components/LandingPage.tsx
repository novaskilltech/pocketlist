import { motion } from 'motion/react';
import { Sparkles, Users, Share2, ShoppingBag, ArrowRight, CheckCircle2, Crown } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gunmetal text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gunmetal/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-chartreuse rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gunmetal" />
            </div>
            <span className="text-xl font-bold tracking-tight">PocketList</span>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
          >
            Se connecter
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-chartreuse/10 text-chartreuse px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              L'IA au service de vos courses
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              Vos courses, <br />
              <span className="text-chartreuse">simplifiées.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
              PocketList transforme la corvée des courses en une expérience fluide, intelligente et collaborative. Fini les oublis, fini les messages perdus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-chartreuse text-gunmetal px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(223,255,0,0.3)] transition-all active:scale-95"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-8 h-8 rounded-full border-2 border-gunmetal"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <span className="text-sm text-white/40 font-medium">+2k utilisateurs actifs</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-[2rem] p-4 shadow-2xl backdrop-blur-sm">
              <img
                src="https://picsum.photos/seed/app-preview/800/1000"
                alt="App Preview"
                className="rounded-[1.5rem] w-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
              {/* Floating UI elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-6 top-1/4 bg-gunmetal border border-white/10 p-4 rounded-2xl shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chartreuse/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-chartreuse" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Status</div>
                    <div className="font-bold">Lait d'avoine coché</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-6 bottom-1/4 bg-gunmetal border border-white/10 p-4 rounded-2xl shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Premium</div>
                    <div className="font-bold">Mode Genius activé</div>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-chartreuse/10 blur-[120px] rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-white/40 max-w-xl mx-auto">Une suite d'outils pensés pour rendre votre organisation quotidienne plus sereine.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles className="w-6 h-6" />, title: 'Mode Genius', desc: "L'IA génère vos listes à partir de vos envies ou recettes." },
              { icon: <Users className="w-6 h-6" />, title: 'Mode Comité', desc: 'Collaborez en temps réel avec toute la famille.' },
              { icon: <Share2 className="w-6 h-6" />, title: 'Partage WhatsApp', desc: 'Envoyez vos besoins en un clic à vos proches.' },
              { icon: <ShoppingBag className="w-6 h-6" />, title: 'Essentiels', desc: 'Une bibliothèque de produits prêts à être ajoutés.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-colors group">
                <div className="w-12 h-12 bg-chartreuse/10 text-chartreuse rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Quote */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl text-chartreuse/20 font-serif mb-8">"</div>
          <p className="text-3xl font-medium leading-tight mb-8">
            PocketList a radicalement changé notre organisation familiale. Plus besoin de s'appeler dix fois au supermarché, tout est synchronisé en temps réel.
          </p>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://picsum.photos/seed/testimonial/100/100"
              className="w-12 h-12 rounded-full"
              alt="User"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <div className="font-bold">Marie L.</div>
              <div className="text-sm text-white/40">Utilisatrice depuis 6 mois</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-chartreuse rounded-[3rem] p-12 lg:p-20 text-gunmetal text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8">Prêt à simplifier vos courses ?</h2>
            <button
              onClick={onGetStarted}
              className="bg-gunmetal text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform active:scale-95 shadow-2xl"
            >
              Créer ma première liste
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-chartreuse rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-gunmetal" />
            </div>
            <span className="font-bold">PocketList</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-white/20">
            © 2026 PocketList. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
