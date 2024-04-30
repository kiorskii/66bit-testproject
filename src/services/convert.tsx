function convertData(el) {
  const months = {
    "января": "01", "февраля": "02", "марта": "03",
    "апреля": "04", "мая": "05", "июня": "06",
    "июля": "07", "августа": "08", "сентября": "09",
    "октября": "10", "ноября": "11", "декабря": "12"
  };


  const dates = [el.birthdate.split(" "), el.dateOfEmployment.split(" ")];


  if (!el.birthdate || !el.dateOfEmployment) {

  } else {
    dates.forEach((date, index) => {
      const day = date[0];
      const month = months[date[1]];
      const year = date[2];

      switch (index) {
        case 0:
          el.birthdate = `${day}.${month}.${year}`;
        case 1:
          el.dateOfEmployment = `${day}.${month}.${year}`;
      }
    })
  }

  if (!el.phone) return el;
  el.phone = "+7 " + el.phone.slice(4, 7) + el.phone.slice(8, 18)

  return el;
}

export { convertData };