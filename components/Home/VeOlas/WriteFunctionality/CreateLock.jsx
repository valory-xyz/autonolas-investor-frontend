import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import {
  parseAmount,
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
} from '../../common';
import { createLock } from '../utils';

const { Title } = Typography;

export const CreateLockComponent = ({ account, chainId }) => {
  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await createLock({
        amount: parseAmount(e.amount),
        unlockTime: parseToSeconds(e.unlockTime),
        account,
        chainId,
      });
      notifySuccess(
        'Lock created successfully!',
        `Transaction Hash: ${txHash}`,
      );
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="create-lock-form"
        onFinish={onFinish}
      >
        <FormItemInputNumber />
        <FormItemDate />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

CreateLockComponent.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

CreateLockComponent.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export const CreateLock = connect(
  mapStateToProps,
  null,
)(CreateLockComponent);
