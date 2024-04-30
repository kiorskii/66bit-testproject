import styles from './Person.module.css'


const Person = ({ employee }) => {

  const MainInfo = [
    { label: "Контактный телефон:", value: employee?.phone },
    { label: "День рождения:", value: employee?.birthdate },
    { label: "Дата устройства:", value: employee?.dateOfEmployment }
  ];

  return (

    <div className={styles.person}>
      <div className={styles.top}>
        <div className={styles.person__imgContainer}>
          <img className={styles.person__image} src={employee?.photo} alt="avatar" />
        </div>
        <div>
          <h2 className={styles.person__name}>{employee?.name}</h2>
          <p className={styles.person__position}>{employee?.position}</p>
          <div className={styles.person__stack}>
            {employee?.stack.map((item, index) => (
              <p key={index} className={styles.person__stackItem}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.person__mainInfo}>
        <h3 className={styles.person__title}>Основная информация</h3>
        <ul className={styles.person__infoList}>
          {MainInfo.map((item, index) => (
            <li key={index} className={styles.person__infoItem}>
              <p className={styles.person__infoLabel}>{item.label}</p>
              <p className={styles.person__infoValue}>{item.value}</p>
            </li>
          ))}
        </ul>

      </div>
    </div>

  )
}


export default Person