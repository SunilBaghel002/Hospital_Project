import ServiceLayout from '../components/ServiceLayout';

export default function TestServicePage() {
    const testData = {
        title: "Test Service Page",
        sections: [
            {
                type: "hero",
                data: {
                    title: "Advanced Robotic Surgery",
                    subtitle: "Precision Meets Care",
                    tagline: "Minimum Invasive",
                    backgroundImage: "https://images.unsplash.com/photo-1579684385136-137af18db23c?auto=format&fit=crop&q=80&w=2070",
                    ctaText: "Book Now"
                }
            },
            {
                type: "service_overview",
                data: {
                    title: "Overview",
                    overviewText: "State-of-the-art robotic systems for faster recovery.",
                    shortDesc: "Future of Surgery",
                    longDesc: "<p>Robotic surgery allows surgeons to perform many types of complex procedures with more precision, flexibility and control than is possible with conventional techniques. <strong>Benefits include:</strong></p><ul><li>Fewer complications</li><li>Less pain and blood loss</li><li>Quicker recovery</li><li>Smaller, less noticeable scars</li></ul>",
                    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2070"
                }
            },
            {
                type: "service_scope",
                data: {
                    title: "Our Capabilities",
                    image: "https://images.unsplash.com/photo-1516549655169-df83a0674f66?auto=format&fit=crop&q=80&w=2070",
                    points: [
                        { title: "Cardiac Surgery", desc: "Valve repair and bypass" },
                        { title: "Urology", desc: "Prostate  and kidney procedures" },
                        { title: "Gynecology", desc: "Hysterectomy and fibroid removal" }
                    ]
                }
            },
            {
                type: "service_experts",
                data: {
                    roleKeyword: "Surgeon",
                    title: "Our Robotic Surgeons"
                }
            },
            {
                type: "cta",
                data: {
                    title: "Ready to consult?",
                    subtitle: "Get expert advice today",
                    buttonText: "Schedule Visit"
                }
            }
        ]
    };

    return <ServiceLayout data={testData} onBook={() => alert('Booking clicked')} />;
}
