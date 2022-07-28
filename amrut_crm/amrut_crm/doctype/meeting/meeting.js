// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Meeting', {
	onload: function (frm) {
		frm.set_query('source', () => {
			return {
				filters: {
					name: ['in', ['Customer', 'Lead', 'Opportunity']]
				}
			}
		})
	},
	refresh: function (frm) {
		debugger
		if (frm.doc.__islocal == undefined && frm.doc.meeting_location != undefined) {

			frappe.call({
				method: "amrut_crm.amrut_crm.doctype.meeting.meeting.plot_meeting_map",
				args: {
					meeting_name: frm.doc.name,
				},
				callback: function (r) {
					if (r.message) {
						let data = r.message
						console.log(data)
						console.log(String(data.meeting_location))
						let meeting_location = JSON.parse(String(data.meeting_location))
						console.log(meeting_location)
						frm.get_field('visit_map_html').$wrapper.html(`<div id = "sales-map" style="min-height: 500px; z-index: 1; max-width:100%"></div>`)
						frm.refresh_field('visit_map_html')
						let latlong = [meeting_location.lat, meeting_location.lng]
						var mapOptions = {
							center: latlong,
							zoom: 13
						}
						var map = new L.map('sales-map', mapOptions);
						var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
						map.addLayer(layer);
						var markerOptions = {
							title: data.meeting_details,
							clickable: true,
						}
						// lat ,long 
						var marker = new L.Marker(latlong, markerOptions);
						marker.addTo(map);

						console.log(r)
					}
				}
			})

		}else{
			frm.get_field('visit_map_html').$wrapper.html(`<div id = "sales-map" style="min-height: 500px; z-index: 1; max-width:100%"></div>`)
			frm.refresh_field('visit_map_html')
		}

	}
});