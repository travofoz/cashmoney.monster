import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground">
            <h2>Get in Touch</h2>
            <p>
              Have questions about our loan matching service? Need help with an application? We&apos;re here to help.
            </p>
            
            <h3>Customer Support</h3>
            <p>
              <strong>Phone:</strong> 1-800-CASH-NOW<br/>
              <strong>Email:</strong> support@cashmoney.monster<br/>
              <strong>Hours:</strong> Monday - Friday, 8AM - 8PM EST
            </p>
            
            <h3>Mailing Address</h3>
            <p>
              Cash Money MONSTER<br/>
              Lead Plateau<br/>
              123 Financial Street<br/>
              Suite 100<br/>
              Charlotte, NC 28202
            </p>
            
            <h3>Frequently Asked Questions</h3>
            
            <h4>How long does the process take?</h4>
            <p>Our online form takes about 60 seconds to complete. Most borrowers receive lender responses within minutes.</p>
            
            <h4>Is there a fee for your service?</h4>
            <p>No, our loan matching service is completely free to borrowers. Lenders pay us when we successfully connect them with qualified borrowers.</p>
            
            <h4>What if I&apos;m not approved?</h4>
            <p>If you&apos;re not matched with a lender, there&apos;s no cost or obligation. You can try again later or explore other financial options.</p>
            
            <h4>Is my information secure?</h4>
            <p>Yes, we use bank-level encryption to protect your personal and financial information. We never sell your data to third parties.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}