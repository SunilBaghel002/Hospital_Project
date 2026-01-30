
export const servicesData = [
  {
    id: "cataract-surgery",
    title: "Cataract Surgery",
    shortDesc: "Advanced cataract removal including Phoco and Sics methods.",
    typeDesc: "Type of two method: Phoco and Sics", // Helping with specific user text if they want to display it
    img: "/assets/images/services/cataract-surgery.png",

    // Header
    heroTitle: "Restore Your Vision",
    heroSubtitle: "Phoco & Sics Methods",
    heroTagline: "Expert care for clear vision.",

    // Overview
    overviewTitle: "Advanced Cataract Solutions",
    overviewText: "We offer both Phacoemulsification (Phoco) and Small Incision Cataract Surgery (Sics) to treat cataracts effectively.",

    // Deep Dive Text
    longDesc: "Cataract surgery is a safe and effective procedure to restore vision. We specialize in two primary methods: Phacoemulsification (Phoco), a modern technique using ultrasound to break up the cataract with a minimal incision, and Small Incision Cataract Surgery (Sics), a trusted manual technique ideal for advanced cataracts. Our team ensures the best method is chosen for your specific eye health and lifestyle needs.",

    // Scope of Services
    scopeTitle: "Our Techniques",
    scopeImg: "/assets/images/services/cataract-surgery.png",
    scopePoints: [
      { title: "Phoco Method", desc: "Ultrasound phacoemulsification for quick recovery." },
      { title: "Sics Method", desc: "Small incision surgery for mature cataracts." },
      { title: "IOL Implantation", desc: "Premium lens options for best visual outcome." },
      { title: "Post-Op Care", desc: "Comprehensive follow-up to ensure healing." }
    ],

    // Doctor Matching
    doctorRoleKeyword: "Cataract"
  },
  {
    id: "pterygium-surgery",
    title: "Pterygium Surgery",
    shortDesc: "Specialized removal using the Autografting method for low recurrence.",
    img: "/assets/images/services/cornea-transplant.png", // Reusing cornea image as it is surface related

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

    doctorRoleKeyword: "Cornea"
  },
  {
    id: "dcr-surgery",
    title: "DCR Surgery",
    shortDesc: "Dacryocystorhinostomy (DCR) surgery to treat blocked tear ducts.",
    img: "/assets/images/services/oculoplastics.png", // Reusing oculoplastics image

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

    doctorRoleKeyword: "Oculoplastic"
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

    doctorRoleKeyword: "Glaucoma"
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

    doctorRoleKeyword: "Retina"
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

    doctorRoleKeyword: "Cornea"
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

    doctorRoleKeyword: "Optometrist"
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

    doctorRoleKeyword: "Optometrist"
  },
  {
    id: "colour-vision-checkup",
    title: "Colour Vision Check-up",
    shortDesc: "Testing for color blindness and deficiency.",
    img: "/assets/images/services/neuro-ophthal.png", // Using neuro image as fallback

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

    doctorRoleKeyword: "General"
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

    doctorRoleKeyword: "Retina"
  }
];
