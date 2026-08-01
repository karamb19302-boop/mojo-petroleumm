from pathlib import Path

# Replace AM/PM Select with inline buttons in inspection-form.tsx
p = Path('app/schedule-inspection/inspection-form.tsx')
s = p.read_text()
old_marker = '<Select label="AM/PM"'
old_start = s.find(old_marker)
if old_start != -1:
    end = s.find('/>', old_start)
    if end != -1:
        end += 2
        new = (
            '<div className="ampm" role="group" aria-label="AM or PM">\n'
            '          <button type="button" className={"ampm-btn "+(form.preferredMeridiem===\'AM\'?"active":"\")} onClick={()=>setForm(prev=>({...prev,preferredMeridiem:\'AM\'}))}>AM</button>\n'
            '          <button type="button" className={"ampm-btn "+(form.preferredMeridiem===\'PM\'?"active":"\")} onClick={()=>setForm(prev=>({...prev,preferredMeridiem:\'PM\'}))}>PM</button>\n'
            '        </div>'
        )
        s2 = s[:old_start] + new + s[end:]
        p.write_text(s2)
        print('Replaced Select with AM/PM buttons')
    else:
        print('Could not find end of Select tag')
else:
    print('Select AM/PM not found')

# Update theme.css: ensure .cs-list has list-style:none and add .ampm styles
q = Path('app/theme.css')
css = q.read_text()
if '.custom-select .cs-list' in css and 'list-style' not in css.split('.custom-select .cs-list',1)[1].split('}',1)[0]:
    css = css.replace('.custom-select .cs-list{', '.custom-select .cs-list{list-style:none;margin:0;')
    print('Inserted list-style into .cs-list')
else:
    print('.cs-list already has list-style or not found')

if '.ampm-btn' not in css:
    css += "\n\n/* AM/PM inline toggle styles */\n.ampm{display:flex;gap:8px;align-items:center}\n.ampm-btn{padding:8px 12px;border-radius:999px;border:1px solid rgba(11,31,51,.06);background:#f3f4f5;color:#6b6b6b;cursor:pointer;min-width:46px;text-align:center}\n.ampm-btn.active{background:linear-gradient(90deg,rgba(148,200,70,.18),rgba(239,109,34,.06));color:#24421c;box-shadow:0 8px 20px rgba(148,200,70,.08)}\n.ampm-btn:focus{outline:none;box-shadow:0 0 0 4px rgba(148,200,70,.08)}\n"
    q.write_text(css)
    print('Appended ampm styles')
else:
    print('ampm styles already present')
