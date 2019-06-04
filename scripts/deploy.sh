rm -rf ../rbc/games/js/slider/
cp -r build/ slider/
mv slider ../rbc/games/js/slider
scp -r ../rbc/games/js/slider kittenb1@rootbeercomics.com:/home1/kittenb1/www/games/js/
