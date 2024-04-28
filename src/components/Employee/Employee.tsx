import { useNavigate } from 'react-router-dom';
import styles from './Employee.module.css'

const Employee = ({ data }: { data: any }) => {

  const navigate = useNavigate();

  const handleEmployeeClick = () => {
    navigate(`/employee/${data.id}`);
  };

  return (
    <ul className={styles.employee} onClick={handleEmployeeClick}>
      <li className={styles.employee__name}>
        <p>{data.id} {data.name}</p>
      </li>
      <li className={styles.employee__post}>
        <p>{data.position}</p>
      </li>
      <li className={styles.employee__telephone}>
        <p>{data.phone}</p>
      </li>
      <li className={styles.employee__birthday}>
        <p>{data.birthdate}</p>
      </li>
    </ul>
  );
}

export default Employee;