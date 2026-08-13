# Copyright (c) 2026, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MeetingOutcome(Document):
	def validate(self):
		# Makes sure only one default Meeting Outcome is selected
		if self.default == 1:
			all_outcome_doc = frappe.get_all("Meeting Outcome", {"default": 1})
			if all_outcome_doc:
				for doc in all_outcome_doc:
					if doc.name != self.name:
						outcome_doc = frappe.get_doc("Meeting Outcome", doc.name)
						outcome_doc.default = 0
						outcome_doc.save()
