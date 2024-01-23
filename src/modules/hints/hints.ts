import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from "../../utils/view";
import html from './hints.tpl.html';

class Hints {
	view: View;
	hintsCount = 3;

	constructor() {
		this.view = new ViewTemplate(html).cloneView();
	}

	attach($root: HTMLElement) {
	  $root.appendChild(this.view.root);
	}

	async render() {
		let hints = [
			{
				title: 'чехол iphone 13 pro',
				href: '#'
			}, {
				title: 'коляски agex',
				href: '#'
			}, {
				title: 'яндекс станция 2',
				href: '#'
			}, {
				title: 'коляски agex',
				href: '#'
			}, {
				title: 'яндекс станция 2',
				href: '#'
			}
		];

		hints = hints.slice(0, this.hintsCount);

		this.view.root.append("Например");

		hints.forEach((hint, key) => {
			if (key === this.hintsCount - 1) {
				this.view.root.append("или");
			}else{
				this.view.root.append(",");
			}

			const { title, href } = hint;
			
			const $hint = document.createElement('a');
			$hint.classList.add('hints__hint');
			$hint.innerText = title;
			$hint.href = href;
			
			this.view.root.appendChild($hint);
		})
	}
}

export const hintsComp = new Hints();