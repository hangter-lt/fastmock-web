import React, { useState } from 'react';
import { Layout, Menu, theme, Space, Card, Button, Tag, Row, Col } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import Item from 'antd/es/list/Item';
import axios from "axios";


const { Header, Content, Sider } = Layout;

type Item = {
  id?: number
  uri?: string
  method?: string
}
type Items = Item[]
const menuItems: Items = []
var menuItem: Items = []

type Reqres = {
  id?: number
  uri?: string
  method?: string
  header?: string
  params?: string
  code?: number
  content_type?: string
  content?: string
  result?: string
  reason?: string
}

const r: Reqres = {}

const eventSource = new EventSource(`/api/requests`);

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [reqs, setReqs] = useState(menuItems)
  const [rr, setRr] = useState(r)

  function getRequest(id: number | undefined) {
    axios.get("/api/requests/" + id).then((res) => {
      setRr(res.data)
    })
  }

  // 处理事件流
  eventSource.onopen = function () {
    console.log("open")
  }
  eventSource.onmessage = function (ev) {

    console.log("event")
    const item: Item = JSON.parse(ev.data);
    setReqs([item].concat(menuItem))
    menuItem.unshift(item)
  };
  eventSource.onerror = function () {
    console.log("error");
    eventSource.close();
  };


  return (
    <Layout style={{ height: '100%' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" >
          logo占位符
        </div>
      </Header>
      <Content style={{ padding: '0 50px', height: '100%' }}>
        <Layout style={{ height: '100%', padding: '10px 0px', background: colorBgContainer }}>
          <Sider style={{ background: colorBgContainer, overflow: 'auto' }} width={300}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[]}
              style={{ height: '100%' }}
              selectedKeys={[]}
            >
              {reqs.map((r) => (
                <MenuItem onClick={() => getRequest(r.id)} key={r.id} > <Tag color="#108ee9">{r.method}</Tag> {r.uri} </MenuItem>
              ))}
            </Menu>
          </Sider>
          <Content style={{ padding: '30px 30px', display: "flex" }}>
            <Row style={{width: "100%"}}>
              <Col span={8}>
                <Card title="请求" style={{ width: "100%" }}>
                  <Card>
                    <Tag color="#108ee9">{rr.method}</Tag>{rr.uri}
                  </Card>
                  <br />
                  <Card title="header">
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {rr.header}
                    </p>
                  </Card>
                  <br></br>
                  <Card title="params">
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(JSON.parse(rr.params == undefined || rr.params == '' ? '{}' : rr.params), null, 4)}
                    </p>
                  </Card>
                  <br></br>

                </Card>
              </Col>
              <Col span={14} offset={1}>
                <Card title="响应" style={{ width: "100%" }} >
                  <Card>
                    <Tag color={rr.code == 200 ? '#87d068' : '#f50'}>{rr.code}</Tag>{rr.content_type}
                  </Card>
                  <br />
                  <Card title="body">
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {rr.content}
                    </p>
                    {rr.reason}
                  </Card>
                </Card>
              </Col>
            </Row>

          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default App;