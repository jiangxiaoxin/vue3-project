-- 学校管理系统：班级 / 老师 / 学生 / 家长 / 课程
-- 用途：粘贴到 /er-diagram 页面左侧绘制示例 ER 图

CREATE TABLE `class` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '班级ID',
  `name` varchar(32) NOT NULL COMMENT '班级名称，如 三年级一班',
  `grade` tinyint NOT NULL COMMENT '年级，1-6',
  `head_teacher_id` bigint DEFAULT NULL COMMENT '班主任，引用 teacher.id',
  `classroom` varchar(32) DEFAULT NULL COMMENT '固定教室，如 A栋301',
  `capacity` smallint NOT NULL DEFAULT '45' COMMENT '班级容量',
  `enrolled_count` smallint NOT NULL DEFAULT '0' COMMENT '当前在读人数',
  `status` enum('active','graduated','archived') NOT NULL DEFAULT 'active' COMMENT '班级状态',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='班级表';

CREATE TABLE `teacher` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '教师ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `gender` enum('M','F') NOT NULL DEFAULT 'M' COMMENT '性别',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '工作邮箱',
  `title` enum('junior','intermediate','senior','professor') DEFAULT 'junior' COMMENT '职称：初级/中级/高级/正高',
  `hire_date` date NOT NULL COMMENT '入职日期',
  `monthly_salary` decimal(10,2) DEFAULT '0.00' COMMENT '月薪',
  `is_active` tinyint NOT NULL DEFAULT '1' COMMENT '是否在职 1是 0否',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_teacher_phone` (`phone`)
) ENGINE=InnoDB COMMENT='教师表';

CREATE TABLE `student` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '学生ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `gender` enum('M','F') NOT NULL COMMENT '性别',
  `birth_date` date DEFAULT NULL COMMENT '出生日期',
  `class_id` bigint NOT NULL COMMENT '所属班级，一个学生只在一个班',
  `student_no` varchar(20) NOT NULL COMMENT '学号',
  `enroll_date` date NOT NULL COMMENT '入学日期',
  `health_note` varchar(255) DEFAULT NULL COMMENT '健康备注，如过敏史',
  `status` enum('studying','suspended','graduated','withdrawn') NOT NULL DEFAULT 'studying' COMMENT '学籍状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_no` (`student_no`),
  CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`)
) ENGINE=InnoDB COMMENT='学生表';

CREATE TABLE `parent` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '家长ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `occupation` varchar(64) DEFAULT NULL COMMENT '职业',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_parent_phone` (`phone`)
) ENGINE=InnoDB COMMENT='家长表';

CREATE TABLE `student_parent` (
  `student_id` bigint NOT NULL COMMENT '学生ID',
  `parent_id` bigint NOT NULL COMMENT '家长ID',
  `relation` enum('father','mother','guardian') NOT NULL DEFAULT 'guardian' COMMENT '与学生关系',
  `is_primary` tinyint NOT NULL DEFAULT '0' COMMENT '是否第一联系人',
  PRIMARY KEY (`student_id`, `parent_id`),
  CONSTRAINT `fk_sp_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `fk_sp_parent` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`)
) ENGINE=InnoDB COMMENT='学生-家长关联（多对多，家长可有多个孩子）';

CREATE TABLE `course` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  `name` varchar(64) NOT NULL COMMENT '课程名称',
  `credit` decimal(3,1) NOT NULL DEFAULT '1.0' COMMENT '学分',
  `semester` varchar(16) NOT NULL COMMENT '开课学期，如 2026-1',
  `max_enrollment` smallint NOT NULL DEFAULT '50' COMMENT '选课人数上限',
  `description` varchar(255) DEFAULT NULL COMMENT '课程简介',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='课程表';

CREATE TABLE `class_teacher` (
  `class_id` bigint NOT NULL COMMENT '班级ID',
  `teacher_id` bigint NOT NULL COMMENT '教师ID',
  `subject` varchar(64) NOT NULL COMMENT '在该班讲授的课程',
  `start_date` date NOT NULL COMMENT '开始任教日期',
  `end_date` date DEFAULT NULL COMMENT '结束任教日期，NULL 表示仍在任',
  PRIMARY KEY (`class_id`, `teacher_id`, `subject`),
  CONSTRAINT `fk_ct_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`),
  CONSTRAINT `fk_ct_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB COMMENT='班级-教师任教关联（多对多）';

CREATE TABLE `student_course` (
  `student_id` bigint NOT NULL COMMENT '学生ID',
  `course_id` bigint NOT NULL COMMENT '课程ID',
  `enroll_date` date NOT NULL COMMENT '选课日期',
  `score` decimal(5,2) DEFAULT NULL COMMENT '期末成绩，未考为 NULL',
  PRIMARY KEY (`student_id`, `course_id`),
  CONSTRAINT `fk_sc_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `fk_sc_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB COMMENT='学生-课程选课关联（多对多）';
