import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Mail, MapPin, Shield, FileText } from 'lucide-react';
import { useTranslation } from '../i18n';

interface InfoPageProps {
    type: 'privacy' | 'terms' | 'contact';
    onBack: () => void;
}

export default function InfoPage({ type, onBack }: InfoPageProps) {
    const { t } = useTranslation();

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6" /> {t('info.privacy.title1')}
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.privacy.desc1')}
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">{t('info.privacy.title2')}</h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.privacy.desc2')}
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">{t('info.privacy.title3')}</h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.privacy.desc3')}
                            </p>
                        </section>
                    </div>
                );
            case 'terms':
                return (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4 flex items-center gap-2">
                                <FileText className="w-6 h-6" /> {t('info.terms.title1')}
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.terms.desc1')}
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">{t('info.terms.title2')}</h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.terms.desc2')}
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">{t('info.terms.title3')}</h2>
                            <p className="text-white/60 leading-relaxed">
                                {t('info.terms.desc3')}
                            </p>
                        </section>
                    </div>
                );
            case 'contact':
                return (
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <Mail className="w-8 h-8 text-chartreuse mb-4" />
                                <h3 className="text-lg font-bold mb-2">{t('info.contact.emailTitle')}</h3>
                                <p className="text-white/40 mb-4">{t('info.contact.emailDesc')}</p>
                                <a href="mailto:support@pocketlist.app" className="text-chartreuse font-bold">support@pocketlist.app</a>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <MapPin className="w-8 h-8 text-chartreuse mb-4" />
                                <h3 className="text-lg font-bold mb-2">{t('info.contact.officeTitle')}</h3>
                                <p className="text-white/40 mb-2">{t('info.contact.officeAddr1')}</p>
                                <p className="text-white/40">{t('info.contact.officeAddr2')}</p>
                            </div>
                        </div>
                        <div className="p-8 bg-chartreuse/10 border border-chartreuse/20 rounded-[2rem]">
                            <h3 className="text-xl font-bold mb-4">{t('info.contact.formTitle')}</h3>
                            <p className="text-white/60 mb-6">{t('info.contact.formDesc')}</p>
                            <button className="bg-chartreuse text-gunmetal px-6 py-3 rounded-xl font-bold">{t('info.contact.formBtn')}</button>
                        </div>
                    </div>
                );
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'privacy': return t('landing.privacy');
            case 'terms': return t('landing.terms');
            case 'contact': return t('landing.contact');
        }
    };

    return (
        <div className="min-h-screen bg-gunmetal text-white py-24 px-6">
            <nav className="fixed top-0 left-0 w-full z-50 bg-gunmetal/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>{t('dash.back')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-chartreuse rounded flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-gunmetal" />
                        </div>
                        <span className="font-bold text-sm">PocketList</span>
                    </div>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-4xl sm:text-6xl font-bold mb-12 tracking-tight">{getTitle()}</h1>
                {getContent()}

                <div className="mt-20 pt-12 border-t border-white/5 text-center">
                    <p className="text-white/20 text-sm">{t('landing.copyright')}</p>
                </div>
            </motion.div>
        </div>
    );
}
