#!/usr/bin/env bash

bundle exec nexmo-oas-renderer &>/dev/null &
RENDERER_PID=$!
sleep 3

HAS_FAILURE=0
DOCS=$1

if [[ -z "$DOCS" ]]; then
  DOCS=$(find definitions -name '*.yml' -not -path "*definitions/common*") 
fi

REMOVE="/definitions"
for i in $DOCS; do
  echo -n "$i "
  DEFINITION=${i/.yml/}
  OUTPUT=$(curl "http://localhost:4567/$DEFINITION" -I 2> /dev/null)
  echo $OUTPUT | grep "HTTP/1.1 200 OK" > /dev/null
  if [[ $? == 0 ]]; then
    echo '✅'
  else
    HAS_FAILURE=1
    echo '❌'
    echo "########################"
    echo "$OUTPUT"
    echo "########################"
  fi
done

kill $RENDERER_PID
exit $HAS_FAILURE

