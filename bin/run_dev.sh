#!/bin/bash

# on_int() {
#     echo "Killing run dev ($dev_pid)."
#     kill -INT $dev_pid
#     exit
# }

# trap "on_int" SIGINT

# npm run dev &
# dev_pid="$!"

# cargo tauri dev

# echo "Done"
parallel -ku ::: "npm run dev" "cargo tauri dev"
echo "done"
