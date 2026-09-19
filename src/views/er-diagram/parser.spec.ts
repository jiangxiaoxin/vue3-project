import { describe, expect, it } from 'vitest'
import { parseDdl } from './parser'

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
      CREATE TABLE a ( id INT NOT NULL ); -- 尾注释
    `
    const { tables, errors } = parseDdl(ddl)
    expect(errors).toEqual([])
    expect(tables[0].columns[0]).toMatchObject({ name: 'id', type: 'INT', nullable: false })
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
