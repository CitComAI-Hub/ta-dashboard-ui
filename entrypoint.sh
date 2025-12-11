#!/bin/sh
cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL}"
};
EOF
exec "$@" 