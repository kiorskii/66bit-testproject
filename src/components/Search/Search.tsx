import React, { useState } from 'react';
import styles from './Search.module.css';

const Search = () => {
  const [activePopup, setActivePopup] = useState("none");

  const handlePopupClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const togglePopup = (id: string) => {
    if (activePopup === id) {
      setActivePopup("none");
    } else {
      setActivePopup(id);
    }
  };

  return (
    <>
      <div className={styles.search}>
        <h1 className={styles.search__title}>Список сотрудников</h1>
        <input className={styles.search__input} placeholder="Поиск" />
        <ul className={styles.search__criterias}>
          <li className={styles.search__criteria} onClick={() => togglePopup('position')}>
            <p className="criteria__name link">Должность</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'position' && (
              <div className={styles.popup + ' ' + styles.popup_position}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['Backend-разработчик', 'Frontend-разработчик', 'Аналитик', 'Менеджер', 'Дизайнер', 'Fullstack'].map((positionName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`} >
                          {positionName}
                          <input type="checkbox" className={styles.customCheckbox} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
          <li className={styles.search__criteria} onClick={() => togglePopup('gender')}>
            <p className="criteria__name link">Пол</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'gender' && (
              <div className={styles.popup}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['Мужчина', 'Женщина'].map((genderName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`}>
                          {genderName}
                          <input type="checkbox" className={styles.customCheckbox} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
          <li className={styles.search__criteria} onClick={() => togglePopup('stack')}>
            <p className="criteria__name link">Стек технологий</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'stack' && (
              <div className={styles.popup}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['CSharp', 'React', 'Java', 'PHP', 'Figma', 'Word'].map((stackName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`}>
                          {stackName}
                          <input type="checkbox" className={styles.customCheckbox} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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

export default Search;
