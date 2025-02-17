import { useState } from 'react';
// import Background from '../../assets/Back.svg'

const PositionSizeCalculator = () => {
  // Define state variables for user input
  const [lotSize, setLotSize] = useState(0.05); // default to 0.5 lot size
  const [pointValue, setPointValue] = useState(10); // default to VL75 point value
  const [pipValue, setPipValue] = useState(0.005); // calculated pip value
  const [accountBalance, setAccountBalance] = useState(''); // no default account balance
  const [profitOrLoss, setProfitOrLoss] = useState(0); // profit or loss from the trade

  const contractSize = 1; // Fixed contract size at 1

  // Handle pip calculation
  const calculatePip = () => {
    const pip = pointValue * contractSize * lotSize;
    setPipValue(pip);
  };

  // Handle balance calculation based on win or loss
  const calculateProfitOrLoss = (isWin) => {
    const pipValueUSD = pipValue; // Pip value in USD
    const profitOrLoss = pipValueUSD * 1; // Assuming 100 pips as an example

    const newProfitOrLoss = isWin ? profitOrLoss : -profitOrLoss;
    setProfitOrLoss(newProfitOrLoss);

    // Update account balance based on the win/loss
    const updatedBalance = parseFloat(accountBalance) + newProfitOrLoss;
    setAccountBalance(updatedBalance);
  };

  return (
    <div className=' flex relative flex-col reveal3 items-center justify-center p-6 rounded-2xl bg-gray-900 md:w-[80%] w-full mx-auto'>
      {/* <div className='absolute h-full w-full z-[-1]'><img src={Background}></img></div> */}
      {/* <h1 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-6">Pip to Dollar Converter</h1> */}

      <div className=' bg-gray-400  bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 shadow-lg rounded-lg p-4 w-full'>
        {/* Account Balance Input */}
        <div className='mb-4'>
          <label className='block text-white font-bold mb-2'>
            Account Balance
          </label>
          <input
            type='number'
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            step='0.01'
          />
        </div>

        {/* Lot Size Input */}
        <div className='mb-4'>
          <label className='block text-white font-bold mb-2'>Lot Size</label>
          <input
            type='number'
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value))}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            step='0.01'
          />
        </div>

        {/* Point Value Input */}
        <div className='mb-4'>
          <label className='block text-white font-bold mb-2'>
            Point Value (pip size)
          </label>
          <input
            type='number'
            value={pointValue}
            onChange={(e) => setPointValue(parseFloat(e.target.value))}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            step='0.0001'
          />
        </div>

        <button
          onClick={calculatePip}
          className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600'>
          Calculate Pip Value
        </button>

        <div className='mt-6'>
          <h2 className='text-xl font-semibold text-white'>
            Pip Value in USD:
          </h2>
          <p className='text-2xl font-bold text-green-600 mt-2'>
            ${pipValue.toFixed(4)}
          </p>
        </div>

        {/* Buttons for Win or Loss Calculation */}
        <div className='flex justify-between mt-6'>
          <button
            onClick={() => calculateProfitOrLoss(true)}
            className='w-1/2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 mr-2'>
            Win Trade
          </button>
          <button
            onClick={() => calculateProfitOrLoss(false)}
            className='w-1/2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600'>
            Lose Trade
          </button>
        </div>

        <div>
          
        </div>
        {/* Display profit/loss */}
        <div className='mt-6'>
          <h2 className='text-xl font-semibold text-white'>Profit/Loss:</h2>
          <p
            className={`text-2xl font-bold mt-2 ${
              profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            ${profitOrLoss.toFixed(2)}
          </p>
        </div>

        {/* Display updated account balance */}
        <div className='mt-6'>
          <h2 className='text-xl font-semibold text-white'>
            Updated Account Balance:
          </h2>
          <p className='text-2xl font-bold text-blue-600 mt-2'>
            ${accountBalance ? parseFloat(accountBalance).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  )
};

export default PositionSizeCalculator;
