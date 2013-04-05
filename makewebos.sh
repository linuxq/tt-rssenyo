tools/deploy.sh
cp config.xml deploy/ttrssenyo/
cp icon114.png deploy/ttrssenyo/
cd deploy/ttrssenyo
zip -r /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo/ttrssenyo.zip *
cd /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo
palm-package deploy/ttrssenyo
palm-install com.meissel.tt*
palm-launch com.meissel.ttrssreader