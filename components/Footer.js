import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 bg-secondary text-black" data-theme="light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-4 text-black">Site Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-black/60 hover:text-black">Home</Link></li>
                <li><Link href="/about" className="text-black/60 hover:text-black">About</Link></li>
                <li><Link href="/contact" className="text-black/60 hover:text-black">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-black">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-black/60 hover:text-black">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-black/60 hover:text-black">Privacy Policy</Link></li>
                <li><Link href="/tcpa-notice" className="text-black/60 hover:text-black">TCPA Notice</Link></li>
                <li><Link href="/disclosure" className="text-black/60 hover:text-black">Ad Disclosure</Link></li>
                <li><Link href="/credit-authorization" className="text-black/60 hover:text-black">Credit Authorization</Link></li>
                <li><Link href="/econsent" className="text-black/60 hover:text-black">E-Consent</Link></li>
                <li><Link href="/rates-and-fees" className="text-black/60 hover:text-black">Rates & Fees</Link></li>
                <li><Link href="/third-parties" className="text-black/60 hover:text-black">Third Parties</Link></li>
                <li><a href="https://leadplateau.com/unsubscribe" className="text-black/60 hover:text-black">Unsubscribe</a></li>
              </ul>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h3 className="font-bold text-xl mb-2 text-black">Lead Plateau</h3>
            <p className="text-black/60 text-sm mb-2">8 The Green, Suite 4000, Dover, DE 19901</p>
            <p className="text-black/60 text-sm mb-4">© 2025 All Rights Reserved</p>
            
            <div className="text-xs text-black/50 max-w-2xl space-y-3">
              <p>
                <strong>CashMoney.Monster</strong> is a free service operated by Lead Plateau that assists borrowers in connecting with lenders and loan providers in our network. We are not a lender and do not make loans directly. All lenders and loan providers are independent, and we do not warrant or guarantee any loan offered.
              </p>
              
              <p>
                <strong>No Guarantee of Approval:</strong> Loan approval and terms are determined solely by individual lenders based on their own criteria. We cannot guarantee that you will be matched with a lender or approved for a loan.
              </p>
              
              <p>
                <strong>Credit Checks:</strong> By using our service, you authorize lenders to obtain credit reports and credit scores to verify your identity and determine loan eligibility. These credit checks may affect your credit score.
              </p>
              
              <p>
                <strong>Marketing Communications:</strong> By submitting a loan request, you consent to receive marketing communications from us, lenders, and third-party financial service providers via phone, email, SMS, and mail, even if you are on the Do Not Call Registry.
              </p>
              
              <p>
                <strong>Compensation:</strong> We receive compensation from lenders and third-party networks when we successfully connect them with borrowers. This compensation may influence which lenders you are connected with.
              </p>
              
              <p>
                Borrowers are solely responsible for reviewing and agreeing to loan terms offered by third-party lenders. Lead Plateau expressly disclaims any liability for the actions, omissions, or loan terms of participating lenders and is not responsible for any damages arising from borrower interactions with third-party lenders.
              </p>
              
              <p>
                For customer service inquiries, please contact: <a href="mailto:support@cashmoney.monster" className="text-black/70 hover:text-black">support@cashmoney.monster</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}