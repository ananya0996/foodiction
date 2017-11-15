var cartItems = [];

var xhr = null;

function putItems()
{
	var itemsList;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				itemsList = response.success;
				displayItems();
			}
		}
	}
	xhr.open('get', '/api/item');
	xhr.send(null);

	function displayItems() {
		var tbody = document.getElementById("tbody");
		for(var i = 0; i < itemsList.length; ++i)
		{
			var curr_item = itemsList[i];
			var newRow = document.createElement("tr");
			newRow.id = curr_item._id;
			var imgcol = document.createElement("td");
			var namecol = document.createElement("td");
			var ratecol = document.createElement("td");
			var quantcol = document.createElement("td");
			var addcol = document.createElement("td");

			var img = document.createElement("img");
			img.src = "/images/food.png";
			img.className = "img-rounded food-img";
			imgcol.appendChild(img);

			namecol.innerHTML = curr_item.name;
			namecol.id = "name" + curr_item._id;

			ratecol.id = "rate" + curr_item._id;
			ratecol.innerHTML = curr_item.rate;

			var quant = document.createElement("input");
			quant.id = "qty" + curr_item._id;
			quant.type = "number";
			quant.min = "1";
			quant.max = "5";
			quant.value = "1";
			quantcol.appendChild(quant);

			var add = document.createElement("button");
			add.id = "add" + curr_item._id;
			add.innerText = "Add +";
			add.className = "addbutton";
			add.onclick = addToCart;
			addcol.appendChild(add);

			newRow.appendChild(imgcol);
			newRow.appendChild(namecol);
			newRow.appendChild(ratecol);
			newRow.appendChild(quantcol);
			newRow.appendChild(addcol);

			tbody.appendChild(newRow);
		}
	}
}

function addToCart()
{
	var tbody = document.getElementById("cartTbody");
	var e = event.target || event.srcElement;
	var itemid = e.id.slice(3);
	var qty = document.getElementById("qty" + itemid).value;
	qty = parseInt(qty);
	if(qty > 5)
	{
		qty = 5;
	}
	var rate = document.getElementById("rate" + itemid).innerHTML;
	rate = parseInt(rate);
	var amt = rate * qty;
	var itemname = document.getElementById("name" + itemid).innerHTML;
	e.innerHTML = "Remove -";
	e.onclick = removeFromCart;

	var tr = document.createElement("tr");
	tr.id = "cart" + itemid;

	var nametd = document.createElement("td");
	nametd.appendChild(document.createTextNode(itemname));

	var qtytd = document.createElement("td");
	qtytd.appendChild(document.createTextNode(qty));

	var amounttd = document.createElement("td");
	amounttd.appendChild(document.createTextNode(amt));
	amounttd.id = "amt" + itemid;

	tr.appendChild(nametd);
	tr.appendChild(qtytd);
	tr.appendChild(amounttd);
	tbody.appendChild(tr);

	var total = document.getElementById("total");
	var totval = parseInt(total.innerHTML);
	totval += amt;
	total.innerHTML = totval;

	//UPDATING cartItems HERE
	var newItem = {id: itemid, qty: qty};
	cartItems.push(newItem);
}

function removeFromCart()
{
	var e = event.target || event.srcElement;
	var itemid = e.id.slice(3);
	e.innerHTML = "Add +";
	e.onclick = addToCart;

	var delrow = document.getElementById("cart" + itemid);
	var amt = parseInt(document.getElementById("amt" + itemid).innerText);
	delrow.parentNode.removeChild(delrow);

	var total = document.getElementById("total");
	var totval = parseInt(total.innerHTML);
	totval -= amt;
	total.innerHTML = totval;

	//UPDATING cartItems HERE
	var remindex = searchItem(parseInt(itemid));
	cartItems.splice(remindex, 1);
}

function searchItem(itemid)
{
	for(var i = 0; i < cartItems.length; ++i)
	{
		var item = cartItems[i];

		if(itemid == item.id)
		{
			return i;
		}
	}
	return -1;
}

function checkout()
{
	if(cartItems.length > 0)
	{
		var total = document.getElementById("total");
		var totval = parseInt(total.innerHTML);
		localStorage.setItem("orderTot", totval);

		xhr = new XMLHttpRequest();
		xhr.open("post", "/api/order", true); // INTEGRATE
		xhr.onreadystatechange = checkOrderStatus;
		xhr.setRequestHeader("Content-Type", "application/json");
		//alert(JSON.stringify(cartItems));
		xhr.send(JSON.stringify({items: cartItems}));
	}
	else
	{
		alert("Your cart is empty!");
	}
}

function checkOrderStatus()
{
	if((xhr.status == 200) && (xhr.readyState == 4))
	{
		var response = JSON.parse(xhr.responseText);
		if(!response.success)
		{
			//alert("Error placing order! Please retry.");
			window.location.assign("/customer/order_error");
		}
		else
		{
			//location.replace("orderplaced.html?orderNumber=" + orderNumber);
			//alert("Your order has been placed! ID: " + response.success);
			localStorage.setItem("orderID", response.success);
			window.location.assign("/customer/process_payment");

			//clean localStorage here?
		}
	}
}
