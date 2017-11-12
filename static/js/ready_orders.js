var service = 1;
var xhr = null;

function getOrders()
{
	const ws = new WebSocket('ws://localhost:8888');

	xhr = new XMLHttpRequest();
	xhr.open('get', '/api/item');
	xhr.onreadystatechange = putOrder;
	xhr.send();
}

function putOrder()
{
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		var document.getElementById("order" + service);
		service = (service == 9) ? 1 : service + 1;

		var response = JSON.parse(xhr.responseText);
		if(response.success)
		{
			var orderDetails = response.success;
			
		}
	}
}