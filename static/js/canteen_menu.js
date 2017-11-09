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
	var masterMenuItemsList;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				masterMenuItemsList = response.success;
				console.log(masterMenuItemsList);
				getItemsList();
			}
		}
	}
	xhr.open('get', '/api/item/master_menu_items');
	xhr.send(null);

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
				}
			}
		}
		xhrTemp.open('get', '/api/item/');
		xhrTemp.send(null);

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

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img imsize";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			ratecol.id = "rate" + curr_item._id;
			ratecol.innerHTML = curr_item.rate;


			newRow.appendChild(imgcol);
			newRow.appendChild(namecol);
			newRow.appendChild(ratecol);

			tbody.appendChild(newRow);
		}
	}
}
