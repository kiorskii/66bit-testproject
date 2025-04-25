import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { PlusOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';

const tile: React.CSSProperties = {
  height: 176,                 // квадрат ~ как на скрине
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
};

const iconStyle: React.CSSProperties = {
  fontSize: 42,                // тонкая большая иконка
  color: '#9b9b9b',
};

const labelStyle: React.CSSProperties = {
  marginTop: 20,
  fontWeight: 600,             // жирный
  fontSize: 17,
};

export default function Welcome() {
  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '32px 0 40px', fontSize: 40 }}>Добро пожаловать в сервис HR Manager!</h1>

      <Row gutter={[24, 24]} justify="center">
        {/* ─── две верхние плитки ───────────────────────── */}
        <Col xs={24} md={11}>
          <Link to="/add-employee">
            <Card hoverable bodyStyle={tile}>
              <PlusOutlined style={iconStyle} />
              <span style={labelStyle}>Добавить&nbsp;сотрудника</span>
            </Card>
          </Link>
        </Col>

        <Col xs={24} md={11}>
          <Link to="/import-employees">
            <Card hoverable bodyStyle={tile}>
              <UploadOutlined style={iconStyle} />
              <span style={labelStyle}>Добавить&nbsp;из&nbsp;файла</span>
            </Card>
          </Link>
        </Col>

        {/* ─── нижняя широкая плитка ─────────────────────── */}
        <Col xs={24} md={22}>
          <Link to="/employees">
            <Card hoverable bodyStyle={{ ...tile, height: 148 /* чуть ниже */ }}>
              <TeamOutlined style={iconStyle} />
              <span style={labelStyle}>Смотреть&nbsp;всех&nbsp;сотрудников</span>
              <span>120 сотрудников</span>
            </Card>
          </Link>
        </Col>
      </Row>
    </>
  );
}
