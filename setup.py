from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in amrut_crm/__init__.py
from amrut_crm import __version__ as version

setup(
	name="amrut_crm",
	version=version,
	description="Mobile CRM to track location, time, meetings and attendance\'",
	author="GreyCube Technologies",
	author_email="admin@greycube.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
