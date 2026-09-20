import { describe, expect, it } from 'vitest'
import { parseCreateTable, parseCreateTablePlain, parseDdl } from './parser'

describe('parseDdl', () => {
  it('解析两张表与表级外键、表注释、字段注释', () => {
    const ddl = `
      CREATE TABLE \`orders\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '订单ID',
        \`user_id\` bigint NOT NULL COMMENT '下单用户',
        PRIMARY KEY (\`id\`),
        KEY \`idx_user\` (\`user_id\`),
        CONSTRAINT \`fk_order_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
    `
    const { tables, errors } = parseDdl(ddl)
    expect(errors).toEqual([])
    expect(tables).toHaveLength(1)
    const t = tables[0]
    expect(t.name).toBe('orders')
    expect(t.comment).toBe('订单表')
    expect(t.columns.map((c) => c.name)).toEqual(['id', 'user_id'])
    expect(t.columns[0]).toMatchObject({ type: 'bigint', nullable: false, isPrimaryKey: true, comment: '订单ID' })
    expect(t.foreignKeys).toEqual([{ column: 'user_id', refTable: 'user', refColumn: 'id' }])
  })

  it('同时解析两张表并建立跨表引用', () => {
    const ddl = `
      CREATE TABLE \`user\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
        \`name\` varchar(32) NOT NULL COMMENT '用户名',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB COMMENT='用户表';

      CREATE TABLE \`orders\` (
        \`id\` bigint NOT NULL COMMENT '订单ID',
        \`user_id\` bigint NOT NULL COMMENT '下单用户',
        \`amount\` decimal(10,2) DEFAULT '0.00' COMMENT '订单金额',
        PRIMARY KEY (\`id\`),
        KEY \`idx_user\` (\`user_id\`),
        CONSTRAINT \`fk_order_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`id\`)
      ) ENGINE=InnoDB COMMENT='订单表';
    `
    const { tables, errors } = parseDdl(ddl)
    expect(errors).toEqual([])
    // 表顺序与 DDL 中出现顺序一致
    expect(tables.map((t) => t.name)).toEqual(['user', 'orders'])

    const [user, orders] = tables
    expect(user.comment).toBe('用户表')
    expect(user.columns.map((c) => c.name)).toEqual(['id', 'name'])
    expect(user.columns[0]).toMatchObject({ type: 'bigint', nullable: false, isPrimaryKey: true })
    expect(user.foreignKeys).toEqual([])

    expect(orders.comment).toBe('订单表')
    expect(orders.columns.map((c) => c.name)).toEqual(['id', 'user_id', 'amount'])
    expect(orders.columns[2]).toMatchObject({ type: 'decimal(10,2)', defaultValue: '0.00' })
    // 跨表外键：orders.user_id 指向 user.id
    expect(orders.foreignKeys).toEqual([{ column: 'user_id', refTable: 'user', refColumn: 'id' }])
  })

  it('字段名与外键列名均去除反引号', () => {
    const { tables } = parseDdl('CREATE TABLE t ( `a` int NULL, FOREIGN KEY (`a`) REFERENCES `b` (`id`) );')
    expect(tables[0].columns[0].name).toBe('a')
    expect(tables[0].columns[0].nullable).toBe(true)
    expect(tables[0].foreignKeys).toEqual([{ column: 'a', refTable: 'b', refColumn: 'id' }] as never)
  })

  it('括号内的逗号不干扰切分（DECIMAL / ENUM）', () => {
    const ddl = `CREATE TABLE m (
      price DECIMAL(10,2) NOT NULL COMMENT '含税价, 单位元',
      status ENUM('paid','unpaid,unknown') DEFAULT 'unpaid',
      PRIMARY KEY (price)
    );`
    const { tables, errors } = parseDdl(ddl)
    expect(errors).toEqual([])
    const [price, status] = tables[0].columns
    expect(price).toMatchObject({ name: 'price', type: 'DECIMAL(10,2)', comment: '含税价, 单位元' })
    expect(status.name).toBe('status')
    expect(status.type).toBe(`ENUM('paid','unpaid,unknown')`)
    expect(tables[0].foreignKeys).toEqual([])
  })

  it('按；拆分多张表', () => {
    /**
     * CREATE TABLE a (
id INT COMMENT '用;分隔'
);
     */
    const ddl = `
CREATE TABLE t (a VARCHAR(10) DEFAULT 'It''s; ok');
`

// const ddl = `
// CREATE TABLE a (
// type ENUM('yes', 'no', '1;2') COMMENT '有一项含;'
// );`

    parseDdl(ddl)
  })

  it('支持列内联 REFERENCES 与列级 PRIMARY KEY', () => {
    const { tables, errors } = parseDdl(
      "CREATE TABLE c ( id INT PRIMARY KEY, uid INT REFERENCES u(id), name VARCHAR(32) COMMENT 'n' )"
    )
    expect(errors).toEqual([])
    expect(tables[0].columns[0].isPrimaryKey).toBe(true)
    expect(tables[0].foreignKeys).toEqual([{ column: 'uid', refTable: 'u', refColumn: 'id' }])
    expect(tables[0].columns[2].comment).toBe('n')
  })

  it('剥离行注释、# 注释与块注释', () => {
    const ddl = `
      -- 建表开始
      # 另一种注释
      /* 块注释
         可以换行 */
      CREATE TABLE a ( id INT NOT NULL, name varchar(50) default 'mike', msg varchar(256) default 'hi, i''m mike' ); -- 尾注释
    `

    // const ddl = `
    // -- 我是一条注释
    // # hkksdflsdf -- 123123
    // CREATE TABLE a ( id INT NOT NULL COMMENT '用户ID');
    // --
    // `

    // const ddl = `
    // -- 我是一条注释
    // # hkksdflsdf -- 123123
    // CREATE TABLE a ( id INT NOT NULL COMMENT '用户ID', /* 这里加注释是没问题的，所以块注释处理要添加空格*/ name varchar(32));
    // --
    // `

    // const ddl = `
    // -- 行注释
    // /* 块注释，但不闭合,解析就会删除全部
    // create table a (id int not null);
    // */ -- 最后还有一行段落
    // `

   

    const { tables, errors } = parseDdl(ddl)
    //@ts-ignore
    tables.forEach(table => {
      console.log(table.name, table.columns);
      
    })
    
    expect(errors).toEqual([])
    expect(tables[0].columns[0]).toMatchObject({ name: 'id', type: 'INT', nullable: false })
  })

  it('测试在根级拆分不同的表,', () => {
     const ddl = `
    create table a (id int not null);
    create table b (id int not null);
    `
    const { tables, errors } = parseDdl(ddl)
    console.log(tables.length);
    console.log(errors.length);
    
    
  })

  it('测试特殊解析', () => {
    // 字符串里的 ; -- # 都不是 SQL 语法：'' 是标准 SQL 的引号转义，\' 是 MySQL 的反斜杠转义
    const ddl = `
CREATE TABLE t (
a INT COMMENT 'It''s ok; -- 不是注释',
);
`
    //  b VARCHAR(20) COMMENT 'It\\'s fine # 也不是注释'
    const { tables, errors } = parseDdl(ddl)
    // expect(errors).toEqual([])
    // expect(tables).toHaveLength(1)
    // expect(tables[0].columns.map((c) => c.name)).toEqual(['a', 'b'])
    // // '' 与 \' 都应被还原成单个 '，且串内的 ; -- # 完整保留
    // expect(tables[0].columns[0].comment).toBe("It's ok; -- 不是注释")
    // expect(tables[0].columns[1].comment).toBe("It's fine # 也不是注释")
  })

  it('注释字符串里的内容不被当作 SQL', () => {
    const { tables, errors } = parseDdl(
      "CREATE TABLE q ( id INT COMMENT '这是 -- 不是注释; 也不是分号' );"
    )
    expect(errors).toEqual([])
    expect(tables[0].columns[0].comment).toBe('这是 -- 不是注释; 也不是分号')
  })

  it('复合主键与复合外键', () => {
    const { tables } = parseDdl(`CREATE TABLE r (
      a INT, b INT, note VARCHAR(10) COMMENT '多余列',
      PRIMARY KEY (a, b),
      FOREIGN KEY (a, b) REFERENCES p (x, y)
    );`)
    expect(tables[0].columns.map((c) => c.isPrimaryKey)).toEqual([true, true, false])
    expect(tables[0].foreignKeys).toEqual([{ column: 'a, b', refTable: 'p', refColumn: 'x, y' }])
  })

  it('坏语句进错误列表，好语句照常解析', () => {
    const ddl = `
      THIS IS NOT SQL;
      CREATE TABLE ok ( id INT );
      CREATE TABLE;
    `
    const { tables, errors } = parseDdl(ddl)
    expect(tables.map((t) => t.name)).toEqual(['ok'])
    expect(errors.length).toBeGreaterThan(0)
  })

  it('跳过非 CREATE TABLE 语句（ALTER/INSERT 等）', () => {
    const ddl = `
      CREATE TABLE a ( id INT );
      ALTER TABLE a ADD COLUMN x INT;
      INSERT INTO a VALUES (1);
      DROP TABLE a;
    `
    const { tables, errors } = parseDdl(ddl)
    expect(tables.map((t) => t.name)).toEqual(['a'])
    expect(errors).toEqual([])
  })

  it('提取 DEFAULT 值：字符串、数字、NULL、函数调用', () => {
    const { tables } = parseDdl(`CREATE TABLE d (
      a VARCHAR(10) DEFAULT 'unpaid',
      b DECIMAL(10,2) DEFAULT '0.00' NOT NULL,
      c INT DEFAULT NULL,
      d TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6),
      e INT
    );`)
    const cols = tables[0].columns
    expect(cols.map((c) => c.defaultValue)).toEqual(['unpaid', '0.00', 'NULL', 'CURRENT_TIMESTAMP(6)', undefined])
  })

  it('空输入得到空结果', () => {
    const { tables, errors } = parseDdl('   \n  ')
    expect(tables).toEqual([])
    expect(errors).toEqual([])
  })
})

