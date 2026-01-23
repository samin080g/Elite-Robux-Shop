
import React from 'react';

interface LegalProps {
  type: 'terms' | 'privacy' | 'refund';
}

const Legal: React.FC<LegalProps> = ({ type }) => {
  const content = {
    terms: {
      title: 'TERMS & CONDITION',
      paragraphs: [
        'Welcome to Elite Robux Shop. By accessing our platform, you agree to comply with our usage policies. Our service provides virtual items and currency transfer for gaming platforms.',
        'Users must be 13 years of age or older to use this service. If you are under 13, you must have parental consent to make any financial transactions on our platform.',
        'Elite Robux Shop acts as an intermediary for virtual goods. We are not affiliated with, maintained, authorized, endorsed or sponsored by Roblox Corporation or any of its affiliates.',
        'All purchases are final. Users are responsible for providing correct account details. We are not responsible for transfers made to incorrect account names provided by the user.'
      ]
    },
    privacy: {
      title: 'PRIVACY POLICY',
      paragraphs: [
        'At Elite Robux Shop, your privacy is our priority. We only collect the minimum information required to process your orders: Roblox Username, Phone Number, and Transaction details.',
        'We do not store your data on long-term servers without reason. Most transaction data is kept temporarily to ensure successful delivery of virtual goods.',
        'We never share, sell, or trade your personal information with third parties. Your payment information (Transaction ID) is used solely for verification purposes with the respective payment gateway.',
        'We use browser local storage to enhance your shopping experience and help you track your recent orders without needing a complex account registration system.'
      ]
    },
    refund: {
      title: 'REFUND & RETURN POLICY',
      paragraphs: [
        'Due to the digital and instant nature of virtual currency and gift card codes, all sales at Elite Robux Shop are strictly non-refundable.',
        'Once a Robux transfer is initiated or a Gift Card code is delivered, we cannot reverse the transaction. Please ensure all details are correct before confirming your order.',
        'In the rare case that a technical error occurs on our side and the product is not delivered within 24 hours of verification, you may contact our support team for a full manual review.',
        'Refunds will NOT be issued if the user provides the wrong Roblox username or if the user account is banned or restricted by the platform provider after a successful transfer.'
      ]
    }
  }[type];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="glass p-12 neon-border">
        <h1 className="text-3xl md:text-4xl font-orbitron font-black text-[#39ff14] mb-8 border-b border-[#39ff14]/20 pb-6">
          {content.title}
        </h1>
        <div className="space-y-6">
          {content.paragraphs.map((p, i) => (
            <p key={i} className="text-gray-400 text-lg leading-relaxed font-light">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-gray-500 italic text-sm">Last updated: October 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
