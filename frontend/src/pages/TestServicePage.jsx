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
                    backgroundImage: "/assets/images/services/advanced-diagnostics.png",
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
                    image: "/assets/images/services/cataract-surgery.png"
                }
            },
            {
                type: "service_scope",
                data: {
                    title: "Our Capabilities",
                    image: "/assets/images/services/dry-eye-spa.png",
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