describe('parseCreateTablePlain（零正则实现）与 parseCreateTable 结果一致', () => {
  // 两侧跑同一批 DDL，比对表结构输出与错误信息
  const samples: Array<[string, string]> = [
    ['最简建表', 'CREATE TABLE t (id INT)'],
    ['反引号标识符', 'CREATE TABLE `user` (`id` bigint NOT NULL, `name` varchar(32))'],
    ['表注释（单引号）', "CREATE TABLE t (id INT) ENGINE=InnoDB COMMENT='用户表'"],
    ['表注释（双引号）', 'CREATE TABLE t (id INT) ENGINE=InnoDB COMMENT="表 名"'],
    [
      '列注释与默认值',
      "CREATE TABLE t (a VARCHAR(32) NOT NULL COMMENT '名称', b DECIMAL(10,2) DEFAULT '0.00')"
    ],
    ['UNSIGNED 与 ZEROFILL', 'CREATE TABLE t (a INT UNSIGNED NOT NULL, b INT ZEROFILL)'],
    ['显式 NULL', 'CREATE TABLE t (a INT NULL, b INT NOT NULL)'],
    ['列级主键', 'CREATE TABLE t (id INT PRIMARY KEY, name VARCHAR(10))'],
    ['表级复合主键', 'CREATE TABLE t (a INT, b INT, PRIMARY KEY (a, b))'],
    ['表级外键', 'CREATE TABLE t (uid INT, CONSTRAINT fk_t FOREIGN KEY (uid) REFERENCES u (id))'],
    ['复合外键', 'CREATE TABLE t (a INT, b INT, FOREIGN KEY (a, b) REFERENCES p (x, y))'],
    ['外键省略引用列', 'CREATE TABLE t (uid INT, FOREIGN KEY (uid) REFERENCES u)'],
    ['列内联 REFERENCES', 'CREATE TABLE t (uid INT REFERENCES u(id))'],
    ['索引定义跳过', 'CREATE TABLE t (a INT, KEY idx_a (a), UNIQUE KEY uk_a (a), FULLTEXT KEY ft_a (a))'],
    ['CONSTRAINT CHECK 跳过', 'CREATE TABLE t (a INT, CONSTRAINT ck_a CHECK (a > 0))'],
    ['连续逗号', 'CREATE TABLE t (a INT, , b INT)'],
    ['TEMPORARY 与 IF NOT EXISTS', 'CREATE TEMPORARY TABLE IF NOT EXISTS t (id INT)'],
    ['库名前缀表名', 'CREATE TABLE `db`.`t` (id INT)'],
    [
      '跨行与缩进',
      `CREATE TABLE t (
        id INT NOT NULL COMMENT '主键',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB COMMENT='表注释'`
    ],
    [
      '未识别修饰词',
      'CREATE TABLE t (a INT AUTO_INCREMENT, b TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) COLLATE=utf8mb4_bin'
    ],
    ['注释串里的分号', "CREATE TABLE t (a INT COMMENT '用;分隔')"],
    ['外键不完整（报错路径）', 'CREATE TABLE t (a INT, FOREIGN KEY (a) X)'],
    ['括号不匹配（报错路径）', 'CREATE TABLE t (a INT'],
    ['无法解析（报错路径）', 'THIS IS NOT SQL'],
    ['列定义不可理解（报错路径）', 'CREATE TABLE t (bogus)']
  ]

  for (const [name, ddl] of samples) {
    it(name, () => {
      const errorsOfRegex: string[] = []
      const errorsOfPlain: string[] = []
      const byRegex = parseCreateTable(ddl, errorsOfRegex)
      const byPlain = parseCreateTablePlain(ddl, errorsOfPlain)
      expect(byPlain).toEqual(byRegex)
      expect(errorsOfPlain).toEqual(errorsOfRegex)
    })
  }
})
