import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../services/api';
import { formatPhone } from '../services/phone_formatter';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Мужчина',
    position: 'Менеджер',
    stack: ['Word'],
    birthdate: '',
    dateOfEmployment: '',
    photo: ''
  });

  const positions = ['Frontend', 'Backend', 'Аналитик', 'Менеджер', 'Дизайнер'];
  const technologies = ['CSharp', 'React', 'Java', 'PHP', 'Figma', 'Word'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Если изменяется телефон, форматируем его
      setFormData((prev) => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedStack = checked
        ? [...prev.stack, value]
        : prev.stack.filter((tech) => tech !== value);
      return { ...prev, stack: updatedStack };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/api/Employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      // Обновляем список сотрудников после добавления нового
      await fetchEmployees();
      navigate('/employees');  // редирект на страницу списка сотрудников
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Добавить сотрудника</h2>
      <form onSubmit={handleSubmit}>
        {/* Форма для ФИО, телефона и других полей */}
        <div>
          <label htmlFor="name">ФИО</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Телефон</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Пол</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Мужчина">Мужчина</option>
            <option value="Женщина">Женщина</option>
          </select>
        </div>

        {/* Должность - выпадающий список */}
        <div>
          <label htmlFor="position">Должность</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        {/* Технологии - чекбоксы */}
        <div>
          <label>Технологии</label>
          {technologies.map((tech) => (
            <div key={tech}>
              <input
                type="checkbox"
                id={tech}
                name="stack"
                value={tech}
                checked={formData.stack.includes(tech)}
                onChange={handleTechChange}
              />
              <label htmlFor={tech}>{tech}</label>
            </div>
          ))}
        </div>

        {/* Даты */}
        <div>
          <label htmlFor="birthdate">Дата рождения</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfEmployment">Дата устройства на работу</label>
          <input
            type="date"
            id="dateOfEmployment"
            name="dateOfEmployment"
            value={formData.dateOfEmployment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="photo">Фото</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddEmployee;
