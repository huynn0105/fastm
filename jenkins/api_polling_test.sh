send_telegram() {
  curl -X POST "https://api.telegram.org/bot564467928:AAGl1ZZMMufUFRP2cqwNyxNnvU7kUOgCdm0/sendMessage" -d "chat_id=-274450894&text=$1"
}

start=$(date +%s)

response=$(curl -X GET \
  'https://appay.cloudcms.vn/app_api_v1/fe_credit/subscriptions?accessToken=2e94ec37c9254502ab866a0ec4b1655cab89419f' \
  -H 'Authorization: Basic ZGd0YXBwOnh1a2ExOTk3' \
  -H 'Cache-Control: no-cache' \
  -H 'Postman-Token: c02b0a42-2eff-4fc1-89a4-2f2debe34742')

end=$(date +%s)
delay=$(($end-$start))

status=$(echo $response | jq '.status')
data=$(echo $response | jq '.data')
subscriptions=$(echo $data | jq '.subscriptions')
lenght_sub=$(echo $subscriptions | jq 'length')

if [ "$status" != "true" ] || [ "$lenght_sub" != "2" ]; then
  send_telegram "[API] ERROR
  https://appay.cloudcms.vn/app_api_v1/fe_credit/subscriptions?accessToken=2e94ec37c9254502ab866a0ec4b1655cab89419f
  ----
  $response"
fi

if (($delay >= 3)); then
  send_telegram "[API] WARNING
  https://appay.cloudcms.vn/app_api_v1/fe_credit/subscriptions?accessToken=2e94ec37c9254502ab866a0ec4b1655cab89419f
  ----
  Response time $delay"
fi 