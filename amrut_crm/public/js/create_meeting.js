frappe.ui.form.on(cur_frm.doc.doctype, {
    refresh: function name(cur_frm) {
        if (cur_frm.is_new()==undefined) {
            cur_frm.add_custom_button('Meeting CRM', () => {
                frappe.model.open_mapped_doc({
                    method: 'amrut_crm.amrut_crm.doctype.meeting.meeting.create_meeting',
                    frm: cur_frm,
                    doctype:cur_frm.doc.doctype,
                });               
            }, 'Create');
            
        }
    }
})