import { useEffect } from 'react';
import DerivAPIBasic from 'https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic';

const app_id = 40217945; // Replace with your app_id or leave as 1089 for testing.
let connection; // Initialize connection as undefined

//  m3GmEcQwg6xXi5o 5627574 1089

const initializeWebSocketConnection = () => {
  if (!connection || connection.readyState === WebSocket.CLOSED) {
    connection = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);
  }
  return connection;
};

const api = new DerivAPIBasic({ connection: initializeWebSocketConnection() });

// Tick history request setup
const ticks_history_request = {
  ticks_history: 'R_50',
  adjust_start_time: 1,
  count: 10,
  end: 'latest',
  start: 1,
  style: 'ticks',
};

const ticks_request = {
  ...ticks_history_request,
  subscribe: 1,
};

// Proposal request setup
const proposal_request = {
  proposal: 1,
  subscribe: 1,
  amount: 10,
  basis: 'payout',
  contract_type: 'CALL',
  currency: 'USD',
  duration: 1,
  duration_unit: 'm',
  symbol: 'R_100',
  barrier: '+0.1',
};

// Tick subscriber function
const tickSubscriber = () => api.subscribe(ticks_request);

// Tick history response handler
const ticksHistoryResponse = async (res) => {
  const data = JSON.parse(res.data);
  if (data.error !== undefined) {
    console.log('Error : ', data.error.message);
    connection.removeEventListener('message', ticksHistoryResponse, false);
    await api.disconnect();
  }
  if (data.msg_type === 'history') {
    console.log(data.history);
  }
  connection.removeEventListener('message', ticksHistoryResponse, false);
};

// Tick response handler
const tickResponse = async (res) => {
  const data = JSON.parse(res.data);
  if (data.error !== undefined) {
    console.log('Error: ', data.error.message);
    connection.removeEventListener('message', tickResponse);
    await api.disconnect();
  }
  if (data.msg_type === 'tick') {
    console.log(data.tick);
  }
};

// Contracts for a symbol request
const contracts_for_symbol_request = {
  contracts_for: 'R_50',
  currency: 'USD',
  landing_company: 'svg',
  product_type: 'basic',
};

// Contracts for symbol response handler
const contractsForSymbolResponse = async (res) => {
  const data = JSON.parse(res.data);
  if (data.error !== undefined) {
    console.log('Error : ', data.error?.message);
    connection.removeEventListener('message', contractsForSymbolResponse, false);
    await api.disconnect();
  }
  if (data.msg_type === 'contracts_for') {
    console.log(data.contracts_for);
  }
  connection.removeEventListener('message', contractsForSymbolResponse, false);
};

// Proposal response handler
const proposalResponse = async (res) => {
  const data = JSON.parse(res.data);
  if (data.error !== undefined) {
    console.log('Error: ', data.error.message);
    connection.removeEventListener('message', proposalResponse, false);
    await api.disconnect();
  } else if (data.msg_type === 'proposal') {
    console.log('Details: ', data.proposal.longcode);
    console.log('Ask Price: ', data.proposal.display_value);
    console.log('Payout: ', data.proposal.payout);
    console.log('Spot: ', data.proposal.spot);
  }
};

// Function to request contracts for a symbol
const getContractsForSymbol = async () => {
  connection.addEventListener('message', contractsForSymbolResponse);
  await api.contractsFor(contracts_for_symbol_request);
};

// Function to get the proposal
const getProposal = async () => {
  connection.addEventListener('message', proposalResponse);
  await api.proposal(proposal_request);
};

// Function to unsubscribe from the proposal stream
const unsubscribeProposal = () => {
  if (connection) {
    connection.removeEventListener('message', proposalResponse, false);
  }
};

const TickSubscriber = () => {
  useEffect(() => {
    const connection = initializeWebSocketConnection();

    // Subscribe to live ticks
    const subscribeTicks = async () => {
      await tickSubscriber();
      connection.addEventListener('message', tickResponse);
    };

    // Unsubscribe from live ticks
    const unsubscribeTicks = () => {
      if (connection) {
        connection.removeEventListener('message', tickResponse);
        tickSubscriber().unsubscribe();
      }
    };

    // Fetch historical ticks
    const getTicksHistory = async () => {
      connection.addEventListener('message', ticksHistoryResponse);
      await api.ticksHistory(ticks_history_request);
    };

    // Fetch contracts for a symbol
    const getSymbolContracts = async () => {
      await getContractsForSymbol();
    };

    const ticksButton = document.getElementById('ticks');
    const unsubscribeTicksButton = document.getElementById('ticks-unsubscribe');
    const ticksHistoryButton = document.getElementById('ticks-history');
    const symbolButton = document.getElementById('contractsForSymbol');
    const proposalButton = document.getElementById('proposal');
    const unsubscribeProposalButton = document.getElementById('proposal-unsubscribe');

    ticksButton.addEventListener('click', subscribeTicks);
    unsubscribeTicksButton.addEventListener('click', unsubscribeTicks);
    ticksHistoryButton.addEventListener('click', getTicksHistory);
    symbolButton.addEventListener('click', getSymbolContracts);
    proposalButton.addEventListener('click', getProposal);
    unsubscribeProposalButton.addEventListener('click', unsubscribeProposal);

    return () => {
      if (connection) {
        ticksButton.removeEventListener('click', subscribeTicks);
        unsubscribeTicksButton.removeEventListener('click', unsubscribeTicks);
        ticksHistoryButton.removeEventListener('click', getTicksHistory);
        symbolButton.removeEventListener('click', getSymbolContracts);
        proposalButton.removeEventListener('click', getProposal);
        unsubscribeProposalButton.removeEventListener('click', unsubscribeProposal);
        unsubscribeTicks(); // Cleanup
      }
    };
  }, []); // Empty dependency array to run effect only on mount

  return (
    <>
      <div className="space-x-6">
      <button id="ticks" className="bg-red-400 py-2 px-4 rounded-2xl hover:scale-105">Subscribe Ticks</button>
      <button id="ticks-unsubscribe" className="bg-gray-400 py-2 px-4 rounded-2xl hover:scale-105">Unsubscribe Ticks</button>
      <button id="ticks-history" className="bg-green-400 py-2 px-4 rounded-2xl hover:scale-105">Get Ticks History</button>
      <button id="contractsForSymbol" className="bg-blue-400 py-2 px-4 rounded-2xl hover:scale-105">Get Contracts For Symbol</button>
      <button id="proposal" className="bg-yellow-400 py-2 px-4 rounded-2xl hover:scale-105">Get Proposal</button>
        <button id="proposal-unsubscribe" className="bg-purple-400 py-2 px-4 rounded-2xl hover:scale-105">Unsubscribe Proposal</button>
      </div>
    </>
  );
};

export default TickSubscriber;
