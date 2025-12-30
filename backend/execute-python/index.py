import json
import sys
from io import StringIO
import traceback
import re
import random

def handler(event: dict, context) -> dict:
    """
    Симулирует выполнение Python кода для обучающих целей
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        code = body.get('code', '')
        
        if not code:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Код не предоставлен'}),
                'isBase64Encoded': False
            }
        
        result = simulate_python_code(code)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Некорректный JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Внутренняя ошибка: {str(e)}'}),
            'isBase64Encoded': False
        }


def simulate_python_code(code: str) -> dict:
    """
    Симулирует выполнение кода для обучающих примеров со словарями
    """
    result = {
        'success': True,
        'output': '',
        'error': None
    }
    
    try:
        if 'import random' not in code and 'randint' in code:
            result['success'] = False
            result['error'] = "NameError: name 'random' is not defined"
            return result
        
        dict_pattern = r'my_dict\s*=\s*\{\}'
        if re.search(dict_pattern, code):
            my_dict = {}
            
            range_match = re.search(r'range\((\d+)\)', code)
            num_elements = int(range_match.group(1)) if range_match else 5
            
            randint_match = re.search(r'randint\((\d+),\s*(\d+)\)', code)
            if randint_match:
                min_val = int(randint_match.group(1))
                max_val = int(randint_match.group(2))
            else:
                min_val, max_val = 1, 100
            
            key_pattern = re.search(r'["\'](\w+)_\{i\}["\']', code)
            key_prefix = key_pattern.group(1) if key_pattern else 'ключ'
            
            for i in range(num_elements):
                my_dict[f"{key_prefix}_{i}"] = random.randint(min_val, max_val)
            
            if 'sorted' in code and 'key=lambda' in code:
                if 'reverse=True' in code:
                    sorted_dict = dict(sorted(my_dict.items(), key=lambda x: x[1], reverse=True))
                else:
                    sorted_dict = dict(sorted(my_dict.items(), key=lambda x: x[1]))
                result['output'] = str(sorted_dict)
            else:
                result['output'] = str(my_dict)
        
        elif 'print(' in code:
            print_match = re.search(r'print\(["\'](.+?)["\']\)', code)
            if print_match:
                result['output'] = print_match.group(1)
            else:
                simple_dict_match = re.search(r'\{[^}]+\}', code)
                if simple_dict_match:
                    result['output'] = simple_dict_match.group(0)
                else:
                    result['output'] = 'Выполнено успешно'
        else:
            result['output'] = 'Код выполнен без вывода'
            
    except Exception as e:
        result['success'] = False
        result['error'] = f"{type(e).__name__}: {str(e)}"
        result['traceback'] = traceback.format_exc()
    
    return result