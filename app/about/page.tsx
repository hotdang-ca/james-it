import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="site-header">
                <nav className="container">
                    <div className="logo"><Link href="/">James-It</Link></div>
                    <ul className="nav-links">
                        <li><Link href="/about" className="active">About</Link></li>
                        <li><Link href="/#services">Services</Link></li>
                        <li><Link href="/#contact" className="btn btn-primary">James-it!</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="container section">
                <div className="max-w-3xl mx-auto prose prose-slate">
                    <h1>About James</h1>

                    <div className="not-prose mb-8">
                        {/* Using standard img tag to match other pages for now, or could use Next Image if assets configured */}
                        <img
                            src="/assets/james.jpg"
                            alt="James Robert Perih"
                            className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                            style={{ maxHeight: '400px', objectFit: 'cover', objectPosition: 'top' }}
                        />
                    </div>

                    <p className="lead">
                        Hi, I'm James Robert Perih. I am a Manitoba Metis citizen, a resident of Winnipeg,
                        and the Founder and CEO of <a href="https://fourandahalfgiraffes.ca/" target="_blank" rel="noopener noreferrer">Four And A Half Giraffes, Ltd.</a>
                    </p>

                    <h2>My Story</h2>
                    <p>
                        James-It was born from a simple idea: to help others and have fun doing it.
                        I bring a strong Gen-X work ethic to everything I do, whether it's managing a complex software project
                        or delivering a package across town. I love people, and I take pride in being reliable, distinct, and trustworthy.
                    </p>

                    <h2>Experience</h2>
                    <p>
                        I have been a software development manager for over 6 years and have worked in the IT industry for more than 20 years.
                        Beyond tech, my background is diverse, with experience in:
                    </p>
                    <ul>
                        <li>Delivery Services</li>
                        <li>Retail Management</li>
                        <li>Food Services</li>
                        <li>Telephone & Call Centre Work</li>
                        <li>Academic & Market Research</li>
                    </ul>

                    <h2>Building for Canadians</h2>
                    <p>
                        Through my company, Four And A Half Giraffes, I'm working on several exciting projects designed to connect
                        and entertain:
                    </p>
                    <ul>
                        <li>
                            <strong><a href="https://howdoyousay.fourandahalfgiraffes.ca/" target="_blank" rel="noopener noreferrer">How Do You Say?</a></strong>
                            <br />A language-training app helping every Canadian learn the language spoken by every Canadian.
                        </li>
                        <li>
                            <strong><a href="https://wm.fourandahalfgiraffes.ca/" target="_blank" rel="noopener noreferrer">Multiplayer Wordle</a></strong>
                            <br />Compete with friends in this popular word puzzle game.
                        </li>
                        <li>
                            <strong><a href="https://urlpreviewer.fourandahalfgiraffes.ca/" target="_blank" rel="noopener noreferrer">URL Previewer</a></strong>
                            <br />A tool permitting the posting of Canadian news content on social networks.
                        </li>
                    </ul>
                    <p>
                        You can view more of my work at <a href="https://fourandahalfgiraffes.ca/" target="_blank" rel="noopener noreferrer">fourandahalfgiraffes.ca</a>.
                    </p>

                    <hr className="my-12" />

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 italic">
                        <h3>Land Acknowledgement</h3>
                        <p className="mb-0">
                            I acknowledge that I work within Treaty No. 1 Territory, the traditional lands of the Anishinabe (Ojibway),
                            Ininew (Cree), Oji-Cree, Dene, and Dakota, and is the Birthplace of the Métis Nation and the Heart of the Métis Nation Homeland.
                        </p>
                    </div>

                    <div className="mt-12">
                        <Link href="/#contact" className="btn btn-primary no-underline text-white">Get in Touch</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
