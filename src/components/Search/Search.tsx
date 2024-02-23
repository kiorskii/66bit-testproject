import styles from './Search.module.css'

const Search = () => {

  return (
    <>
      <div className={styles.search}>
        <h1 className={styles.search__title}>Список сотрудников</h1>
        <input className={styles.search__input} placeholder="Поиск" />
        <ul className={styles.search__criterias}>
          <li className={styles.search__criteria}>
            <p className="criteria__name">Должность</p>
            <img src="/src/assets/down_arrow.svg" alt="" />

          </li>
          <li className={styles.search__criteria}>
            <p className="criteria__name">Пол</p>
            <img src="/src/assets/down_arrow.svg" alt="" />

          </li>
          <li className={styles.search__criteria}>
            <p className="criteria__name">Стек технологий</p>
            <img src="/src/assets/down_arrow.svg" alt="" />

          </li>
        </ul>
      </div>
      <div className={styles.search__info}>
        <ul className={styles.search__filters}>
          <p className={styles.search__pretitle}>Выбранные фильтры: </p>
          <li className={styles.search__filter}>
            <span></span><span></span>
            fullstack
          </li>
          <li className={styles.search__filter}>
            <span></span><span></span>
            женщина
          </li>
        </ul>
        <button className={styles.search__button}>Найти</button>
      </div>
    </>
  )
}

export default Search