var serviceNum = 1;
var xhr = null;
var orderXHR = null;
var ws = null;

function updateServicedOrders() //initiate request
{
	var ws = new WebSocket('ws://localhost:8888');

	xhr = new XMLHttpRequest();
	xhr.open("get", "/api/item");
	xhr.onreadystatechange = fetchOrders;
	xhr.send();
}

function fetchOrders() //fetch serviced orders
{
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		//service = (service == 9) ? 1 : service + 1;

		var response = JSON.parse(xhr.responseText);
		if(response.success)
		{
			orderXHR = new XMLHttpRequest();
			orderXHR.onreadystatechange = displayOrders;
			orderXHR.open("get", "/api/order?status=1");
			orderXHR.send();
		}
	}
}

function displayOrders() //display the serviced orders
{
	if(orderXHR.readyState == 4 && orderXHR.status == 200)
	{
		var response = JSON.parse(orderXHR.responseText);
		if(response.success)
		{
			var servicedOrders = response.success;
			for(var i = 0; i < servicedOrders.length; ++i)
			{
				var hexorderID = servicedOrders[i]._id.slice(-3);
				var servicedOrderID = parseInt("0x" + hexorderID);
				document.getElementById("order" + serviceNum).innerHTML = servicedOrderID;
				serviceNum = (serviceNum == 9) ? 1 : serviceNum + 1;
			}
		}
	}
}