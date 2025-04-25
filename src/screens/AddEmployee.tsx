import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Checkbox, DatePicker, Button, message, Card } from 'antd';
import dayjs from 'dayjs';
import { formatPhone } from '../services/phone_formatter';
import { fetchEmployees } from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Navigation from '../components/Navigation/Navigation';

const techOptions = ['CSharp', 'React', 'Java', 'PHP', 'Figma', 'Word'];
const posOptions  = ['Frontend', 'Backend', 'Аналитик', 'Менеджер', 'Дизайнер'];

export default function AddEmployee() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async values => {
    const token = localStorage.getItem('token');
    const payload = {
      ...values,
      phone: formatPhone(values.phone),
      birthdate: values.birthdate.format('YYYY-MM-DD'),
      dateOfEmployment: values.dateOfEmployment.format('YYYY-MM-DD'),
    };

    try {
      const r = await fetch('http://localhost:3001/api/Employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      await fetchEmployees();             // обновим кеш/контекст при необходимости
      message.success('Сотрудник добавлен');
      navigate('/employees');
    } catch {
      message.error('Не удалось добавить');
    }
  };

  return (
    <>
      <Header />
      <Navigation />
      <Card title="Добавить сотрудника" style={{ maxWidth: 1000, margin: '24px auto' }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ gender: 'Мужчина', position: 'Менеджер', stack: ['Word'] }}>
          <Form.Item name="name" label="ФИО" rules={[{ required: true, min: 5 }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
        <Input  placeholder="+7 (___) ___-__-__"  maxLength={18}  onChange={e => form.setFieldValue('phone', formatPhone(e.target.value))}/>
          </Form.Item>

          <Form.Item name="gender" label="Пол">
            <Select>
              <Select.Option value="Мужчина">Мужчина</Select.Option>
              <Select.Option value="Женщина">Женщина</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="position" label="Должность">
            <Select options={posOptions.map(p => ({ label: p, value: p }))} />
          </Form.Item>

          <Form.Item name="stack" label="Технологии">
            <Checkbox.Group options={techOptions} />
          </Form.Item>

          <Form.Item name="birthdate" label="Дата рождения" rules={[{ required: true }]}>
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="dateOfEmployment" label="Дата устройства" rules={[{ required: true }]}>
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="photo" label="Фото (URL)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Footer />
    </>
  );
}
