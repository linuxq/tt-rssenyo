tools/deploy.sh
cp config.xml deploy/tt-rssenyo/
cp icon*.png deploy/tt-rssenyo/
cp proxy.php deploy/tt-rssenyo/
cp class_http.php deploy/tt-rssenyo/
cd deploy/tt-rssenyo
zip -r /home/marcel/Dropbox/webOS-Apps/Enyo2/tt-rssenyo/ttrssenyo.zip *
cd /home/marcel/Dropbox/webOS-Apps/Enyo2/tt-rssenyo
rm com.meissel.tt*
palm-package deploy/tt-rssenyo
palm-install com.meissel.tt*
palm-launch com.meissel.ttrssreader