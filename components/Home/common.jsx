/* eslint-disable react/prop-types */
import moment from 'moment';
import {
  Form, InputNumber, DatePicker, Button, Typography,
} from 'antd/lib';
import isNil from 'lodash/isNil';
import { Shimmer } from 'common-util/Shimmer';
import { getBlockTimestamp } from 'common-util/functions';
import { useFetchBalances } from './VeOlas/hooks';

const { Text } = Typography;

const fullWidth = { width: '100%' };

export const getToken = ({ tokenName, token, isLoading = false }) => (
  <div className={`section ${tokenName}-section`}>
    <div className="info">
      <span className="token-name">{tokenName}</span>
      <span className="balance">
        <>{isLoading ? <Shimmer /> : <>{token || '--'}</>}</>
      </span>
    </div>
  </div>
);

/**
 * Parses to seconds by doing the following operation in order
 * 1. convert to milliseconds
 * 2. divide by 100 to convert to seconds
 * 3. remove decimals
 */
export const parseToSeconds = async (unlockTime) => {
  const futureDateInTimeStamp = Math.round(
    new Date(unlockTime).getTime() / 1000,
  );
  const todayDateInTimeStamp = Math.round(new Date().getTime() / 1000) + 1;

  // const futureDateInTimeStamp = (365 * 24 * 60 * 60 * 4) + 0;
  // console.log({
  //   futureDateInTimeStamp,
  //   todayDateInTimeStamp,
  //   calc: futureDateInTimeStamp - todayDateInTimeStamp,
  // });

  // return (365 * 24 * 60 * 60 * 4) + 0;
  return futureDateInTimeStamp - todayDateInTimeStamp;

  // const blockTimestamp = await getBlockTimestamp();
  // const oneWeek = 604800;
  // const value = Math.floor((futureDateInTimeStamp - blockTimestamp) / oneWeek) * oneWeek;
  // console.log(value);
  // return value;

  // console.log(futureDateInTimeStamp);
  // return futureDateInTimeStamp;
};

/**
 * @returns Amount Input
 */
export const FormItemInputNumber = ({ text = 'Lock OLAS' }) => {
  const { olasBalanceInEth } = useFetchBalances();

  return (
    <Form.Item
      className="custom-form-item-lock"
      name="amount"
      label={text}
      rules={[
        { required: true, message: 'Amount is required' },
        () => ({
          validator(_, value) {
            if (value === '' || isNil(value)) return Promise.resolve();
            if (value <= 1) {
              return Promise.reject(new Error('Please input a valid amount'));
            }
            if (olasBalanceInEth && value > olasBalanceInEth) {
              return Promise.reject(
                new Error('Amount cannot be greater than the balance'),
              );
            }
            return Promise.resolve();
          },
        }),
      ]}
    >
      <InputNumber style={fullWidth} placeholder="Add amount" />
    </Form.Item>
  );
};

export const MaxButton = ({ onMaxClick }) => {
  const { olasBalanceInEth } = useFetchBalances();

  return (
    <Text type="secondary">
      OLAS balance:&nbsp;
      {olasBalanceInEth}
      <Button
        htmlType="button"
        type="link"
        onClick={onMaxClick}
        className="pl-0"
      >
        Max
      </Button>
    </Text>
  );
};

/**
 * @returns Date Input
 * @param {Date} startDate - start date from when the user can select the date
 * and startDate cannot be less than today.
 *
 * eg. If increased amount to 5th March 2023 and the current date is 20th Janurary 2023
 * then the user can select ONLY from the date from 5th March 2023
 */
export const FormItemDate = ({ startDate }) => {
  /**
   * (can select days after 7 days from today OR
   * can select from [startDate + 7 days]) AND
   * less than 4 years from today
   */
  const disableDateForUnlockTime = (current) => {
    const pastDate = startDate
      ? current < moment(new Date(startDate)).add(6, 'days').endOf('day')
      : current < moment().add(7, 'days').endOf('day');

    // do not allow selection for more than 4 years
    const futureDate = current > moment().add(4, 'years');
    return (current && pastDate) || futureDate;
  };

  return (
    <Form.Item
      name="unlockTime"
      label="Unlock Time"
      rules={[{ required: true, message: 'Unlock Time is required' }]}
      tooltip="The date should be minimum 1 week and maximum 4 years"
    >
      <DatePicker
        disabledDate={disableDateForUnlockTime}
        format="MM/DD/YYYY HH:mm"
        style={fullWidth}
        showTime={{ format: 'HH:mm' }}
      />
    </Form.Item>
  );
};
