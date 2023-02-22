import {
  getFormattedDate,
  formatToEth,
  getTotalVotesPercentage,
  getString,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { useFetchBalances } from './useFetchBalances';

/**
 * This hook is used to get the components
 */
export const useVeolasComponents = () => {
  const {
    isLoading,
    veolasBalance,
    votes,
    totalSupplyLocked,
    mappedAmount,
    mappedEndTime,
  } = useFetchBalances();

  const getBalanceComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Your balance'}
      value={getString(veolasBalance)}
      subText="veOLAS"
    />
  );

  const getVotingPowerComponent = (title) => (
    <InfoCard
      title={title || 'Voting power'}
      value={getString(formatToEth(votes))}
      subText="votes"
    />
  );

  const getVotingPercentComponent = () => (
    <InfoCard
      value={
        Number(votes) === 0 || Number(totalSupplyLocked) === 0
          ? '0%'
          : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`
      }
      subText="% of total voting power"
    />
  );

  const getLockedAmountComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Lock'}
      value={getString(mappedAmount)}
      subText="locked OLAS"
    />
  );

  const getUnlockTimeComponent = () => (
    <InfoCard
      isLoading={isLoading}
      value={getFormattedDate(mappedEndTime)}
      subText="unlock date"
    />
  );

  // TODO: how to fetch this data?
  const getUnlockedAmountComponent = () => (
    <InfoCard
      isLoading={isLoading}
      value="--"
      subText="unlocked OLAS"
    />
  );

  return {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
    getUnlockedAmountComponent,
  };
};
