async function getDatos() {
	try {
		// La ruta "/json/products.json" asume que tienes una carpeta "json" en la raíz de tu proyecto.
		const response = await fetch("/json/products.json");

		// 1. Verificar si la respuesta fue exitosa (código de estado 200-299)
		if (!response.ok) {
			// Si la respuesta no es OK, lanzamos un error con un mensaje descriptivo.
			throw new Error(
				`Error en la solicitud: ${response.status} ${response.statusText}`
			);
		}

		// 2. Si la respuesta es OK, procedemos a parsear el JSON.
		// El método .json() también podría fallar, por lo que está dentro del mismo try-catch.
		const products = await response.json();

		// 3. Devolver los datos.
		return products;
	} catch (error) {
		// Capturar y mostrar el error de forma más informativa.
		// El mensaje de error ahora incluirá la causa específica, como un 404.
		console.error("No se pudieron obtener los productos:", error.message);

		// Es una buena práctica devolver un valor (ej. un array vacío)
		// o lanzar el error de nuevo para que el código que llama a la función lo sepa.
		return [];
	}
}

export async function getProducts() {
	const productsFromStorage = localStorage.getItem("products");
	if (productsFromStorage) {
		const products = JSON.parse(productsFromStorage);
		return products;
	} else {
		const productsjson = await getDatos();
		localStorage.setItem("products", JSON.stringify(productsjson));
		return productsjson;
	}
}

export function getCartFromStorage() {
	let cart = JSON.parse(localStorage.getItem("cart"));
	return cart;
}

export function getProductsFromStorage() {
	let products = JSON.parse(localStorage.getItem("products"));
	return products;
}

export function saveCartOnLocalStorage(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
}

export function saveProductsOnLocalStorage(products) {
	localStorage.setItem("products", JSON.stringify(products));
	return products;
}
