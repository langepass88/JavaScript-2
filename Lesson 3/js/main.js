'use strict';

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) {
                    reject();
                }
                const goods = JSON.parse(xhr.responseText);

                resolve(goods);
            }
        };
        xhr.send();
    });
}

class ItemsList {
    constructor() {
        this.items = [];
    }

    fetchItems() {
        return sendRequest('/goods')
            .then((items) => {
                this.items = items;
            });
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


class Cart {
    constructor() {
        this.cart = [];
    }

    fetchCart() {
        return sendRequest('/cart')
            .then((cart) => {
                this.cart = cart;
            });
    }

    render() {
        return this.cart.map((el) => new CartItem(el.title, el.price).render()).join('');
    }

}

    /*   ПУСТЫЕ КЛАССЫ ДЛЯ КОРЗИНЫ
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
*/
    class CartItem {
        constructor(title = 'Unknown title', price = 'Unknow price', img = 'https://placehold.it/150x100', count =' 1') {
            this.title = title; // название товара
            this.price = price; // цена товара
            this.img = img;
            this.count = count; // количество товара
        }

        render() {
            return `<div class="cart-item">
            <img src="${this.img}" alt="Картинка">
            <div class="info-cart">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <div class="cart-count">${this.count}</div>
            </div>
            <button class="by-btn">Удалить</button>
          </div>`
        }
    }
        /*

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
items.fetchItems().then(() => {
    document.querySelector('.catalog').insertAdjacentHTML('afterbegin', items.render());
    document.querySelector('.total').insertAdjacentHTML('afterbegin', `Общая сумма всех товаров равна: ${items.total()} рублей`);
});
const cart = new Cart();
cart.fetchCart().then(() => {
    document.querySelector('.cart-block').insertAdjacentHTML('afterbegin', cart.render());
});

document.querySelector('.btn-cart').addEventListener('click', ()=> {
    document.querySelector('.cart-block').classList.toggle('invisible');

});








