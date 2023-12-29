import { Component } from '../component';
import html from './favorites.tpl.html';

import { ProductList } from '../productList/productList';
import { favService } from '../../services/fav.service';

class Favorites extends Component {
  favoritesProducts: ProductList;

  constructor(props: any) {
    super(props);

    this.favoritesProducts = new ProductList();
    this.favoritesProducts.attach(this.view.favorites);
  }

  render() {
	favService.get().then((products) => {
		if (products.length) {
			this.favoritesProducts.update(products);
			return;
		}

		this.view.favorites.innerText = "В избранном ничего нет.";
	})
  }
}

export const favoritesComp = new Favorites(html);
