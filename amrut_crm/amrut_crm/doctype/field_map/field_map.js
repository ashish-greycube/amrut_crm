// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Field Map', {
	refresh:function(frm){
		let route={
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"properties": {
						"name": "Route",
						"popupContent": "My todays entire route!"
					},
					"geometry": {
						"type": "LineString",
						"coordinates": [
							[
								72.5107881,
								23.073895
							],
							[
								72.4943729,
								23.073894
							],
							[
								72.5205067,
								23.0704263
							],							
							[
								72.4725258,
								23.0287185
							],
							[
								72.5068045,
								23.0342822
							]
						]
					}
				},
				{
					"type": "Feature",
					"properties": {
						"name": "Meeting No 1",
						"popupContent": "My first meeting today!"
					},
					"geometry": {
						"type": "Point",
						"coordinates": [
							72.5068045,
							23.0342822
						]
					}
				},
				{
					"type": "Feature",
					"properties": {
						"name": "Meeting No 2",
						"amenity": "3Baseball Stadium",
						"popupContent": "My second meeting today!"
					},
					"geometry": {
						"type": "Point",
						"coordinates": [
							72.4763257,
							23.0285262							
						]
					}
				}
			]
		}
		var myStyle = {
			"color": "#ff7800",
			"weight": 50,
			"opacity": 2.65
		};
		let map=cur_frm.fields_dict['visit_map'].map



		function onEachFeature(feature, layer) {
				//destroy any old popups that might be attached
				if (layer._popup != undefined) {
					layer.unbindPopup();
				}			
			var popupContent = '<p>Name: ' +feature.properties.name  +'</p>';
	
			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}
	
			layer.bindPopup(popupContent);
		}
		// function onEachMarker(feature, layer) {

		// 	layer.on('click', function (e) {
		// 		//destroy any old popups that might be attached
		// 		if (layer._popup != undefined) {
		// 			layer.unbindPopup();
		// 		}
		// 			var marker_url = feature.properties.popupContent;
			
		// 			//display a placeholder popup
		// 			var pop = L.popup().setLatLng(this._latlng).setContent('Loading...').openOn(map);
			
		// 			//request data and make a new popup when it's done
		// 			$.ajax({
		// 				url: marker_url,
		// 				success: function (data) {
		// 						//close placeholder popup
		// 						layer.closePopup();
			
		// 						//attach the real popup and open it
		// 						layer.bindPopup(data);
		// 					}});
		// 					layer.openPopup();
		// 				}
		// 			);
		// 		}
		// let route=`{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[72.843191,19.079072],[72.860357,19.089941],[72.871,19.08037]]}}]}`
		frm.set_value('visit_map',JSON.stringify(route))
		L.geoJSON(route, {
			style: myStyle,
			onEachFeature: onEachFeature
		}).addTo(map);

		// L.geoJSON(geojsonFeature, {
		// 	onEachFeature: onEachFeature
		// }).addTo(map);
		
	},
	visit_map: function(frm) {
		console.log(frm.doc.visit_map,typeof frm.doc.visit_map)
				console.log(JSON.parse(frm.doc.visit_map))
	}
});

function onEachMarker(feature, layer) {
	layer.on('click', function (e) {
		//destroy any old popups that might be attached
		if (layer._popup != undefined) {
			layer.unbindPopup();
		}
			var marker_url = feature.properties.url;
	
			//display a placeholder popup
			var pop = L.popup().setLatLng(this._latlng).setContent('Loading...').openOn(map);
	
			//request data and make a new popup when it's done
			$.ajax({
				url: marker_url,
				success: function (data) {
						//close placeholder popup
						layer.closePopup();
	
						//attach the real popup and open it
						layer.bindPopup(data);
					}
				});
					layer.openPopup();
				}
			);
		}