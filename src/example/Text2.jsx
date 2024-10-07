import { useEffect, useRef } from 'react';

const Text2 = () => {
  const atItemRef = useRef(null);

  useEffect(() => {
    const element = atItemRef.current;

    const animateElement = () => {
      element.animate(
        [
          {
            offset: 0,
            transform: 'rotateY(100deg)',
            transformOrigin: 'left',
            opacity: 0,
          },
          {
            offset: 1,
            transform: 'rotateY(0)',
            transformOrigin: 'left',
            opacity: 1,
          },
        ],
        {
          duration: 1000,
          easing: 'linear',
          delay: 0,
          iterations: 1,
          direction: 'normal',
          fill: 'none',
        }
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElement();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
      <div
          className='flex text-center justify-center'>
      <div
              ref={ atItemRef }
              className="text-4xl z-90 customfont2 font-semibold text-white dark:text-white lg:text-6xl"
          >Best place to Learn{ ' ' } <span className="text-blue-500">Trading</span></div>
    </div>
  );
};

export default Text2;
