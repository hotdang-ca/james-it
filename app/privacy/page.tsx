import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="site-header">
                <nav className="container">
                    <div className="logo"><Link href="/">James-It</Link></div>
                    <ul className="nav-links">
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/#services">Services</Link></li>
                        <li><Link href="/#contact" className="btn btn-primary">James-it!</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="container section">
                <div className="max-w-3xl mx-auto prose prose-slate">
                    <h1>Privacy Policy</h1>
                    <p className="lead">Last updated: January 2026</p>

                    <h2>1. Introduction</h2>
                    <p>
                        At James-It, I value your trust and am committed to protecting your privacy. This Privacy Policy
                        explains how I collect, use, and safeguard your personal information.
                    </p>

                    <h2>2. Information I Collect</h2>
                    <p>I may collect the following types of information:</p>
                    <ul>
                        <li><strong>Contact Details:</strong> Name, email address, phone number, and physical address.</li>
                        <li><strong>Service Details:</strong> Information specific to your requests (e.g., shopping lists, delivery instructions, gate codes).</li>
                        <li><strong>Payment Information:</strong> Transaction details securely processed by third-party payment providers (Stripe). I do not store full credit card numbers.</li>
                    </ul>

                    <h2>3. How I Use Your Information</h2>
                    <p>Your information is used solely for:</p>
                    <ul>
                        <li>Providing and coordinating the services you request.</li>
                        <li>Communicating with you regarding your service status or scheduling.</li>
                        <li>Processing payments.</li>
                        <li>Improving my service offerings (e.g., feedback).</li>
                    </ul>

                    <h2>4. Information Sharing</h2>
                    <p>
                        I do not sell or rent your personal information. I may share your data with trusted third parties
                        only when necessary to perform the service (e.g., sharing a delivery address with a partner courier if applicable,
                        though I usually perform tasks myself) or as required by law.
                    </p>

                    <h2>5. Data Security</h2>
                    <p>
                        I implement reasonable security measures to protect your personal information from unauthorized access,
                        alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
                    </p>

                    <h2>6. Contact Me</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact me at: <br />
                        <strong>Email:</strong> <a href="mailto:james@hotdang.ca">james@hotdang.ca</a>
                    </p>

                    <div className="mt-8">
                        <Link href="/" className="btn btn-secondary">← Back to Home</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
