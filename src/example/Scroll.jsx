import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';


// npm install scrollreveal

const ExampleComponent = () => {
  useEffect(() => {
    // Apply ScrollReveal to the desired elements
    ScrollReveal().reveal('.reveal', {
      duration: 1000,
      distance: '100px',
      easing: 'ease-in-out',
      origin: 'right',
      reset: true, // This allows the animation to trigger every time the component is visible
    });
  }, [] );
  
   useEffect(() => {
    // Apply ScrollReveal to the desired elements
    ScrollReveal().reveal('.reveal2', {
      duration: 1200,
      distance: '70px',
      easing: 'ease-in-out',
      origin: 'left',
      reset: true, // This allows the animation to trigger every time the component is visible
    });
  }, []);
   useEffect(() => {
    // Apply ScrollReveal to the desired elements
    ScrollReveal().reveal('.reveal3', {
      duration: 1200,
      distance: '70px',
      easing: 'ease-in-out',
      origin: 'right',
      reset: true, // This allows the animation to trigger every time the component is visible
    });
  }, []);

  return (
    <div>
     {/* <div className="reveal">
        <p className="lg:text-4xl text-3xl  font-bold text-teal-900 text-center">Latest Work</p>
      </div> */}
    </div>
  );
};

export default ExampleComponent;
