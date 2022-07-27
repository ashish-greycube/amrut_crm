# Copyright (c) 2022, GreyCube Technologies and contributors
# For license information, please see license.txt

from distutils.log import debug
import frappe
from frappe.model.document import Document
from frappe.utils import add_days

class FieldMap(Document):

	@frappe.whitelist()
	def plot_map(self):
		sales_person=self.sales_person
		visit_date=self.visit_date
		tracking_data = frappe.db.sql(
			"""	SELECT name as tracking_name, day_start_location, tracked_locations,distance_travelled_in_km,work_duration 
				from `tabTracking` where sales_person=%s and tracking_date=%s
		""",
			(sales_person,visit_date),
			as_dict=True,
		)
		# tracking_data= tracking_data[0] if tracking_data!=None else None
		print(add_days(visit_date,1))
		meeting_data = frappe.db.sql(
			"""	select name as meeting_name, meeting_location, person_name,TIME(meeting_start_date_time) as meeting_time,meeting_purpose 
				from `tabMeeting` 
				where  meeting_executive_owner=%s and 
				meeting_start_date_time >= %s and 
				meeting_start_date_time < %s 
		""",
			(sales_person,visit_date,add_days(visit_date,1)),
			as_dict=True,debug=0
		)
		

		return tracking_data,meeting_data
