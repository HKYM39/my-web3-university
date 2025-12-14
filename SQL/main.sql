
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户自增主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '用户钱包地址（唯一身份标识）',
  nickname VARCHAR(64) DEFAULT NULL COMMENT '用户昵称（通过签名修改）',
  role ENUM('USER','CREATOR','ADMIN') DEFAULT 'USER' COMMENT '用户角色：USER 学习者 / CREATOR 课程作者 / ADMIN 平台管理员',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_wallet (wallet_address),
  INDEX idx_role (role)
) COMMENT='用户基础信息表（钱包即账号）';

CREATE TABLE user_nonces (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '钱包地址',
  nonce VARCHAR(128) NOT NULL COMMENT '登录用随机字符串',
  expired_at TIMESTAMP NOT NULL COMMENT 'nonce 过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY uk_wallet (wallet_address)
) COMMENT='钱包登录 nonce 表（防重放攻击）';


CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '课程自增主键',
  course_uid VARCHAR(64) NOT NULL COMMENT '课程唯一标识（链上 courseId）',
  title VARCHAR(255) NOT NULL COMMENT '课程标题',
  description TEXT COMMENT '课程简介',
  author_wallet VARCHAR(64) NOT NULL COMMENT '课程作者钱包地址',
  price DECIMAL(36,18) NOT NULL COMMENT '课程价格',
  pay_token ENUM('YIDENG','ETH') NOT NULL COMMENT '支付币种',
  status ENUM('DRAFT','PENDING','PUBLISHED','REJECTED') DEFAULT 'DRAFT' COMMENT '课程状态：草稿/审核中/已发布/驳回',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_course_uid (course_uid),
  INDEX idx_author (author_wallet),
  INDEX idx_status (status)
) COMMENT='课程基础信息表';

CREATE TABLE course_contents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  course_id BIGINT NOT NULL COMMENT '课程ID（关联 courses.id）',
  title VARCHAR(255) COMMENT '章节标题',
  video_url TEXT COMMENT '视频播放地址（CDN）',
  sort_order INT DEFAULT 0 COMMENT '章节顺序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (course_id) REFERENCES courses(id)
) COMMENT='课程内容章节表';


CREATE TABLE user_courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '用户钱包地址',
  course_uid VARCHAR(64) NOT NULL COMMENT '课程唯一标识（链上 courseId）',
  nft_token_id VARCHAR(128) NOT NULL COMMENT '课程 NFT TokenId',
  tx_hash VARCHAR(128) COMMENT '购买课程交易 Hash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '购买时间',
  UNIQUE KEY uk_user_course (wallet_address, course_uid),
  INDEX idx_wallet (wallet_address),
  INDEX idx_course (course_uid)
) COMMENT='用户课程购买记录表（NFT 索引）';


CREATE TABLE learning_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '用户钱包地址',
  course_uid VARCHAR(64) NOT NULL COMMENT '课程唯一标识',
  progress DECIMAL(5,2) DEFAULT 0 COMMENT '学习进度百分比（0-100）',
  last_watch_at TIMESTAMP COMMENT '最后一次观看时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_progress (wallet_address, course_uid)
) COMMENT='用户课程学习进度表';


CREATE TABLE reward_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '用户钱包地址',
  course_uid VARCHAR(64) COMMENT '关联课程（课程奖励）',
  reward_amount DECIMAL(36,18) COMMENT '奖励数量',
  reward_type ENUM('COURSE','DAILY') COMMENT '奖励类型：课程完成 / 每日学习',
  tx_hash VARCHAR(128) COMMENT '奖励发放交易 Hash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_wallet (wallet_address)
) COMMENT='学习挖矿奖励记录表';


CREATE TABLE income_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  course_uid VARCHAR(64) COMMENT '课程唯一标识',
  author_wallet VARCHAR(64) COMMENT '作者钱包地址',
  amount DECIMAL(36,18) COMMENT '收入金额',
  token VARCHAR(32) COMMENT '收入币种',
  tx_hash VARCHAR(128) COMMENT '链上交易 Hash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_author (author_wallet)
) COMMENT='课程收益记录表';


CREATE TABLE aave_positions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  wallet_address VARCHAR(64) NOT NULL COMMENT '用户钱包地址',
  asset VARCHAR(32) COMMENT '质押资产类型（ETH / USDT）',
  amount DECIMAL(36,18) COMMENT '质押数量',
  a_token_balance DECIMAL(36,18) COMMENT 'aToken 数量',
  apy DECIMAL(8,4) COMMENT '当前年化收益率',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='AAVE 质押仓位记录表';


CREATE TABLE admin_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  admin_wallet VARCHAR(64) COMMENT '管理员钱包地址',
  action VARCHAR(255) COMMENT '操作内容描述',
  target_id VARCHAR(64) COMMENT '操作对象ID（课程/用户等）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间'
) COMMENT='平台管理员操作日志表';
