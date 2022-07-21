// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Field Map', {
	refresh:function(frm){
		//  set a single point to amrut science city office
		let dummy_route={
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "LineString",
						"coordinates": [
							[
								72.5107881,
								23.073895
							],
						]
					}
				},

			]
		}
		frm.set_value('visit_map',JSON.stringify(dummy_route))
		
		//  construct entire route with meetings
		let meeting_route=[
			{
				"type": "Feature",
				"style" : {
					"color": "#ff7800",
					"weight": 50,
					"opacity": 2.65
				},
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
					"popupContent": "Near D-Mart!"
				},
				"geometry": {
					"type": "Point",
					"coordinates": [
						72.50,
						23.03
					]
				}
			},
			{
				"type": "Feature",
				"properties": {
					"name": "Meeting No 2",
					"popupContent": "Near Rajpath Club!"
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
	
		// var myStyle = {
		// 	"color": "#ff7800",
		// 	"weight": 50,
		// 	"opacity": 2.65
		// };
		// L.geoJSON(route, {
		// 	style: myStyle,
		// 	onEachFeature: onEachFeature
		// }).addTo(map);

		function add_meetings(meetings, field_name, style) {
			let _map = cur_frm.fields_dict[field_name].map;
			meetings.forEach(m => {
				L.geoJSON({
					"type": "FeatureCollection",
					"features": [m]
				}, {
					style: function (feature) {
						return feature.properties.style;
					},					
					onEachFeature: function onEachFeature(feature, layer) {
						//destroy any old popups that might be attached
						if (layer._popup != undefined) {
							layer.unbindPopup();
						}
						var popupContent = '<p>Name: ' + feature.properties.name + '</p>';
						if (feature.properties && feature.properties.popupContent) {
							popupContent += feature.properties.popupContent;
							layer.bindPopup(popupContent);
						}
					}
				}).addTo(_map);
			});
		}
	
		add_meetings(meeting_route, 'visit_map')
	},
	visit_map: function(frm) {
	}
});

