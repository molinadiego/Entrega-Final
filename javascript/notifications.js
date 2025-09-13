export function notificationSell(ticket) {
	return Swal.fire({
		title: "Ticket de compra",
		text: ticket,
		icon: "",
		showCancelButton: true,
		confirmButtonText: "Pagar",
		cancelButtonText: "Cancelar",
		confirmButtonColor: "#4e342e",
		cancelButtonColor: "#4e342e",
	});
}
