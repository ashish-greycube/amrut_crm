// Copyright (c) 2022, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tracking', {
	sales_person: function(frm) {
		frappe.db.get_list('Employee', {
			fields: ["name","employee_name"],
			filters: {
				"user_id": frm.doc.sales_person
			}
		}).then(records => {
			console.log(records);
			if (records.length>0) {
				frm.set_value({
					employee: records[0].name,
					employee_name: records[0].employee_name
				})				
			}
		
		})
		
	}
});
