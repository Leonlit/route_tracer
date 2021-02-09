cat $1 | awk /./ | grep -E '([0-2][0-9]+)(.)?' | awk '{print $8}' | grep . > route.txt
echo "saved routes into route.txt"

