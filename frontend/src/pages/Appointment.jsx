import { useState } from 'react';
import AppointmentModal from '../components/AppointmentModal';

export default function Appointment() {
    // We can reuse the modal style content here, or just trigger the modal.
    // For a dedicated page, it looks best if the form is embedded relative to the page.
    // However, existing AppointmentModal is designed as a fixed overlay.
    // To save time and maintain consistency, we will just render a "Open Booking Widget" 
    // or we can adjust AppointmentModal to be non-modal?
    // Let's create a page that basically encourages booking and opens the modal automatically or has a big button.

    // Actually, user might expect a form on the page.
    // For now, let's keep it simple: A nice page that says "Book Your Visit" and has the modal OPEN by default or embedded?
    // Embedding the modal logic might differ.
    // Let's create a wrapper that shows the modal always? No, AppointmentModal has "fixed inset-0".

    // Decision: Render a page with contact info and a big "Book Now" that triggers the global modal? 
    // Or replicate the form?
    // Since I refactored AppointmentModal to be a "Widget", maybe I can make it appear inline?
    // No, it has fixed positioning.

    // I will create a page that has the form *content* extracted? Too much duplication.
    // I will make the Appointment page have a "Book Now" section and Contact info.
    // Wait, "Book an Appointment" link in navbar usually goes to a form.
    // I will simply render the AppointmentModal *on top* of this page automatically?
    // Or I'll wrap the form in a simplified container if I had time to refactor.

    // Start with a clean page with contact details and a button to launch the widget.

    return (
        <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1 space-y-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Book an Appointment</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Ready to experience world-class eye care? Schedule your visit with our specialists today.
                        We typically reply within minutes to confirm your slot.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Contact Information</h3>
                    <div className="space-y-4 text-gray-600">
                        <p className="flex items-center gap-3">
                            <span className="font-semibold w-20">Support:</span>
                            +1 (800) 123-4567
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="font-semibold w-20">Email:</span>
                            care@visionary.com
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="font-semibold w-20">Address:</span>
                            123 Medical Plaza, New York, NY
                        </p>
                    </div>
                </div>

                <div className="bg-brand-blue/5 p-8 rounded-3xl border border-brand-blue/10">
                    <h3 className="text-xl font-bold text-brand-blue mb-2">Opening Hours</h3>
                    <div className="grid grid-cols-2 gap-4 text-gray-600 mt-4">
                        <div>
                            <p className="font-bold">Mon - Fri</p>
                            <p>08:00 AM - 08:00 PM</p>
                        </div>
                        <div>
                            <p className="font-bold">Saturday</p>
                            <p>09:00 AM - 05:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">Start Your Booking</h2>
                    <p className="text-gray-500 mb-8">Click below to open our secure booking wizard.</p>
                    {/* This button will be hooked up in App.jsx to open the modal */}
                    <button
                        id="trigger-appointment-modal"
                        className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:bg-brand-dark transition-all w-full max-w-xs"
                    >
                        Open Booking Form
                    </button>
                </div>
            </div>
        </main>
    );
}
