const Toast = Swal.mixin({
	toast: true,
	position: "bottom-end",
	showConfirmButton: false,
	timer: 2000,
	timerProgressBar: true,
});

export async function messageSuccess(icon, title, textMessage) {
	const result = await Swal.fire({
		icon: icon,
		title: title,
		text: textMessage,
	});
	return result;
}

export async function mostrarToast(icon, title) {
	await Toast.fire({
		icon: icon,
		title: title,
	});
}
