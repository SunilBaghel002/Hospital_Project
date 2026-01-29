const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Page = require('./models/Page');
const Section = require('./models/Section');
const SiteSettings = require('./models/SiteSettings');
const Doctor = require('./models/Doctor');
const Blog = require('./models/Blog');

dotenv.config();

// ======================== REAL DATA FROM WEBSITE ========================

// Partners Logos (Now using URLs for Admin Compatibility)
// Partners Logos (Indian Pharmaceutical & Healthcare Leaders)
const PARTNER_LOGOS = [
    '/assets/partners/sun-pharma.png',
    '/assets/partners/cipla.png',
    '/assets/partners/dr-reddys.png',
    '/assets/partners/apollo.png',
    '/assets/partners/fortis.png'
];

// Network Centers (Indian Metros)
const NETWORK_CENTERS = [
    { city: 'Mumbai', img: '/assets/cities/mumbai.jpg' },
    { city: 'Delhi', img: '/assets/cities/delhi.jpg' },
    { city: 'Bangalore', img: '/assets/cities/bangalore.jpg' },
    { city: 'Hyderabad', img: '/assets/cities/hyderabad.jpg' }
];

// About Features
// About Features
const ABOUT_FEATURES = [
    { title: 'Advanced Diagnostics', link: '/services/advanced-diagnostics', img: '/assets/about/diagnostics.png', desc: 'Using AI-powered OCT and topographic mapping for early detection.' },
    { title: 'Robotic Surgery', link: '/services/robotic-surgery', img: '/assets/about/surgery.png', desc: 'Precision-guided femtosecond lasers for perfect cataract outcomes.' },
    { title: 'Pediatric Care', link: '/services/pediatric-care', img: '/assets/about/pediatric.png', desc: 'Specialized gentle care for our youngest patients with myopia control.' },
    { title: 'Emergency Trauma', link: '/services/emergency-trauma', img: '/assets/about/emergency.png', desc: '24/7 rapid response unit for complex ocular injuries.' }
];

