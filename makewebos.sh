tools/deploy.sh
cp config.xml deploy/ttrssenyo/
cp icon*.png deploy/ttrssenyo/
cp proxy.php deploy/ttrssenyo/
cp class_http.php deploy/ttrssenyo/
cd deploy/ttrssenyo
zip -r /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo/ttrssenyo.zip *
cd /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo
rm com.meissel.tt*
palm-package deploy/ttrssenyo
palm-install com.meissel.tt*
palm-launch com.meissel.ttrssreader