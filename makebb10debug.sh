rm -R deploy/*
rm *.bar
rm *.zip
rm *.ipk
./tools/deploy.sh 
cp bb10/config.xml deploy/tt-rssenyo/
cp bb10/indexbb10.html deploy/tt-rssenyo/index.html
cp *.png deploy/tt-rssenyo/
mkdir deploy/tt-rssenyo/css
cp css/bbui.css deploy/tt-rssenyo/css/
cp source/bbui.js deploy/tt-rssenyo/build/
mkdir deploy/tt-rssenyo/resource
cd deploy/tt-rssenyo/
zip -r tt-rssenyo.zip *
cd ..
cd ..
mv deploy/tt-rssenyo/tt-rssenyo.zip ./
${BB10SDK}/bbwp tt-rssenyo.zip -d
mv simulator/tt-rssenyo.bar ttrssenyo-simulator.bar
mv device/tt-rssenyo.bar ttrssenyo-device.bar
rm -R simulator
rm -R device
${BB10SDK}/dependencies/tools/bin/blackberry-deploy -installApp -launchApp ${BB10DEVICE} -password ${BB10DEVICEPASS} ./ttrssenyo-device.bar

