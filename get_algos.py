import re
import json

with open("src/data/defaultCourseMaterials.ts", "r", encoding="utf-8") as f:
    text = f.read()

# We look for "Algorithm ...\n```text\n...```"
blocks = re.findall(r'```text\nAlgorithm(.*?)\n```', text, re.DOTALL)
print(f"Found {len(blocks)} algorithm blocks.")

data = []
for i, block in enumerate(blocks):
    data.append(f"--- Algo {i+1} ---\nAlgorithm{block}")

with open("scratch/algo_blocks.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(data))
