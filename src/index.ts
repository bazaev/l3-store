import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";

new Router();
cartService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
