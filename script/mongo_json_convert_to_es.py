# 为 MongoDB 导出的 json 文件中对象之间添加 ','
# 使成为合法的 json 文件，才能被 ES 导入

input_file = "dataset/resume.json"
output_file = "dataset/es_resume.json"

with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # line = line.strip() # 不应该删除头尾的空格，JSON 需要考虑缩进
    if line.startswith('}'):
        line = line + ','
    new_lines.append(line)

with open(output_file, 'w',encoding='utf-8') as f:
    f.write(''.join(new_lines))

print('done')
