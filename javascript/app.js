// Llama a esta función una vez al inicio de tu script

import { messageSuccess, mostrarToast } from "./message.js";
import {
	getCartFromStorage,
	getProducts,
	getProductsFromStorage,
	saveCartOnLocalStorage,
	saveProductsOnLocalStorage,
} from "./storage.js";

let cart = [];
let tax = 0;
let priceTotal = 0;
let priceTotalWithTax = 0;
let priceWithDiscount = 0;

// Simulador entrega #1.
//const btnAddCart = document.querySelectorAll(".add-to-cart-btn");
const cartQty = document.querySelector(".cart-btn");
const cartBtn = document.querySelector(".cart-btn");
const txtSearch = document.getElementById("txtSearch");
const btnSearch = document.getElementById("btnSearch");
const btnAdd = document.getElementById("btnAdd");

let qty = 0;

function fillCartButton(cartFromStorage) {
	if (cartFromStorage) {
		cart = cartFromStorage; //JSON.parse(cartFromStorage);
		for (let item of cart) {
			qty = item.quantity + qty;
		}
		cartQty.textContent = "🛒 (" + qty + ")";
	}
}

/**
 *
 * @param {String} name
 * @param {Number} quantity
 */

function fillCart(name, quantity) {
	let products = getProductsFromStorage();
	//products = JSON.parse(products);
	const exist = cart.some((item) => item.name === name);
	const product = products.find((product) => product.name === name);
	if (product === undefined) {
		messageSuccess("warning", "Atencion!", "codigo de producto no encontrado");
		return;
	}
	if (exist && product.stock >= quantity) {
		const productExist = cart.find((product) => product.name === name);
		productExist.quantity += quantity;
		productExist.totalprice = productExist.price * productExist.quantity;
		product.stock = product.stock - quantity;
		mostrarToast("success", product.name + " fue agredado al carrito!");
		saveProductsOnLocalStorage(products);
		return [, products];
	}

	if (product.stock >= quantity) {
		let description = product.type;
		let name = product.name;
		let price = product.price;
		let totalprice = price * quantity;
		cart.push({
			description: description,
			name: name,
			quantity: quantity,
			price: price,
			totalprice: totalprice,
		});
		product.stock = product.stock - quantity;
		mostrarToast("success", product.name + " fue agredado al carrito!");
		saveProductsOnLocalStorage(products);
		return [, products];
	} else {
		messageSuccess("error", "Stock", "No tenemos mas " + product.name);
		return -1;
	}
}

function setupEventListeners(products) {
	const productContainerVino = document.querySelector(".product-grid-vino");
	const productContainerWhisky = document.querySelector(".product-grid-whisky");
	const handleProductClick = (e) => {
		//verifico si el elemento clickeado es un boton agregar al carrito.
		if (e.target.classList.contains("add-to-cart-btn")) {
			const productCard = e.target.closest(".product-card");
			const productName =
				productCard.querySelector(".product-title").textContent;

			//llama a la funcion para llenar el carrito.
			const [has, products] = fillCart(productName, 1);
			if (has !== -1) {
				qty += 1;
				cartQty.textContent = "🛒 (" + qty + ")";
				saveCartOnLocalStorage(cart);
				saveProductsOnLocalStorage(products);
			}
			renderProducts(products);
		}
	};
	productContainerVino.addEventListener("click", handleProductClick);
	productContainerWhisky.addEventListener("click", handleProductClick);
}

function renderProducts(productsParam) {
	const productContainerVino = document.querySelector(".product-grid-vino");
	const productContainerWhisky = document.querySelector(".product-grid-whisky");
	productContainerVino.innerHTML = "";
	productContainerWhisky.innerHTML = "";

	productsParam.forEach((item) => {
		const img = document.createElement("img");
		img.setAttribute("src", item.image);
		img.setAttribute("alt", item.description + " " + item.name);

		const productCard = document.createElement("div");
		productCard.className = "product-card";

		const productInfo = document.createElement("div");
		productInfo.className = "product-info";

		//const productType = document.createElement("h2");
		//productType.className = "product-type";
		//productType.textContent = item.type;

		const productName = document.createElement("h3");
		productName.className = "product-title";
		productName.textContent = item.name;

		const productDescription = document.createElement("p");
		productDescription.className = "product-description";
		productDescription.textContent = item.description;

		const productPrecio = document.createElement("p");
		productPrecio.className = "product-price";
		productPrecio.textContent = "$ " + item.price;

		const productStock = document.createElement("p");
		productStock.className = "product-stock";
		productStock.textContent = "Cantidad disponible: " + item.stock;

		const btnAddCart = document.createElement("button");
		btnAddCart.className = "add-to-cart-btn";
		btnAddCart.textContent = "Agregar al carrito";

		productInfo.appendChild(productName);
		productInfo.appendChild(productDescription);
		productInfo.appendChild(productPrecio);
		productInfo.appendChild(productStock);
		productInfo.appendChild(btnAddCart);

		productCard.appendChild(img);
		//productCard.appendChild(productType);
		productCard.appendChild(productInfo);

		if (item.type === "vino") {
			productContainerVino.appendChild(productCard);
		} else {
			productContainerWhisky.appendChild(productCard);
		}
	});
}

btnSearch.addEventListener("click", (e) => {
	let products = getProductsFromStorage();
	const search = txtSearch.value;
	const productSearch = products.filter((item) =>
		item.name.toLowerCase().includes(search.toLowerCase())
	);
	txtSearch.value = "";
	renderProducts(productSearch);
});

cartBtn.addEventListener("click", () => {
	if (qty !== 0) {
		window.location.href = "./html/cart.html";
		qty = 0;
		cartQty.textContent = "🛒 (" + qty + ")";
		cart = [];
	}
});

//btnAdd.addEventListener("click", () => {
//	window.location.href = "add-products.html";
//});

document.addEventListener("DOMContentLoaded", async () => {
	// Asume que 'products' está cargado aquí
	let products = await getProducts();
	renderProducts(products);

	setupEventListeners(products);
	// Llama a la función para configurar el listener
});

const cartFromStorage = getCartFromStorage();
fillCartButton(cartFromStorage);
