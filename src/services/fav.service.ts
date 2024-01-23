import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-fav';

class FavService {
  init() {
    this._updVisible();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async toggleProduct(product: ProductData, isInFav: boolean) {
    if (isInFav) {
      await this.removeProduct(product)
    }else{
      await this.addProduct(product)
    }
  }

  async clear() {
    await localforage.removeItem(DB);
    this._updVisible();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this._updVisible();
  }

  async isInFav(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updVisible() {
    const products = await this.get();
    const isEmpty = !products.length;

    const fav = document.querySelector('.js__fav');

    fav?.classList?.toggle('hide', isEmpty);
  }
}

export const favService = new FavService();
