/** 确定性整数散列，让外键父表分布均匀 */
function mix(x: number): number {
  let h = (x * 2654435761) >>> 0
  h = (((h ^ (h >>> 13)) * 1597334677) >>> 0)
  return (h ^ (h >>> 16)) >>> 0
}

/** 确定性生成压测用 DDL：tableCount 张表 × columnsPerTable 个字段，
 *  除首表外每表带一个指向更早表的外键 */
export function generateDdl(tableCount = 200, columnsPerTable = 20): string {
  const types = ['bigint', 'varchar(64)', 'int', 'decimal(10,2)', "enum('a','b','c')", 'datetime', 'text']
  const pad = (n: number) => String(n).padStart(3, '0')
  const parts: string[] = []
  for (let t = 0; t < tableCount; t++) {
    const cols: string[] = ["`id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键'"]
    // 有外键的表少生成一个普通列，保证总列数恒为 columnsPerTable
    const middleCount = columnsPerTable - (t > 0 ? 2 : 1)
    for (let c = 1; c <= middleCount; c++) {
      const type = types[(t + c) % types.length]
      const nullPart = c % 3 === 0 ? 'NOT NULL' : "DEFAULT '0'"
      cols.push(`\`c_${pad(c)}\` ${type} ${nullPart} COMMENT '字段${c}'`)
    }
    const constraints: string[] = ['PRIMARY KEY (`id`)']
    if (t > 0) {
      const refT = mix(t) % t
      cols.push("`ref_id` bigint NOT NULL COMMENT '关联外键'")
      constraints.push(
        `CONSTRAINT \`fk_t${pad(t)}\` FOREIGN KEY (\`ref_id\`) REFERENCES \`t${pad(refT)}\` (\`id\`)`
      )
    }
    parts.push(
      `CREATE TABLE \`t${pad(t)}\` (\n  ${[...cols, ...constraints].join(',\n  ')}\n) ENGINE=InnoDB COMMENT='压测表${t}';`
    )
  }
  return parts.join('\n\n')
}
