import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../../style/Fxstyle.css';

    


const FxHeader = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: true, threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  return (
    <header className="relative fxheader flex items-center overflow-hidden pb-8" ref={ ref }>
    
     
      {/* pt-20 md:pt-6 */}
      <motion.div
        className=" mx-auto lg:w-[95%] w-[97%] "
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'} // Animation triggered by isInView
      >
       
        <div className="flex md:justify-between md:flex-row flex-col md:items-center ">
          {/* Text Section with animation */ }
          
          <motion.div className="w-full md:w-1/2 pt-20 md:pt-0 z-30" variants={textVariants}>
            <motion.div className="space-y-8  pt-8">
           
              <motion.h1
                className="text-4xl  customfont2 font-semibold text-white dark:text-white lg:text-6xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                Best place to Learn{' '}
                <motion.span
                  className="text-blue-500"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1.1 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                >
                  Trading
                </motion.span>
              </motion.h1>

           
              <motion.p
                className=" text-xl text-justify text-gray-400 dark:text-gray-400 md:text-lg lg:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {/* Unlock the secrets of forex trading with <br/>our comprehensive courses and expert guidance.<br/>
                Start your journey to financial freedom today! */}
                {/* Unlock the secrets of forex trading with our comprehensive courses and expert guidance. Start your
                journey to financial freedom today! Additionally, we offer a trading bot designed to help you automate
                your trading strategies and enhance your trading experience. */}
                Discover forex trading through our comprehensive courses and expert guidance.
                Begin your journey to financial freedom today, and take advantage of our trading bot to automate your trading strategies.
              </motion.p>
        <div>
          <button className="btn-6 z-2 px-4 py-2 rounded-2xl text-xl">Get Started</button>
        </div>
        
            </motion.div>
          
          </motion.div>

          {/* Image Section with animation */}
          <div className="md:flex rounded-lg md:items-center lg:justify-end w-full mt-8  md:w-1/2">
            <motion.div
              className="relative"
              variants={imageVariants}
            >
              <div className="w-full h-[18rem] lg:w-[35rem] object-cover md:h-[25rem] lg:h-[28rem]">
                <motion.img
                  className="h-full w-full object-cover object-center rounded-lg shadow-lg"
                  src="https://images.stockcake.com/public/e/6/b/e6b9e7f1-c203-4ab0-afb1-b19c2c0b36bf/global-financial-integration-stockcake.jpg"
                  alt="Trading Image"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>


      {/* Animated Gradient Background */}
      <div className="animated-gradient-background absolute top-0 right-0 bottom-0 left-0 z-[-1] overflow-hidden">
         <motion.img
          className="w-full css-selector h-full object-cover opacity-5"
          src="https://images.stockcake.com/public/e/6/b/e6b9e7f1-c203-4ab0-afb1-b19c2c0b36bf/global-financial-integration-stockcake.jpg"
          alt="Background"
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>
    </header>
  );
};

export default FxHeader;
