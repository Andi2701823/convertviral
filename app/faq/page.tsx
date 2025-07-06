import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - ConvertViral',
  description: 'Frequently asked questions about ConvertViral file conversion service. Learn about our features, pricing, and how to use our platform.',
};

function generateFaqJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

type FAQItem = {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'account' | 'privacy';
};

export default function FAQPage() {
  const faqs: FAQItem[] = [
    {
      question: 'What is ConvertViral?',
      answer: 'ConvertViral is a modern file conversion platform that allows you to convert files between different formats quickly and easily. We support over 20 different conversion types, including documents, images, audio, video, and more.',
      category: 'general',
    },
    {
      question: 'How do I convert a file?',
      answer: 'Converting a file is simple! Just drag and drop your file onto our converter, select the output format you want, and click "Convert". Your file will be processed and ready to download in seconds.',
      category: 'general',
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support a wide range of file formats, including popular document formats (PDF, DOCX, TXT), image formats (JPG, PNG, SVG), audio formats (MP3, WAV, FLAC), video formats (MP4, AVI, MOV), and many more. Check our conversion page for a complete list.',
      category: 'technical',
    },
    {
      question: 'Is there a file size limit?',
      answer: 'Yes, there are file size limits depending on your plan. Free users can convert files up to 25MB, Pro users up to 250MB, and Business users up to 2GB per file.',
      category: 'technical',
    },
    {
      question: 'How secure is my data?',
      answer: 'We take security seriously. All file transfers are encrypted using HTTPS, and we automatically delete all uploaded and converted files after 24 hours. We never access or analyze the content of your files.',
      category: 'privacy',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No, you don\'t need an account to convert files. However, creating a free account allows you to track your conversion history, earn points and badges, and access additional features.',
      category: 'account',
    },
    {
      question: 'What is the gamification system?',
      answer: 'Our gamification system rewards you for using ConvertViral. You earn points for each conversion, which helps you level up and earn badges. You can also compete with other users on our leaderboard.',
      category: 'general',
    },
    {
      question: 'How much does ConvertViral cost?',
      answer: 'ConvertViral offers a free plan with limited features and two premium plans: Pro ($9.99/month) and Business ($24.99/month). Check our pricing page for detailed information about what each plan includes.',
      category: 'pricing',
    },
    {
      question: 'Can I convert multiple files at once?',
      answer: 'Yes, batch conversion is available for Pro and Business users. You can upload multiple files and convert them all at once, saving you time and effort.',
      category: 'technical',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your billing period.',
      category: 'account',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.',
      category: 'pricing',
    },
    {
      question: 'Can I use ConvertViral on my mobile device?',
      answer: 'Yes, ConvertViral is fully responsive and works on all devices, including smartphones and tablets. We also offer a Progressive Web App (PWA) that you can install on your device for offline access.',
      category: 'technical',
    },
    {
      question: 'How accurate are your conversions?',
      answer: 'We use industry-leading conversion engines to ensure the highest possible quality and accuracy. However, some complex formatting or special features might not be perfectly preserved in all conversion types.',
      category: 'technical',
    },
    {
      question: 'Do you have an API?',
      answer: 'Yes, we offer an API for Business plan subscribers. This allows you to integrate our conversion capabilities directly into your own applications or workflows.',
      category: 'technical',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact our support team through the Contact page on our website. We aim to respond to all inquiries within 24-48 hours.',
      category: 'general',
    },
  ];

  const categories = [
    { id: 'general', name: 'General Questions' },
    { id: 'technical', name: 'Technical Questions' },
    { id: 'pricing', name: 'Pricing & Billing' },
    { id: 'account', name: 'Account & Settings' },
    { id: 'privacy', name: 'Privacy & Security' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">Find answers to common questions about ConvertViral</p>
      
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <a 
            key={category.id} 
            href={`#${category.id}`}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
          >
            {category.name}
          </a>
        ))}
      </div>
      
      {categories.map((category) => (
        <div key={category.id} id={category.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
          <div className="space-y-6">
            {faqs
              .filter((faq) => faq.category === category.id)
              .map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Please contact our support team.</p>
        <a href="/contact" className="btn-primary inline-block">
          Contact Support
        </a>
      </div>

    </div>
  );
}