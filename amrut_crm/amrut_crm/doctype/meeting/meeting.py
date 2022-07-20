# Copyright (c) 2022, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
import datetime
from frappe.utils import time_diff_in_seconds,get_link_to_form,get_datetime

class Meeting(Document):
	def validate(self):

		if self.source=='Customer':
			self.person_name=frappe.db.get_value('Customer', self.doc_name, 'customer_name')
			# self.sales_executive=frappe.db.get_value('Customer', self.doc_name, 'sales_person')
			self.sales_executive=frappe.db.get_value('Customer', self.doc_name, 'sales_responsible_cf')
			self.territory=frappe.db.get_value('Customer', self.doc_name, 'territory')
			self.mobile_no=frappe.db.get_value('Customer', self.doc_name, 'mobile_no')
		elif self.source=='Lead':
			self.person_name=frappe.db.get_value('Lead', self.doc_name, 'lead_name')
			self.sales_executive=frappe.db.get_value('Lead', self.doc_name, 'lead_owner')
			self.territory=frappe.db.get_value('Lead', self.doc_name, 'territory')
			self.mobile_no=frappe.db.get_value('Lead', self.doc_name, 'mobile_no')
		elif self.source=='Opportunity':
			self.person_name=frappe.db.get_value('Opportunity', self.doc_name, 'customer_name')
			self.sales_executive=frappe.db.get_value('Opportunity', self.doc_name, 'converted_by')
			self.territory=frappe.db.get_value('Opportunity', self.doc_name, 'territory')
			self.mobile_no=frappe.db.get_value('Opportunity', self.doc_name, 'contact_mobile')

		duplicate_meeting = frappe.db.get_value("Meeting", {"scheduled_datetime": self.scheduled_datetime,"sales_executive":self.sales_executive}, ["name"], as_dict=True)
		if duplicate_meeting and self.name!=duplicate_meeting.name:
			err_msg = _("Date and Time:{0}, executive {1} has meeting {2} ".
			format(frappe.bold(self.scheduled_datetime),frappe.bold(self.sales_executive),get_link_to_form('Meeting',duplicate_meeting.name)))
			frappe.throw(
					title=_('Duplicate Meeting'),
					msg=_(err_msg),
					exc=frappe.DuplicateEntryError)				
			frappe.throw(_(err_msg))	

		if self.meeting_start_date_time and self.meeting_end_date_time:
			if get_datetime(self.meeting_start_date_time) > get_datetime(self.meeting_end_date_time):
				err_msg = _("From Time : {0} cannot be later than To Time : {1}"
				.format(frappe.bold(self.meeting_start_date_time),frappe.bold(self.meeting_end_date_time)))
				frappe.throw(
					title=_('Incorrect From Time'),
					msg=_(err_msg))		
			timedelta = time_diff_in_seconds(self.meeting_end_date_time,self.meeting_start_date_time)
			self.meeting_duration=timedelta
		
	




@frappe.whitelist()
def create_meeting_from_customer(source_name, target_doc=None):
	customer = frappe.get_doc("Customer", source_name)

	meeting = frappe.new_doc("Meeting")
	meeting.source='Customer'
	meeting.doc_name=customer.name
	meeting.person_name=customer.customer_name
	meeting.sales_executive=customer.sales_responsible_cf
	# meeting.sales_executive=customer.sales_person
	meeting.territory=customer.territory
	meeting.mobile_no=customer.mobile_no

	return meeting

@frappe.whitelist()
def create_meeting_from_lead(source_name, target_doc=None):
	lead = frappe.get_doc("Lead", source_name)

	meeting = frappe.new_doc("Meeting")
	meeting.source='Lead'
	meeting.doc_name=lead.name
	meeting.person_name=lead.lead_name
	meeting.sales_executive=lead.lead_owner
	meeting.territory=lead.territory
	meeting.mobile_no=lead.mobile_no

	return meeting	

@frappe.whitelist()
def create_meeting_from_opportunity(source_name, target_doc=None):
	opportunity = frappe.get_doc("Opportunity", source_name)

	meeting = frappe.new_doc("Meeting")
	meeting.source='Opportunity'
	meeting.doc_name=opportunity.name
	meeting.person_name=opportunity.customer_name
	meeting.sales_executive=opportunity.converted_by
	meeting.territory=opportunity.territory
	meeting.mobile_no=opportunity.contact_mobile

	return meeting		

@frappe.whitelist()
def get_meeting_sales_executive_details(**args):
	if not (args.get("source") and args.get("doc_name")):
		return 0	
	args["doctype"] = args.get("source")
	args["doc_name"] = args.get("doc_name")

	if args["doctype"]=='Customer':
		data = frappe.db.sql(
			"""
			select customer_name as person_name, sales_responsible_cf as sales_executive, territory as territory, mobile_no as mobile_no
			from `tabCustomer`
			where name=(doc_name)s
			""",
			args,
			as_dict=True,
		)
		return data			
	elif args["doctype"]=='Lead':
		data = frappe.db.sql(
			"""
			select lead_name as person_name, lead_owner as sales_executive, territory as territory, mobile_no as mobile_no
			from `tabLead`
			where name=(doc_name)s
			""",
			args,
			as_dict=True,
		)
		return data		
	elif args["doctype"]=='Opportunity':
		data = frappe.db.sql(
			"""
			select customer_name as person_name, converted_by as sales_executive, territory as territory, contact_mobile as mobile_no
			from `tabOpportunity`
			where name=(doc_name)s
			""",
			args,
			as_dict=True,
		)
		return data	

