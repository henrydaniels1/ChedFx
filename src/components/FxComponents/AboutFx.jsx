import { motion } from 'framer-motion';
// import Squares from '../../example/Squares.jsx'

const AboutFx = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        staggerChildren: 0.3,
      },
    },
  };

  // const textVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  // };

  const headingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <motion.section
      className="about-me-section w-[97%] lg:w-[95%] mx-auto  relative bg-[#e6e5e5] py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="">
        {/* Animated Heading with Neon Effect */}
        <motion.h1
          className="text-5xl font-extrabold  mb-8 text-transparent z-50 bg-clip-text bg-gradient-to-r from-blue-500 to-blue-900 animate-pulse"
          variants={headingVariants}
        >
          About Me
        </motion.h1>
    {/* Text Section */}
        <div className="w-1/2">
          <p className="text-justify">
             Welcome! I&apos;m [Your Name], a passionate forex trader with [4 years] of experience in financial markets.
        Whether you&apos;re a beginner or an experienced trader,
        I&apos;m here to guide you towards financial independence with proven strategies and personalized support.
      
        I&apos;m excited to help you reach your financial goals. Let&apos;s master forex trading together!
          </p>

        

        </div>
      
   {/* <div className="absolute top-0 css-selector right-0 bottom-0 left-0 overflow-hidden">
           <Squares 
  speed={0.1} 
  size={40} //pixels
  direction='diagonal' // up, down, left, right, diagonal
  borderColor='#fff'
  hoverFillColor='#222'
/>
          </div> */}
      
       

      
      </div>

    </motion.section>
  );
};

export default AboutFx;
