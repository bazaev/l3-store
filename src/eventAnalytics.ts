import { ProductData } from "types";

class EventAnalytics {

	#sendEvent(type:string, payload:Object) {
		const timestamp = Date.now();
		fetch('/api/sendEvent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ type, payload, timestamp })
		});
	}

	route(url:string) {
		this.#sendEvent('route', { url });
	}

	purchase(products:ProductData[]) {
		const totalPrice = products.reduce((acc, product) => (acc += product.salePriceU), 0);
		const productIds = products.map(({ id }) => id);
		const orderId = Math.floor(Math.random() * 1000000);

		this.#sendEvent('purchase', {
			orderId,
			productIds,
			totalPrice
		})
	}

	addToCart(product:ProductData) {
		this.#sendEvent('addToCard', product);
	}

	viewCard(products:ProductData[], root:HTMLElement) {
		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// @ts-ignore
					const index = entry.target._index;
					const product = products[index];
					const isPromo = Object.keys(product.log).length > 0;
					const type = isPromo ? 'viewCardPromo' : 'viewCard';
					
					fetch(`/api/getProductSecretKey?id=${product.id}`)
						.then(response => response.json())
						.then(secretKey => {
							this.#sendEvent(type, { ...product, secretKey });
						});
				  }
			})
		});

		[].forEach.call(root.children, (element:HTMLElement, key) => {
			// @ts-ignore
			element._index = key;
			intersectionObserver.observe(element);
		});
	}
}

export default new EventAnalytics()