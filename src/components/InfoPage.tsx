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
                                <Shield className="w-6 h-6" /> 1. Collecte des données
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                PocketList collecte uniquement les informations strictement nécessaires à votre utilisation : votre adresse e-mail pour l'authentification et vos listes de courses. Nous ne revendons jamais vos données à des tiers.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">2. Utilisation de l'IA</h2>
                            <p className="text-white/60 leading-relaxed">
                                Lorsque vous utilisez le mode Genius ou l'extraction de recettes, vos requêtes sont traitées par Google Gemini. Aucune donnée personnelle identifiable n'est envoyée à l'IA, uniquement les noms de produits ou d'ingrédients.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">3. Vos droits</h2>
                            <p className="text-white/60 leading-relaxed">
                                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez supprimer votre compte et toutes vos listes à tout moment depuis les réglages.
                            </p>
                        </section>
                    </div>
                );
            case 'terms':
                return (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4 flex items-center gap-2">
                                <FileText className="w-6 h-6" /> 1. Acceptation des conditions
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                En utilisant PocketList, vous acceptez de respecter ces conditions d'utilisation. L'application est fournie "en l'état" pour vous aider dans votre organisation quotidienne.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">2. Usage acceptable</h2>
                            <p className="text-white/60 leading-relaxed">
                                Vous vous engagez à ne pas utiliser l'application pour stocker du contenu illégal ou pour tenter de nuire à nos services. L'accès Premium est strictement personnel.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-chartreuse mb-4">3. Responsabilité</h2>
                            <p className="text-white/60 leading-relaxed">
                                PocketList ne peut être tenu responsable des erreurs de prix ou d'ingrédients suggérés par l'IA. Vérifiez toujours vos achats en magasin.
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
                                <h3 className="text-lg font-bold mb-2">E-mail</h3>
                                <p className="text-white/40 mb-4">Notre équipe vous répond sous 24h.</p>
                                <a href="mailto:support@pocketlist.app" className="text-chartreuse font-bold">support@pocketlist.app</a>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <MapPin className="w-8 h-8 text-chartreuse mb-4" />
                                <h3 className="text-lg font-bold mb-2">Bureaux</h3>
                                <p className="text-white/40 mb-2">Casablanca, Maroc</p>
                                <p className="text-white/40">Sidi Maarouf, Technopark</p>
                            </div>
                        </div>
                        <div className="p-8 bg-chartreuse/10 border border-chartreuse/20 rounded-[2rem]">
                            <h3 className="text-xl font-bold mb-4">Formulaire de support</h3>
                            <p className="text-white/60 mb-6">Un problème avec votre abonnement Premium ? Contactez-nous directement par mail pour une résolution prioritaire.</p>
                            <button className="bg-chartreuse text-gunmetal px-6 py-3 rounded-xl font-bold">Envoyer un message</button>
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
                    <p className="text-white/20 text-sm">© 2024 PocketList. Tous droits réservés.</p>
                </div>
            </motion.div>
        </div>
    );
}
