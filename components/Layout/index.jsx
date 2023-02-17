import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Menu } from 'antd/lib';
import PropTypes from 'prop-types';
import Login from '../Login';
import { CustomLayout, Container, Logo } from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  const [selectedMenu, setSelectedMenu] = useState([]);

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      console.log(name);
      setSelectedMenu(name || null);
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(`/${key}`);
    setSelectedMenu(key);
  };

  return (
    <CustomLayout pathname={router.pathname}>
      <Header>
        <div className="column-1">
          <Logo data-testid="protocol-logo">
            <LogoSvg />
            <span>Investors</span>
          </Logo>
        </div>

        <Menu theme="light" mode="horizontal" selectedKeys={[selectedMenu]}>
          <Menu.Item key="veOlas" onClick={handleMenuItemClick}>
            veOlas
          </Menu.Item>
          <Menu.Item key="buOlas" onClick={handleMenuItemClick}>
            buOlas
          </Menu.Item>
        </Menu>

        <Login />
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
