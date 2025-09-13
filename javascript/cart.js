import { messageSuccess, mostrarToast } from "./message.js";
import {
	getCartFromStorage,
	getProductsFromStorage,
	saveCartOnLocalStorage,
	saveProductsOnLocalStorage,
} from "./storage.js";

const TAX = 1.084;
const DISCOUNT = 0.1;

const plusTax = (priceTotal, TAX) => priceTotal * TAX;
const applyDiscount = (priceTotalWithTax, DISCOUNT) =>
	priceTotalWithTax * (1 - DISCOUNT);
const btnPay = document.getElementById("btnPay");

/**
 * Calcula el ticket de la compra.
 * @param {Array} cart - El array del carrito.
 * @returns {object} - Un objeto con los totales de la compra.
 */
function calculateTicket(cart) {
	let priceTotal = 0;
	let productQty = 0;

	for (const item of cart) {
		priceTotal += item.totalprice;
		productQty += item.quantity;
	}

	const priceTotalWithTax = plusTax(priceTotal, TAX);
	let priceWithDiscount = priceTotalWithTax;

	if (productQty >= 5) {
		priceWithDiscount = applyDiscount(priceTotalWithTax, DISCOUNT);
	}

	return {
		priceTotal: priceTotal.toFixed(2),
		priceTotalWithTax: priceTotalWithTax.toFixed(2),
		priceWithDiscount: priceWithDiscount.toFixed(2),
		productQty: productQty,
	};
}

/**
 * Función principal para renderizar el carrito en la página
 */
