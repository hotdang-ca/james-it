import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="site-header">
        <nav className="container">
          <div className="logo"><Link href="/">James-It</Link></div>
          <ul className="nav-links">
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#contact" className="btn btn-primary">James-it!</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container section">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Terms and Conditions</h1>
          <p className="lead">Last updated: January 2026</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to James-It. By accessing or using my personal concierge services ("Service"), 
            you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2>2. Services</h2>
          <p>
            James-It provides personal concierge services including but not limited to: courier delivery, 
            private rides, administrative assistance, technical support, personal shopping, and general 
            home/yard maintenance.
          </p>
          <p>
            I reserve the right to refuse any request that is illegal, unethical, or deemed unsafe.
          </p>

          <h2>3. Rates and Payment</h2>
          <ul>
            <li><strong>Standard Rate:</strong> Services are billed at $29.00 CAD per hour.</li>
            <li><strong>Billing Increments:</strong> Time is billed in 15-minute increments after the first hour.</li>
            <li><strong>Expenses:</strong> The client is responsible for all direct expenses incurred on their behalf 
            (e.g., cost of groceries, parking fees, merchandise).</li>
            <li><strong>Payment Methods:</strong> I accept Cash, Interac e-Transfer, Visa, Mastercard, and Stripe payments.</li>
            <li><strong>Payment Terms:</strong> Payment is due upon completion of the service unless a prior arrangement 
            has been made. Late payments may be subject to interest.</li>
          </ul>

          <h2>4. Client Responsibilities</h2>
          <p>
            You agree to provide accurate information and clear instructions for all requests. 
            For home services, you agree to provide a safe working environment.
          </p>

          <h2>5. Cancellation Policy</h2>
          <p>
            I understand that plans change. However, cancellations made less than 24 hours before a 
            scheduled service may be subject to a cancellation fee equivalent to one hour of service ($29).
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
             While I strive for perfection, James-It is not liable for any incidental, indirect, or consequential damages 
             arising from the use of my services. This includes, but is not limited to, delays caused by traffic 
             or weather, or errors in third-party services booked on your behalf.
          </p>
          <p>
            <strong>Courier Services:</strong> Liability for items being transported is limited to $100 CAD unless 
            additional insurance is arranged prior to the service. Please do not send prohibited or illegal items.
          </p>

          <h2>7. Confidentiality</h2>
          <p>
            I respect your privacy. Any personal information or confidential details shared during the 
            course of service will be kept strictly confidential and will not be shared with third parties, 
            except as necessary to provide the service or as required by law.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms shall be governed by the laws of the Province of Manitoba and the laws of Canada applicable therein.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact me at <a href="mailto:james@hotdang.ca">james@hotdang.ca</a>.
          </p>
          
          <div className="mt-8">
            <Link href="/" className="btn btn-secondary">← Back to Home</Link>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; 2026 James-It. Use with confidence.</p>
        </div>
      </footer>
    </div>
  );
}
