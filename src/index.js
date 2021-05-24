// 4. Если бекенд вернул больше чем 10 стран подошедших под критерий введенный пользователем, в интерфейсе отображается нотификация о том, что необходимо сделать запрос более специфичным. Для оповещений используй плагин pnotify.

import './sass/main.scss';
import countryCardTpl from './templates/country.hbs';
import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('.js-input'),
  list: document.querySelector('.js-list'),
};

// 2. HTTP запрос на бекенд при наборе имени страны в инпуте, событие input
// 3. Обработчик события через debounce 500ms (lodash.debounce)
refs.input.addEventListener('input', debounce(onInputChange, 500));

// 1. Поиск данных о стране через Rest Countries API, /name, возвращающий массив обьектов стран попавших под критерий поиска
function onInputChange(event) {
  const inputValue = event.target.value;

  fetch(`https://restcountries.eu/rest/v2/name/${inputValue}`)
    .then(response => {
      return response.json();
    })
    .then(countries => {
      if (countries.length > 10) {
        refs.list.innerHTML = '';
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
          delay: 2000,
          mouseReset: true,
          sticker: false,
        });
      }
      // 5. Если бекенд вернул от 2-х до 10-х стран, под инпутом отображается список имен найденных стран.
      if ((countries.length > 1) & (countries.length < 11)) {
        refs.list.innerHTML = createListCountriesMarkup(countries);
      }

      // 6. Если бекенд вернул массив с одной страной, в интерфейсе рендерится разметка с данными о стране: название, столица, население, языки и флаг.
      if (countries.length === 1) {
        refs.list.innerHTML = '';
        refs.list.insertAdjacentHTML('afterbegin', countryCardTpl(countries[0]));
      }
    })
    .catch(onFetchError);
}

function createListCountriesMarkup(countries) {
  return countries.map(country => `<li>${country.name}</li>`).join('');
}

function onFetchError(error) {
  console.log(error);
}
