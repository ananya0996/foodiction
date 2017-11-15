function setupOrders() {
	const ws = new WebSocket('ws://localhost:8888');

	let itemsMap = null;
	const initXhr = new XMLHttpRequest();
	initXhr.open('get', '/api/item');
	initXhr.onreadystatechange = function() {
		if(initXhr.readyState === 4 && initXhr.status === 200) {
			const response = JSON.parse(initXhr.responseText);
			if(response.success) {
				itemsArray = response.success;
				itemsMap = new Map(itemsArray.map(({_id, name}) => [_id, name]));
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
				xhr.open('get', '/api/order?status=0');
				xhr.send(null);
				ws.addEventListener('message', ({data}) => {
					data = JSON.parse(data);
					console.log(data);
					if(data.placedOrder) {
						addOrder(data.placedOrder);
					}
				});
			}
		}
	};
	initXhr.send();


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
		td.innerHTML =  order["items"].map(item => `${itemsMap.get(item.id)} - ${item.qty}`).join('<br/>');//JSON.stringify(order["items"];
		tr.appendChild(td);
		td = document.createElement("td");
		var serviceButton = document.createElement('button');
		serviceButton.innerText = 'Service';
		serviceButton.id = order["id"];
		serviceButton.onclick = (function(tr) {
			return function(evt) {
					var servicedXhr = new XMLHttpRequest();
					servicedXhr.open('put', `/api/order/${evt.target.id}`);
					servicedXhr.setRequestHeader('Content-Type', 'application/json');
					servicedXhr.send(JSON.stringify({status: 1}));
					tb.removeChild(tr);
			}
		})(tr);
		td.appendChild(serviceButton);
		tr.appendChild(td);
		tb.appendChild(tr);
	}

	function displayOrders() {
	 	for(var i=0; i<orderArray.length; ++i) {
			tr = document.createElement("tr");
			tr.id = "d"+orderArray[i]["_id"];
			td = document.createElement("td");
			td.innerHTML = orderArray[i]["_id"];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML =  orderArray[i].items.map(item => `${itemsMap.get(item.id)} - ${item.qty}`).join('<br/>');//JSON.stringify(order["items"];
			tr.appendChild(td);
			td = document.createElement("td");
			var serviceButton = document.createElement('button');
			serviceButton.innerText = 'Service';
			serviceButton.id = orderArray[i]["_id"];
			serviceButton.onclick = (function(tr) {
				return function(evt) {
						var servicedXhr = new XMLHttpRequest();
						servicedXhr.open('put', `/api/order/${evt.target.id}`);
						servicedXhr.setRequestHeader('Content-Type', 'application/json');
						servicedXhr.send(JSON.stringify({status: 1}));
						tb.removeChild(tr);
				}
			})(tr);
			td.appendChild(serviceButton);
			tr.appendChild(td);
			tb.appendChild(tr);
		}
	}
}
