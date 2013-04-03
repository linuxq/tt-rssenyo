tools/deploy.sh
cp config.xml deploy/ttrssenyo/
cd deploy/ttrssenyo
zip -r /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo/ttrssenyo.zip *
cd /home/marcel/Dropbox/webOS-Apps/Enyo2/ttrssenyo
palm-run deploy/ttrssenyo