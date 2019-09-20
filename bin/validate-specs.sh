#!/usr/bin/env bash
HAS_FAILURE=0

COMMAND="spectral lint -v"

DOCS=$1

if [[ -z "$DOCS" ]]; then
  DOCS=$(find definitions -name '*.yml' -not -path "*definitions/common*")
fi

for i in $DOCS; do
  echo -n "$i "

  OUTPUT=$($COMMAND $i 2>&1)
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

exit $HAS_FAILURE
