// screens/ImportEmployees.tsx
import { Upload, Button, Card, message, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

const { Dragger } = Upload;
const { Title } = Typography;

export default function ImportEmployees() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const props = {
    multiple: false,
    accept: '.csv',
    customRequest: async options => {
      const { file, onSuccess, onError } = options as any;
      try {
        const text = await file.text();

        const resp = await fetch('http://localhost:3001/api/Employees/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            Authorization: `Bearer ${token}`,
          },
          body: text,
        });

        if (!resp.ok) throw new Error();
        const { added } = await resp.json();
        message.success(`Импортировано сотрудников: ${added}`);
        onSuccess(null, file);
        navigate('/employees');
      } catch (err) {
        message.error('Не удалось импортировать файл');
        onError(err);
      }
    },
  };

  return (
    <>
      <Header />

      <main className="page-content"> 
      <Navigation />
      <Card style={{ maxWidth: 600, margin: '40px auto' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Импорт сотрудников из CSV
        </Title>

        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Перетащите CSV-файл или кликните, чтобы выбрать</p>
          <p style={{ color: 'rgba(0,0,0,0.45)' }}>
            Формат: name, phone, gender, position, stack, birthdate, dateOfEmployment, photo
          </p>
        </Dragger>
      </Card>
      </main>


      <Footer />
    </>
  );
}
