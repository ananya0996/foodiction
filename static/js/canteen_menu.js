var cartItems = 0;
var idno = 4;

var currDate = new Date();
var dd = currDate.getDate();
var mm = currDate.getMonth()+1; //January is 0!
var yyyy = currDate.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

currDate = dd + '/' + mm + '/' + yyyy;

function fetchItems() {
	var masterMenuItemsList, itemsList = [];
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				masterMenuItemsList = response.success;
				addToCurrentDayItemsList();
				itemsList = getItemsList();
			}
		}
	}
	xhr.open('get', '/api/item/master_menu_items');
	xhr.send(null);

	function addToCurrentDayItemsList(){
		for(var i = 0; i < masterMenuItemsList.length; ++i)
		{
			var curr_item = masterMenuItemsList[i];
			var nameInp = curr_item.name;
			var rateInp = curr_item.rate;
		
			const xhrTemp = new XMLHttpRequest();
			xhrTemp.onreadystatechange = function() {
				if(xhrTemp.readyState === 4 && xhrTemp.status === 200) {
					const response = JSON.parse(xhrTemp.responseText);
					if(response.success) {
						
					}
				}
			}
			xhrTemp.open('post', '/api/item');
			xhrTemp.setRequestHeader('Content-Type', 'application/json');
			xhrTemp.send(JSON.stringify({
				name: nameInp,
				rate: rateInp,
				date: currDate
			}));
		}

	}

	function getItemsList(){
		var items;
		const xhrTemp = new XMLHttpRequest();
		xhrTemp.onreadystatechange = function() {
			if(xhrTemp.readyState === 4 && xhrTemp.status === 200) {
				console.log(xhrTemp.responseText);
				const response = JSON.parse(xhrTemp.responseText);
				if(response.success) {
					items = response.success;
					dispItems(items);
					return items;
				}
			}
		}
		xhrTemp.open('get', '/api/item/');
		xhrTemp.send(null);
		console.log(items);

	}

	function dispItems(itemsList)
	{
		var tbody = document.getElementById("tbody");
		for(var i = 0; i < itemsList.length; ++i)
		{
			var curr_item = itemsList[i];
			var newRow = document.createElement("tr");
			newRow.id = 'row' + curr_item._id;
			var imgcol = document.createElement("td");
			var namecol = document.createElement("td");
			var ratecol = document.createElement("td");
			var rmcol = document.createElement("td");

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img imsize";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			ratecol.id = "rate" + curr_item._id;
			ratecol.innerHTML = curr_item.rate;


			var rm = document.createElement("button");
			rm.id = curr_item._id;
			rm.innerText = "Delete >>";
			rm.className = "rmbutton";
			rm.onclick = RemoveItem;
			rmcol.appendChild(rm);

			newRow.appendChild(imgcol);
			newRow.appendChild(namecol);
			newRow.appendChild(ratecol);
			newRow.appendChild(rmcol);

			tbody.appendChild(newRow);
		}
	}
}

function CreateItem() {
	var nameInp = document.getElementById("Item").value;
	var rateInp = document.getElementById("Price").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				updateTable(nameInp, rateInp, response.success);
			}
		}
	}
	xhr.open('post', '/api/item');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: nameInp,
		rate: rateInp,
		date: currDate
	}));

	function updateTable(nameInp, rateInp, idno) {
		var tbody = document.getElementById("tbody");

		var newRow = document.createElement("tr");
		newRow.id = 'row' + idno;
		var imgcol = document.createElement("td");
		var namecol = document.createElement("td");
		var ratecol = document.createElement("td");
		var rmcol = document.createElement("td");
		console.log("Here1");

		var img = document.createElement("img");
		img.src = "/images/food.png";
		img.className = "img-rounded food-img imsize";
		imgcol.appendChild(img);

		console.log("Here2");
		console.log(nameInp);
		console.log(rateInp);
		namecol.innerHTML = nameInp;
		namecol.id = "name" + idno;

		ratecol.id = "rate" + idno;
		ratecol.innerHTML = rateInp;


		var rm = document.createElement("button");
		rm.id = "remove" + idno;
		rm.innerText = "Delete >>";
		rm.className = "rmbutton";
		rm.onclick = RemoveItem;
		rmcol.appendChild(rm);

		newRow.appendChild(imgcol);
		newRow.appendChild(namecol);
		newRow.appendChild(ratecol);
		newRow.appendChild(rmcol);

		tbody.appendChild(newRow);
		idno = idno + 1;
	}
}

function RemoveItem() {
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
	
	xhr.open('delete', '/api/item/' + itemId);
	xhr.send(null);
}
