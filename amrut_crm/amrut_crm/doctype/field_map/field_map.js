// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Field Map', {
	refresh: function (frm) {
		$('button[data-label="Save"]').hide()	
	},
	plot_map: function (frm) {
		frm.call({
			doc: frm.doc,
			method: 'plot_map',
			freeze: true,
			callback: function (r) {
				console.log(r, 'r')
				if (r && r.message) {
					// https://www.tutorialspoint.com/leafletjs/leafletjs_getting_started.htm
					let is_tracking = true
					let is_meeting = true
					if (r.message[0].length == 0) {
						is_tracking = false
						frappe.msgprint(__('No Tracking data available'));
					}
					if (r.message[1].length == 0) {
						is_meeting = false
						frappe.msgprint(__('No Meeting data available'));
					}
					if (is_tracking == false && is_meeting == false) {
						frm.get_field('visit_map_html').$wrapper.html(`<div id = "sales-map"  style="min-height: 500px; z-index: 1; max-width:100%"></div>`)
						frm.refresh_field('visit_map_html')
						return
					}

					frm.get_field('visit_map_html').$wrapper.html(`<div id = "sales-map" style="min-height: 500px; z-index: 1; max-width:100%"></div>`)
					frm.refresh_field('visit_map_html')

					if (is_tracking == true) {
						let tracking_data = r.message[0][0]
						let day_start_location = JSON.parse(String(tracking_data.day_start_location))
						// let	tracked_locations = JSON.parse(tracking_data.tracked_locations.substr(1).slice(0,-1).replaceAll("\\",""))
						let	tracked_locations = JSON.parse(String(tracking_data.tracked_locations))
						if (day_start_location==null ) {
							is_tracking = false
							frappe.msgprint(__('Tracking data has missing day start '));
							return
						}
						let distance_travelled_in_km = tracking_data.distance_travelled_in_km
						let work_duration = frappe.utils.get_formatted_duration(tracking_data.work_duration)
						let tracking_name = tracking_data.tracking_name
						let center = [day_start_location.lat, day_start_location.lng]
						let polyline_title = "Total(km): " + distance_travelled_in_km + "<br>" + "Total(time): " + work_duration
						let route_popup = polyline_title + "<br>" + `<span class="underline" >${frappe.utils.get_form_link('Tracking',tracking_name,true)}<span>`

						//  Creating map options
						var mapOptions = {
							center: center,
							zoom: 12
						}
						// Creating a map object
						if (!map) {
							var map = new L.map('sales-map', mapOptions);
						}						
						// Creating a Layer object
						var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
						// Adding layer to the map
						map.addLayer(layer);

						//  Add route line
						let latlngs = []
						tracked_locations.forEach((m, index) => {
							latlngs.push([m.lat, m.lng])
						})
						var polyline = L.polyline(latlngs, {
							title: polyline_title,
							color: 'brown',
							weight: 6
						});
						polyline.addTo(map);

						//  Add route pins
						var iconOptions = {
							iconUrl: '/assets/amrut_crm/images/icons8-map-pin-24.png',
							iconSize: [10, 10]
						}
						// Creating a custom icon
						var customIcon = L.icon(iconOptions);
						var routeOptions = {
							clickable: true,
							icon: customIcon
						}
						tracked_locations.forEach((m, index) => {
							routeOptions.title = '[' + (index + 1) + ']@' + m.time
							var routepoint = new L.Marker([m.lat, m.lng], routeOptions);
							let my_route_popup = routeOptions.title + "<br>" + route_popup
							routepoint.bindPopup(my_route_popup).openPopup();
							routepoint.addTo(map);
						})
					}

					// only meeting
					if (is_tracking == false && is_meeting == true) {
						let latlong = JSON.parse(String(r.message[1][0].meeting_location))
						let center_latlong = [latlong.lat, latlong.lng]
						//  Creating map options
						var mapOptions = {
							center: center_latlong,
							zoom: 12
						}
						// Creating a map object
						if (!map) {
							var map = new L.map('sales-map', mapOptions);
						}
						// Creating a Layer object
						var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
						// Adding layer to the map
						map.addLayer(layer);

					}

					if (is_meeting == true) {
						let meeting_data = r.message[1]
						meeting_data.forEach((m, index) => {
							// Creating a Meeting marker
							let meeting_details = m.meeting_name + "\n" + m.person_name + "\n" + m.meeting_purpose + "\n" + m.meeting_time
							let latlong = JSON.parse(String(m.meeting_location))
							let meeting_latlong = [latlong.lat, latlong.lng]
							var markerOptions = {
								title: meeting_details,
								clickable: true,
							}
							var marker = new L.Marker(meeting_latlong, markerOptions);
							let meeting_popup = m.person_name + "<br>" + m.meeting_purpose + "<br>" + m.meeting_time + "<br>" +
								`<span class="underline" >${frappe.utils.get_form_link('Meeting',m.meeting_name,true)}<span>`
							marker.bindPopup(meeting_popup).openPopup();
							marker.addTo(map);
						})
					}
					frm.refresh_field('visit_map_html')
				}
			}
		});
	},
});