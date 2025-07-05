import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - ConvertViral',
  description: 'Datenschutzerklärung für die ConvertViral Dateikonvertierungsplattform. Erfahren Sie, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.',
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p className="text-gray-600 mb-4">
          Zuletzt aktualisiert: 15. Juni 2024
        </p>
        
        <p className="mb-4">
          Bei ConvertViral nehmen wir Ihren Datenschutz ernst. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen sammeln, verwenden, offenlegen und schützen, wenn Sie unsere Website besuchen und unseren Dateikonvertierungsdienst nutzen.
        </p>
        
        <p className="mb-6">
          Bitte lesen Sie diese Datenschutzerklärung sorgfältig durch. Durch den Zugriff auf oder die Nutzung unseres Dienstes bestätigen Sie, dass Sie alle Bedingungen dieser Datenschutzerklärung gelesen, verstanden und akzeptiert haben. Wenn Sie mit unseren Richtlinien und Praktiken nicht einverstanden sind, nutzen Sie bitte unseren Dienst nicht.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">1. Informationen, die wir sammeln</h2>
        <p className="mb-4">
          Wir sammeln verschiedene Arten von Informationen von und über Nutzer unseres Dienstes, darunter:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Persönliche Daten:</strong> Wenn Sie ein Konto erstellen, sammeln wir Ihren Namen, Ihre E-Mail-Adresse und Ihr Passwort.</li>
          <li><strong>Nutzungsdaten:</strong> Wir sammeln Informationen darüber, wie Sie mit unserem Dienst interagieren, einschließlich der Arten von Dateien, die Sie konvertieren, der Konvertierungshäufigkeit, der genutzten Funktionen und anderer Analysedaten.</li>
          <li><strong>Dateidaten:</strong> Wir speichern die von Ihnen hochgeladenen Dateien vorübergehend für die Konvertierung. Diese Dateien werden automatisch nach einem bestimmten Zeitraum gelöscht (in der Regel 24 Stunden nach der Konvertierung).</li>
          <li><strong>Geräteinformationen:</strong> Wir sammeln Informationen über das Gerät und den Browser, mit dem Sie auf unseren Dienst zugreifen, einschließlich IP-Adresse, Browsertyp, Betriebssystem und Gerätekennung.</li>
          <li><strong>Cookies und ähnliche Technologien:</strong> Wir verwenden Cookies und ähnliche Tracking-Technologien, um Aktivitäten auf unserem Dienst zu verfolgen und bestimmte Informationen zu speichern, um Ihre Erfahrung zu verbessern.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">2. Wie wir Ihre Informationen verwenden</h2>
        <p className="mb-4">
          Wir verwenden die von Ihnen gesammelten Informationen für verschiedene Zwecke, unter anderem um:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Unseren Dienst bereitzustellen, zu warten und zu verbessern</li>
          <li>Ihre Dateikonvertierungen zu verarbeiten und abzuschließen</li>
          <li>Ihr Konto zu erstellen und zu verwalten</li>
          <li>Ihnen technische Hinweise, Updates, Sicherheitsalarme und Support-Nachrichten zu senden</li>
          <li>Auf Ihre Kommentare, Fragen und Anfragen zu antworten</li>
          <li>Trends, Nutzung und Aktivitäten im Zusammenhang mit unserem Dienst zu überwachen und zu analysieren</li>
          <li>Technische Probleme, Betrug und andere illegale Aktivitäten zu erkennen, zu verhindern und zu beheben</li>
          <li>Ihre Erfahrung zu personalisieren und Inhalte zu liefern, die für Ihre Interessen relevant sind</li>
          <li>Neue Produkte, Dienstleistungen, Funktionen und Funktionalitäten zu entwickeln</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">3. Wie wir Ihre Informationen teilen</h2>
        <p className="mb-4">
          Wir können Ihre Informationen unter folgenden Umständen teilen:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Mit Dienstleistern:</strong> Wir können Ihre Informationen mit Drittanbietern, Dienstleistern, Auftragnehmern oder Agenten teilen, die Dienstleistungen für uns oder in unserem Namen erbringen.</li>
          <li><strong>Für Geschäftsübertragungen:</strong> Wir können Ihre Informationen im Zusammenhang mit oder während Verhandlungen über eine Fusion, einen Verkauf von Unternehmensvermögen, eine Finanzierung oder eine Übernahme unseres gesamten oder eines Teils unseres Unternehmens an ein anderes Unternehmen teilen oder übertragen.</li>
          <li><strong>Für rechtliche Zwecke:</strong> Wir können Ihre Informationen offenlegen, wenn wir gesetzlich dazu verpflichtet sind oder als Antwort auf gültige Anfragen von Behörden (z.B. einem Gericht oder einer Regierungsbehörde).</li>
          <li><strong>Mit Ihrer Zustimmung:</strong> Wir können Ihre Informationen mit Ihrer Zustimmung oder auf Ihre Anweisung hin teilen.</li>
        </ul>
        <p className="mb-6">
          Wir verkaufen, vermieten oder verleasen Ihre persönlichen Daten nicht an Dritte.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">4. Dateisicherheit und Datenschutz</h2>
        <p className="mb-4">
          Wir verstehen, dass die von Ihnen hochgeladenen Dateien sensible Informationen enthalten können. Wir ergreifen die folgenden Maßnahmen, um Ihre Dateien zu schützen:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Alle Dateiübertragungen werden mit sicheren HTTPS-Verbindungen verschlüsselt</li>
          <li>Dateien werden sicher gespeichert und sind nur für den Zweck der angeforderten Konvertierung zugänglich</li>
          <li>Dateien werden nach 24 Stunden automatisch von unseren Servern gelöscht</li>
          <li>Wir greifen nicht auf den Inhalt Ihrer Dateien zu oder sehen ihn ein, außer in seltenen Fällen zur Fehlerbehebung und nur mit Ihrer ausdrücklichen Genehmigung</li>
          <li>Wir teilen Ihre Dateien nicht mit Dritten, außer wenn dies zur Durchführung des Konvertierungsdienstes erforderlich ist</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">5. Datenspeicherung</h2>
        <p className="mb-6">
          Wir speichern Ihre persönlichen Daten nur so lange, wie es für die in dieser Datenschutzerklärung genannten Zwecke erforderlich ist. Wir werden Ihre Informationen in dem Umfang aufbewahren und verwenden, der notwendig ist, um unseren rechtlichen Verpflichtungen nachzukommen, Streitigkeiten beizulegen und unsere Richtlinien durchzusetzen. Ihre hochgeladenen Dateien werden 24 Stunden nach Abschluss der Konvertierung automatisch von unseren Servern gelöscht.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">6. Ihre Datenschutzrechte (DSGVO-Rechte)</h2>
        <p className="mb-4">
          Gemäß der EU-Datenschutz-Grundverordnung (DSGVO) haben Nutzer in der Europäischen Union die folgenden Rechte:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Auskunftsrecht:</strong> Sie können Informationen über Ihre von uns verarbeiteten personenbezogenen Daten anfordern.</li>
          <li><strong>Recht auf Berichtigung:</strong> Sie können die Korrektur ungenauer personenbezogener Daten verlangen.</li>
          <li><strong>Recht auf Löschung:</strong> Sie können unter bestimmten Umständen die Löschung Ihrer personenbezogenen Daten verlangen.</li>
          <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie können verlangen, Ihre Daten in einem strukturierten, gängigen Format zu erhalten.</li>
          <li><strong>Widerspruchsrecht:</strong> Sie können unter bestimmten Umständen der Verarbeitung Ihrer personenbezogenen Daten widersprechen.</li>
          <li><strong>Recht auf Widerruf der Einwilligung:</strong> Sie können Ihre Einwilligung jederzeit widerrufen, wenn wir Ihre Daten auf Grundlage einer Einwilligung verarbeiten.</li>
        </ul>
        <p className="mb-6">
          Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte über die am Ende dieser Datenschutzerklärung angegebenen Kontaktinformationen. Wir werden auf Ihre Anfrage innerhalb eines Monats antworten, wie von der DSGVO vorgeschrieben.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">7. Datenschutz für Kinder</h2>
        <p className="mb-6">
          Unser Dienst ist nicht für die Nutzung durch Kinder unter 13 Jahren bestimmt. Wir sammeln wissentlich keine personenbezogenen Daten von Kindern unter 13 Jahren. Wenn Sie ein Elternteil oder Erziehungsberechtigter sind und wissen, dass Ihr Kind uns personenbezogene Daten zur Verfügung gestellt hat, kontaktieren Sie uns bitte, damit wir die notwendigen Maßnahmen ergreifen können.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">8. Internationale Datenübertragungen (DSGVO-Konformität)</h2>
        <p className="mb-4">
          Ihre Informationen werden auf Servern in den USA (Hostinger-Server) verarbeitet und gespeichert. Für Nutzer in der Europäischen Union stellen wir die Einhaltung der DSGVO-Anforderungen für internationale Datenübertragungen sicher.
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Rechtsgrundlage für die Verarbeitung:</strong> Wir verarbeiten Ihre Daten auf Grundlage von Artikel 6 Absatz 1 Buchstabe b DSGVO (Erfüllung eines Vertrags), wenn Sie unseren Dienst nutzen.</li>
          <li><strong>Datenübertragungsmechanismus:</strong> Für Übertragungen in die USA stützen wir uns auf die von der Europäischen Kommission genehmigten Standardvertragsklauseln (SCCs).</li>
          <li><strong>Datenspeicherung:</strong> Wir speichern Ihre hochgeladenen Dateien für 24 Stunden nach der Konvertierung, während Analysedaten bis zu 2 Jahre gespeichert werden können.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">9. Cookie-Richtlinie</h2>
        <p className="mb-4">
          Wir verwenden Cookies und ähnliche Tracking-Technologien, um Aktivitäten auf unserem Dienst zu verfolgen und bestimmte Informationen zu speichern. Cookies sind Dateien mit einer kleinen Datenmenge, die eine anonyme eindeutige Kennung enthalten können.
        </p>
        <p className="mb-6">
          Sie können Ihren Browser anweisen, alle Cookies abzulehnen oder anzuzeigen, wenn ein Cookie gesendet wird. Wenn Sie jedoch keine Cookies akzeptieren, können Sie möglicherweise einige Teile unseres Dienstes nicht nutzen.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">10. Sicherheit Ihrer Informationen</h2>
        <p className="mb-6">
          Wir verwenden administrative, technische und physische Sicherheitsmaßnahmen, um Ihre persönlichen Daten vor unbefugtem Zugriff, Verwendung oder Offenlegung zu schützen. Keine Methode der Übertragung über das Internet oder Methode der elektronischen Speicherung ist jedoch zu 100% sicher. Obwohl wir bestrebt sind, kommerziell akzeptable Mittel zum Schutz Ihrer persönlichen Daten zu verwenden, können wir deren absolute Sicherheit nicht garantieren.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">11. Änderungen dieser Datenschutzerklärung</h2>
        <p className="mb-6">
          Wir können unsere Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Datenschutzerklärung auf dieser Seite veröffentlichen und das Datum "Zuletzt aktualisiert" am Anfang dieser Datenschutzerklärung aktualisieren. Wir empfehlen Ihnen, diese Datenschutzerklärung regelmäßig auf Änderungen zu überprüfen. Änderungen dieser Datenschutzerklärung sind wirksam, wenn sie auf dieser Seite veröffentlicht werden.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">12. Kontaktieren Sie uns</h2>
        <p className="mb-4">
          Wenn Sie Fragen zu dieser Datenschutzerklärung haben oder Ihre Datenschutzrechte ausüben möchten, kontaktieren Sie uns bitte unter:
        </p>
        <p>
          E-Mail: legal@convertviral.com<br />
          Andreas Paul<br />
          Germersheimer Straße 17<br />
          70499 Stuttgart<br />
          Deutschland
        </p>
        <p className="mt-4 mb-4">
          <strong>Datenschutzbeauftragter:</strong><br />
          E-Mail: datenschutz@convertviral.com<br />
          Telefon: Folgt
        </p>
        <p className="mt-4 mb-4">
          <strong>Zuständige Aufsichtsbehörde:</strong><br />
          Landesbeauftragte für Datenschutz und Informationsfreiheit Baden-Württemberg<br />
          Königstraße 10a<br />
          70173 Stuttgart<br />
          Deutschland
        </p>
      </div>
      
      <div className="text-center">
        <a href="/agb" className="text-primary-600 hover:text-primary-800 font-medium">
          AGB anzeigen
        </a>
      </div>
    </div>
  );
}