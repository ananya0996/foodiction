var serviceNum = 1;
var xhr = null;
var orderXHR = null;
var ws = null;

function updateServicedOrders() //initiate request
{
	ws = new WebSocket('ws://localhost:8888');

	xhr = new XMLHttpRequest();
	xhr.open("get", "/api/item");
	xhr.onreadystatechange = fetchOrders;
	xhr.send();
}

function fetchOrders() //fetch serviced orders
{
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		var response = JSON.parse(xhr.responseText);
		if(response.success)
		{
			orderXHR = new XMLHttpRequest();
			orderXHR.open("get", "/api/order?status=1");
			orderXHR.send();
			ws.addEventListener("message", ({data}) => {
					data = JSON.parse(data);
					console.log(data);
					if(data.servicedOrder) {
						displayOrder(data.servicedOrder);
					}
				});
		}
	}
}

function displayOrder(orderID) //display the serviced orders
{
	var hexorderID = orderID.slice(-3);
	var servicedOrderID = parseInt("0x" + hexorderID);
	document.getElementById("order" + serviceNum).innerHTML = servicedOrderID;
	serviceNum = (serviceNum == 9) ? 1 : serviceNum + 1;
}