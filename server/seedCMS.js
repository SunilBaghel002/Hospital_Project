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
    { title: 'Pediatric Vision', link: '/services/pediatric-vision', img: '/assets/about/pediatric.png', desc: 'Specialized gentle care for our youngest patients with myopia control.' }
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
        shortDesc: "Advanced cataract removal including Phoco and Sics methods.",
        img: "/assets/images/services/cataract-surgery.png",
        heroTitle: "Restore Your Vision",
        heroSubtitle: "Phoco & Sics Methods",
        heroTagline: "Expert care for clear vision.",
        overviewTitle: "Advanced Cataract Solutions",
        overviewText: "We offer both Phacoemulsification (Phoco) and Small Incision Cataract Surgery (Sics) to treat cataracts effectively.",
        longDesc: "Cataract surgery is a safe and effective procedure to restore vision. We specialize in two primary methods: Phacoemulsification (Phoco), a modern technique using ultrasound to break up the cataract with a minimal incision, and Small Incision Cataract Surgery (Sics), a trusted manual technique ideal for advanced cataracts. Our team ensures the best method is chosen for your specific eye health and lifestyle needs.",
        scopeTitle: "Our Techniques",
        scopeImg: "/assets/images/services/cataract-surgery.png",
        scopePoints: [
            { title: "Phoco Method", desc: "Ultrasound phacoemulsification for quick recovery." },
            { title: "Sics Method", desc: "Small incision surgery for mature cataracts." },
            { title: "IOL Implantation", desc: "Premium lens options for best visual outcome." },
            { title: "Post-Op Care", desc: "Comprehensive follow-up to ensure healing." }
        ],
        doctorRoleKeyword: "Cataract",
        faqs: [
            { question: "Which method is better, Phoco or Sics?", answer: "Phoco is generally preferred for its smaller incision and faster recovery, but Sics is excellent for harder, more mature cataracts. Your doctor will recommend the best option for you." }
        ]
    },
    {
        id: "pterygium-surgery",
        title: "Pterygium Surgery",
        shortDesc: "Specialized removal using the Autografting method for low recurrence.",
        img: "/assets/images/services/cornea-transplant.png",
        heroTitle: "Clear the Surface",
        heroSubtitle: "Autografting Method",
        heroTagline: "Restoring the natural look of your eye.",
        overviewTitle: "Pterygium Removal",
        overviewText: "Pterygium is a growth on the eye's surface that can affect vision and appearance. We use the superior Autografting method.",
        longDesc: "Pterygium surgery involves removing non-cancerous growths from the conjunctiva. We utilize the Autografting method, where a small piece of your own healthy tissue is used to fill the gap left by the removal. This technique significantly reduces the chance of regrowth compared to traditional bare-sclera techniques and ensures a cosmetically pleasing result.",
        scopeTitle: "Procedure Details",
        scopeImg: "/assets/images/services/cornea-transplant.png",
        scopePoints: [
            { title: "Autografting", desc: "Using your own tissue for best results." },
            { title: "Sutureless Options", desc: "Advanced glue usage for patient comfort." },
            { title: "Cosmetic Restoration", desc: "Returns the eye to a normal white appearance." },
            { title: "Prevention", desc: "Guidance on UV protection to prevent recurrence." }
        ],
        doctorRoleKeyword: "Cornea",
        faqs: [
            { question: "Will the growth come back?", answer: "With the autografting method we use, the recurrence rate is extremely low compared to older techniques." }
        ]
    },
    {
        id: "dcr-surgery",
        title: "DCR Surgery",
        shortDesc: "Dacryocystorhinostomy (DCR) surgery to treat blocked tear ducts.",
        img: "/assets/images/services/oculoplastics.png",
        heroTitle: "Relief from Watering Eyes",
        heroSubtitle: "Dacryocystorhinostomy (DCR)",
        heroTagline: "Unblocking tear ducts for lasting comfort.",
        overviewTitle: "Tear Duct Surgery",
        overviewText: "DCR is a procedure to create a new drainage path for tears between the eye and the nose.",
        longDesc: "When the nasolacrimal duct becomes blocked, it causes excessive tearing and risk of infection. Dacryocystorhinostomy (DCR) surgery constructs a new pathway for tear drainage, bypassing the blockage. This procedure acts as a permanent solution to chronic watering eyes and dacryocystitis (infection of the tear sac).",
        scopeTitle: "Surgical Benefits",
        scopeImg: "/assets/images/services/oculoplastics.png",
        scopePoints: [
            { title: "Tear Drainage", desc: "Restores natural tear flow." },
            { title: "Infection Control", desc: "Prevents recurrent eye infections." },
            { title: "Minimally Invasive", desc: "External and Endoscopic options available." },
            { title: "Recovery", desc: "Quick return to normal activities." }
        ],
        doctorRoleKeyword: "Oculoplastic",
        faqs: [
            { question: "Is DCR surgery major surgery?", answer: "It is a standard procedure with a high success rate. Most patients go home the same day." }
        ]
    },
    {
        id: "glaucoma-surgery",
        title: "Glaucoma Surgery",
        shortDesc: "Advanced surgical interventions to lower eye pressure and protect sight.",
        img: "/assets/images/services/glaucoma.png",
        heroTitle: "Preserving Vision",
        heroSubtitle: "Glaucoma Surgery",
        heroTagline: "Effective management of intraocular pressure.",
        overviewTitle: "Fighting the Silent Thief",
        overviewText: "When drops and laser are not enough, surgery helps control Glaucoma and prevent further vision loss.",
        longDesc: "Glaucoma surgery aims to reduce intraocular pressure (IOP) to a safe level to prevent damage to the optic nerve. We offer various procedures ranging from Trabeculectomy (filtration surgery) to the implantation of Tube Shunts for complex cases. Our goal is to stabilize your vision and preserve it for the future.",
        scopeTitle: "Surgical Options",
        scopeImg: "/assets/images/services/glaucoma.png",
        scopePoints: [
            { title: "Trabeculectomy", desc: "Creating a new drainage channel." },
            { title: "Tube Shunts", desc: "Implants for controlled pressure reduction." },
            { title: "MIGS", desc: "Minimally Invasive Glaucoma Surgery." },
            { title: "Post-Op Monitoring", desc: "Strict follow-up for pressure control." }
        ],
        doctorRoleKeyword: "Glaucoma",
        faqs: [
            { question: "Will surgery restore my lost vision?", answer: "No, glaucoma surgery is done to prevent further vision loss. It cannot restore vision already lost." }
        ]
    },
    {
        id: "vitrectomy-surgery",
        title: "Vitrectomy Surgery",
        shortDesc: "Micro-surgical procedure for retinal detachments and vitreous issues.",
        img: "/assets/images/services/retina.png",
        heroTitle: "Retinal Repair",
        heroSubtitle: "Vitrectomy Surgery",
        heroTagline: "Restoring the eye's internal clarity.",
        overviewTitle: "Complex Retinal Care",
        overviewText: "Vitrectomy involves removing the vitreous gel to access and repair the retina.",
        longDesc: "Vitrectomy is a vital surgery for treating various conditions affecting the retina and vitreous. It is used for retinal detachments, macular holes, diabetic retinopathy complications, and removing vitreous floaters or hemorrhages. Our specialized surgeons use high-precision gauge instruments for minimally invasive entry and faster healing.",
        scopeTitle: "Conditions Treated",
        scopeImg: "/assets/images/services/retina.png",
        scopePoints: [
            { title: "Retinal Detachment", desc: "Urgent repair to save vision." },
            { title: "Macular Hole", desc: "Restoring central vision." },
            { title: "Vitreous Hemorrhage", desc: "Clearing blood from the eye." },
            { title: "Floaters", desc: "Removal of significant visual obstructions." }
        ],
        doctorRoleKeyword: "Retina",
        faqs: [
            { question: "What is the recovery position?", answer: "Depending on the gas or oil used, you may need to keep your head in a specific position (face-down) for a few days to help the retina heal." }
        ]
    },
    {
        id: "cornea-checkup",
        title: "Cornea Check-up",
        shortDesc: "Comprehensive examination of the cornea health and clarity.",
        img: "/assets/images/services/cornea-transplant.png",
        heroTitle: "Surface Health",
        heroSubtitle: "Cornea Check-up",
        heroTagline: "Ensuring the clarity of your eye's window.",
        overviewTitle: "Clear Vision Starts Here",
        overviewText: "The cornea is the clear front surface of the eye. Its health is vital for sharp vision.",
        longDesc: "A dedicated Cornea Check-up assesses the health of the anterior segment of your eye. We check for signs of dry eye, karateconus, infections, dystrophies, and contact lens related complications. Using advanced slit-lamp bio-microscopy and topography, we ensure your cornea remains clear and healthy.",
        scopeTitle: "Examination Areas",
        scopeImg: "/assets/images/services/cornea-transplant.png",
        scopePoints: [
            { title: "Slit Lamp Exam", desc: "Detailed microscopic view." },
            { title: "Topography", desc: "Mapping the corneal shape." },
            { title: "Dry Eye Assessment", desc: "Evaluating tear film stability." },
            { title: "Pachymetry", desc: "Measuring corneal thickness." }
        ],
        doctorRoleKeyword: "Cornea",
        faqs: [
            { question: "Does it hurt?", answer: "No, a cornea check-up is painless and non-invasive." }
        ]
    },
    {
        id: "vision-checkup",
        title: "Vision Check-up",
        shortDesc: "Routine eye exams to assess visual acuity and prescription needs.",
        img: "/assets/images/services/advanced-diagnostics.png",
        heroTitle: "See Clearly",
        heroSubtitle: "Comprehensive Vision Check",
        heroTagline: "Sharp vision for a better life.",
        overviewTitle: "Annual Vision Screening",
        overviewText: "Regular vision check-ups are essential to detect refractive errors and ensure you are seeing your best.",
        longDesc: "Our Vision Check-up is more than just reading a chart. We carefully evaluate your refractive status to diagnose nearsightedness (myopia), farsightedness (hyperopia), and astigmatism. We also screen for early signs of eye strain and computer vision syndrome, ensuring your prescription is perfectly tailored to your visual needs.",
        scopeTitle: "Check-up Includes",
        scopeImg: "/assets/images/services/advanced-diagnostics.png",
        scopePoints: [
            { title: "Refraction", desc: "Determining precise glass power." },
            { title: "Acuity Testing", desc: "Distance and near vision check." },
            { title: "Binocular Vision", desc: "Checking how eyes work together." },
            { title: "Health Screening", desc: "Quick look at general eye health." }
        ],
        doctorRoleKeyword: "Optometrist",
        faqs: [
            { question: "How often should I get my eyes checked?", answer: "We recommend a comprehensive eye exam every 1-2 years, or more frequently if you have existing conditions." }
        ]
    },
    {
        id: "glass-checkup",
        title: "Glass Check-up",
        shortDesc: "Verification and prescription of corrective spectacles.",
        img: "/assets/images/services/optical-shop.png",
        heroTitle: "Perfect Prescription",
        heroSubtitle: "Glass Check-up",
        heroTagline: "Precision optics for your lifestyle.",
        overviewTitle: "Accuracy You Can Trust",
        overviewText: "Is your current prescription up to date? We verify your glasses and update your power for maximum clarity.",
        longDesc: "A Glass Check-up focuses on determining the accurate power for your spectacles. Whether you need single vision lenses, bifocals, or progressive lenses, our optometry team ensures your prescription provides comfortable and distinct vision. We also check your current glasses for alignment and lens condition.",
        scopeTitle: "Optical Services",
        scopeImg: "/assets/images/services/optical-shop.png",
        scopePoints: [
            { title: "Power Check", desc: "Auto-refractometer & subjective testing." },
            { title: "Frame Alignment", desc: "Ensuring proper fit and focus." },
            { title: "Lens Advice", desc: "Guidance on anti-glare & blue cut options." },
            { title: "Progressive Fitting", desc: "Marking centers for multifocals." }
        ],
        doctorRoleKeyword: "Optometrist",
        faqs: [
            { question: "Can I use my old frames?", answer: "Yes, if they are in good condition, we can often fit new lenses into your existing frames." }
        ]
    },
    {
        id: "colour-vision-checkup",
        title: "Colour Vision Check-up",
        shortDesc: "Testing for color blindness and deficiency.",
        img: "/assets/images/services/neuro-ophthal.png",
        heroTitle: "Full Spectrum",
        heroSubtitle: "Colour Vision Testing",
        heroTagline: "Experience the world in true colors.",
        overviewTitle: "Detecting Color Deficiency",
        overviewText: "Color vision deficiency can affect career choices and daily life. We offer standardized testing.",
        longDesc: "Our Colour Vision Check-up utilizes Ishihara plates and other advanced contrast tests to identify different types of color blindness, such as red-green or blue-yellow deficiencies. This testing is crucial for school children, as well as for medical and clearance exams for various professions requiring perfect color discrimination.",
        scopeTitle: "Testing Methods",
        scopeImg: "/assets/images/services/neuro-ophthal.png",
        scopePoints: [
            { title: "Ishihara Test", desc: "Standard plates for red-green defects." },
            { title: "Farnsworth D-15", desc: "Arrangement test for severity." },
            { title: "Career Screening", desc: "Certification for pilots/drivers." },
            { title: "Genetic Advice", desc: "Understanding the inheritance pattern." }
        ],
        doctorRoleKeyword: "General",
        faqs: [
            { question: "Is there a cure for color blindness?", answer: "Currently, there is no cure for inherited color blindness, but special glasses may help some people distinguish colors better." }
        ]
    },
    {
        id: "retina-checkup",
        title: "Retina Check-up",
        shortDesc: "Detailed evaluation of the retina for diabetes, AMD, and holes.",
        img: "/assets/images/services/retina.png",
        heroTitle: "Retinal Health",
        heroSubtitle: "Retina Check-up",
        heroTagline: "Protecting the film of your eye.",
        overviewTitle: "Deep Eye Exam",
        overviewText: "The retina is crucial for vision. We check it thoroughly for any signs of disease or damage.",
        longDesc: "A Retina Check-up involves dilating your pupils to get a wide view of the back of your eye. We look for crucial conditions like Diabetic Retinopathy, Age-related Macular Degeneration (AMD), retinal tears, and vascular occlusions. Early detection of these conditions is often the only way to prevent permanent vision loss.",
        scopeTitle: "Exam Components",
        scopeImg: "/assets/images/services/retina.png",
        scopePoints: [
            { title: "Dilated Exam", desc: "Full view of the fundus." },
            { title: "OCT Scan", desc: "Cross-sectional retinal imaging." },
            { title: "Diabetic Screen", desc: "Checking for bleeds and swelling." },
            { title: "Peripheral Check", desc: "Looking for weak spots or tears." }
        ],
        doctorRoleKeyword: "Retina",
        faqs: [
            { question: "Why do I need drops?", answer: "Drops dilate the pupil, opening the window wide so we can see the entire retina, not just the center." }
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
            contact: { address: 'Sector 62, Noida, Uttar Pradesh 201301', phone: '+91 120 456 7890', email: 'info@romashka.in', workingHours: { weekdays: '8:00 AM - 8:00 PM', saturday: '9:00 AM - 5:00 PM', sunday: 'Closed' } },
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
                    { name: 'Glaucoma Surgery', href: '/services/glaucoma-surgery' },
                    { name: 'Retina Check-up', href: '/services/retina-checkup' },
                    { name: 'Vision Check-up', href: '/services/vision-checkup' },
                    { name: 'Pediatric Vision', href: '/services/pediatric-vision' }
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
