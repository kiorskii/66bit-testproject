import styles from './Employee.module.css'

const Employee = ({ data }) => {
  return (
    <ul className={styles.employee}>
      <li className={styles.employee__name}>
        <p>{data.name}</p>
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