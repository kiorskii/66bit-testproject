import styles from './Employee.module.css'

const Employee = () => {
  return (
    <>
      <ul className={styles.employee}>
        <li className={styles.employee__name}>
          <p>Дмитриев Игорь Степанович</p>
        </li>
        <li className={styles.employee__post}>
          <p>Дизайнер</p>
        </li>
        <li className={styles.employee__telephone}>
          <p>+7 934 349-43-23</p>
        </li>
        <li className={styles.employee__birthday}>
          <p>23.09.2000</p>
        </li>
      </ul>

    </>
  )
}

export default Employee