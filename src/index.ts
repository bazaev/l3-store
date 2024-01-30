import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";

window.addEventListener('load', async e => {
  e.preventDefault();
  
  await userService.init();
  new Router();
  cartService.init();
});

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
