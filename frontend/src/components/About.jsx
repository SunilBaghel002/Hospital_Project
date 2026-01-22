import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    const features = [
        { title: "Advanced Diagnostics", link: "/services/advanced-diagnostics", img: "https://images.unsplash.com/photo-1576091160550-2187d80a85bc?q=80&w=2000&auto=format&fit=crop", desc: "Using AI-powered OCT and topographic mapping for early detection." },
        { title: "Robotic Surgery", link: "/services/robotic-surgery", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop", desc: "Precision-guided femtosecond lasers for perfect cataract outcomes." },
        { title: "Pediatric Care", link: "/services/pediatric-care", img: "https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=2000&auto=format&fit=crop", desc: "Specialized gentle care for our youngest patients with myopia control." },
        { title: "Emergency Trauma", link: "/services/emergency-trauma", img: "https://images.unsplash.com/photo-1516574187841-6930022476c9?q=80&w=2000&auto=format&fit=crop", desc: "24/7 rapid response unit for complex ocular injuries." },
    ];

    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 mb-20 items-end">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight">Excellence in <br /> <span className="text-brand-blue">Vision Care</span></h2>
                    <div className="h-2 w-24 bg-brand-blue rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg leading-relaxed">
                    We don't just treat eyes; we enhance your view of the world. Combining decades of medical expertise with cutting-edge robotic technology to deliver outcomes that exceed expectations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((item, index) => (
                    <Link to={item.link} key={index} className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 block">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent group-hover:from-brand-blue/90 transition-colors duration-500" />

                        <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <ArrowUpRight size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-200 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
