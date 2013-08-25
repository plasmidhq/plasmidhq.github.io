cd ../plasmid/docs
FILES=$(jules -o ../../plasmid-site build -f | grep _build | grep -v "\.j2" | cut -d/ -f2-)
cd ../../plasmid-site
rm *.j2
git add $FILES
