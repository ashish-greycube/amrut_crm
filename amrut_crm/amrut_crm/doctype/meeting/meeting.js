// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Meeting', {
	onload: function(frm) {
		frm.set_query('source', () => {
			return {
				filters: {
					name: ['in', ['Customer', 'Lead', 'Opportunity']]
				}
			}
		})
	}
});
