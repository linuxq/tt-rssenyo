Tiny Tiny RSS Reader Enyo Client
===========================

A client for http://tt-rss.org based Feed Readers using the great JS framework www.enyojs.com!


Package debug version and Install package on a BB10 device:

-export BB10SDK=/path/to/bb10/sdk
-export BB10DEVICE="ip of bb10 device"
-export BB10TYPE="simulator or device"
-export BB10DEVICEPASS="devices developer mode password"

run "makebb10debug.sh"


Package release version and Install package on a BB10 device:

-export BB10SDK=/path/to/bb10/sdk
-export BB10DEVICE="ip of bb10 device"
-export BB10TYPE="simulator or device"
-export BB10DEVICEPASS="devices developer mode password"
-export BB10SIGNPASS=Signing password

run "makebb10release.sh"
