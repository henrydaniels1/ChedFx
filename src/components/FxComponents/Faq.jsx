/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../../style/Fxstyle.css';
// import net from '../../assets/faq1.svg'



const Item = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-medium">{title}</p>
        <div className="flex items-center justify-center w-8 h-8 border rounded-full">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 text-gray-600 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-gray-700">{children}</p>
        </div>
      )}
    </div>
  );
};

export const Faq = () => {
  return (
    <div className="w-[97%] lg:w-[95%] mx-auto  shadow-2xl" id="faq">
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl py-16">
        <div className="flex flex-col mb-8 sm:text-center">
          <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl relative">

            <div className="reveal3 absolute w-20 h-20 top-[-1rem] left-[2rem]">
              <img src="https://static.shuffle.dev/components/preview/88e9307f-3fef-4ff5-a095-3ea7d814a416/assets/public/flex-ui-assets/elements/circle3-yellow.svg" /></div>

            <h2 className="max-w-lg mb-3 md:text-4xl lg:text-5xl text-3xl  text-center font-bold reveal1 leading-none tracking-tight text-gray-900 md:mx-auto">
             
               
                <span className="relative">FAQ</span>
           {' '}
              (Frequently Asked Questions)
            </h2>
          </div>
        </div>
        <div className="space-y-4 px-2 md:px-0">
          <div className="hover:bg-teal-50 rounded reveal2">
            <Item title="What is Forex Trading?">
              Forex trading, or foreign exchange trading,
              involves buying and selling currencies in the global marketplace.
              It operates on the principle of currency pairs, where one currency is exchanged for another.
            </Item>
          </div>
          <div className="hover:bg-teal-50 rounded reveal3">
            <Item title="How do I get started with Forex Trading?">
              <ul className="list-disc pl-5 space-y-2">
                <li>Choose a reliable forex broker.</li>
                <li>Open a trading account.</li>
                <li>Fund your account with capital.</li>
                <li>Use a trading platform to execute trades.</li>
              </ul>
            </Item>
          </div>
          <div className="hover:bg-teal-50 rounded reveal2">
            <Item title="What is a Forex Broker?">
              A forex broker is a company that provides traders access to a
              trading platform for buying and selling foreign currencies.
              They act as intermediaries between traders and the interbank system.
            </Item>
          </div>
          <div className="hover:bg-teal-50 rounded reveal2">
            <Item title="What is a Trading Bots?">
              Trading bots are automated software programs that execute trades on behalf
              of users in financial markets. They use algorithms to analyze market data,
              identify trading opportunities, and execute buy or sell orders based on predefined criteria.
            </Item>
          </div>
          <div className="hover:bg-teal-50 rounded reveal3">
            <Item title="What are Pips and Lots in Forex?">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pips:</strong> A pip is the smallest price movement in a currency pair, typically the fourth decimal place (0.0001). It indicates a change in value between two currencies.
                </li>
                <li>
                  <strong>Lots:</strong> A lot refers to the size of a trade. Standard lots are 100,000 units of currency, mini lots are 10,000 units, and micro lots are 1,000 units.
                </li>
              </ul>
            </Item>
          </div>
        </div>
      </div>
    </div>
  );
};
