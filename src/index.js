// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import debounce from 'lodash.debounce';
// import { fetchCountries } from './fetchCountries'; 

// const DEBOUNCE_DELAY = 300; 

// const refs = {
//   searchEl : document.querySelector('#search-box'),
//   countryInfo : document.querySelector('.country-info'),
//   countryList : document.querySelector('.country-list'),
// };

// // const country_list = document.querySelector('.country-list');


// const clearMarkup = ref => (ref.innerHTML = '');

// const inputHandler = e => {
//   const textInput = e.target.value.trim();

//   if (!textInput) {
//     clearMarkup(refs.countryList);
//     clearMarkup(refs.countryInfo);
//     return;
//   }

//   fetchCountries(textInput) 
//     .then(data => {
//       console.log(data);
//       if (data.length > 10) {
//         clearMarkup(refs.countryList);
//         clearMarkup(refs.countryInfo);
//         Notify.info(
//           'Too many matches found. Please enter a more specific name'
//         );
//         return;
//       }
//       renderMarkup(data);
//     })
//     .catch(err => {
//       clearMarkup(refs.countryList);
//       clearMarkup(refs.countryInfo);
//       Notify.failure('Oops..., there is no country with that name');
//     });
// };

// const renderMarkup = data => {
//   if (data.length === 1) {
//     clearMarkup(refs.countryList);
//     const markupInfo = createInfoMarkup(data);
//     refs.countryInfo.innerHTML = markupInfo;
//   } else {
//     clearMarkup(refs.countryInfo);
//     const markupList = createListMarkup(data);
//     refs.countryList.innerHTML = markupList;
//   }
// };

// const createListMarkup = data => {
//   return data
//     .map(
//       ({ name, flags }) =>
//         `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
//     )
//     .join('');
    
// };

// const createInfoMarkup = data => {
//   return data.map(
//     ({ name, capital, population, flags, languages }) =>
//       `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
//       <h1>${name.official}</h1>
//       <p>Capital: ${capital}</p>
//       <p>Population: ${population}</p>
//       <p>Languages: ${Object.values(languages)}</p>`
//   );
// };

// refs.searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

import './css/style.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

function createCountryList(countries) {
  const endpoint = countries
    .map(country => {
      return `<li class = country-list__item>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" width=20 height=20/>
      <p class = country-list__input>Name: ${country.name.common}</p>
      </li>`;
    })
    .join('');
  return (countryList.innerHTML = endpoint);
}

function createCountryCard(countries) {
  const card = countries
    .map(country => {
      return `
    <p class = country-info__input>Name: ${country.name.common}</p>
    <p class = country-info__input>Capital: ${country.capital}</p>
    <p class = country-info__input>Population: ${country.population}</p>
    <img src="${country.flags.svg}" alt="flag of ${
        country.name.common
      }" height = 30 width = 30>
    <p class = country-info__input>Languages: ${Object.values(
      country.languages
    )}</p>`;
    })
    .join('');
  return (countryInfo.innerHTML = card);
}

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const trimInput = searchBox.value.trim();
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  fetchCountries(trimInput)
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
      } else {
        createCountryCard(countries);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}