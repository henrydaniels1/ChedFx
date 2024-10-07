import '../style/Fxstyle.css';
import { useEffect, useRef } from 'react';

const Text = () => {
  const atItemRef = useRef(null);

  useEffect(() => {
    const element = atItemRef.current;

    const animateElement = () => {
      element.animate([
        {
          letterSpacing: "1em",
          filter: "blur(12px)",
          opacity: 0,
          offset: 0
        },
        {
          filter: "blur(0)",
          opacity: 1,
          offset: 1
        }
      ], {
        duration: 2200,
        easing: 'ease',
        delay: 0,
        iterations: 1,
        direction: 'normal',
        fill: 'none'
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateElement();
          }
        });
      },
      { threshold: 0.5 } // Threshold can be adjusted (e.g., 0.5 means half of the element must be visible)
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
    <div className="at-container">
      <div ref={atItemRef} className="at-item">Animation</div>
    </div>
  );
};

export default Text;
