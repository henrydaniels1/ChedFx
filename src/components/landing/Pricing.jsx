/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../config/supabase';

const FALLBACK_RATE = import.meta.env.VITE_USD_TO_NGN ? Number(import.meta.env.VITE_USD_TO_NGN) : 1600;

const useLiveRate = () => {
  const [rate, setRate] = useState(FALLBACK_RATE);
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => d?.rates?.NGN && setRate(d.rates.NGN))
      .catch(() => {});
  }, []);
  return rate;
};

const inputCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#10B981] transition-colors placeholder-gray-500";

const PaymentModal = ({ plan, price, rate, defaultEmail, onConfirm, onClose }) => {
  const [form, setForm] = useState({ name: '', email: defaultEmail ?? '', phone: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('All fields are required.');
      return;
    }
    const phone = form.phone.startsWith('+') ? form.phone : `+234${form.phone.replace(/^0/, '')}`;
    onConfirm({ ...form, phone });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        >
          <h2 className="text-white font-bold text-lg mb-1">Complete Your Order</h2>
          <p className="text-gray-400 text-sm mb-5">
            {plan} — <span className="text-[#10B981]">₦{Math.round(price * rate).toLocaleString()}/mo</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} className={inputCls} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputCls} />
            <input name="phone" type="tel" placeholder="Phone (e.g. 08012345678 or +2348012345678)" value={form.phone} onChange={handleChange} className={inputCls} />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-600 text-gray-400 text-sm hover:border-gray-400 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#10B981] text-white text-sm font-semibold hover:bg-[#0ea572] transition-colors">
                Pay Now
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const pricingData = [
  {
    plan: "Basic Training",
    price: 29,
    features: [
      "Access to introductory forex courses",
      "3 Hours tutorial per week",
      "Community forum access",
    ],
    buttonLabel: "Enroll Now",
  },
  {
    plan: "Advanced Training",
    price: 49,
    features: [
      "Access to advanced forex strategies",
      "5 Hours tutorial per week",
      "Personalized trading plan"
    ],
    buttonLabel: "Get Advanced Access",
  },
  {
    plan: "Pro Mentorship",
    price: 99,
    features: [
      "One-on-one mentorship sessions",
      "10 Hours tutorial per week",
      "Lifetime access to course materials",
      "24/7 support via chat"
    ],
    buttonLabel: "Become a Pro Trader",
  }
];

const headingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const PricingCard = ({ pricingData }) => {
  const { plan, price, features, buttonLabel } = pricingData;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  const bgColor = plan === "Advanced Training" ? "bg-[#10B981]" : "bg-gray-800";
  const buttonColor = plan === "Basic Training" || plan === "Pro Mentorship" ? "bg-[#10B981] text-white" : "bg-white text-[#10B981]";

  const rate = useLiveRate();
  const txRef = useRef(`chedfx-${plan.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`);
  const customerInfoRef = useRef(null);

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: txRef.current,
    amount: Math.round(price * rate),
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: customerInfoRef.current?.email ?? '',
      name: customerInfoRef.current?.name ?? '',
      ...(customerInfoRef.current?.phone && { phone_number: customerInfoRef.current.phone }),
    },
    customizations: {
      title: `ChedFx - ${plan}`,
      description: `Payment for ${plan} plan`,
      logo: '/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);
  const handleFlutterPaymentRef = useRef(handleFlutterPayment);
  handleFlutterPaymentRef.current = handleFlutterPayment;

  const handleButtonClick = () => {
    if (!user) { navigate('/auth'); return; }
    setShowModal(true);
  };

  const handleConfirm = (info) => {
    customerInfoRef.current = info;
    setCustomerInfo(info);
    setShowModal(false);
  };

  useEffect(() => {
    if (!customerInfo) return;
    // Regenerate tx_ref for each new payment attempt
    txRef.current = `chedfx-${plan.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    handleFlutterPaymentRef.current({
      callback: async (response) => {
        closePaymentModal();
        if (response.status === 'successful') {
          const { error } = await supabase.from('payments').insert({
            user_id: user.id,
            plan,
            transaction_id: response.transaction_id,
            tx_ref: response.tx_ref,
            amount: response.amount,
            currency: response.currency,
            status: response.status,
          });
          if (error) console.error('Failed to save payment:', error);
          toast.success(`🎉 Payment successful! Welcome to ${plan}.`);
          navigate('/bot');
        } else {
          toast.error('Payment failed. Please try again.');
        }
      },
      onClose: () => { customerInfoRef.current = null; setCustomerInfo(null); },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInfo]);

  return (
    <>
      {showModal && (
        <PaymentModal
          plan={plan}
          price={price}
          rate={rate}
          defaultEmail={user?.email}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
      <Card className={`w-full rounded-xl shadow-2xl transition-transform ease-in duration-300 hover:scale-105 hover:shadow-lg p-6 sm:p-8 ${bgColor}`} variant="gradient">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 mb-4 rounded-none border-b border-white/10 shadow-2xl pb-8 text-center"
        >
          <Typography variant="small" color="white" className="font-normal uppercase">
            {plan}
          </Typography>
          <Typography variant="h1" color="white" className="mt-6 flex flex-wrap justify-center items-end gap-1 text-5xl sm:text-7xl font-normal text-white">
            <span className="mt-2 text-3xl sm:text-4xl">$</span>{price} <span className="self-end text-3xl sm:text-4xl">/mo</span>
          </Typography>
          <span className="block text-sm text-white/60 mt-2">≈ ₦{Math.round(price * rate).toLocaleString()}</span>
        </CardHeader>
        <CardBody className="p-0">
          <ul className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-4 text-white">
                <span className="rounded-full border border-white/20 bg-white/20 p-1">
                  <CheckIcon />
                </span>
                <Typography className="font-normal">{feature}</Typography>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="mt-12 p-0">
          <motion.div className="z-50 animate-pulse" variants={headingVariants}>
            <Button size="lg" color="white" className={`hover:scale-[1.02] py-3 focus:scale-[1.02] active:scale-100 ${buttonColor}`} ripple={false} fullWidth={true} onClick={handleButtonClick}>
              {buttonLabel}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </>
  );
};

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => { if (currentSectionRef) observer.unobserve(currentSectionRef); };
  }, []);

  return (
    <div className="w-[90%] mx-auto space-y-16" id='Card2'>
      <div className="reveal2">
        <p className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center">Pricing Plans</p>
      </div>
      <div ref={sectionRef} className="w-full mx-0">
        <div
          id="pricing"
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0 scale-100 rotate-0 blur-0' : 'opacity-0 translate-y-12 scale-90 rotate-3 blur-sm'
          }`}
        >
          {pricingData.map((data, index) => (
            <PricingCard key={index} pricingData={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
