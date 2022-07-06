import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Login from '../Login';
import { CustomLayout, HeaderContainer, Container } from './styles';

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();

  return (
    <CustomLayout pathname={router.pathname}>
      <Header>
        <HeaderContainer>
          <div className="column-1" />

          <Login />
        </HeaderContainer>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">{children}</div>
      </Content>

      <Container />
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
