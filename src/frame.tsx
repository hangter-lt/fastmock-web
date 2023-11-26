import { Link, Outlet } from "react-router-dom";
import { Layout } from 'antd';
const { Header, Content } = Layout;

const Frame: React.FC = () => {
    return (
        <Layout style={{ height: '100%' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" >
                    logo占位符
                </div>
                <Link to="/api/requests">实时请求</Link>
            
                <Link to="/api/requests">MOCK</Link>
            </Header>
            <Content style={{ padding: '0 50px', height: '100%' }}>
                <Outlet/>
            </Content>
        </Layout> 
    );
}

export default Frame