import re

# 从代码文件中获取与给定id相对应的代码块
def get_code_block_from_file(file_path, id):
    with open(file_path, 'r') as f:
        code = f.read()
    # 寻找以'# id: <id>'开始，以下一个'# id:'或文件结束为止的代码块
    match = re.search(r'# id: {}\n(.*?)(?=# id:|$)'.format(id), code, flags=re.DOTALL)
    if match:
        return match.group(1).strip()
    else:
        return None
