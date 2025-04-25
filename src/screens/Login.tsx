// Login.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Card, Alert, Typography } from 'antd';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const onFinish = async ({ email, password }) => {
    try {
await login(email, password);
navigate('/', { replace: true });

    } catch {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <>
      <Header />

      {/* центруем форму вертикально-горизонтально */}
      <Row align="middle" justify="center" style={{ minHeight: '70vh' }}>
        <Col xs={22} sm={16} md={10} lg={8}>
          <Card>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
              Вход
            </Title>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  { required: true, message: 'Введите E-mail' },
                  { type: 'email', message: 'Некорректный E-mail' },
                ]}
              >
                <Input size="large" placeholder="user@example.com" />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
              >
                <Input.Password size="large" placeholder="••••••" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
              >
                Войти
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Footer />
    </>
  );
}
