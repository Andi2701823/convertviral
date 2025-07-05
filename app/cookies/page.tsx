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
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          This Cookie Policy explains how ConvertViral ("we", "us", and "our") uses cookies and similar technologies 
          to recognize you when you visit our website at convertviral.com ("Website"). It explains what these technologies 
          are and why we use them, as well as your rights to control our use of them.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">What are cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
          as well as to provide reporting information.
        </p>
        <p className="mb-4">
          Cookies set by the website owner (in this case, ConvertViral) are called "first-party cookies". 
          Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies 
          enable third-party features or functionality to be provided on or through the website (e.g., advertising, 
          interactive content, and analytics). The parties that set these third-party cookies can recognize your 
          computer both when it visits the website in question and also when it visits certain other websites.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why do we use cookies?</h2>
        <p className="mb-4">
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
          reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" 
          cookies. Other cookies also enable us to track and target the interests of our users to enhance the 
          experience on our Website. Third parties serve cookies through our Website for advertising, analytics, 
          and other purposes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Types of cookies we use</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
          <p className="mb-4">
            These cookies are strictly necessary to provide you with services available through our Website and to 
            use some of its features, such as access to secure areas. Because these cookies are strictly necessary 
            to deliver the Website, you cannot refuse them without impacting how our Website functions.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
          <p className="mb-4">
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
            of our Website. They help us to know which pages are the most and least popular and see how visitors move 
            around the Website. All information these cookies collect is aggregated and therefore anonymous.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Marketing Cookies</h3>
          <p className="mb-4">
            These cookies are used to track visitors across websites. The intention is to display ads that are relevant 
            and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How can you control cookies?</h2>
        <p className="mb-4">
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences 
          by clicking on the appropriate opt-out links provided in our cookie banner.
        </p>
        <p className="mb-4">
          You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject 
          cookies, you may still use our Website though your access to some functionality and areas of our Website 
          may be restricted. As the means by which you can refuse cookies through your web browser controls vary from 
          browser-to-browser, you should visit your browser's help menu for more information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to this Cookie Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies 
          we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy 
          regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p className="mb-4">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact us</h2>
        <p className="mb-4">
          If you have any questions about our use of cookies or other technologies, please email us at 
          privacy@convertviral.com or contact us through our website.
        </p>
      </div>
    </div>
  );
}