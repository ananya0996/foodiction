var cartItems = 0;
var idno = 4;

function fetchInventory() {
	var itemsList;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				itemsList = response.success;
				dispItems();
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
			var rmcol = document.createElement("td");

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img imsize";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			idcol.id = curr_item._id;
			idcol.innerHTML = curr_item._id;

			/*if(curr_item.indailymenu == true){
				var chec = document.createElement("button");
				chec.id = curr_item._id;
				chec.innerText = "Remove";
				chec.className = "rmbutton";
				//chec.onclick = ToggleDailyMenu;
				checkcol.appendChild(chec);	
			}
			else{
				var chec = document.createElement("button");
				chec.id = curr_item._id;
				chec.innerText = "Add";
				chec.className = "addbutton";
				//chec.onclick = ToggleDailyMenu;
				checkcol.appendChild(chec);		
			}*/

			var rm = document.createElement("button");
			rm.id = curr_item._id;
			rm.innerText = "Delete >>";
			rm.className = "rmbutton";
			rm.onclick = RemoveMasterMenuItem;
			rmcol.appendChild(rm);

			newRow.appendChild(imgcol);
			newRow.appendChild(idcol);
			newRow.appendChild(namecol);
			newRow.appendChild(qntycol);
			newRow.appendChild(rmcol);

			tbody.appendChild(newRow);
		}
	}
}

function CreateItem() {
	var nameInp = document.getElementById("Item").value;
	var qntyInp = document.getElementById("Quantity").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				console.log('response ' + response.success);
				updateTable(nameInp, qntyInp, response.success);
			}
		}
	}
	xhr.open('post', '/api/ingredient/');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: nameInp,
		qnty: qntyInp
	}));

	function updateTable(nameInp, qntyInp, idno) {
		console.log(idno)
		var tbody = document.getElementById("tbody");

		var newRow = document.createElement("tr");
		newRow.id = 'row' + idno;
		var imgcol = document.createElement("td");
		var namecol = document.createElement("td");
		var idcol = document.createElement("td");
		var qntycol = document.createElement("td");
		var rmcol = document.createElement("td");
		var img = document.createElement("img");
		img.src = "/images/food.png";
		img.className = "img-rounded food-img imsize";
		imgcol.appendChild(img);

		namecol.innerHTML = nameInp;
		namecol.id = "name" + idno;

		idcol.id = idno;
		idcol.innerHTML = idno;

		qntycol.id = "qnty" + idno;
		qntycol.innerHTML = qntyInp;

		var rm = document.createElement("button");
		rm.id = idno;
		rm.innerText = "Delete >>";
		rm.className = "rmbutton";
		rm.onclick = RemoveMasterMenuItem;
		rmcol.appendChild(rm);

		newRow.appendChild(imgcol);
		newRow.appendChild(idcol);
		newRow.appendChild(namecol);
		newRow.appendChild(qntycol);
		newRow.appendChild(rmcol);

		tbody.appendChild(newRow);
	}
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

/*function ToggleDailyMenu() {

	var item = event.target;
	var itemId = item.id;
	if(item.className == "addbutton"){
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4 && xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				if(response.success) {
					item.innerText = "Remove";
					item.className = "rmbutton";
				}
			}
		}
		xhr.open('post', '/api/item/');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({id: itemId}));	
	}
	else if(item.className == "rmbutton"){
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4 && xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				if(response.success) {
					item.innerText = "Add";
					item.className = "addbutton";
				}
			}
		}
		xhr.open('delete', '/api/item/' + itemId);
		xhr.send();	
	}


}*/