Tiny Tiny RSS Reader Enyo Client
===========================

A client for http://tt-rss.org based Feed Readers using the great JS framework www.enyojs.com! Under Linux I use the WebWorks SDK by user badtoyz: 
https://github.com/badtoyz/BB10-WebWorks-SDK-linux-1.0.4.11

*Makefile* is NOT working yet. For now you can do the following:

Packaging for webOS
--------------
Run *makewebos.sh*


Packaging for Blackberry 10
--------------

Make sure to set the following environment variables in your system:
- export BB10SDK=/path/to/bb10/sdk
- export BB10DEVICE="ip of bb10 device"
- export BB10TYPE="simulator or device"
- export BB10DEVICEPASS="devices developer mode password"
- export BB10SIGNPASS=Signing password

**Package debug version and install package on a BB10 device:**

Run *makebb10debug.sh*


**Package release version and install package on a BB10 device:**

Run *makebb10release.sh*