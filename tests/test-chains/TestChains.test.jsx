/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import {
  BUOLAS,
  GOVERNOR,
  OLAS,
  TIMELOCK,
  VEOLAS,
  WVEOLAS,
} from 'common-util/AbiAndAddresses';

const localArtifacts = [BUOLAS, GOVERNOR, OLAS, TIMELOCK, VEOLAS, WVEOLAS];

// Registries repository
const registriesRepo = 'https://raw.githubusercontent.com/valory-xyz/autonolas-governance/main/';

describe('test-chains/TestChains.jsx', () => {
  it(
    'check contract addresses and ABIs',
    async () => {
      expect.hasAssertions();

      // Fetch the actual config
      let response = await fetch(`${registriesRepo}docs/configuration.json`);
      const parsedConfig = await response.json();

      // Loop over chains
      const numChains = parsedConfig.length;
      for (let i = 0; i < numChains; i += 1) {
        const { contracts } = parsedConfig[i];
        // Traverse all tup-to-date configuration contracts
        for (let j = 0; j < contracts.length; j += 1) {
          // Go over local artifacts
          for (let k = 0; k < localArtifacts.length; k += 1) {
            // Take the configuration and local contract names that match
            if (contracts[j].name === localArtifacts[k].contractName) {
              // Get local and configuration ABIs, stringify them
              const localABI = JSON.stringify(localArtifacts[k].abi);

              // Get up-to-date remote contract artifact and its ABI
              response = await fetch(registriesRepo + contracts[j].artifact);
              const remoteArtifact = await response.json();

              // Stringify the remote ABI and compare with the local one
              const remoteABI = JSON.stringify(remoteArtifact.abi);
              expect(localABI).toBe(remoteABI);

              // Check the address
              const localAddress = localArtifacts[k].addresses[parsedConfig[i].chainId];
              expect(localAddress).toBe(contracts[j].address);
            }
          }
        }
      }
    },
    2 * 60 * 1000,
  );
});
