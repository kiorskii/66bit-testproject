import { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { updateEmployee } from '../../services/api';
import { formatPhone } from '../../services/phone_formatter';

const { Option } = Select;
const techOptions = ['CSharp', 'React', 'Java', 'PHP', 'Figma', 'Word'];
const posOptions  = ['Frontend', 'Backend', 'Аналитик', 'Менеджер', 'Дизайнер'];

export default function EditEmployeeModal({ isOpen, closeModal, employee, refreshData }) {
  const [form] = Form.useForm();

  // заполняем форму при открытии
  useEffect(() => {
    if (isOpen && employee) {
      form.setFieldsValue({
        ...employee,
        phone: formatPhone(employee.phone),
        birthdate: dayjs(employee.birthdate, 'DD.MM.YYYY'),
        dateOfEmployment: dayjs(employee.dateOfEmployment, 'DD.MM.YYYY'),
      });
    }
  }, [isOpen, employee]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        birthdate: values.birthdate.format('YYYY-MM-DD'), 
        dateOfEmployment: values.dateOfEmployment.format('YYYY-MM-DD'),
      };
      await updateEmployee(employee.id, payload);
      refreshData(payload);
      message.success('Изменения сохранены');
      closeModal();
    } catch (err) {
      /* validation errors или сетевые — ничего не делаем */
    }
  };

  return (
    <Modal open={isOpen} onCancel={closeModal} onOk={onOk} title="Редактировать сотрудника" destroyOnClose>
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="ФИО" rules={[{ required: true, min: 5 }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
         <Input  placeholder="+7 (___) ___-__-__"  maxLength={18}  onChange={e => form.setFieldsValue({ phone: formatPhone(e.target.value) })}/>        </Form.Item>

        <Form.Item name="gender" label="Пол">
          <Select>
            <Option value="Мужчина">Мужчина</Option>
            <Option value="Женщина">Женщина</Option>
          </Select>
        </Form.Item>

        <Form.Item name="position" label="Должность">
          <Select>
            {posOptions.map(p => <Option key={p}>{p}</Option>)}
          </Select>
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

        <Form.Item name="photo" label="Фото (URL)">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
