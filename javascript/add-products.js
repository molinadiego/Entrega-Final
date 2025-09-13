const name = document.getElementById("aname");
const descrition = document.getElementById("description");
const image = document.getElementById("image");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const btnAdd = document.getElementById("btn-guardar");
const btnExit = document.getElementById("btn-salir");

btnAdd.addEventListener("click", (e) => {
	e.preventDefault();
	const productsFromStorage = localStorage.getItem("products");
	console.log(productsFromStorage);
	const products = JSON.parse(productsFromStorage);
	const newProduct = {
		id: products.length + 1,
		name: aname.value,
		image: "images/" + image.value + ".webp",
		description: descrition.value,
		price: parseInt(price.value),
		stock: parseInt(stock.value),
	};
	products.push(newProduct);
	console.log(newProduct);
	console.log(products);
	localStorage.setItem("products", JSON.stringify(products));
	aname.value = "";
	image.value = "";
	descrition.value = "";
	price.value = "";
	stock.value = "";
});

btnExit.addEventListener("click", (e) => {
	e.preventDefault();
	history.back();
});
