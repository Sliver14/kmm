import re

with open('lib/data/scheduleAssets.ts', 'r', encoding='utf-8') as f:
    content = f.read()

statuses = re.findall(r"docStatus:\s*'([^']+)'", content)
for s in sorted(set(statuses)):
    print(f"{s}: {statuses.count(s)}")
