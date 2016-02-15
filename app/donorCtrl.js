app.controller("donorCtrl", function($scope, $http) {

	$scope.setDonor = function(dnr) {
		dnr.address = document.getElementById('searchTextField').value;
		dnr.geo_lng = document.getElementById('MapLon').value;
		dnr.geo_lat = document.getElementById('MapLat').value;
		$http({
			method : 'POST',
			url : '/donors/create',
			data : dnr
		// JSON.stringify($scope.dnr, null, 2),
		// headers: {
		// 'Content-Type':
		// 'application/x-www-form-urlencoded;charset=UTF-8',
		// }
		}).then(function() {
			alert('success');
		}, function() {
			'error'
		});
	};
	$scope.getDonors = function() {
		$http.get("/donors").success(
				function(data) {
					$scope.donors = data;
					console.log('typeof' + typeof data);
					// alert(JSON.stringify(data));
					var the_map = window.the_google_map;// document.getElementById('map');
					for (i = 0; i < data.length; i++) {
						console.log('creating marker of ' + data[i].email);
						/*
						 * console.log('creating marker of ' +
						 * JSON.stringify(data[i], null, 2));
						 */
						if ((!isNaN(data[i].geo_lat))
								&& (!isNaN(data[i].geo_lng))) {
							if ((data[i].geo_lat != "")
									&& (data[i].geo_lng != "")) {
								pos = {};
								pos.lat = parseFloat(data[i].geo_lat);
								pos.lng = parseFloat(data[i].geo_lng);
								console.log('the_position'
										+ JSON.stringify(pos));
								var marker = new google.maps.Marker({
									position : new google.maps.LatLng(pos.lat,
											pos.lng),
									map : the_map,
									title : 'Donor'
								});

								google.maps.event.addListener(marker, 'click',
										(function(marker, i) {
											return function() {
												infowindow.setContent("lol");
												infowindow.open(map, marker);
											}
										})(marker, i));
							}
							;
						} else
							console.log('not marker');
					}
					;

				}).error(function() {
			alert("error");
		})
		/*
		 * $http({ method: 'POST', url: '/donors', data: "", headers: {
		 * 'Content-Type' : 'application/x-www-form-urlencoded' } })
		 */
	}
})
