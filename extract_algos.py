import re
import json

with open("src/data/defaultCourseMaterials.ts", "r", encoding="utf-8") as f:
    content = f.read()

blocks = re.split(r'{\s*"id":', content)
extracted = []

for block in blocks[1:]:
    id_match = re.search(r'^"(.*?)",', block)
    title_match = re.search(r'"title":\s*"(.*?Algorithm.*?)",', block)
    
    # Just grab everything between "bangla_explanation": " and the next field "is_midterm":
    bangla_match = re.search(r'"bangla_explanation":\s*"(.*?)",\s*"is_midterm":', block, re.DOTALL)
    
    if id_match and title_match and bangla_match:
        algo_id = id_match.group(1)
        title = title_match.group(1)
        bangla = bangla_match.group(1)
        extracted.append({
            "id": algo_id,
            "title": title,
            "bangla": bangla.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
        })

with open("scratch_algos.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(extracted)} algorithms.")
