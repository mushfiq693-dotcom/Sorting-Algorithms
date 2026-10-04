import re

with open("src/data/defaultCourseMaterials.ts", "r", encoding="utf-8") as f:
    text = f.read()

blocks = re.findall(r'"title":\s*"(Algorithm[^"]+)",.*?"explanation_or_solution":\s*"(.*?)",\s*"bangla_explanation":\s*"(.*?)",', text, re.DOTALL)

for title, exp, bangla in blocks:
    code_match = re.search(r'```text\\n(.*?)\\n```', exp, re.DOTALL)
    if code_match:
        code = code_match.group(1).replace('\\n', '\n')
        print(f"=== {title} ===")
        print(code)