// Technology
const TECHNOLOGY = [
    { name: 'Femtosecond Laser', desc: 'Precision corneal incisions for blade-free cataract surgery.', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070' },
    { name: 'OCT Imaging', desc: 'High-resolution cross-sectional retinal imaging.', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070' },
    { name: 'Digital Phoropter', desc: 'Advanced automated refraction for pinpoint accuracy.', img: 'https://plus.unsplash.com/premium_photo-1661766569022-1b7f918ac3f3?q=80&w=2000' }
];

// Testimonials
const TESTIMONIALS = [
    { name: 'Priya Mehta', role: 'Glaucoma Patient', text: "The team at Visionary Eye Care didn't just treat my eyes; they treated my fears. The laser treatment was painless.", rating: 5, img: 'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80&w=600' },
    { name: 'Arjun Patel', role: 'LASIK Patient', text: "Waking up and seeing the alarm clock clearly without reaching for glasses is a miracle I experience every day.", rating: 5, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600' },
    { name: 'Lakshmi Reddy', role: 'Cataract Surgery', text: "The colors! I had forgotten how vibrant the world actually is. I'm painting again for the first time in a decade.", rating: 5, img: 'https://images.unsplash.com/photo-1595347097963-b89345d463be?q=80&w=600' }
];

// FAQ
const FAQ_ITEMS = [
    { question: 'Common Eye Conditions Explained', answer: 'Understanding your eye health is crucial. Common conditions include Myopia, Hyperopia, Astigmatism, and Presbyopia.' },
    { question: 'The Importance of Regular Eye Exams', answer: 'Comprehensive eye exams can detect early signs of systemic diseases like diabetes and hypertension.' },
    { question: 'Latest Advances in LASIK Surgery', answer: 'We utilize Contoura® Vision, a topography-guided LASIK that maps up to 22,000 points on your cornea.' },
    { question: 'Pediatric Eye Care Guidelines', answer: 'The American Academy of Ophthalmology recommends screenings at birth, age 1, age 3, and before first grade.' },
    { question: 'Technology at Visionary Eye Care', answer: 'From OCT for retinal cross-sections to Humphrey Visual Field testing for glaucoma monitoring.' }
];

// ======================== SERVICES DATA (From Frontend Source) ========================
const ALL_SERVICES = [
    {
        id: "cataract-surgery",
        title: "Cataract Surgery",
        shortDesc: "Experience blade-free femtosecond laser precision. Our advanced IOL implants restore clear vision and vibrant colors, often eliminating the need for reading glasses post-surgery.",
        img: "/assets/images/services/cataract-surgery.png",
        heroTitle: "Restore Your Vision",
        heroSubtitle: "Advanced Cataract Solutions",
        heroTagline: "See the world in full color again.",
        overviewTitle: "Blade-Free Precision",
        overviewText: "Cataracts are a natural part of aging, but living with cloudy vision doesn't have to be. Our blade-free laser cataract surgery offers a level of precision and safety that traditional manual surgery simply cannot match. By using femtosecond laser technology, we customize the procedure to your unique eye structure.",
        longDesc: "At Visionary eye care, we believe in providing not just surgery, but a complete visual rejuvenation. Cataract surgery is the most frequently performed surgery in the world, and modern technology has turned it into a refractive procedure that can correct nearsightedness, farsightedness, and astigmatism simultaneously.\n\nWe offer a wide range of premium Intraocular Lenses (IOLs), including multifocal and extended depth-of-focus lenses, which can reduce or even eliminate your dependence on glasses for both distance and near vision. Our counseling team works with you to understand your lifestyle—whether you love reading, golfing, or driving at night—to select the perfect lens for your needs.",
        scopeTitle: "Comprehensive Care Journey",
        scopeImg: "/assets/images/services/cataract-surgery.png",
        scopePoints: [
            { title: "Advanced Diagnostics", desc: "Biometry & OCT scans for precise lens calculation." },
            { title: "Femto-Laser Assisted", desc: "Blade-free incisions for faster healing." },
            { title: "Premium IOLs", desc: "Toric, Multifocal, and EDOF lens options." },
            { title: "Dropless Surgery", desc: "Modern techniques reducing the need for post-op drops." }
        ],
        doctorRoleKeyword: "Cataract",
        faqs: [
            { question: "Is cataract surgery painful?", answer: "No, the procedure is performed under local anesthesia (eye drops) and is painless. You may feel mild pressure but no pain." },
            { question: "How long does recovery take?", answer: "Most patients notice improved vision within 24 hours. Full recovery typically takes 2-4 weeks." }
        ]
    },
    {
        id: "lasik-correction",
        title: "LASIK Correction",
        shortDesc: "Achieve 20/20 vision or better with Contoura® Vision. This topography-guided custom LASIK maps 22,000 points on your cornea for a completely personalized treatment.",
        img: "/assets/images/services/lasik.png",
        heroTitle: "Freedom From Glasses",
        heroSubtitle: "Contoura® Vision LASIK",
        heroTagline: "Wake up and see the world clearly.",
        overviewTitle: "Beyond 20/20 Vision",
        overviewText: "Imagine waking up and seeing the alarm clock without reaching for your glasses. With Contoura® Vision, this is a reality for thousands of our patients. This isn't just LASIK; it's topography-guided laser vision correction that treats your cornea's unique irregularities.",
        longDesc: "Standard LASIK treats everyone with the same prescription the same way. But your eye is as unique as your fingerprint. Topography-Guided LASIK maps 22,000 unique elevation points on your cornea to create a completely personalized treatment profile.\n\nThis level of detail allows us to not only correct your prescription (nearsightedness, farsightedness, astigmatism) but also smooth out microscopic irregularities that affect the quality of your vision. The result? Sharper, crisper vision, reduced glare at night, and a life free from the hassles of contacts and glasses.",
        scopeTitle: "Refractive Excellence",
        scopeImg: "/assets/images/services/lasik.png",
        scopePoints: [
            { title: "Eligibility Exam", desc: "Pentacam & Corvis scans to ensure absolute safety." },
            { title: "Contoura® Vision", desc: "Topography-guided ablation for superior results." },
            { title: "Blade-Free Flap", desc: "Femtosecond laser creation of the corneal flap." },
            { title: "Lifetime Enhancement", desc: "Our commitment to your long-term vision stability." }
        ],
        doctorRoleKeyword: "Refractive",
        faqs: [
            { question: "Am I eligible for LASIK?", answer: "We perform a comprehensive 7-point check to determine eligibility. Most healthy adults over 18 with stable prescriptions are good candidates." },
            { question: "Is it permanent?", answer: "Yes, LASIK permanently reshapes your cornea. However, age-related reading vision changes (presbyopia) may still occur later in life." }
        ]
    },
    {
        id: "glaucoma-care",
        title: "Glaucoma Care",
        shortDesc: "Protect your optic nerve with our 'Silent Thief of Sight' protocol. We offer MIGS (Minimally Invasive Glaucoma Surgery) and SLT laser therapy for effective pressure control.",
        img: "/assets/images/services/glaucoma.png",
        heroTitle: "Preserving Your Sight",
        heroSubtitle: "Advanced Glaucoma Management",
        heroTagline: "Early detection is your best protection.",
        overviewTitle: "The Silent Thief of Sight",
        overviewText: "Glaucoma often has no early symptoms, slowly stealing your peripheral vision before you notice. Our mission is to detect it early and manage it aggressively to preserve your sight for a lifetime.",
        longDesc: "We take a proactive approach to Glaucoma management. Gone are the days when heavy medication was the only option. We utilize the latest in diagnostic technology, including OCT Angiography and Visual Field analysis, to track changes at a microscopic level.\n\nOur treatment philosophy prioritizes Quality of Life. We offer SLT (Selective Laser Trabeculoplasty) as a first-line treatment to reduce dependence on drops. For surgical cases, we specialize in MIGS (Minimally Invasive Glaucoma Surgery), which uses microscopic stents to bypass blockages, offering safer outcomes and faster recovery than traditional filtration surgeries.",
        scopeTitle: "Holistic Pressure Control",
        scopeImg: "/assets/images/services/glaucoma.png",
        scopePoints: [
            { title: "Early Detection", desc: "RNFL Analysis & OCT Angiography." },
            { title: "SLT Laser", desc: "Painless, non-invasive pressure reduction." },
            { title: "MIGS Stents", desc: "iStent & Hydrus implantations." },
            { title: "Tube Shunts", desc: "Complex management for advanced cases." }
        ],
        doctorRoleKeyword: "Glaucoma",
        faqs: [
            { question: "Can glaucoma damage be reversed?", answer: "No, vision lost to glaucoma cannot be restored. This is why early detection and regular monitoring are critical." }
        ]
    },
    {
        id: "retina-service",
        title: "Retina Service",
        shortDesc: "Expert management of Macular Degeneration and Diabetic Retinopathy. We use high-resolution OCT imaging and pain-free intravitreal injections to preserve central vision.",
        img: "/assets/images/services/retina.png",
        heroTitle: "Protecting Central Vision",
        heroSubtitle: "Expert Retina Care",
        heroTagline: "Precision care for the eye's most vital layer.",
        overviewTitle: "Guardians of the Retina",
        overviewText: "The retina is the film of the camera that is your eye. Damage here can be permanent, which is why our retina specialists are available 24/7 for emergencies and use the most advanced imaging systems available.",
        longDesc: "From Age-Related Macular Degeneration (AMD) to Diabetic Retinopathy, retinal diseases require vigilant monitoring and precise intervention. Our clinic is equipped with high-definition OCT scans that allow us to see layers of the retina that are invisible to the naked eye.\n\nWe specialize in pain-free, specialized injection therapies that have revolutionized the treatment of wet AMD, halting vision loss in its tracks. For surgical cases like retinal detachments or macular holes, our surgeons use 25-gauge and 27-gauge sutureless vitrectomy systems for minimally invasive repairs and quicker recovery.",
        scopeTitle: "Retinal Therapeutics",
        scopeImg: "/assets/images/services/retina.png",
        scopePoints: [
            { title: "Diabetic Screening", desc: "AI-assisted fundus analysis." },
            { title: "Intravitreal Injections", desc: "Anti-VEGF therapy for AMD & edema." },
            { title: "Sutureless Vitrectomy", desc: "Minimally invasive retinal repair." },
            { title: "Laser Photocoagulation", desc: "Treatment for tears and vascular leaks." }
        ],
        doctorRoleKeyword: "Retina",
        faqs: [
            { question: "What is diabetic retinopathy?", answer: "It's a complication of diabetes that affects the eyes, caused by damage to the blood vessels of the light-sensitive tissue at the back of the eye (retina)." }
        ]
    },
    {
        id: "cornea-transplant",
        title: "Cornea Transplant",
        shortDesc: "Leaders in partial thickness transplants like DMEK and DSAEK. These ultra-thin grafts provide faster visual recovery and lower rejection rates than traditional methods.",
        img: "/assets/images/services/cornea-transplant.png",
        heroTitle: "Clearer Vision Ahead",
        heroSubtitle: "Advanced Cornea Care",
        heroTagline: "Restoring clarity, layer by layer.",
        overviewTitle: "The Window to Your Vision",
        overviewText: "The cornea is the eye's outermost layer. When it becomes cloudy or scarred, vision fades. We specialize in restoring that clarity through advanced transplantation techniques.",
        longDesc: "Corneal transplantation has evolved. We no longer replace the entire cornea unless absolutely necessary. Instead, we perform component separation transplants (DMEK/DSAEK), replacing only the damaged layers.\n\nThis approach significantly reduces rejection risk and speeds up visual recovery from months to weeks. We also manage keratoconus with Collagen Cross-Linking (CXL) to halt progression and Scleral Lenses for visual rehabilitation.",
        scopeTitle: "Corneal Services",
        scopeImg: "/assets/images/services/cornea-transplant.png",
        scopePoints: [
            { title: "DMEK / DSAEK", desc: "Partial thickness transplants." },
            { title: "C3R / CXL", desc: "Collagen Cross-Linking for Keratoconus." },
            { title: "Dry Eye Clinic", desc: "Comprehensive surface management." },
            { title: "Pterygium Surgery", desc: "Autograft technique for low recurrence." }
        ],
        doctorRoleKeyword: "Cornea",
        faqs: [
            { question: "What is a cornea transplant?", answer: "It's a surgical procedure to replace part of your cornea with corneal tissue from a donor." }
        ]
    },
    {
        id: "pediatric-vision",
        title: "Pediatric Vision",
        shortDesc: "Specialized care for developing eyes. From myopia control using atropine or Ortho-K to gentle squint (strabismus) correction surgeries for perfect alignment.",
        img: "/assets/images/services/pediatric-vision.png",
        heroTitle: "Little Eyes, Big Dreams",
        heroSubtitle: "Pediatric Ophthalmology",
        heroTagline: "Nurturing vision for a lifetime of learning.",
        overviewTitle: "Care Designed for Kids",
        overviewText: "Children aren't just small adults. Their eyes are constantly developing, and vision issues can impact learning and confidence. We create a fun, fearless environment for our youngest patients.",
        longDesc: "80% of classroom learning is visual. Undiagnosed vision problems can be misdiagnosed as learning disabilities. Our pediatric team is skilled in examining even non-verbal children using specialized equipment.\n\nWe are leaders in Myopia Control, using Atropine therapy and Ortho-K lenses to slow down the progression of nearsightedness. We also perform delicate strabismus (squint) surgeries to align eyes perfectly, ensuring proper 3D vision development.",
        scopeTitle: "Pediatric Services",
        scopeImg: "/assets/images/services/pediatric-vision.png",
        scopePoints: [
            { title: "Myopia Control", desc: "Atropine & Ortho-K management." },
            { title: "Squint Surgery", desc: "Muscle correction for alignment." },
            { title: "Amblyopia Therapy", desc: "Lazy eye patch & digital therapy." },
            { title: "ROP Screening", desc: "Retinal care for premature infants." }
        ],
        doctorRoleKeyword: "Pediatric",
        faqs: [
            { question: "When should my child have their first eye exam?", answer: "The American Academy of Ophthalmology recommends screenings at birth, age 1, age 3, and before first grade." }
        ]
    },
    {
        id: "dry-eye-spa",
        title: "Dry Eye Spa",
        shortDesc: "Relief for gritty, tired eyes. Our Dry Eye Spa features LipiFlow thermal pulsation and IPL therapy to unclog glands and restore your natural tear film.",
        img: "/assets/images/services/dry-eye-spa.png",
        heroTitle: "Soothe Your Eyes",
        heroSubtitle: "Advanced Dry Eye Spa",
        heroTagline: "Relief from the digital strain of modern life.",
        overviewTitle: "More Than Just Drops",
        overviewText: "Chronic dry eye is a disease of the surface. Artificial tears only mask the symptoms. We treat the root cause—blocked oil glands and inflammation—to provide lasting relief.",
        longDesc: "Our Dry Eye Spa is a sanctuary for tired eyes. We utilize LipiFlow® Thermal Pulsation technology to gently heat and massage the Meibomian glands, clearing blockages that cause evaporative dry eye.\n\nCombined with IPL (Intense Pulsed Light) therapy to reduce inflammation and BlephEx treatments for lid hygiene, we restore the natural balance of your tear film. Perfect for IT professionals and anyone suffering from digital eye strain.",
        scopeTitle: "Spa Treatments",
        scopeImg: "/assets/images/services/dry-eye-spa.png",
        scopePoints: [
            { title: "LipiFlow", desc: "Thermal pulsation for MGD." },
            { title: "IPL Therapy", desc: "Light therapy for inflammation." },
            { title: "BlephEx", desc: "Microblepharoexfoliation for lid hygiene." },
            { title: "Punctal Plugs", desc: "Tear conservation method." }
        ],
        doctorRoleKeyword: "General",
        faqs: [
            { question: "What causes dry eyes?", answer: "Dry eyes can be caused by many factors, including aging, certain medications, environmental conditions, and Meibomian Gland Dysfunction (MGD)." }
        ]
    },
    {
        id: "oculoplastics",
        title: "Oculoplastics",
        shortDesc: "Cosmetic and reconstructive eyelid surgery. We treat droopy eyelids (ptosis), removes bags, and reconstruct after tumor removal with aesthetic precision.",
        img: "/assets/images/services/oculoplastics.png",
        heroTitle: "Aesthetic Precision",
        heroSubtitle: "Oculoplastic Surgery",
        heroTagline: "Where ophthalmology meets artistry.",
        overviewTitle: "Form Meets Function",
        overviewText: "Your eyes are the focal point of your face. Whether reconstructive or cosmetic, our oculoplastic procedures are designed to enhance appearance while protecting the health of your eyes.",
        longDesc: "Oculoplastics is a specialized field combining the microsurgery of ophthalmology with the aesthetic principles of plastic surgery. We treat functional issues like Ptosis (droopy eyelids) that obstruct vision, as well as Entropion/Ectropion.\n\nOn the cosmetic side, we offer Blepharoplasty (eyelid lifts) to remove excess skin and bags, giving you a rejuvenated, rested appearance. All procedures are performed with a deep understanding of eye anatomy to ensure safety and natural-looking results.",
        scopeTitle: "Aesthetic Services",
        scopeImg: "/assets/images/services/oculoplastics.png",
        scopePoints: [
            { title: "Blepharoplasty", desc: "Eyelid lifting & bag removal." },
            { title: "Ptosis Repair", desc: "Correction of droopy eyelids." },
            { title: "Botox & Fillers", desc: "Non-surgical rejuvenation." },
            { title: "Orbit Surgery", desc: "Trauma and tumor management." }
        ],
        doctorRoleKeyword: "Oculoplastic",
        faqs: [
            { question: "What is blepharoplasty?", answer: "It's a type of surgery that repairs droopy eyelids and may involve removing excess skin, muscle and fat." }
        ]
    }
];

// Services List (Subset for Homepage)
const SERVICES = ALL_SERVICES.slice(0, 8);

// ======================== DOCTORS DATA ========================
const DOCTORS = [
    { name: "Dr. Priya Sharma", role: "Cataract Specialist", qualification: "MBBS, MD (Ophthal)", experience: "15 Years Exp", languages: ["Hindi", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face", order: 1, email: "priya.sharma@visionary.in" },
    { name: "Dr. Rajesh Kumar", role: "Retina Surgeon", qualification: "MBBS, MS, FVRS", experience: "12 Years Exp", languages: ["Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face", order: 2, email: "rajesh.kumar@visionary.in" },
    { name: "Dr. Anjali Verma", role: "Pediatric Ophthalmologist", qualification: "MD, FPOS", experience: "10 Years Exp", languages: ["Hindi", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400&h=400&fit=crop&crop=face", order: 3, email: "anjali.verma@visionary.in" },
    { name: "Dr. Vikram Singh", role: "Glaucoma Specialist", qualification: "MBBS, DO", experience: "20 Years Exp", languages: ["Hindi", "Punjabi"], gender: "Male", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face", order: 4, email: "vikram.singh@visionary.in" },
    { name: "Dr. Arjun Reddy", role: "Cornea Specialist", qualification: "MD, FACS", experience: "18 Years Exp", languages: ["Telugu", "Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face", order: 5, email: "arjun.reddy@visionary.in" },
    { name: "Dr. Anita Patel", role: "Refractive Surgeon", qualification: "MBBS, MS", experience: "8 Years Exp", languages: ["Gujarati", "Hindi", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face", order: 6, email: "anita.patel@visionary.in" },
    { name: "Dr. Karan Malhotra", role: "Neuro-Ophthalmologist", qualification: "MD, PhD", experience: "14 Years Exp", languages: ["Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face", order: 7, email: "karan.malhotra@visionary.in" },
    { name: "Dr. Meera Iyer", role: "Oculoplastic Surgeon", qualification: "MD, FPRS", experience: "16 Years Exp", languages: ["Tamil", "Hindi", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop&crop=face", order: 8, email: "meera.iyer@visionary.in" },
    { name: "Dr. Suresh Nair", role: "Retina Surgeon", qualification: "MD, FACS", experience: "22 Years Exp", languages: ["Malayalam", "Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face", order: 9, email: "suresh.nair@visionary.in" },
    { name: "Dr. Kavita Desai", role: "Optometrist", qualification: "OD", experience: "5 Years Exp", languages: ["Marathi", "Hindi", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face", order: 10, email: "kavita.desai@visionary.in" },
    { name: "Dr. Aditya Kapoor", role: "Cataract Specialist", qualification: "MD", experience: "19 Years Exp", languages: ["Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1625130045485-f9ef83cd2d42?w=400&h=400&fit=crop&crop=face", order: 11, email: "aditya.kapoor@visionary.in" },
    { name: "Dr. Sneha Gupta", role: "Glaucoma Specialist", qualification: "MBBS, MS", experience: "9 Years Exp", languages: ["Hindi", "Bengali"], gender: "Female", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face", order: 12, email: "sneha.gupta@visionary.in" },
    { name: "Dr. Rohit Joshi", role: "General Ophthalmology", qualification: "MBBS", experience: "4 Years Exp", languages: ["Hindi", "English"], gender: "Male", image: "https://images.unsplash.com/photo-1650831206001-06c1e2b2e9a4?w=400&h=400&fit=crop&crop=face", order: 13, email: "rohit.joshi@visionary.in" },
    { name: "Dr. Divya Pillai", role: "Low Vision Specialist", qualification: "OD, FAAO", experience: "11 Years Exp", languages: ["Malayalam", "Tamil", "English"], gender: "Female", image: "https://images.unsplash.com/photo-1584467735815-f778f274cdb6?w=400&h=400&fit=crop&crop=face", order: 14, email: "divya.pillai@visionary.in" }
];

// ======================== BLOGS DATA ========================
const BLOG_POSTS = [
    {
        title: 'The Future with Robotics: Precision Beyond Human Hands',
        slug: 'future-of-robotics-surgery',
        subtitle: 'How autonomous systems are redefining surgical outcomes.',
        author: { name: 'Dr. Priya Menon', role: 'Chief of Surgery' },
        publishedAt: new Date('2025-10-12'),
        category: 'Innovation',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932&auto=format&fit=crop',
        isPublished: true,
        content: '<p><span class="drop-cap">W</span>hen we speak of the future of medicine, we often look to the stars...</p><p>Imagine a tremor-free cut, precise to the micron...</p><p>The implications for patient recovery are profound...</p>'
    },
    {
        title: 'The Silent Epidemic: Myopia in the Digital Age',
        slug: 'pediatric-eye-health',
        subtitle: 'Why children are losing focus and how we can stop it.',
        author: { name: 'Dr. Anjali Krishnan', role: 'Pediatric Specialist' },
        publishedAt: new Date('2025-09-28'),
        category: 'Pediatrics',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?q=80&w=2070&auto=format&fit=crop',
        isPublished: true,
        content: '<p><span class="drop-cap">I</span>t starts with a squint...</p><p>Screens are ubiquitous...</p><p>The "20-20-20" rule has never been more relevant...</p>'
    },
    {
        title: 'Golden Hour: The Critical Moments in Trauma',
        slug: 'navigating-emergency-care',
        subtitle: 'Inside the fast-paced world of our Level 1 Trauma Center.',
        author: { name: 'Dr. Vikram Bhatia', role: 'ER Director' },
        publishedAt: new Date('2025-09-15'),
        category: 'Emergency',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0921269?q=80&w=2070&auto=format&fit=crop',
        isPublished: true,
        content: '<p><span class="drop-cap">T</span>ick. Tock. In trauma medicine...</p><p>Our emergency department is designed around this philosophy...</p>'
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB Connected');

        await Page.deleteMany({});
        await Section.deleteMany({});
        await Doctor.deleteMany({});
        await Blog.deleteMany({});
        console.log('🗑️  Cleared existing CMS data');

        // ======================= SEED DOCTORS =======================
        // await Doctor.insertMany(DOCTORS);
        // console.log(`👨‍⚕️ Seeded ${DOCTORS.length} doctors`);

        // ======================= SEED BLOGS =======================
        await Blog.insertMany(BLOG_POSTS);
        console.log(`📝 Seeded ${BLOG_POSTS.length} blogs`);

        // ======================= HOME PAGE (12 sections) =======================
        const homePage = await Page.create({ slug: 'home', title: 'Home', type: 'main', navbarOrder: 0, isPublished: true, showInNavbar: false, metaTitle: 'Romashka Health Care - World-Class Eye Care' });

        await Section.create([
            { pageId: homePage._id, type: 'advertisement', order: 0, title: 'Advertisement Popup', isVisible: true, data: { enabled: true, ctaText: 'Limited Time Offer. Visit us today!', showFrequency: '1 hour', image: 'https://images.unsplash.com/photo-1606166187734-a4b78643dd60?q=80&w=600' } },
            { pageId: homePage._id, type: 'hero', order: 1, title: 'Hero Section', isVisible: true, data: { tagline: 'World-Class Healthcare', title: 'Healing with Compassion.', subtitle: 'Experience a new standard of medical excellence. Where advanced technology meets human touch.', ctaText: 'Book Appointment', backgroundImage: '/assets/images/hero-bg.jpg' } }, // Indian Doctor/Hospital vibe
            { pageId: homePage._id, type: 'partners', order: 2, title: 'Partners Marquee', isVisible: true, data: { headline: 'Trusted by Leading Indian Healthcare Partners', logos: PARTNER_LOGOS } },
            { pageId: homePage._id, type: 'network', order: 3, title: 'Our Extensive Network', subtitle: 'World-class eye care across major Indian cities.', isVisible: true, data: { centers: NETWORK_CENTERS, cta: { title: "Can't find a center near you?", subtitle: 'Check our 50+ satellite clinics across India.', buttonText: 'View All Locations' } } },
            { pageId: homePage._id, type: 'partition', order: 4, title: 'Section Divider', isVisible: true, data: { style: 'gradient-line' } },
            { pageId: homePage._id, type: 'about', order: 5, title: 'Excellence in Vision Care', isVisible: true, data: { headline: 'Excellence in Vision Care', description: "We don't just treat eyes; we enhance your view of the world.", features: ABOUT_FEATURES } },
            { pageId: homePage._id, type: 'technology', order: 6, title: 'World-Class Technology', isVisible: true, data: { tagline: 'Innovation', headline: 'World-Class Technology', description: 'Latest ophthalmic advancements for safety, precision, and faster recovery.', technologies: TECHNOLOGY } },
            { pageId: homePage._id, type: 'services', order: 7, title: 'Our Specialities', subtitle: 'Comprehensive eye care solutions powered by advanced technology.', isVisible: true, data: { tagline: 'Premium Care', cards: SERVICES } },
            { pageId: homePage._id, type: 'doctors', order: 8, title: 'Our Medical Experts', subtitle: 'World-class doctors dedicated to your vision health.', isVisible: true, data: { showCount: 10, layout: 'carousel', showSearch: true, showBookButton: true } },
            { pageId: homePage._id, type: 'testimonials', order: 9, title: 'Patient Stories', subtitle: 'Life-Changing Results', isVisible: true, data: { tagline: 'Patient Stories', headline: 'Life-Changing Results', testimonials: TESTIMONIALS } },
            { pageId: homePage._id, type: 'blogs', order: 10, title: 'Latest News & Insights', isVisible: true, data: { tagline: 'Our Blog', headline: 'Latest News & Insights', showCount: 3, showViewAll: true } },
            { pageId: homePage._id, type: 'faq', order: 11, title: 'Patient Education & Resources', isVisible: true, data: { headline: 'Patient Education & Resources', faqs: FAQ_ITEMS } }
        ]);
        console.log('📄 Home page: 12 sections');

        // ======================= ABOUT US PAGE (6 sections) =======================
        const aboutPage = await Page.create({ slug: 'about', title: 'About Us', type: 'main', navbarOrder: 1, isPublished: true, showInNavbar: true, metaTitle: 'About Us - Romashka Health Care' });

        await Section.create([
            { pageId: aboutPage._id, type: 'hero', order: 0, title: 'About Hero', isVisible: true, data: { tagline: 'Our Story', title: 'We see the world differently.', subtitle: "Romashka isn't just a clinic. It's a promise to restore not just sight, but the connection to the world around you.", ctaText: "Meet Our Team", backgroundImage: '/assets/images/hero-bg.jpg' } },
            { pageId: aboutPage._id, type: 'content', order: 1, title: 'Full Width Image', isVisible: true, data: { image: '/assets/images/services/advanced-diagnostics.png', content: '"Precision is not an act, it is a habit. Our surgeons cultivate this habit every single day."' } },
            { pageId: aboutPage._id, type: 'content', order: 2, title: 'Our Philosophy', isVisible: true, data: { content: "In an era of assembly-line medicine, we chose a different path. We believe that every eye has a story. We don't hide behind complex medical jargon. We believe clarity begins with communication." } },
            { pageId: aboutPage._id, type: 'stats', order: 3, title: 'Legacy Timeline', isVisible: true, data: { stats: [{ number: '1995', label: 'Born from a desire to do better.' }, { number: '2008', label: 'First blade-free studio in the region.' }, { number: '2019', label: 'Recognized globally for safety standards.' }, { number: 'Now', label: 'Pioneering AI in preventative care.' }] } },
            { pageId: aboutPage._id, type: 'cards', order: 4, title: 'We stand for...', isVisible: true, data: { headline: 'We stand for...', cards: [{ icon: '🌟', title: 'Transparency', description: 'No hidden costs. No surprise procedures. Complete clarity.' }, { icon: '🔭', title: 'Innovation', description: 'Investing in the future of sight, today.' }, { icon: '💙', title: 'Compassion', description: 'Treating the person, not just the condition.' }] } },
            { pageId: aboutPage._id, type: 'partners', order: 5, title: 'Partners', isVisible: true, data: { logos: PARTNER_LOGOS } },
            { pageId: aboutPage._id, type: 'network', order: 6, title: 'Network', isVisible: true, data: { centers: NETWORK_CENTERS } }
        ]);
        console.log('📄 About page: 7 sections');

        // ======================= DOCTORS PAGE (3 sections) =======================
        const doctorsPage = await Page.create({ slug: 'doctors', title: 'Our Doctors', type: 'main', navbarOrder: 2, isPublished: true, showInNavbar: true, metaTitle: 'Our Expert Doctors - Romashka Health Care' });

        await Section.create([
            { pageId: doctorsPage._id, type: 'hero', order: 0, title: 'Doctors Hero', isVisible: true, data: { title: 'World-class expertise.', tagline: 'Visionary care for a clearer tomorrow.', subtitle: 'Meet our team of world-class ophthalmologists and vision care experts.', backgroundImage: '/assets/images/services/retina.png' } },
            { pageId: doctorsPage._id, type: 'doctors', order: 1, title: 'All Doctors', isVisible: true, data: { showAll: true, layout: 'grid', showSearch: true, showBookButton: true } },
            { pageId: doctorsPage._id, type: 'testimonials', order: 2, title: 'What Our Patients Say', isVisible: true, data: { tagline: 'Testimonials', headline: 'What Our Patients Say', testimonials: TESTIMONIALS } }
        ]);
        console.log('📄 Doctors page: 3 sections');

        // ======================= CONTACT PAGE (4 sections) =======================
        const contactPage = await Page.create({ slug: 'contact', title: 'Contact', type: 'main', navbarOrder: 5, isPublished: true, showInNavbar: true, metaTitle: 'Contact Us - Romashka Health Care' });

        await Section.create([
            { pageId: contactPage._id, type: 'hero', order: 0, title: 'Contact Hero', isVisible: true, data: { title: 'Get in Touch', subtitle: "We're here to help. Reach out to us for appointments, inquiries, or just to say hello.", backgroundImage: '/assets/images/services/emergency-care.png' } },
            { pageId: contactPage._id, type: 'contact', order: 1, title: 'Contact Information', isVisible: true, data: { showForm: true, showInfo: true } },
            { pageId: contactPage._id, type: 'faq', order: 2, title: 'FAQ', isVisible: true, data: { headline: 'Frequently Asked Questions', faqs: FAQ_ITEMS } },
            { pageId: contactPage._id, type: 'map', order: 3, title: 'Location Map', isVisible: true, data: { embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56066.65089631422!2d77.33685559999999!3d28.6124282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2062%2C%20Noida!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' } }
        ]);
        console.log('📄 Contact page: 4 sections');

        // ======================= BLOGS PAGE (2 sections) =======================
        const blogsPage = await Page.create({ slug: 'blogs', title: 'Blogs', type: 'main', navbarOrder: 4, isPublished: true, showInNavbar: true, metaTitle: 'Eye Health Blog - Romashka Health Care' });

        await Section.create([
            { pageId: blogsPage._id, type: 'hero', order: 0, title: 'Blog Hero', isVisible: true, data: { tagline: 'The Romashka Journal', title: 'Medical Insights', showSearch: true, backgroundImage: '/assets/images/services/genetic-testing.png' } },
            { pageId: blogsPage._id, type: 'blogs', order: 1, title: 'All Blog Posts', isVisible: true, data: { showAll: true, layout: 'grid', showSearch: true } }
        ]);
        console.log('📄 Blogs page: 2 sections');

        // ======================= SPECIALITIES PAGE (4 sections) =======================
        const specialtiesPage = await Page.create({ slug: 'specialties', title: 'Specialties', type: 'main', navbarOrder: 3, isPublished: true, showInNavbar: true, metaTitle: 'Eye Care Specialties - Romashka Health Care' });

        await Section.create([
            { pageId: specialtiesPage._id, type: 'hero', order: 0, title: 'Specialties Hero', isVisible: true, data: { title: 'Precision in every procedure.', tagline: 'Advanced technology. Human touch.', subtitle: 'Comprehensive eye care services powered by the latest medical technology.', backgroundImage: '/assets/images/services/advanced-diagnostics.png' } },
            { pageId: specialtiesPage._id, type: 'services', order: 1, title: 'All Services', isVisible: true, data: { services: SERVICES } },
            { pageId: specialtiesPage._id, type: 'cards', order: 2, title: 'Your Journey to Clear Vision', isVisible: true, data: { tagline: 'How It Works', headline: 'Your Journey to Clear Vision', cards: [{ icon: '1', title: 'Holistic Exam', description: 'We use AI topography to map 22,000 points of your eye for a complete health profile.' }, { icon: '2', title: 'Custom Plan', description: 'Your treatment is 100% personalized to your lifestyle.' }, { icon: '3', title: 'Precision Care', description: 'Blade-free Femtosecond lasers for micron-level accuracy.' }, { icon: '4', title: 'Lifetime Support', description: 'Our post-op care ensures your results remain stable for years.' }] } },
            { pageId: specialtiesPage._id, type: 'technology', order: 3, title: 'Technology', isVisible: true, data: { tagline: 'Innovation', headline: 'World-Class Technology', technologies: TECHNOLOGY } }
        ]);
        console.log('📄 Specialties page: 4 sections');

        // ======================= SERVICE SUBPAGES (Generated from ALL_SERVICES) =======================
        for (const service of ALL_SERVICES) {
            const subPage = await Page.create({
                slug: `services/${service.id}`,
                title: service.title,
                type: 'sub',
                parentPage: specialtiesPage._id,
                isPublished: true,
                showInNavbar: false,
                metaTitle: `${service.title} - Romashka Health Care`
            });

            await Section.create([
                { pageId: subPage._id, type: 'hero', order: 0, title: `${service.title} Hero`, isVisible: true, data: { tagline: 'Clinical Excellence', title: service.heroTitle, subtitle: service.heroTagline, backgroundImage: service.img } },
                { pageId: subPage._id, type: 'content', order: 1, title: 'Overview', isVisible: true, data: { tagline: service.overviewTitle, content: service.overviewText } },
                { pageId: subPage._id, type: 'cards', order: 2, title: 'Scope of Services', isVisible: true, data: { tagline: 'What We Offer', headline: service.scopeTitle, cards: service.scopePoints.map(p => ({ title: p.title, description: p.desc })) } },
                { pageId: subPage._id, type: 'doctors', order: 3, title: 'Specialists', isVisible: true, data: { showCount: 3, layout: 'grid', showBookButton: true } },
                { pageId: subPage._id, type: 'faq', order: 4, title: 'Common Questions', isVisible: true, data: { headline: 'Frequently Asked Questions', faqs: service.faqs || service.faq || [] } },
                { pageId: subPage._id, type: 'cta', order: 5, title: 'Book Now', isVisible: true, data: { title: 'Ready to restore your vision?', subtitle: 'Schedule your comprehensive evaluation today.', buttonText: 'Book Appointment', buttonLink: '/appointment' } }
            ]);
        }
        console.log(`📄 Service subpages: ${ALL_SERVICES.length} pages generated (example loop)`);

        // ======================= SITE SETTINGS =======================
        await SiteSettings.findOneAndUpdate({}, {
            siteName: 'Romashka Health Care',
            tagline: 'World-Class Eye Care',
            contact: { address: 'Sector 62, Noida, Uttar Pradesh 201301', phone: '+91 120 456 7890', email: 'info@romashka.in', emergencyNumber: '1800-ROMASHKA', workingHours: { weekdays: '8:00 AM - 8:00 PM', saturday: '9:00 AM - 5:00 PM', sunday: 'Emergency Only' } },
            social: { facebook: 'https://facebook.com/romashka', twitter: 'https://twitter.com/romashka', instagram: 'https://instagram.com/romashka', linkedin: 'https://linkedin.com/company/romashka', youtube: 'https://youtube.com/romashka' },
            navbar: {
                siteName: 'Romashka',
                logoInitial: 'R',
                ctaText: 'Book an Appointment',
                ctaLink: '/appointment',
                items: [
                    { name: 'Home', href: '/' },
                    { name: 'About Us', href: '/about' },
                    { name: 'Doctors', href: '/doctors' },
                    { name: 'Specialties', href: '/specialties' },
                    { name: 'Blogs', href: '/blogs' },
                    { name: 'Contact', href: '/contact' }
                ]
            },
            footer: {
                description: 'Providing clarity and vision to the world through advanced ophthalmology and compassionate care.',
                copyright: '© 2026 Romashka Health Care. All rights reserved.',
                quickLinks: [
                    { name: 'Home', href: '/' },
                    { name: 'About Us', href: '/about' },
                    { name: 'Our Doctors', href: '/doctors' },
                    { name: 'Specialties', href: '/specialties' },
                    { name: 'Book Appointment', href: '/appointment' }
                ],
                servicesLinks: [
                    { name: 'Cataract Surgery', href: '/services/cataract-surgery' },
                    { name: 'LASIK Correction', href: '/services/lasik-correction' },
                    { name: 'Glaucoma Treatment', href: '/services/glaucoma-treatment' },
                    { name: 'Retina Care', href: '/services/retina-care' },
                    { name: 'Pediatric Eye Care', href: '/services/pediatric-ophthalmology' }
                ]
            }
        }, { upsert: true });
        console.log('⚙️  Site settings updated');

        console.log('\n✅ DATABASE SEEDED WITH COMPREHENSIVE CONTENT!');
        process.exit(0);
    } catch (error) {

        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
