import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Shield, 
  Activity, 
  User, 
  ArrowRight, 
  Menu, 
  X,
  Heart,
  Stethoscope,
  Hospital,
  Microscope,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { askHealthAssistant } from './services/gemini';
import Markdown from 'react-markdown';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Locations', href: '#facilities' },
    { name: 'Specialists', href: '#specialists' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Activity size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">MediCenter</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-slate-900 px-4 py-2 hover:text-emerald-600 transition-colors">
              Sign In
            </button>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md active:scale-95">
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-600 hover:text-emerald-600"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-emerald-600 text-white w-full py-4 rounded-xl font-bold mt-4">
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PersonalizedHealthForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    concern: '',
    urgency: 'routine'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-50 rounded-[40px] p-8 md:p-16 grid lg:grid-cols-2 gap-16 items-center border border-slate-100">
          <div>
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-6">Get a Personalized <br />Health Recommendation</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Tell us a little about yourself and your health concerns. Our system will match you with the right specialists and facilities tailored to your needs.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Shield className="text-emerald-600" />, title: "Secure & Private", desc: "Your data is encrypted and only shared with medical professionals." },
                { icon: <Clock className="text-blue-600" />, title: "Fast Response", desc: "Get matched with available specialists within minutes." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank you, {formData.name}!</h3>
                <p className="text-slate-500">We've received your information and are preparing your personalized health plan.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                    <input 
                      required
                      type="number" 
                      placeholder="25"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Health Concern</label>
                  <textarea 
                    required
                    placeholder="Describe your symptoms or health goal..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                    value={formData.concern}
                    onChange={e => setFormData({...formData, concern: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['routine', 'urgent', 'emergency'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, urgency: level})}
                        className={cn(
                          "py-2 rounded-lg text-xs font-bold capitalize border transition-all",
                          formData.urgency === level 
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-emerald-200"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Get My Recommendation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-emerald-50/50 rounded-l-[100px] hidden lg:block" />
      <div className="absolute top-20 left-10 -z-10 w-64 h-64 bg-emerald-200/20 blur-3xl rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={14} />
            Trusted Healthcare Partner
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
            Your Health, <br />
            <span className="text-emerald-600 italic">Our Priority.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Access world-class medical facilities and expert care from the comfort of your home. Find the best hospitals, clinics, and specialists near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group">
              Find a Facility
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Our Services
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/doc${i}/100/100`} 
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  alt="Doctor"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => <Activity key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-sm text-slate-500 font-medium">500+ Specialized Doctors</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://picsum.photos/seed/medical-hero/800/1000" 
              alt="Medical Facility" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Floating Stats */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Emergency Care</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-10 -right-6 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Safe & Secure</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Primary Care",
      desc: "Comprehensive health checkups and preventative care for all ages.",
      icon: <Stethoscope size={32} />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Specialized Surgery",
      desc: "Advanced surgical procedures performed by world-class specialists.",
      icon: <Activity size={32} />,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Diagnostics & Lab",
      desc: "State-of-the-art laboratory services for accurate and fast results.",
      icon: <Microscope size={32} />,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Emergency Care",
      desc: "Immediate medical attention available 24/7 for critical situations.",
      icon: <Hospital size={32} />,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Our Medical Services</h2>
          <p className="text-slate-600">We offer a wide range of medical services designed to meet the unique needs of every patient, ensuring the highest standards of care.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-50 transition-all"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", service.color)}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.desc}</p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:gap-3 transition-all">
                Learn More <ChevronRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HealthAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const text = await askHealthAssistant(query);
      setResponse(text || 'Sorry, I could not generate a response.');
    } catch (err) {
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <MessageSquare size={14} />
            AI Health Assistant
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Have a Health Question? <br />
            <span className="text-emerald-400">Ask MediBot.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Our AI-powered assistant is here to provide quick information about symptoms, services, and general wellness. 
          </p>
          
          <form onSubmit={handleAsk} className="relative max-w-md">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are common flu symptoms?"
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-emerald-500 text-slate-900 p-3 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              {loading ? <Activity className="animate-spin" size={20} /> : <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500 italic">
            * MediBot is an AI and should not replace professional medical advice.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[300px] backdrop-blur-sm">
            {response ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <Markdown>{response}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} />
                </div>
                <p>Your AI response will appear here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Facilities = () => {
  const facilities = [
    {
      name: "Central General Hospital",
      location: "Downtown Medical District",
      rating: 4.9,
      image: "https://picsum.photos/seed/hosp1/600/400",
      tags: ["Emergency", "Surgery", "Cardiology"]
    },
    {
      name: "Wellness Family Clinic",
      location: "Northside Suburbs",
      rating: 4.8,
      image: "https://picsum.photos/seed/hosp2/600/400",
      tags: ["Pediatrics", "Checkups", "Vaccination"]
    },
    {
      name: "Advanced Imaging Center",
      location: "East Wing Plaza",
      rating: 4.7,
      image: "https://picsum.photos/seed/hosp3/600/400",
      tags: ["MRI", "CT Scan", "X-Ray"]
    }
  ];

  return (
    <section id="facilities" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Top-Rated Facilities</h2>
            <p className="text-slate-600">Discover the best medical centers equipped with the latest technology and staffed by experienced professionals.</p>
          </div>
          <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Facilities <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {facilities.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={f.image} 
                  alt={f.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-slate-900 flex items-center gap-1 shadow-md">
                  <Activity size={14} className="text-emerald-500" />
                  {f.rating}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                  <MapPin size={14} />
                  {f.location}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {f.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full py-4 border border-slate-200 rounded-2xl font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Activity size={24} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">MediCenter</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Providing accessible, high-quality healthcare services and facilities for a healthier community.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
                  <Heart size={18} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Find a Doctor', 'Book Appointment', 'Services', 'Health Plans', 'About Us'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-500 text-sm hover:text-emerald-600 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service', 'Insurance'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-500 text-sm hover:text-emerald-600 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-500">
                <MapPin size={18} className="text-emerald-600 shrink-0" />
                123 Medical Plaza, Health District, <br />NY 10001, USA
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={18} className="text-emerald-600 shrink-0" />
                +1 (555) 000-1234
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Clock size={18} className="text-emerald-600 shrink-0" />
                24/7 Emergency Support
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2026 MediCenter. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 text-xs hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="text-slate-400 text-xs hover:text-emerald-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <PersonalizedHealthForm />
        <HealthAssistant />
        <Facilities />
        
        {/* Sign Up Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[40px] p-12 md:p-20 border border-slate-200 grid lg:grid-cols-2 gap-16 items-center shadow-sm">
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Join the MediCenter <br />Community Today
                </h2>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  Create an account to manage your appointments, access medical records securely, and receive personalized health tips from our experts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Shield className="text-emerald-600" size={18} /> Verified Doctors
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock className="text-emerald-600" size={18} /> 24/7 Support
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Activity className="text-emerald-600" size={18} /> Health Tracking
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Start your journey</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                      Create Free Account <ArrowRight size={20} />
                    </button>
                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <span className="relative bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-white border border-slate-200 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Google</button>
                      <button className="bg-white border border-slate-200 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Apple</button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400">
                  By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-200">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white blur-[100px] rounded-full" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Ready to Prioritize <br /> Your Health?
              </h2>
              <p className="text-emerald-50 text-lg mb-12 max-w-2xl mx-auto">
                Join thousands of patients who trust MediCenter for their healthcare needs. Book your first appointment today and experience world-class care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-xl">
                  Book an Appointment
                </button>
                <button className="bg-emerald-700 text-white border border-emerald-500/30 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-800 transition-all">
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
