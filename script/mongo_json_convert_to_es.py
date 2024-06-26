# 为 MongoDB 导出的 json 文件中对象之间添加 ','
# 使成为合法的 json 文件，才能被 ES 导入

input_file = "dataset/es_resume.json"
output_file = "dataset/es_resume_bulk_insert_format.json"

with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
index = 0
for line in lines:
    # 不应该删除头尾的空格，JSON 需要考虑缩进
    # 在每个对象的开头前面加一行索引列
    if line.startswith('{'):
        index_str = '{ "index": {"_index" : "sjj-resume-test-2", "_id": "%s" }}\n' % index
        index += 1
        line = index_str + line
    new_lines.append(line)

with open(output_file, 'w',encoding='utf-8') as f:
    f.write(''.join(new_lines))

print('done')
