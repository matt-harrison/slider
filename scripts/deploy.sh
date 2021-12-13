rm -rf ../rbc/apps/slider/
cp -r build/ slider/
mv slider ../rbc/apps/slider
scp -r ../rbc/apps/slider kittenb1@rootbeercomics.com:/home1/kittenb1/www/apps/