function renderCart() {
	const cartItemsContainer = document.getElementById("cart-items");
	const cartSummaryContainer = document.getElementById("cart-summary");

	// Obtener los datos del carrito de `localStorage` de manera local para la función
	const cartFromStorage = getCartFromStorage();
	// Si no hay nada, el carrito es un array vacío
	const cart = cartFromStorage ? cartFromStorage : [];

	// Limpia el contenedor para evitar duplicados
	cartItemsContainer.innerHTML = "";

	if (cart.length === 0) {
		cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
		cartSummaryContainer.innerHTML = "";
		localStorage.removeItem("cart");
		return;
	}

	// Muestra los productos en el HTML
	cart.forEach((item) => {
		// Crea el contenedor principal del ítem
		const itemDiv = document.createElement("div");
		itemDiv.className = "cart-item";

		// creo contenedor para los botones de  +, - y delete.
		const buttonDiv = document.createElement("div");
		buttonDiv.className = "button-content";

		// Crea los elementos para los detalles del producto de forma segura
		const detailsSpan = document.createElement("span");
		detailsSpan.textContent = `${item.quantity} x ${
			item.name
		} ($${item.price.toFixed(2)})`;

		const totalSpan = document.createElement("span");
		totalSpan.textContent = `Total: $${item.totalprice.toFixed(2)}`;

		const btnPlus = document.createElement("button");
		btnPlus.textContent = "+ Sumar";
		btnPlus.className = "btn-plus";
		btnPlus.setAttribute("data-name", item.name);
		//btnPlus.setAttribute("data-totalprice", item.totalprice);

		const btnMinus = document.createElement("button");
		btnMinus.textContent = "- Restar";
		btnMinus.className = "btn-minus";
		btnMinus.setAttribute("data-name", item.name);
		btnMinus.setAttribute("data-qty", item.quantity);

		const btnDelete = document.createElement("button");
		btnDelete.textContent = "X Eliminar";
		btnDelete.className = "btn-Delete";
		btnDelete.setAttribute("data-name", item.name);
		btnDelete.setAttribute("data-qty", item.quantity);

		itemDiv.appendChild(detailsSpan);
		itemDiv.appendChild(totalSpan);
		buttonDiv.appendChild(btnPlus);
		buttonDiv.appendChild(btnMinus);
		buttonDiv.appendChild(btnDelete);
		itemDiv.appendChild(buttonDiv);

		cartItemsContainer.appendChild(itemDiv);
	});

	// Calcula y muestra el resumen de la compra
	const summary = calculateTicket(cart);
	let summaryHTML = `<p><strong>Precio Total:</strong> $${summary.priceTotal}</p>`;
	summaryHTML += `<p><strong>Total con Impuestos (8.4%):</strong> $${summary.priceTotalWithTax}</p>`;

	if (summary.productQty >= 5) {
		summaryHTML += `<p><strong>Total a Pagar (con 10% de descuento):</strong> $${summary.priceWithDiscount}</p>`;
	}

	cartSummaryContainer.innerHTML = summaryHTML;

	// Lógica para el botón de eliminar
	const deleteButtons = document.querySelectorAll(".btn-Delete");
	deleteButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const itemRemove = e.target.getAttribute("data-name");
			const itemQty = e.target.getAttribute("data-qty");

			let cart = getCartFromStorage();
			let products = getProductsFromStorage();

			//vuelvo a sumar los productos eliminados del carrito al stock.
			let product = products.find((item) => item.name === itemRemove);
			product.stock = product.stock + parseInt(itemQty);

			const text = product.name + " fue eliminado con exito!";
			mostrarToast("info", text);

			// Filtrar el carrito para eliminar el ítem
			cart = cart.filter((item) => item.name !== itemRemove);

			saveCartOnLocalStorage(cart);
			saveProductsOnLocalStorage(products);

			// Volver a renderizar la vista
			renderCart();
		});
	});

	// logica para el boton de agregar.
	const plusButtons = document.querySelectorAll(".btn-plus");
	plusButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const itemPlus = e.target.getAttribute("data-name");

			let cart = getCartFromStorage();
			let products = getProductsFromStorage();

			// Descuento del stock el item agregado de productos y sumo el producto al carrito.
			let product = products.find((item) => item.name === itemPlus);
			if (product.stock >= 1) {
				product.stock = product.stock - 1;
				let cartItem = cart.find((item) => item.name === itemPlus);
				cartItem.quantity = cartItem.quantity + 1;
				cartItem.totalprice = cartItem.price * cartItem.quantity;

				const text = cartItem.name + " agregado con exito!";
				mostrarToast("success", text);
			} else {
				messageSuccess("error", "Stock", "No tenemos mas " + product.name);
			}

			saveCartOnLocalStorage(cart);
			saveProductsOnLocalStorage(products);

			// Volver a renderizar la vista
			renderCart();
		});
	});

	// Lógica para el botón de eliminar 1 item.
	const minusButtons = document.querySelectorAll(".btn-minus");
	minusButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const itemRemove = e.target.getAttribute("data-name");
			const itemQty = e.target.getAttribute("data-qty");

			let cart = getCartFromStorage();
			let products = getProductsFromStorage();

			// Filtrar el carrito para eliminar el ítem
			let cartMinus = cart.find((item) => item.name === itemRemove);

			if (cartMinus.quantity > 1) {
				cartMinus.quantity = cartMinus.quantity - 1;
				cartMinus.totalprice -= cartMinus.price;
				//vuelvo a sumar los productos eliminados del carrito al stock.
				let product = products.find((item) => item.name === itemRemove);
				product.stock = product.stock + 1;

				const text = cartMinus.name + " fue eliminado con exito!";
				mostrarToast("info", text);
			} else {
				// Filtrar el carrito para eliminar el ítem
				cart = cart.filter((item) => item.name !== itemRemove);
				//vuelvo a sumar los productos eliminados del carrito al stock.
				let product = products.find((item) => item.name === itemRemove);
				product.stock = product.stock + parseInt(itemQty);

				const text = cartMinus.name + " fue eliminado con exito!";
				mostrarToast("info", text);
			}

			saveCartOnLocalStorage(cart);
			saveProductsOnLocalStorage(products);

			// Volver a renderizar la vista
			renderCart();
		});
	});
}

btnPay.addEventListener("click", () => {
	messageSuccess("success", "Confirmacion de pago", "gracias por su compra");
	localStorage.removeItem("cart");
	renderCart();
});

// Llama a la función `renderCart` cuando la página se carga
document.addEventListener("DOMContentLoaded", renderCart);
