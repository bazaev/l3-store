import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favService } from '../../services/fav.service';
import { userService } from '../../services/user.service';
import eventAnalytics from '../../eventAnalytics';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._toggleToFav.bind(this);

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();

    const isInFav = await favService.isInFav(this.product);
    this._setInFav(isInFav);

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts', {
        headers: {
          'x-userid': userService.userId
        }
      })
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;

    eventAnalytics.addToCart(this.product);

    cartService.addProduct(this.product);
    this._setInCart();
  }

  private async _toggleToFav() {
    if (!this.product) return;

    const isInFav = await favService.isInFav(this.product);
    if (isInFav) {
      favService.removeProduct(this.product);
    }else{
      favService.addProduct(this.product);
    }

    this._setInFav(!isInFav);
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private _setInFav(isInFav: boolean) {
    this.view.btnFav.style.fillOpacity = isInFav ? 1 : .25;
  }
}

export const productDetailComp = new ProductDetail(html);
