from flask import Flask, render_template, request, jsonify,redirect, url_for
import mysql.connector
import json
import os
import re



app = Flask(__name__)

# 创建数据库连接
# Create a database connection
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='123456',
    database='strategies'
    
)

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



# 定义页面3的路由
@app.route('/generate', methods=['POST'])
def generate():
  return redirect(url_for('page3'))

@app.route('/page3')  
def page3():
  return render_template('templates/page3.html')

#定义了一个路由，函数被调用时，会返回模板页面
cursor = connection.cursor()

@app.route('/', methods=['GET'])#定义了一个路由，函数被调用时，会返回模板页面
def my_page():
    return render_template('main2.html')
#获取所有表格的名称
# Get the names of all tables
@app.route('/tables', methods=['GET'])
def get_tables():
    #查询数据库中所有表格名称，执行sql查询
    cursor.execute("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()")
    tables = cursor.fetchall()
    # 将元组列表转换为字典列表，方便JSON序列化
    # Convert the list of tuples to a list of dictionaries for JSON serialization
    tables = [{'name': name[0]} for name in tables]
    return jsonify(tables)

#创建一个新的Flask路由来处理这种POST请求，这个新的路由应该接受一个表名、一个ID和一个名称，并将它们插入到相应的表中
# Create a new route to handle this POST request
@app.route('/add_to_file', methods=['POST'])
def add_to_file():
    # 获取请求的JSON数据
    # Get the JSON data from the request
    data = request.get_json()
    table_name = data['table_name']
    option_id = data['option_id']
    option_name = data['option_name']

    # 插入新的表格，返回一个JSON响应
    # Insert a new record
    stmt = "INSERT INTO {} (id, name) VALUES (%s, %s)".format(table_name)
    cursor.execute(stmt, (option_id, option_name))
    connection.commit()

    return jsonify({'message': 'Option added successfully!'})

#关于将代码写入新文件的模块
@app.route('/add_to_table', methods=['POST'])
def add_to_table():
    data = request.get_json()
    table_name = data['table_name']
    option_id = data['option_id']
    option_name = data['option_name']

    stmt = "INSERT INTO {} (id, name) VALUES (%s, %s)".format(table_name)
    cursor.execute(stmt, (option_id, option_name))
    connection.commit()

    # 找到对应的代码块并写入新文件
    code_block = get_code_block_from_file('code.py', option_id)
    if code_block is not None:
        with open(f'{table_name}.py', 'a') as f:
            f.write(code_block + '\n\n')

    return jsonify({'message': 'Option added successfully!'})


@app.route('/register', methods=['GET','POST'])
def register():
  # 获取策略名称
   # Get the strategy name
  print(request.url)
  data = request.get_json() 
  strategy_name = data['strategy_name']
  
  cursor = connection.cursor()

  # 创建表的SQL语句
  # Create the table SQL statement
  sql = "CREATE TABLE %s (id VARCHAR(255), name VARCHAR(255))" % strategy_name

  cursor.execute(sql)

  connection.commit()

  cursor.close()

  return jsonify({'message': 'Strategy created successfully!'})

if __name__ == '__main__':
    app.run()

