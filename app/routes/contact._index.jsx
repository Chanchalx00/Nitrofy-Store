import React, {useState} from 'react';
import {Mail, MapPin} from 'lucide-react';

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState('idle');
  const [inquiryType, setInquiryType] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      // Handle form submission here
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair md:text-3xl text-white mb-6 text-2xl">
              Connect With Us
            </h1>
            <p className="font-source text-lg md:text-xl text-brand-cream max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et eaque
              nisi non sed suscipit quos ad sequi vitae architecto libero,
              reiciendis at vero voluptatibus nesciunt dolore placeat aut facere
              blanditiis!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 px-4 bg-brand-cream">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white">
              <MapPin className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Visit Us
              </h3>
              <p className="font-source text-brand-navy/70">
                470226 Deori <br />
                Sagar District <br />
                Madhya Pradesh
              </p>
            </div>
            <div className="text-center p-8 bg-white">
              <MapPin className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Atelier Hours
              </h3>
              <p className="font-source text-brand-navy/70">
                Monday - Friday
                <br />
                10:00 AM - 6:00 PM EST
                <br />
                Call any time
              </p>
            </div>
            <div className="text-center p-8 bg-white">
              <Mail className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Contact
              </h3>
              <p className="font-source text-brand-navy/70">
                chanchal@gmail.com
                <br />
                +1 (888) 123-4567
                <br />
                Response within 24 Hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto container">
          <div className="max-w-2xl mx-auto">
            {/* Form title */}
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl text-brand-navy mb-2">
                Get in Touch
              </h2>
              <p className="font-source text-brand-navy/70">
                We look forward to discussing how we can serve you
              </p>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry type */}
              <div className="grid grid-cols-2 gap-0">
                <button
                  type="button"
                  onClick={() => setInquiryType('general')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'general'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  General Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('bespoke')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'bespoke'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  Bespoke Services
                </button>
              </div>

              {/* Form fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-source text-sm text-[#1A2A3A]/70 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                  />
                </div>
                <div>
                  <label className="block font-source text-sm text-[#1A2A3A]/70 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                  />
                </div>
              </div>

              <div>
                <label className="block font-source text-sm text-[#1A2A3A]/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                />
              </div>

              <div>
                <label className="block font-source text-sm text-[#1A2A3A]/70 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                />
              </div>

              <div>
                <label className="block font-source text-sm text-[#1A2A3A]/70 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                ></textarea>
              </div>

              <button
                disabled={formStatus === 'submitting'}
                type="submit"
                className="w-full bg-brand-navy text-white py-4 font-source tracking-wide hover:bg-brand-navyLight transition-colors disabled:bg-brand-navy/50"
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <div className="text-brand-navy/70 text-center font-source">
                  Thank you
                </div>
              )}
              {formStatus === 'error' && (
                <div className="text-red-600/70 text-center font-source">
                  There was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Bespoke Services Note */}
      <section className="py-16 px-4 bg-brand-cream">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-playfair text-2xl md:text-3xl text-brand-navy mb-4">
              Bespoke Services
            </h3>
            <p className="font-source text-brand-navy/70">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              sed repudiandae sequi eum doloremque distinctio molestias
              exercitationem quas, pariatur tempore aperiam magnam ex quos,
              nisi, voluptatibus quidem! Consequuntur, aut accusantium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
