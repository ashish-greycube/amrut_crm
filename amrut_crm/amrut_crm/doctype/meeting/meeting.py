# Copyright (c) 2022, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

class Meeting(Document):
	pass



def create_meeting():
	pass

@frappe.whitelist()
def create_meeting(source_name, target_doc=None,doctype=None):
	print('-'*100)
	print('doctype',doctype)
	def update_accounts(source_doc, target_doc, source_parent):
		account_details = frappe.get_all(
			"Loan Type",
			fields=[
				"mode_of_payment",
				"payment_account",
				"loan_account",
				"interest_income_account",
				"penalty_income_account",
			],
			filters={"name": source_doc.loan_type},
		)[0]

		if source_doc.is_secured_loan:
			target_doc.maximum_loan_amount = 0

		target_doc.mode_of_payment = account_details.mode_of_payment
		target_doc.payment_account = account_details.payment_account
		target_doc.loan_account = account_details.loan_account
		target_doc.interest_income_account = account_details.interest_income_account
		target_doc.penalty_income_account = account_details.penalty_income_account
		target_doc.loan_application = source_name

	doclist = get_mapped_doc(
		"Loan Application",
		source_name,
		{
			"Loan Application": {
				"doctype": "Loan",
				"validation": {"docstatus": ["=", 1]},
				"postprocess": update_accounts,
			}
		},
		target_doc,
	)

	if submit:
		doclist.submit()

	return doclist