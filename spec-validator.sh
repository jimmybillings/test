baseDir=src/client/app
ignoreFilePatterns='*.spec.ts *.interface.ts *.module.ts *.routes.ts main.ts'
ignoreDirectories='imports'

ignoreArguments=
for pattern in $ignoreFilePatterns
do
  ignoreArguments="$ignoreArguments -not -name \"$pattern\""
done

for directory in $ignoreDirectories
do
  ignoreArguments="$ignoreArguments -not -path \"$baseDir/$directory/*\""
done

findCommand="find $baseDir -name \"*.ts\" $ignoreArguments -print"
# echo $findCommand

sourceFiles=`eval $findCommand`
missingSpecCount=0

for file in $sourceFiles
do
  if [ ! -e "`echo $file | sed -e 's/\.ts$/.spec.ts/'`" ]
  then
    echo "No spec for `echo $file | sed -e \"s+$baseDir/++\"`"
    missingSpecCount=`expr $missingSpecCount + 1`
  fi
done

echo
echo "Total number of testable source files: `echo \"$sourceFiles\" | wc -l`"
echo "Number of testable source files without a matching spec file: $missingSpecCount"

specFiles=`eval "find $baseDir -name \"*.spec.ts\" -print"`
missingSourceCount=0

echo
for file in $specFiles
do
  if [ ! -e "`echo $file | sed -e 's/\.spec.ts$/.ts/'`" ]
  then
    echo "No source for `echo $file | sed -e \"s+$baseDir/++\"`"
    missingSourceCount=`expr $missingSourceCount + 1`
  fi
done

echo
echo "Total number of spec files: `echo \"$specFiles\" | wc -l`"
echo "Number of spec files without a matching source file: $missingSourceCount"

if [ $missingSpecCount -gt 0 -o $missingSourceCount -gt 0 ]
then
  exit 1
fi

exit 0
