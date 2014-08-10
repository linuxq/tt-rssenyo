rm -R deploy/*
rm *.bar
rm *.zip
rm *.ipk
./tools/deploy.sh 
cp bbplaybook/config.xml deploy/tt-rssenyo/
cp bbplaybook/index.html deploy/tt-rssenyo/index.html
cp *.png deploy/tt-rssenyo/
cp manife* deploy/tt-rssenyo/
mkdir deploy/tt-rssenyo/resource
cd deploy/tt-rssenyo/
rm icon.png
zip -r tt-rssenyo.zip *
cd ..
cd ..
mv deploy/tt-rssenyo/tt-rssenyo.zip ./tereaderplaybook.zip
