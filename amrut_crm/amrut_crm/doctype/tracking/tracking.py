# Copyright (c) 2022, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import datetime
from frappe import _
from frappe.utils import time_diff_in_seconds,get_link_to_form,get_time,get_datetime,get_timedelta,getdate
from frappe.utils import  nowdate
# import json

class Tracking(Document):
	def after_insert(self):
		# create employee checkin
		if isinstance(self.day_start, str):
			self.day_start = get_timedelta(self.day_start)		
		in_time = get_datetime(self.tracking_date) + self.day_start
		employee = frappe.db.get_value(	"Employee", {"user_id": self.sales_person}, ["name","employee_name"], as_dict=True)
		if employee:
			doc = frappe.new_doc('Employee Checkin')
			doc.employee=employee.name
			doc.employee_name=employee.employee_name
			doc.log_type='IN'
			doc.time=in_time
			doc.save(ignore_permissions=True)
			print(doc.name)

	def validate(self):
		employee = frappe.db.get_value(	"Employee", {"user_id": self.sales_person}, ["name","employee_name"], as_dict=True)
		if employee:
			self.employee=employee.name
			self.employee_name=employee.employee_name

		if self.day_start and self.day_end:
			if isinstance(self.day_end, str):
				self.day_end = get_timedelta(self.day_end)
			if isinstance(self.day_start, str):
				self.day_start = get_timedelta(self.day_start)						
			if get_time(self.day_start) > get_time(self.day_end):
				err_msg = _("From Time : {0} cannot be later than To Time : {1}"
				.format(frappe.bold(self.day_start),frappe.bold(self.day_end)))
				frappe.throw(_(err_msg))		
			timedelta = time_diff_in_seconds(self.day_end,self.day_start)
			self.work_duration=timedelta
			out_time = get_datetime(self.tracking_date) + self.day_end
			# create employee checkout
			if employee.name:
				checkout_exist=frappe.db.exists('Employee Checkin', {"employee": employee.name,"log_type":"OUT","time":out_time})
				print('checkout_exist',checkout_exist)
				if checkout_exist==None:
					doc = frappe.new_doc('Employee Checkin')
					doc.employee=employee.name
					doc.employee_name=employee.employee_name
					doc.log_type='OUT'
					doc.time=out_time
					doc.save(ignore_permissions=True)
					print(doc.name)			
		
		# if isinstance(self.get('tracked_locations'),list):
		# 	self.tracked_locations = json.dumps(self.tracked_locations)
		# if isinstance(self.get('day_end_location'),dict):
		# 	self.day_end_location = json.dumps(self.day_end_location)						

@frappe.whitelist()
def get_logged_in_user_detail(**args):
	args["sales_person"] = args.get("sales_person")
	data = frappe.db.sql(
		"""
		SELECT user_tab.full_name as user_full_name,employee.name as employee,employee.employee_name as employee_name 
		FROM  `tabUser` user_tab left outer join `tabEmployee` employee on user_tab.name=employee.user_id
		where user_tab.username =%(sales_person)s or user_tab.email=%(sales_person)s
	""",
		args,
		as_dict=True,
	)
	return data	
	# amrut_crm/amrut_crm/amrut_crm/doctype/tracking/tracking.py


@frappe.whitelist()
def auto_checkout_for_missing_data():
	data = frappe.db.sql(
		"""
		UPDATE `tabTracking` 
		set day_end="23:59:00",day_end_location=day_start_location , distance_travelled_in_km =0,work_duration=0,
		tracked_locations = concat('[', REPLACE(day_start_location,'}',''), ' , "time":"23:59:00" }]')
		where tracking_date= %(today)s and day_end is NULL  
				""",
			{"today": nowdate()},as_dict=True)