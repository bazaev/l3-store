import { ProductData } from "types";
import { genUUID } from "./utils/helpers";

class EventAnalytics {

	abortController: AbortController;

	constructor() {
		this.abortController = new AbortController();

		window.addEventListener('beforeunload', () => {
			this.abortController.abort()
		});
	}

	#sendEvent(type:string, payload:Object) {
		const timestamp = Date.now();
		const data = JSON.stringify({ type, payload, timestamp });

		return navigator.sendBeacon('/api/sendEvent', data);
	}

	route(url:string) {
		this.#sendEvent('route', { url });
	}

	purchase(products:ProductData[]) {
		const totalPrice = products.reduce((acc, product) => (acc += product.salePriceU), 0);
		const productIds = products.map(({ id }) => id);
		const orderId = genUUID();

		this.#sendEvent('purchase', {
			orderId,
			productIds,
			totalPrice
		})
	}

	addToCart(product:ProductData) {
		this.#sendEvent('addToCard', product);
	}

	viewCard(products:ProductData[], node:HTMLElement) {
		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach(async entry => {
				if (!entry.isIntersecting) { return }

				intersectionObserver.unobserve(entry.target);

				try {
					// @ts-ignore
					const index = entry.target._index;console.log(index)
					const product = products[index];
					const isPromo = Object.keys(product.log).length > 0;
					const type = isPromo ? 'viewCardPromo' : 'viewCard';

					const { signal } = this.abortController;
					const response = await fetch(`/api/getProductSecretKey?id=${product.id}`, { signal });
					const secretKey = await response.json();
					this.#sendEvent(type, { ...product, secretKey });
				}catch(e){}
			})
		});

		[].forEach.call(node.children, (element:HTMLElement, key) => {
			// @ts-ignore
			element._index = key;
			intersectionObserver.observe(element);
		});
	}
}

export default new EventAnalytics()