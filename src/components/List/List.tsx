import Employee from '../Employee/Employee'
import styles from './List.module.css'

const List = () => {
  return (
    <>
      <div className={styles.list}>
        <ul className={styles.list__headers}>
          <li className={styles.list__header}>
            <p>ФИО</p>
          </li>
          <li className={styles.list__header}>
            <p>Должность</p>
          </li>
          <li className={styles.list__header}>
            <p>Телефон</p>
          </li>
          <li className={styles.list__header}>
            <p>Дата рождения</p>
          </li>
        </ul>
        <Employee />
      </div>

    </>
  )
}

export default List