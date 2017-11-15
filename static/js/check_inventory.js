var cartItems = 0;
var idno = 4;

function fetchInventory() {
	var itemsList;
	const ws = new WebSocket('ws://localhost:8888');
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				itemsList = response.success;
				dispItems();
				ws.addEventListener('message', ({data}) => {
					data = JSON.parse(data);
					if(data.inventoryUpdate) {
						itemsList = data.inventoryUpdate;
						const isCritical = itemsList.filter(item => item.quantity < 0).length > 0;
						if(isCritical) {
							alert('Inventory quantities are insufficient for 1 or more ingredients');
						}
						document.getElementById("tbody").innerHTML = '';
						dispItems();
					}
				});
			}
		}
	}
	xhr.open('get', '/api/ingredient/');
	xhr.send(null);


	function dispItems()
	{
		var tbody = document.getElementById("tbody");
		for(var i = 0; i < itemsList.length; ++i)
		{
			var curr_item = itemsList[i];
			var newRow = document.createElement("tr");
			newRow.id = 'row' + curr_item._id;
			var imgcol = document.createElement("td");
			var idcol = document.createElement("td");
			var namecol = document.createElement("td");
			var qntycol = document.createElement("td");
			var prccol = document.createElement("td");
			var rmcol = document.createElement("td");

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img imsize";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			idcol.id = curr_item._id;
			idcol.innerHTML = curr_item._id;

			qntycol.innerHTML = curr_item.quantity;

			prccol.innerHTML = curr_item.price;

			var rm = document.createElement("button");
			rm.id = curr_item._id;
			rm.innerText = "Delete >>";
			rm.className = "rmbutton";
			rm.onclick = RemoveMasterMenuItem;
			rmcol.appendChild(rm);

			newRow.appendChild(imgcol);
			//newRow.appendChild(idcol);
			newRow.appendChild(namecol);
			newRow.appendChild(qntycol);
			newRow.appendChild(prccol);
			newRow.appendChild(rmcol);

			tbody.appendChild(newRow);
		}
	}
}

function CreateItem() {
	var nameInp = document.getElementById("Item").value;
	var qntyInp = document.getElementById("Quantity").value;
	var prcInp = document.getElementById("Price").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				updateTable(nameInp, qntyInp, prcInp, response.success);
			}
		}
	}
	xhr.open('post', '/api/ingredient/');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: nameInp,
		price: parseFloat(prcInp) / parseFloat(qntyInp),
	}));

	function updateTable(nameInp, qntyInp, prcInp, idno) {
		var tbody = document.getElementById("tbody");

		var newRow = document.createElement("tr");
		newRow.id = 'row' + idno;
		var imgcol = document.createElement("td");
		var namecol = document.createElement("td");
		var idcol = document.createElement("td");
		var qntycol = document.createElement("td");
		var prccol = document.createElement("td");
		var rmcol = document.createElement("td");
		var img = document.createElement("img");
		img.src = "/images/food.png";
		img.className = "img-rounded food-img imsize";
		imgcol.appendChild(img);

		namecol.innerHTML = nameInp;
		namecol.id = "name" + idno;

		idcol.id = idno;
		idcol.innerHTML = parseInt("0x" + idno.slice(-3));

		qntycol.id = "qnty" + idno;
		qntycol.innerHTML = qntyInp;

		prccol.id = "prc" + idno;
		prccol.innerHTML = prcInp / qntyInp;

		var rm = document.createElement("button");
		rm.id = idno;
		rm.innerText = "Delete >>";
		rm.className = "rmbutton";
		rm.onclick = RemoveMasterMenuItem;
		rmcol.appendChild(rm);

		newRow.appendChild(imgcol);
		//newRow.appendChild(idcol);
		newRow.appendChild(namecol);
		newRow.appendChild(qntycol);
		newRow.appendChild(prccol);
		newRow.appendChild(rmcol);

		tbody.appendChild(newRow);
	}
	//document.getElementById("Item").value='';
	//document.getElementById("Quantity").value='';
	//document.getElementById("Price").value='';
	document.location.reload();
}

function RemoveMasterMenuItem() {

	var itemId = event.target.id;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				document.getElementById('row' + itemId).remove();
			}
		}
	}

	xhr.open('delete', '/api/ingredient/' + itemId);
	xhr.send(null);

}
