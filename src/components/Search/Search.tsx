import React, { useState } from 'react';
import styles from './Search.module.css';
import { fetchEmployees } from '../../services/api';

const Search = () => {

  // Pop-up functionality
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


  // Filters/Sorting functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [stackFilter, setStackFilter] = useState([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    const updateFilter = (filters: string[]) => {
      return checked ? [...filters, value] : filters.filter(item => item !== value);
    };

    switch (name) {
      case 'position':
        setPositionFilter(updateFilter(positionFilter));
        break;
      case 'gender':
        setGenderFilter(updateFilter(genderFilter));
        break;
      case 'stack':
        setStackFilter(updateFilter(stackFilter));
        break;
      default:
        break;
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'position':
        setPositionFilter(prev => prev === value ? "" : value);
        break;
      case 'gender':
        setGenderFilter(prev => prev === value ? "" : value);
        break;
      default:
        break;
    }
    // Если текущее значение равно кликнутому, снимаем выбор, иначе устанавливаем новое
  };


  const handleSearchSubmit = async () => {
    console.log(searchQuery, positionFilter, genderFilter, stackFilter);
    const filteredData = await fetchEmployees(1, 20, genderFilter, positionFilter, stackFilter.join(','));
    console.log(filteredData); // Обработка данных или передача их куда-либо
  };

  // Filters Delete and render logic
  const renderSelectedFilters = () => {
    const filters = [];

    // Добавляем выбранную позицию, если она есть
    if (positionFilter) {
      filters.push(positionFilter);
    }

    // Добавляем выбранные фильтры пола
    if (genderFilter) {
      filters.push(genderFilter);
    }

    // Добавляем выбранные фильтры стека технологий
    filters.push(...stackFilter);



    return filters.map(filter => (
      <li key={filter} className={styles.search__filter} onClick={() => handleDeleteFilter(filter)}>
        <div className={styles.search__delete}>
          <span></span><span></span>
        </div>
        {filter}
      </li>
    ));
  };

  const handleDeleteFilter = (filter) => {
    // Удаление позиции, если она выбрана
    if (positionFilter === filter) {
      setPositionFilter("");
    }

    // Удаление фильтра пола
    if (genderFilter === filter) {
      setGenderFilter("");
    }

    // Удаление фильтра стека технологий
    if (stackFilter.includes(filter)) {
      setStackFilter(stackFilter.filter(f => f !== filter));
    }
  };



  return (
    <>
      <div className={styles.search}>
        <h1 className={styles.search__title}>Список сотрудников</h1>
        <input
          className={styles.search__input}
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearchChange} />
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
                          <input type="radio" className={styles.customCheckbox} value={positionName} name="position" onChange={handleRadioChange} checked={positionFilter === positionName} />
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
                          <input type="radio" className={styles.customCheckbox} value={genderName} name="gender" onChange={handleRadioChange} checked={genderFilter === genderName} />
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
                          <input type="checkbox" className={styles.customCheckbox} value={stackName} name="stack" onChange={handleCheckboxChange} />
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
          {renderSelectedFilters()}
        </ul>
        <button onClick={handleSearchSubmit} className={styles.search__button}>Найти</button>
      </div>
    </>
  )
}

export default Search;
