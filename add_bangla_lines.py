import re

with open("src/data/defaultCourseMaterials.ts", "r", encoding="utf-8") as f:
    text = f.read()

def translate_line(line):
    original = line
    line = line.strip()
    if not line: return ""
    
    comment = ""
    brackets = re.findall(r'\[(.*?)\]', line)
    for b in brackets:
        if any(c.islower() for c in b) or "End of" in b:
            c = b.lower()
            if "end of" in c:
                comment += " [লুপ বা শর্তের সমাপ্তি]"
            else:
                comment += " [" + b + "]"
            line = line.replace(f"[{b}]", "")

    trans = line
    
    trans = re.sub(r'Procedure (.*)', r'প্রসিডিওর \1', trans)
    trans = re.sub(r'Algorithm (.*)', r'অ্যালগরিদম \1', trans)
    trans = re.sub(r'Set (.*?) := (.*?)\.', r'\1 এর মান \2 সেট করি।', trans)
    trans = re.sub(r'Set (.*?) := (.*)', r'\1 এর মান \2 সেট করি।', trans)
    trans = re.sub(r'Repeat for (.*?) to (.*?):', r'\1 থেকে \2 পর্যন্ত লুপ চালাই:', trans)
    trans = re.sub(r'Repeat Steps (.*?) while (.*?):', r'যতক্ষণ \2 সত্য, ধাপ \1 পুনরায় চালাই:', trans)
    trans = re.sub(r'Repeat Step (.*?) while (.*?):', r'যতক্ষণ \2 সত্য, ধাপ \1 পুনরায় চালাই:', trans)
    trans = re.sub(r'Repeat while (.*?):', r'যতক্ষণ \1 সত্য থাকে, লুপ চালাই:', trans)
    trans = re.sub(r'If (.*?), then:', r'যদি \1 হয়, তাহলে:', trans)
    trans = re.sub(r'Else If (.*?), then:', r'অথবা যদি \1 হয়, তাহলে:', trans)
    trans = re.sub(r'Else:', r'অন্যথায়:', trans)
    trans = re.sub(r'Write: (.*?)\.', r'\1 আউটপুট করি।', trans)
    trans = re.sub(r'Go to Step (.*?)\.', r'ধাপ \1-এ যাই।', trans)
    trans = re.sub(r'Exit\.', r'অ্যালগরিদম শেষ করি।', trans)
    trans = re.sub(r'Return\.', r'অ্যালগরিদম শেষ করি (রিটার্ন)।', trans)
    trans = re.sub(r'Apply PROCESS to (.*?)\.', r'\1 এর উপর PROCESS প্রয়োগ করি।', trans)
    trans = re.sub(r'Return (.*?)\.', r'\1 রিটার্ন করি।', trans)
    trans = re.sub(r'Interchange (.*?) and (.*?)\.', r'\1 এবং \2 এর স্থান অদলবদল (Swap) করি।', trans)
    trans = re.sub(r'Push (.*?) onto STACK\.', r'\1 কে STACK এ Push করি।', trans)
    trans = re.sub(r'Pop from STACK and add to P (.*?)\.', r'STACK থেকে Pop করে P তে \1 যোগ করি।', trans)
    trans = re.sub(r'Remove the (.*?)\.', r'\1 মুছে ফেলি।', trans)
    trans = re.sub(r'Add (.*?) to P\.', r'P তে \1 যোগ করি।', trans)

    trans = trans.replace('1. ', '১. ').replace('2. ', '২. ').replace('3. ', '৩. ').replace('4. ', '৪. ').replace('5. ', '৫. ').replace('6. ', '৬. ').replace('7. ', '৭. ')

    indent = len(original) - len(original.lstrip())
    return " " * indent + trans.strip() + comment

def process_block(match):
    full_match = match.group(0)
    title = match.group(1)
    exp = match.group(2)
    bangla = match.group(3)
    
    code_match = re.search(r'```text\\n(.*?)\\n```', exp, re.DOTALL)
    if not code_match:
        return full_match
    
    code = code_match.group(1).replace('\\n', '\n')
    
    lines = code.split('\n')
    translated_lines = []
    translated_lines.append("\\n#### ৬. অ্যালগরিদমের লাইন-বাই-লাইন ব্যাখ্যা (Line-by-Line Explanation):")
    translated_lines.append("```text")
    for line in lines:
        t = translate_line(line)
        if t.strip():
            translated_lines.append(t.replace('"', '\\"'))
    translated_lines.append("```")
    
    new_bangla_suffix = "\\n".join(translated_lines)
    
    if "Line-by-Line Explanation" in bangla:
        return full_match
        
    new_bangla = bangla + "\\n\\n" + new_bangla_suffix
    
    exact_bangla_str = '"bangla_explanation": "' + bangla + '"'
    exact_new_bangla_str = '"bangla_explanation": "' + new_bangla + '"'
    replacement = full_match.replace(exact_bangla_str, exact_new_bangla_str)
    
    return replacement

# Updated pattern to catch Algorithm OR Procedure
pattern = r'"title":\s*"((?:Algorithm|Procedure)[^"]+)",(.*?)"explanation_or_solution":\s*"(.*?)",(.*?)"bangla_explanation":\s*"(.*?)",\s*"is_midterm"'

new_text = re.sub(pattern, process_block, text, flags=re.DOTALL)

with open("src/data/defaultCourseMaterials.ts", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Done processing remaining algorithms/procedures.")
