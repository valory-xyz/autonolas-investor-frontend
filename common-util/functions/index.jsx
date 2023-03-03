import { ethers } from 'ethers';
import { notification } from 'antd/lib';
import { isNil, isString } from 'lodash';
import { COLOR } from 'util/theme';
import { NA } from 'common-util/constants';

/**
 * https://docs.ethers.org/v5/api/utils/constants/#constants-MaxUint256
 */
export const MAX_AMOUNT = ethers.constants.MaxUint256;

export const getBalance = (account, p) => new Promise((resolve, reject) => {
  p.eth
    .getBalance(account)
    .then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      resolve(balanceInEth);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 *
 * @param {BigNumebr} value value to be converted to Eth
 * @param {Number} dv Default value to be returned
 * @returns {String} with 2 decimal places
 */
export const formatToEth = (value, dv = 0) => {
  if (isNil(value)) return dv || 0;
  return (+ethers.utils.formatEther(value)).toFixed(2);
};

/**
 * Same as `formatToEth` but doesn't fixes the decimal to 8
 * @returns {String} eg: 1000000000000000000 => 1
 */
export const parseToEth = (amount) => (amount ? ethers.utils.formatEther(`${amount}`) : 0);

/**
 * multiplies the amount by 10^18
 */
export const parseToWei = (amount) => ethers.utils.parseUnits(`${amount}`, 18).toString();

/**
 * parse eth to wei
 * example 1 => 1000000000000000000
 */
export const parseEther = (n) => ethers.utils.parseEther(`${n}`);

export const getBlockTimestamp = async (block = 'latest') => {
  const temp = await window?.WEB3_PROVIDER.eth.getBlock(block);
  return temp.timestamp * 1;
};

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
  style: { border: `1px solid ${COLOR.PRIMARY}` },
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
  style: { border: `1px solid ${COLOR.PRIMARY}` },
});

/**
 * Converts a number to a compact format
 * @param {Number} x
 * @returns {String} eg: 1000000 => 1M, 12345.67 => 12.35K
 */
export const getFormattedNumber = (x) => {
  if (isNil(x)) return '0';

  // if < 9999 then show 2 decimal places with comma
  // if (x < 9999) return x.toLocaleString('en', { maximumFractionDigits: 2 });

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(x);
};

/**
 * Converts a number to a comma separated format
 * @param {Number} x
 * @returns {String} eg: 1000000 => 1,000,000, 12345.67 => 12,345.67
 */
export const getCommaSeparatedNumber = (x) => {
  if (isNil(x) || Number(x) === 0) return '0.0';

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
  }).format(x);
};

/**
 * converts to percentage and returns a string with 2 decimal places
 */
export const getTotalVotesPercentage = (votes, totalSupply) => {
  if (votes && totalSupply) {
    const votesInEth = Number(parseToEth(votes));
    const totalSupplyInEth = Number(parseToEth(totalSupply));

    console.log({
      votesInEth,
      totalSupplyInEth,
    });

    const votingPowerInPercentage = (
      (votesInEth / totalSupplyInEth)
      * 100
    ).toFixed(2);

    return getFormattedNumber(votingPowerInPercentage);
  }

  return null;
};

/**
 * Get formatted date from milliseconds
 * example, 1678320000000 => Mar 09 '23
 */
export const getFormattedDate = (ms) => {
  console.log(ms);
  if (!ms) return NA;

  // eg: Feb 23, 2023;
  const dateInString = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(ms);

  // eg: 2023 converted to 23
  const yearInShortForm = dateInString.split(', ')[1].trim().substring(2, 4);

  // eg: Feb 05 '23
  return `${dateInString.split(', ')[0]} '${yearInShortForm}`;
};

export const getString = (x) => {
  if (isNil(x)) return NA;
  return isString(x) ? x : `${x}`;
};
