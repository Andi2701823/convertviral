import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Metadata' });
  
  return {
    title: t('cookie_policy_title'),
    description: t('cookie_policy_description'),
    alternates: {
      canonical: 'https://convertviral.com/cookies',
      languages: {
        'en': 'https://convertviral.com/cookies',
        'de': 'https://convertviral.com/cookies',
      },
    },
  };
}

export default function CookiePolicyPage() {
  const t = useTranslations('cookies');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookie-Richtlinie</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          Diese Cookie-Richtlinie erläutert, wie ConvertViral ("wir", "uns" und "unser") Cookies und ähnliche Technologien 
          verwendet, um Sie zu erkennen, wenn Sie unsere Website unter convertviral.com ("Website") besuchen. Sie erklärt, 
          was diese Technologien sind und warum wir sie verwenden, sowie Ihre Rechte zur Kontrolle unserer Verwendung dieser Technologien.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Was sind Cookies?</h2>
        <p className="mb-4">
          Cookies sind kleine Datendateien, die auf Ihrem Computer oder mobilen Gerät platziert werden, wenn Sie eine Website besuchen. 
          Cookies werden von Website-Betreibern häufig verwendet, um ihre Websites funktionsfähig zu machen oder effizienter zu arbeiten, 
          sowie um Berichtsinformationen bereitzustellen.
        </p>
        <p className="mb-4">
          Cookies, die vom Website-Betreiber (in diesem Fall ConvertViral) gesetzt werden, werden als "Erstanbieter-Cookies" bezeichnet. 
          Cookies, die von anderen Parteien als dem Website-Betreiber gesetzt werden, werden als "Drittanbieter-Cookies" bezeichnet. 
          Drittanbieter-Cookies ermöglichen Drittanbieterfunktionen oder -funktionalitäten, die auf oder über die Website bereitgestellt 
          werden (z.B. Werbung, interaktive Inhalte und Analysen). Die Parteien, die diese Drittanbieter-Cookies setzen, können Ihren 
          Computer sowohl erkennen, wenn er die betreffende Website besucht, als auch wenn er bestimmte andere Websites besucht.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Warum verwenden wir Cookies?</h2>
        <p className="mb-4">
          Wir verwenden Erstanbieter- und Drittanbieter-Cookies aus mehreren Gründen. Einige Cookies sind aus technischen Gründen 
          erforderlich, damit unsere Website funktioniert, und wir bezeichnen diese als "wesentliche" oder "unbedingt notwendige" 
          Cookies. Andere Cookies ermöglichen es uns auch, die Interessen unserer Benutzer zu verfolgen und zu fokussieren, um das 
          Erlebnis auf unserer Website zu verbessern. Dritte stellen Cookies über unsere Website für Werbung, Analysen und andere Zwecke bereit.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Arten von Cookies, die wir verwenden</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Essentielle Cookies</h3>
          <p className="mb-4">
            Diese Cookies sind unbedingt erforderlich, um Ihnen über unsere Website verfügbare Dienste bereitzustellen und einige ihrer 
            Funktionen zu nutzen, wie z.B. den Zugriff auf gesicherte Bereiche. Da diese Cookies für die Bereitstellung der Website 
            unbedingt erforderlich sind, können Sie sie nicht ablehnen, ohne die Funktionsweise unserer Website zu beeinträchtigen.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Analyse-Cookies</h3>
          <p className="mb-4">
            Diese Cookies ermöglichen es uns, Besuche und Verkehrsquellen zu zählen, damit wir die Leistung unserer Website messen 
            und verbessern können. Sie helfen uns zu wissen, welche Seiten am beliebtesten und am wenigsten beliebt sind, und zu sehen, 
            wie Besucher sich auf der Website bewegen. Alle Informationen, die diese Cookies sammeln, werden aggregiert und sind daher anonym.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Marketing-Cookies</h3>
          <p className="mb-4">
            Diese Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen. Die Absicht ist, Anzeigen anzuzeigen, die für 
            den einzelnen Benutzer relevant und ansprechend sind und dadurch für Verlage und Drittanbieter-Werbetreibende wertvoller sind.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Wie können Sie Cookies kontrollieren?</h2>
        <p className="mb-4">
          Sie haben das Recht zu entscheiden, ob Sie Cookies akzeptieren oder ablehnen möchten. Sie können Ihre Cookie-Präferenzen ausüben, 
          indem Sie auf die entsprechenden Opt-out-Links in unserem Cookie-Banner klicken.
        </p>
        <p className="mb-4">
          Sie können auch die Steuerelemente Ihres Webbrowsers einstellen oder ändern, um Cookies zu akzeptieren oder abzulehnen. Wenn Sie 
          sich entscheiden, Cookies abzulehnen, können Sie unsere Website weiterhin nutzen, obwohl Ihr Zugriff auf einige Funktionen und 
          Bereiche unserer Website möglicherweise eingeschränkt ist. Da die Mittel, mit denen Sie Cookies über die Steuerelemente Ihres 
          Webbrowsers ablehnen können, von Browser zu Browser variieren, sollten Sie das Hilfemenü Ihres Browsers besuchen, um weitere 
          Informationen zu erhalten.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Aktualisierungen dieser Cookie-Richtlinie</h2>
        <p className="mb-4">
          Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um beispielsweise Änderungen an den von uns verwendeten 
          Cookies oder aus anderen betrieblichen, rechtlichen oder regulatorischen Gründen widerzuspiegeln. Bitte besuchen Sie diese 
          Cookie-Richtlinie daher regelmäßig erneut, um über unsere Verwendung von Cookies und verwandten Technologien informiert zu bleiben.
        </p>
        <p className="mb-4">
          Das Datum oben in dieser Cookie-Richtlinie gibt an, wann sie zuletzt aktualisiert wurde.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Kontaktieren Sie uns</h2>
        <p className="mb-4">
          Wenn Sie Fragen zu unserer Verwendung von Cookies oder anderen Technologien haben, senden Sie uns bitte eine E-Mail an 
          privacy@convertviral.com oder kontaktieren Sie uns über unsere Website.
        </p>
      </div>
    </div>
  );
}