'use strict';

const goods = [
    {title: 'Компьютерная мышь', price: 400},
    {title: 'Жетский диск SSD 1Tb', price: 4000},
    {title: 'Материнская плата', price: 8500},
    {title: 'Видео-карта', price: 6000},
    {},
];

/**
 * Функция генерирует список товара
 * @param items {Array} массив со списком товара.
 */
const renderList = (items) =>
    document.querySelector('.catalog').insertAdjacentHTML('afterbegin', items.map(renderItem).join(' '));

/**
 * Функция, которая генерирует разметку отдельной единицы товара.
 * @param item {Object} объект с характеристиками отдельного товара.
 * @return {string} HTML-разметка товара.
 */
const renderItem = ({title = 'Unknown title', price = 'Unknown price'}) =>
    `<div class="product-item"><h3>${title}</h3><p>${price}</p><button class="by-btn">Купить</button></div>`;

renderList(goods);