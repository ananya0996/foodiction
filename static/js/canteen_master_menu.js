var cartItems = 0;
var idno = 4;

function fetchMasterMenuItems() {
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
	xhr.open('get', '/api/item/master_menu_items');
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
			var namecol = document.createElement("td");
			var ratecol = document.createElement("td");
			var checkcol = document.createElement("td");
			var rmcol = document.createElement("td");

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img imsize";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			ratecol.id = "rate" + curr_item._id;
			ratecol.innerHTML = curr_item.rate;

			if(curr_item.indailymenu == true){
				var chec = document.createElement("button");
				chec.id = curr_item._id;
				chec.innerText = "Remove";
				chec.className = "rmbutton";
				chec.onclick = ToggleDailyMenu;
				checkcol.appendChild(chec);	
			}
			else{
				var chec = document.createElement("button");
				chec.id = curr_item._id;
				chec.innerText = "Add";
				chec.className = "addbutton";
				chec.onclick = ToggleDailyMenu;
				checkcol.appendChild(chec);		
			}

			var rm = document.createElement("button");
			rm.id = curr_item._id;
			rm.innerText = "Delete >>";
			rm.className = "rmbutton";
			rm.onclick = RemoveMasterMenuItem;
			rmcol.appendChild(rm);

			newRow.appendChild(imgcol);
			newRow.appendChild(namecol);
			newRow.appendChild(ratecol);
			newRow.appendChild(checkcol);
			newRow.appendChild(rmcol);

			tbody.appendChild(newRow);
		}
	}
}

function CreateMasterMenuItem() {
	var nameInp = document.getElementById("Item").value;
	var rateInp = document.getElementById("Price").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				console.log(response.success);
				updateTable(nameInp, rateInp, response.success);
			}
		}
	}
	xhr.open('post', '/api/item/master_menu_item');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: nameInp,
		rate: rateInp
	}));

	function updateTable(nameInp, rateInp, {_id: idno}) {
		console.log(idno)
		var tbody = document.getElementById("tbody");

		var newRow = document.createElement("tr");
		newRow.id = 'row' + idno;
		var imgcol = document.createElement("td");
		var namecol = document.createElement("td");
		var ratecol = document.createElement("td");
		var checkcol = document.createElement("td");
		var rmcol = document.createElement("td");
		var img = document.createElement("img");
		img.src = "/images/food.png";
		img.className = "img-rounded food-img imsize";
		imgcol.appendChild(img);

		namecol.innerHTML = nameInp;
		namecol.id = "name" + idno;

		ratecol.id = "rate" + idno;
		ratecol.innerHTML = rateInp;

		var chec = document.createElement("button");
		chec.id = idno;
		chec.innerText = "Add";
		chec.className = "addbutton";
		chec.onclick = ToggleDailyMenu;
		checkcol.appendChild(chec);

		var rm = document.createElement("button");
		rm.id = idno;
		rm.innerText = "Delete >>";
		rm.className = "rmbutton";
		rm.onclick = RemoveMasterMenuItem;
		rmcol.appendChild(rm);

		newRow.appendChild(imgcol);
		newRow.appendChild(namecol);
		newRow.appendChild(ratecol);
		newRow.appendChild(checkcol);
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
	
	xhr.open('delete', '/api/item/master_menu_item/' + itemId);
	xhr.send(null);

}

function ToggleDailyMenu() {

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


}