var cartItems = 0;
var idno = 4;

function fetchItems() {
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
	xhr.open('get', '/api/item');
	xhr.send(null);

	function dispItems()
	{
		var tbody = document.getElementById("tbody");
		for(var i = 0; i < itemsList.length; ++i)
		{
			var curr_item = itemsList[i];
			var newRow = document.createElement("tr");
			newRow.id = curr_item._id;
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
			rm.id = "remove" + curr_item._id;
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
		rate: rateInp
	}));

	function updateTable(nameInp, rateInp, idno) {
		var tbody = document.getElementById("tbody");

		var newRow = document.createElement("tr");

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

}
