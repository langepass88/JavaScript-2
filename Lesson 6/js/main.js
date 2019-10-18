'use strict';

class ItemsList {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.loaded = false;
    }

    fetchItems() {
        return fetch('/goods')
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filteredItems = items;
                this.loaded = true;
            });

    }

    filter(query) {
        this.filteredItems = this.items.filter((item) => {
            const regexp = new RegExp(query, 'i');
            return regexp.test(item.title);
        });
    }


    render() {
        if (this.loaded && this.filteredItems.length === 0) {
            return `<div class="notFound">Ничего не найдено. Попробуйте что-нибудь другое...</div>`;
        }
        return this.filteredItems.map((item) => new Item(item.id, item.title, item.price).render()).join('');
    }

}

class Item {
    constructor(id, title = 'Unknown Title', price = 'Unknown') {
        this.id = id;
        this.title = title;
        this.price = price;
    }

    render() {
        return `<div class="product-item"><h3>${this.title}</h3><p>${this.price}</p><button
        data-id="${this.id}" data-title="${this.title}" data-price="${this.price}" class="by-btn">Купить</button></div>`;
    }

}

class Cart {
    constructor() {
        this.items = [];
        this.element = null;
    }

    fetchItems() {
        return fetch('/cart')
            .then(response => response.json())
            .then((items) => {
                    this.items = items;
                }
            );
    }

    add(item) {
        fetch('/cart', {
            method: 'POST',
            body: JSON.stringify({...item, qty: 1}),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((item) => {

                this.element.insertAdjacentHTML('afterbegin', Cart.renderItem(item));
            });
        this.items.push({...item, qty: 1});

    }

    update(id, newQty) {
        if (newQty < 1) {
            if (confirm('Вы действительно хотите удалить товар из корзины?')) {
                fetch(`/cart/${id}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(() => {
                        const $item = document.querySelector(`.cart-block div[data-id="${id}"]`);
                        if ($item) {
                            $item.remove();
                        }
                    });
                const idx = this.items.findIndex(entity => entity.id === id);
                this.items.splice(idx, 1);
            } else {
                return false;
            }
        } else {
            fetch(`/cart/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({qty: newQty}),
                headers: {
                    'Content-type': 'application/json',
                },
            })

                .then(response => response.json())
                .then(() => {
                    console.log('Обновление количества прошло успешно!');
                });

            const idx = this.items.findIndex(entity => entity.id === id);
            this.items[idx].qty = newQty;
        }

        return true;
    }

    static renderItem(item) {
        return `
    <div class="cart-item" data-id="${item.id}"><h3>${item.title}</h3>
    <span>Кол-во:</span> <input class="qty" type="number" value="${item.qty}">
    </div>`
    }

    render() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.innerHTML = this.items.map(Cart.renderItem).join('');
        }

        return this.element;

    }

    total() {

        return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    }
}


const items = new ItemsList();
items.fetchItems().then(() => {
    document.querySelector('.catalog').insertAdjacentHTML('afterbegin', items.render());
});

const cart = new Cart();
cart.fetchItems().then(() => {
    document.querySelector('.cart-block').appendChild(cart.render());
    document.querySelector('.total').insertAdjacentHTML('afterbegin', `К оплате: ${cart.total()} рублей`);
});

document.querySelector('.cart-block').addEventListener('change', (event) => {
    if (event.target.classList.contains('qty')) {
        const $parent = event.target.parentElement;
        if (!cart.update($parent.dataset.id, +event.target.value)) {
            event.target.value = 1;
        }
        // document.querySelector('.total').insertAdjacentHTML('beforeend', `К оплате: ${cart.total()} рублей`);
        document.querySelector('.total').innerHTML = `К оплате: ${cart.total()} рублей`;
    }
});


document.querySelector('.catalog').addEventListener('click', (event) => {
    if (event.target.classList.contains('by-btn')) {
        const id = event.target.dataset.id;
        const $item = document.querySelector(`.cart-block div[data-id="${id}"]`);
        if ($item) {
            const $currentQty = $item.querySelector('.qty');
            $currentQty.value = +$currentQty.value + 1;
            cart.update(id, +$currentQty.value);
        } else {
            cart.add(event.target.dataset);
        }
        document.querySelector('.total').innerHTML = `К оплате: ${cart.total()} рублей`;
    }
});


document.querySelector('[name="query"]').addEventListener('input', (event) => {
    const query = event.target.value;
    items.filter(query);
    document.querySelector('.catalog').innerHTML = items.render();
});

document.querySelector('.btn-cart').addEventListener('click', () => {
    document.querySelector('.cart-block').classList.toggle('invisible');
});



