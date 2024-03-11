
mode=""
if [ -z "$1" ]; then
  mode="all"
else 
  mode=$1
fi
echo $mode
curl -X POST http://admin:c03e1938349875ba48d679ee07f03fe6@ip27.digitel.vn:5280/job/Appay_beta/buildWithParameters?build_mode=$mode