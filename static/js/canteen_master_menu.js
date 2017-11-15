var cartItems = 0;
var idno = 4;
var ingredientJSON = [];

let ingredients = null;

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

	document.querySelector('#current-ingredients').innerHTML = '';

	var nameInp = document.getElementById("Item").value;
	var rateInp = document.getElementById("Price").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				updateTable(nameInp, rateInp, response.success);
				ingredientJSON = [];
			}
		}
	}
	xhr.open('post', '/api/item/master_menu_item');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: nameInp,
		rate: rateInp,
		ingredients: ingredientJSON
	}));

	function updateTable(nameInp, rateInp, {_id: idno}) {
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
	document.getElementById("Item").value='';
	document.getElementById("Price").value='';
	//document.getElementById("Item").value='';
	//document.getElementById("Price").value='';
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



document.querySelector('#add-ingredient').addEventListener('click', addIngredient);
function addIngredient(evt) {
	if(ingredients == null) {
		const xhr = new XMLHttpRequest();
		xhr.open('get', '/api/ingredient/');
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4 && xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				if(response.success) {
					ingredients = response.success;
					addIngredient(evt);
				}
			}
		}
		xhr.send();
	} else {
		createIngredientForm();
	}


	function createIngredientForm() {
		evt.target.setAttribute('disabled', true);
		const currentIngredients = document.querySelector('#current-ingredients');
		const newIngredient = document.createElement('div');
		newIngredient.classList.add('new-ingredient');
		var optionEl;
		const ingredientSelect = document.createElement('select');
		const currentIngredientSet = new Set(Array.from(document.querySelectorAll('.new-ingredient > select')).map(el => el.value));
		const available = ingredients.filter(ingredient => !currentIngredientSet.has(ingredient._id));
		if(!available.length) return;
		available.forEach((ingredient) => {
			optionEl = document.createElement('option');
			optionEl.innerText = ingredient.name;
			optionEl.setAttribute('value', ingredient._id);
			ingredientSelect.appendChild(optionEl);
		});

		newIngredient.appendChild(ingredientSelect);

		const quantityInput = document.createElement('input');
		quantityInput.setAttribute('type', 'number');
		quantityInput.setAttribute('value', '0');
		newIngredient.appendChild(quantityInput);

		currentIngredients.appendChild(newIngredient);

		const freezeButton = document.createElement('button');
		freezeButton.innerText = 'Freeze';
		freezeButton.onclick = (function() {
			return function() {
				ingredientSelect.setAttribute('disabled', true);
				evt.target.removeAttribute('disabled');
				freezeButton.setAttribute('disabled', true);
				//var o = document.getElementById(ingredient._id);
				ingredientJSON.push({_id: ingredientSelect.value, quantity: quantityInput.value});
			}
		})();

		currentIngredients.appendChild(freezeButton);
	}
}
