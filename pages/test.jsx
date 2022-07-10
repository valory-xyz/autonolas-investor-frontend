import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import Head from 'next/head';
import { useCallback, useEffect, useReducer } from 'react';
// import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
// import { ellipseAddress, getChainData } from '../lib/utilities';

const INFURA_ID = 'a5184169a2dd4263b4c164a088353eec';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
      rpc: {
        31337: 'https://chain.staging.autonolas.tech/',
        // 1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
      },
    },
  },
};

let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  });
}

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}

export const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    provider, web3Provider, address, chainId,
  } = state;

  const connect = useCallback(async () => {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    try {
      const providerC = await web3Modal.connect();

      // We plug the initial `provider` into ethers.js and get back
      // a Web3Provider. This will add on methods from ethers.js and
      // event listeners such as `.on()` will be different.
      const web3Provider = new providers.Web3Provider(providerC);

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      const network = await web3Provider.getNetwork();

      dispatch({
        type: 'SET_WEB3_PROVIDER',
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    dispatch({
      type: 'RESET_WEB3_PROVIDER',
    });
  }, [provider]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }

    return () => {};
  }, [provider, disconnect]);

  // const chainData = getChainData(chainId);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        {address && (
          <div className="grid">
            <div>
              <p className="mb-1">Network:</p>
              {/* <p>{chainData?.name}</p> */}
            </div>
            <div>
              <p className="mb-1">Address:</p>
              <p>{address}</p>
            </div>
          </div>
        )}
      </header>

      <main>
        <h1 className="title">Web3Modal Example</h1>
        {web3Provider ? (
          <button className="button" type="button" onClick={disconnect}>
            Disconnect
          </button>
        ) : (
          <button className="button" type="button" onClick={connect}>
            Connect
          </button>
        )}
      </main>

      <style jsx>
        {`
          main {
            padding: 5rem 0;
            text-align: center;
          }

          p {
            margin-top: 0;
          }

          .container {
            padding: 2rem;
            margin: 0 auto;
            max-width: 1200px;
          }

          .grid {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
          }

          .button {
            padding: 1rem 1.5rem;
            background: ${web3Provider ? 'red' : 'green'};
            border: none;
            border-radius: 0.5rem;
            color: #fff;
            font-size: 1.2rem;
          }

          .mb-0 {
            margin-bottom: 0;
          }
          .mb-1 {
            margin-bottom: 0.25rem;
          }
        `}
      </style>

      <style jsx global>
        {`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
