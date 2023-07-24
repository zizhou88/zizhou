import pandas as pd

# id: sub-option-magoldfork
def sub_option_magoldfork(df):
    '''
    判断MA金叉情况
    参数:
    df: 一个包含'close'列的pandas DataFrame，其中'close'列包含了收盘价
    返回:
    一个新的DataFrame，新增一列'gold_cross'，当金叉出现时为True，否则为False
    '''
    # 计算均线
    df['ma5'] = df['close'].rolling(window=5).mean()
    df['ma10'] = df['close'].rolling(window=10).mean()

    # 找到金叉（ma5上穿ma10）
    gold_cross = (df['ma5'].shift(1) < df['ma10'].shift(1)) & (df['ma5'] > df['ma10'])

    # 返回含有金叉信号的DataFrame
    return gold_cross

def sub_option_madeadfork(df):
    """
    判断MA死叉情况
    参数:
    df: 一个包含'close'列的pandas DataFrame，其中'close'列包含了收盘价
    返回:
    一个新的DataFrame，新增一列'dead_cross'，当死叉出现时为True，否则为False
    """
    # 计算均线
    df['ma5'] = df['close'].rolling(window=5).mean()
    df['ma10'] = df['close'].rolling(window=10).mean()

    # 找到死叉（ma5下穿ma10）
    dead_cross = (df['ma5'].shift(1) > df['ma10'].shift(1)) & (df['ma5'] < df['ma10'])

    # 返回含有死叉信号的DataFrame
    return dead_cross