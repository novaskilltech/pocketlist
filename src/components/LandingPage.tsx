import { motion } from 'motion/react';
import { Sparkles, Users, Share2, ShoppingBag, ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import { useTranslation, LOCALE_META, Locale } from '../i18n';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div className="min-h-screen bg-gunmetal text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gunmetal/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-chartreuse rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gunmetal" />
            </div>
            <span className="text-xl font-bold tracking-tight">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full text-sm font-medium transition-all">
                <span>{LOCALE_META[locale].flag}</span>
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-gunmetal/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
                {(Object.keys(LOCALE_META) as Locale[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${l === locale ? 'bg-chartreuse text-gunmetal font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span className="text-lg">{LOCALE_META[l].flag}</span>
                    <span>{LOCALE_META[l].label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
            >
              {t('landing.login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-chartreuse/10 text-chartreuse px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t('landing.badge')}
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              {t('landing.heroLine1')} <br />
              <span className="text-chartreuse">{t('landing.heroLine2')}</span>
            </h1>
            <p className="text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
              {t('landing.heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-chartreuse text-gunmetal px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(223,255,0,0.3)] transition-all active:scale-95"
              >
                {t('landing.cta')}
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
                <span className="text-sm text-white/40 font-medium">{t('landing.users')}</span>
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
              <img src="https://picsum.photos/seed/app-preview/800/1000" alt="App Preview" className="rounded-[1.5rem] w-full object-cover aspect-[4/5]" referrerPolicy="no-referrer" />
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
                    <div className="font-bold">✓</div>
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
                    <div className="text-xs text-white/40 uppercase font-bold tracking-widest">{t('dash.premium')}</div>
                    <div className="font-bold">{t('landing.genius')}</div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-chartreuse/10 blur-[120px] rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('landing.featuresTitle')}</h2>
            <p className="text-white/40 max-w-xl mx-auto">{t('landing.featuresDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles className="w-6 h-6" />, title: t('landing.genius'), desc: t('landing.geniusDesc') },
              { icon: <Users className="w-6 h-6" />, title: t('landing.committee'), desc: t('landing.committeeDesc') },
              { icon: <Share2 className="w-6 h-6" />, title: t('landing.share'), desc: t('landing.shareDesc') },
              { icon: <ShoppingBag className="w-6 h-6" />, title: t('landing.essentials'), desc: t('landing.essentialsDesc') },
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

      {/* Social Proof */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl text-chartreuse/20 font-serif mb-8">"</div>
          <p className="text-3xl font-medium leading-tight mb-8">{t('landing.quote')}</p>
          <div className="flex items-center justify-center gap-4">
            <img src="https://picsum.photos/seed/testimonial/100/100" className="w-12 h-12 rounded-full" alt="User" referrerPolicy="no-referrer" />
            <div className="text-left">
              <div className="font-bold">{t('landing.quoteAuthor')}</div>
              <div className="text-sm text-white/40">{t('landing.quoteSince')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-chartreuse rounded-[3rem] p-12 lg:p-20 text-gunmetal text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8">{t('landing.ctaTitle')}</h2>
            <button onClick={onGetStarted} className="bg-gunmetal text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform active:scale-95 shadow-2xl">
              {t('landing.ctaBtn')}
            </button>
          </div>
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
            <span className="font-bold">{t('appName')}</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">{t('landing.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('landing.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('landing.contact')}</a>
          </div>
          <div className="text-sm text-white/20">{t('landing.copyright')}</div>
        </div>
      </footer>
    </div>
  );
}
