# Security utilities

Server-only security helpers như secret handling, redaction và security headers. Logger foundation
hiện thực hiện redaction cho structured log; các helper security khác chỉ thêm khi có consumer thực tế.
Không đặt secret hoặc private environment variable trong client code.
