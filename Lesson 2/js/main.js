'use strict';

class ItemsList {
    constructor() {
        this.items = [];
    }

    fetchItems() {
        this.items = [
            {title: 'Компьютерная мышь', price: 400},
            {title: 'Жесткий диск SSD 1Tb', price: 4000},
            {title: 'Материнская плата', price: 8500},
            {title: 'Видео-карта', price: 6000},
            {},
        ];
    }

    total() {
        return this.items.reduce((a, {price = 0}) => a + price, 0);
    }

    render() {
        return this.items.map((item) => new Item(item.title, item.price).render()).join('');
    }

}

class Item {
    constructor(title = 'Unknown Title', price = 'Unknown') {
        this.title = title;
        this.price = price;
    }

    render() {
        return `<div class="product-item"><h3>${this.title}</h3><p>${this.price}</p><button class="by-btn">Купить</button></div>`;
    }

}

/*   ПУСТЫЕ КЛАССЫ ДЛЯ КОРЗИНЫ
class Cart {
    constructor() {
        this.cart = [];
    }

    addToCart() {
        //добавить товар в корзину
    }

    totalCart() {
        // подсчет суммы всех товаров в корзине
    }

    getShip() {
        // подсчет суммы доставки
    }

    totalSum() {
        // подсчет итоговой суммы с учетом доставки
    }

    render() {
        // рендер корзины
    }


}

class CartItem {
    constructor() {
        this.title = title; // название товара
        this.price = price; // цена товара
        this.count = count; // количество товара
    }

    moreItem() {
        //прибавление товара в корзину на 1
    }

    removeItem() {
        // удаление товара из корзины
    }

    render() {
        // рендер CartItem
    }
}
*/

const items = new ItemsList();
items.fetchItems();
document.querySelector('.catalog').insertAdjacentHTML('afterbegin', items.render());
document.querySelector('.total').insertAdjacentHTML('afterbegin', `Общая сумма всех товаров равна: ${items.total()} рублей`);



