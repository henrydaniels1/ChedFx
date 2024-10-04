/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { motion } from 'framer-motion';



// JSON data for pricing plans
// JSON data for forex tutorial pricing plans
const pricingData = [
  {
    plan: "Basic Training",
    price: 29,
    features: [
      "Access to introductory forex courses",
      "3 video tutorials per week",
      "Community forum access",
      "1 month of email support"
    ],
    buttonLabel: "Enroll Now",
  },
  {
    plan: "Advanced Training",
    price: 49,
    features: [
      "Access to advanced forex strategies",
      "5 video tutorials per week",
      "Live Q&A sessions",
      "2 months of email support",
      "Personalized trading plan"
    ],
    buttonLabel: "Get Advanced Access",
  },
  {
    plan: "Pro Mentorship",
    price: 99,
    features: [
      "One-on-one mentorship sessions",
      "Custom trading strategies",
      "Unlimited video tutorials",
      "Lifetime access to course materials",
      "24/7 support via chat"
    ],
    buttonLabel: "Become a Pro Trader",
  }
];

// Blinking Button
 const headingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

// CheckIcon component
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-3 w-3"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// PricingCard component
const PricingCard = ({ pricingData }) => {
  const { plan, price, features, buttonLabel } = pricingData;

  // Set a dynamic background color based on the plan
    const bgColor = plan === "Advanced Training" ? "bg-[#10B981]" : "bg-gray-800";
  const buttonColor = plan === "Basic Training" || plan === "Pro Mentorship" ? "bg-[#10B981] text-white" : "bg-white text-[#10B981]"; // Green for Basic and Pro, gray for others  // Green for Premium, gray for others

  return (
    <Card className={`w-full md:w-[20rem] rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-lg p-8 ${bgColor}`} variant="gradient">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 mb-4 rounded-none border-b border-white/10 shadow-2xl pb-8 text-center"
      >
        <Typography variant="small" color="white" className="font-normal uppercase">
          {plan}
        </Typography>
        <Typography variant="h1" color="white" className="mt-6 flex justify-center gap-1 text-7xl font-normal text-white">
          <span className="mt-2 text-4xl">$</span>{price} <span className="self-end text-4xl">/mo</span>
        </Typography>
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
         <motion.h1
          className="z-50 bg-clip-text bg-gradient-to-r animate-pulse"
          variants={headingVariants}
        >
           <Button size="lg" color="white"className={`hover:scale-[1.02] py-3 focus:scale-[1.02] active:scale-100 ${buttonColor}`}ripple={false} fullWidth={true}>
          { buttonLabel }
          </Button>
        </motion.h1>
       
      </CardFooter>
    </Card>
  );
};


// Pricing component
const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <div className="w-[90%] lg:w-[95%] mx-auto space-y-16 " id='Card2'>
      <div className="reveal2">
        <p className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center">Pricing Plans</p>
      </div>

      <div ref={sectionRef} className="w-full mx-0 ">
        <div
          id="pricing"
          className={`flex flex-col  md:flex-row gap-8 justify-between transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0 scale-100 rotate-0 blur-0' : 'opacity-0 translate-y-12 scale-90 rotate-3 blur-sm'
            }` }
          // grid lg:grid-cols-3 sm:grid-cols-1 md:gap-16 md:grid-cols-2 lg:gap-24 gap-16 
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
