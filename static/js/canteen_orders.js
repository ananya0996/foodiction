function setupOrders() {
	const ws = new WebSocket('ws://localhost:8888');
	ws.addEventListener('message', ({data}) => {
		data = JSON.parse(data);
		if(data.newOrder) {
			console.log('here');
			addOrder(data.newOrder);
		}
	});


	tb = document.getElementById("tablebody");
	var tr;
	var	td;
	//Recieve Data in a list called "orderArray"
	var orderArray;

	function addOrder(order) {
		tr = document.createElement("tr");
		tr.id = order["id"];
		td = document.createElement("td");
		td.innerHTML = order["id"];
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = JSON.stringify(order["items"]);
		tr.appendChild(td);
		tb.appendChild(tr);
	}


	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				orderArray = response.success;
				displayOrders();
			}
		}
	}
	xhr.open('get', '/api/order');
	xhr.send(null);

	function displayOrders() {
	 	for(var i=0; i<orderArray.length; ++i) {
			tr = document.createElement("tr");
			tr.id = "d"+orderArray[i]["_id"];
			td = document.createElement("td");
			td.innerHTML = orderArray[i]["_id"];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML = JSON.stringify(orderArray[i]["items"]);
			tr.appendChild(td);
			tb.appendChild(tr);
		}
	}
}
