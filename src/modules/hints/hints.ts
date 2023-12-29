import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from "../../utils/view";
import html from './hints.tpl.html';

class Hints {
	view: View;

	constructor() {
		this.view = new ViewTemplate(html).cloneView();
	}

	attach($root: HTMLElement) {
	  $root.appendChild(this.view.root);
	}

	async render() {
		const hints = ['чехол iphone 13 pro', 'коляски agex', 'яндекс станция 2'];

		this.view.hint1.innerText = hints[0];
		this.view.hint2.innerText = hints[1];
		this.view.hint3.innerText = hints[2];
	}
}

export const hintsComp = new Hints();