import Hero from '../components/Hero';
import Partners from '../components/Partners';
import Network from '../components/Network';
import Partition from '../components/Partition';
import About from '../components/About';
import Technology from '../components/Technology';
import Services from '../components/Services';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';
import Blogs from '../components/Blogs';
import SEOGuide from '../components/SEOGuide';
import Chatbot from '../components/Chatbot';
import Advertisement from '../components/Advertisement';

export default function Home({ onBook }) {
    return (
        <main>
            <Advertisement />
            <Hero onBook={onBook} />
            <Partners />
            <Network />
            <Partition />
            <About />
            <Technology />
            <Services />
            <Doctors onBook={onBook} />
            <Testimonials />
            <Blogs />
            <SEOGuide />
            <Chatbot />
        </main>
    );
}
